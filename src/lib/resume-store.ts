import { emptyResume, type ResumeData } from "./resume-schema";

export type StoredResume = {
  id: string;
  name: string;
  targetRole?: string;
  templateId: string;
  data: ResumeData;
  messages: Array<{ id: string; role: "user" | "assistant"; content: string }>;
  analysis?: unknown;
  analyzedAt?: number;
  createdAt: number;
  updatedAt: number;
};

const KEY = "aurea.resumes.v1";
const ACTIVE_KEY = "aurea.active.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadAll(): StoredResume[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredResume).map(normalizeStoredResume);
  } catch {
    return [];
  }
}

function isStoredResume(value: unknown): value is StoredResume {
  if (!value || typeof value !== "object") return false;
  const resume = value as Partial<StoredResume>;
  return (
    typeof resume.id === "string" &&
    typeof resume.name === "string" &&
    typeof resume.templateId === "string" &&
    !!resume.data &&
    typeof resume.data === "object" &&
    Array.isArray(resume.messages)
  );
}

function normalizeStoredResume(resume: StoredResume): StoredResume {
  const data = resume.data as Partial<ResumeData>;
  return {
    ...resume,
    data: {
      ...structuredClone(emptyResume),
      ...data,
      personalInfo: {
        ...emptyResume.personalInfo,
        ...(data.personalInfo ?? {}),
      },
      experience: Array.isArray(data.experience) ? data.experience : [],
      education: Array.isArray(data.education) ? data.education : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      skills: {
        ...emptyResume.skills,
        ...(data.skills ?? {}),
        technical: Array.isArray(data.skills?.technical) ? data.skills.technical : [],
        tools: Array.isArray(data.skills?.tools) ? data.skills.tools : [],
        soft: Array.isArray(data.skills?.soft) ? data.skills.soft : [],
        languages: Array.isArray(data.skills?.languages) ? data.skills.languages : [],
      },
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
    },
    messages: resume.messages.filter(
      (message) =>
        !!message &&
        typeof message.id === "string" &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    ),
  };
}

export function saveAll(list: StoredResume[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Unable to save resumes", error);
  }
}

export function getResume(id: string): StoredResume | null {
  return loadAll().find((r) => r.id === id) ?? null;
}

export function upsertResume(r: StoredResume) {
  const all = loadAll();
  const idx = all.findIndex((x) => x.id === r.id);
  r.updatedAt = Date.now();
  if (idx === -1) all.unshift(r);
  else all[idx] = r;
  saveAll(all);
}

export function deleteResume(id: string) {
  saveAll(loadAll().filter((r) => r.id !== id));
}

export function createResume(name = "Untitled Resume"): StoredResume {
  const id = crypto.randomUUID();
  const r: StoredResume = {
    id,
    name,
    templateId: "modern",
    data: structuredClone(emptyResume),
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  upsertResume(r);
  setActiveId(id);
  return r;
}

export function setActiveId(id: string) {
  if (!isBrowser()) return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACTIVE_KEY);
}
