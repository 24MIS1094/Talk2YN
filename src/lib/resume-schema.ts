export type ResumeData = {
  personalInfo: {
    fullName: string;
    headline?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    details?: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description?: string;
    link?: string;
    tech?: string[];
    bullets?: string[];
  }>;
  skills: {
    technical: string[];
    tools: string[];
    soft: string[];
    languages: string[];
  };
  certifications: Array<{
    id: string;
    name: string;
    issuer?: string;
    date?: string;
  }>;
  achievements: string[];
};

export const emptyResume: ResumeData = {
  personalInfo: { fullName: "" },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: { technical: [], tools: [], soft: [], languages: [] },
  certifications: [],
  achievements: [],
};

export function estimateCompleteness(r: ResumeData): number {
  let score = 0;
  const p = r.personalInfo;
  if (p.fullName) score += 8;
  if (p.email) score += 6;
  if (p.phone) score += 4;
  if (p.location) score += 4;
  if (p.linkedin || p.website || p.github) score += 4;
  if (r.summary && r.summary.length > 40) score += 12;
  if (r.experience.length) score += Math.min(20, r.experience.length * 8);
  if (r.education.length) score += Math.min(12, r.education.length * 6);
  if (r.projects.length) score += Math.min(12, r.projects.length * 4);
  const totalSkills =
    r.skills.technical.length +
    r.skills.tools.length +
    r.skills.soft.length;
  if (totalSkills) score += Math.min(12, totalSkills);
  if (r.certifications.length) score += Math.min(6, r.certifications.length * 2);
  return Math.min(100, score);
}
