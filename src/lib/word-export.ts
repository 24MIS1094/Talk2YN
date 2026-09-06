import type { ResumeData } from "./resume-schema";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

function safeFileName(value: string) {
  const cleaned = value.replace(/[\\/:*?"<>|]+/g, "_").trim();
  return cleaned || "Resume";
}

/** Build a Word-compatible HTML document (.doc) that mirrors the resume content. */
export function buildResumeWordHTML(r: ResumeData): string {
  const p = r.personalInfo;
  const contact = [p.email, p.phone, p.location, p.website, p.linkedin, p.github]
    .filter(Boolean)
    .map((v) => esc(String(v)))
    .join(" &nbsp;•&nbsp; ");

  const section = (title: string, body: string) =>
    body ? `<h2>${esc(title)}</h2>${body}` : "";

  const bullets = (items?: string[]) =>
    items?.length ? `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "";

  const experience = r.experience
    .map(
      (e) => `<p class="entry"><b>${esc(e.role || "")}</b>${e.company ? ` — ${esc(e.company)}` : ""}
      <span class="meta">${esc([e.startDate, e.current ? "Present" : e.endDate].filter(Boolean).join(" – "))}${e.location ? ` · ${esc(e.location)}` : ""}</span></p>${bullets(e.bullets)}`,
    )
    .join("");

  const projects = r.projects
    .map(
      (pr) => `<p class="entry"><b>${esc(pr.name)}</b>${pr.link ? ` — ${esc(pr.link)}` : ""}</p>
      ${pr.description ? `<p>${esc(pr.description)}</p>` : ""}${bullets(pr.bullets)}
      ${pr.tech?.length ? `<p class="meta">Tech: ${esc(pr.tech.join(", "))}</p>` : ""}`,
    )
    .join("");

  const education = r.education
    .map(
      (ed) => `<p class="entry"><b>${esc(ed.institution)}</b>
      <span class="meta">${esc([ed.degree, ed.field].filter(Boolean).join(", "))}${
        ed.startDate || ed.endDate ? ` · ${esc([ed.startDate, ed.endDate].filter(Boolean).join(" – "))}` : ""
      }${ed.gpa ? ` · GPA ${esc(ed.gpa)}` : ""}</span></p>${bullets(ed.details)}`,
    )
    .join("");

  const skillLines = (
    [
      ["Technical", r.skills.technical],
      ["Tools", r.skills.tools],
      ["Soft Skills", r.skills.soft],
      ["Languages", r.skills.languages],
    ] as Array<[string, string[]]>
  )
    .filter(([, arr]) => arr.length)
    .map(([label, arr]) => `<p><b>${label}:</b> ${esc(arr.join(", "))}</p>`)
    .join("");

  const certifications = r.certifications
    .map(
      (c) =>
        `<p class="entry"><b>${esc(c.name)}</b><span class="meta">${esc(
          [c.issuer, c.date].filter(Boolean).join(" · "),
        )}</span></p>`,
    )
    .join("");

  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>${esc(p.fullName || "Resume")}</title>
<style>
  @page { size: 8.5in 11in; margin: 0.6in; }
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #111; line-height: 1.35; }
  h1 { font-size: 22pt; margin: 0 0 2pt; }
  .headline { font-size: 11pt; color: #444; margin: 0 0 4pt; }
  .contact { font-size: 9.5pt; color: #444; margin: 0 0 10pt; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #999; padding-bottom: 2pt; margin: 14pt 0 6pt; }
  p { margin: 0 0 4pt; }
  .entry { margin-top: 6pt; }
  .meta { display: block; font-size: 9.5pt; color: #555; }
  ul { margin: 2pt 0 4pt 18pt; padding: 0; }
  li { margin: 0 0 2pt; }
</style>
</head>
<body>
  <h1>${esc(p.fullName || "Your Name")}</h1>
  ${p.headline ? `<p class="headline">${esc(p.headline)}</p>` : ""}
  ${contact ? `<p class="contact">${contact}</p>` : ""}
  ${section("Summary", r.summary ? `<p>${esc(r.summary)}</p>` : "")}
  ${section("Experience", experience)}
  ${section("Projects", projects)}
  ${section("Education", education)}
  ${section("Skills", skillLines)}
  ${section("Certifications", certifications)}
  ${section("Achievements", bullets(r.achievements))}
</body>
</html>`;
}

export function downloadResumeWord(r: ResumeData, name?: string) {
  const html = buildResumeWordHTML(r);
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFileName(name || r.personalInfo.fullName || "Resume")}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
