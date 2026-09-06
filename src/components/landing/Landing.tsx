import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
  FileCheck2,
  FileText,
  Layers,
  Layout,
  MessageSquareText,
  Mic,
  Palette,
  PenLine,
  Rocket,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

/* ---------- Brand mark ---------- */
function Mark({ className = "size-8" }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-lg bg-chrome grid place-items-center font-display font-extrabold text-[#0a0a0c] transition-transform group-hover:rotate-12`}
    >
      A
    </div>
  );
}

/* ---------- Ambient aurora backdrop ---------- */
function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full bg-[#c4b5fd] opacity-20 blur-[140px] animate-drift" />
      <div
        className="absolute bottom-[10%] -right-[5%] w-[45%] h-[45%] rounded-full bg-[#67e8f9] opacity-20 blur-[140px] animate-drift"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="absolute top-[25%] right-[15%] w-[30%] h-[30%] rounded-full bg-[#818cf8] opacity-15 blur-[120px] animate-drift"
        style={{ animationDelay: "-8s" }}
      />
    </div>
  );
}

/* ---------- Mouse-following ambient glow ---------- */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-10 h-[500px] w-[500px] rounded-full opacity-40 blur-[100px] transition-transform duration-300 ease-out"
      style={{ background: "radial-gradient(circle, rgba(196,181,253,0.35), rgba(103,232,249,0.15) 45%, transparent 70%)" }}
    />
  );
}

/* ---------- Sticky nav ---------- */
function Nav() {
  return (
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50 flex items-center justify-between px-3 sm:px-5 py-2.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-2 group pl-1">
        <Mark className="size-7" />
        <span className="font-display font-extrabold text-lg tracking-tight text-gradient">Talk2YN</span>
      </Link>
      <div className="hidden md:flex items-center gap-7 text-sm font-medium text-white/60">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how" className="hover:text-white transition-colors">How it works</a>
        <Link to="/templates" className="hover:text-white transition-colors">Templates</Link>
        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/auth" className="text-sm text-white/70 hover:text-white transition-colors">
          Sign in
        </Link>
        <Link
          to="/build"
          className="rounded-full bg-white text-[#0a0a0c] px-4 py-1.5 text-sm font-semibold hover:scale-[1.03] transition"
        >
          Talk to Aaruba

        </Link>
      </div>

    </nav>
  );
}

/* ---------- Animated hero illustration ----------
   Conversation → AI Understanding → Writing → Formats → Suggestions
--------------------------------------------------------- */
function HeroFlow() {
  const stages = [
    { icon: MessageSquareText, label: "Interview" },
    { icon: BrainCircuit, label: "Understand" },
    { icon: PenLine, label: "Write" },
    { icon: Layout, label: "Formats" },
    { icon: Sparkles, label: "Improve" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % stages.length), 1600);
    return () => clearInterval(id);
  }, [stages.length]);

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 overflow-hidden">
      {/* soft interior glow */}
      <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(600px 300px at 30% 20%, rgba(196,181,253,0.18), transparent 60%), radial-gradient(500px 300px at 80% 80%, rgba(103,232,249,0.15), transparent 60%)" }} />

      <div className="relative">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#67e8f9] animate-pulse" /> Aaruba flow
          </span>
          <span>Live</span>
        </div>

        {/* stage row */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
          {stages.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === active;
            const isDone = i < active;
            return (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div
                  className={`size-10 sm:size-12 rounded-2xl grid place-items-center border transition-all duration-500 ${
                    isActive
                      ? "bg-chrome border-transparent scale-110 shadow-[0_0_30px_rgba(196,181,253,0.5)]"
                      : isDone
                      ? "bg-white/10 border-white/20"
                      : "bg-white/[0.02] border-white/10"
                  }`}
                >
                  <Icon className={`size-4 sm:size-5 ${isActive ? "text-[#0a0a0c]" : "text-white/70"}`} />
                </div>
                <span className={`text-[10px] sm:text-xs transition-colors ${isActive ? "text-white" : "text-white/40"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* progress track */}
        <div className="relative h-[3px] w-full bg-white/5 rounded-full overflow-hidden mb-6">
          <div
            className="absolute inset-y-0 left-0 bg-chrome rounded-full transition-all duration-700"
            style={{ width: `${((active + 1) / stages.length) * 100}%` }}
          />
        </div>

        {/* mini chat preview */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
          <div className="flex gap-2">
            <div className="size-7 rounded-full bg-chrome grid place-items-center shrink-0">
              <Bot className="size-3.5 text-[#0a0a0c]" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white/[0.06] px-3.5 py-2 text-sm text-white/85 max-w-[85%]">
              What role are you targeting next?
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <div className="rounded-2xl rounded-tr-sm bg-white text-[#0a0a0c] px-3.5 py-2 text-sm max-w-[85%]">
              Senior product designer at a fintech.
            </div>
          </div>
          <div className="flex gap-2">
            <div className="size-7 rounded-full bg-chrome grid place-items-center shrink-0">
              <Bot className="size-3.5 text-[#0a0a0c]" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white/[0.06] px-3.5 py-2 text-sm text-white/60 max-w-[85%] flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-white/60 animate-bounce" />
              <span className="size-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="size-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-20 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70 backdrop-blur mb-6">
            <Sparkles className="size-3 text-[#c4b5fd]" />
            Talk2YN · Powered by Aaruba AI
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-white">
            Talk to <span className="text-gradient italic font-serif font-normal">Aaruba.</span>
            <br />
            Get your resume &amp; her suggestions.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
            One simple conversation. Aaruba asks easy questions in plain English, builds your
            resume live as you answer, then tells you exactly what to improve — your ATS score,
            weak lines to fix, and the skills and roles to aim for next.
          </p>


          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/build"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0a0a0c] px-6 py-3 font-semibold text-sm hover:scale-[1.03] transition shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
            >
              Talk to Aaruba <ArrowRight className="size-4" />

            </Link>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] text-white px-6 py-3 font-semibold text-sm hover:bg-white/[0.08] transition"
            >
              Explore Resume Templates <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/45">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-[#67e8f9]" /> Live resume while you talk</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-[#67e8f9]" /> Real ATS score &amp; fixes</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-[#67e8f9]" /> 12 resume formats · live preview</span>
          </div>

        </div>

        <div className="relative">
          <HeroFlow />
        </div>
      </div>
    </section>
  );
}

/* ---------- Primary feature cards ---------- */
function Primary() {
  const items = [
    {
      icon: MessageSquareText,
      title: "Talk to Aaruba",
      desc: "Simple questions, one at a time, in plain English. Type or speak — no forms.",
    },
    {
      icon: FileText,
      title: "Watch It Build Live",
      desc: "Your resume writes itself beside the chat as you answer, in any of 12 templates.",
    },
    {
      icon: Sparkles,
      title: "Get Aaruba's Suggestions",
      desc: "ATS score, what's missing, weak lines to fix, and the skills to learn next.",
    },
  ];

  return (
    <section id="features" className="relative px-5 sm:px-8 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4 sm:gap-5">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div
              key={it.title}
              className="group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 overflow-hidden hover:border-white/25 transition"
            >
              <div className="absolute -top-24 -right-24 size-56 rounded-full bg-[#c4b5fd] opacity-0 group-hover:opacity-15 blur-3xl transition-opacity" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6">0{i + 1}</div>
                <div className="size-11 rounded-2xl bg-white/[0.05] border border-white/10 grid place-items-center mb-5 group-hover:bg-chrome group-hover:border-transparent transition-colors">
                  <Icon className="size-5 text-white group-hover:text-[#0a0a0c] transition-colors" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{it.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Everything You Need To Get Hired ---------- */
function EverythingYouNeed() {
  const items = [
    { icon: MessageSquareText, title: "Talk, Don't Type Forms", desc: "Aaruba asks one easy question at a time, with tap-to-answer suggestions." },
    { icon: Mic, title: "Voice Answers", desc: "Speak your answer instead of typing — Aaruba listens and writes it down." },
    { icon: FileText, title: "Live Resume Preview", desc: "Every answer appears in your resume instantly, right beside the chat." },
    { icon: Sparkles, title: "Aaruba's Suggestions", desc: "Tap 'Find it out' and she tells you what's missing and what to fix." },
    { icon: BarChart3, title: "AI Resume Score", desc: "Structured feedback on impact, clarity, and completeness." },
    { icon: ScanLine, title: "Real ATS Score Predictor", desc: "Rule-based scoring like real screening tools — not a random number." },
    { icon: Wand2, title: "AI Rewrite Any Line", desc: "Turn plain answers into strong action-verb bullets, facts untouched." },
    { icon: Target, title: "Job Description Match", desc: "Paste a job post and see which keywords your resume is missing." },
    { icon: Rocket, title: "Career Growth Plan", desc: "Roles to target, skills to learn, and projects to build next." },
    { icon: Layers, title: "12 Resume Formats", desc: "Classic Indian biodata to modern one-page CVs — content adapts instantly." },
    { icon: Palette, title: "Portfolio Page", desc: "Turn your projects into a shareable portfolio alongside your resume." },
    { icon: GraduationCap, title: "Gap Coaching", desc: "Missing certificates or languages? Aaruba names exactly what to add." },
  ];

  return (
    <section className="relative px-5 sm:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">The full toolkit</div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Everything You Need
            <br />
            <span className="text-gradient italic font-serif font-normal">To Get Hired</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/25 hover:bg-white/[0.05] transition-all"
              >
                <div className="size-10 rounded-xl border border-white/10 bg-black/40 grid place-items-center mb-4 group-hover:bg-chrome group-hover:border-transparent transition-colors">
                  <Icon className="size-4.5 text-white group-hover:text-[#0a0a0c] transition-colors" />
                </div>
                <h3 className="font-display text-base font-bold text-white mb-1.5">{it.title}</h3>
                <p className="text-[13px] text-white/55 leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */
function HowItWorks() {
  const steps = [
    { icon: MessageSquareText, title: "Aaruba Asks, You Answer", desc: "Short, simple questions. Tap a suggestion, type, or just speak." },
    { icon: BrainCircuit, title: "She Understands You", desc: "Aaruba pulls out your education, projects, skills, and experience." },
    { icon: PenLine, title: "Your Resume Writes Itself", desc: "Answers become clean, action-verb lines — live, as you talk." },
    { icon: Sparkles, title: "Ask 'Find It Out'", desc: "Aaruba reviews your resume and tells you exactly what to improve." },
    { icon: ShieldCheck, title: "Check Your ATS Score", desc: "A real rule-based score with the fixes that raise it." },
    { icon: Layout, title: "Pick a Template", desc: "12 layouts, classic Indian biodata to modern one-page CVs." },
    { icon: Layers, title: "Explore Resume Formats", desc: "See your details rendered in every format, side by side." },
  ];

  return (
    <section id="how" className="relative px-5 sm:px-8 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">How it works</div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            A simple conversation
            <br />
            <span className="text-gradient italic font-serif font-normal">is all it takes.</span>
          </h2>
        </div>

        <div className="relative">
          {/* timeline spine */}
          <div className="absolute left-5 sm:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          <ol className="space-y-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const right = i % 2 === 1;
              return (
                <li key={s.title} className="relative grid sm:grid-cols-2 sm:gap-8 items-center">
                  {/* dot */}
                  <div className="absolute left-5 sm:left-1/2 -translate-x-1/2 size-3 rounded-full bg-chrome ring-4 ring-[#0a0a0c]" />
                  <div className={`pl-14 sm:pl-0 ${right ? "sm:col-start-2 sm:pl-8" : "sm:pr-8 sm:text-right"}`}>
                    <div className="inline-flex sm:inline-block rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/25 transition">
                      <div className={`flex items-center gap-3 mb-2 ${right ? "" : "sm:flex-row-reverse"}`}>
                        <div className="size-9 rounded-xl bg-chrome grid place-items-center shrink-0">
                          <Icon className="size-4 text-[#0a0a0c]" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Step {String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">{s.title}</h3>
                      <p className="text-sm text-white/55 mt-1 max-w-sm">{s.desc}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- Template previews ---------- */
type TemplateSpec = {
  name: string;
  best: string;
  ats?: boolean;
  recommended?: boolean;
  accent: string;
  layout: "classic" | "modern" | "executive" | "minimal" | "developer" | "creative" | "student";
};

function TemplateThumb({ layout }: { layout: TemplateSpec["layout"] }) {
  // Realistic, distinct blurred resume layouts — no placeholder names.
  const Bar = ({ w = "100%", h = 6, o = 0.7 }: { w?: string; h?: number; o?: number }) => (
    <div className="rounded-full bg-[#0a0a0c]/70" style={{ width: w, height: h, opacity: o }} />
  );
  const Line = ({ w = "100%" }: { w?: string }) => (
    <div className="rounded-full bg-[#0a0a0c]/25" style={{ width: w, height: 4 }} />
  );

  if (layout === "classic") {
    return (
      <div className="h-full w-full bg-[#f6f4ef] p-5 flex flex-col gap-3">
        <div className="text-center flex flex-col items-center gap-1.5">
          <Bar w="55%" h={9} />
          <Line w="35%" />
        </div>
        <div className="h-px bg-[#0a0a0c]/25 my-1" />
        {[0, 1, 2].map((s) => (
          <div key={s} className="space-y-1.5">
            <Bar w="30%" h={5} />
            <Line w="95%" />
            <Line w="88%" />
            <Line w="75%" />
          </div>
        ))}
      </div>
    );
  }
  if (layout === "modern") {
    return (
      <div className="h-full w-full bg-[#faf9f6] p-5 grid grid-cols-[1fr_1.6fr] gap-3">
        <div className="bg-[#0a0a0c] rounded-md p-3 flex flex-col gap-2">
          <Bar w="80%" h={7} o={1} />
          <div className="rounded-full bg-white/70" style={{ height: 3, width: "60%" }} />
          <div className="mt-2 space-y-1.5">
            {[70, 55, 65, 50].map((w, i) => <div key={i} className="rounded-full bg-white/40" style={{ height: 3, width: `${w}%` }} />)}
          </div>
        </div>
        <div className="space-y-2.5">
          <Bar w="50%" h={7} />
          {[0, 1].map((s) => (
            <div key={s} className="space-y-1.5">
              <Bar w="35%" h={4} />
              <Line w="92%" />
              <Line w="80%" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (layout === "executive") {
    return (
      <div className="h-full w-full bg-[#f5f3ee] p-5 flex flex-col gap-3 font-serif">
        <Bar w="65%" h={11} />
        <div className="h-[2px] bg-[#0a0a0c]/60 w-16" />
        <Line w="42%" />
        <div className="mt-2 space-y-2">
          {[0, 1].map((s) => (
            <div key={s} className="space-y-1.5">
              <Bar w="28%" h={5} />
              <Line w="95%" />
              <Line w="90%" />
              <Line w="82%" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (layout === "minimal") {
    return (
      <div className="h-full w-full bg-white p-6 flex flex-col gap-4">
        <Bar w="35%" h={7} />
        <div className="grid grid-cols-2 gap-6 mt-2">
          <div className="space-y-1.5"><Line w="100%" /><Line w="80%" /></div>
          <div className="space-y-1.5"><Line w="100%" /><Line w="70%" /></div>
        </div>
        <div className="space-y-1.5 mt-3"><Bar w="20%" h={4} /><Line w="95%" /><Line w="85%" /></div>
        <div className="space-y-1.5"><Bar w="20%" h={4} /><Line w="90%" /><Line w="75%" /></div>
      </div>
    );
  }
  if (layout === "developer") {
    return (
      <div className="h-full w-full bg-[#0f0f10] p-4 font-mono text-[8px] text-[#67e8f9]/80 space-y-1.5">
        <div>~ /resume $</div>
        {["name: ****", "role: senior_engineer", "stack: [ts, react, node]", "", "## experience", "- shipped platform x", "- scaled service y", "- led team of 4", "", "## projects", "- open source cli"].map((l, i) => (
          <div key={i} className="opacity-80">{l}</div>
        ))}
      </div>
    );
  }
  if (layout === "creative") {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#f8e8ee] via-[#e8c5d0] to-[#c9a0dc] p-5 flex flex-col gap-3">
        <div className="rounded-2xl bg-white/70 p-3 space-y-1.5">
          <Bar w="55%" h={9} />
          <Line w="40%" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="aspect-square rounded-xl bg-white/60" />
          <div className="aspect-square rounded-xl bg-white/40" />
          <div className="aspect-square rounded-xl bg-white/60" />
        </div>
        <div className="space-y-1.5"><Line w="92%" /><Line w="78%" /></div>
      </div>
    );
  }
  // student
  return (
    <div className="h-full w-full bg-[#f0f4ff] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#818cf8]/70" />
        <div className="flex-1 space-y-1.5">
          <Bar w="55%" h={7} />
          <Line w="40%" />
        </div>
      </div>
      <div className="rounded-lg bg-white/70 p-2.5 space-y-1.5">
        <Bar w="30%" h={4} />
        <Line w="88%" />
        <Line w="75%" />
      </div>
      <div className="rounded-lg bg-white/70 p-2.5 space-y-1.5">
        <Bar w="35%" h={4} />
        <Line w="80%" />
      </div>
    </div>
  );
}

function TemplateGallery() {
  const templates: TemplateSpec[] = [
    { name: "ATS Classic", best: "Traditional roles & Fortune 500", ats: true, layout: "classic", accent: "#e8e4dd" },
    { name: "Modern Professional", best: "Tech, product, consulting", ats: true, recommended: true, layout: "modern", accent: "#c4b5fd" },
    { name: "Executive", best: "Leadership & senior roles", layout: "executive", accent: "#c9a84c" },
    { name: "Minimal Clean", best: "Design & editorial", ats: true, layout: "minimal", accent: "#ffffff" },
    { name: "Developer", best: "Engineering & data", ats: true, layout: "developer", accent: "#67e8f9" },
    { name: "Creative", best: "Design, marketing, agencies", layout: "creative", accent: "#f9a8d4" },
    { name: "Student & Fresher", best: "First job & internships", ats: true, layout: "student", accent: "#818cf8" },
  ];

  return (
    <section className="relative px-5 sm:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">The gallery</div>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Seven layouts.
              <br />
              <span className="text-gradient italic font-serif font-normal">One conversation.</span>
            </h2>
          </div>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] text-white px-5 py-2.5 text-sm font-semibold hover:bg-white/[0.08] transition"
          >
            See all templates <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {templates.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 hover:border-white/30 transition-all hover:-translate-y-1 duration-300"
            >
              {/* preview */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.06]">
                  <TemplateThumb layout={t.layout} />
                </div>
                {/* badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {t.ats && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-[#67e8f9] border border-[#67e8f9]/30">
                      <ShieldCheck className="size-3" /> ATS
                    </span>
                  )}
                  {t.recommended && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-[#c4b5fd] border border-[#c4b5fd]/30">
                      <Sparkles className="size-3" /> AI Pick
                    </span>
                  )}
                </div>
                {/* hover preview cta */}
                <div className="absolute inset-x-3 bottom-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to="/templates"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#0a0a0c] px-3 py-1.5 text-xs font-semibold"
                  >
                    Preview <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </div>
              {/* meta */}
              <div className="pt-4 px-1 pb-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-white">{t.name}</h3>
                  <div className="size-2 rounded-full" style={{ background: t.accent }} />
                </div>
                <p className="text-xs text-white/50 mt-0.5">Best for {t.best}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  return (
    <section className="relative px-5 sm:px-8 py-24">
      <div className="max-w-5xl mx-auto relative rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden p-10 sm:p-16 text-center">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-[#c4b5fd] opacity-15 blur-[120px]" />
        <div className="absolute -bottom-32 right-0 size-[400px] rounded-full bg-[#67e8f9] opacity-15 blur-[120px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/70 mb-6">
            <FileCheck2 className="size-3 text-[#67e8f9]" /> Talk · Build · Improve
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-white leading-[1.02] tracking-tight max-w-3xl mx-auto">
            One Conversation Away From A
            {" "}
            <span className="text-gradient italic font-serif font-normal">Better Resume.</span>
          </h2>
          <p className="mt-6 text-white/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Answer a few simple questions from Aaruba, watch your resume build itself,
            then take her suggestions and apply with confidence.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/build"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0a0a0c] px-6 py-3 font-semibold text-sm hover:scale-[1.03] transition shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
            >
              Talk to Aaruba <ArrowRight className="size-4" />

            </Link>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] text-white px-6 py-3 font-semibold text-sm hover:bg-white/[0.08] transition"
            >
              See Templates <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer
      className="relative px-5 sm:px-8 py-10 sm:py-12 border-t border-white/5"
      style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-6 text-sm text-white/40">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Mark className="size-6 shrink-0" />
          <span className="font-display font-bold text-white/70">Talk2YN</span>
          <span className="w-full sm:w-auto sm:ml-2 text-white/40">
            — Powered by Aaruba AI · Talk. Build. Improve.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/templates" className="hover:text-white transition-colors">Templates</Link>
          <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Root ---------- */
export default function Landing() {
  return (
    <div className="relative min-h-screen bg-void text-white overflow-hidden">
      <Aurora />
      <CursorGlow />
      <Nav />
      <main className="relative z-20">
        <Hero />
        <Primary />
        <EverythingYouNeed />
        <HowItWorks />
        <TemplateGallery />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}
