import type { ResumeData } from "./resume-schema";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

export function buildPortfolioHTML(r: ResumeData): string {
  const p = r.personalInfo;
  const links = [
    p.website && { label: "Website", href: p.website },
    p.linkedin && { label: "LinkedIn", href: p.linkedin },
    p.github && { label: "GitHub", href: p.github },
    p.email && { label: "Email", href: `mailto:${p.email}` },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(p.fullName || "Portfolio")} — Portfolio</title>
<meta name="description" content="${esc(p.headline || r.summary || "Personal portfolio")}" />
<style>
  :root { --bg:#0b0b0f; --fg:#f5f5f0; --muted:#a3a3a8; --ember:#ff6b35; --magenta:#e84393; --violet:#6c5ce7; }
  * { box-sizing:border-box; margin:0; padding:0; }
  html, body { background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; line-height:1.55; -webkit-font-smoothing:antialiased; }
  a { color: inherit; }
  .wrap { max-width: 960px; margin: 0 auto; padding: 64px 24px 96px; }
  .hero { position: relative; padding: 80px 0 40px; }
  .hero:before { content:""; position:absolute; inset:-40px -40px auto -40px; height:340px; background: radial-gradient(600px 300px at 20% 20%, rgba(255,107,53,0.35), transparent 60%), radial-gradient(500px 300px at 80% 30%, rgba(232,67,147,0.3), transparent 60%); filter: blur(30px); z-index:-1; }
  .eyebrow { text-transform:uppercase; letter-spacing:0.3em; font-size:11px; color:var(--muted); margin-bottom:12px; }
  h1 { font-size: clamp(40px, 7vw, 84px); line-height:1.02; font-weight:700; letter-spacing:-0.02em; background: linear-gradient(135deg,#fff 0%,#ff6b35 60%,#e84393 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
  .headline { color: var(--muted); font-size: 18px; margin-top: 18px; max-width: 620px; }
  .links { display:flex; flex-wrap:wrap; gap:10px; margin-top:28px; }
  .links a { border:1px solid rgba(255,255,255,0.15); padding:8px 14px; border-radius:999px; text-decoration:none; font-size:13px; transition: all .2s; background: rgba(255,255,255,0.03); }
  .links a:hover { border-color: var(--ember); color: var(--ember); }
  section { margin-top: 72px; }
  h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.3em; color: var(--muted); margin-bottom: 24px; }
  .card { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); border-radius: 20px; padding: 24px; margin-bottom: 16px; transition: border-color .2s; }
  .card:hover { border-color: rgba(255,107,53,0.4); }
  .card h3 { font-size: 20px; font-weight: 600; }
  .card .meta { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .card p { margin-top: 10px; color: rgba(245,245,240,0.85); }
  ul.bullets { margin-top: 10px; padding-left: 18px; color: rgba(245,245,240,0.85); }
  ul.bullets li { margin-top: 4px; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .tag { font-size: 11px; padding: 4px 10px; border-radius: 999px; background: rgba(255,107,53,0.12); color: #ffb99a; border: 1px solid rgba(255,107,53,0.25); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  footer { margin-top: 96px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); color: var(--muted); font-size: 12px; text-align: center; }
</style>
</head>
<body>
<main class="wrap">
  <header class="hero">
    <div class="eyebrow">${esc(p.location || "Portfolio")}</div>
    <h1>${esc(p.fullName || "Your Name")}</h1>
    <p class="headline">${esc(p.headline || r.summary || "")}</p>
    ${links.length ? `<div class="links">${links.map(l => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</div>` : ""}
  </header>

  ${r.summary ? `<section><h2>About</h2><p style="max-width:680px;color:rgba(245,245,240,0.85);font-size:16px;">${esc(r.summary)}</p></section>` : ""}

  ${r.experience.length ? `<section><h2>Experience</h2>${r.experience.map(e => `
    <div class="card">
      <h3>${esc(e.role)} <span style="color:var(--muted);font-weight:400"> · ${esc(e.company)}</span></h3>
      <div class="meta">${esc([e.startDate, e.current ? "Present" : e.endDate].filter(Boolean).join(" — "))}${e.location ? " · " + esc(e.location) : ""}</div>
      ${e.bullets?.length ? `<ul class="bullets">${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    </div>`).join("")}</section>` : ""}

  ${r.projects.length ? `<section><h2>Projects</h2><div class="grid">${r.projects.map(pr => `
    <div class="card">
      <h3>${pr.link ? `<a href="${esc(pr.link)}" target="_blank" rel="noopener" style="text-decoration:none">${esc(pr.name)} ↗</a>` : esc(pr.name)}</h3>
      ${pr.description ? `<p>${esc(pr.description)}</p>` : ""}
      ${pr.bullets?.length ? `<ul class="bullets">${pr.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
      ${pr.tech?.length ? `<div class="tags">${pr.tech.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
    </div>`).join("")}</div></section>` : ""}

  ${r.education.length ? `<section><h2>Education</h2>${r.education.map(ed => `
    <div class="card">
      <h3>${esc(ed.institution)}</h3>
      <div class="meta">${esc([ed.degree, ed.field].filter(Boolean).join(", "))}${ed.startDate || ed.endDate ? " · " + esc([ed.startDate, ed.endDate].filter(Boolean).join(" — ")) : ""}${ed.gpa ? " · GPA " + esc(ed.gpa) : ""}</div>
    </div>`).join("")}</section>` : ""}

  ${(r.skills.technical.length + r.skills.tools.length + r.skills.soft.length + r.skills.languages.length) ? `<section><h2>Skills</h2>
    ${[
      ["Technical", r.skills.technical],
      ["Tools", r.skills.tools],
      ["Soft", r.skills.soft],
      ["Languages", r.skills.languages],
    ].filter(([, arr]) => (arr as string[]).length).map(([label, arr]) => `
      <div style="margin-bottom:14px">
        <div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:var(--muted);margin-bottom:8px">${label}</div>
        <div class="tags">${(arr as string[]).map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div>
      </div>`).join("")}
  </section>` : ""}

  ${r.certifications.length ? `<section><h2>Certifications</h2>${r.certifications.map(c => `
    <div class="card"><h3>${esc(c.name)}</h3><div class="meta">${esc([c.issuer, c.date].filter(Boolean).join(" · "))}</div></div>`).join("")}</section>` : ""}

  <footer>Built with Talk2YN · Powered by Aaruba AI</footer>
</main>
</body>
</html>`;
}

export function downloadPortfolioHTML(r: ResumeData) {
  const html = buildPortfolioHTML(r);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const base = (r.personalInfo.fullName || "portfolio").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio";
  a.href = url;
  a.download = `${base}-portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
