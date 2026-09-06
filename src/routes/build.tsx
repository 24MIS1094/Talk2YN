import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  ArrowUp,
  ArrowLeft,
  
  Loader2,
  CheckCircle2,
  Eye,
  X,
  RotateCcw,
  Search,
  AlertCircle,
  Mic,
  MicOff,
  Paperclip,
  LayoutTemplate,
  Gauge,
  PencilLine,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

import { Drawer } from "vaul";
import { ResumeRender } from "@/components/resume/ResumeRender";
import {
  createResume,
  getActiveId,
  getResume,
  upsertResume,
} from "@/lib/resume-store";
import { emptyResume, estimateCompleteness, type ResumeData } from "@/lib/resume-schema";
import { useVoiceInput } from "@/lib/voice-input";
import { scoreResume } from "@/lib/ats-engine";

const buildTitle = "Talk to Aaruba — Build Your Resume Live | Talk2YN";
const buildDesc =
  "Answer simple questions from Aaruba and watch your resume write itself live, with instant ATS scoring and suggestions.";

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: buildTitle },
      { name: "description", content: buildDesc },
      { property: "og:title", content: buildTitle },
      { property: "og:description", content: buildDesc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildPage,
});

const GREETING =
  "Hi! 👋 I'm Aaruba, your AI career assistant from Talk2YN.\n\nI'll ask you a few simple questions to understand your education, skills, projects, and experience. Don't worry if you don't know everything — we'll build your resume together, step by step.\n\nReady to begin?\n\n**What's your full name?**";


const GREETING_MESSAGE: UIMessage = {
  id: "greet",
  role: "assistant" as const,
  parts: [{ type: "text" as const, text: GREETING }],
};

function messageText(message: { parts?: Array<{ type: string; text?: string }>; content?: string }) {
  if (Array.isArray(message.parts)) {
    return message.parts.map((part) => (part.type === "text" ? part.text ?? "" : "")).join("");
  }
  return typeof message.content === "string" ? message.content : "";
}

function restoreMessages(
  messages: Array<{ id: string; role: "user" | "assistant"; content: string }>,
): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: [{ type: "text" as const, text: message.content ?? "" }],
  }));
}

function BuildPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [input, setInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [resumeReadySignal, setResumeReadySignal] = useState(false);
  const [messagesReady, setMessagesReady] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const voice = useVoiceInput((text, isFinal) => {
    setInput((prev) => {
      if (isFinal) return (prev ? prev.trimEnd() + " " : "") + text;
      return text;
    });
  });

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, setMessages, status } = useChat({
    id: resumeId ?? "pending",
    messages: [GREETING_MESSAGE] as UIMessage[],
    transport,
    onError: (e) => console.error(e),
  });

  useEffect(() => {
    let id = getActiveId();
    let r = id ? getResume(id) : null;
    if (!r) r = createResume();
    setResumeId(r.id);
    setData(r.data);
    setReady(true);
    setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

  useEffect(() => {
    if (!resumeId) return;
    const stored = getResume(resumeId);
    setMessages(
      stored && stored.messages.length > 0
        ? restoreMessages(stored.messages)
        : [GREETING_MESSAGE],
    );
    setMessagesReady(true);
  }, [resumeId, setMessages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    if (!resumeId || !messagesReady) return;
    const r = getResume(resumeId);
    if (!r) return;
    r.messages = messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: messageText(m),
    }));
    r.data = data;
    upsertResume(r);
  }, [messages, data, resumeId, messagesReady]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") {
      const text = messageText(last);
      if (text.includes("[RESUME_READY]")) setResumeReadySignal(true);
    }
  }, [messages]);

  const lastExtractedCount = useRef(0);
  const [livePreviewLoading, setLivePreviewLoading] = useState(false);
  useEffect(() => {
    if (!resumeId) return;
    if (status === "streaming" || status === "submitted") return;
    const userCount = messages.filter((m) => m.role === "user").length;
    if (userCount === 0 || userCount === lastExtractedCount.current) return;
    const handle = setTimeout(async () => {
      lastExtractedCount.current = userCount;
      setLivePreviewLoading(true);
      try {
        const transcript = messages
          .map((m) => `${m.role === "user" ? "USER" : "AARUBA"}: ${messageText(m)}`)
          .join("\n\n");
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });
        if (res.ok) {
          const extracted = (await res.json()) as ResumeData;
          setData(extracted);
          const r = getResume(resumeId);
          if (r) {
            r.data = extracted;
            if (extracted.personalInfo.fullName) {
              r.name = `${extracted.personalInfo.fullName}'s Resume`;
            }
            upsertResume(r);
          }
        }
      } catch (e) {
        console.error("live extract failed", e);
      } finally {
        setLivePreviewLoading(false);
      }
    }, 900);
    return () => clearTimeout(handle);
  }, [messages, status, resumeId]);

  const completeness = estimateCompleteness(data);
  const atsScore = useMemo(() => scoreResume(data).overall, [data]);
  const userMsgCount = messages.filter((m) => m.role === "user").length;

  const send = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || status === "streaming" || status === "submitted") return;
    if (!override) setInput("");
    sendMessage({ text });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || busy || uploading) return;
    setUploadError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 5)) {
        if (file.size > 10 * 1024 * 1024) {
          setUploadError(`${file.name} is over 10MB. Try a smaller file.`);
          continue;
        }
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("read failed"));
          reader.readAsDataURL(file);
        });
        const res = await fetch("/api/read-doc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            mediaType: file.type || "application/octet-stream",
            dataUrl,
          }),
        });
        const json = (await res.json()) as { summary?: string; error?: string };
        if (!res.ok || !json.summary) {
          setUploadError(json.error ?? "Couldn't read that file.");
          continue;
        }
        sendMessage({
          text: `[UPLOADED FILE: ${file.name}]\n${json.summary}`,
        });
      }
    } catch (e) {
      console.error("upload failed", e);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };


  const suggestions = useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return [] as string[];
    const text = messageText(last);
    const match = text.match(/\[SUGGESTIONS:\s*([^\]]+)\]/i);
    if (!match) return [];
    return match[1].split("|").map((s) => s.trim()).filter(Boolean).slice(0, 6);
  }, [messages]);

  const buildResume = async () => {
    if (!resumeId) return;
    setExtracting(true);
    try {
      const transcript = messages
        .map((m) => `${m.role === "user" ? "USER" : "AARUBA"}: ${messageText(m)}`)
        .join("\n\n");
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      if (!res.ok) throw new Error("extract failed");
      const extracted = (await res.json()) as ResumeData;
      setData(extracted);
      const r = getResume(resumeId);
      if (r) {
        r.data = extracted;
        r.name = extracted.personalInfo.fullName
          ? `${extracted.personalInfo.fullName}'s Resume`
          : r.name;
        upsertResume(r);
      }
      navigate({ to: "/templates" });
    } catch (e) {
      console.error(e);
      alert("Couldn't build resume yet — add a bit more info and try again.");
    } finally {
      setExtracting(false);
    }
  };

  const busy = status === "submitted" || status === "streaming";
  const canBuild = userMsgCount >= 3;

  const handleScratch = () => {
    if (busy) return;
    const confirmed = window.confirm(
      "Clear this entire chat and start over from scratch?",
    );
    if (!confirmed) return;
    setMessages([GREETING_MESSAGE]);
    setData(emptyResume);
    setResumeReadySignal(false);
    setAnalysis(null);
    setAnalyzeError(null);
    lastExtractedCount.current = 0;
    if (resumeId) {
      const r = getResume(resumeId);
      if (r) {
        r.messages = [];
        r.data = emptyResume;
        r.name = "Untitled Resume";
        upsertResume(r);
      }
    }
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const runAnalysis = async () => {
    if (analyzing) return;
    // Clear any cached analysis so /analysis shows a fresh run for latest data.
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


  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {extracting && <BuildingOverlay />}

      {/* Sunset ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-60 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-50 animate-float"
          style={{ background: "radial-gradient(circle, #e84393 0%, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full blur-3xl opacity-55 animate-drift"
          style={{ background: "radial-gradient(circle, #6c5ce7 0%, transparent 65%)", animationDelay: "-4s" }}
        />
      </div>

      {/* TOP nav — floating pill */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(96vw,1180px)]">
        <div className="glass-strong rounded-full px-4 py-2.5 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div
              className="size-6 rounded-full grid place-items-center animate-sunset"
              style={{ background: "var(--gradient-sunset)" }}
            >
              <Sparkles className="size-3 text-white" />
            </div>
            <span className="font-display text-sm tracking-tight font-semibold">Aaruba</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-muted-foreground border-l border-white/10 pl-2.5">
              Interview
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 bg-sunset animate-sunset"
                  style={{ width: `${Math.max(6, completeness)}%` }}
                />
              </div>
              <span>{completeness}%</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/90 border border-white/15 bg-white/5">
              <span className="size-2 rounded-full bg-[color:var(--ember)] animate-pulse-glow" />
              <span className="tabular-nums">ATS {atsScore}</span>
            </div>
            <div className="lg:hidden">
              <MobilePreviewDrawer data={data} loading={livePreviewLoading} />
            </div>

          </div>
        </div>
      </header>

      {/* MAIN broken-grid stage */}
      <main className="relative z-10 min-h-screen pt-24 pb-8 px-4 sm:px-8">
        <div className="mx-auto max-w-[1400px] relative">
          {/* Live label — floating top-left */}
          <div className="hidden lg:flex absolute -top-2 left-0 items-center gap-2 z-20">
            <span className="size-2 rounded-full bg-[color:var(--ember)] animate-pulse-glow" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Live resume · updates as you answer
            </span>
            {livePreviewLoading && (
              <Loader2 className="size-3 animate-spin text-[color:var(--ember)]" />
            )}
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:min-h-[calc(100vh-140px)]">
            {/* RESUME — right, offset, rotated slightly */}
            <aside className="hidden lg:block lg:col-span-7 lg:col-start-6 lg:row-start-1 relative">
              <div className="sticky top-24">
                <div
                  className="relative mx-auto aspect-[8.5/11] w-full max-w-[560px] rounded-md overflow-hidden bg-white"
                  style={{
                    boxShadow:
                      "0 60px 120px -20px rgba(11, 7, 16, 0.8), 0 0 0 1px rgba(255, 246, 239, 0.08), 0 40px 80px -30px rgba(232, 67, 147, 0.35)",
                    transform: "rotate(1.5deg)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{ width: "816px", height: "1056px", transform: "scale(0.686)" }}
                  >
                    <ResumeRender data={data} template="modern" />
                  </div>
                </div>
                {/* Under-shadow orb */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-8 blur-2xl opacity-70 -z-10"
                  style={{ background: "var(--gradient-sunset)" }}
                />
              </div>
            </aside>

            {/* CHAT — left, floating card overlapping resume */}
            <section
              className={`lg:col-span-6 lg:col-start-1 lg:row-start-1 relative z-20 ${
                chatMinimized ? "lg:col-span-3" : ""
              }`}
            >
              <div className="glass-strong rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-140px)] lg:min-h-[600px] lg:max-h-[820px] shadow-[0_40px_120px_-30px_rgba(232,67,147,0.45)]">
                {/* Chat header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-9 rounded-2xl grid place-items-center animate-sunset"
                      style={{ background: "var(--gradient-sunset)" }}
                    >
                      <Sparkles className="size-4 text-white" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-display text-sm font-semibold">Aaruba</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Asks · Writes · You Ship
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-muted-foreground">
                      {userMsgCount} answered
                    </span>

                    <button
                      onClick={() => setChatMinimized((v) => !v)}
                      className="hidden lg:grid place-items-center size-8 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
                      aria-label={chatMinimized ? "Expand chat" : "Minimize chat"}
                    >
                      {chatMinimized ? <Eye className="size-4" /> : <X className="size-4" />}
                    </button>
                  </div>
                </div>

                {!chatMinimized && (
                  <>
                    <div
                      ref={scrollRef}
                      className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scroll-smooth"
                    >
                      {ready &&
                        messages.map((m) => {
                          const text = messageText(m)
                            .replace("[RESUME_READY]", "")
                            .replace(/\[SUGGESTIONS:[^\]]+\]/gi, "")
                            .trim();
                          if (m.role === "user") {
                            return (
                              <div key={m.id} className="flex justify-end animate-fade-up">
                                <div
                                  className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-white shadow-[0_12px_40px_-15px_rgba(255,107,53,0.7)]"
                                  style={{ background: "var(--gradient-ember)" }}
                                >
                                  {text}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={m.id} className="flex gap-3 animate-fade-up">
                              <div
                                className="size-8 shrink-0 rounded-2xl grid place-items-center mt-0.5"
                                style={{ background: "var(--gradient-cool)" }}
                              >
                                <Sparkles className="size-3.5 text-white" />
                              </div>
                              <div className="prose prose-invert prose-sm prose-p:my-1.5 prose-strong:text-[color:var(--ember)] text-foreground/95 leading-relaxed max-w-[85%]">
                                <ReactMarkdown>{text}</ReactMarkdown>
                              </div>
                            </div>
                          );
                        })}
                      {busy && (
                        <div className="flex gap-3 animate-fade-in">
                          <div
                            className="size-8 shrink-0 rounded-2xl grid place-items-center animate-pulse-glow"
                            style={{ background: "var(--gradient-cool)" }}
                          >
                            <Sparkles className="size-3.5 text-white" />
                          </div>
                          <div className="flex items-center gap-1.5 pt-3">
                            <span className="size-1.5 bg-[color:var(--ember)] rounded-full animate-pulse-glow" />
                            <span
                              className="size-1.5 bg-[color:var(--magenta)] rounded-full animate-pulse-glow"
                              style={{ animationDelay: "150ms" }}
                            />
                            <span
                              className="size-1.5 bg-[color:var(--violet)] rounded-full animate-pulse-glow"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {!busy && suggestions.length > 0 && (
                      <div className="px-5 pb-3 flex flex-wrap gap-2 animate-fade-up">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="text-xs rounded-full glass px-3.5 py-1.5 text-foreground/85 hover:text-white hover:border-white/40 border border-white/15 transition"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {(resumeReadySignal || canBuild) && (
                      <div className="mx-5 mb-3 animate-fade-up">
                        <button
                          onClick={() => {
                            if (resumeId) {
                              const stored = getResume(resumeId);
                              if (stored) {
                                stored.data = data;
                                upsertResume(stored);
                              }
                            }
                            navigate({ to: "/result" });
                          }}
                          className="w-full rounded-2xl px-5 py-4 text-white flex items-center justify-between gap-3 hover:scale-[1.01] active:scale-[0.99] transition shadow-[0_18px_50px_-18px_rgba(255,107,53,0.9)]"
                          style={{ background: "var(--gradient-ember)" }}
                        >
                          <span className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-5" />
                            <span className="text-left">
                              <span className="block text-sm font-semibold">
                                See my result
                              </span>
                              <span className="block text-[10px] uppercase tracking-widest opacity-80">
                                Analyse, formats &amp; company search
                              </span>
                            </span>
                          </span>
                          <ChevronRight className="size-5" />
                        </button>
                      </div>
                    )}




                    <div className="border-t border-white/10 p-4">
                      {uploadError && (
                        <div className="mb-2 text-[11px] text-[color:var(--ember)] flex items-center gap-1.5">
                          <AlertCircle className="size-3.5" /> {uploadError}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,application/pdf,.pdf,.png,.jpg,.jpeg,.webp,.heic"
                        className="hidden"
                        onChange={(e) => {
                          void handleFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                      <div className="glass rounded-2xl p-2 pl-4 flex items-end gap-2 focus-within:border-[color:var(--ember)]/60 focus-within:shadow-[0_0_30px_-5px_rgba(255,107,53,0.4)]">
                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              send();
                            }
                          }}
                          rows={1}
                          aria-label="Your answer"
                          placeholder="Type your answer, or upload a certificate…"
                          className="flex-1 bg-transparent outline-none resize-none py-2 max-h-40 text-sm placeholder:text-muted-foreground/70"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={busy || uploading}
                          aria-label="Upload certificate, document or image"
                          title="Upload certificates, project docs, images or PDFs"
                          className="size-10 rounded-xl grid place-items-center transition shrink-0 border bg-white/5 border-white/15 text-foreground/70 hover:text-foreground hover:bg-white/10 disabled:opacity-40"
                        >
                          {uploading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Paperclip className="size-4" />
                          )}
                        </button>
                        {voice.supported && (

                          <button
                            onClick={() => (voice.listening ? voice.stop() : voice.start())}
                            aria-label={voice.listening ? "Stop voice input" : "Speak your answer"}
                            title={voice.listening ? "Listening… tap to stop" : "Speak your answer"}
                            className={`size-10 rounded-xl grid place-items-center transition shrink-0 border ${voice.listening ? "bg-[color:var(--ember)]/20 border-[color:var(--ember)]/60 text-[color:var(--ember)] animate-pulse-glow" : "bg-white/5 border-white/15 text-foreground/70 hover:text-foreground hover:bg-white/10"}`}
                          >
                            {voice.listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => send()}
                          disabled={busy || !input.trim()}
                          aria-label="Send message"
                          className="size-10 rounded-xl grid place-items-center disabled:opacity-40 hover:scale-105 transition shrink-0 text-white shadow-[0_10px_30px_-10px_rgba(255,107,53,0.7)]"
                          style={{ background: "var(--gradient-ember)" }}
                        >
                          <ArrowUp className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="hidden xs:inline uppercase tracking-widest">
                          ↵ Send · ⇧↵ Newline
                        </span>
                        <span className="uppercase tracking-widest">
                          Finish the chat → “See my result”
                        </span>
                      </div>

                    </div>
                  </>
                )}
              </div>

              {/* Floating stats card — top-right corner of chat */}
              {!chatMinimized && (
                <div className="hidden lg:block absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-2.5 z-30 rotate-[-3deg]">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    Answered
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-xl font-bold text-sunset">
                      {userMsgCount}
                    </span>
                    <span className="text-[10px] text-muted-foreground">q</span>
                  </div>
                </div>
              )}

            </section>
          </div>
        </div>
      </main>

      {(analyzing || analysis || analyzeError) && (
        <AnalysisModal
          analyzing={analyzing}
          analysis={analysis}
          error={analyzeError}
          onClose={() => {
            setAnalysis(null);
            setAnalyzeError(null);
          }}
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
  improvements?: Array<{
    area: string;
    issue: string;
    fix: string;
    priority?: "high" | "medium" | "low";
  }>;
  nextSteps?: string[];
};

function AnalysisModal({
  analyzing,
  analysis,
  error,
  onClose,
}: {
  analyzing: boolean;
  analysis: AnalysisResult | null;
  error: string | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-strong rounded-3xl border border-white/10 shadow-[0_40px_120px_-30px_rgba(232,67,147,0.5)]">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-background/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div
              className="size-9 rounded-2xl grid place-items-center animate-sunset"
              style={{ background: "var(--gradient-sunset)" }}
            >
              <Search className="size-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base">Resume Analysis</h3>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                What's strong · what to fix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center size-8 rounded-full hover:bg-white/10"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {analyzing && (
            <div className="flex flex-col items-center py-10 gap-4">
              <Loader2 className="size-8 animate-spin text-[color:var(--ember)]" />
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
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Overall
                      </div>
                      <div className="font-display text-3xl font-bold text-sunset">
                        {analysis.score}
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>
                  )}
                  {analysis.atsScore !== undefined && (
                    <div className="glass rounded-2xl p-4">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        ATS-friendly
                      </div>
                      <div className="font-display text-3xl font-bold text-sunset">
                        {analysis.atsScore}
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {analysis.strengths && analysis.strengths.length > 0 && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-[color:var(--ember)] font-semibold mb-2">
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <CheckCircle2 className="size-4 text-[color:var(--ember)] shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {analysis.missing && analysis.missing.length > 0 && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-[color:var(--magenta)] font-semibold mb-2">
                    Still missing
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing.map((m, i) => (
                      <span
                        key={i}
                        className="text-xs rounded-full border border-white/15 bg-white/5 px-3 py-1.5"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {analysis.improvements && analysis.improvements.length > 0 && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-3">
                    Improvements
                  </h4>
                  <div className="space-y-3">
                    {analysis.improvements.map((imp, i) => (
                      <div
                        key={i}
                        className="glass rounded-2xl p-4 border-l-2"
                        style={{
                          borderLeftColor:
                            imp.priority === "high"
                              ? "var(--magenta)"
                              : imp.priority === "medium"
                                ? "var(--ember)"
                                : "var(--violet)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="font-semibold text-sm">{imp.area}</div>
                          {imp.priority && (
                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                              {imp.priority}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1.5">{imp.issue}</div>
                        <div className="text-sm text-foreground/90">
                          <span className="text-[color:var(--ember)] font-medium">Fix: </span>
                          {imp.fix}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {analysis.nextSteps && analysis.nextSteps.length > 0 && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-2">
                    Next steps
                  </h4>
                  <ol className="space-y-2 list-decimal list-inside text-sm">
                    {analysis.nextSteps.map((step, i) => (
                      <li key={i} className="text-foreground/90">
                        {step}
                      </li>
                    ))}
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

function MobilePreviewDrawer({ data, loading }: { data: ResumeData; loading: boolean }) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium">
          <Eye className="size-3.5" />
          Preview
          {loading && <Loader2 className="size-3 animate-spin" />}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[24px] h-[88vh] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none border-t border-white/10">
          <div className="p-4 border-b border-white/10 flex-none">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-white/20 mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <Drawer.Title className="font-display text-lg font-semibold">
                  Live preview
                </Drawer.Title>
                <Drawer.Description className="text-xs text-muted-foreground">
                  Updates as you chat with Aaruba
                </Drawer.Description>
              </div>
              <Drawer.Close asChild>
                <button className="text-sm font-medium text-[color:var(--ember)]">Done</button>
              </Drawer.Close>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-[400px] aspect-[8.5/11] rounded-lg overflow-hidden bg-white relative shadow-2xl">
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={{ width: "816px", height: "1056px", transform: "scale(0.49)" }}
              >
                <ResumeRender data={data} template="modern" />
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function BuildingOverlay() {
  const steps = [
    "Understanding your experience",
    "Organizing your achievements",
    "Improving your writing",
    "Optimizing for ATS",
    "Preparing your resume designs",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, steps.length)), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl grid place-items-center animate-fade-in">
      <div className="text-center max-w-md px-6">
        <div
          className="mx-auto size-16 rounded-3xl grid place-items-center animate-pulse-glow animate-sunset"
          style={{ background: "var(--gradient-sunset)" }}
        >
          <Sparkles className="size-7 text-white" />
        </div>
        <h2 className="mt-6 font-display text-3xl text-sunset font-bold tracking-tight">
          Turning your story into your resume…
        </h2>
        <div className="mt-8 space-y-3 text-left">
          {steps.map((s, idx) => (
            <div key={s} className="flex items-center gap-3 text-sm">
              {idx < i ? (
                <CheckCircle2 className="size-5 text-[color:var(--ember)]" />
              ) : idx === i ? (
                <Loader2 className="size-5 animate-spin text-[color:var(--ember)]" />
              ) : (
                <div className="size-5 rounded-full border border-white/20" />
              )}
              <span className={idx <= i ? "text-foreground font-medium" : "text-muted-foreground"}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
