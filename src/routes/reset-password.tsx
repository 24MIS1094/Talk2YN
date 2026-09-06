import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AtSign, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — Talk2YN" },
      {
        name: "description",
        content:
          "Reset your Talk2YN password with the one-time code we emailed you, then set a new password.",
      },
      { property: "og:title", content: "Reset password — Talk2YN" },
      {
        property: "og:description",
        content: "Use your emailed one-time code to set a new Talk2YN password.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  // The email link signs the user in with a temporary recovery session.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("[Supabase Auth] Recovery code exchange failed", { error: exchangeError });
          setError(exchangeError.message);
        } else {
          console.info("[Supabase Auth] Recovery code exchanged successfully");
        }
      }
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (cancelled) return;
      if (sessionError) {
        console.error("[Supabase Auth] Recovery session lookup failed", { error: sessionError });
        setError(sessionError.message);
      }
      if (data.session) setVerified(true);
      setChecking(false);
    })();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setVerified(true);
      console.info("[Supabase Auth] Recovery auth state changed", {
        event,
        hasSession: Boolean(session),
      });
      setChecking(false);
    });
    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: "recovery",
      });
      if (verifyError) {
        console.error("[Supabase Auth] Recovery OTP verification failed", {
          email: email.trim().toLowerCase(),
          error: verifyError,
        });
        setError(
          /expired|invalid/i.test(verifyError.message)
            ? "That code is wrong or has expired. Request a new one."
            : verifyError.message,
        );
        return;
      }
      console.info("[Supabase Auth] Recovery OTP accepted", { email: email.trim().toLowerCase() });
      setVerified(true);
      setNotice("Code accepted. Choose a new password.");
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        console.error("[Supabase Auth] Password update failed", { error: updateError });
        setError(updateError.message);
        return;
      }
      console.info("[Supabase Auth] Password update accepted");
      setNotice("Password updated. Taking you in…");
      setTimeout(() => navigate({ to: "/dashboard" }), 900);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-background px-5 py-12">
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-[var(--gradient-ember)] opacity-20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-[1.75rem] p-[1px] bg-[linear-gradient(140deg,rgba(255,107,53,0.55),rgba(232,67,147,0.18)_40%,transparent_70%)]"
      >
        <div className="glass-strong rounded-[1.7rem] p-6 backdrop-blur-2xl sm:p-8">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {verified ? "Set a new password" : "Enter your code"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {verified
              ? "Pick something you'll remember — at least 8 characters."
              : "Paste the one-time code from your email, or just open the link we sent."}
          </p>

          {checking ? (
            <div className="mt-8 grid place-items-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : verified ? (
            <form onSubmit={savePassword} className="mt-6 space-y-3.5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  New password
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3.5 py-3">
                  <KeyRound className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>
              <Messages error={error} notice={notice} />
              <SubmitButton busy={busy} label="Save new password" />
            </form>
          ) : (
            <form onSubmit={verifyCode} className="mt-6 space-y-3.5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Email
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3.5 py-3">
                  <AtSign className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  One-time code
                </span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  inputMode="numeric"
                  placeholder="123456"
                  className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-3 text-center font-display text-lg tracking-[0.4em] outline-none placeholder:tracking-[0.4em] placeholder:text-muted-foreground/50"
                />
              </label>
              <Messages error={error} notice={notice} />
              <SubmitButton busy={busy} label="Verify code" />
            </form>
          )}

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            <Link to="/auth" className="underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Messages({ error, notice }: { error: string | null; notice: string | null }) {
  return (
    <>
      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
          {notice}
        </p>
      )}
    </>
  );
}

function SubmitButton({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--gradient-ember)] px-5 py-3.5 font-display font-bold text-cream shadow-[var(--shadow-ember)] transition-transform hover:scale-[1.015] active:scale-[0.99] disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : null}
      {label}
      {!busy && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
}
