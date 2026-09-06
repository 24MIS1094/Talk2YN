// Deterministic ATS scoring engine — no AI, same input = same output.
// Modeled after Jobscan / Resume Worded / typical corporate ATS parsers.

import type { ResumeData } from "./resume-schema";
import { STRONG_ACTION_VERBS, WEAK_OPENERS, VAGUE_PHRASES } from "./ats-verbs";
import { parseJD, type ParsedJD } from "./jd-parser";

export type Check = {
  pass: boolean;
  message: string;
  fix?: string;
};

export type CategoryReport = {
  key: string;
  label: string;
  score: number; // 0..max
  max: number; // original weight
  effectiveMax: number; // weight actually applied after redistribution
  checks: Check[];
};

export type KeywordCoverage = {
  present: string[];
  missing: string[];
  totalRequired: number;
  matchRate: number; // 0..1
};

export type AtsReport = {
  overall: number; // 0..100
  band: "excellent" | "strong" | "fair" | "needs-work";
  jd: ParsedJD | null;
  categories: CategoryReport[];
  hardKeywords: KeywordCoverage;
  softKeywords: KeywordCoverage;
  weakBullets: Array<{ where: string; text: string; reason: string }>;
  tips: string[]; // top prioritized fixes
};

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

function allBullets(data: ResumeData): Array<{ where: string; text: string }> {
  const out: Array<{ where: string; text: string }> = [];
  for (const exp of data.experience) {
    for (const b of exp.bullets ?? []) {
      if (b && b.trim()) out.push({ where: `${exp.role} @ ${exp.company}`, text: b.trim() });
    }
  }
  for (const p of data.projects) {
    for (const b of p.bullets ?? []) {
      if (b && b.trim()) out.push({ where: `Project · ${p.name}`, text: b.trim() });
    }
  }
  return out;
}

function totalWordCount(data: ResumeData): number {
  const chunks: string[] = [];
  chunks.push(data.summary ?? "");
  for (const exp of data.experience) {
    chunks.push(exp.role ?? "", exp.company ?? "");
    chunks.push(...(exp.bullets ?? []));
  }
  for (const p of data.projects) {
    chunks.push(p.name ?? "", p.description ?? "");
    chunks.push(...(p.bullets ?? []));
  }
  for (const e of data.education) {
    chunks.push(e.institution ?? "", e.degree ?? "", e.field ?? "");
  }
  chunks.push(...data.skills.technical, ...data.skills.tools, ...data.skills.soft);
  chunks.push(...data.achievements);
  return chunks.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function estimateYearsExperience(data: ResumeData): number {
  let months = 0;
  const now = new Date();
  for (const exp of data.experience) {
    const start = parseYearMonth(exp.startDate);
    const end = exp.current
      ? now
      : parseYearMonth(exp.endDate) ?? now;
    if (start && end && end >= start) {
      months += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    }
  }
  return Math.round((months / 12) * 10) / 10;
}

function parseYearMonth(input?: string): Date | null {
  if (!input) return null;
  const s = input.trim().toLowerCase();
  if (!s || s === "present" || s === "current") return new Date();
  // Common formats: "2023", "Jan 2023", "01/2023", "2023-01"
  const iso = s.match(/^(\d{4})[-/](\d{1,2})/);
  if (iso) return new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, 1);
  const monYear = s.match(/^([a-z]{3,9})\s+(\d{4})/);
  if (monYear) {
    const m = MONTHS[monYear[1].slice(0, 3)];
    if (m != null) return new Date(parseInt(monYear[2], 10), m, 1);
  }
  const monthSlash = s.match(/^(\d{1,2})[/-](\d{4})/);
  if (monthSlash) return new Date(parseInt(monthSlash[2], 10), parseInt(monthSlash[1], 10) - 1, 1);
  const yearOnly = s.match(/^(\d{4})$/);
  if (yearOnly) return new Date(parseInt(yearOnly[1], 10), 0, 1);
  return null;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function firstWord(s: string): string {
  const m = s.trim().toLowerCase().match(/[a-z']+/);
  return m ? m[0] : "";
}

function hasNumber(s: string): boolean {
  return /\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million)\b/i.test(s);
}

function containsSkill(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^a-z0-9+#])${escaped}(?=[^a-z0-9+#]|$)`, "i");
  return re.test(haystack);
}

// ────────────────────────────────────────────────────────────────
// Category checkers
// ────────────────────────────────────────────────────────────────

function scoreContact(data: ResumeData): CategoryReport {
  const p = data.personalInfo;
  const checks: Check[] = [];
  let score = 0;
  const items: Array<[boolean, string, string]> = [
    [!!p.fullName && p.fullName.trim().length >= 2, "Full name present", "Add your full name at the top."],
    [!!p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email), "Valid email address", "Add a professional email like name@domain.com."],
    [!!p.phone && p.phone.replace(/\D/g, "").length >= 7, "Phone number present", "Add a reachable phone number."],
    [!!p.location, "Location present", "Add your city / country so recruiters can filter by location."],
    [!!(p.linkedin || p.website || p.github), "LinkedIn / portfolio link", "Add a LinkedIn URL or portfolio link."],
  ];
  const perCheck = 10 / items.length;
  for (const [pass, msg, fix] of items) {
    checks.push({ pass, message: msg, fix: pass ? undefined : fix });
    if (pass) score += perCheck;
  }
  return cat("contact", "Contact info", score, 10, checks);
}

function scoreSections(data: ResumeData): CategoryReport {
  const checks: Check[] = [];
  const skillCount = data.skills.technical.length + data.skills.tools.length + data.skills.soft.length;
  const items: Array<[boolean, string, string]> = [
    [!!(data.summary && data.summary.length >= 40), "Professional summary present", "Add a 2–3 line summary near the top."],
    [data.experience.length > 0, "Experience section present", "Add at least one role (internship counts)."],
    [data.education.length > 0, "Education section present", "Add your school and degree."],
    [skillCount >= 3, "Skills section present", "List at least 3 relevant skills."],
  ];
  let score = 0;
  const per = 10 / items.length;
  for (const [pass, msg, fix] of items) {
    checks.push({ pass, message: msg, fix: pass ? undefined : fix });
    if (pass) score += per;
  }
  return cat("sections", "Standard sections", score, 10, checks);
}

function scoreTitleMatch(data: ResumeData, jd: ParsedJD | null): CategoryReport {
  const checks: Check[] = [];
  if (!jd || !jd.title) {
    checks.push({ pass: false, message: "No job title in the JD to compare against.", fix: "Paste a job description above." });
    return cat("titleMatch", "Job title match", 0, 10, checks);
  }
  const jdTokens = tokens(jd.title);
  const roles = [
    data.personalInfo.headline ?? "",
    ...data.experience.map((e) => e.role ?? ""),
  ]
    .filter(Boolean)
    .map(tokens);
  let best = 0;
  for (const rTokens of roles) {
    const overlap = rTokens.filter((t) => jdTokens.includes(t)).length;
    const denom = Math.max(jdTokens.length, 1);
    best = Math.max(best, overlap / denom);
  }
  const score = Math.round(best * 10 * 10) / 10;
  checks.push({
    pass: best >= 0.5,
    message: `Best title overlap: ${(best * 100).toFixed(0)}% with "${jd.title}"`,
    fix: best >= 0.5 ? undefined : "Add a headline that mirrors the JD title (e.g., \"" + jd.title + "\").",
  });
  return cat("titleMatch", "Job title match", score, 10, checks);
}

function scoreKeywords(
  data: ResumeData,
  jd: ParsedJD | null,
  kind: "hard" | "soft",
): { report: CategoryReport; coverage: KeywordCoverage } {
  const max = kind === "hard" ? 20 : 5;
  const label = kind === "hard" ? "Hard-skill keyword match" : "Soft-skill keyword match";
  const key = kind === "hard" ? "hardKeywords" : "softKeywords";
  if (!jd) {
    const zero: KeywordCoverage = { present: [], missing: [], totalRequired: 0, matchRate: 0 };
    return {
      report: cat(key, label, 0, max, [{ pass: false, message: "No JD provided.", fix: "Paste a JD to see keyword coverage." }]),
      coverage: zero,
    };
  }
  const list = kind === "hard" ? jd.hardSkills : jd.softSkills;
  if (list.length === 0) {
    const zero: KeywordCoverage = { present: [], missing: [], totalRequired: 0, matchRate: 0 };
    return {
      report: cat(key, label, max, max, [{ pass: true, message: `No ${kind} skills detected in JD.` }]),
      coverage: zero,
    };
  }
  // Build a big searchable text blob from the resume
  const haystackParts: string[] = [];
  haystackParts.push(data.summary ?? "");
  haystackParts.push(...data.skills.technical, ...data.skills.tools, ...data.skills.soft, ...data.skills.languages);
  for (const e of data.experience) {
    haystackParts.push(e.role ?? "", e.company ?? "");
    haystackParts.push(...(e.bullets ?? []));
  }
  for (const p of data.projects) {
    haystackParts.push(p.name ?? "", p.description ?? "");
    haystackParts.push(...(p.tech ?? []), ...(p.bullets ?? []));
  }
  for (const c of data.certifications) {
    haystackParts.push(c.name ?? "");
  }
  const haystack = haystackParts.join(" \n ").toLowerCase();

  const present: string[] = [];
  const missing: string[] = [];
  for (const skill of list) {
    if (containsSkill(haystack, skill.toLowerCase())) present.push(skill);
    else missing.push(skill);
  }
  const matchRate = present.length / list.length;
  const score = Math.round(matchRate * max * 10) / 10;
  const checks: Check[] = [
    {
      pass: matchRate >= 0.6,
      message: `Matched ${present.length}/${list.length} ${kind} skills from the JD (${Math.round(matchRate * 100)}%).`,
      fix:
        missing.length > 0
          ? `Weave the missing keywords into bullets naturally: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? "…" : ""}`
          : undefined,
    },
  ];
  return {
    report: cat(key, label, score, max, checks),
    coverage: { present, missing, totalRequired: list.length, matchRate },
  };
}

function scoreActionVerbs(data: ResumeData): { report: CategoryReport; weak: Array<{ where: string; text: string; reason: string }> } {
  const bullets = allBullets(data);
  const weak: Array<{ where: string; text: string; reason: string }> = [];
  if (bullets.length === 0) {
    return {
      report: cat("actionVerbs", "Strong action verbs", 0, 8, [
        { pass: false, message: "No bullet points yet.", fix: "Add bullets under each role using strong verbs." },
      ]),
      weak,
    };
  }
  let strong = 0;
  for (const b of bullets) {
    const first = firstWord(b.text);
    if (STRONG_ACTION_VERBS.has(first)) {
      strong++;
    } else if (WEAK_OPENERS.has(first)) {
      weak.push({ where: b.where, text: b.text, reason: `Opens with weak word "${first}".` });
    } else {
      weak.push({ where: b.where, text: b.text, reason: `Doesn't open with a recognized strong verb.` });
    }
  }
  const rate = strong / bullets.length;
  const score = Math.round(rate * 8 * 10) / 10;
  return {
    report: cat("actionVerbs", "Strong action verbs", score, 8, [
      {
        pass: rate >= 0.7,
        message: `${strong}/${bullets.length} bullets start with a strong verb (${Math.round(rate * 100)}%).`,
        fix: rate >= 0.7 ? undefined : "Start each bullet with verbs like Built, Led, Reduced, Launched, Automated.",
      },
    ]),
    weak,
  };
}

function scoreQuantified(data: ResumeData): CategoryReport {
  const bullets = allBullets(data);
  if (bullets.length === 0) {
    return cat("quantified", "Quantified impact", 0, 8, [
      { pass: false, message: "No bullets to check.", fix: "Add bullets with numbers, %, $, or time saved." },
    ]);
  }
  let quantified = 0;
  for (const b of bullets) if (hasNumber(b.text)) quantified++;
  const rate = quantified / bullets.length;
  const score = Math.round(rate * 8 * 10) / 10;
  return cat("quantified", "Quantified impact", score, 8, [
    {
      pass: rate >= 0.5,
      message: `${quantified}/${bullets.length} bullets include numbers (${Math.round(rate * 100)}%).`,
      fix: rate >= 0.5 ? undefined : "Add metrics: “reduced load time by 40%”, “led team of 6”, “saved 12 hrs/week”.",
    },
  ]);
}

function scoreBulletLength(data: ResumeData): CategoryReport {
  const bullets = allBullets(data);
  if (bullets.length === 0) {
    return cat("bulletLength", "Bullet length", 0, 5, [
      { pass: false, message: "No bullets to check.", fix: "Aim for 12–24 words per bullet." },
    ]);
  }
  let good = 0;
  let tooShort = 0;
  let tooLong = 0;
  for (const b of bullets) {
    const w = b.text.split(/\s+/).filter(Boolean).length;
    if (w >= 8 && w <= 32) good++;
    else if (w < 8) tooShort++;
    else tooLong++;
  }
  const rate = good / bullets.length;
  const score = Math.round(rate * 5 * 10) / 10;
  return cat("bulletLength", "Bullet length", score, 5, [
    {
      pass: rate >= 0.7,
      message: `${good}/${bullets.length} bullets are in the sweet spot (8–32 words).`,
      fix:
        tooShort > tooLong
          ? "Expand short bullets with context and results."
          : tooLong > 0
          ? "Trim long bullets — one clear win per bullet."
          : undefined,
    },
  ]);
}

function scoreDates(data: ResumeData): CategoryReport {
  const checks: Check[] = [];
  if (data.experience.length === 0) {
    checks.push({ pass: false, message: "No experience entries to check dates on." });
    return cat("dates", "Date formatting", 0, 5, checks);
  }
  let ok = 0;
  for (const e of data.experience) {
    const startOk = !!parseYearMonth(e.startDate);
    const endOk = e.current || !!parseYearMonth(e.endDate);
    if (startOk && endOk) ok++;
  }
  const rate = ok / data.experience.length;
  const score = Math.round(rate * 5 * 10) / 10;
  checks.push({
    pass: rate === 1,
    message: `${ok}/${data.experience.length} roles have parseable start & end dates.`,
    fix: rate < 1 ? "Use a consistent format like “Jan 2023 – Present”." : undefined,
  });
  return cat("dates", "Date formatting", score, 5, checks);
}

function scoreFormatFriendliness(data: ResumeData): CategoryReport {
  const blob = JSON.stringify(data);
  const checks: Check[] = [];
  let score = 5;
  // Emoji check
  const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  const hasEmoji = emojiRe.test(blob);
  checks.push({
    pass: !hasEmoji,
    message: hasEmoji ? "Emojis found — ATS parsers often strip or mangle these." : "No emojis detected.",
    fix: hasEmoji ? "Remove emojis from bullets and headings." : undefined,
  });
  if (hasEmoji) score -= 2;
  // Fancy bullet characters
  const fancyBullets = /[•●◦▪■◆★]/.test(blob);
  checks.push({
    pass: !fancyBullets,
    message: fancyBullets ? "Non-standard bullet symbols found." : "Bullet formatting is ATS-safe.",
    fix: fancyBullets ? "Let the template render bullets — don't paste ● or ■ into text." : undefined,
  });
  if (fancyBullets) score -= 1;
  // ALL CAPS wall in bullets
  const bullets = allBullets(data);
  const allCaps = bullets.filter((b) => b.text.length > 20 && b.text === b.text.toUpperCase()).length;
  checks.push({
    pass: allCaps === 0,
    message: allCaps === 0 ? "No ALL-CAPS bullets." : `${allCaps} bullet(s) written in ALL CAPS.`,
    fix: allCaps > 0 ? "Use sentence case in bullets — ATS treats ALL CAPS as shouting/noise." : undefined,
  });
  if (allCaps > 0) score -= 1;
  // URLs sanity — LinkedIn/GitHub look like real links
  const p = data.personalInfo;
  const badUrl =
    (p.linkedin && !/linkedin\.com/i.test(p.linkedin)) ||
    (p.github && !/github\.com/i.test(p.github));
  checks.push({
    pass: !badUrl,
    message: badUrl ? "LinkedIn or GitHub field doesn't look like a URL." : "Links look well-formed.",
    fix: badUrl ? "Use full URLs like https://linkedin.com/in/yourname." : undefined,
  });
  if (badUrl) score -= 1;
  return cat("format", "ATS format friendliness", Math.max(0, score), 5, checks);
}

function scoreGrammar(data: ResumeData): CategoryReport {
  const bullets = allBullets(data);
  const text = [data.summary ?? "", ...bullets.map((b) => b.text)].join("\n");
  const checks: Check[] = [];
  let score = 4;

  // Doubled words: "the the"
  const doubled = text.match(/\b(\w+)\s+\1\b/gi);
  checks.push({
    pass: !doubled,
    message: doubled ? `Repeated words: ${doubled.slice(0, 3).join(", ")}` : "No repeated words.",
    fix: doubled ? "Remove the duplicate word." : undefined,
  });
  if (doubled) score -= 1;

  // Lowercase "i"
  const loneI = /\bi\b/.test(text);
  checks.push({
    pass: !loneI,
    message: loneI ? "Lowercase 'i' used as a pronoun." : "First-person 'I' avoided (resumes usually drop it).",
    fix: loneI ? "Resumes typically omit “I” — use verbs directly (e.g., “Built …” not “I built …”)." : undefined,
  });
  if (loneI) score -= 1;

  // Vague filler
  const vague = VAGUE_PHRASES.filter((v) => new RegExp(`\\b${v}\\b`, "i").test(text));
  checks.push({
    pass: vague.length === 0,
    message: vague.length ? `Vague phrases: ${vague.slice(0, 3).join(", ")}` : "No vague filler phrases.",
    fix: vague.length ? "Replace with concrete, measurable wording." : undefined,
  });
  if (vague.length) score -= 1;

  // Trailing spaces / double spaces
  const dblSpace = /  +/.test(text);
  checks.push({
    pass: !dblSpace,
    message: dblSpace ? "Multiple spaces detected." : "Spacing looks clean.",
    fix: dblSpace ? "Collapse multiple spaces to one." : undefined,
  });
  if (dblSpace) score -= 1;

  return cat("grammar", "Grammar & style", Math.max(0, score), 4, checks);
}

function scoreLength(data: ResumeData): CategoryReport {
  const words = totalWordCount(data);
  const years = estimateYearsExperience(data);
  const [lo, hi] = years >= 5 ? [500, 1200] : [350, 900];
  const inRange = words >= lo && words <= hi;
  const score = inRange ? 5 : words < lo ? Math.max(0, (words / lo) * 5) : Math.max(0, 5 - ((words - hi) / hi) * 5);
  return cat("length", "Length appropriateness", Math.round(score * 10) / 10, 5, [
    {
      pass: inRange,
      message: `Total content ≈ ${words} words (target ${lo}–${hi} for ~${years || 0} yrs experience).`,
      fix: inRange
        ? undefined
        : words < lo
        ? "Add more detail — bullets on impact, projects, or a longer summary."
        : "Trim less-relevant bullets and older roles to keep it scannable.",
    },
  ]);
}

function scoreTense(data: ResumeData): CategoryReport {
  const checks: Check[] = [];
  if (data.experience.length === 0) {
    checks.push({ pass: false, message: "No experience to check tense on." });
    return cat("tense", "Tense consistency", 0, 5, checks);
  }
  let ok = 0;
  const total = data.experience.length;
  for (const e of data.experience) {
    const bullets = e.bullets ?? [];
    if (bullets.length === 0) { ok++; continue; }
    const firstWords = bullets.map((b) => firstWord(b));
    const anyPast = firstWords.some((w) => /ed$/.test(w) || /^(led|built|drove|won|ran|made|sold|took|got)$/.test(w));
    const anyPresent = firstWords.some((w) => /s$/.test(w) && !w.endsWith("ss"));
    if (e.current) {
      // present tense preferred, but past acceptable
      if (!anyPast || anyPresent) ok++;
    } else {
      if (anyPast || !anyPresent) ok++;
    }
  }
  const rate = ok / total;
  const score = Math.round(rate * 5 * 10) / 10;
  checks.push({
    pass: rate >= 0.8,
    message: `${ok}/${total} roles are tense-consistent.`,
    fix: rate < 0.8 ? "Use past tense for previous roles, present tense (or past) for the current one — pick one and stay consistent." : undefined,
  });
  return cat("tense", "Tense consistency", score, 5, checks);
}

// ────────────────────────────────────────────────────────────────
// Orchestrator
// ────────────────────────────────────────────────────────────────

function cat(key: string, label: string, score: number, max: number, checks: Check[]): CategoryReport {
  return { key, label, score, max, effectiveMax: max, checks };
}

export function scoreResume(data: ResumeData, jdText?: string): AtsReport {
  const jd = jdText && jdText.trim().length > 20 ? parseJD(jdText) : null;

  const contact = scoreContact(data);
  const sections = scoreSections(data);
  const titleMatch = scoreTitleMatch(data, jd);
  const hard = scoreKeywords(data, jd, "hard");
  const soft = scoreKeywords(data, jd, "soft");
  const av = scoreActionVerbs(data);
  const quantified = scoreQuantified(data);
  const bulletLength = scoreBulletLength(data);
  const dates = scoreDates(data);
  const format = scoreFormatFriendliness(data);
  const grammar = scoreGrammar(data);
  const length = scoreLength(data);
  const tense = scoreTense(data);

  const categories: CategoryReport[] = [
    contact, sections, titleMatch, hard.report, soft.report,
    av.report, quantified, bulletLength, dates, format, grammar, length, tense,
  ];

  // Redistribute JD-dependent weights when no JD
  if (!jd) {
    const jdKeys = new Set(["titleMatch", "hardKeywords", "softKeywords"]);
    const jdWeightSum = categories
      .filter((c) => jdKeys.has(c.key))
      .reduce((s, c) => s + c.max, 0); // 35
    const otherWeightSum = categories
      .filter((c) => !jdKeys.has(c.key))
      .reduce((s, c) => s + c.max, 0);
    const scale = (otherWeightSum + jdWeightSum) / otherWeightSum;
    for (const c of categories) {
      if (jdKeys.has(c.key)) {
        c.effectiveMax = 0;
        c.score = 0;
      } else {
        c.effectiveMax = Math.round(c.max * scale * 10) / 10;
        c.score = Math.round((c.score / c.max) * c.effectiveMax * 10) / 10;
      }
    }
  }

  const overall = Math.round(categories.reduce((s, c) => s + c.score, 0));
  const band: AtsReport["band"] =
    overall >= 85 ? "excellent" : overall >= 70 ? "strong" : overall >= 50 ? "fair" : "needs-work";

  // Prioritized tips — pull the highest-impact failing check from each low-scoring category
  const tips: string[] = [];
  const ordered = [...categories].sort((a, b) => (a.score / (a.effectiveMax || 1)) - (b.score / (b.effectiveMax || 1)));
  for (const c of ordered) {
    if (c.effectiveMax === 0) continue;
    const bad = c.checks.find((k) => !k.pass && k.fix);
    if (bad?.fix) tips.push(`${c.label}: ${bad.fix}`);
    if (tips.length >= 6) break;
  }

  return {
    overall: Math.max(0, Math.min(100, overall)),
    band,
    jd,
    categories,
    hardKeywords: hard.coverage,
    softKeywords: soft.coverage,
    weakBullets: av.weak.slice(0, 12),
    tips,
  };
}

function tokens(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9+#]+/).filter((t) => t.length > 1);
}
