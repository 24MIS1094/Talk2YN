import { createFileRoute } from "@tanstack/react-router";

const READ_PROMPT = `You are Aaruba, reading a document a user uploaded for their resume (a certificate, marksheet, internship letter, project report, or screenshot).

Extract ONLY facts visible in the document. Never invent anything.

Reply as plain text in this shape (skip lines with no data, no markdown, no fences):
Document type: <certificate | marksheet | experience letter | project doc | other>
Title/Name: <exact name printed>
Issued by: <organisation>
Date: <date or year>
Holder name: <person's name if visible>
Score/Grade: <if visible>
Skills/Tools: <comma separated, only if stated>
Details: <1-3 short factual lines useful for a resume>

If the document is unreadable, reply exactly: UNREADABLE`;

type Body = { fileName?: string; mediaType?: string; dataUrl?: string };

export const Route = createFileRoute("/api/read-doc")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Body;
          const { dataUrl, mediaType, fileName } = body;
          if (!dataUrl || !mediaType) {
            return Response.json({ error: "File is required" }, { status: 400 });
          }
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return Response.json({ error: "AI service is unavailable" }, { status: 503 });

          const isImage = mediaType.startsWith("image/");
          const content = isImage
            ? [
                { type: "text", text: `Read this uploaded file: ${fileName ?? "document"}` },
                { type: "image_url", image_url: { url: dataUrl } },
              ]
            : [
                { type: "text", text: `Read this uploaded file: ${fileName ?? "document"}` },
                {
                  type: "file",
                  file: { filename: fileName ?? "document.pdf", file_data: dataUrl },
                },
              ];

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: READ_PROMPT },
                { role: "user", content },
              ],
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error(`read-doc gateway failed [${res.status}]: ${errText}`);
            return Response.json(
              { error: "Aaruba couldn't read that file. Try a clearer image or PDF." },
              { status: 502 },
            );
          }

          const json = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const text = json.choices?.[0]?.message?.content?.trim() ?? "";
          if (!text || text.toUpperCase().includes("UNREADABLE")) {
            return Response.json(
              { error: "That file was hard to read. Try a clearer photo or PDF." },
              { status: 422 },
            );
          }
          return Response.json({ summary: text });
        } catch (error) {
          console.error("read-doc failed", error);
          return Response.json({ error: "Could not read that file." }, { status: 500 });
        }
      },
    },
  },
});
