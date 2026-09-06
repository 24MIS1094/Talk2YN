import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  MailCheck,
  
  Sparkles,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { signUpSchema } from "@/lib/auth.functions";

export const Route = createFileRoute("/auth")({
  ssr: false,

  head: () => ({
    meta: [
      { title: "Sign in — Talk2YN" },
      {
        name: "description",
        content:
          "Create your free Talk2YN account or sign in. Your details are saved so you can pick up where you left off.",
      },
      { property: "og:title", content: "Sign in — Talk2YN" },
      {
        property: "og:description",
        content: "Create your Talk2YN account or sign in to keep building your resume with Aaruba.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const PERKS = [
  { title: "Talk, don't type", body: "Aaruba interviews you in plain English and writes the resume." },
  { title: "Live ATS score", body: "See exactly what recruiters' filters will think — before you send it." },
  { title: "12 resume formats", body: "From ATS-safe classics to Indian biodata formats, previewed live." },
];

const ROTATING = ["conversation.", "a few minutes.", "your own words.", "zero formatting."];

const EASE = [0.22, 1, 0.36, 1] as const;

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [emailTaken, setEmailTaken] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [wordIndex, setWordIndex] = useState(0);


  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % ROTATING.length), 2600);
    return () => clearInterval(id);
  }, []);

  // Already signed in? Never show the login screen (e.g. browser Back after signing in).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!cancelled && data.user) navigate({ to: "/start", replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);


  // cinematic cursor spotlight
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useSpring(useMotionValue(0.5), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0.5), { stiffness: 60, damping: 20 });
  const sx = useTransform(mx, (v) => `${v * 100}%`);
  const sy = useTransform(my, (v) => `${v * 100}%`);


  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function switchMode(m: "signin" | "signup" | "forgot") {
    setMode(m);
    setError(null);
    setFieldErrors({});
    setNotice(null);
    setEmailTaken(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setNotice(null);
    setEmailTaken(false);
    setBusy(true);
    try {
      if (mode === "forgot") {
        const email = form.email.trim().toLowerCase();
        if (!email.includes("@")) {
          setFieldErrors({ email: "Enter the email you signed up with." });
          return;
        }

        const redirectTo = `${window.location.origin}/reset-password`;
        console.info("[Supabase Auth] Requesting password reset", { email, redirectTo });
        const { error: sendError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });
        if (sendError) {
          console.error("[Supabase Auth] Password reset request failed", {
            email,
            redirectTo,
            error: sendError,
          });
          setError(sendError.message);
          return;
        }
        console.info("[Supabase Auth] Password reset request accepted", { email, redirectTo });
        setNotice(`Check ${email} for a password reset link.`);
        return;
      }

      if (mode === "signup") {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          const next: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? "form");
            if (!next[key]) next[key] = issue.message;
          }
          setFieldErrors(next);
          setError("Please fix the highlighted fields.");
          return;
        }
        const email = parsed.data.email.trim().toLowerCase();
        console.info("[Supabase Auth] Creating account", { email });
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password: parsed.data.password,
          options: {
            data: {
              full_name: parsed.data.fullName,
              username: parsed.data.username,
            },
          },
        });
        if (signUpError) {
          console.error("[Supabase Auth] Signup failed", {
            email,
            error: signUpError,
          });
          setError(signUpError.message);
          if (/already|registered/i.test(signUpError.message)) setEmailTaken(true);
          return;
        }
        if (!data.user || data.user.identities?.length === 0) {
          console.error("[Supabase Auth] Signup returned no new identity", {
            email,
            userId: data.user?.id,
          });
          setError("An account with this email already exists.");
          setEmailTaken(true);
          return;
        }
        if (!data.session) {
          console.info("[Supabase Auth] Signup accepted; email confirmation is required", {
            email,
            userId: data.user.id,
          });
          setNotice("Account created. Check your email to confirm your account, then sign in.");
          return;
        }
        console.info("[Supabase Auth] Signup accepted; session created", {
          email,
          userId: data.user.id,
        });
      }


      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });
      if (signInError || !data.user) {
        console.error("[Supabase Auth] Sign-in failed", {
          email: form.email.trim(),
          error: signInError,
        });
        setError(
          /invalid login/i.test(signInError?.message ?? "")
            ? "Wrong email or password. Forgot it? Reset it below."
            : (signInError?.message ?? "Could not sign in."),
        );
        return;
      }

      console.info("[Supabase Auth] Sign-in accepted", {
        email: form.email.trim(),
        userId: data.user.id,
      });
      navigate({ to: "/start", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";


  return (
    <div
      ref={stageRef}
      onMouseMove={(e) => {
        const r = stageRef.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground"
    >
      {/* ── cinematic backdrop ─────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* slow drifting aurora */}
        <motion.div
          animate={{ x: [0, 60, -20, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-52 -left-40 size-[42rem] rounded-full opacity-30 blur-[140px] bg-[var(--gradient-ember)]"
        />
        <motion.div
          animate={{ x: [0, -70, 30, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.2, 1] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-64 -right-32 size-[40rem] rounded-full opacity-30 blur-[150px] bg-[var(--gradient-cool)]"
        />
        <motion.div
          animate={{ opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/3 size-[30rem] -translate-x-1/2 rounded-full bg-amber blur-[170px]"
        />

        {/* cursor spotlight */}
        <motion.div
          style={{ left: sx, top: sy }}
          className="absolute size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.10] blur-[120px] bg-ember"
        />


        {/* grid + vignette + film grain */}
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--ink)_100%)]" />
        <motion.div
          animate={{ opacity: [0.05, 0.09, 0.05] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="absolute inset-0 mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.5%22/></svg>')]"
        />

        {/* floating embers */}
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute size-1 rounded-full bg-ember"
            style={{ left: `${(i * 7.3 + 4) % 100}%`, bottom: "-4%" }}
            animate={{ y: [0, -700 - (i % 5) * 90], opacity: [0, 0.7, 0] }}
            transition={{
              duration: 14 + (i % 6) * 3,
              repeat: Infinity,
              delay: i * 1.4,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* cinematic letterbox bars */}
      <motion.div
        aria-hidden
        initial={{ height: "50dvh" }}
        animate={{ height: 0 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-ink"
      />
      <motion.div
        aria-hidden
        initial={{ height: "50dvh" }}
        animate={{ height: 0 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-ink"
      />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-6xl grid-cols-1 gap-0 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* Brand side */}
        <section className="flex flex-col justify-between py-6 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
            className="flex items-center justify-between"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-ember/50 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Home
            </Link>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="grid size-6 place-items-center rounded-md bg-ember font-display text-xs font-bold text-cream">
                T
              </div>
              <span className="font-display text-base font-bold tracking-tight">Talk2YN</span>
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.7, ease: EASE }}
              className="mb-8 flex items-center gap-2.5"
            >
              <motion.div
                animate={{ boxShadow: ["0 0 0 0 rgba(255,107,53,0.45)", "0 0 0 16px rgba(255,107,53,0)"] }}
                transition={{ duration: 2.6, repeat: Infinity }}
                className="grid size-9 place-items-center rounded-xl bg-ember font-display font-bold text-cream"
              >
                T
              </motion.div>
              <span className="font-display text-2xl font-bold tracking-tight">Talk2YN</span>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-sm"
            >
              <Sparkles className="size-3 text-ember" /> Invite-only · free
            </motion.span>

            <h2 className="mt-5 max-w-lg font-display text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl">
              <motion.span
                initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
                className="block"
              >
                A resume built by
              </motion.span>
              <span className="relative mt-1 block h-[1.15em] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ROTATING[wordIndex]}
                    initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-110%", opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.62, ease: EASE }}
                    className="absolute inset-x-0 bg-[var(--gradient-sunset)] bg-clip-text text-transparent"
                  >
                    {ROTATING[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>

            <ul className="mt-10 space-y-5">
              {PERKS.map((p, i) => (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, x: -18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ delay: 1.3 + i * 0.14, duration: 0.6, ease: EASE }}
                  className="group flex gap-3.5"
                >
                  <span className="mt-2 h-px w-6 shrink-0 bg-[var(--gradient-ember)] transition-all duration-500 group-hover:w-10" />
                  <div>
                    <p className="font-display text-sm font-bold">{p.title}</p>
                    <p className="mt-0.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="hidden text-xs text-muted-foreground lg:block"
          >
            Every account is reviewed by a human. You'll hear back by email.
          </motion.p>
        </section>

        {/* Form side */}
        <section className="flex items-center py-6 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.85, duration: 0.9, ease: EASE }}
            className="w-full"
          >
            <div className="relative rounded-[1.75rem] p-[1px] bg-[linear-gradient(140deg,rgba(255,107,53,0.55),rgba(232,67,147,0.18)_40%,transparent_70%)]">
              <div className="glass-strong rounded-[1.7rem] p-6 backdrop-blur-2xl sm:p-8">
                {/* segmented toggle */}
                <div className="relative mb-7 grid grid-cols-2 rounded-full border border-border/60 bg-background/40 p-1 text-sm font-semibold">
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-[var(--gradient-ember)] shadow-[var(--shadow-ember)]"
                    style={{ left: isSignup ? "calc(50% + 0rem)" : "0.25rem" }}
                  />
                  {(["signin", "signup"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => switchMode(m)}
                      className={`relative z-10 rounded-full py-2 transition-colors ${
                        mode === m ? "text-cream" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m === "signin" ? "Sign in" : "Create account"}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      {isForgot ? "Reset your password" : isSignup ? "Let's get you in" : "Welcome back"}
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {isForgot
                        ? "Enter your email and we'll send you a secure reset link."
                        : isSignup
                          ? "Pick a username and password — you're in straight away."
                          : "Sign in to continue building with Aaruba."}
                    </p>
                  </motion.div>
                </AnimatePresence>


                <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
                  <AnimatePresence initial={false}>
                    {isSignup && (
                      <motion.div
                        key="extra"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.36, ease: EASE }}
                        className="space-y-3.5 overflow-hidden"
                      >
                        <Field
                          icon={UserRound}
                          label="Full name"
                          value={form.fullName}
                          onChange={set("fullName")}
                          placeholder="Ankita Kumari"
                          autoComplete="name"
                        />
                        <Field
                          icon={User}
                          label="Username"
                          value={form.username}
                          onChange={set("username")}
                          placeholder="ankita_k"
                          hint="3–20 characters · starts with a letter · a–z 0–9 _"
                          autoComplete="username"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Field
                    icon={AtSign}
                    label="Email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                  />

                  {!isForgot && (
                    <Field
                      icon={KeyRound}
                      label={isForgot ? "New password" : "Password"}
                      value={form.password}
                      onChange={set("password")}

                      placeholder="At least 8 characters"
                      type={showPw ? "text" : "password"}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          aria-label={showPw ? "Hide password" : "Show password"}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      }
                    />
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0, x: [0, -6, 5, -3, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ x: { duration: 0.4 } }}
                        className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                      >
                        {error}
                        {emailTaken && (
                          <button
                            type="button"
                            onClick={() => switchMode("signin")}
                            className="mt-2 block font-semibold underline underline-offset-4"
                          >
                            Sign in with this email instead
                          </button>
                        )}
                      </motion.div>
                    )}
                    {notice && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground"
                      >
                        <MailCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                        {notice}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={busy}
                    className="group relative mt-1 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--gradient-ember)] px-5 py-3.5 font-display font-bold text-cream shadow-[var(--shadow-ember)] transition-transform hover:scale-[1.015] active:scale-[0.99] disabled:opacity-60"
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-cream/25 blur-md transition-transform duration-700 group-hover:translate-x-[400%]" />
                    {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                    {isForgot ? "Send reset link" : isSignup ? "Create account" : "Sign in"}
                    {!busy && (
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
                    {isForgot ? (
                      <button
                        type="button"
                        onClick={() => switchMode("signin")}
                        className="font-semibold text-foreground underline underline-offset-4"
                      >
                        Back to sign in
                      </button>
                    ) : isSignup ? (

                      <span>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("signin")}
                          className="font-semibold text-foreground underline underline-offset-4"
                        >
                          Sign in
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="font-semibold text-foreground underline underline-offset-4"
                      >
                        Forgot your password?
                      </button>
                    )}
                  </div>
                </form>


                <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary" /> Free forever — no approval, no
                  waiting.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  icon: Icon,
  trailing,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <div className="group mt-1.5 flex items-center gap-2.5 rounded-2xl border border-border/60 bg-background/50 px-4 transition-all focus-within:border-ember/70 focus-within:bg-background/70 focus-within:shadow-[0_0_0_4px_rgba(255,107,53,0.10)]">
        <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-ember" />
        <input
          {...props}
          required
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/60"
        />
        {trailing}
      </div>
      {hint && <span className="mt-1.5 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
