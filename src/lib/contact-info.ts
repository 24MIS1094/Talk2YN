// Edit these values to update the Contact Admin page everywhere.
export const ADMIN = {
  name: "Yeswanth Naidu",
  role: "Founder & Developer of Talk2YN",
  bio: "Hi! I'm the developer of Talk2YN. If you have any questions, suggestions, or face any issues while using the platform, feel free to contact me.",
  photo: "", // optional image URL; falls back to initials
  email: "loginany707@gmail.com",
  phone: "+91 00000 00000",
  portfolio: "https://talk2yn.lovable.app",
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
  instagram: "https://www.instagram.com/",
  x: "https://x.com/",
  location: "India",
} as const;

export const CONTACT_CATEGORIES = [
  "Technical Issue",
  "Resume Question",
  "Career Guidance",
  "Feature Request",
  "Bug Report",
  "Company Information",
  "Other",
] as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: "How does Aaruba generate resumes?",
    a: "Aaruba asks you simple questions one at a time, understands your answers (and any certificates or documents you upload), and turns them into a structured resume that updates live as you talk.",
  },
  {
    q: "How is the resume score calculated?",
    a: "The score is rule-based, not random. It checks contact details, section completeness, action verbs, measurable results, keyword coverage, formatting and length — each contributes points to the final score.",
  },
  {
    q: "How can I improve my ATS score?",
    a: "Use plain section headings, add numbers to your achievements, mirror keywords from the job description, list real tools and skills, and fill gaps such as missing certifications or languages that Aaruba flags.",
  },
  {
    q: "How do I explore companies?",
    a: "Open Company Explorer from the start page. Search or filter by region and type, then open a company to see the match score, hiring process, requirements, a learning roadmap and the official careers link.",
  },
  {
    q: "How do I report incorrect information?",
    a: "Use the form on this page with the category 'Company Information' and mention the company name and what looks wrong. Corrections are usually reviewed within a couple of days.",
  },
];

/** Hides links that are still placeholders (empty, dummy phone, or a bare root domain). */
export function isPlaceholderContact(value: string): boolean {
  if (!value) return true;
  const v = value.trim();
  if (/0{4,}/.test(v)) return true;
  return /^https?:\/\/(www\.)?(linkedin\.com|github\.com|instagram\.com|x\.com|twitter\.com)\/?$/i.test(v);
}
