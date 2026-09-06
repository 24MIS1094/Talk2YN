import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, MapPin, Trash2, Bookmark } from "lucide-react";
import { getSavedJobs, logoFor, removeSavedJob, timeAgo, type Job } from "@/lib/jobs";

export const Route = createFileRoute("/jobs/saved")({
  head: () => ({
    meta: [
      { title: "Saved jobs — AI Job Explorer | Talk2YN" },
      { name: "description", content: "All the jobs you bookmarked in the Talk2YN AI Job Explorer." },
      { property: "og:title", content: "Saved jobs — AI Job Explorer | Talk2YN" },
      { property: "og:description", content: "Your bookmarked roles, ready to apply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedJobsPage,
});

function SavedJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    setJobs(getSavedJobs());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 animate-drift"
          style={{ background: "radial-gradient(circle, #e84393 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-8 md:py-12">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> Back to jobs
        </Link>

        <header className="mt-6 mb-7">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Saved jobs</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {jobs.length} bookmarked {jobs.length === 1 ? "role" : "roles"}.
          </p>
        </header>

        <div className="grid gap-3">
          {jobs.map((job) => {
            const logo = logoFor(job);
            return (
              <article key={job.id} className="rounded-2xl glass px-4 py-4 flex gap-3 items-start">
                {logo ? (
                  <img
                    src={logo}
                    alt={`${job.company} logo`}
                    className="size-11 rounded-xl bg-white/95 object-contain p-1.5 shrink-0"
                  />
                ) : (
                  <div className="size-11 rounded-xl bg-white/10 grid place-items-center font-semibold shrink-0">
                    {job.company.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold truncate">{job.title}</h2>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    {job.company} · {job.source} · {timeAgo(job.postedAt)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="size-3.5" /> {job.location}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
                      className="rounded-xl px-4 py-2 text-[11px] uppercase tracking-widest text-white"
                      style={{ background: "var(--gradient-ember)" }}
                    >
                      View details
                    </button>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-xl px-4 py-2 text-[11px] uppercase tracking-widest border border-white/10 hover:border-white/30 text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
                    >
                      Official apply <ExternalLink className="size-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        removeSavedJob(job.id);
                        setJobs(getSavedJobs());
                      }}
                      className="rounded-xl px-4 py-2 text-[11px] uppercase tracking-widest border border-white/10 hover:border-white/30 text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
          {jobs.length === 0 && (
            <div className="text-sm text-muted-foreground py-10 flex items-center gap-2">
              <Bookmark className="size-4" /> Nothing saved yet — bookmark jobs from the explorer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
