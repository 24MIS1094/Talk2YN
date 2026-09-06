import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { AARUBA_AI_MODEL, createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import type { ResumeData } from "@/lib/resume-schema";

const PROMPT = `You are a career mentor for Indian students and freshers. Given the resume JSON, suggest realistic next steps.
Return STRICT JSON (no markdown, no fences):
{
  "targetRoles": [ { "title": string, "why": string, "fit": number } ],       // 3-4 roles, fit 0-100
  "skillsToLearn": [ { "skill": string, "reason": string, "priority": "high"|"medium"|"low" } ], // 4-6
  "projectIdeas": [ { "name": string, "summary": string, "tech": string[] } ],  // 3
  "certifications": [ { "name": string, "provider": string, "why": string } ],  // 2-3
  "salaryRange": { "entry": string, "mid": string, "note": string },            // INR ranges, e.g. "₹4-7 LPA"
  "shortTerm": string[],   // 3 things to do in next 30 days
  "longTerm": string[]     // 3 things to aim for in next 1-2 years
}
Rules: be specific to the resume. Use plain English. Never invent facts about the user. Keep every string under 160 chars. JSON only.`;

export const Route = createFileRoute("/api/career")({
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
            system: PROMPT,
            prompt: JSON.stringify(body.data),
          });
          const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
          let parsed: unknown = {};
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            const m = cleaned.match(/\{[\s\S]*\}/);
            if (m) parsed = JSON.parse(m[0]);
          }
          return Response.json(parsed);
        } catch (error) {
          console.error("career failed", error);
          return Response.json({ error: "Career guidance unavailable" }, { status: 500 });
        }
      },
    },
  },
});
