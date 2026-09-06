import type { ResumeData } from "./resume-schema";

export type Job = {
  id: string;
  title: string;
  company: string;
  companyDomain?: string;
  logo?: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "Onsite";
  salary?: string;
  jobType: string;
  experience?: string;
  postedAt?: string;
  source: string;
  url: string;
  description: string;
  tags: string[];
};

export type JobMatch = {
  score: number;
  matched: string[];
  missing: string[];
  reasons: { ok: boolean; text: string }[];
  learnWeeks: number;
  recommendation: string;
};

/* ------------------------------ skill vocab ------------------------------ */

export const SKILL_VOCAB = [
  "javascript","typescript","react","next.js","angular","vue","svelte","node.js","express",
  "java","spring boot","kotlin","python","django","flask","fastapi","go","rust","c++","c#",
  ".net","php","laravel","ruby","rails","swift","flutter","react native","android","ios",
  "html","css","tailwind","sass","redux","graphql","rest api","microservices",
  "sql","postgresql","mysql","mongodb","redis","elasticsearch","kafka","rabbitmq",
  "aws","azure","gcp","docker","kubernetes","terraform","jenkins","ci/cd","linux","git",
  "machine learning","deep learning","nlp","tensorflow","pytorch","pandas","numpy",
  "data analysis","power bi","tableau","excel","spark","hadoop","airflow",
  "testing","jest","cypress","selenium","playwright","agile","scrum","jira",
  "figma","ui/ux","seo","salesforce","sap","servicenow","cybersecurity","devops","dsa",
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#./ ]/g, "").trim();

function resumeSkillSet(resume: ResumeData): Set<string> {
  const set = new Set<string>();
  const push = (v?: string) => {
    if (v) set.add(norm(v));
  };
  resume.skills.technical.forEach(push);
  resume.skills.tools.forEach(push);
  resume.skills.languages.forEach(push);
  resume.projects.forEach((p) => p.tech?.forEach(push));
  return set;
}

function resumeText(resume: ResumeData): string {
  return [
    resume.summary ?? "",
    resume.personalInfo.headline ?? "",
    ...resume.skills.technical,
    ...resume.skills.tools,
    ...resume.projects.map((p) => `${p.name} ${p.description ?? ""} ${(p.tech ?? []).join(" ")} ${(p.bullets ?? []).join(" ")}`),
    ...resume.experience.map((e) => `${e.role} ${e.company} ${e.bullets.join(" ")}`),
    ...resume.education.map((e) => `${e.degree ?? ""} ${e.field ?? ""} ${e.institution}`),
    ...resume.certifications.map((c) => `${c.name} ${c.issuer ?? ""}`),
    ...resume.achievements,
  ]
    .join(" ")
    .toLowerCase();
}

export function extractJobSkills(job: Job): string[] {
  const text = `${job.title} ${job.tags.join(" ")} ${job.description}`.toLowerCase();
  const found = SKILL_VOCAB.filter((s) => text.includes(s));
  const fromTags = job.tags.map((t) => t.toLowerCase()).filter((t) => t.length > 1 && t.length < 24);
  return Array.from(new Set([...found, ...fromTags])).slice(0, 14);
}

/* ----------------------------- match scoring ----------------------------- */

export function matchJob(resume: ResumeData, job: Job): JobMatch {
  const required = extractJobSkills(job);
  const skills = resumeSkillSet(resume);
  const text = resumeText(resume);

  const has = (s: string) => {
    const n = norm(s);
    if (!n) return false;
    if (skills.has(n)) return true;
    for (const k of skills) if (k.includes(n) || n.includes(k)) return true;
    return text.includes(n);
  };

  const matched = required.filter(has);
  const missing = required.filter((s) => !matched.includes(s));

  const skillScore = required.length ? (matched.length / required.length) * 55 : 30;

  const titleWords = job.title.toLowerCase().split(/[^a-z+#.]+/).filter((w) => w.length > 3);
  const titleHits = titleWords.filter((w) => text.includes(w)).length;
  const titleScore = titleWords.length ? Math.min(12, (titleHits / titleWords.length) * 12) : 6;

  const projectScore = Math.min(12, resume.projects.length * 4);
  const expScore = Math.min(12, resume.experience.length * 6);
  const certScore = Math.min(5, resume.certifications.length * 2.5);
  const eduScore = resume.education.length ? 4 : 0;

  const score = Math.round(
    Math.max(12, Math.min(99, skillScore + titleScore + projectScore + expScore + certScore + eduScore)),
  );

  const reasons: { ok: boolean; text: string }[] = [];
  matched.slice(0, 4).forEach((m) => reasons.push({ ok: true, text: `Strong ${m}` }));
  if (resume.projects.length >= 2) reasons.push({ ok: true, text: "Good project portfolio" });
  if (resume.experience.length) reasons.push({ ok: true, text: "Relevant work experience" });
  missing.slice(0, 4).forEach((m) => reasons.push({ ok: false, text: `Missing ${m}` }));
  if (!resume.certifications.length) reasons.push({ ok: false, text: "No certifications listed" });

  const learnWeeks = Math.min(24, Math.max(0, missing.length * 2));

  const strengths = matched.slice(0, 3).join(", ") || "your overall profile";
  const gaps = missing.slice(0, 3).join(", ");
  const recommendation = gaps
    ? `This role matches your ${strengths}. Learning ${gaps} would significantly improve your chances — roughly ${learnWeeks} weeks of focused study.`
    : `This role lines up closely with your ${strengths}. You meet the listed requirements — apply and highlight your projects.`;

  return { score, matched, missing, reasons, learnWeeks, recommendation };
}

/* ---------------------------- query from resume --------------------------- */

export function suggestQuery(resume: ResumeData): { role: string; location: string } {
  const role =
    resume.personalInfo.headline?.trim() ||
    resume.experience[0]?.role?.trim() ||
    (resume.skills.technical[0] ? `${resume.skills.technical[0]} Developer` : "Software Engineer");
  const location = resume.personalInfo.location?.trim() || "India";
  return { role, location };
}

/* -------------------------- local cache + bookmarks ------------------------ */

const CACHE_KEY = "t2yn.jobs.cache.v1";
const SAVED_KEY = "t2yn.jobs.saved.v1";

const browser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!browser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function cacheJobs(jobs: Job[]) {
  if (!browser()) return;
  const map = read<Record<string, Job>>(CACHE_KEY, {});
  jobs.forEach((j) => {
    map[j.id] = j;
  });
  const entries = Object.entries(map).slice(-400);
  localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
}

export function getCachedJob(id: string): Job | null {
  return read<Record<string, Job>>(CACHE_KEY, {})[id] ?? null;
}

export function getSavedJobs(): Job[] {
  return read<Job[]>(SAVED_KEY, []);
}

export function isJobSaved(id: string): boolean {
  return getSavedJobs().some((j) => j.id === id);
}

export function toggleSaveJob(job: Job): boolean {
  if (!browser()) return false;
  const list = getSavedJobs();
  const exists = list.some((j) => j.id === job.id);
  const next = exists ? list.filter((j) => j.id !== job.id) : [job, ...list];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next.slice(0, 200)));
  return !exists;
}

export function removeSavedJob(id: string) {
  if (!browser()) return;
  localStorage.setItem(SAVED_KEY, JSON.stringify(getSavedJobs().filter((j) => j.id !== id)));
}

/* ------------------------------- utilities ------------------------------- */

export function logoFor(job: Job, size = 128): string | undefined {
  if (job.logo) return job.logo;
  if (job.companyDomain) return `https://www.google.com/s2/favicons?domain=${job.companyDomain}&sz=${size}`;
  return undefined;
}

export function timeAgo(iso?: string): string {
  if (!iso) return "Recently";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "Recently";
  const d = Math.floor((Date.now() - t) / 86400000);
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d} days ago`;
  return `${Math.floor(d / 30)} mo ago`;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|li|h[1-6]|br)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sectionsFromDescription(desc: string) {
  const text = stripHtml(desc);
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const pick = (keys: string[]) => {
    const out: string[] = [];
    let on = false;
    for (const line of lines) {
      const low = line.toLowerCase();
      const isHeading = line.length < 80 && /[:：]?$/.test(line);
      if (isHeading && keys.some((k) => low.includes(k))) {
        on = true;
        continue;
      }
      if (on) {
        if (isHeading && line.length < 60 && !/^[-•*]/.test(line) && out.length) break;
        out.push(line.replace(/^[-•*]\s*/, ""));
        if (out.length >= 8) break;
      }
    }
    return out;
  };
  return {
    responsibilities: pick(["responsibilit", "what you", "you will", "role"]),
    requirements: pick(["requirement", "qualification", "you have", "must have", "skills"]),
    preferred: pick(["preferred", "nice to have", "bonus", "plus"]),
  };
}
