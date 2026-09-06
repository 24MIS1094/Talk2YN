import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, FileText, Mail, Plus, Sparkles, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { testEmailDelivery, type EmailTestResult } from "@/lib/email-diagnostics.functions";
import { createResume, deleteResume, loadAll, setActiveId, type StoredResume } from "@/lib/resume-store";
import { estimateCompleteness } from "@/lib/resume-schema";

const dashTitle = "Your Resumes — Talk2YN Dashboard";
const dashDesc =
  "Manage every resume you built with Aaruba: open, duplicate, delete, and track how complete each one is.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: dashTitle },
      { name: "description", content: dashDesc },
      { property: "og:title", content: dashTitle },
      { property: "og:description", content: dashDesc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<StoredResume[]>([]);
  const [emailTesting, setEmailTesting] = useState(false);
  const [emailTest, setEmailTest] = useState<EmailTestResult | null>(null);
  const runTest = useServerFn(testEmailDelivery);

  const runEmailTest = async () => {
    setEmailTesting(true);
    setEmailTest(null);
    try {
      setEmailTest(await runTest());
    } catch (err: any) {
      setEmailTest({
        ok: false,
        summary: "Could not run the test.",
        steps: [{ label: "Request", status: "fail", detail: err?.message ?? "Unexpected error." }],
      });
    } finally {
      setEmailTesting(false);
    }
  };

  const refresh = () => setItems(loadAll());
  useEffect(() => { refresh(); }, []);

  const openNew = () => {
    const r = createResume();
    setActiveId(r.id);
    navigate({ to: "/build" });
  };

  const openExisting = (id: string) => {
    setActiveId(id);
    navigate({ to: "/editor" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-hero">
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" /> Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-ink text-paper grid place-items-center shrink-0 font-display font-bold text-xs">A</div>
            <span className="font-display text-lg font-bold tracking-tight">My Library</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runEmailTest}
              disabled={emailTesting}
              title="Send a test email to verify DNS and sending"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition disabled:opacity-60"
            >
              <Mail className={`size-4 ${emailTesting ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">{emailTesting ? "Testing…" : "Test email"}</span>
            </button>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-4 py-2 text-sm font-bold hover:scale-[1.02] transition shadow-lg shadow-black/10"
            >
              <Plus className="size-4" /> New
            </button>
          </div>
        </div>
        {emailTest && (
          <div className="mx-auto max-w-6xl px-5 pb-4">
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm font-semibold ${emailTest.ok ? "text-emerald-600" : "text-red-600"}`}>
                  {emailTest.summary}
                </p>
                <button
                  onClick={() => setEmailTest(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
              </div>
              <ul className="mt-3 space-y-1.5">
                {emailTest.steps.map((s) => (
                  <li key={s.label} className="flex gap-2 text-xs">
                    <span
                      className={
                        s.status === "pass"
                          ? "text-emerald-600"
                          : s.status === "warn"
                            ? "text-amber-600"
                            : "text-red-600"
                      }
                    >
                      {s.status === "pass" ? "✓" : s.status === "warn" ? "!" : "✕"}
                    </span>
                    <span className="font-medium">{s.label}:</span>
                    <span className="text-muted-foreground">{s.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:py-20">

        <div className="max-w-2xl">
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-gradient">Your Resumes</h1>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Manage your professional stories. Every version is saved privately in your browser's secure storage.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 glass-strong rounded-3xl p-12 sm:p-20 text-center border border-border/50 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />
            <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-xl shadow-primary/20 relative z-10">
              <FileText className="size-8 text-primary-foreground" />
            </div>
            <h2 className="mt-8 text-2xl font-bold relative z-10">You haven't created a resume yet.</h2>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto relative z-10">
              Start a conversation with Aaruba and build your first professional resume with Talk2YN.
            </p>
            <button
              onClick={openNew}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-3 font-bold hover:scale-[1.05] transition shadow-xl relative z-10"
            >
              Talk to Aaruba <ArrowRight className="size-4" />
            </button>

          </div>
        ) : (
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((r) => {
              const score = estimateCompleteness(r.data);
              return (
                <div key={r.id} className="group glass-strong rounded-2xl p-6 hover:-translate-y-1.5 transition-all duration-300 border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl">
                  <div className="flex items-start justify-between mb-6">
                    <div className="min-w-0">
                      <div className="font-bold text-lg truncate group-hover:text-primary transition-colors">{r.name}</div>
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {r.data.personalInfo.headline || "Draft resume"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Delete this resume permanently?")) {
                          deleteResume(r.id);
                          refresh();
                        }
                      }}
                      title="Delete resume"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                        <span>Completeness</span>
                        <span className="text-foreground">{score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" 
                          style={{ width: `${Math.max(6, score)}%` }} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {new Date(r.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="size-3" />
                        Private
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => openExisting(r.id)}
                        className="flex-1 text-xs font-bold rounded-full bg-ink text-paper px-4 py-2.5 hover:opacity-90 transition shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setActiveId(r.id); navigate({ to: "/build" }); }}
                        className="flex-1 text-xs font-bold rounded-full glass px-4 py-2.5 hover:bg-ink/5 transition shadow-sm border border-border/50"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
