import type { ResumeData } from "@/lib/resume-schema";

export type TemplateId =
  | "ats"
  | "modern"
  | "executive"
  | "minimal"
  | "developer"
  | "creative"
  | "student"
  | "biodata"
  | "cv-classic"
  | "photo-sidebar"
  | "teal-professional"
  | "timeline";

export type TemplateMeta = {
  id: TemplateId;
  name: string;
  tagline: string;
  bestFor: string;
  ats: "Excellent" | "High" | "Moderate";
  layout: string;
  focus: string;
  accent: string;
  subtext: string;
};

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "ats",
    name: "ATS Classic",
    tagline: "ATS Friendly",
    bestFor: "Corporate, finance, consulting, government",
    ats: "Excellent",
    layout: "Single column",
    focus: "Plain-text parsing, standard sections",
    accent: "from-slate-300 to-slate-500",
    subtext: "Designed for maximum compatibility with Applicant Tracking Systems.",
  },
  {
    id: "modern",
    name: "Modern Professional",
    tagline: "Modern Professional",
    bestFor: "Tech, product, marketing, operations, startups",
    ats: "High",
    layout: "Sidebar + main",
    focus: "Balanced skills and experience",
    accent: "from-amber-300 to-violet-400",
    subtext: "A polished contemporary design for today's professional workplace.",
  },
  {
    id: "executive",
    name: "Executive",
    tagline: "Executive Leadership",
    bestFor: "Directors, VPs, founders, senior leaders",
    ats: "High",
    layout: "Serif executive header",
    focus: "Leadership, impact, achievements",
    accent: "from-neutral-200 to-neutral-500",
    subtext: "Designed to highlight leadership, strategic impact, and career achievements.",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    tagline: "Minimal Clean",
    bestFor: "Consultants, researchers, academics, anyone",
    ats: "Excellent",
    layout: "Single column, generous whitespace",
    focus: "Story-first, calm hierarchy",
    accent: "from-white to-neutral-300",
    subtext: "Simple, elegant, and focused entirely on your professional story.",
  },
  {
    id: "developer",
    name: "Developer",
    tagline: "Technical / Developer",
    bestFor: "Engineers, data scientists, DevOps, security",
    ats: "High",
    layout: "Technical, skills-first",
    focus: "Stacks, projects, contributions",
    accent: "from-emerald-300 to-cyan-400",
    subtext: "Built to showcase your technical skills, projects, and engineering experience.",
  },
  {
    id: "creative",
    name: "Creative Professional",
    tagline: "Creative",
    bestFor: "Designers, creatives, brand, media",
    ats: "Moderate",
    layout: "Asymmetric with color band",
    focus: "Portfolio and visual identity",
    accent: "from-fuchsia-300 to-orange-300",
    subtext: "A distinctive visual resume designed for creative professionals.",
  },
  {
    id: "student",
    name: "Student & Fresher",
    tagline: "Student / Fresher",
    bestFor: "Students, freshers, interns, entry-level",
    ats: "High",
    layout: "Education & projects first",
    focus: "Academics, projects, internships",
    accent: "from-sky-300 to-indigo-400",
    subtext: "Designed to turn your education, skills, and projects into a strong first impression.",
  },
  {
    id: "biodata",
    name: "Classic Biodata",
    tagline: "Indian Biodata",
    bestFor: "Government jobs, banking, fresher walk-ins, traditional roles",
    ats: "High",
    layout: "Centered CV header + personal details + declaration",
    focus: "Career objective, academic table, personal profile, declaration",
    accent: "from-rose-300 to-amber-300",
    subtext: "Traditional Indian biodata style with Career Objective, academic qualification table, personal details and declaration.",
  },
  {
    id: "cv-classic",
    name: "Formal CV",
    tagline: "Curriculum Vitae",
    bestFor: "Teaching, academics, government, PSU roles",
    ats: "Excellent",
    layout: "Underlined headers, arrow bullets",
    focus: "Objective, qualifications, experience, references",
    accent: "from-neutral-300 to-neutral-500",
    subtext: "Formal Curriculum Vitae with underlined section headers and clean arrow bullets — the classic Indian CV layout.",
  },
  {
    id: "photo-sidebar",
    name: "Photo Sidebar",
    tagline: "Two-Column with Photo",
    bestFor: "Sales, hospitality, front-office, in-person interviews",
    ats: "Moderate",
    layout: "Left photo + skills sidebar, right content",
    focus: "Photo, contact, dot-scale skills, experience",
    accent: "from-blue-300 to-sky-500",
    subtext: "Two-column layout with a circular photo placeholder, dot-scale skill ratings and a clean right-side content flow.",
  },
  {
    id: "teal-professional",
    name: "Teal Professional",
    tagline: "Academic Tables",
    bestFor: "Freshers, MBAs, engineers with structured academics",
    ats: "High",
    layout: "Teal headers + academic qualification table",
    focus: "Objective, academic table with %/CGPA, projects",
    accent: "from-teal-300 to-emerald-500",
    subtext: "Teal-accented professional resume with a proper academic qualification table — perfect for Indian campus placements.",
  },
  {
    id: "timeline",
    name: "Chronological Timeline",
    tagline: "Visual Timeline",
    bestFor: "Career-changers, storytellers, growing professionals",
    ats: "Moderate",
    layout: "Vertical timeline with dots and language rings",
    focus: "Story-driven journey, visual language proficiency",
    accent: "from-orange-300 to-rose-400",
    subtext: "Infographic-style vertical timeline with circular language proficiency indicators — great for showing career progression.",
  },
];

/* ---------- helpers ---------- */
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function joinNonEmpty(parts: (string | undefined)[], sep = " · ") {
  return parts.filter(Boolean).join(sep);
}

function ContactInline({ p }: { p: ResumeData["personalInfo"] }) {
  const parts = [p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean);
  return (
    <div className="text-[10.5px] text-neutral-600 flex flex-wrap gap-x-3 gap-y-0.5">
      {parts.map((x, i) => (
        <span key={i}>{x}</span>
      ))}
    </div>
  );
}

function ContactStack({ p, className }: { p: ResumeData["personalInfo"]; className?: string }) {
  const items = [
    p.email && ["Email", p.email],
    p.phone && ["Phone", p.phone],
    p.location && ["Location", p.location],
    p.linkedin && ["LinkedIn", p.linkedin],
    p.github && ["GitHub", p.github],
    p.website && ["Web", p.website],
  ].filter(Boolean) as [string, string][];
  return (
    <div className={cx("space-y-1 text-[10.5px]", className)}>
      {items.map(([, v]) => (
        <div key={v} className="break-all">{v}</div>
      ))}
    </div>
  );
}

/* ---------- 1. ATS Classic ---------- */
function AtsTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-10 py-9" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
      <div className="text-center mb-3">
        <div className="text-[24px] font-bold tracking-wide uppercase">{name}</div>
        {p.headline && <div className="text-[11px] text-neutral-700 mt-0.5">{p.headline}</div>}
        <div className="mt-1.5 text-[10.5px] text-neutral-700">
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join("  |  ")}
        </div>
      </div>
      <div className="border-t border-neutral-800" />

      {d.summary && (
        <AtsSection title="Professional Summary">
          <p>{d.summary}</p>
        </AtsSection>
      )}

      {(d.skills.technical.length + d.skills.tools.length + d.skills.soft.length + d.skills.languages.length) > 0 && (
        <AtsSection title="Skills">
          {d.skills.technical.length > 0 && <div><b>Technical:</b> {d.skills.technical.join(", ")}</div>}
          {d.skills.tools.length > 0 && <div><b>Tools:</b> {d.skills.tools.join(", ")}</div>}
          {d.skills.soft.length > 0 && <div><b>Soft:</b> {d.skills.soft.join(", ")}</div>}
          {d.skills.languages.length > 0 && <div><b>Languages:</b> {d.skills.languages.join(", ")}</div>}
        </AtsSection>
      )}

      {d.experience.length > 0 && (
        <AtsSection title="Work Experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-2 break-inside-avoid">
              <div className="flex justify-between">
                <div><b>{e.role}</b>, {e.company}{e.location ? `, ${e.location}` : ""}</div>
                <div>{e.startDate} – {e.current ? "Present" : e.endDate}</div>
              </div>
              <ul className="list-disc pl-5 mt-0.5">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </AtsSection>
      )}

      {d.education.length > 0 && (
        <AtsSection title="Education">
          {d.education.map((ed) => (
            <div key={ed.id} className="mb-1 break-inside-avoid">
              <div className="flex justify-between">
                <div><b>{ed.institution}</b> — {joinNonEmpty([ed.degree, ed.field], ", ")}</div>
                <div>{ed.startDate} – {ed.endDate}</div>
              </div>
              {ed.gpa && <div className="text-neutral-700">GPA: {ed.gpa}</div>}
            </div>
          ))}
        </AtsSection>
      )}

      {d.certifications.length > 0 && (
        <AtsSection title="Certifications">
          {d.certifications.map((c) => (
            <div key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}{c.date && ` (${c.date})`}</div>
          ))}
        </AtsSection>
      )}

      {d.projects.length > 0 && (
        <AtsSection title="Projects">
          {d.projects.map((pr) => (
            <div key={pr.id} className="mb-1 break-inside-avoid">
              <div><b>{pr.name}</b>{pr.tech?.length ? ` — ${pr.tech.join(", ")}` : ""}</div>
              {pr.description && <div>{pr.description}</div>}
              {pr.bullets?.length ? <ul className="list-disc pl-5">{pr.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul> : null}
            </div>
          ))}
        </AtsSection>
      )}

      {d.achievements.length > 0 && (
        <AtsSection title="Achievements">
          <ul className="list-disc pl-5">{d.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </AtsSection>
      )}
    </div>
  );
}
function AtsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-3 break-inside-avoid">
      <div className="text-[12px] font-bold uppercase tracking-wider border-b border-neutral-800 pb-0.5 mb-1.5">{title}</div>
      <div className="text-[11.5px] leading-snug">{children}</div>
    </section>
  );
}

/* ---------- 2. Modern Professional (sidebar + main) ---------- */
function ModernTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 grid grid-cols-[34%_1fr] font-sans">
      <aside className="bg-neutral-50 border-r border-neutral-200 p-7">
        <div className="text-[22px] font-semibold leading-tight tracking-tight">{name}</div>
        {p.headline && <div className="text-[11px] text-neutral-500 mt-1">{p.headline}</div>}
        <div className="h-px bg-neutral-300 my-4" />
        <SideBlock title="Contact"><ContactStack p={p} className="text-neutral-700" /></SideBlock>

        {(d.skills.technical.length + d.skills.tools.length) > 0 && (
          <SideBlock title="Skills">
            {d.skills.technical.length > 0 && (
              <div className="mb-1.5">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">Technical</div>
                <div>{d.skills.technical.join(" · ")}</div>
              </div>
            )}
            {d.skills.tools.length > 0 && (
              <div className="mb-1.5">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">Tools</div>
                <div>{d.skills.tools.join(" · ")}</div>
              </div>
            )}
            {d.skills.soft.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">Soft</div>
                <div>{d.skills.soft.join(" · ")}</div>
              </div>
            )}
          </SideBlock>
        )}

        {d.certifications.length > 0 && (
          <SideBlock title="Certifications">
            {d.certifications.map((c) => (
              <div key={c.id} className="mb-1">
                <div className="font-medium">{c.name}</div>
                <div className="text-neutral-500 text-[10px]">{[c.issuer, c.date].filter(Boolean).join(" · ")}</div>
              </div>
            ))}
          </SideBlock>
        )}

        {d.skills.languages.length > 0 && (
          <SideBlock title="Languages"><div>{d.skills.languages.join(" · ")}</div></SideBlock>
        )}

        {d.education.length > 0 && (
          <SideBlock title="Education">
            {d.education.map((ed) => (
              <div key={ed.id} className="mb-1.5 break-inside-avoid">
                <div className="font-medium">{joinNonEmpty([ed.degree, ed.field], ", ")}</div>
                <div className="text-neutral-600">{ed.institution}</div>
                <div className="text-neutral-500 text-[10px]">{ed.startDate} – {ed.endDate}</div>
              </div>
            ))}
          </SideBlock>
        )}
      </aside>

      <main className="p-7">
        {d.summary && (
          <MainBlock title="Profile" accent><p>{d.summary}</p></MainBlock>
        )}
        {d.experience.length > 0 && (
          <MainBlock title="Experience" accent>
            {d.experience.map((e) => (
              <div key={e.id} className="mb-2.5 break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-semibold text-[12.5px]">{e.role}</div>
                  <div className="text-[10.5px] text-neutral-500 shrink-0">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
                </div>
                <div className="text-[11px] text-neutral-600">{joinNonEmpty([e.company, e.location])}</div>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            ))}
          </MainBlock>
        )}
        {d.projects.length > 0 && (
          <MainBlock title="Projects" accent>
            {d.projects.map((pr) => (
              <div key={pr.id} className="mb-1.5 break-inside-avoid">
                <div className="flex justify-between">
                  <div className="font-semibold">{pr.name}</div>
                  {pr.tech?.length ? <div className="text-[10.5px] text-neutral-500">{pr.tech.join(" · ")}</div> : null}
                </div>
                {pr.description && <div>{pr.description}</div>}
              </div>
            ))}
          </MainBlock>
        )}
        {d.achievements.length > 0 && (
          <MainBlock title="Achievements" accent>
            <ul className="list-disc pl-4">{d.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </MainBlock>
        )}
      </main>
    </div>
  );
}
function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 break-inside-avoid">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-1.5">{title}</div>
      <div className="text-[11px] leading-snug text-neutral-800">{children}</div>
    </div>
  );
}
function MainBlock({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <section className="mb-4 break-inside-avoid">
      <div className="flex items-center gap-2 mb-1.5">
        {accent && <div className="h-3 w-1 rounded-full bg-gradient-to-b from-amber-500 to-violet-500" />}
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-800">{title}</h3>
      </div>
      <div className="text-[11.5px] leading-snug text-neutral-800">{children}</div>
    </section>
  );
}

/* ---------- 3. Executive ---------- */
function ExecutiveTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  const impactBullets = d.experience.flatMap((e) => e.bullets).slice(0, 3);
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-11 py-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
      <header className="border-b-2 border-neutral-900 pb-4 mb-5">
        <div className="text-[34px] leading-none">{name}</div>
        {p.headline && (
          <div className="mt-2 text-[10.5px] tracking-[0.35em] uppercase text-neutral-600" style={{ fontFamily: "'Geist', sans-serif" }}>
            {p.headline}
          </div>
        )}
        <div className="mt-3" style={{ fontFamily: "'Geist', sans-serif" }}>
          <ContactInline p={p} />
        </div>
      </header>

      {d.summary && (
        <ExecSection title="Executive Profile"><p className="text-[12.5px] leading-relaxed">{d.summary}</p></ExecSection>
      )}

      {impactBullets.length > 0 && (
        <ExecSection title="Career Highlights">
          <ul className="grid grid-cols-1 gap-1.5">
            {impactBullets.map((b, i) => (
              <li key={i} className="pl-4 relative text-[11.5px] leading-snug">
                <span className="absolute left-0 top-2 h-1 w-2 bg-neutral-900" />{b}
              </li>
            ))}
          </ul>
        </ExecSection>
      )}

      {(d.skills.technical.length + d.skills.soft.length) > 0 && (
        <ExecSection title="Core Competencies">
          <div className="grid grid-cols-3 gap-x-4 gap-y-0.5 text-[11px]" style={{ fontFamily: "'Geist', sans-serif" }}>
            {[...d.skills.soft, ...d.skills.technical, ...d.skills.tools].slice(0, 15).map((s, i) => (
              <div key={i}>· {s}</div>
            ))}
          </div>
        </ExecSection>
      )}

      {d.experience.length > 0 && (
        <ExecSection title="Professional Experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-3 break-inside-avoid" style={{ fontFamily: "'Geist', sans-serif" }}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[13px]" style={{ fontFamily: "'Instrument Serif', serif" }}>{e.company}</span>
                  <span className="text-neutral-600 text-[11px]"> · {e.location}</span>
                </div>
                <div className="text-[10.5px] uppercase tracking-widest text-neutral-500">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
              </div>
              <div className="text-[11.5px] font-semibold uppercase tracking-wider">{e.role}</div>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11.5px]">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </ExecSection>
      )}

      {d.education.length > 0 && (
        <ExecSection title="Education">
          {d.education.map((ed) => (
            <div key={ed.id} className="flex justify-between text-[11.5px]" style={{ fontFamily: "'Geist', sans-serif" }}>
              <div><b>{ed.institution}</b> — {joinNonEmpty([ed.degree, ed.field], ", ")}</div>
              <div className="text-neutral-500">{ed.startDate} – {ed.endDate}</div>
            </div>
          ))}
        </ExecSection>
      )}

      {d.achievements.length > 0 && (
        <ExecSection title="Recognition">
          <ul className="list-disc pl-4 text-[11.5px]" style={{ fontFamily: "'Geist', sans-serif" }}>
            {d.achievements.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </ExecSection>
      )}
    </div>
  );
}
function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 break-inside-avoid">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-[10.5px] tracking-[0.4em] uppercase text-neutral-500" style={{ fontFamily: "'Geist', sans-serif" }}>{title}</h3>
        <div className="h-px flex-1 bg-neutral-300" />
      </div>
      {children}
    </section>
  );
}

/* ---------- 4. Minimal Clean ---------- */
function MinimalTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-16 py-14 font-sans">
      <header className="mb-10">
        <div className="text-[36px] font-light tracking-tight leading-none">{name}</div>
        {p.headline && <div className="mt-2 text-[12px] text-neutral-500">{p.headline}</div>}
        <div className="mt-4 text-[10.5px] text-neutral-500">
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join("  ·  ")}
        </div>
      </header>

      {d.summary && (
        <MinSection title="about"><p className="text-[12px] leading-relaxed text-neutral-700">{d.summary}</p></MinSection>
      )}

      {d.experience.length > 0 && (
        <MinSection title="experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-4 break-inside-avoid grid grid-cols-[110px_1fr] gap-6">
              <div className="text-[10.5px] text-neutral-500 pt-0.5">{e.startDate}<br />{e.current ? "Present" : e.endDate}</div>
              <div>
                <div className="text-[12.5px]">{e.role} <span className="text-neutral-500">· {e.company}</span></div>
                {e.location && <div className="text-[10.5px] text-neutral-500">{e.location}</div>}
                <ul className="mt-1 space-y-0.5 text-[11.5px] text-neutral-800">{e.bullets.map((b, i) => <li key={i}>— {b}</li>)}</ul>
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {d.projects.length > 0 && (
        <MinSection title="projects">
          {d.projects.map((pr) => (
            <div key={pr.id} className="mb-2 break-inside-avoid grid grid-cols-[110px_1fr] gap-6">
              <div className="text-[10.5px] text-neutral-500">{pr.tech?.slice(0, 2).join(", ")}</div>
              <div>
                <div className="text-[12px]">{pr.name}</div>
                {pr.description && <div className="text-[11.5px] text-neutral-700">{pr.description}</div>}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {d.education.length > 0 && (
        <MinSection title="education">
          {d.education.map((ed) => (
            <div key={ed.id} className="grid grid-cols-[110px_1fr] gap-6 mb-1.5">
              <div className="text-[10.5px] text-neutral-500">{ed.startDate} – {ed.endDate}</div>
              <div className="text-[11.5px]">{ed.institution}<span className="text-neutral-500"> · {joinNonEmpty([ed.degree, ed.field], ", ")}</span></div>
            </div>
          ))}
        </MinSection>
      )}

      {(d.skills.technical.length + d.skills.tools.length + d.skills.soft.length) > 0 && (
        <MinSection title="skills">
          <div className="grid grid-cols-[110px_1fr] gap-6 text-[11.5px]">
            <div className="text-[10.5px] text-neutral-500">selected</div>
            <div>{[...d.skills.technical, ...d.skills.tools, ...d.skills.soft].join(" · ")}</div>
          </div>
        </MinSection>
      )}
    </div>
  );
}
function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 break-inside-avoid">
      <div className="text-[10.5px] tracking-[0.3em] text-neutral-400 mb-3">— {title}</div>
      {children}
    </section>
  );
}

/* ---------- 5. Developer ---------- */
function DeveloperTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-8 py-8" style={{ fontFamily: "'JetBrains Mono', 'Menlo', monospace" }}>
      <header className="border-b border-neutral-300 pb-3 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-emerald-600">$</span>
          <span className="text-[22px] font-bold">{name}</span>
        </div>
        <div className="text-[11px] text-neutral-500 mt-0.5">// {p.headline || "Engineer"}</div>
        <div className="text-[10.5px] text-neutral-700 mt-1 flex flex-wrap gap-x-3">
          {[p.email, p.phone, p.github, p.linkedin, p.website, p.location].filter(Boolean).map((x, i) => <span key={i}>{x}</span>)}
        </div>
      </header>

      {d.summary && (
        <DevSection title="about.md"><p>{d.summary}</p></DevSection>
      )}

      {(d.skills.technical.length + d.skills.tools.length) > 0 && (
        <DevSection title="skills.json">
          <div className="text-[11px] space-y-0.5">
            {d.skills.technical.length > 0 && <div><span className="text-emerald-700">languages</span>: [{d.skills.technical.join(", ")}]</div>}
            {d.skills.tools.length > 0 && <div><span className="text-emerald-700">tools</span>: [{d.skills.tools.join(", ")}]</div>}
            {d.skills.soft.length > 0 && <div><span className="text-emerald-700">soft</span>: [{d.skills.soft.join(", ")}]</div>}
            {d.skills.languages.length > 0 && <div><span className="text-emerald-700">spoken</span>: [{d.skills.languages.join(", ")}]</div>}
          </div>
        </DevSection>
      )}

      {d.experience.length > 0 && (
        <DevSection title="experience/">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-2 break-inside-avoid">
              <div className="flex justify-between font-semibold">
                <span>▸ {e.role} <span className="text-neutral-500">@ {e.company}</span></span>
                <span className="text-neutral-500 text-[10.5px]">{e.startDate}..{e.current ? "now" : e.endDate}</span>
              </div>
              <ul className="pl-4 mt-0.5 text-[11px]">{e.bullets.map((b, i) => <li key={i}>- {b}</li>)}</ul>
            </div>
          ))}
        </DevSection>
      )}

      {d.projects.length > 0 && (
        <DevSection title="projects/">
          {d.projects.map((pr) => (
            <div key={pr.id} className="mb-2 break-inside-avoid border-l-2 border-emerald-500 pl-3">
              <div className="font-semibold">{pr.name} <span className="text-neutral-400 font-normal">v1.0</span></div>
              {pr.tech?.length ? <div className="text-[10.5px] text-emerald-700">[{pr.tech.join(", ")}]</div> : null}
              {pr.description && <div className="text-[11px]">{pr.description}</div>}
              {pr.bullets?.length ? <ul className="pl-4 text-[11px]">{pr.bullets.map((b, i) => <li key={i}>- {b}</li>)}</ul> : null}
              {pr.link && <div className="text-[10.5px] text-neutral-500">→ {pr.link}</div>}
            </div>
          ))}
        </DevSection>
      )}

      {d.education.length > 0 && (
        <DevSection title="education/">
          {d.education.map((ed) => (
            <div key={ed.id} className="text-[11px]">
              <b>{ed.institution}</b> — {joinNonEmpty([ed.degree, ed.field], ", ")} <span className="text-neutral-500">({ed.startDate}–{ed.endDate})</span>
            </div>
          ))}
        </DevSection>
      )}

      {d.certifications.length > 0 && (
        <DevSection title="certs/">
          {d.certifications.map((c) => (
            <div key={c.id} className="text-[11px]">✓ {c.name}{c.issuer && ` — ${c.issuer}`}</div>
          ))}
        </DevSection>
      )}
    </div>
  );
}
function DevSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3 break-inside-avoid">
      <div className="text-[11px] text-emerald-700 font-bold mb-1">## {title}</div>
      <div className="text-[11px] leading-snug">{children}</div>
    </section>
  );
}

/* ---------- 6. Creative ---------- */
function CreativeTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  const initials = name.split(/\s+/).map(x => x[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 grid grid-cols-[42%_1fr] font-sans">
      <aside className="relative overflow-hidden text-white p-7"
        style={{ background: "linear-gradient(160deg, #7c3aed 0%, #ec4899 55%, #f97316 100%)" }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute bottom-4 -left-8 w-32 h-32 rotate-12 bg-white/10" />
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-white/25 backdrop-blur grid place-items-center text-[22px] font-bold">{initials}</div>
          <div className="mt-4 text-[26px] font-bold leading-tight">{name}</div>
          <div className="text-[11px] opacity-90 mt-1">{p.headline}</div>

          <div className="mt-6 space-y-1 text-[10.5px]">
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((x, i) => <div key={i}>{x}</div>)}
          </div>

          {(d.skills.technical.length + d.skills.tools.length) > 0 && (
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-80 mb-2">Toolkit</div>
              <div className="flex flex-wrap gap-1.5">
                {[...d.skills.technical, ...d.skills.tools].slice(0, 20).map((s, i) => (
                  <span key={i} className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">{s}</span>
                ))}
              </div>
            </div>
          )}

          {d.education.length > 0 && (
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-80 mb-2">Education</div>
              {d.education.map((ed) => (
                <div key={ed.id} className="text-[10.5px] mb-2">
                  <div className="font-semibold">{ed.degree}</div>
                  <div className="opacity-90">{ed.institution}</div>
                  <div className="opacity-75">{ed.startDate} – {ed.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <div className="p-7">
        {d.summary && (
          <CreativeSection title="Portfolio Statement" color="fuchsia">
            <p className="text-[12px] leading-relaxed">{d.summary}</p>
          </CreativeSection>
        )}

        {d.projects.length > 0 && (
          <CreativeSection title="Featured Work" color="fuchsia">
            <div className="grid grid-cols-2 gap-2">
              {d.projects.slice(0, 6).map((pr) => (
                <div key={pr.id} className="break-inside-avoid rounded-md border border-neutral-200 p-2">
                  <div className="h-16 rounded bg-gradient-to-br from-fuchsia-100 via-pink-100 to-orange-100 mb-1.5" />
                  <div className="font-semibold text-[11.5px]">{pr.name}</div>
                  {pr.description && <div className="text-[10.5px] text-neutral-600 line-clamp-2">{pr.description}</div>}
                </div>
              ))}
            </div>
          </CreativeSection>
        )}

        {d.experience.length > 0 && (
          <CreativeSection title="Experience" color="fuchsia">
            {d.experience.map((e) => (
              <div key={e.id} className="mb-2 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-[12px]">{e.role}</div>
                  <div className="text-[10px] text-neutral-500">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
                </div>
                <div className="text-[10.5px] text-neutral-600">{joinNonEmpty([e.company, e.location])}</div>
                <ul className="list-disc pl-4 mt-0.5 text-[11px]">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            ))}
          </CreativeSection>
        )}

        {d.achievements.length > 0 && (
          <CreativeSection title="Awards" color="fuchsia">
            <ul className="list-disc pl-4 text-[11px]">{d.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </CreativeSection>
        )}
      </div>
    </div>
  );
}
function CreativeSection({ title, children }: { title: string; children: React.ReactNode; color?: string }) {
  return (
    <section className="mb-3 break-inside-avoid">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="h-2 w-2 rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-500" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia-700">{title}</h3>
      </div>
      {children}
    </section>
  );
}

/* ---------- 7. Student / Fresher ---------- */
function StudentTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-9 py-8 font-sans">
      <header className="rounded-lg p-4 mb-4" style={{ background: "linear-gradient(120deg, #eff6ff 0%, #eef2ff 100%)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[24px] font-bold tracking-tight">{name}</div>
            {p.headline && <div className="text-[11.5px] text-indigo-700 mt-0.5">{p.headline}</div>}
          </div>
          <div className="text-right text-[10.5px] text-neutral-700 space-y-0.5">
            {[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).map((x, i) => <div key={i}>{x}</div>)}
          </div>
        </div>
      </header>

      {d.summary && (
        <StuSection title="Career Objective">
          <p className="text-[11.5px]">{d.summary}</p>
        </StuSection>
      )}

      {d.education.length > 0 && (
        <StuSection title="Education">
          {d.education.map((ed) => (
            <div key={ed.id} className="mb-1.5 break-inside-avoid">
              <div className="flex justify-between">
                <div className="font-semibold text-[12px]">{ed.institution}</div>
                <div className="text-[10.5px] text-neutral-500">{ed.startDate} – {ed.endDate}</div>
              </div>
              <div className="text-[11px] text-neutral-700">{joinNonEmpty([ed.degree, ed.field], ", ")}{ed.gpa && ` · GPA ${ed.gpa}`}</div>
            </div>
          ))}
        </StuSection>
      )}

      {(d.skills.technical.length + d.skills.tools.length + d.skills.soft.length) > 0 && (
        <StuSection title="Technical Skills">
          <div className="flex flex-wrap gap-1.5">
            {[...d.skills.technical, ...d.skills.tools, ...d.skills.soft].map((s, i) => (
              <span key={i} className="text-[10.5px] bg-indigo-50 border border-indigo-100 text-indigo-800 rounded px-2 py-0.5">{s}</span>
            ))}
          </div>
        </StuSection>
      )}

      {d.projects.length > 0 && (
        <StuSection title="Academic Projects">
          <div className="grid gap-2">
            {d.projects.map((pr) => (
              <div key={pr.id} className="border border-neutral-200 rounded-md p-2.5 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-[12px]">{pr.name}</div>
                  {pr.tech?.length ? <div className="text-[10px] text-indigo-700">{pr.tech.join(" · ")}</div> : null}
                </div>
                {pr.description && <div className="text-[11px] text-neutral-700 mt-0.5">{pr.description}</div>}
                {pr.bullets?.length ? (
                  <ul className="list-disc pl-4 mt-1 text-[10.5px] text-neutral-800">{pr.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
                ) : null}
              </div>
            ))}
          </div>
        </StuSection>
      )}

      {d.experience.length > 0 && (
        <StuSection title="Internships & Experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-1.5 break-inside-avoid">
              <div className="flex justify-between">
                <div className="text-[12px]"><b>{e.role}</b> · {e.company}</div>
                <div className="text-[10.5px] text-neutral-500">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
              </div>
              <ul className="list-disc pl-4 text-[11px]">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </StuSection>
      )}

      {d.certifications.length > 0 && (
        <StuSection title="Certifications">
          <ul className="grid grid-cols-2 gap-x-4 text-[11px] list-disc pl-4">
            {d.certifications.map((c) => <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}</li>)}
          </ul>
        </StuSection>
      )}

      {d.achievements.length > 0 && (
        <StuSection title="Achievements & Activities">
          <ul className="list-disc pl-4 text-[11px]">{d.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </StuSection>
      )}
    </div>
  );
}
function StuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3 break-inside-avoid">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="h-4 w-1 rounded-full bg-gradient-to-b from-sky-400 to-indigo-500" />
        <h3 className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-indigo-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

/* ---------- dispatcher ---------- */
export function ResumeRender({ data, template }: { data: ResumeData; template: TemplateId }) {
  switch (template) {
    case "ats": return <AtsTemplate d={data} />;
    case "modern": return <ModernTemplate d={data} />;
    case "executive": return <ExecutiveTemplate d={data} />;
    case "minimal": return <MinimalTemplate d={data} />;
    case "developer": return <DeveloperTemplate d={data} />;
    case "creative": return <CreativeTemplate d={data} />;
    case "student": return <StudentTemplate d={data} />;
    case "biodata": return <BiodataTemplate d={data} />;
    case "cv-classic": return <CvClassicTemplate d={data} />;
    case "photo-sidebar": return <PhotoSidebarTemplate d={data} />;
    case "teal-professional": return <TealProfessionalTemplate d={data} />;
    case "timeline": return <TimelineTemplate d={data} />;
    default: return <ModernTemplate d={data} />;
  }
}

/* ---------- AI recommendation ---------- */
export function recommendTemplate(d: ResumeData): { id: TemplateId; reason: string } {
  const text = [
    d.personalInfo.headline,
    d.summary,
    ...d.experience.map((e) => `${e.role} ${e.company} ${e.bullets.join(" ")}`),
    ...d.projects.map((p) => `${p.name} ${p.description ?? ""} ${(p.tech ?? []).join(" ")}`),
    ...d.skills.technical, ...d.skills.tools,
  ].join(" ").toLowerCase();

  const yearsHint = /(\d{1,2})\+?\s*years/.exec(text)?.[1];
  const years = yearsHint ? parseInt(yearsHint, 10) : 0;
  const hasExec = /(director|vp |vice president|head of|chief|founder|ceo|cto|executive|leadership)/.test(text);
  const hasDev = /(engineer|developer|software|python|javascript|typescript|react|kubernetes|api|backend|frontend|devops|ml|data scientist)/.test(text);
  const hasDesign = /(designer|design|figma|brand|creative|illustrat|ux|ui\/|photograph)/.test(text);
  const isStudent = d.experience.length <= 1 && (d.education.length > 0 || d.projects.length > 0) &&
    /(student|fresher|intern|university|college|bachelor|b\.?tech|b\.?sc|m\.?sc|graduate)/.test(text);

  if (isStudent) return { id: "student", reason: "You're early-career — this template leads with education, projects, and internships to make your strongest evidence land first." };
  if (hasExec || years >= 10) return { id: "executive", reason: "Your profile signals senior leadership — this template foregrounds executive impact, competencies, and career achievements." };
  if (hasDev) return { id: "developer", reason: "Your background is technical — this template gives your stacks and projects the visual weight recruiters look for." };
  if (hasDesign) return { id: "creative", reason: "Design-leaning profile — this template presents portfolio work with a distinctive visual identity while staying readable." };
  if (d.experience.length >= 2) return { id: "modern", reason: "Balanced professional profile — a modern sidebar layout keeps skills scannable while experience takes the main stage." };
  return { id: "ats", reason: "Safe default for most corporate applications — maximizes ATS parsing while looking clean." };
}

/** Small scaled preview card (for the gallery) */
export function ResumeThumb({ data, template }: { data: ResumeData; template: TemplateId }) {
  return (
    <div className="relative w-full aspect-[8.5/11] rounded-md overflow-hidden bg-white shadow-elevated">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: "816px", height: "1056px", transform: "scale(var(--s, 0.36))" }}
      >
        <ResumeRender data={data} template={template} />
      </div>
    </div>
  );
}

/* ---------- 8. Classic Biodata (Indian) ---------- */
function BiodataTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-10 py-9" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
      <header className="text-center border-b-2 border-double border-neutral-800 pb-3 mb-4">
        <div className="text-[13px] tracking-[0.4em] uppercase text-neutral-600">Curriculum Vitae</div>
        <div className="text-[28px] font-bold tracking-wide uppercase mt-1">{name}</div>
        {p.headline && <div className="text-[11.5px] italic text-neutral-700 mt-0.5">{p.headline}</div>}
        <div className="mt-2 text-[10.5px] text-neutral-700">
          {[p.email, p.phone, p.location].filter(Boolean).join("   |   ")}
        </div>
      </header>

      {d.summary && (
        <BioSection title="Career Objective">
          <p className="text-[11.5px] leading-relaxed text-justify">{d.summary}</p>
        </BioSection>
      )}

      {d.education.length > 0 && (
        <BioSection title="Academic Qualification">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-400 px-2 py-1 text-left">Qualification</th>
                <th className="border border-neutral-400 px-2 py-1 text-left">Institution / Board</th>
                <th className="border border-neutral-400 px-2 py-1 text-left">Year</th>
                <th className="border border-neutral-400 px-2 py-1 text-left">%/CGPA</th>
              </tr>
            </thead>
            <tbody>
              {d.education.map((ed) => (
                <tr key={ed.id}>
                  <td className="border border-neutral-400 px-2 py-1">{joinNonEmpty([ed.degree, ed.field], ", ")}</td>
                  <td className="border border-neutral-400 px-2 py-1">{ed.institution}</td>
                  <td className="border border-neutral-400 px-2 py-1">{ed.endDate || ed.startDate || "—"}</td>
                  <td className="border border-neutral-400 px-2 py-1">{ed.gpa || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </BioSection>
      )}

      {d.experience.length > 0 && (
        <BioSection title="Work Experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-2 break-inside-avoid">
              <div className="flex justify-between text-[11.5px]">
                <div><b>{e.role}</b>, {e.company}{e.location ? `, ${e.location}` : ""}</div>
                <div className="italic text-neutral-600">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
              </div>
              <ul className="list-disc pl-5 text-[11px]">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </BioSection>
      )}

      {d.projects.length > 0 && (
        <BioSection title="Projects Undertaken">
          {d.projects.map((pr) => (
            <div key={pr.id} className="mb-1 text-[11px]">
              <b>{pr.name}</b>{pr.tech?.length ? ` — ${pr.tech.join(", ")}` : ""}
              {pr.description && <div>{pr.description}</div>}
            </div>
          ))}
        </BioSection>
      )}

      {(d.skills.technical.length + d.skills.tools.length + d.skills.soft.length) > 0 && (
        <BioSection title="Key Skills">
          <div className="text-[11px]">{[...d.skills.technical, ...d.skills.tools, ...d.skills.soft].join(", ")}</div>
        </BioSection>
      )}

      {d.certifications.length > 0 && (
        <BioSection title="Certifications">
          <ul className="list-disc pl-5 text-[11px]">
            {d.certifications.map((c) => <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}{c.date && ` (${c.date})`}</li>)}
          </ul>
        </BioSection>
      )}

      {d.achievements.length > 0 && (
        <BioSection title="Achievements">
          <ul className="list-disc pl-5 text-[11px]">{d.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </BioSection>
      )}

      <BioSection title="Personal Details">
        <table className="text-[11px]">
          <tbody>
            {p.location && <tr><td className="pr-4 py-0.5"><b>Address</b></td><td>: {p.location}</td></tr>}
            {p.phone && <tr><td className="pr-4 py-0.5"><b>Mobile</b></td><td>: {p.phone}</td></tr>}
            {p.email && <tr><td className="pr-4 py-0.5"><b>Email</b></td><td>: {p.email}</td></tr>}
            {d.skills.languages.length > 0 && <tr><td className="pr-4 py-0.5"><b>Languages Known</b></td><td>: {d.skills.languages.join(", ")}</td></tr>}
          </tbody>
        </table>
      </BioSection>

      <div className="mt-6 text-[11px]">
        <div className="font-semibold underline">Declaration</div>
        <p className="mt-1 text-justify">I hereby declare that the above information is true and correct to the best of my knowledge and belief.</p>
        <div className="flex justify-between mt-6">
          <div>
            <div>Date: __________</div>
            <div>Place: {p.location || "__________"}</div>
          </div>
          <div className="text-right">
            <div className="italic">Signature</div>
            <div className="mt-4 font-semibold">({name})</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function BioSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3 break-inside-avoid">
      <div className="text-[12px] font-bold uppercase tracking-wider bg-neutral-100 border-l-4 border-neutral-800 px-2 py-1 mb-1.5">{title}</div>
      <div>{children}</div>
    </section>
  );
}

/* ---------- 9. Formal CV (Curriculum Vitae) ---------- */
function CvClassicTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-11 py-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <header className="mb-4">
        <div className="text-center text-[12px] tracking-[0.5em] uppercase text-neutral-500">Curriculum Vitae</div>
        <div className="text-[26px] font-semibold tracking-wide mt-1">{name}</div>
        {p.headline && <div className="text-[11.5px] text-neutral-700 italic">{p.headline}</div>}
        <div className="mt-1.5 text-[10.5px] text-neutral-700">
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join("  •  ")}
        </div>
        <div className="border-b border-neutral-800 mt-2" />
      </header>

      {d.summary && <CvSection title="Objective"><p className="text-[11.5px] text-justify">{d.summary}</p></CvSection>}

      {d.education.length > 0 && (
        <CvSection title="Educational Qualifications">
          {d.education.map((ed) => (
            <div key={ed.id} className="text-[11.5px] mb-1 flex">
              <span className="mr-2">➤</span>
              <div className="flex-1">
                <b>{joinNonEmpty([ed.degree, ed.field], ", ")}</b> — {ed.institution}
                <span className="text-neutral-600"> ({ed.startDate} – {ed.endDate}){ed.gpa ? `, ${ed.gpa}` : ""}</span>
              </div>
            </div>
          ))}
        </CvSection>
      )}

      {d.experience.length > 0 && (
        <CvSection title="Work Experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-2 break-inside-avoid text-[11.5px]">
              <div className="flex">
                <span className="mr-2">➤</span>
                <div className="flex-1">
                  <b>{e.role}</b>, {e.company}{e.location ? `, ${e.location}` : ""}
                  <span className="text-neutral-600"> ({e.startDate} – {e.current ? "Present" : e.endDate})</span>
                </div>
              </div>
              <ul className="pl-8">{e.bullets.map((b, i) => <li key={i} className="flex"><span className="mr-2">•</span><span>{b}</span></li>)}</ul>
            </div>
          ))}
        </CvSection>
      )}

      {d.projects.length > 0 && (
        <CvSection title="Projects">
          {d.projects.map((pr) => (
            <div key={pr.id} className="text-[11.5px] mb-1 flex">
              <span className="mr-2">➤</span>
              <div className="flex-1">
                <b>{pr.name}</b>{pr.tech?.length ? ` — ${pr.tech.join(", ")}` : ""}
                {pr.description && <div className="text-neutral-700">{pr.description}</div>}
              </div>
            </div>
          ))}
        </CvSection>
      )}

      {(d.skills.technical.length + d.skills.tools.length + d.skills.soft.length) > 0 && (
        <CvSection title="Skills">
          <div className="text-[11.5px]">{[...d.skills.technical, ...d.skills.tools, ...d.skills.soft].join(", ")}</div>
        </CvSection>
      )}

      {d.certifications.length > 0 && (
        <CvSection title="Certifications">
          {d.certifications.map((c) => (
            <div key={c.id} className="text-[11.5px] flex"><span className="mr-2">➤</span><span>{c.name}{c.issuer && ` — ${c.issuer}`}{c.date && ` (${c.date})`}</span></div>
          ))}
        </CvSection>
      )}

      {d.skills.languages.length > 0 && (
        <CvSection title="Languages Known">
          <div className="text-[11.5px]">{d.skills.languages.join(", ")}</div>
        </CvSection>
      )}

      {d.achievements.length > 0 && (
        <CvSection title="Achievements">
          {d.achievements.map((a, i) => (
            <div key={i} className="text-[11.5px] flex"><span className="mr-2">➤</span><span>{a}</span></div>
          ))}
        </CvSection>
      )}
    </div>
  );
}
function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3 break-inside-avoid">
      <h3 className="text-[12.5px] font-bold underline underline-offset-4 mb-1.5">{title}</h3>
      {children}
    </section>
  );
}

/* ---------- 10. Photo Sidebar (Two-Column with dot-scale) ---------- */
function PhotoSidebarTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  const initials = name.split(/\s+/).map(x => x[0]).slice(0, 2).join("").toUpperCase();
  const skillList = [...d.skills.technical, ...d.skills.tools].slice(0, 8);
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 grid grid-cols-[38%_1fr] font-sans">
      <aside className="bg-sky-900 text-white p-6">
        <div className="h-28 w-28 mx-auto rounded-full bg-white/15 border-4 border-white/30 grid place-items-center text-[36px] font-bold">{initials}</div>
        <div className="mt-4 text-center">
          <div className="text-[18px] font-bold leading-tight">{name}</div>
          {p.headline && <div className="text-[10.5px] uppercase tracking-[0.2em] text-sky-200 mt-1">{p.headline}</div>}
        </div>
        <div className="h-px bg-white/25 my-4" />
        <PsBlock title="Contact">
          <div className="space-y-1 text-[10.5px]">
            {[p.phone, p.email, p.location, p.linkedin, p.website].filter(Boolean).map((x, i) => <div key={i} className="break-all">{x}</div>)}
          </div>
        </PsBlock>

        {skillList.length > 0 && (
          <PsBlock title="Skills">
            <div className="space-y-1.5 text-[10.5px]">
              {skillList.map((s, i) => {
                const filled = 5 - (i % 3);
                return (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <span>{s}</span>
                    <span className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} className={cx("h-1.5 w-1.5 rounded-full", j < filled ? "bg-white" : "bg-white/25")} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>
          </PsBlock>
        )}

        {d.skills.languages.length > 0 && (
          <PsBlock title="Languages">
            <div className="text-[10.5px] space-y-0.5">
              {d.skills.languages.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </PsBlock>
        )}

        {d.education.length > 0 && (
          <PsBlock title="Education">
            {d.education.map((ed) => (
              <div key={ed.id} className="mb-2 text-[10.5px]">
                <div className="font-semibold">{joinNonEmpty([ed.degree, ed.field], ", ")}</div>
                <div className="text-sky-200">{ed.institution}</div>
                <div className="text-white/70">{ed.startDate} – {ed.endDate}</div>
              </div>
            ))}
          </PsBlock>
        )}
      </aside>

      <main className="p-7">
        {d.summary && (
          <PsMain title="About Me"><p className="text-[11.5px] leading-relaxed text-neutral-800">{d.summary}</p></PsMain>
        )}

        {d.experience.length > 0 && (
          <PsMain title="Experience">
            {d.experience.map((e) => (
              <div key={e.id} className="mb-2.5 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[12px] text-sky-900">{e.role}</div>
                  <div className="text-[10.5px] text-neutral-500">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
                </div>
                <div className="text-[11px] text-neutral-600 italic">{joinNonEmpty([e.company, e.location])}</div>
                <ul className="list-disc pl-4 mt-0.5 text-[11px]">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            ))}
          </PsMain>
        )}

        {d.projects.length > 0 && (
          <PsMain title="Projects">
            {d.projects.map((pr) => (
              <div key={pr.id} className="mb-1.5 break-inside-avoid">
                <div className="font-semibold text-[11.5px]">{pr.name}{pr.tech?.length ? <span className="font-normal text-neutral-500 text-[10.5px]"> · {pr.tech.join(", ")}</span> : null}</div>
                {pr.description && <div className="text-[11px] text-neutral-700">{pr.description}</div>}
              </div>
            ))}
          </PsMain>
        )}

        {d.certifications.length > 0 && (
          <PsMain title="Certifications">
            <ul className="list-disc pl-4 text-[11px]">
              {d.certifications.map((c) => <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}</li>)}
            </ul>
          </PsMain>
        )}
      </main>
    </div>
  );
}
function PsBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-200 mb-1.5 border-b border-white/25 pb-0.5">{title}</div>
      {children}
    </div>
  );
}
function PsMain({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 break-inside-avoid">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="h-2 w-2 rounded-full bg-sky-700" />
        <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-sky-900">{title}</h3>
        <div className="h-px flex-1 bg-sky-200" />
      </div>
      {children}
    </section>
  );
}

/* ---------- 11. Teal Professional (Academic Tables) ---------- */
function TealProfessionalTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-10 py-9 font-sans">
      <header className="border-b-4 border-teal-600 pb-3 mb-4">
        <div className="text-[28px] font-bold text-teal-800 tracking-tight">{name}</div>
        {p.headline && <div className="text-[12px] text-neutral-600 mt-0.5">{p.headline}</div>}
        <div className="mt-2 text-[10.5px] text-neutral-700 flex flex-wrap gap-x-4">
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((x, i) => <span key={i}>{x}</span>)}
        </div>
      </header>

      {d.summary && (
        <TpSection title="Career Objective">
          <p className="text-[11.5px] leading-relaxed">{d.summary}</p>
        </TpSection>
      )}

      {d.education.length > 0 && (
        <TpSection title="Academic Qualification">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="border border-teal-700 px-2 py-1 text-left">Degree</th>
                <th className="border border-teal-700 px-2 py-1 text-left">Institution</th>
                <th className="border border-teal-700 px-2 py-1 text-left">Year</th>
                <th className="border border-teal-700 px-2 py-1 text-left">%/CGPA</th>
              </tr>
            </thead>
            <tbody>
              {d.education.map((ed, i) => (
                <tr key={ed.id} className={i % 2 ? "bg-teal-50" : ""}>
                  <td className="border border-teal-200 px-2 py-1">{joinNonEmpty([ed.degree, ed.field], ", ")}</td>
                  <td className="border border-teal-200 px-2 py-1">{ed.institution}</td>
                  <td className="border border-teal-200 px-2 py-1">{ed.endDate || ed.startDate || "—"}</td>
                  <td className="border border-teal-200 px-2 py-1">{ed.gpa || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TpSection>
      )}

      {d.experience.length > 0 && (
        <TpSection title="Work Experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-2 break-inside-avoid">
              <div className="flex justify-between">
                <div className="text-[12px]"><b className="text-teal-800">{e.role}</b> · {e.company}</div>
                <div className="text-[10.5px] text-neutral-500">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
              </div>
              <ul className="list-disc pl-4 mt-0.5 text-[11px]">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </TpSection>
      )}

      {d.projects.length > 0 && (
        <TpSection title="Academic Projects">
          {d.projects.map((pr) => (
            <div key={pr.id} className="mb-1.5 break-inside-avoid">
              <div className="flex justify-between">
                <div className="font-semibold text-[11.5px] text-teal-800">{pr.name}</div>
                {pr.tech?.length ? <div className="text-[10.5px] text-neutral-500">{pr.tech.join(" · ")}</div> : null}
              </div>
              {pr.description && <div className="text-[11px] text-neutral-700">{pr.description}</div>}
              {pr.bullets?.length ? <ul className="list-disc pl-4 text-[10.5px]">{pr.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul> : null}
            </div>
          ))}
        </TpSection>
      )}

      {(d.skills.technical.length + d.skills.tools.length + d.skills.soft.length) > 0 && (
        <TpSection title="Technical Skills">
          <div className="grid grid-cols-2 gap-x-6 text-[11px]">
            {d.skills.technical.length > 0 && <div><b className="text-teal-800">Technical:</b> {d.skills.technical.join(", ")}</div>}
            {d.skills.tools.length > 0 && <div><b className="text-teal-800">Tools:</b> {d.skills.tools.join(", ")}</div>}
            {d.skills.soft.length > 0 && <div><b className="text-teal-800">Soft:</b> {d.skills.soft.join(", ")}</div>}
            {d.skills.languages.length > 0 && <div><b className="text-teal-800">Languages:</b> {d.skills.languages.join(", ")}</div>}
          </div>
        </TpSection>
      )}

      {d.certifications.length > 0 && (
        <TpSection title="Certifications">
          <ul className="list-disc pl-5 grid grid-cols-2 gap-x-6 text-[11px]">
            {d.certifications.map((c) => <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}</li>)}
          </ul>
        </TpSection>
      )}

      {d.achievements.length > 0 && (
        <TpSection title="Achievements">
          <ul className="list-disc pl-5 text-[11px]">{d.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </TpSection>
      )}
    </div>
  );
}
function TpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3 break-inside-avoid">
      <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-white bg-teal-600 px-3 py-1 mb-2 rounded-sm">{title}</div>
      <div>{children}</div>
    </section>
  );
}

/* ---------- 12. Chronological Timeline ---------- */
function TimelineTemplate({ d }: { d: ResumeData }) {
  const p = d.personalInfo;
  const name = p.fullName || "Your Name";
  return (
    <div className="paper w-full h-full bg-white text-neutral-900 px-9 py-8 font-sans">
      <header className="flex items-start justify-between gap-6 mb-5">
        <div>
          <div className="text-[30px] font-bold tracking-tight leading-none" style={{ color: "#ea580c" }}>{name}</div>
          {p.headline && <div className="text-[12px] text-neutral-600 mt-1">{p.headline}</div>}
        </div>
        <div className="text-right text-[10.5px] text-neutral-700 space-y-0.5">
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((x, i) => <div key={i}>{x}</div>)}
        </div>
      </header>

      {d.summary && (
        <div className="mb-5 rounded-lg p-3" style={{ background: "linear-gradient(120deg, #fff7ed, #fef2f2)" }}>
          <div className="text-[10.5px] uppercase tracking-[0.3em] text-orange-700 mb-1">Profile</div>
          <p className="text-[11.5px] leading-relaxed">{d.summary}</p>
        </div>
      )}

      {(d.experience.length + d.education.length) > 0 && (
        <section className="mb-5 break-inside-avoid">
          <div className="text-[11.5px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-3">Journey</div>
          <div className="relative pl-6 border-l-2 border-orange-300">
            {d.experience.map((e) => (
              <div key={e.id} className="relative mb-4 break-inside-avoid">
                <span className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                <div className="text-[10.5px] font-semibold text-orange-700">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
                <div className="text-[12.5px] font-bold">{e.role} <span className="font-normal text-neutral-600">· {e.company}</span></div>
                <ul className="list-disc pl-4 mt-0.5 text-[11px]">{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            ))}
            {d.education.map((ed) => (
              <div key={ed.id} className="relative mb-4 break-inside-avoid">
                <span className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                <div className="text-[10.5px] font-semibold text-rose-700">{ed.startDate} – {ed.endDate}</div>
                <div className="text-[12.5px] font-bold">{joinNonEmpty([ed.degree, ed.field], ", ")}</div>
                <div className="text-[11px] text-neutral-600">{ed.institution}{ed.gpa ? ` · ${ed.gpa}` : ""}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-5">
        {(d.skills.technical.length + d.skills.tools.length + d.skills.soft.length) > 0 && (
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-2">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {[...d.skills.technical, ...d.skills.tools, ...d.skills.soft].map((s, i) => (
                <span key={i} className="text-[10.5px] rounded-full px-2 py-0.5 border border-orange-200 bg-orange-50 text-orange-800">{s}</span>
              ))}
            </div>
          </div>
        )}

        {d.skills.languages.length > 0 && (
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-2">Languages</div>
            <div className="flex gap-3">
              {d.skills.languages.slice(0, 4).map((l, i) => {
                const pct = 90 - i * 12;
                return (
                  <div key={i} className="text-center">
                    <div className="relative h-12 w-12">
                      <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#fed7aa" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#ea580c" strokeWidth="3"
                          strokeDasharray={`${pct} 100`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 grid place-items-center text-[9px] font-bold text-orange-700">{pct}%</div>
                    </div>
                    <div className="text-[10px] mt-1">{l}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {d.projects.length > 0 && (
        <section className="mt-5 break-inside-avoid">
          <div className="text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-2">Projects</div>
          <div className="grid grid-cols-2 gap-2">
            {d.projects.slice(0, 6).map((pr) => (
              <div key={pr.id} className="rounded-md border border-orange-200 p-2 break-inside-avoid">
                <div className="font-semibold text-[11.5px]">{pr.name}</div>
                {pr.tech?.length ? <div className="text-[10px] text-orange-700">{pr.tech.join(" · ")}</div> : null}
                {pr.description && <div className="text-[10.5px] text-neutral-700 mt-0.5">{pr.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {(d.certifications.length + d.achievements.length) > 0 && (
        <section className="mt-4 grid grid-cols-2 gap-5 break-inside-avoid">
          {d.certifications.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-1.5">Certifications</div>
              <ul className="list-disc pl-4 text-[11px]">
                {d.certifications.map((c) => <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}</li>)}
              </ul>
            </div>
          )}
          {d.achievements.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-1.5">Achievements</div>
              <ul className="list-disc pl-4 text-[11px]">{d.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
