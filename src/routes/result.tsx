import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Gauge,
  LayoutTemplate,
  PencilLine,
  LayoutDashboard,
  RotateCcw,
  Sparkles,
  Briefcase,
  Building2,
  LifeBuoy,
} from "lucide-react";
import { getActiveId, getResume, upsertResume } from "@/lib/resume-store";
import { emptyResume, estimateCompleteness, type ResumeData } from "@/lib/resume-schema";
import { scoreResume } from "@/lib/ats-engine";
import { DownloadMenu } from "@/components/resume/DownloadMenu";
import type { TemplateId } from "@/components/resume/ResumeRender";


const title = "Your Result — Talk2YN";
const desc =
  "See your ATS score, analyse your resume, browse resume formats and explore top Indian and global companies.";

export const Route = createFileRoute("/result")({
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
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateId>("modern");

  useEffect(() => {
    const id = getActiveId();
    if (!id) return;
    const r = getResume(id);
    if (r) {
      setResumeId(id);
      setData(r.data);
      setTemplate((r.templateId as TemplateId) ?? "modern");
    }

  }, []);

  const atsScore = useMemo(() => scoreResume(data).overall, [data]);
  const completeness = useMemo(() => estimateCompleteness(data), [data]);
  const name = data.personalInfo.fullName?.trim();

  const goAnalyse = () => {
    if (resumeId) {
      const stored = getResume(resumeId);
      if (stored) {
        stored.analysis = undefined;
        stored.data = data;
        upsertResume(stored);
      }
    }
    navigate({ to: "/analysis" });
  };

  const handleScratch = () => {
    if (!window.confirm("Clear your chat and start over from scratch?")) return;
    if (resumeId) {
      const r = getResume(resumeId);
      if (r) {
        r.messages = [];
        r.data = emptyResume;
        r.analysis = undefined;
        r.name = "Untitled Resume";
        upsertResume(r);
      }
    }
    navigate({ to: "/build" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-50 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-40 animate-float"
          style={{ background: "radial-gradient(circle, #e84393 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-8 md:py-12">
        <Link
          to="/build"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> Back to chat
        </Link>

        <header className="mt-6 mb-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Your next step
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {name ? `Nice work, ${name.split(" ")[0]}.` : "Here's your result."}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            Everything Aaruba can do with your resume lives here — analyse it, view formats, or
            explore companies you can target.
          </p>
        </header>

        <button
          onClick={goAnalyse}
          className="w-full rounded-2xl px-5 py-5 text-white flex items-center justify-between gap-4 hover:scale-[1.005] active:scale-[0.995] transition shadow-[0_20px_55px_-20px_rgba(255,107,53,0.9)]"
          style={{ background: "var(--gradient-ember)" }}
        >
          <span className="flex items-center gap-3 min-w-0 text-left">
            <Gauge className="size-6 shrink-0" />
            <span className="min-w-0">
              <span className="block text-base font-semibold">Analyse my resume</span>
              <span className="block text-[10px] uppercase tracking-widest opacity-80">
                ATS score, gaps &amp; improvements · {completeness}% complete
              </span>
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-white/20 px-4 py-1.5 text-lg font-bold tabular-nums">
            {atsScore}
          </span>
        </button>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/jobs"
            className="rounded-2xl glass px-4 py-5 flex flex-col gap-2 hover:border-white/40 transition"
          >
            <Briefcase className="size-5 text-[color:var(--ember)]" />
            <span className="text-sm font-medium">AI Job Explorer</span>
            <span className="text-[11px] text-muted-foreground">
              Live jobs from multiple platforms, scored against your resume
            </span>
          </Link>
          <Link
            to="/companies"
            className="rounded-2xl glass px-4 py-5 flex flex-col gap-2 hover:border-white/40 transition"
          >
            <Building2 className="size-5 text-[color:var(--violet)]" />
            <span className="text-sm font-medium">Company Explorer</span>
            <span className="text-[11px] text-muted-foreground">
              47 Indian &amp; global employers with match scores
            </span>
          </Link>
        </div>

        <div className="mt-3 rounded-2xl glass px-4 py-4 flex items-center justify-between gap-3">
          <span className="min-w-0">
            <span className="block text-sm font-medium">Download your resume</span>
            <span className="block text-[11px] text-muted-foreground">Choose PDF or Word document</span>
          </span>
          <DownloadMenu data={data} template={template} />
        </div>







        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/templates"
            className="rounded-2xl glass px-4 py-5 flex flex-col gap-2 hover:border-white/40 transition"
          >
            <LayoutTemplate className="size-5 text-[color:var(--ember)]" />
            <span className="text-sm font-medium">Resume formats</span>
            <span className="text-[11px] text-muted-foreground">12 professional layouts</span>
          </Link>
          <Link
            to="/editor"
            className="rounded-2xl glass px-4 py-5 flex flex-col gap-2 hover:border-white/40 transition"
          >
            <PencilLine className="size-5 text-[color:var(--violet)]" />
            <span className="text-sm font-medium">Edit details</span>
            <span className="text-[11px] text-muted-foreground">Fine-tune every section</span>
          </Link>
          <Link
            to="/dashboard"
            className="rounded-2xl glass px-4 py-5 flex flex-col gap-2 hover:border-white/40 transition"
          >
            <LayoutDashboard className="size-5 text-foreground/70" />
            <span className="text-sm font-medium">My resumes</span>
            <span className="text-[11px] text-muted-foreground">All your saved versions</span>
          </Link>
          <Link
            to="/contact"
            className="rounded-2xl glass px-4 py-5 flex flex-col gap-2 hover:border-white/40 transition"
          >
            <LifeBuoy className="size-5 text-foreground/70" />
            <span className="text-sm font-medium">Contact admin</span>
            <span className="text-[11px] text-muted-foreground">Help, bugs &amp; feedback</span>
          </Link>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/build"
            className="flex-1 rounded-xl px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/30 transition inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="size-3.5" /> Continue chatting with Aaruba
          </Link>
          <button
            onClick={handleScratch}
            className="flex-1 rounded-xl px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/30 transition inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="size-3.5" /> Start from scratch
          </button>
        </div>
      </div>
    </div>
  );
}
