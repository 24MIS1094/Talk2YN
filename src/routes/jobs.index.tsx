import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Loader2,
  Building2,
  Clock,
  Briefcase,
  Wallet,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { getActiveId, getResume } from "@/lib/resume-store";
import { emptyResume, type ResumeData } from "@/lib/resume-schema";
import {
  cacheJobs,
  isJobSaved,
  logoFor,
  matchJob,
  suggestQuery,
  timeAgo,
  toggleSaveJob,
  type Job,
} from "@/lib/jobs";

const title = "AI Job Explorer — Jobs matched to your resume | Talk2YN";
const desc =
  "Discover live jobs from multiple platforms, matched to your resume with an AI match score, skill gap analysis and Aaruba's recommendation.";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobsPage,
});

const SORTS = ["Highest match", "Newest", "Highest salary", "Most relevant"] as const;
const MODES = ["All", "Remote", "Hybrid", "Onsite"] as const;

function JobLogo({ job, size = 46 }: { job: Job; size?: number }) {
  const [failed, setFailed] = useState(false);
  const src = logoFor(job);
  if (!src || failed) {
    return (
      <div
        className="shrink-0 grid place-items-center rounded-xl bg-white/10 font-semibold"
        style={{ width: size, height: size, fontSize: size / 2.6 }}
      >
        {job.company.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`${job.company} logo`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-xl bg-white/95 object-contain p-1.5"
      style={{ width: size, height: size }}
    />
  );
}

function JobsPage() {
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeData>(emptyResume);
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<(typeof MODES)[number]>("All");
  const [platform, setPlatform] = useState("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Highest match");
  const [minMatch, setMinMatch] = useState(0);
  const [savedTick, setSavedTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = getActiveId();
    const r = id ? getResume(id) : null;
    const data = r?.data ?? emptyResume;
    setResume(data);
    const q = suggestQuery(data);
    setRole(q.role);
    setLocation(q.location);
    setReady(true);
  }, []);

  const search = async (r: string, l: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/jobs?role=${encodeURIComponent(r)}&location=${encodeURIComponent(l)}`);
      if (!res.ok) throw new Error("Search failed");
      const json = (await res.json()) as { jobs: Job[] };
      setJobs(json.jobs ?? []);
      cacheJobs(json.jobs ?? []);
    } catch {
      setError("Could not load jobs right now. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ready || !role) return;
    void search(role, location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const scored = useMemo(
    () => jobs.map((job) => ({ job, match: matchJob(resume, job) })),
    [jobs, resume],
  );

  const platforms = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.source)))],
    [jobs],
  );

  const visible = useMemo(() => {
    let list = scored.filter(
      ({ job, match }) =>
        (mode === "All" || job.workMode === mode) &&
        (platform === "All" || job.source === platform) &&
        match.score >= minMatch,
    );
    list = [...list];
    if (sort === "Highest match") list.sort((a, b) => b.match.score - a.match.score);
    if (sort === "Newest")
      list.sort(
        (a, b) => new Date(b.job.postedAt ?? 0).getTime() - new Date(a.job.postedAt ?? 0).getTime(),
      );
    if (sort === "Highest salary")
      list.sort((a, b) => (b.job.salary ? 1 : 0) - (a.job.salary ? 1 : 0));
    if (sort === "Most relevant")
      list.sort((a, b) => b.match.matched.length - a.match.matched.length);
    return list;
  }, [scored, mode, platform, minMatch, sort]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 animate-float"
          style={{ background: "radial-gradient(circle, #e84393 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-8 md:py-12">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/result"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> Back to result
          </Link>
          <Link
            to="/jobs/saved"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
          >
            <BookmarkCheck className="size-4" /> Saved jobs
          </Link>
        </div>

        <header className="mt-6 mb-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
            AI Job Explorer
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Jobs made for you.</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            Live roles pulled from multiple job platforms at once, then scored against your resume —
            skills, projects, experience and certifications. No random percentages.
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void search(role, location);
          }}
          className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
        >
          <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role, skill or company…"
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>
          <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
            <MapPin className="size-4 text-muted-foreground" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. India, Remote)"
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl px-6 py-3 text-white text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-ember)" }}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
            <SlidersHorizontal className="size-3.5" /> Filters
          </span>
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-3.5 py-2 text-[11px] transition border ${
                mode === m
                  ? "border-[color:var(--ember)] text-foreground"
                  : "glass text-muted-foreground hover:text-foreground border-white/10"
              }`}
            >
              {m}
            </button>
          ))}
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="glass rounded-full px-3.5 py-2 text-[11px] bg-transparent outline-none border border-white/10"
          >
            {platforms.map((p) => (
              <option key={p} value={p} className="bg-background">
                {p === "All" ? "All platforms" : p}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
            className="glass rounded-full px-3.5 py-2 text-[11px] bg-transparent outline-none border border-white/10"
          >
            {SORTS.map((s) => (
              <option key={s} value={s} className="bg-background">
                {s}
              </option>
            ))}
          </select>
          <label className="glass rounded-full px-3.5 py-2 text-[11px] flex items-center gap-2 border border-white/10">
            Min match
            <input
              type="range"
              min={0}
              max={90}
              step={10}
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-20 accent-[color:var(--ember)]"
            />
            <span className="tabular-nums w-8">{minMatch}%</span>
          </label>
        </div>

        {error && <p className="mt-6 text-sm text-muted-foreground">{error}</p>}

        {loading && (
          <div className="mt-8 grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl glass h-32 animate-pulse opacity-60" />
            ))}
          </div>
        )}

        {!loading && (
          <>
            <p className="mt-6 mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">
              {visible.length} jobs · sourced live from Remotive, Jobicy &amp; Arbeitnow
            </p>
            <div className="grid gap-3">
              {visible.map(({ job, match }) => {
                const saved = isJobSaved(job.id) || savedTick < 0;
                return (
                  <article
                    key={job.id}
                    className="rounded-2xl glass px-4 py-4 hover:border-white/40 transition flex gap-3 items-start"
                  >
                    <JobLogo job={job} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-base font-semibold truncate">{job.title}</h2>
                          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5 truncate">
                            {job.company} · {job.source}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div
                            className="text-lg font-bold tabular-nums"
                            style={{ color: "var(--ember)" }}
                          >
                            {match.score}%
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            match
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5" /> {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="size-3.5" /> {job.jobType} · {job.workMode}
                        </span>
                        {job.experience && (
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="size-3.5" /> {job.experience}
                          </span>
                        )}
                        {job.salary && (
                          <span className="inline-flex items-center gap-1">
                            <Wallet className="size-3.5" /> {job.salary}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" /> {timeAgo(job.postedAt)}
                        </span>
                      </div>

                      {match.missing.length > 0 && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          Missing: {match.missing.slice(0, 5).join(", ")}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
                          className="rounded-xl px-4 py-2 text-[11px] uppercase tracking-widest text-white"
                          style={{ background: "var(--gradient-ember)" }}
                        >
                          View details
                        </button>
                        <button
                          onClick={() => {
                            toggleSaveJob(job);
                            setSavedTick((t) => t + 1);
                          }}
                          className="rounded-xl px-4 py-2 text-[11px] uppercase tracking-widest border border-white/10 hover:border-white/30 text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
                        >
                          {saved ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
                          {saved ? "Saved" : "Save job"}
                        </button>
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="rounded-xl px-4 py-2 text-[11px] uppercase tracking-widest border border-white/10 hover:border-white/30 text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
                        >
                          Official apply <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
              {visible.length === 0 && (
                <div className="text-sm text-muted-foreground py-10 flex items-center gap-2">
                  <Building2 className="size-4" /> No jobs matched these filters. Try a broader role or
                  lower the minimum match.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
