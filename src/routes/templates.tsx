import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Check, X, ZoomIn, ChevronLeft, ChevronRight, Scale, RotateCcw, Search, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ResumeRender, TEMPLATES, recommendTemplate, type TemplateId, type TemplateMeta } from "@/components/resume/ResumeRender";
import { emptyResume, type ResumeData } from "@/lib/resume-schema";
import { getActiveId, getResume, upsertResume } from "@/lib/resume-store";


const tplTitle = "Resume Formats — 12 Layouts to Explore | Talk2YN";
const tplDesc =
  "Browse 12 resume formats, from classic Indian biodata to modern one-page CVs. Preview each one with your own details and compare side by side.";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: tplTitle },
      { name: "description", content: tplDesc },
      { property: "og:title", content: tplTitle },
      { property: "og:description", content: tplDesc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [active, setActive] = useState<TemplateId>("modern");
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<TemplateId | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePicks, setComparePicks] = useState<TemplateId[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);


  useEffect(() => {
    const id = getActiveId();
    const r = id ? getResume(id) : null;
    if (r) {
      setResumeId(r.id);
      setData(r.data);
      setActive((r.templateId as TemplateId) ?? "modern");
    }
  }, []);

  const recommended = useMemo(() => recommendTemplate(data), [data]);

  const pick = (id: TemplateId) => {
    setActive(id);
    if (!resumeId) return;
    const r = getResume(resumeId);
    if (r) {
      r.templateId = id;
      upsertResume(r);
    }
  };

  const toggleCompare = (id: TemplateId) => {
    setComparePicks((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const useTemplate = (id?: TemplateId) => {
    if (id) pick(id);
    else pick(active);
    navigate({ to: "/editor" });
  };

  const handleScratch = () => {
    const confirmed = window.confirm("Clear everything and start a new resume from scratch?");
    if (!confirmed) return;
    if (resumeId) {
      const r = getResume(resumeId);
      if (r) {
        r.messages = [];
        r.data = emptyResume;
        r.name = "Untitled Resume";
        upsertResume(r);
      }
    }
    setData(emptyResume);
    navigate({ to: "/build" });
  };

  const runAnalysis = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error("analyze failed");
      setAnalysis((await res.json()) as AnalysisResult);
    } catch (e) {
      console.error(e);
      setAnalyzeError("Couldn't analyze right now. Please try again in a moment.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-hero">
      <header className="sticky top-0 z-30 border-b border-border glass-strong">
        <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between gap-3">
          <Link to="/build" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" /> Back to <span className="hidden xs:inline">interview</span>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-6 rounded-md bg-ink text-paper grid place-items-center shrink-0 font-display font-bold text-xs">A</div>
            <span className="font-display text-lg truncate">Resume Formats</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary disabled:opacity-50 transition"
              title="Analyze your resume and get improvement tips"
            >
              {analyzing ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
              <span className="hidden xs:inline">Find it out</span>
            </button>
            <button
              onClick={handleScratch}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary transition"
              title="Clear everything and start over"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden xs:inline">Scratch</span>
            </button>
            <button
              onClick={() => { setCompareMode((v) => !v); setComparePicks([]); }}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs transition ${compareMode ? "bg-primary text-primary-foreground border-primary" : "hover:bg-secondary"}`}
            >
              <Scale className="size-3.5" /> {compareMode ? "Exit compare" : "Compare"}
            </button>
            <button
              onClick={() => useTemplate()}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 text-sm font-medium hover:scale-[1.02] transition shadow-lg shadow-primary/20"
            >
              Use <span className="hidden xs:inline">{TEMPLATES.find((t) => t.id === active)?.name}</span> <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="text-center max-w-2xl mx-auto animate-fade-up">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Resume Formats</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl text-gradient font-bold tracking-tight">12 formats to explore.</h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            {compareMode ? "Pick up to three formats to compare side-by-side." : "Click any format to view it full screen with your own details."}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs border border-primary/10 shadow-sm">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-muted-foreground">AI Recommended:</span>
            <span className="text-foreground font-bold">{TEMPLATES.find((t) => t.id === recommended.id)?.name}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed italic">{recommended.reason}</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((t) => {
            const isRec = t.id === recommended.id;
            const isSelected = active === t.id;
            const inCompare = comparePicks.includes(t.id);
            return (
              <div 
                key={t.id} 
                className={`group relative rounded-2xl p-4 transition-all duration-300 ${isSelected && !compareMode ? "glass-strong ring-2 ring-primary shadow-xl shadow-primary/5" : inCompare ? "glass-strong ring-2 ring-accent shadow-xl shadow-accent/5" : "glass hover:-translate-y-1 hover:shadow-lg"}`}
              >
                {isRec && (
                  <div className="absolute -top-3 left-6 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold px-3 py-1 shadow-md">
                    <Sparkles className="size-3" /> Recommended
                  </div>
                )}
                
                <div 
                  className="relative aspect-[8.5/11] rounded-lg overflow-hidden bg-white shadow-elevated cursor-pointer group/card"
                  onClick={() => (compareMode ? toggleCompare(t.id) : setZoom(t.id))}
                >
                  <div
                    className="absolute top-0 left-0 origin-top-left transition-transform duration-700 group-hover:scale-[0.46]"
                    style={{ width: "816px", height: "1056px", transform: "scale(0.44)" }}
                  >
                    <ResumeRender data={data} template={t.id} />
                  </div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors pointer-events-none" />
                  
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setZoom(t.id); }}
                      aria-label={`Full preview of ${t.name} format`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-black/80 text-white text-[10px] px-3 py-1.5 backdrop-blur-sm hover:bg-black"
                    >
                      <ZoomIn className="size-3.5" /> View format
                    </button>
                  </div>
                </div>


                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <button 
                      onClick={() => (compareMode ? toggleCompare(t.id) : pick(t.id))}
                      className="text-left group/title w-full"
                    >
                      <div className="font-bold truncate group-hover/title:text-primary transition-colors">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">{t.bestFor}</div>
                    </button>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[9px] uppercase tracking-wider font-semibold">
                      <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-muted-foreground">{t.layout}</span>
                      <span className={`rounded-md px-2 py-0.5 ${t.ats === "Excellent" ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary/80 text-muted-foreground"}`}>ATS: {t.ats}</span>
                    </div>
                  </div>
                  
                  {compareMode ? (
                    <button
                      onClick={() => toggleCompare(t.id)}
                      className={`shrink-0 rounded-full size-8 grid place-items-center border transition-all ${inCompare ? "bg-accent text-accent-foreground border-accent scale-110 shadow-md" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}
                      aria-label={`Toggle ${t.name} for comparison`}
                    >
                      {inCompare ? <Check className="size-4" /> : <span className="text-sm font-bold">+</span>}
                    </button>
                  ) : (
                    isSelected && (
                      <div className="flex flex-col items-end gap-1">
                        <Check className="size-5 text-primary animate-fade-in" />
                        <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Active</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {compareMode && comparePicks.length >= 2 && (
          <CompareStrip picks={comparePicks} data={data} onUse={(id) => useTemplate(id)} onClose={() => { setCompareMode(false); setComparePicks([]); }} />
        )}
      </div>

      {zoom && (
        <FullscreenPreview
          templateId={zoom}
          data={data}
          recommendedId={recommended.id}
          onClose={() => setZoom(null)}
          onSelect={(id) => { pick(id); setZoom(null); navigate({ to: "/editor" }); }}
          onChange={setZoom}
          
        />
      )}



      {(analyzing || analysis || analyzeError) && (
        <AnalysisModal
          analyzing={analyzing}
          analysis={analysis}
          error={analyzeError}
          onClose={() => { setAnalysis(null); setAnalyzeError(null); }}
        />
      )}
    </div>
  );
}

type AnalysisResult = {
  score?: number;
  atsScore?: number;
  strengths?: string[];
  missing?: string[];
  improvements?: Array<{ area: string; issue: string; fix: string; priority?: "high" | "medium" | "low" }>;
  nextSteps?: string[];
};

function AnalysisModal({ analyzing, analysis, error, onClose }: { analyzing: boolean; analysis: AnalysisResult | null; error: string | null; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-strong rounded-3xl border border-white/10 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-background/70 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-2xl grid place-items-center bg-gradient-to-r from-primary to-accent">
              <Search className="size-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base">Resume Analysis</h3>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">What's strong · what to fix</p>
            </div>
          </div>
          <button onClick={onClose} className="grid place-items-center size-8 rounded-full hover:bg-white/10"><X className="size-4" /></button>
        </div>
        <div className="p-6 space-y-6">
          {analyzing && (
            <div className="flex flex-col items-center py-10 gap-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Reading your resume with a critical eye…</p>
            </div>
          )}
          {error && !analyzing && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          {analysis && !analyzing && (
            <>
              {(analysis.score !== undefined || analysis.atsScore !== undefined) && (
                <div className="grid grid-cols-2 gap-3">
                  {analysis.score !== undefined && (
                    <div className="glass rounded-2xl p-4">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Overall</div>
                      <div className="font-display text-3xl font-bold">{analysis.score}<span className="text-sm text-muted-foreground">/100</span></div>
                    </div>
                  )}
                  {analysis.atsScore !== undefined && (
                    <div className="glass rounded-2xl p-4">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ATS-friendly</div>
                      <div className="font-display text-3xl font-bold">{analysis.atsScore}<span className="text-sm text-muted-foreground">/100</span></div>
                    </div>
                  )}
                </div>
              )}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Strengths</h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" /><span>{s}</span></li>
                    ))}
                  </ul>
                </section>
              )}
              {analysis.missing && analysis.missing.length > 0 && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Still missing</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing.map((m, i) => (
                      <span key={i} className="text-xs rounded-full border border-white/15 bg-white/5 px-3 py-1.5">{m}</span>
                    ))}
                  </div>
                </section>
              )}
              {analysis.improvements && analysis.improvements.length > 0 && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-3">Improvements</h4>
                  <div className="space-y-3">
                    {analysis.improvements.map((imp, i) => (
                      <div key={i} className="glass rounded-2xl p-4 border-l-2 border-primary">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="font-semibold text-sm">{imp.area}</div>
                          {imp.priority && <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{imp.priority}</span>}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1.5">{imp.issue}</div>
                        <div className="text-sm text-foreground/90"><span className="text-primary font-medium">Fix: </span>{imp.fix}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {analysis.nextSteps && analysis.nextSteps.length > 0 && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-2">Next steps</h4>
                  <ol className="space-y-2 list-decimal list-inside text-sm">
                    {analysis.nextSteps.map((step, i) => <li key={i} className="text-foreground/90">{step}</li>)}
                  </ol>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function FullscreenPreview({
  templateId, data, recommendedId, onClose, onSelect, onChange,
}: {
  templateId: TemplateId; data: ResumeData; recommendedId: TemplateId;
  onClose: () => void; onSelect: (id: TemplateId) => void; onChange: (id: TemplateId) => void;
}) {
  const [scale, setScale] = useState(0.85);
  const idx = TEMPLATES.findIndex((t) => t.id === templateId);
  const t = TEMPLATES[idx];
  const prev = () => onChange(TEMPLATES[(idx - 1 + TEMPLATES.length) % TEMPLATES.length].id);
  const next = () => onChange(TEMPLATES[(idx + 1) % TEMPLATES.length].id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl animate-fade-in flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 text-white bg-black/20">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition-colors" aria-label="Close preview"><X className="size-6" /></button>
          <div className="min-w-0">
            <div className="font-display text-xl font-bold truncate tracking-tight">{t.name}</div>
            <div className="text-xs text-white/50 truncate font-medium">{t.subtext}</div>
          </div>
          {templateId === recommendedId && (
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold px-3 py-1 shadow-lg shadow-primary/20">
              <Sparkles className="size-3" /> AI Recommended
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1">
            <button onClick={() => setScale((s) => Math.max(0.4, s - 0.1))} className="size-8 rounded hover:bg-white/10 transition-colors" aria-label="Zoom out">−</button>
            <span className="text-xs w-12 text-center tabular-nums font-mono">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((s) => Math.min(1.4, s + 0.1))} className="size-8 rounded hover:bg-white/10 transition-colors" aria-label="Zoom in">+</button>
          </div>
          <button onClick={() => onSelect(templateId)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground px-5 py-2 text-sm font-bold shadow-xl shadow-primary/20 hover:scale-105 transition">
            Use this format <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto grid place-items-center p-8 relative">
        <button onClick={prev} className="fixed left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/5 hover:bg-white/10 text-white size-12 grid place-items-center backdrop-blur-md border border-white/10 transition-all shadow-xl" aria-label="Previous template"><ChevronLeft className="size-6" /></button>
        
        <div className="bg-white shadow-2xl relative" style={{ width: 816 * scale, height: 1056 * scale }}>
          <div className="origin-top-left" style={{ width: 816, height: 1056, transform: `scale(${scale})` }}>
            <ResumeRender data={data} template={templateId} />
          </div>
        </div>

        <button onClick={next} className="fixed right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/5 hover:bg-white/10 text-white size-12 grid place-items-center backdrop-blur-md border border-white/10 transition-all shadow-xl" aria-label="Next template"><ChevronRight className="size-6" /></button>
      </div>
    </div>
  );
}

function CompareStrip({ picks, data, onUse, onClose }: { picks: TemplateId[]; data: ResumeData; onUse: (id: TemplateId) => void; onClose: () => void }) {
  const items: TemplateMeta[] = picks.map((id) => TEMPLATES.find((t) => t.id === id)!).filter(Boolean);
  return (
    <div className="mt-16 rounded-3xl glass-strong p-6 sm:p-8 animate-fade-up border border-white/20 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-1">Side by side</div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Compare designs</h2>
        </div>
        <button onClick={onClose} className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors bg-secondary/50 px-3 py-1.5 rounded-full"><X className="size-4" /> Close comparison</button>
      </div>
      <div className={`grid gap-6 ${picks.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border/50 p-4 bg-card/30 backdrop-blur-sm group hover:border-primary/30 transition-colors">
            <div className="relative aspect-[8.5/11] rounded-lg overflow-hidden bg-white shadow-lg group-hover:shadow-xl transition-shadow">
              <div className="absolute top-0 left-0 origin-top-left" style={{ width: "816px", height: "1056px", transform: "scale(0.42)" }}>
                <ResumeRender data={data} template={t.id} />
              </div>
            </div>
            <div className="mt-5">
              <div className="font-bold text-lg mb-4">{t.name}</div>
              <dl className="space-y-3 text-[11px]">
                <Row k="ATS Rating" v={t.ats} accent={t.ats === "Excellent"} />
                <Row k="Layout" v={t.layout} />
                <Row k="Best for" v={t.bestFor} />
                <Row k="Focus" v={t.focus} />
              </dl>
              <button onClick={() => onUse(t.id)} className="mt-6 w-full inline-flex justify-center items-center gap-2 rounded-full bg-ink text-paper px-4 py-2.5 text-xs font-bold hover:opacity-90 transition shadow-lg">
                Preview full scale <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
      <dt className="text-muted-foreground font-medium shrink-0 uppercase tracking-wider text-[9px]">{k}</dt>
      <dd className={`text-right font-semibold ${accent ? "text-emerald-500" : "text-foreground"}`}>{v}</dd>
    </div>
  );
}
