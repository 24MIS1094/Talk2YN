import { createFileRoute } from "@tanstack/react-router";
import type { Job } from "@/lib/jobs";

type Raw = Record<string, unknown>;

const clean = (v: unknown, fallback = "") =>
  typeof v === "string" && v.trim() ? v.trim() : typeof v === "number" ? String(v) : fallback;

function modeFrom(location: string, tags: string[], desc: string): Job["workMode"] {
  const t = `${location} ${tags.join(" ")} ${desc.slice(0, 400)}`.toLowerCase();
  if (t.includes("hybrid")) return "Hybrid";
  if (t.includes("remote") || t.includes("anywhere")) return "Remote";
  return "Onsite";
}

function expFrom(title: string, desc: string): string {
  const t = `${title} ${desc}`.toLowerCase();
  const m = t.match(/(\d)\+?\s*[-–to]{0,3}\s*(\d)?\s*years?/);
  if (m) return m[2] ? `${m[1]}-${m[2]} years` : `${m[1]}+ years`;
  if (/intern(ship)?\b/.test(t)) return "Internship";
  if (/(senior|lead|staff|principal)/.test(t)) return "5+ years";
  if (/(junior|entry|fresher|graduate)/.test(t)) return "0-2 years";
  return "Not specified";
}

async function safeJson(url: string, timeoutMs = 9000): Promise<Raw | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "Talk2YN-JobExplorer/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as Raw;
  } catch {
    return null;
  }
}

function matchesQuery(job: Job, role: string, location: string): boolean {
  const q = role.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const hay = `${job.title} ${job.company} ${job.tags.join(" ")} ${job.description.slice(0, 600)}`.toLowerCase();
  const roleOk = !q.length || q.some((w) => hay.includes(w));
  const loc = location.toLowerCase().trim();
  const locOk =
    !loc ||
    loc === "anywhere" ||
    job.workMode === "Remote" ||
    job.location.toLowerCase().includes(loc) ||
    loc.split(/[,\s]+/).some((w) => w.length > 2 && job.location.toLowerCase().includes(w));
  return roleOk && locOk;
}

async function fromRemotive(role: string): Promise<Job[]> {
  const data = await safeJson(
    `https://remotive.com/api/remote-jobs?limit=60&search=${encodeURIComponent(role)}`,
  );
  const jobs = (data?.["jobs"] as Raw[] | undefined) ?? [];
  return jobs.map((j) => {
    const description = clean(j["description"]);
    const tags = Array.isArray(j["tags"]) ? (j["tags"] as string[]).map(String) : [];
    const location = clean(j["candidate_required_location"], "Remote");
    return {
      id: `remotive-${clean(j["id"], Math.random().toString(36).slice(2))}`,
      title: clean(j["title"], "Role"),
      company: clean(j["company_name"], "Company"),
      logo: clean(j["company_logo"]) || undefined,
      location,
      workMode: modeFrom(location, tags, description),
      salary: clean(j["salary"]) || undefined,
      jobType: clean(j["job_type"], "full_time").replace(/_/g, " "),
      experience: expFrom(clean(j["title"]), description),
      postedAt: clean(j["publication_date"]) || undefined,
      source: "Remotive",
      url: clean(j["url"]),
      description,
      tags,
    } satisfies Job;
  });
}

async function fromJobicy(role: string): Promise<Job[]> {
  const data = await safeJson(
    `https://jobicy.com/api/v2/remote-jobs?count=50&tag=${encodeURIComponent(role)}`,
  );
  const jobs = (data?.["jobs"] as Raw[] | undefined) ?? [];
  return jobs.map((j) => {
    const description = clean(j["jobDescription"] ?? j["jobExcerpt"]);
    const industry = Array.isArray(j["jobIndustry"]) ? (j["jobIndustry"] as string[]) : [];
    const level = Array.isArray(j["jobLevel"]) ? (j["jobLevel"] as string[]).join(", ") : clean(j["jobLevel"]);
    const location = clean(j["jobGeo"], "Remote");
    const min = j["annualSalaryMin"];
    const max = j["annualSalaryMax"];
    const cur = clean(j["salaryCurrency"], "USD");
    return {
      id: `jobicy-${clean(j["id"], Math.random().toString(36).slice(2))}`,
      title: clean(j["jobTitle"], "Role"),
      company: clean(j["companyName"], "Company"),
      logo: clean(j["companyLogo"]) || undefined,
      location,
      workMode: modeFrom(location, industry, description),
      salary: min && max ? `${cur} ${min} – ${max} / yr` : undefined,
      jobType: Array.isArray(j["jobType"]) ? (j["jobType"] as string[]).join(", ") : clean(j["jobType"], "Full-Time"),
      experience: level || expFrom(clean(j["jobTitle"]), description),
      postedAt: clean(j["pubDate"]) || undefined,
      source: "Jobicy",
      url: clean(j["url"]),
      description,
      tags: industry,
    } satisfies Job;
  });
}

async function fromArbeitnow(): Promise<Job[]> {
  const data = await safeJson("https://www.arbeitnow.com/api/job-board-api");
  const jobs = (data?.["data"] as Raw[] | undefined) ?? [];
  return jobs.slice(0, 90).map((j) => {
    const description = clean(j["description"]);
    const tags = Array.isArray(j["tags"]) ? (j["tags"] as string[]).map(String) : [];
    const location = clean(j["location"], "Europe");
    const remote = j["remote"] === true;
    return {
      id: `arbeitnow-${clean(j["slug"], String(Math.random()))}`,
      title: clean(j["title"], "Role"),
      company: clean(j["company_name"], "Company"),
      location,
      workMode: remote ? "Remote" : modeFrom(location, tags, description),
      jobType: Array.isArray(j["job_types"]) && (j["job_types"] as string[]).length
        ? (j["job_types"] as string[]).join(", ")
        : "Full-time",
      experience: expFrom(clean(j["title"]), description),
      postedAt: typeof j["created_at"] === "number" ? new Date((j["created_at"] as number) * 1000).toISOString() : undefined,
      source: "Arbeitnow",
      url: clean(j["url"]),
      description,
      tags,
    } satisfies Job;
  });
}

export const Route = createFileRoute("/api/jobs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const role = (url.searchParams.get("role") ?? "Software Engineer").slice(0, 80);
        const location = (url.searchParams.get("location") ?? "").slice(0, 60);

        const keyword = role.split(/\s+/)[0] ?? role;
        const results = await Promise.all([
          fromRemotive(role),
          fromJobicy(keyword),
          fromArbeitnow(),
        ]);

        const seen = new Set<string>();
        const all = results
          .flat()
          .filter((j) => j.url && j.title)
          .filter((j) => {
            const key = `${j.title.toLowerCase()}|${j.company.toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

        const filtered = all.filter((j) => matchesQuery(j, role, location));
        const jobs = (filtered.length >= 8 ? filtered : all).slice(0, 60);

        return Response.json(
          { jobs, sources: ["Remotive", "Jobicy", "Arbeitnow"], count: jobs.length },
          { headers: { "Cache-Control": "public, max-age=300" } },
        );
      },
    },
  },
});
