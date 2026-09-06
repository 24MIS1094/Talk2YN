import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { AARUBA_AI_MODEL, createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import type { ResumeData } from "@/lib/resume-schema";

const CATEGORY_KEYS = [
  "atsCompatibility",
  "completeness",
  "professionalWriting",
  "grammar",
  "skillsStrength",
  "projectsQuality",
  "experienceQuality",
  "educationQuality",
  "keywordMatching",
  "visualDesign",
] as const;

const ANALYZE_PROMPT = `You are a senior resume coach and ATS expert. Analyze the resume JSON deeply.

Return STRICT JSON (no markdown, no fences, no commentary) matching:
{
  "score": number,              // 0-100 overall resume quality (weighted average of categories)
  "atsScore": number,           // 0-100 (same as categories.atsCompatibility.score)
  "strengths": string[],        // 2-4 concrete strengths (<=140 chars each)
  "missing": string[],          // fields/sections still missing
  "improvements": [             // 4-8 concrete improvements
    { "area": string, "issue": string, "fix": string, "priority": "high" | "medium" | "low" }
  ],
  "nextSteps": string[],        // 3-5 quick next actions
  "categories": {
    "atsCompatibility":   CategoryDetail,
    "completeness":       CategoryDetail,
    "professionalWriting":CategoryDetail,
    "grammar":            CategoryDetail,
    "skillsStrength":     CategoryDetail,
    "projectsQuality":    CategoryDetail,
    "experienceQuality":  CategoryDetail,
    "educationQuality":   CategoryDetail,
    "keywordMatching":    CategoryDetail,
    "visualDesign":       CategoryDetail
  }
}

CategoryDetail = {
  "score": number,              // 0-100
  "label": string,              // short human name (e.g. "ATS Compatibility")
  "summary": string,            // one sentence current status (<=140 chars)
  "whyItMatters": string,       // <=200 chars
  "recruiterExpectation": string, // <=200 chars — what recruiters look for
  "atsCheck": string,           // <=200 chars — how ATS evaluates this
  "strengths": string[],        // 1-3 items, short
  "improvements": string[],     // 1-4 items, concrete and specific to this resume
  "weakExample": string,        // a weak sentence in the user's actual voice (<=180 chars). If none applies, use "".
  "betterExample": string,      // rewritten stronger version (<=200 chars). If none, use "".
  "estimatedLift": number,      // realistic score points gained if user follows the advice (1-15)
  "targetField": string         // ONE of: "summary" | "experience" | "projects" | "skills" | "education" | "certifications" | "personalInfo" | "achievements" | "layout"
}

Rules:
- Be specific. Reference actual sections/items in the resume.
- Score every category honestly. Grammar is 100 only if truly clean.
- GAP COACHING (mandatory): inspect the resume for missing credentials and recommend concrete actions.
  * If certifications are empty or weak, add a high-priority improvement naming 2-3 real, relevant certifications the person should earn for their field (e.g. "AWS Cloud Practitioner", "Google Data Analytics", "NPTEL Java").
  * If languages known are missing or only one, tell them to add the languages they speak, and suggest learning/certifying one more that helps their target roles.
  * Apply the same logic to other gaps: no projects -> suggest 2 specific project ideas; thin skills -> name the exact skills to learn; no achievements -> suggest what to record.
- Never suggest downloading or exporting the resume. This product is view-and-improve only.
- Keep every string tight. NO markdown, NO code fences, JSON only.
- Overall "score" must equal the rounded average of the 10 category scores.`;

type CategoryDetail = {
  score: number;
  label: string;
  summary: string;
  whyItMatters: string;
  recruiterExpectation: string;
  atsCheck: string;
  strengths: string[];
  improvements: string[];
  weakExample: string;
  betterExample: string;
  estimatedLift: number;
  targetField: string;
};

function fallbackCategory(label: string, score = 60): CategoryDetail {
  return {
    score,
    label,
    summary: "Analysis unavailable — try again.",
    whyItMatters: "",
    recruiterExpectation: "",
    atsCheck: "",
    strengths: [],
    improvements: [],
    weakExample: "",
    betterExample: "",
    estimatedLift: 5,
    targetField: "summary",
  };
}

const LABELS: Record<(typeof CATEGORY_KEYS)[number], string> = {
  atsCompatibility: "ATS Compatibility",
  completeness: "Resume Completeness",
  professionalWriting: "Professional Writing",
  grammar: "Grammar & Spelling",
  skillsStrength: "Skills Strength",
  projectsQuality: "Projects Quality",
  experienceQuality: "Experience Quality",
  educationQuality: "Education Quality",
  keywordMatching: "Keyword Matching",
  visualDesign: "Visual Design",
};

function normalizeCategories(raw: unknown): Record<string, CategoryDetail> {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, Partial<CategoryDetail>>;
  const out: Record<string, CategoryDetail> = {};
  for (const key of CATEGORY_KEYS) {
    const c = src[key] ?? {};
    out[key] = {
      score: clamp(Number(c.score ?? 60), 0, 100),
      label: c.label || LABELS[key],
      summary: String(c.summary ?? ""),
      whyItMatters: String(c.whyItMatters ?? ""),
      recruiterExpectation: String(c.recruiterExpectation ?? ""),
      atsCheck: String(c.atsCheck ?? ""),
      strengths: Array.isArray(c.strengths) ? c.strengths.map(String).slice(0, 4) : [],
      improvements: Array.isArray(c.improvements) ? c.improvements.map(String).slice(0, 5) : [],
      weakExample: String(c.weakExample ?? ""),
      betterExample: String(c.betterExample ?? ""),
      estimatedLift: clamp(Number(c.estimatedLift ?? 5), 1, 15),
      targetField: String(c.targetField ?? "summary"),
    };
  }
  return out;
}

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { data?: ResumeData };
          if (!body.data) return Response.json({ error: "Resume data required" }, { status: 400 });
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return Response.json({ error: "AI service is unavailable" }, { status: 503 });
          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway(AARUBA_AI_MODEL),
            system: ANALYZE_PROMPT,
            prompt: JSON.stringify(body.data),
          });
          const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
          let parsed: Record<string, unknown> = {};
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            const match = cleaned.match(/\{[\s\S]*\}/);
            if (match) parsed = JSON.parse(match[0]);
          }
          const categories = normalizeCategories((parsed as { categories?: unknown }).categories);
          const avg =
            CATEGORY_KEYS.reduce((s, k) => s + categories[k].score, 0) / CATEGORY_KEYS.length;
          const overall = clamp(Number(parsed.score ?? avg), 0, 100);
          const ats = clamp(Number(parsed.atsScore ?? categories.atsCompatibility.score), 0, 100);
          return Response.json({
            score: overall,
            atsScore: ats,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            missing: Array.isArray(parsed.missing) ? parsed.missing : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
            nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
            categories,
          });
        } catch (error) {
          console.error("analyze failed", error);
          const categories: Record<string, CategoryDetail> = {};
          for (const key of CATEGORY_KEYS) categories[key] = fallbackCategory(LABELS[key]);
          return Response.json(
            { error: "Could not analyze resume. Try again.", categories },
            { status: 500 },
          );
        }
      },
    },
  },
});
