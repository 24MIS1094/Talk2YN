import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  MapPin,
  Send,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  Loader2,
  Heart,
} from "lucide-react";
import { ADMIN, CONTACT_CATEGORIES, FAQS, isPlaceholderContact } from "@/lib/contact-info";
import { sendContactMessage } from "@/lib/contact.functions";

const title = "Contact Admin — Talk2YN Support";
const desc =
  "Reach the developer of Talk2YN directly for help, bug reports, feature ideas, resume questions or career guidance.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

const contactItems = [
  { icon: Mail, label: "Email", value: ADMIN.email, href: `mailto:${ADMIN.email}` },
  { icon: Phone, label: "Phone", value: ADMIN.phone, href: `tel:${ADMIN.phone.replace(/\s/g, "")}` },
  { icon: Globe, label: "Portfolio", value: ADMIN.portfolio.replace(/^https?:\/\//, ""), href: ADMIN.portfolio },
  { icon: Linkedin, label: "LinkedIn", value: "Connect on LinkedIn", href: ADMIN.linkedin },
  { icon: Github, label: "GitHub", value: "View code on GitHub", href: ADMIN.github },
  { icon: Instagram, label: "Instagram", value: "Follow on Instagram", href: ADMIN.instagram },
  { icon: Twitter, label: "X (Twitter)", value: "Follow on X", href: ADMIN.x },
  { icon: MapPin, label: "Location", value: ADMIN.location, href: null as string | null },
].filter((i) => i.href === null || !isPlaceholderContact(i.href));

const quickActions = [
  { icon: Mail, label: "Email admin", href: `mailto:${ADMIN.email}` },
  { icon: Phone, label: "Call admin", href: `tel:${ADMIN.phone.replace(/\s/g, "")}` },
  { icon: Linkedin, label: "Open LinkedIn", href: ADMIN.linkedin },
  { icon: Github, label: "Open GitHub", href: ADMIN.github },
  { icon: Globe, label: "Visit portfolio", href: ADMIN.portfolio },
].filter((a) => !isPlaceholderContact(a.href));

function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    category: CONTACT_CATEGORIES[0] as string,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.email.trim() || !form.subject.trim()) {
      setError("Please fill in your name, email and subject.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.message.trim().length < 5) {
      setError("Please write a slightly longer message.");
      return;
    }

    setStatus("sending");
    try {
      const res = await sendContactMessage({ data: form });
      if (!res.ok) {
        setError(res.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Could not reach the server. Please try again.");
      setStatus("idle");
    }
  }

  const initials = ADMIN.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-30 animate-float"
          style={{ background: "radial-gradient(circle, #e84393 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-10 md:py-16">
        <Link
          to="/start"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>

        <header className="mt-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Talk2YN support
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Contact Admin</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            Need help, found a bug, or have an idea? Message the developer directly — every message
            is read personally.
          </p>
        </header>

        {/* Admin profile */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 rounded-3xl glass-ember p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start"
        >
          <div
            className="size-20 rounded-2xl shrink-0 grid place-items-center text-xl font-semibold text-white overflow-hidden shadow-[0_18px_45px_-18px_rgba(255,107,53,0.9)]"
            style={{ background: "var(--gradient-ember)" }}
          >
            {ADMIN.photo ? (
              <img src={ADMIN.photo} alt={`${ADMIN.name}, ${ADMIN.role}`} className="size-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">{ADMIN.name}</h2>
            <div className="text-[11px] uppercase tracking-widest text-[color:var(--ember)] mt-1">
              {ADMIN.role}
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl">{ADMIN.bio}</p>
          </div>
        </motion.section>

        {/* Quick actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              target={a.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs hover:border-white/40 hover:-translate-y-0.5 transition"
            >
              <a.icon className="size-3.5 text-[color:var(--ember)]" />
              {a.label}
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] items-start">
          {/* Contact information */}
          <section className="rounded-3xl glass p-5 md:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Contact information
            </h2>
            <ul className="mt-4 grid gap-2">
              {contactItems.map((item) => {
                const inner = (
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="size-9 rounded-xl grid place-items-center bg-white/5 border border-white/10 shrink-0">
                      <item.icon className="size-4 text-[color:var(--ember)]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="block text-sm truncate">{item.value}</span>
                    </span>
                  </span>
                );
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="block rounded-2xl px-3 py-2.5 border border-transparent hover:border-white/15 hover:bg-white/5 transition"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="rounded-2xl px-3 py-2.5">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Message form */}
          <section className="rounded-3xl glass p-5 md:p-6">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center"
                >
                  <CheckCircle2 className="size-10 mx-auto text-[color:var(--ember)]" />
                  <h2 className="mt-4 text-lg font-semibold">Message received</h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting the Talk2YN team. Your message has been received. We
                    will get back to you as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        fullName: "",
                        email: "",
                        subject: "",
                        category: CONTACT_CATEGORIES[0] as string,
                        message: "",
                      });
                      setStatus("idle");
                    }}
                    className="mt-6 rounded-full glass px-5 py-2 text-xs hover:border-white/40 transition"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={submit}
                  className="grid gap-3"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Send a message
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Full name">
                      <input
                        value={form.fullName}
                        onChange={(e) => set("fullName")(e.target.value)}
                        maxLength={100}
                        placeholder="Your name"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Email address">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email")(e.target.value)}
                        maxLength={255}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Subject">
                    <input
                      value={form.subject}
                      onChange={(e) => set("subject")(e.target.value)}
                      maxLength={150}
                      placeholder="What is this about?"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Category">
                    <div className="relative">
                      <select
                        value={form.category}
                        onChange={(e) => set("category")(e.target.value)}
                        className={`${inputCls} appearance-none pr-9`}
                      >
                        {CONTACT_CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-background text-foreground">
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                    </div>
                  </Field>

                  <Field label="Message">
                    <textarea
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                      maxLength={4000}
                      rows={5}
                      placeholder="Tell me what you need help with…"
                      className={`${inputCls} resize-y min-h-28`}
                    />
                  </Field>

                  {error && <p className="text-xs text-red-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-1 w-full rounded-2xl px-5 py-3.5 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.005] active:scale-[0.995] transition disabled:opacity-60 shadow-[0_18px_45px_-20px_rgba(255,107,53,0.9)]"
                    style={{ background: "var(--gradient-ember)" }}
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" /> Send message
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* FAQ */}
        <section className="mt-8 rounded-3xl glass p-5 md:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Frequently asked
          </h2>
          <div className="mt-4 grid gap-2">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="rounded-2xl border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-white/5 transition"
                  >
                    {f.q}
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5">
            Made with <Heart className="size-3.5 text-[color:var(--ember)]" /> by{" "}
            <span className="text-foreground font-medium">{ADMIN.name}</span>
          </p>
          <p className="mt-1">Founder of Talk2YN</p>
          <p className="mt-1">© 2026 Talk2YN</p>
        </footer>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:border-[color:var(--ember)] transition placeholder:text-muted-foreground/70";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
