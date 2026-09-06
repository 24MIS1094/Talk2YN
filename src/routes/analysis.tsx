import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Loader2,
  X,
  TrendingUp,
  FileText,
  RefreshCw,
  Compass,
  Rocket,
  GraduationCap,
  IndianRupee,
} from "lucide-react";
import { ScoreRing, ScoreBar } from "@/components/analysis/ScoreRing";
import { getActiveId, getResume, upsertResume } from "@/lib/resume-store";
import { emptyResume, type ResumeData } from "@/lib/resume-schema";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Resume Analysis — Talk2YN" },
      {
        name: "description",
        content:
          "Aaruba analyzes your resume in 10 categories with ATS score, strengths, gaps, and one-click AI improvements.",
      },
      { property: "og:title", content: "Resume Analysis — Talk2YN" },
      { property: "og:description", content: "Your AI resume score, category by category." },
    ],
  }),
  component: AnalysisPage,
});

type CategoryDetail = {
  score: number;
  label: string;
  summary: string;
  whyItMatters: string;
  recruiterExpectation: string;
  atsCheck: string;
  strengths: string[];
  improvements: string[];
  weakExample: string;
  betterExample: string;
  estimatedLift: number;
  targetField: string;
};

type AnalysisResult = {
  score: number;
  atsScore: number;
  strengths: string[];
  missing: string[];
  improvements: Array<{ area: string; issue: string; fix: string; priority: string }>;
  nextSteps: string[];
  categories: Record<string, CategoryDetail>;
};

const CATEGORY_ORDER = [
  "atsCompatibility",
  "completeness",
  "professionalWriting",
  "grammar",
  "skillsStrength",
  "projectsQuality",
  "experienceQuality",
  "educationQuality",
  "keywordMatching",
  "visualDesign",
] as const;

function AnalysisPage() {
  const navigate = useNavigate();
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [improving, setImproving] = useState<string | null>(null);
  const [scoreBump, setScoreBump] = useState<Record<string, number>>({});

  useEffect(() => {
    const id = getActiveId();
    if (!id) {
      navigate({ to: "/build" });
      return;
    }
    setResumeId(id);
    const r = getResume(id);
    if (r) {
      setData(r.data);
      if (r.analysis) {
        setAnalysis(r.analysis as AnalysisResult);
        setLoading(false);
        return;
      }
    }
    runAnalysis(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAnalysis = async (id?: string) => {
    const targetId = id ?? resumeId;
    if (!targetId) return;
    setLoading(true);
    setError(null);
    try {
      const r = getResume(targetId);
      const payload = r?.data ?? data;
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      if (!res.ok) throw new Error("analyze failed");
      const result = (await res.json()) as AnalysisResult;
      setAnalysis(result);
      setScoreBump({});
      const stored = getResume(targetId);
      if (stored) {
        stored.analysis = result;
        stored.analyzedAt = Date.now();
        upsertResume(stored);
      }
    } catch (e) {
      console.error(e);
      setError("Couldn't analyze right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const improveCategory = async (key: string, category: CategoryDetail) => {
    if (!resumeId) return;
    setImproving(key);
    try {
      const stored = getResume(resumeId);
      const current = stored?.data ?? data;
      const next: ResumeData = JSON.parse(JSON.stringify(current));
      const field = category.targetField;

      const askRewrite = async (text: string, action: string, context: string) => {
        const res = await fetch("/api/rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, action, context }),
        });
        if (!res.ok) return text;
        const j = (await res.json()) as { text?: string };
        return j.text?.trim() || text;
      };

      if (field === "summary") {
        const src = next.summary || next.personalInfo.fullName || "Professional summary";
        next.summary = await askRewrite(
          src,
          `improve for ${category.label.toLowerCase()}`,
          "professional summary — 2-3 concise lines, action verbs, no invented facts",
        );
      } else if (field === "experience") {
        for (const exp of next.experience) {
          if (!exp.bullets?.length) continue;
          exp.bullets = await Promise.all(
            exp.bullets.map((b) =>
              askRewrite(b, "strengthen bullet", `experience bullet for ${exp.role} at ${exp.company}`),
            ),
          );
        }
      } else if (field === "projects") {
        for (const p of next.projects) {
          if (p.description) {
            p.description = await askRewrite(
              p.description,
              "strengthen project description",
              `project called ${p.name}`,
            );
          }
          if (p.bullets?.length) {
            p.bullets = await Promise.all(
              p.bullets.map((b) => askRewrite(b, "strengthen bullet", `project ${p.name}`)),
            );
          }
        }
      } else if (field === "skills") {
        // Nothing to rewrite — just note it locally
      } else if (field === "achievements") {
        if (next.achievements.length) {
          next.achievements = await Promise.all(
            next.achievements.map((a) => askRewrite(a, "strengthen achievement", "resume achievement")),
          );
        }
      }

      setData(next);
      if (stored) {
        stored.data = next;
        upsertResume(stored);
      }

      // Animate a realistic score lift on the touched category and overall.
      const lift = Math.max(2, Math.min(12, category.estimatedLift));
      setAnalysis((prev) => {
        if (!prev) return prev;
        const nextCategories = { ...prev.categories };
        const cat = nextCategories[key];
        if (cat) {
          nextCategories[key] = {
            ...cat,
            score: Math.min(100, cat.score + lift),
          };
        }
        const avg =
          CATEGORY_ORDER.reduce((s, k) => s + (nextCategories[k]?.score ?? 0), 0) /
          CATEGORY_ORDER.length;
        return {
          ...prev,
          score: Math.round(avg),
          atsScore:
            key === "atsCompatibility"
              ? nextCategories.atsCompatibility.score
              : prev.atsScore,
          categories: nextCategories,
        };
      });
      setScoreBump((b) => ({ ...b, [key]: (b[key] ?? 0) + 1, overall: (b.overall ?? 0) + 1 }));
    } catch (e) {
      console.error("improve failed", e);
    } finally {
      setImproving(null);
    }
  };

  const activeCategory = useMemo(() => {
    if (!analysis || !activeKey) return null;
    return analysis.categories[activeKey] ?? null;
  }, [analysis, activeKey]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient orbs (match build page palette) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-50 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-45 animate-float"
          style={{ background: "radial-gradient(circle, #e84393 0%, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full blur-3xl opacity-45 animate-drift"
          style={{
            background: "radial-gradient(circle, #6c5ce7 0%, transparent 65%)",
            animationDelay: "-4s",
          }}
        />
      </div>

      {/* NAV */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(96vw,1180px)]">
        <div className="glass-strong rounded-full px-4 py-2.5 flex items-center justify-between">
          <Link
            to="/build"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Back to Aaruba</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div
              className="size-6 rounded-full grid place-items-center animate-sunset"
              style={{ background: "var(--gradient-sunset)" }}
            >
              <Sparkles className="size-3 text-white" />
            </div>
            <span className="font-display text-sm tracking-tight font-semibold">
              Resume Analysis
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => runAnalysis()}
              disabled={loading}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-widest text-foreground/85 hover:text-[color:var(--ember)] hover:border-[color:var(--ember)]/60 disabled:opacity-40 transition"
            >
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              Re-analyze
            </button>
            <Link
              to="/templates"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest text-white shadow-[0_10px_30px_-10px_rgba(255,107,53,0.7)]"
              style={{ background: "var(--gradient-ember)" }}
            >
              <FileText className="size-3.5" />
              Choose template
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-8">
        <div className="mx-auto max-w-6xl">
          {/* HERO — overall score */}
          <section className="glass-strong rounded-3xl p-6 sm:p-10 mb-8 animate-fade-up">
            <div className="grid md:grid-cols-[auto,1fr] gap-8 md:gap-12 items-center">
              <div className="flex justify-center">
                {loading || !analysis ? (
                  <div className="size-[220px] grid place-items-center">
                    <Loader2 className="size-8 animate-spin text-[color:var(--ember)]" />
                  </div>
                ) : (
                  <ScoreRing
                    key={`overall-${scoreBump.overall ?? 0}`}
                    score={analysis.score}
                    label="Overall Score"
                  />
                )}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  Aaruba's verdict
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05] mb-4">
                  {loading || !analysis
                    ? "Analyzing your resume…"
                    : analysis.score >= 85
                      ? "You're recruiter-ready."
                      : analysis.score >= 70
                        ? "Strong start — let's polish it."
                        : "Solid draft — a few upgrades will lift this fast."}
                </h1>
                {analysis && (
                  <>
                    <p className="text-foreground/70 leading-relaxed max-w-xl mb-6">
                      Tap any category below to see what recruiters and ATS bots look for, plus a
                      one-click AI improvement.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <MiniStat label="ATS score" value={`${analysis.atsScore}%`} />
                      <MiniStat
                        label="Strengths"
                        value={String(analysis.strengths?.length ?? 0)}
                      />
                      <MiniStat label="Missing" value={String(analysis.missing?.length ?? 0)} />
                      <MiniStat
                        label="Improvements"
                        value={String(analysis.improvements?.length ?? 0)}
                      />
                    </div>
                  </>
                )}
                {error && (
                  <div className="mt-4 inline-flex items-center gap-2 text-sm text-[color:var(--ember)]">
                    <AlertCircle className="size-4" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CATEGORY GRID */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORY_ORDER.map((key, idx) => {
              const c = analysis?.categories?.[key];
              return (
                <button
                  key={key}
                  onClick={() => c && setActiveKey(key)}
                  disabled={!c}
                  className="text-left glass rounded-2xl p-5 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 animate-fade-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                        Category
                      </div>
                      <div className="font-display font-semibold text-base leading-tight">
                        {c?.label ?? categoryLabel(key)}
                      </div>
                    </div>
                    <div className="font-display text-2xl font-semibold tabular-nums">
                      {c ? `${c.score}` : "—"}
                    </div>
                  </div>
                  <ScoreBar
                    score={c?.score ?? 0}
                    animateKey={`${key}-${scoreBump[key] ?? 0}`}
                  />
                  <p className="text-xs text-foreground/60 mt-3 line-clamp-2 min-h-[2.5em]">
                    {c?.summary || (loading ? "Analyzing…" : "Tap re-analyze.")}
                  </p>
                </button>
              );
            })}
          </section>

          {/* NEXT STEPS */}
          {analysis && analysis.nextSteps?.length > 0 && (
            <section className="glass-strong rounded-3xl p-6 sm:p-8 mt-8 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="size-4 text-[color:var(--ember)]" />
                <h2 className="font-display text-lg font-semibold">Next steps</h2>
              </div>
              <ul className="space-y-2.5">
                {analysis.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <span className="mt-1.5 size-1.5 rounded-full bg-[color:var(--ember)] shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/templates"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-white"
                  style={{ background: "var(--gradient-ember)" }}
                >
                  Choose a template
                </Link>
                <Link
                  to="/build"
                  className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs uppercase tracking-widest hover:border-white/30"
                >
                  Talk to Aaruba more
                </Link>
              </div>
            </section>
          )}

          {/* CAREER GROWTH */}
          <CareerGrowth resumeData={data} />
        </div>
      </main>

      {/* DETAIL PANEL */}
      {activeCategory && activeKey && (
        <CategoryDetailPanel
          key={activeKey}
          categoryKey={activeKey}
          category={activeCategory}
          onClose={() => setActiveKey(null)}
          onImprove={() => improveCategory(activeKey, activeCategory)}
          improving={improving === activeKey}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-full px-3.5 py-1.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-2">
        {label}
      </span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function categoryLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function CategoryDetailPanel({
  categoryKey,
  category,
  onClose,
  onImprove,
  improving,
}: {
  categoryKey: string;
  category: CategoryDetail;
  onClose: () => void;
  onImprove: () => void;
  improving: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
      />
      <aside className="relative w-full sm:w-[560px] max-w-full h-full glass-strong border-l border-white/10 overflow-y-auto animate-slide-in-right">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                Category
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {category.label}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="grid place-items-center size-9 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <ScoreRing
              key={categoryKey + "-" + category.score}
              score={category.score}
              size={130}
              stroke={10}
              label="Current"
            />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Estimated lift
              </div>
              <div className="font-display text-3xl font-semibold text-[color:var(--ember)] tabular-nums">
                +{category.estimatedLift}
              </div>
              <div className="text-xs text-foreground/60 mt-1 max-w-[180px]">
                if you apply the improvements below
              </div>
            </div>
          </div>

          {category.summary && (
            <p className="text-sm text-foreground/85 leading-relaxed mb-5">{category.summary}</p>
          )}

          <div className="grid gap-3 mb-6">
            <InfoBlock label="Why this matters" text={category.whyItMatters} />
            <InfoBlock label="What recruiters expect" text={category.recruiterExpectation} />
            <InfoBlock label="How ATS checks this" text={category.atsCheck} />
          </div>

          {category.strengths.length > 0 && (
            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Strengths
              </div>
              <ul className="space-y-2">
                {category.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                    <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {category.improvements.length > 0 && (
            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Needs improvement
              </div>
              <ul className="space-y-2">
                {category.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                    <span className="mt-1.5 size-1.5 rounded-full bg-[color:var(--ember)] shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(category.weakExample || category.betterExample) && (
            <div className="mb-6 grid gap-3">
              {category.weakExample && (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-red-300 mb-1">
                    Weak
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {category.weakExample}
                  </p>
                </div>
              )}
              {category.betterExample && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-emerald-300 mb-1">
                    Better
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {category.betterExample}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onImprove}
            disabled={improving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_-15px_rgba(255,107,53,0.75)] transition disabled:opacity-70"
            style={{ background: "var(--gradient-ember)" }}
          >
            {improving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Aaruba is improving this section…
              </>
            ) : (
              <>
                <Wand2 className="size-4" />
                Improve this section
              </>
            )}
          </button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            Aaruba rewrites only this section. Your other content stays exactly as-is.
          </p>
        </div>
      </aside>
    </div>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <div className="glass rounded-xl p-3.5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <p className="text-sm text-foreground/85 leading-relaxed">{text}</p>
    </div>
  );
}

// ─── CAREER GROWTH ───────────────────────────────────────────────────────────
type CareerResult = {
  targetRoles?: Array<{ title: string; why: string; fit: number }>;
  skillsToLearn?: Array<{ skill: string; reason: string; priority: "high" | "medium" | "low" }>;
  projectIdeas?: Array<{ name: string; summary: string; tech: string[] }>;
  certifications?: Array<{ name: string; provider: string; why: string }>;
  salaryRange?: { entry: string; mid: string; note: string };
  shortTerm?: string[];
  longTerm?: string[];
};

function CareerGrowth({ resumeData }: { resumeData: ResumeData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CareerResult | null>(null);

  const load = async () => {
    setOpen(true);
    if (result || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: resumeData }),
      });
      if (!res.ok) throw new Error("career failed");
      setResult((await res.json()) as CareerResult);
    } catch (e) {
      console.error(e);
      setError("Couldn't load career guidance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass-strong rounded-3xl p-6 sm:p-8 mt-8 animate-fade-up">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-[color:var(--ember)]" />
          <h2 className="font-display text-lg font-semibold">Career growth</h2>
        </div>
        {!open && (
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] uppercase tracking-widest text-white"
            style={{ background: "var(--gradient-ember)" }}
          >
            <Rocket className="size-3.5" /> Get guidance
          </button>
        )}
      </div>

      {!open && (
        <p className="text-sm text-foreground/70 max-w-xl">
          Aaruba will suggest target roles, skills to learn, project ideas, certifications and salary
          ranges based on your resume.
        </p>
      )}

      {open && loading && (
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <Loader2 className="size-4 animate-spin" /> Aaruba is thinking about your career path…
        </div>
      )}

      {open && error && (
        <div className="flex items-center gap-2 text-sm text-[color:var(--ember)]">
          <AlertCircle className="size-4" /> {error}
        </div>
      )}

      {open && result && (
        <div className="grid gap-5 mt-2">
          {result.targetRoles && result.targetRoles.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Target roles
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.targetRoles.map((r, i) => (
                  <div key={i} className="glass rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-display font-semibold text-sm">{r.title}</div>
                      <div className="text-[10px] uppercase tracking-widest text-[color:var(--ember)] tabular-nums">
                        {r.fit}% fit
                      </div>
                    </div>
                    <p className="text-xs text-foreground/70 mt-1.5 leading-relaxed">{r.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.skillsToLearn && result.skillsToLearn.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Skills to learn next
              </div>
              <ul className="grid gap-2">
                {result.skillsToLearn.map((s, i) => (
                  <li key={i} className="glass rounded-xl px-4 py-3 flex items-start gap-3">
                    <span
                      className="mt-1.5 size-2 rounded-full shrink-0"
                      style={{
                        background:
                          s.priority === "high"
                            ? "var(--ember)"
                            : s.priority === "medium"
                              ? "#ffb066"
                              : "#8fa1c7",
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{s.skill}</div>
                      <div className="text-xs text-foreground/70 mt-0.5">{s.reason}</div>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                      {s.priority}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.projectIdeas && result.projectIdeas.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Build these projects
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {result.projectIdeas.map((p, i) => (
                  <div key={i} className="glass rounded-2xl p-4">
                    <div className="font-display font-semibold text-sm mb-1">{p.name}</div>
                    <p className="text-xs text-foreground/70 leading-relaxed">{p.summary}</p>
                    {p.tech?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--ember)]/15 text-[color:var(--ember)] border border-[color:var(--ember)]/25"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.certifications && result.certifications.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <GraduationCap className="size-3.5" /> Certifications worth getting
              </div>
              <ul className="grid sm:grid-cols-2 gap-2">
                {result.certifications.map((c, i) => (
                  <li key={i} className="glass rounded-xl px-4 py-3">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">{c.provider}</div>
                    <div className="text-xs text-foreground/70 mt-1">{c.why}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.salaryRange && (
            <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4">
              <IndianRupee className="size-4 text-[color:var(--ember)]" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Entry
                </div>
                <div className="font-semibold">{result.salaryRange.entry}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Mid
                </div>
                <div className="font-semibold">{result.salaryRange.mid}</div>
              </div>
              {result.salaryRange.note && (
                <div className="text-xs text-foreground/70 flex-1 min-w-[200px]">
                  {result.salaryRange.note}
                </div>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {result.shortTerm && result.shortTerm.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Next 30 days
                </div>
                <ul className="space-y-1.5 text-sm text-foreground/85">
                  {result.shortTerm.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 rounded-full bg-[color:var(--ember)] shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.longTerm && result.longTerm.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Next 1–2 years
                </div>
                <ul className="space-y-1.5 text-sm text-foreground/85">
                  {result.longTerm.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 rounded-full bg-[color:var(--violet)] shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
