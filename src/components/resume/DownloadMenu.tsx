import { useRef, useState, useEffect } from "react";
import { Download, FileText, FileType2, Loader2, Check } from "lucide-react";
import { ResumeRender, type TemplateId } from "@/components/resume/ResumeRender";
import type { ResumeData } from "@/lib/resume-schema";
import { downloadResumeFromNode } from "@/lib/download-resume";
import { downloadResumeWord } from "@/lib/word-export";

export function DownloadMenu({
  data,
  template,
  className = "",
}: {
  data: ResumeData;
  template: TemplateId;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<null | "pdf" | "word">(null);
  const [done, setDone] = useState<null | "pdf" | "word">(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fileName = data.personalInfo.fullName?.trim() || "Resume";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const flash = (kind: "pdf" | "word") => {
    setDone(kind);
    setTimeout(() => setDone(null), 2000);
  };

  const doPdf = async () => {
    if (busy) return;
    setBusy("pdf");
    try {
      const node = captureRef.current;
      if (node) await downloadResumeFromNode(node, fileName);
      flash("pdf");
      setOpen(false);
    } catch (e) {
      console.error("PDF export failed", e);
      alert("Sorry, the PDF could not be created. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const doWord = () => {
    if (busy) return;
    setBusy("word");
    try {
      downloadResumeWord(data, fileName);
      flash("word");
      setOpen(false);
    } catch (e) {
      console.error("Word export failed", e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={!!busy}
        className="inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-4 py-2 text-xs sm:text-sm font-bold hover:scale-[1.02] transition shadow-lg shadow-black/10 disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : done ? <Check className="size-4" /> : <Download className="size-4" />}
        Download
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl p-1.5 z-50">
          <button
            onClick={doPdf}
            className="w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-secondary/60 transition"
          >
            <FileText className="size-4 mt-0.5 shrink-0" />
            <span>
              <span className="block text-sm font-semibold">PDF document</span>
              <span className="block text-[11px] text-muted-foreground">Exact format, best for applying</span>
            </span>
          </button>
          <button
            onClick={doWord}
            className="w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-secondary/60 transition"
          >
            <FileType2 className="size-4 mt-0.5 shrink-0" />
            <span>
              <span className="block text-sm font-semibold">Word document</span>
              <span className="block text-[11px] text-muted-foreground">Editable .doc file</span>
            </span>
          </button>
        </div>
      )}

      {/* Off-screen full-size render used for pixel-perfect PDF capture */}
      <div aria-hidden className="fixed -left-[10000px] top-0 pointer-events-none opacity-0">
        <div ref={captureRef} style={{ width: 816, minHeight: 1056, background: "#fff" }}>
          <ResumeRender data={data} template={template} />
        </div>
      </div>
    </div>
  );
}
