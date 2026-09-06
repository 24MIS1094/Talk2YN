import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Briefcase,
  Wallet,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { getActiveId, getResume } from "@/lib/resume-store";
import { emptyResume, type ResumeData } from "@/lib/resume-schema";
import {
  getCachedJob,
  isJobSaved,
  logoFor,
  matchJob,
  sectionsFromDescription,
  stripHtml,
  timeAgo,
  toggleSaveJob,
  type Job,
} from "@/lib/jobs";

export const Route = createFileRoute("/jobs/$jobId")({
  head: () => ({
    meta: [
      { title: "Job details — AI Job Explorer | Talk2YN" },
      {
        name: "description",
        content:
          "Full job description, required skills, your AI match score, skill gaps and Aaruba's recommendation for this role.",
      },
      { property: "og:title", content: "Job details — AI Job Explorer | Talk2YN" },
      {
        property: "og:description",
        content: "See how well this job matches your resume and what skills you still need.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobDetailPage,
});

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [resume, setResume] = useState<ResumeData>(emptyResume);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setJob(getCachedJob(jobId));
    setSaved(isJobSaved(jobId));
    const id = getActiveId();
    const r = id ? getResume(id) : null;
    if (r) setResume(r.data);
    setLoaded(true);
  }, [jobId]);

  const match = useMemo(() => (job ? matchJob(resume, job) : null), [job, resume]);
  const sections = useMemo(() => (job ? sectionsFromDescription(job.description) : null), [job]);

  if (loaded && !job) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">This job is no longer loaded</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Job listings are fetched live. Head back and search again.
          </p>
          <Link
            to="/jobs"
            className="mt-5 inline-block rounded-xl px-5 py-3 text-sm text-white"
            style={{ background: "var(--gradient-ember)" }}
          >
            Back to AI Job Explorer
          </Link>
        </div>
      </div>
    );
  }

  if (!job || !match || !sections) return null;

  const logo = logoFor(job);
  const text = stripHtml(job.description);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-8 md:py-12">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> Back to jobs
        </Link>

        <header className="mt-6 flex gap-4 items-start">
          {logo ? (
            <img
              src={logo}
              alt={`${job.company} logo`}
              className="size-16 rounded-2xl bg-white/95 object-contain p-2 shrink-0"
            />
          ) : (
            <div className="size-16 rounded-2xl bg-white/10 grid place-items-center text-2xl font-semibold shrink-0">
              {job.company.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">{job.title}</h1>
            <div className="mt-1 text-sm text-muted-foreground">
              {job.company} · via {job.source}
            </div>
          </div>
        </header>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" /> {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="size-4" /> {job.jobType} · {job.workMode}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="size-4" /> {job.experience ?? "Not specified"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-4" /> {job.salary ?? "Not disclosed"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" /> {timeAgo(job.postedAt)}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-xl px-5 py-3 text-sm text-white inline-flex items-center gap-2"
            style={{ background: "var(--gradient-ember)" }}
          >
            Official apply <ExternalLink className="size-4" />
          </a>
          <button
            onClick={() => setSaved(toggleSaveJob(job))}
            className="rounded-xl px-5 py-3 text-sm border border-white/10 hover:border-white/30 text-muted-foreground hover:text-foreground transition inline-flex items-center gap-2"
          >
            {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {saved ? "Saved" : "Save job"}
          </button>
        </div>

        {/* Match */}
        <section className="mt-8 rounded-2xl glass p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Your AI match score
              </div>
              <div className="mt-1 text-4xl font-bold tabular-nums" style={{ color: "var(--ember)" }}>
                {match.score}%
              </div>
            </div>
            <Sparkles className="size-8 text-[color:var(--ember)] opacity-70" />
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${match.score}%`, background: "var(--gradient-ember)" }}
            />
          </div>
          <ul className="mt-4 grid sm:grid-cols-2 gap-1.5">
            {match.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                {r.ok ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="size-4 shrink-0 text-rose-400" />
                )}
                <span className={r.ok ? "" : "text-muted-foreground"}>{r.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Skill gap */}
        <section className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl glass p-5">
            <h2 className="text-sm font-semibold">Skills you already have</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {match.matched.length ? (
                match.matched.map((s) => (
                  <span key={s} className="rounded-full border border-emerald-400/40 px-3 py-1.5 text-[11px]">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  Add more skills to your resume to see matches.
                </span>
              )}
            </div>
          </div>
          <div className="rounded-2xl glass p-5">
            <h2 className="text-sm font-semibold">Missing skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {match.missing.length ? (
                match.missing.map((s) => (
                  <span key={s} className="rounded-full border border-rose-400/40 px-3 py-1.5 text-[11px]">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Nothing major missing. Apply now.</span>
              )}
            </div>
            {match.learnWeeks > 0 && (
              <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                Estimated learning time · {match.learnWeeks} weeks
              </p>
            )}
          </div>
        </section>

        {/* Aaruba recommendation */}
        <section className="mt-4 rounded-2xl glass p-5">
          <h2 className="text-sm font-semibold">Aaruba's recommendation</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{match.recommendation}</p>
        </section>

        {/* Description blocks */}
        {sections.responsibilities.length > 0 && (
          <Block title="Responsibilities" items={sections.responsibilities} />
        )}
        {sections.requirements.length > 0 && (
          <Block title="Required skills & qualifications" items={sections.requirements} />
        )}
        {sections.preferred.length > 0 && <Block title="Preferred skills" items={sections.preferred} />}

        <section className="mt-4 rounded-2xl glass p-5">
          <h2 className="text-sm font-semibold">Full job description</h2>
          <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {text || "No description provided by the source platform."}
          </p>
        </section>

        {job.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.slice(0, 16).map((t) => (
              <span key={t} className="rounded-full glass px-3 py-1.5 text-[11px] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}

        <a
          href={job.url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 w-full rounded-2xl px-5 py-4 text-white text-sm font-medium inline-flex items-center justify-center gap-2"
          style={{ background: "var(--gradient-ember)" }}
        >
          Apply on {job.source} <ExternalLink className="size-4" />
        </a>
      </div>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-4 rounded-2xl glass p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-muted-foreground flex gap-2">
            <span className="text-[color:var(--ember)]">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
