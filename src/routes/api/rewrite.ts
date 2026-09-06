import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { AARUBA_AI_MODEL, createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/rewrite")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            text?: string;
            action?: string;
            context?: string;
          };
          if (!body.text) return Response.json({ error: "Text is required" }, { status: 400 });
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return Response.json({ error: "AI service is unavailable" }, { status: 503 });

          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway(AARUBA_AI_MODEL),
            system: `You rewrite resume content. Never invent facts, metrics, tools, companies, or achievements. Use strong action verbs. Return only the rewritten text (no quotes, no preamble).`,
            prompt: `Action: ${body.action ?? "improve"}\nContext: ${body.context ?? "resume bullet"}\n\nOriginal:\n${body.text}\n\nRewritten:`,
          });
          return Response.json({ text: text.trim() });
        } catch (error) {
          console.error("rewrite request failed", error);
          return Response.json({ error: "Resume text could not be rewritten" }, { status: 500 });
        }
      },
    },
  },
});
