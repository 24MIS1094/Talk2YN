import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { AARUBA_AI_MODEL, createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { emptyResume, type ResumeData } from "@/lib/resume-schema";

const EXTRACT_PROMPT = `You are a resume information extractor. From the conversation between the AI interviewer (Aaruba) and the user, extract a structured resume that works for BOTH modern one-page CVs and classic Indian biodata-style resumes (Career Objective, 10th/12th/Graduation academic table, Personal Details with Father's Name / DOB / Nationality / Marital Status / Languages Known / Hobbies, and a Declaration).

Return STRICT JSON matching this TypeScript type (no markdown, no commentary):
{
  "personalInfo": { "fullName": string, "headline"?: string, "email"?: string, "phone"?: string, "location"?: string, "website"?: string, "linkedin"?: string, "github"?: string },
  "summary"?: string,
  "experience": [{ "id": string, "company": string, "role": string, "location"?: string, "startDate"?: string, "endDate"?: string, "current"?: boolean, "bullets": string[] }],
  "education": [{ "id": string, "institution": string, "degree"?: string, "field"?: string, "startDate"?: string, "endDate"?: string, "gpa"?: string, "details"?: string[] }],
  "projects": [{ "id": string, "name": string, "description"?: string, "link"?: string, "tech"?: string[], "bullets"?: string[] }],
  "skills": { "technical": string[], "tools": string[], "soft": string[], "languages": string[] },
  "certifications": [{ "id": string, "name": string, "issuer"?: string, "date"?: string }],
  "achievements": string[]
}

Rules:
- Only include facts explicitly stated by the user. Never invent companies, roles, metrics, dates, or skills.
- Rewrite descriptions into concise, action-verb resume bullets. Keep facts truthful.
- The user's stated target role becomes personalInfo.headline (e.g. "Web Developer", "Marketing Manager", "Computer Operator").
- The user's Career Objective becomes the FIRST paragraph of "summary".
- Biodata answers (Father's Name, Date of Birth, Nationality, Marital Status, Languages Known, Hobbies, Permanent Address) go INTO "summary" as extra lines below the objective, each on its own line, formatted like "Father's Name: Ramesh Kumar" / "Date of Birth: 12 June 2000" / "Languages Known: English, Hindi" / "Hobbies: Reading, Music". This lets classic Indian templates render them cleanly.
- Put 10th and 12th schooling as entries in "education" too (institution = school name, degree = "10th" or "12th", field = board like "CBSE").
- Spoken/human languages go in skills.languages. Programming languages go in skills.technical.
- Lines starting with "[UPLOADED FILE:" are facts Aaruba read from a document the user uploaded (certificate, marksheet, letter, project report). Treat them as user-stated facts: use exact certificate names, issuers, dates, grades, and project details from them.
- Use short id strings (like "e1", "e2", "p1"). Omit optional fields when unknown.
- If a section has no data, return an empty array (or empty object for personalInfo/skills).
- Output JSON only. No prose. No code fences.`;

export const Route = createFileRoute("/api/extract")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { transcript?: string };
          if (!body.transcript) return Response.json({ error: "Transcript is required" }, { status: 400 });
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return Response.json({ error: "AI service is unavailable" }, { status: 503 });
          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway(AARUBA_AI_MODEL),
            system: EXTRACT_PROMPT,
            prompt: body.transcript,
          });
          const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
          const parsed = JSON.parse(cleaned);
          const data: ResumeData = { ...emptyResume, ...parsed, skills: { ...emptyResume.skills, ...(parsed.skills ?? {}) } };
          return Response.json(data);
        } catch (error) {
          console.error("extract request failed", error);
          return Response.json({ error: "Resume preview could not be updated" }, { status: 500 });
        }
      },
    },
  },
});
