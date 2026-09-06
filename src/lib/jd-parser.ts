// Heuristic Job Description parser. No AI call — instant and free.
// Extracts likely hard skills, soft skills, job title, and years-required.

const HARD_SKILL_DICTIONARY = [
  // languages
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "golang", "rust",
  "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "sql", "bash", "shell",
  "html", "css", "sass",
  // frameworks / libs
  "react", "react.js", "next.js", "nextjs", "vue", "vue.js", "angular", "svelte",
  "node.js", "nodejs", "express", "nestjs", "django", "flask", "fastapi", "spring",
  "spring boot", "rails", "laravel", "graphql", "rest", "restful", "grpc",
  "redux", "tailwind", "bootstrap", "jquery",
  // data / ml
  "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "spark",
  "hadoop", "airflow", "kafka", "snowflake", "databricks", "tableau", "power bi",
  "powerbi", "looker", "d3", "matplotlib", "seaborn",
  // cloud / devops
  "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "terraform",
  "ansible", "jenkins", "github actions", "gitlab ci", "circleci", "prometheus",
  "grafana", "datadog", "linux", "unix", "nginx", "apache",
  // databases
  "postgres", "postgresql", "mysql", "mongodb", "redis", "dynamodb", "cassandra",
  "elasticsearch", "sqlite", "oracle", "sql server", "supabase", "firebase",
  // mobile
  "android", "ios", "react native", "flutter", "xamarin",
  // testing
  "jest", "cypress", "playwright", "selenium", "junit", "pytest", "mocha", "vitest",
  // design / product
  "figma", "sketch", "adobe xd", "photoshop", "illustrator", "invision",
  // methodologies
  "agile", "scrum", "kanban", "waterfall", "tdd", "bdd", "ci/cd", "cicd", "devops",
  "microservices", "oop", "functional programming", "mvc", "solid",
  // business / analytics
  "excel", "vlookup", "pivot tables", "google analytics", "salesforce", "hubspot",
  "sap", "erp", "crm", "seo", "sem", "a/b testing", "market research",
  // security
  "oauth", "jwt", "saml", "penetration testing", "owasp", "cybersecurity",
];

const SOFT_SKILL_DICTIONARY = [
  "communication", "leadership", "teamwork", "collaboration", "problem solving",
  "problem-solving", "critical thinking", "adaptability", "creativity",
  "time management", "decision making", "decision-making", "ownership",
  "accountability", "mentoring", "empathy", "conflict resolution",
  "presentation", "public speaking", "negotiation", "stakeholder management",
];

export type ParsedJD = {
  raw: string;
  title: string | null;
  yearsRequired: number | null;
  hardSkills: string[];
  softSkills: string[];
};

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function containsPhrase(haystack: string, needle: string) {
  // Word-boundary-ish match that also handles multi-word phrases and symbols.
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|[^a-z0-9+#])${escaped}(?=[^a-z0-9+#]|$)`, "i");
  return pattern.test(haystack);
}

export function parseJD(input: string): ParsedJD {
  const raw = input ?? "";
  const norm = normalize(raw);

  // Title heuristic: first line under 80 chars, or "role: X" pattern.
  let title: string | null = null;
  const roleMatch = raw.match(/(?:job title|role|position)\s*[:\-]\s*(.+)/i);
  if (roleMatch) {
    title = roleMatch[1].split(/\r?\n/)[0].trim().slice(0, 80);
  } else {
    const firstLine = raw.split(/\r?\n/).map((l) => l.trim()).find(Boolean);
    if (firstLine && firstLine.length <= 80) title = firstLine;
  }

  // Years required: "3+ years", "minimum 5 years"
  let yearsRequired: number | null = null;
  const yearsMatch = norm.match(/(\d+)\+?\s*(?:to\s*\d+\s*)?years?/);
  if (yearsMatch) yearsRequired = parseInt(yearsMatch[1], 10);

  const hardSkills: string[] = [];
  for (const skill of HARD_SKILL_DICTIONARY) {
    if (containsPhrase(norm, skill.toLowerCase())) hardSkills.push(skill);
  }
  const softSkills: string[] = [];
  for (const skill of SOFT_SKILL_DICTIONARY) {
    if (containsPhrase(norm, skill.toLowerCase())) softSkills.push(skill);
  }

  return {
    raw,
    title,
    yearsRequired,
    hardSkills: dedupe(hardSkills),
    softSkills: dedupe(softSkills),
  };
}

function dedupe(arr: string[]) {
  return Array.from(new Set(arr.map((s) => s.toLowerCase()))).map((s) => s);
}
