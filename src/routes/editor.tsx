import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, LayoutGrid, Sparkles, Trash2, Wand2, Plus, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { ResumeRender, TEMPLATES, type TemplateId } from "@/components/resume/ResumeRender";
import { DownloadMenu } from "@/components/resume/DownloadMenu";

import { emptyResume, estimateCompleteness, type ResumeData } from "@/lib/resume-schema";
import { getActiveId, getResume, upsertResume } from "@/lib/resume-store";

const editorTitle = "Resume Editor — Fine-tune Your Resume | Talk2YN";
const editorDesc =
  "Edit every section of your resume, rewrite weak lines with AI, and preview it live in any of the 12 resume formats.";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: editorTitle },
      { name: "description", content: editorDesc },
      { property: "og:title", content: editorTitle },
      { property: "og:description", content: editorDesc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [rewriting, setRewriting] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(0.75);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const previewWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = getActiveId();
    const r = id ? getResume(id) : null;
    if (r) {
      setResumeId(r.id);
      setData(r.data);
      setTemplate((r.templateId as TemplateId) ?? "modern");
    }
  }, []);

  useEffect(() => {
    if (!resumeId) return;
    const r = getResume(resumeId);
    if (!r) return;
    r.data = data;
    r.templateId = template;
    upsertResume(r);
  }, [data, template, resumeId]);

  useEffect(() => {
    const update = () => {
      const w = previewWrap.current?.clientWidth ?? 800;
      // On small screens, we might want a different default scale
      const isMobile = window.innerWidth < 1024;
      setPreviewScale(Math.min(0.95, Math.max(0.3, (w - (isMobile ? 32 : 48)) / 816)));
    };
    update();
    const timer = setTimeout(update, 100); // Wait for transition
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(timer);
    };
  }, [fullscreenPreview]);

  const score = useMemo(() => estimateCompleteness(data), [data]);

  const patch = (updater: (d: ResumeData) => ResumeData) => setData((prev) => updater(structuredClone(prev)));

  const rewriteBullet = async (key: string, text: string, action: string, apply: (t: string) => void) => {
    setRewriting(key);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, action }),
      });
      const j = (await res.json()) as { text: string };
      if (j.text) apply(j.text);
    } catch (e) {
      console.error(e);
    } finally {
      setRewriting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl no-print">
        <div className="mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/templates" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-4" /> <span className="hidden xs:inline">Templates</span>
            </Link>
            <div className="h-4 w-px bg-border hidden xs:block" />
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-ink text-paper grid place-items-center shrink-0 font-display font-bold text-xs">A</div>
              <span className="font-display text-base sm:text-lg font-bold tracking-tight">Editor</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as TemplateId)}
              aria-label="Select template"
              className="hidden sm:block rounded-full bg-secondary/50 border border-border text-xs px-3 py-1.5 focus:ring-2 ring-primary/20 outline-none"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="rounded-full bg-secondary/80 px-3 py-1.5 text-[10px] sm:text-xs font-bold text-muted-foreground shadow-sm">
              Score {score}
            </div>
            <DownloadMenu data={data} template={template} />
            <Link
              to="/templates"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-4 py-2 text-xs sm:text-sm font-bold hover:scale-[1.02] transition shadow-lg shadow-black/10"
            >
              <LayoutGrid className="size-3.5 sm:size-4" /> Resume Formats
            </Link>

          </div>
        </div>
      </header>

      <div className={`grid ${fullscreenPreview ? "grid-cols-1" : "lg:grid-cols-[450px_minmax(0,1fr)]"} transition-all duration-500`}>
        {/* LEFT — editable form */}
        <aside className={`${fullscreenPreview ? "hidden" : "block"} lg:h-[calc(100vh-57px)] lg:overflow-y-auto border-r border-border p-5 sm:p-6 space-y-8 no-print`}>
          <Section title="Personal Information">
            <Grid2>
              <Field label="Full name" value={data.personalInfo.fullName} onChange={(v) => patch((d) => ((d.personalInfo.fullName = v), d))} />
              <Field label="Professional Headline" value={data.personalInfo.headline} onChange={(v) => patch((d) => ((d.personalInfo.headline = v), d))} />
              <Field label="Email Address" value={data.personalInfo.email} onChange={(v) => patch((d) => ((d.personalInfo.email = v), d))} />
              <Field label="Phone Number" value={data.personalInfo.phone} onChange={(v) => patch((d) => ((d.personalInfo.phone = v), d))} />
              <Field label="Location" value={data.personalInfo.location} onChange={(v) => patch((d) => ((d.personalInfo.location = v), d))} />
              <Field label="LinkedIn URL" value={data.personalInfo.linkedin} onChange={(v) => patch((d) => ((d.personalInfo.linkedin = v), d))} />
              <Field label="Portfolio/Website" value={data.personalInfo.website} onChange={(v) => patch((d) => ((d.personalInfo.website = v), d))} />
              <Field label="GitHub Profile" value={data.personalInfo.github} onChange={(v) => patch((d) => ((d.personalInfo.github = v), d))} />
            </Grid2>
          </Section>

          <Section title="Professional Summary">
            <div className="relative">
              <TextArea
                value={data.summary ?? ""}
                onChange={(v) => patch((d) => ((d.summary = v), d))}
                rows={4}
                placeholder="Write a brief professional summary..."
              />
              {data.summary && data.summary.length > 20 && (
                <div className="absolute bottom-2 right-2">
                  <AiButton
                    busy={rewriting === "summary"}
                    label="Improve"
                    onClick={() =>
                      rewriteBullet("summary", data.summary ?? "", "make more professional and concise", (t) =>
                        patch((d) => ((d.summary = t), d))
                      )
                    }
                  />
                </div>
              )}
            </div>
          </Section>

          <Section
            title="Work Experience"
            onAdd={() =>
              patch((d) => {
                d.experience.push({
                  id: crypto.randomUUID(),
                  company: "",
                  role: "",
                  bullets: [""],
                });
                return d;
              })
            }
          >
            <div className="space-y-6">
              {data.experience.map((e, ei) => (
                <div key={e.id} className="rounded-2xl border border-border p-4 sm:p-5 space-y-4 bg-secondary/20 relative group">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-sm">Experience #{ei + 1}</div>
                    <button
                      onClick={() => patch((d) => ((d.experience = d.experience.filter((_, i) => i !== ei)), d))}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Remove experience"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <Grid2>
                    <Field label="Job Role" value={e.role} onChange={(v) => patch((d) => ((d.experience[ei].role = v), d))} />
                    <Field label="Company Name" value={e.company} onChange={(v) => patch((d) => ((d.experience[ei].company = v), d))} />
                    <Field label="Start Date" value={e.startDate} onChange={(v) => patch((d) => ((d.experience[ei].startDate = v), d))} />
                    <Field label="End Date" value={e.endDate} onChange={(v) => patch((d) => ((d.experience[ei].endDate = v), d))} />
                  </Grid2>
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Achievements & Responsibilities</div>
                    <div className="space-y-3">
                      {e.bullets.map((b, bi) => (
                        <div key={bi} className="flex gap-2 items-start group/bullet">
                          <div className="flex-1 relative">
                            <TextArea
                              value={b}
                              rows={2}
                              onChange={(v) => patch((d) => ((d.experience[ei].bullets[bi] = v), d))}
                              placeholder="Describe your impact..."
                            />
                            {b.length > 10 && (
                              <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover/bullet:opacity-100 transition-opacity">
                                <button
                                  onClick={() =>
                                    rewriteBullet(`e-${ei}-${bi}`, b, "improve as a strong resume bullet", (t) =>
                                      patch((d) => ((d.experience[ei].bullets[bi] = t), d))
                                    )
                                  }
                                  className="size-7 rounded-lg bg-background shadow-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                                  title="Rewrite with AI"
                                  aria-label="Rewrite bullet with AI"
                                >
                                  {rewriting === `e-${ei}-${bi}` ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5 text-primary" />}
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => patch((d) => ((d.experience[ei].bullets = d.experience[ei].bullets.filter((_, i) => i !== bi)), d))}
                            className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label="Remove bullet"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => patch((d) => ((d.experience[ei].bullets.push("")), d))}
                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        <Plus className="size-3" /> Add bullet
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Projects"
            onAdd={() =>
              patch((d) => {
                d.projects.push({ id: crypto.randomUUID(), name: "", description: "", tech: [] });
                return d;
              })
            }
          >
            <div className="space-y-4">
              {data.projects.map((p, pi) => (
                <div key={p.id} className="rounded-2xl border border-border p-4 bg-secondary/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <Field label="Project Name" value={p.name} onChange={(v) => patch((d) => ((d.projects[pi].name = v), d))} />
                    <button onClick={() => patch((d) => ((d.projects = d.projects.filter((_, i) => i !== pi)), d))} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <TextArea value={p.description ?? ""} rows={3} placeholder="Project description..." onChange={(v) => patch((d) => ((d.projects[pi].description = v), d))} />
                  <Field
                    label="Tech Stack (comma-separated)"
                    value={p.tech?.join(", ")}
                    onChange={(v) => patch((d) => ((d.projects[pi].tech = v.split(",").map((x) => x.trim()).filter(Boolean)), d))}
                  />
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Education"
            onAdd={() =>
              patch((d) => {
                d.education.push({ id: crypto.randomUUID(), institution: "" });
                return d;
              })
            }
          >
            <div className="space-y-4">
              {data.education.map((e, ei) => (
                <div key={e.id} className="rounded-2xl border border-border p-4 bg-secondary/10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                      <Field label="Institution" value={e.institution} onChange={(v) => patch((d) => ((d.education[ei].institution = v), d))} />
                    </div>
                    <button onClick={() => patch((d) => ((d.education = d.education.filter((_, i) => i !== ei)), d))} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <Grid2>
                    <Field label="Degree" value={e.degree} onChange={(v) => patch((d) => ((d.education[ei].degree = v), d))} />
                    <Field label="Field of Study" value={e.field} onChange={(v) => patch((d) => ((d.education[ei].field = v), d))} />
                    <Field label="Start Date" value={e.startDate} onChange={(v) => patch((d) => ((d.education[ei].startDate = v), d))} />
                    <Field label="End Date" value={e.endDate} onChange={(v) => patch((d) => ((d.education[ei].endDate = v), d))} />
                  </Grid2>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Skills & Expertise">
            <div className="space-y-4">
              <SkillsField label="Technical Skills" list={data.skills.technical} onChange={(v) => patch((d) => ((d.skills.technical = v), d))} />
              <SkillsField label="Tools & Platforms" list={data.skills.tools} onChange={(v) => patch((d) => ((d.skills.tools = v), d))} />
              <SkillsField label="Soft Skills" list={data.skills.soft} onChange={(v) => patch((d) => ((d.skills.soft = v), d))} />
              <SkillsField label="Languages" list={data.skills.languages} onChange={(v) => patch((d) => ((d.skills.languages = v), d))} />
            </div>
          </Section>
        </aside>

        {/* RIGHT — live preview */}
        <main 
          ref={previewWrap} 
          className={`bg-hero relative ${fullscreenPreview ? "h-[calc(100vh-57px)]" : "lg:h-[calc(100vh-57px)]"} lg:overflow-y-auto p-4 sm:p-10 flex flex-col items-center shadow-inner`}>
          
          <div className="w-full max-w-4xl flex justify-between items-center mb-6 no-print">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">Live Canvas</div>
            <button 
              onClick={() => setFullscreenPreview(!fullscreenPreview)}
              className="flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-bold hover:bg-ink/5 transition-all shadow-sm"
            >
              {fullscreenPreview ? <><Minimize2 className="size-3.5" /> Show Form</> : <><Maximize2 className="size-3.5" /> Fullscreen Preview</>}
            </button>
          </div>

          <div
            className="print-page bg-white rounded-md shadow-2xl overflow-hidden relative border border-border/10"
            style={{ width: `${816 * previewScale}px`, height: `${1056 * previewScale}px` }}
          >
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{ width: "816px", height: "1056px", transform: `scale(${previewScale})` }}
            >
              <ResumeRender data={data} template={template} />
            </div>
          </div>
          
          <div className="mt-8 text-xs text-muted-foreground no-print flex items-center gap-4">
             <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-emerald-500" /> Auto-saved</span>
             <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /> Ready to preview</span>
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          @page { size: Letter; margin: 0; }
          html, body { background: white !important; }
          header, aside, .no-print { display: none !important; }
          main { padding: 0 !important; height: auto !important; overflow: visible !important; background: white !important; width: 100% !important; display: block !important; }
          .print-page {
            width: 816px !important;
            height: 1056px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            border: none !important;
            margin: 0 auto !important;
          }
          .print-page > div { transform: none !important; width: 816px !important; height: 1056px !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
            <Plus className="size-3" /> Add
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  const id = useRef(crypto.randomUUID());
  return (
    <div className="space-y-1.5">
      <label htmlFor={id.current} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pl-1">{label}</label>
      <input
        id={id.current}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/10 focus:border-primary/40 transition-all"
      />
    </div>
  );
}

function TextArea({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/10 focus:border-primary/40 transition-all resize-none"
    />
  );
}

function SkillsField({ label, list, onChange }: { label: string; list: string[]; onChange: (v: string[]) => void }) {
  const id = useRef(crypto.randomUUID());
  return (
    <div className="space-y-1.5">
      <label htmlFor={id.current} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pl-1">{label}</label>
      <input
        id={id.current}
        type="text"
        value={list.join(", ")}
        onChange={(e) => onChange(e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
        className="w-full rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/10 focus:border-primary/40 transition-all"
        placeholder="Separate skills with commas"
      />
    </div>
  );
}

function AiButton({ busy, label, onClick }: { busy: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full bg-background border border-border px-3 py-1.5 hover:bg-secondary disabled:opacity-50 transition-colors shadow-sm"
    >
      {busy ? <Loader2 className="size-3 animate-spin" /> : <Wand2 className="size-3 text-primary" />}
      {label}
    </button>
  );
}
