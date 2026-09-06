import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  Info,
  RefreshCw,
  ClipboardPaste,
  Target,
  Loader2,
} from "lucide-react";
import { ScoreRing } from "@/components/analysis/ScoreRing";
import { getActiveId, getResume, upsertResume } from "@/lib/resume-store";
import { emptyResume, type ResumeData } from "@/lib/resume-schema";
import { scoreResume, type AtsReport } from "@/lib/ats-engine";

export const Route = createFileRoute("/ats")({
  head: () => ({
    meta: [
      { title: "ATS Score Predictor — Talk2YN" },
      {
        name: "description",
        content:
          "Deterministic ATS score with keyword match, formatting checks, and prioritized fixes — like Jobscan, built into Talk2YN.",
      },
      { property: "og:title", content: "ATS Score Predictor — Talk2YN" },
      {
        property: "og:description",
        content: "Get a real, rule-based ATS score for your resume against any job description.",
      },
    ],
  }),
  component: AtsPage,
});

const JD_KEY = "talk2yn.ats.jd.v1";

function bandLabel(band: AtsReport["band"]) {
  switch (band) {
    case "excellent":
      return { text: "Excellent — ready to apply", color: "var(--primary)" };
    case "strong":
      return { text: "Strong — small tweaks left", color: "#ffb066" };
    case "fair":
      return { text: "Fair — needs polish", color: "#e84393" };
    default:
      return { text: "Needs work — follow the fixes below", color: "#c94040" };
  }
}

function AtsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [jd, setJd] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = getActiveId();
    if (!id) {
      navigate({ to: "/build" });
      return;
    }
    const r = getResume(id);
    if (r) setData(r.data);
    try {
      const stored = localStorage.getItem(JD_KEY);
      if (stored) setJd(stored);
    } catch {
      /* ignore */
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(JD_KEY, jd);
    } catch {
      /* ignore */
    }
  }, [jd, ready]);

  const report = useMemo(() => scoreResume(data, jd), [data, jd]);

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setJd(text);
    } catch {
      /* clipboard blocked */
    }
  };

  const refreshFromStore = () => {
    const id = getActiveId();
    if (!id) return;
    const r = getResume(id);
    if (r) setData(r.data);
  };

  const band = bandLabel(report.band);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-50 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-45 animate-float"
          style={{ background: "radial-gradient(circle, #6c5ce7 0%, transparent 65%)" }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(96vw,1180px)]">
        <div className="glass-strong rounded-full px-4 py-2.5 flex items-center justify-between">
          <Link
            to="/build"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Build</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div
              className="size-6 rounded-full grid place-items-center animate-sunset"
              style={{ background: "var(--gradient-sunset)" }}
            >
              <Target className="size-3 text-white" />
            </div>
            <span className="font-display text-sm tracking-tight font-semibold">
              ATS Predictor
            </span>
          </div>
          <button
            onClick={refreshFromStore}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            title="Reload resume data"
          >
            <RefreshCw className="size-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-8">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — score + JD */}
          <section className="lg:col-span-5 space-y-5">
            <div className="glass-strong rounded-3xl p-6 flex flex-col items-center text-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Deterministic · rule-based
              </span>
              <ScoreRing score={report.overall} label="ATS Score" />
              <div className="mt-4 space-y-1">
                <div
                  className="text-sm font-medium"
                  style={{ color: band.color }}
                >
                  {band.text}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {report.jd
                    ? `Compared against: ${report.jd.title ?? "your JD"}`
                    : "No JD — general resume score"}
                </div>
              </div>
            </div>

            {/* JD paste */}
            <div className="glass-strong rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[color:var(--ember)]" />
                  <h2 className="font-display text-sm font-semibold">Job description</h2>
                </div>
                <button
                  onClick={pasteFromClipboard}
                  className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-widest text-foreground/85 hover:text-white hover:border-white/40 transition"
                >
                  <ClipboardPaste className="size-3.5" />
                  Paste
                </button>
              </div>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here to see keyword match and title alignment. Leave empty for a general resume score."
                className="w-full min-h-[180px] rounded-2xl bg-background/40 border border-white/10 focus:border-[color:var(--ember)]/60 outline-none px-4 py-3 text-sm resize-y"
              />
              {report.jd && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <Metric label="Title" value={report.jd.title ? "✓" : "—"} />
                  <Metric
                    label="Hard skills"
                    value={`${report.hardKeywords.present.length}/${report.hardKeywords.totalRequired}`}
                  />
                  <Metric
                    label="Soft skills"
                    value={`${report.softKeywords.present.length}/${report.softKeywords.totalRequired}`}
                  />
                </div>
              )}
            </div>

            {/* Keyword chips */}
            {report.jd && (report.hardKeywords.totalRequired > 0 || report.softKeywords.totalRequired > 0) && (
              <div className="glass-strong rounded-3xl p-5 space-y-4">
                <KeywordBlock
                  label="Present in your resume"
                  items={[...report.hardKeywords.present, ...report.softKeywords.present]}
                  variant="pass"
                />
                <KeywordBlock
                  label="Missing — weave these in"
                  items={[...report.hardKeywords.missing, ...report.softKeywords.missing]}
                  variant="fail"
                />
              </div>
            )}
          </section>

          {/* RIGHT — categories + weak bullets */}
          <section className="lg:col-span-7 space-y-5">
            {/* Prioritized tips */}
            {report.tips.length > 0 && (
              <div className="glass-strong rounded-3xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="size-4 text-[color:var(--ember)]" />
                  <h2 className="font-display text-sm font-semibold">Top fixes to raise your score</h2>
                </div>
                <ol className="space-y-2 text-sm">
                  {report.tips.map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 size-5 rounded-full grid place-items-center text-[10px] font-semibold bg-[color:var(--ember)]/20 text-[color:var(--ember)]">
                        {i + 1}
                      </span>
                      <span className="text-foreground/85 leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.categories
                .filter((c) => c.effectiveMax > 0)
                .map((c) => (
                  <CategoryCard key={c.key} c={c} />
                ))}
            </div>

            {/* Weak bullets */}
            {report.weakBullets.length > 0 && (
              <div className="glass-strong rounded-3xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="size-4 text-[#c94040]" />
                  <h2 className="font-display text-sm font-semibold">
                    Weak bullets ({report.weakBullets.length})
                  </h2>
                </div>
                <ul className="space-y-2 text-sm">
                  {report.weakBullets.map((b, i) => (
                    <li key={i} className="rounded-2xl bg-background/40 border border-white/10 p-3">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                        {b.where}
                      </div>
                      <div className="text-foreground/85">{b.text}</div>
                      <div className="text-[11px] text-[#c94040] mt-1">{b.reason}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-end">
              <Link
                to="/build"
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-widest hover:border-white/40"
              >
                Back to interview
              </Link>
              <Link
                to="/analysis"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-white"
                style={{ background: "var(--gradient-sunset)" }}
              >
                <Loader2 className="size-3.5 opacity-0" />
                Aaruba's deep analysis →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/40 border border-white/10 px-3 py-2 text-center">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function KeywordBlock({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: "pass" | "fail";
}) {
  if (items.length === 0) return null;
  const cls =
    variant === "pass"
      ? "bg-[color:var(--primary)]/15 text-[color:var(--primary)] border-[color:var(--primary)]/30"
      : "bg-[#c94040]/15 text-[#ff9a9a] border-[#c94040]/30";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((k) => (
          <span
            key={k}
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] ${cls}`}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryCard({
  c,
}: {
  c: ReturnType<typeof scoreResume>["categories"][number];
}) {
  const pct = c.effectiveMax === 0 ? 0 : Math.round((c.score / c.effectiveMax) * 100);
  const color =
    pct >= 80 ? "var(--primary)" : pct >= 60 ? "#ffb066" : pct >= 40 ? "#e84393" : "#c94040";
  return (
    <div className="glass-strong rounded-2xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm font-semibold">{c.label}</div>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {c.score.toFixed(1)} / {c.effectiveMax.toFixed(1)}
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <ul className="space-y-1.5">
        {c.checks.map((k, i) => (
          <li key={i} className="flex gap-2 text-[12px] leading-relaxed">
            {k.pass ? (
              <CheckCircle2 className="size-3.5 mt-0.5 text-[color:var(--primary)] shrink-0" />
            ) : (
              <XCircle className="size-3.5 mt-0.5 text-[#c94040] shrink-0" />
            )}
            <div>
              <div className={k.pass ? "text-foreground/85" : "text-foreground"}>
                {k.message}
              </div>
              {!k.pass && k.fix && (
                <div className="text-[11px] text-muted-foreground mt-0.5">→ {k.fix}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
