import Landing from "@/components/landing/Landing";
import { createFileRoute } from "@tanstack/react-router";

const title = "Talk2YN — Build Your Resume by Talking to Aaruba";
const description =
  "Talk to Aaruba in plain English. She builds your resume live, scores it for ATS, and tells you exactly what to improve. Free, with 12 resume formats to explore.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});
