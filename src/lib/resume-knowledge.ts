// Aaruba's resume knowledge library — patterns learned from 20+ real Indian /
// fresher / biodata / modern CV samples the user shared. Used by the chat
// system prompt and the extractor so Aaruba speaks the same language as the
// resumes users actually recognise.

export const RESUME_KNOWLEDGE = {
  // Classic Indian / fresher biodata layout (Rashmi Sirohi, Rakesh Kumar,
  // Chanchal Sharma, Sonali Karmakar, Yamini Gupta, Aditya Kallapalli,
  // Ankita Kumari samples).
  biodataFields: [
    "Father's Name",
    "Husband's Name (for married women, optional)",
    "Date of Birth",
    "Gender",
    "Nationality",
    "Marital Status",
    "Languages Known",
    "Hobbies",
    "Permanent Address",
    "Religion (optional, rarely used)",
  ],

  // Section headers that appear again and again in the samples.
  classicSections: [
    "CAREER OBJECTIVE",
    "ACADEMIC QUALIFICATION",
    "PROFESSIONAL QUALIFICATION",
    "OTHER QUALIFICATION",
    "WORK EXPERIENCE",
    "TECHNICAL SKILLS",
    "PERSONAL SKILLS / STRENGTHS",
    "PERSONAL DETAILS / PERSONAL INFORMATION",
    "HOBBIES",
    "LANGUAGES KNOWN",
    "DECLARATION",
  ],

  // The declaration block almost every classic Indian resume ends with.
  declarationTemplate:
    "I hereby declare that the above information is true to the best of my knowledge and belief.",

  // Academic table pattern (10th CBSE / 12th CBSE / B.Com / B.Tech, with
  // Board or University, Year of Passing, Percentage / CGPA).
  academicTable: {
    columns: ["Qualification", "Board / University", "Year", "Percentage / CGPA"],
    commonRows: [
      "10th (CBSE / State Board)",
      "12th (CBSE / State Board)",
      "Graduation (B.Com / B.Tech / BA / BCA / BSc)",
      "Post Graduation (MBA / MCA / MSc, if any)",
    ],
  },

  // Modern one-page CV layout patterns (Anaisha Parvati, Galena Micheal,
  // Sahib Khan, Anne Winston samples). Used for template picking.
  modernPatterns: [
    "Two-column: left sidebar for contact + skills + languages, right column for summary + experience + education",
    "Photo top-left with name + role beside it",
    "Timeline dates on the left, roles + bullets on the right",
    "Skills shown as bars, dots, or percentages",
    "Icons before section titles (phone, mail, briefcase, cap)",
  ],

  // Career objective openers common in fresher resumes — used by the
  // extractor to spot and clean them up rather than invent one.
  objectiveOpeners: [
    "To work in a professional environment where I can utilise my knowledge and skills",
    "To build a career in a growing organisation where I can prove my abilities",
    "Seeking a challenging career in a growing organisation",
    "To make a contribution to the organisation with the best of my ability",
  ],
};

export type ResumeKnowledge = typeof RESUME_KNOWLEDGE;
