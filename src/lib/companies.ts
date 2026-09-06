import type { ResumeData } from "@/lib/resume-schema";

export type CompanyCategory = "Product" | "Indian Product" | "Service" | "Startup";

export type CompanyRatings = {
  overall: number;
  workLife: number;
  growth: number;
  salary: number;
  security: number;
  culture: number;
};

export type Company = {
  id: string;
  name: string;
  domain: string;
  region: "India" | "Global";
  category: CompanyCategory;
  type: "Product-based" | "Service-based";
  industry: string;
  founded: number;
  founders: string[];
  hq: string;
  employees: string;
  presence: string;
  website: string;
  careers: string;
  internships: string;
  news: string;
  about: string;
  roles: string[];
  skills: string[];
  certifications: string[];
  process: string[];
  tips: string[];
  eligibility: string[];
  salary: { internship: string; fresher: string; experienced: string };
  benefits: string[];
  tech: string[];
  ratings: CompanyRatings;
  rating: number;
};

type Seed = Partial<Company> &
  Pick<Company, "id" | "name" | "domain" | "region" | "category" | "industry" | "about"> & {
    founded: number;
    hq: string;
  };

const CORE_SKILLS = [
  "Data Structures & Algorithms",
  "Java",
  "Python",
  "JavaScript",
  "SQL",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "Git",
];

const DEFAULTS: Record<
  CompanyCategory,
  Pick<
    Company,
    "skills" | "certifications" | "process" | "tips" | "eligibility" | "benefits" | "salary" | "ratings"
  >
> = {
  Product: {
    skills: [...CORE_SKILLS, "System Design", "Cloud Computing", "React", "Node.js", "C++"],
    certifications: [
      "AWS Cloud Practitioner",
      "Microsoft Azure AZ-900",
      "Google Cloud Digital Leader",
      "Oracle Java Certification",
    ],
    process: [
      "Online Assessment (DSA + aptitude)",
      "Technical Interview 1 — data structures",
      "Coding Interview — problem solving on a shared editor",
      "System design / deep-dive round",
      "Managerial + HR interview",
    ],
    tips: [
      "Practice DSA daily — 2 problems a day for 3 months",
      "Build 3-5 real-world projects with a live link on the resume",
      "Learn System Design basics (caching, load balancing, databases)",
      "Keep your resume ATS-friendly — one page, plain layout, real numbers",
    ],
    eligibility: [
      "B.E./B.Tech/M.Tech/MCA/B.Sc (CS or related)",
      "60% or 6.5 CGPA and above (varies by role)",
      "No active backlogs at the time of joining",
      "Strong problem solving and communication",
    ],
    benefits: [
      "Health insurance for you and family",
      "Flexible / hybrid working",
      "Learning budget and free certifications",
      "Stock options (RSUs)",
      "Paid leave and parental leave",
    ],
    salary: {
      internship: "₹50,000 - ₹1,20,000 / month",
      fresher: "₹18 - ₹45 LPA",
      experienced: "₹35 - ₹90 LPA",
    },
    ratings: { overall: 4.4, workLife: 4.2, growth: 4.4, salary: 4.6, security: 4.1, culture: 4.3 },
  },
  "Indian Product": {
    skills: [...CORE_SKILLS, "React", "Node.js", "REST APIs", "System Design", "Cloud Computing"],
    certifications: [
      "AWS Cloud Practitioner",
      "Microsoft Azure AZ-900",
      "Oracle Java Certification",
      "NPTEL DSA / DBMS",
    ],
    process: [
      "Online Assessment (coding + aptitude)",
      "Technical Interview — DSA and fundamentals",
      "Machine coding / project deep-dive round",
      "Managerial interview",
      "HR interview",
    ],
    tips: [
      "Show clean, working side projects — Indian product teams check code quality",
      "Be strong in one language instead of average in four",
      "Practice machine-coding rounds (build a small app in 90 minutes)",
      "Keep GitHub and LinkedIn links on your resume",
    ],
    eligibility: [
      "B.E./B.Tech/MCA/B.Sc (CS or IT)",
      "60% or 6.0 CGPA throughout academics",
      "No active backlogs (company dependent)",
      "Good written and spoken English",
    ],
    benefits: [
      "Health insurance",
      "Flexible working hours",
      "Hybrid / remote options",
      "Learning programs and certification reimbursement",
      "Paid leave",
    ],
    salary: {
      internship: "₹20,000 - ₹60,000 / month",
      fresher: "₹8 - ₹22 LPA",
      experienced: "₹18 - ₹45 LPA",
    },
    ratings: { overall: 4.2, workLife: 4.1, growth: 4.2, salary: 4.0, security: 4.0, culture: 4.2 },
  },
  Service: {
    skills: [...CORE_SKILLS, "Aptitude & Reasoning", "Cloud Computing", "Testing Basics", "Communication"],
    certifications: [
      "AWS Cloud Practitioner",
      "Microsoft Azure AZ-900",
      "Google Cloud Digital Leader",
      "Cisco CCNA",
      "Red Hat RHCSA",
    ],
    process: [
      "Registration on the company careers portal",
      "Online Assessment — aptitude, reasoning, verbal, coding",
      "Technical Interview on projects and fundamentals",
      "Managerial Interview",
      "HR Interview",
    ],
    tips: [
      "Practise aptitude and pseudo-code — speed matters more than difficulty",
      "Keep 2 projects you can explain end to end",
      "Add free certifications (NPTEL, AWS, Azure) to stand out",
      "Prepare crisp answers for 'tell me about yourself' and 'why this company'",
    ],
    eligibility: [
      "B.E./B.Tech/MCA/M.Sc/B.Sc",
      "60% or 6.0 CGPA in 10th, 12th and degree",
      "No active backlogs, gap of maximum 2 years",
      "Willing to relocate and work in shifts",
    ],
    benefits: [
      "Health insurance",
      "Structured fresher training programs",
      "Free internal certifications",
      "Hybrid work in most locations",
      "Paid leave",
    ],
    salary: {
      internship: "₹10,000 - ₹25,000 / month",
      fresher: "₹3.5 - ₹9 LPA",
      experienced: "₹8 - ₹25 LPA",
    },
    ratings: { overall: 4.0, workLife: 4.0, growth: 3.7, salary: 3.5, security: 4.3, culture: 3.9 },
  },
  Startup: {
    skills: [...CORE_SKILLS, "React", "Node.js", "REST APIs", "Docker", "Cloud Computing"],
    certifications: [
      "AWS Cloud Practitioner",
      "Microsoft Azure AZ-900",
      "Google Cloud Digital Leader",
      "Docker / Kubernetes Fundamentals",
    ],
    process: [
      "Resume shortlist / referral",
      "Online Assessment or take-home task",
      "Technical Interview — DSA and fundamentals",
      "Machine coding or product round",
      "Founder / HR interview",
    ],
    tips: [
      "Ship something real — a deployed app beats a certificate here",
      "Understand the product before the interview and bring one improvement idea",
      "Be comfortable with ownership and fast context switching",
      "Show impact numbers in your resume bullets",
    ],
    eligibility: [
      "Any degree with strong engineering skills",
      "No strict CGPA bar for most roles",
      "Portfolio / GitHub is heavily weighted",
      "Good communication and ownership mindset",
    ],
    benefits: [
      "Health insurance",
      "Flexible / remote-friendly work",
      "ESOPs (stock options)",
      "Learning and conference budget",
      "Paid leave",
    ],
    salary: {
      internship: "₹25,000 - ₹80,000 / month",
      fresher: "₹10 - ₹30 LPA",
      experienced: "₹22 - ₹60 LPA",
    },
    ratings: { overall: 4.1, workLife: 3.8, growth: 4.5, salary: 4.2, security: 3.6, culture: 4.2 },
  },
};

function mk(seed: Seed): Company {
  const d = DEFAULTS[seed.category];
  const site = seed.website ?? `https://www.${seed.domain}`;
  const ratings = { ...d.ratings, ...(seed.ratings ?? {}) };
  return {
    type: seed.category === "Service" ? "Service-based" : "Product-based",
    founders: [],
    employees: seed.category === "Startup" ? "1,000 - 10,000" : "10,000+",
    presence: seed.region === "India" ? "India and select global offices" : "Worldwide",
    website: site,
    careers: seed.careers ?? `${site}/careers`,
    internships: seed.internships ?? seed.careers ?? `${site}/careers`,
    news: `https://news.google.com/search?q=${encodeURIComponent(seed.name)}`,
    roles: [
      "Software Engineer",
      "Full Stack Developer",
      "Backend Developer",
      "Frontend Developer",
      "Data Analyst",
      "QA Engineer",
    ],
    tech: ["Java", "Python", "React", "SQL", "Docker", "Kubernetes"],
    skills: d.skills,
    certifications: d.certifications,
    process: d.process,
    tips: d.tips,
    eligibility: d.eligibility,
    benefits: d.benefits,
    salary: d.salary,
    ...seed,
    ratings,
    rating: Number((ratings.overall ?? 4).toFixed(1)),
  } as Company;
}

export const COMPANIES: Company[] = [
  // ---------- Global product companies ----------
  mk({
    id: "google",
    name: "Google",
    domain: "google.com",
    region: "Global",
    category: "Product",
    industry: "Internet & AI",
    founded: 1998,
    founders: ["Larry Page", "Sergey Brin"],
    hq: "Mountain View, USA",
    employees: "180,000+",
    careers: "https://careers.google.com/",
    internships: "https://buildyourfuture.withgoogle.com/internships",
    about:
      "Google builds search, Android, YouTube, Google Cloud and some of the world's most used AI products. It hires engineers globally and runs one of the largest internship programs in tech.",
    roles: [
      "Software Engineer",
      "Site Reliability Engineer",
      "Data Scientist",
      "AI/ML Engineer",
      "Cloud Engineer",
      "Product Manager",
      "UX Designer",
    ],
    tech: ["Go", "C++", "Java", "Python", "Kubernetes", "TensorFlow", "BigQuery", "Angular"],
    salary: {
      internship: "₹80,000 - ₹1,50,000 / month",
      fresher: "₹25 - ₹55 LPA",
      experienced: "₹50 - ₹1.2 Cr",
    },
    ratings: { overall: 4.6, workLife: 4.4, growth: 4.5, salary: 4.8, security: 4.2, culture: 4.6 },
  }),
  mk({
    id: "microsoft",
    name: "Microsoft",
    domain: "microsoft.com",
    region: "Global",
    category: "Product",
    industry: "Software & Cloud",
    founded: 1975,
    founders: ["Bill Gates", "Paul Allen"],
    hq: "Redmond, USA",
    employees: "220,000+",
    presence: "190+ countries",
    careers: "https://careers.microsoft.com/",
    internships: "https://careers.microsoft.com/students",
    about:
      "Microsoft is one of the world's leading technology companies. It builds software, Azure cloud services, AI solutions, business applications, gaming platforms and productivity tools, operating in more than 190 countries and hiring thousands of graduates every year.",
    roles: [
      "Software Engineer",
      "Full Stack Developer",
      "AI Engineer",
      "Data Scientist",
      "Cloud Engineer",
      "DevOps Engineer",
      "Security Engineer",
      "Product Manager",
    ],
    tech: ["Azure", "C#", ".NET", "TypeScript", "React", "Python", "SQL Server", "Kubernetes"],
    certifications: [
      "Microsoft Azure AZ-900",
      "Azure Developer AZ-204",
      "AWS Cloud Practitioner",
      "Oracle Java Certification",
    ],
    salary: {
      internship: "₹80,000 - ₹1,40,000 / month",
      fresher: "₹22 - ₹50 LPA",
      experienced: "₹45 - ₹1 Cr",
    },
    ratings: { overall: 4.5, workLife: 4.4, growth: 4.4, salary: 4.6, security: 4.4, culture: 4.5 },
  }),
  mk({
    id: "amazon",
    name: "Amazon",
    domain: "amazon.com",
    region: "Global",
    category: "Product",
    industry: "E-commerce & Cloud",
    founded: 1994,
    founders: ["Jeff Bezos"],
    hq: "Seattle, USA",
    employees: "1,500,000+",
    careers: "https://www.amazon.jobs/",
    internships: "https://www.amazon.jobs/en/teams/internships-for-students",
    about:
      "Amazon runs the world's largest e-commerce marketplace and AWS, the biggest cloud platform. Engineering interviews are heavily focused on data structures plus the 16 Leadership Principles.",
    roles: [
      "SDE-1 / SDE Intern",
      "Data Engineer",
      "Cloud Support Associate",
      "DevOps Engineer",
      "Business Analyst",
      "Applied Scientist",
    ],
    tech: ["AWS", "Java", "Python", "DynamoDB", "Lambda", "React", "Kubernetes"],
    tips: [
      "Prepare STAR stories for all 16 Leadership Principles",
      "Practise medium/hard DSA — graphs, DP and trees show up often",
      "Quantify every resume bullet with numbers",
      "Know AWS basics even for non-cloud roles",
    ],
    salary: {
      internship: "₹80,000 - ₹1,25,000 / month",
      fresher: "₹20 - ₹45 LPA",
      experienced: "₹40 - ₹90 LPA",
    },
    ratings: { overall: 4.2, workLife: 3.6, growth: 4.4, salary: 4.6, security: 3.9, culture: 3.9 },
  }),
  mk({
    id: "apple",
    name: "Apple",
    domain: "apple.com",
    region: "Global",
    category: "Product",
    industry: "Consumer Hardware & Software",
    founded: 1976,
    founders: ["Steve Jobs", "Steve Wozniak", "Ronald Wayne"],
    hq: "Cupertino, USA",
    employees: "160,000+",
    careers: "https://jobs.apple.com/",
    about:
      "Apple designs the iPhone, Mac, iPad and the software that runs them. Roles are highly specialised and interviews go deep into fundamentals and craftsmanship.",
    roles: [
      "Software Engineer",
      "iOS Engineer",
      "Machine Learning Engineer",
      "Hardware Engineer",
      "Silicon Design Engineer",
      "Product Design Engineer",
    ],
    tech: ["Swift", "Objective-C", "C++", "Python", "Metal", "CoreML"],
    salary: {
      internship: "₹90,000 - ₹1,50,000 / month",
      fresher: "₹22 - ₹50 LPA",
      experienced: "₹45 - ₹1 Cr",
    },
    ratings: { overall: 4.4, workLife: 4.0, growth: 4.2, salary: 4.7, security: 4.2, culture: 4.3 },
  }),
  mk({
    id: "meta",
    name: "Meta",
    domain: "meta.com",
    region: "Global",
    category: "Product",
    industry: "Social & AI",
    founded: 2004,
    founders: ["Mark Zuckerberg"],
    hq: "Menlo Park, USA",
    employees: "70,000+",
    careers: "https://www.metacareers.com/",
    about:
      "Meta builds Facebook, Instagram, WhatsApp, Reality Labs and the Llama AI models. Interviews are famous for fast-paced coding rounds and product-sense discussions.",
    roles: [
      "Software Engineer",
      "Machine Learning Engineer",
      "Research Scientist",
      "Data Engineer",
      "Product Designer",
    ],
    tech: ["React", "PHP/Hack", "Python", "PyTorch", "GraphQL", "C++"],
    salary: {
      internship: "₹1,00,000 - ₹1,80,000 / month",
      fresher: "₹28 - ₹60 LPA",
      experienced: "₹55 - ₹1.4 Cr",
    },
    ratings: { overall: 4.3, workLife: 3.9, growth: 4.4, salary: 4.8, security: 3.7, culture: 4.1 },
  }),
  mk({
    id: "netflix",
    name: "Netflix",
    domain: "netflix.com",
    region: "Global",
    category: "Product",
    industry: "Streaming & Media Tech",
    founded: 1997,
    founders: ["Reed Hastings", "Marc Randolph"],
    hq: "Los Gatos, USA",
    employees: "13,000+",
    careers: "https://jobs.netflix.com/",
    about:
      "Netflix streams to 260M+ members worldwide and runs a famously high-performance, low-process engineering culture. It hires few freshers and mostly senior engineers.",
    roles: [
      "Software Engineer",
      "Data Engineer",
      "Machine Learning Engineer",
      "Reliability Engineer",
      "Security Engineer",
    ],
    tech: ["Java", "Spring Boot", "Node.js", "React", "AWS", "Kafka", "Cassandra"],
    salary: {
      internship: "₹1,00,000+ / month",
      fresher: "Limited fresher hiring",
      experienced: "₹60 LPA - ₹2 Cr",
    },
    ratings: { overall: 4.3, workLife: 4.0, growth: 4.2, salary: 4.9, security: 3.5, culture: 4.1 },
  }),
  mk({
    id: "adobe",
    name: "Adobe",
    domain: "adobe.com",
    region: "Global",
    category: "Product",
    industry: "Creative & Document Software",
    founded: 1982,
    founders: ["John Warnock", "Charles Geschke"],
    hq: "San Jose, USA",
    employees: "30,000+",
    careers: "https://careers.adobe.com/",
    about:
      "Adobe makes Photoshop, Acrobat, Creative Cloud and Experience Cloud. Its India centres in Noida and Bengaluru hire strongly from campuses through coding tests.",
    roles: [
      "Software Engineer",
      "Machine Learning Engineer",
      "Computer Scientist",
      "Frontend Engineer",
      "Product Manager",
    ],
    tech: ["C++", "Java", "React", "Node.js", "Python", "AWS", "Azure"],
    salary: {
      internship: "₹60,000 - ₹1,00,000 / month",
      fresher: "₹18 - ₹35 LPA",
      experienced: "₹35 - ₹70 LPA",
    },
    ratings: { overall: 4.4, workLife: 4.4, growth: 4.2, salary: 4.4, security: 4.3, culture: 4.4 },
  }),
  mk({
    id: "oracle",
    name: "Oracle",
    domain: "oracle.com",
    region: "Global",
    category: "Product",
    industry: "Databases & Cloud",
    founded: 1977,
    founders: ["Larry Ellison", "Bob Miner", "Ed Oates"],
    hq: "Austin, USA",
    employees: "160,000+",
    careers: "https://www.oracle.com/careers/",
    about:
      "Oracle is the leader in enterprise databases and runs OCI, its cloud platform. It hires large fresher batches in India for cloud, database and applications engineering.",
    roles: [
      "Software Engineer",
      "Cloud Engineer",
      "Database Engineer",
      "Applications Consultant",
      "Support Engineer",
    ],
    tech: ["Java", "Oracle DB", "PL/SQL", "OCI", "Kubernetes", "React"],
    certifications: [
      "Oracle Java Certification",
      "Oracle Cloud Infrastructure Foundations",
      "AWS Cloud Practitioner",
      "Microsoft Azure AZ-900",
    ],
    salary: {
      internship: "₹50,000 - ₹80,000 / month",
      fresher: "₹12 - ₹25 LPA",
      experienced: "₹25 - ₹55 LPA",
    },
    ratings: { overall: 4.1, workLife: 4.2, growth: 3.9, salary: 4.1, security: 4.3, culture: 4.0 },
  }),
  mk({
    id: "salesforce",
    name: "Salesforce",
    domain: "salesforce.com",
    region: "Global",
    category: "Product",
    industry: "CRM & Cloud",
    founded: 1999,
    founders: ["Marc Benioff", "Parker Harris"],
    hq: "San Francisco, USA",
    employees: "70,000+",
    careers: "https://careers.salesforce.com/",
    about:
      "Salesforce is the world's #1 CRM platform with a huge ecosystem of admins and developers. Trailhead certifications carry real weight in its hiring.",
    roles: [
      "Software Engineer",
      "Salesforce Developer",
      "Solution Engineer",
      "Technical Consultant",
      "Data Engineer",
    ],
    tech: ["Apex", "Lightning Web Components", "Java", "React", "AWS", "Heroku"],
    certifications: [
      "Salesforce Certified Administrator",
      "Salesforce Platform Developer I",
      "AWS Cloud Practitioner",
      "Microsoft Azure AZ-900",
    ],
    salary: {
      internship: "₹60,000 - ₹1,00,000 / month",
      fresher: "₹15 - ₹32 LPA",
      experienced: "₹30 - ₹65 LPA",
    },
    ratings: { overall: 4.3, workLife: 4.4, growth: 4.2, salary: 4.4, security: 4.0, culture: 4.5 },
  }),
  mk({
    id: "servicenow",
    name: "ServiceNow",
    domain: "servicenow.com",
    region: "Global",
    category: "Product",
    industry: "Enterprise Workflow Software",
    founded: 2004,
    founders: ["Fred Luddy"],
    hq: "Santa Clara, USA",
    employees: "25,000+",
    careers: "https://careers.servicenow.com/",
    about:
      "ServiceNow builds the enterprise workflow platform used by most Fortune 500 IT teams. Its Hyderabad and Bengaluru centres hire aggressively for platform engineering.",
    roles: [
      "Software Engineer",
      "Platform Developer",
      "QA Automation Engineer",
      "Technical Support Engineer",
      "Cloud Engineer",
    ],
    tech: ["Java", "JavaScript", "Angular", "MySQL", "Kubernetes", "AWS"],
    salary: {
      internship: "₹60,000 - ₹90,000 / month",
      fresher: "₹15 - ₹30 LPA",
      experienced: "₹30 - ₹60 LPA",
    },
    ratings: { overall: 4.3, workLife: 4.3, growth: 4.3, salary: 4.4, security: 4.1, culture: 4.3 },
  }),
  mk({
    id: "nvidia",
    name: "NVIDIA",
    domain: "nvidia.com",
    region: "Global",
    category: "Product",
    industry: "GPUs & AI Computing",
    founded: 1993,
    founders: ["Jensen Huang", "Chris Malachowsky", "Curtis Priem"],
    hq: "Santa Clara, USA",
    employees: "30,000+",
    careers: "https://www.nvidia.com/en-us/about-nvidia/careers/",
    about:
      "NVIDIA powers the AI era with GPUs, CUDA and its data-centre platforms. It hires deeply technical engineers in India for driver, compiler, silicon and AI work.",
    roles: [
      "System Software Engineer",
      "Deep Learning Engineer",
      "ASIC/VLSI Engineer",
      "Compiler Engineer",
      "CUDA Developer",
    ],
    tech: ["C++", "CUDA", "Python", "PyTorch", "Verilog", "Linux"],
    skills: [...CORE_SKILLS, "C++", "Computer Architecture", "Linux Internals", "Parallel Computing"],
    salary: {
      internship: "₹80,000 - ₹1,30,000 / month",
      fresher: "₹20 - ₹45 LPA",
      experienced: "₹40 - ₹95 LPA",
    },
    ratings: { overall: 4.5, workLife: 4.1, growth: 4.6, salary: 4.7, security: 4.3, culture: 4.4 },
  }),
  mk({
    id: "intel",
    name: "Intel",
    domain: "intel.com",
    region: "Global",
    category: "Product",
    industry: "Semiconductors",
    founded: 1968,
    founders: ["Robert Noyce", "Gordon Moore"],
    hq: "Santa Clara, USA",
    employees: "110,000+",
    careers: "https://jobs.intel.com/",
    about:
      "Intel designs and manufactures processors and chip platforms. Its Bengaluru and Hyderabad campuses are among the largest engineering sites outside the US.",
    roles: [
      "Design Engineer",
      "Validation Engineer",
      "Software Engineer",
      "Firmware Engineer",
      "Physical Design Engineer",
    ],
    tech: ["C", "C++", "Python", "Verilog", "SystemVerilog", "Linux"],
    skills: [...CORE_SKILLS, "Digital Electronics", "Computer Architecture", "Verilog", "Linux"],
    salary: {
      internship: "₹40,000 - ₹80,000 / month",
      fresher: "₹12 - ₹28 LPA",
      experienced: "₹25 - ₹60 LPA",
    },
    ratings: { overall: 4.1, workLife: 4.3, growth: 3.9, salary: 4.1, security: 3.9, culture: 4.1 },
  }),
  mk({
    id: "qualcomm",
    name: "Qualcomm",
    domain: "qualcomm.com",
    region: "Global",
    category: "Product",
    industry: "Wireless & Semiconductors",
    founded: 1985,
    founders: ["Irwin Jacobs", "Andrew Viterbi"],
    hq: "San Diego, USA",
    employees: "50,000+",
    careers: "https://careers.qualcomm.com/",
    about:
      "Qualcomm builds Snapdragon chips and the wireless technology behind most smartphones. Its India centres hire heavily for embedded, modem and multimedia software.",
    roles: [
      "Software Engineer",
      "Embedded Engineer",
      "Modem Systems Engineer",
      "Hardware Engineer",
      "Machine Learning Engineer",
    ],
    tech: ["C", "C++", "Python", "Embedded Linux", "RTOS", "Android"],
    skills: [...CORE_SKILLS, "C", "Embedded Systems", "Microprocessors", "Signal Processing"],
    salary: {
      internship: "₹50,000 - ₹90,000 / month",
      fresher: "₹14 - ₹30 LPA",
      experienced: "₹28 - ₹65 LPA",
    },
    ratings: { overall: 4.2, workLife: 4.3, growth: 4.0, salary: 4.3, security: 4.1, culture: 4.2 },
  }),
  mk({
    id: "cisco",
    name: "Cisco",
    domain: "cisco.com",
    region: "Global",
    category: "Product",
    industry: "Networking & Security",
    founded: 1984,
    founders: ["Leonard Bosack", "Sandy Lerner"],
    hq: "San Jose, USA",
    employees: "85,000+",
    careers: "https://jobs.cisco.com/",
    about:
      "Cisco builds the networking and security infrastructure of the internet. Its Bengaluru campus is the largest outside the US and runs a strong intern-to-hire pipeline.",
    roles: [
      "Software Engineer",
      "Network Engineer",
      "Security Engineer",
      "Technical Consulting Engineer",
      "DevOps Engineer",
    ],
    tech: ["C", "C++", "Python", "Go", "Kubernetes", "Linux"],
    certifications: [
      "Cisco CCNA",
      "Cisco CyberOps Associate",
      "AWS Cloud Practitioner",
      "Red Hat RHCSA",
    ],
    skills: [...CORE_SKILLS, "Computer Networks", "Linux", "Cloud Computing", "Network Security"],
    salary: {
      internship: "₹50,000 - ₹85,000 / month",
      fresher: "₹12 - ₹28 LPA",
      experienced: "₹25 - ₹60 LPA",
    },
    ratings: { overall: 4.3, workLife: 4.5, growth: 4.0, salary: 4.2, security: 4.3, culture: 4.4 },
  }),
  mk({
    id: "sap",
    name: "SAP",
    domain: "sap.com",
    region: "Global",
    category: "Product",
    industry: "Enterprise Software",
    founded: 1972,
    founders: ["Dietmar Hopp", "Hasso Plattner", "Klaus Tschira"],
    hq: "Walldorf, Germany",
    employees: "105,000+",
    careers: "https://jobs.sap.com/",
    about:
      "SAP builds the ERP systems that run most large enterprises. SAP Labs India in Bengaluru is its biggest R&D site outside Germany.",
    roles: [
      "Developer Associate",
      "Software Engineer",
      "Cloud Engineer",
      "SAP Functional Consultant",
      "Data Engineer",
    ],
    tech: ["Java", "ABAP", "SAP HANA", "JavaScript", "Kubernetes", "SAP BTP"],
    salary: {
      internship: "₹40,000 - ₹70,000 / month",
      fresher: "₹10 - ₹22 LPA",
      experienced: "₹22 - ₹50 LPA",
    },
    ratings: { overall: 4.3, workLife: 4.5, growth: 4.0, salary: 4.1, security: 4.4, culture: 4.3 },
  }),

  // ---------- Indian product companies ----------
  mk({
    id: "zoho",
    name: "Zoho",
    domain: "zoho.com",
    region: "India",
    category: "Indian Product",
    industry: "SaaS",
    founded: 1996,
    founders: ["Sridhar Vembu", "Tony Thomas"],
    hq: "Chennai, India",
    employees: "15,000+",
    careers: "https://careers.zohocorp.com/",
    about:
      "Zoho builds 50+ business apps entirely in India and is famous for hiring on raw skill through Zoho Schools, not just degrees.",
    roles: [
      "Member Technical Staff",
      "Web Developer",
      "QA Engineer",
      "Technical Support Engineer",
      "Product Marketer",
    ],
    tech: ["Java", "JavaScript", "MySQL", "Struts", "Linux", "Angular"],
    tips: [
      "Zoho's rounds are pure programming — practise C/Java logic problems",
      "Round 2 is a written coding round on paper, so write clean code by hand",
      "Degree matters less than skill here; portfolio helps a lot",
      "Prepare for a long, patient interview day",
    ],
    salary: {
      internship: "₹15,000 - ₹30,000 / month",
      fresher: "₹6 - ₹12 LPA",
      experienced: "₹12 - ₹30 LPA",
    },
    ratings: { overall: 4.3, workLife: 4.5, growth: 4.0, salary: 3.9, security: 4.4, culture: 4.4 },
  }),
  mk({
    id: "freshworks",
    name: "Freshworks",
    domain: "freshworks.com",
    region: "India",
    category: "Indian Product",
    industry: "SaaS",
    founded: 2010,
    founders: ["Girish Mathrubootham", "Shan Krishnasamy"],
    hq: "Chennai, India",
    employees: "5,000+",
    careers: "https://www.freshworks.com/company/careers/",
    about:
      "Freshworks is a Nasdaq-listed Indian SaaS company building customer support, CRM and IT service software for 65,000+ businesses.",
    roles: [
      "Software Engineer",
      "Frontend Engineer",
      "SDET",
      "Data Engineer",
      "Product Support Engineer",
    ],
    tech: ["Ruby on Rails", "React", "Java", "MySQL", "AWS", "Kafka"],
    salary: {
      internship: "₹30,000 - ₹60,000 / month",
      fresher: "₹8 - ₹18 LPA",
      experienced: "₹18 - ₹40 LPA",
    },
    ratings: { overall: 4.2, workLife: 4.2, growth: 4.2, salary: 4.1, security: 3.9, culture: 4.3 },
  }),
  mk({
    id: "razorpay",
    name: "Razorpay",
    domain: "razorpay.com",
    region: "India",
    category: "Indian Product",
    industry: "Fintech",
    founded: 2014,
    founders: ["Harshil Mathur", "Shashank Kumar"],
    hq: "Bengaluru, India",
    employees: "3,000+",
    careers: "https://razorpay.com/jobs/",
    about:
      "Razorpay is India's leading payments and business banking platform, processing billions of dollars for millions of businesses.",
    roles: [
      "Software Development Engineer",
      "Backend Engineer",
      "Frontend Engineer",
      "Data Scientist",
      "Site Reliability Engineer",
    ],
    tech: ["Go", "PHP", "Java", "React", "AWS", "Kafka", "MySQL"],
    salary: {
      internship: "₹40,000 - ₹80,000 / month",
      fresher: "₹12 - ₹24 LPA",
      experienced: "₹24 - ₹50 LPA",
    },
    ratings: { overall: 4.2, workLife: 4.0, growth: 4.4, salary: 4.4, security: 3.9, culture: 4.2 },
  }),
  mk({
    id: "postman",
    name: "Postman",
    domain: "postman.com",
    region: "India",
    category: "Indian Product",
    industry: "Developer Tools",
    founded: 2014,
    founders: ["Abhinav Asthana", "Ankit Sobti", "Abhijit Kane"],
    hq: "Bengaluru / San Francisco",
    employees: "1,000+",
    careers: "https://www.postman.com/company/careers/",
    about:
      "Postman is the API platform used by 30M+ developers worldwide, built out of Bengaluru and now a global developer-tools leader.",
    roles: [
      "Software Engineer",
      "Frontend Engineer",
      "Developer Advocate",
      "SDET",
      "Product Manager",
    ],
    tech: ["TypeScript", "React", "Node.js", "Electron", "AWS", "Postgres"],
    salary: {
      internship: "₹50,000 - ₹90,000 / month",
      fresher: "₹15 - ₹28 LPA",
      experienced: "₹28 - ₹55 LPA",
    },
    ratings: { overall: 4.3, workLife: 4.3, growth: 4.3, salary: 4.4, security: 3.9, culture: 4.4 },
  }),
  mk({
    id: "browserstack",
    name: "BrowserStack",
    domain: "browserstack.com",
    region: "India",
    category: "Indian Product",
    industry: "Testing Infrastructure",
    founded: 2011,
    founders: ["Ritesh Arora", "Nakul Aggarwal"],
    hq: "Mumbai, India",
    employees: "1,000+",
    careers: "https://www.browserstack.com/careers",
    about:
      "BrowserStack runs the world's largest cloud testing platform, letting developers test on thousands of real devices and browsers.",
    roles: ["Software Engineer", "SDET", "Infrastructure Engineer", "Support Engineer", "DevOps Engineer"],
    tech: ["Ruby on Rails", "Node.js", "React", "Selenium", "AWS", "Docker"],
    salary: {
      internship: "₹40,000 - ₹80,000 / month",
      fresher: "₹12 - ₹22 LPA",
      experienced: "₹22 - ₹45 LPA",
    },
    ratings: { overall: 4.2, workLife: 4.2, growth: 4.1, salary: 4.2, security: 4.0, culture: 4.2 },
  }),
  mk({
    id: "cred",
    name: "CRED",
    domain: "cred.club",
    region: "India",
    category: "Indian Product",
    industry: "Fintech",
    founded: 2018,
    founders: ["Kunal Shah"],
    hq: "Bengaluru, India",
    employees: "1,000+",
    careers: "https://careers.cred.club/",
    about:
      "CRED is a members-only credit card payments and lifestyle app known for exceptional design standards and a very selective hiring bar.",
    roles: ["Software Engineer", "Android Engineer", "iOS Engineer", "Data Scientist", "Product Designer"],
    tech: ["Kotlin", "Swift", "Java", "Node.js", "AWS", "Kafka"],
    salary: {
      internship: "₹50,000 - ₹1,00,000 / month",
      fresher: "₹15 - ₹30 LPA",
      experienced: "₹30 - ₹60 LPA",
    },
    ratings: { overall: 4.0, workLife: 3.7, growth: 4.3, salary: 4.5, security: 3.6, culture: 4.0 },
  }),
  mk({
    id: "zerodha",
    name: "Zerodha",
    domain: "zerodha.com",
    region: "India",
    category: "Indian Product",
    industry: "Fintech & Broking",
    founded: 2010,
    founders: ["Nithin Kamath", "Nikhil Kamath"],
    hq: "Bengaluru, India",
    employees: "1,000+",
    careers: "https://zerodha.com/careers/",
    about:
      "Zerodha is India's largest stock broker, bootstrapped and profitable, with a small engineering team that builds Kite and Console in-house.",
    roles: ["Software Engineer", "Backend Engineer", "Frontend Engineer", "DevOps Engineer", "Data Analyst"],
    tech: ["Go", "Python", "Vue.js", "Postgres", "Redis", "Linux"],
    salary: {
      internship: "₹30,000 - ₹60,000 / month",
      fresher: "₹10 - ₹20 LPA",
      experienced: "₹20 - ₹45 LPA",
    },
    ratings: { overall: 4.3, workLife: 4.6, growth: 4.0, salary: 4.2, security: 4.2, culture: 4.4 },
  }),
  mk({
    id: "phonepe",
    name: "PhonePe",
    domain: "phonepe.com",
    region: "India",
    category: "Indian Product",
    industry: "Fintech & UPI",
    founded: 2015,
    founders: ["Sameer Nigam", "Rahul Chari", "Burzin Engineer"],
    hq: "Bengaluru, India",
    employees: "5,000+",
    careers: "https://www.phonepe.com/careers/",
    about:
      "PhonePe processes the largest share of UPI transactions in India and runs one of the country's highest-scale engineering systems.",
    roles: ["Software Engineer", "Backend Engineer", "Android Engineer", "Data Engineer", "SRE"],
    tech: ["Java", "Spring Boot", "Kafka", "Aerospike", "React", "AWS"],
    salary: {
      internship: "₹50,000 - ₹1,00,000 / month",
      fresher: "₹16 - ₹32 LPA",
      experienced: "₹30 - ₹60 LPA",
    },
    ratings: { overall: 4.2, workLife: 3.9, growth: 4.3, salary: 4.5, security: 4.0, culture: 4.1 },
  }),
  mk({
    id: "groww",
    name: "Groww",
    domain: "groww.in",
    region: "India",
    category: "Indian Product",
    industry: "Fintech & Investing",
    founded: 2016,
    founders: ["Lalit Keshre", "Harsh Jain", "Neeraj Singh", "Ishan Bansal"],
    hq: "Bengaluru, India",
    employees: "1,500+",
    careers: "https://groww.in/careers",
    about:
      "Groww is one of India's biggest investing platforms for mutual funds and stocks, built by ex-Flipkart engineers with a mobile-first product culture.",
    roles: ["Software Engineer", "Android Engineer", "Backend Engineer", "Data Scientist", "QA Engineer"],
    tech: ["Java", "Kotlin", "Spring Boot", "React", "Kafka", "AWS"],
    salary: {
      internship: "₹40,000 - ₹80,000 / month",
      fresher: "₹14 - ₹28 LPA",
      experienced: "₹28 - ₹55 LPA",
    },
    ratings: { overall: 4.1, workLife: 4.0, growth: 4.3, salary: 4.3, security: 3.9, culture: 4.1 },
  }),

  // ---------- Service-based companies ----------
  mk({
    id: "tcs",
    name: "Tata Consultancy Services",
    domain: "tcs.com",
    region: "India",
    category: "Service",
    industry: "IT Services",
    founded: 1968,
    founders: ["J. R. D. Tata", "F. C. Kohli"],
    hq: "Mumbai, India",
    employees: "600,000+",
    presence: "150+ locations across 46 countries",
    careers: "https://www.tcs.com/careers",
    internships: "https://nextstep.tcs.com/",
    about:
      "India's largest IT services company, hiring freshers at massive scale through the NQT exam across engineering and non-engineering streams.",
    roles: [
      "Assistant System Engineer",
      "Digital Cadre Engineer",
      "Ninja / Prime Engineer",
      "Business Analyst",
      "Cloud Engineer",
    ],
    tech: ["Java", "Python", ".NET", "SQL", "AWS", "Azure", "ServiceNow"],
    process: [
      "Register on the TCS NextStep portal",
      "TCS National Qualifier Test — aptitude, reasoning, verbal, coding",
      "Technical Interview on projects and fundamentals",
      "Managerial Interview",
      "HR Interview",
    ],
    salary: {
      internship: "₹10,000 - ₹20,000 / month",
      fresher: "₹3.4 - ₹9 LPA (Ninja / Digital / Prime)",
      experienced: "₹8 - ₹25 LPA",
    },
    ratings: { overall: 4.2, workLife: 4.1, growth: 3.7, salary: 3.4, security: 4.5, culture: 4.0 },
  }),
  mk({
    id: "infosys",
    name: "Infosys",
    domain: "infosys.com",
    region: "India",
    category: "Service",
    industry: "IT Services & Consulting",
    founded: 1981,
    founders: ["N. R. Narayana Murthy", "Nandan Nilekani", "and 5 others"],
    hq: "Bengaluru, India",
    employees: "320,000+",
    careers: "https://www.infosys.com/careers/",
    about:
      "Global consulting and IT services major known for its structured Mysore training campus and the InfyTQ hiring route for freshers.",
    roles: [
      "System Engineer",
      "Digital Specialist Engineer",
      "Power Programmer",
      "Operations Executive",
      "Cloud Engineer",
    ],
    tech: ["Java", "Python", "Angular", "SQL", "AWS", "Azure", "SAP"],
    salary: {
      internship: "₹10,000 - ₹20,000 / month",
      fresher: "₹3.6 - ₹9.5 LPA",
      experienced: "₹8 - ₹24 LPA",
    },
    ratings: { overall: 4.1, workLife: 4.1, growth: 3.8, salary: 3.5, security: 4.3, culture: 4.0 },
  }),
  mk({
    id: "wipro",
    name: "Wipro",
    domain: "wipro.com",
    region: "India",
    category: "Service",
    industry: "IT Services",
    founded: 1945,
    founders: ["M. H. Hasham Premji"],
    hq: "Bengaluru, India",
    employees: "230,000+",
    careers: "https://careers.wipro.com/",
    about:
      "Wipro is a global IT, consulting and business process services company that hires freshers through the Elite NTH and WILP programmes.",
    roles: ["Project Engineer", "Elite Trainee", "Cloud Engineer", "Test Engineer", "Support Engineer"],
    tech: ["Java", "Python", ".NET", "SQL", "AWS", "Azure", "Salesforce"],
    salary: {
      internship: "₹10,000 - ₹18,000 / month",
      fresher: "₹3.5 - ₹6.5 LPA",
      experienced: "₹7 - ₹20 LPA",
    },
    ratings: { overall: 4.0, workLife: 4.0, growth: 3.6, salary: 3.3, security: 4.2, culture: 3.9 },
  }),
  mk({
    id: "cognizant",
    name: "Cognizant",
    domain: "cognizant.com",
    region: "Global",
    category: "Service",
    industry: "IT Services & Consulting",
    founded: 1994,
    founders: ["Kumar Mahadeva", "Francisco D'Souza"],
    hq: "Teaneck, USA",
    employees: "340,000+",
    careers: "https://careers.cognizant.com/",
    about:
      "Cognizant is a US-headquartered IT services giant with the majority of its workforce in India, hiring freshers through GenC, GenC Next and GenC Pro.",
    roles: ["Programmer Analyst Trainee", "GenC Next Engineer", "Data Engineer", "QA Engineer", "Support Analyst"],
    tech: ["Java", "Python", "React", "SQL", "AWS", "Azure", "Snowflake"],
    salary: {
      internship: "₹12,000 - ₹20,000 / month",
      fresher: "₹4 - ₹9 LPA (GenC tracks)",
      experienced: "₹8 - ₹22 LPA",
    },
    ratings: { overall: 4.0, workLife: 4.0, growth: 3.8, salary: 3.6, security: 4.0, culture: 3.9 },
  }),
  mk({
    id: "accenture",
    name: "Accenture",
    domain: "accenture.com",
    region: "Global",
    category: "Service",
    industry: "Consulting & Technology",
    founded: 1989,
    founders: ["Spun off from Arthur Andersen"],
    hq: "Dublin, Ireland",
    employees: "770,000+",
    presence: "120+ countries",
    careers: "https://www.accenture.com/in-en/careers",
    about:
      "Accenture is the world's largest consulting and technology services firm, hiring freshers in India for ASE and Advanced App Engineering roles.",
    roles: [
      "Associate Software Engineer",
      "Advanced App Engineering Analyst",
      "Cloud Engineer",
      "Packaged App Developer",
      "Business Analyst",
    ],
    tech: ["Java", "Python", "SAP", "Salesforce", "AWS", "Azure", "ServiceNow"],
    salary: {
      internship: "₹15,000 - ₹25,000 / month",
      fresher: "₹4.6 - ₹11 LPA",
      experienced: "₹10 - ₹28 LPA",
    },
    ratings: { overall: 4.1, workLife: 4.0, growth: 4.0, salary: 3.8, security: 4.1, culture: 4.0 },
  }),
  mk({
    id: "capgemini",
    name: "Capgemini",
    domain: "capgemini.com",
    region: "Global",
    category: "Service",
    industry: "IT Services & Consulting",
    founded: 1967,
    founders: ["Serge Kampf"],
    hq: "Paris, France",
    employees: "340,000+",
    careers: "https://www.capgemini.com/careers/",
    about:
      "Capgemini is a French multinational consulting and technology firm with large Indian delivery centres and an exam-based fresher hiring process.",
    roles: ["Analyst", "Software Engineer", "Cloud Engineer", "Test Engineer", "Support Consultant"],
    tech: ["Java", "Python", ".NET", "SAP", "AWS", "Azure"],
    salary: {
      internship: "₹12,000 - ₹20,000 / month",
      fresher: "₹4.25 - ₹7.5 LPA",
      experienced: "₹8 - ₹22 LPA",
    },
    ratings: { overall: 4.0, workLife: 4.1, growth: 3.7, salary: 3.5, security: 4.1, culture: 3.9 },
  }),
  mk({
    id: "hcltech",
    name: "HCLTech",
    domain: "hcltech.com",
    region: "India",
    category: "Service",
    industry: "IT Services & Engineering",
    founded: 1976,
    founders: ["Shiv Nadar"],
    hq: "Noida, India",
    employees: "220,000+",
    careers: "https://www.hcltech.com/careers",
    about:
      "HCLTech is strong in engineering and R&D services and famously hires students straight after 12th through its TechBee early-career programme.",
    roles: ["Graduate Engineer Trainee", "TechBee Associate", "Software Engineer", "Network Engineer", "Support Engineer"],
    tech: ["Java", "Python", "C++", "AWS", "Azure", "Linux"],
    salary: {
      internship: "₹10,000 - ₹18,000 / month",
      fresher: "₹3.5 - ₹7 LPA",
      experienced: "₹8 - ₹22 LPA",
    },
    ratings: { overall: 4.0, workLife: 4.0, growth: 3.8, salary: 3.5, security: 4.1, culture: 3.9 },
  }),
  mk({
    id: "techmahindra",
    name: "Tech Mahindra",
    domain: "techmahindra.com",
    region: "India",
    category: "Service",
    industry: "IT & Telecom Services",
    founded: 1986,
    founders: ["Mahindra Group", "British Telecom (JV)"],
    hq: "Pune, India",
    employees: "150,000+",
    careers: "https://careers.techmahindra.com/",
    about:
      "Tech Mahindra is a telecom-heavy IT services company under the Mahindra Group, hiring freshers through its own campus and off-campus drives.",
    roles: ["Associate Software Engineer", "Network Engineer", "Test Engineer", "Support Engineer", "Data Analyst"],
    tech: ["Java", "Python", "SQL", "AWS", "5G/Telecom stacks", "ServiceNow"],
    salary: {
      internship: "₹10,000 - ₹18,000 / month",
      fresher: "₹3.25 - ₹6.5 LPA",
      experienced: "₹7 - ₹20 LPA",
    },
    ratings: { overall: 3.9, workLife: 4.0, growth: 3.6, salary: 3.3, security: 4.0, culture: 3.8 },
  }),
  mk({
    id: "ltimindtree",
    name: "LTIMindtree",
    domain: "ltimindtree.com",
    region: "India",
    category: "Service",
    industry: "IT Services",
    founded: 2022,
    founders: ["Merger of L&T Infotech and Mindtree"],
    hq: "Mumbai, India",
    employees: "80,000+",
    careers: "https://www.ltimindtree.com/careers/",
    about:
      "LTIMindtree is the L&T group's IT services arm formed by merging LTI and Mindtree, hiring freshers through campus drives and the Shoshin School programme.",
    roles: ["Graduate Engineer Trainee", "Software Engineer", "Cloud Engineer", "Data Engineer", "QA Engineer"],
    tech: ["Java", "Python", "React", "Azure", "AWS", "Snowflake"],
    salary: {
      internship: "₹12,000 - ₹20,000 / month",
      fresher: "₹4 - ₹8 LPA",
      experienced: "₹9 - ₹24 LPA",
    },
    ratings: { overall: 4.0, workLife: 4.0, growth: 3.8, salary: 3.6, security: 4.0, culture: 3.9 },
  }),
  mk({
    id: "deloitte",
    name: "Deloitte",
    domain: "deloitte.com",
    region: "Global",
    category: "Service",
    industry: "Consulting & Audit",
    founded: 1845,
    founders: ["William Welch Deloitte"],
    hq: "London, UK",
    employees: "450,000+",
    presence: "150+ countries",
    careers: "https://www2.deloitte.com/global/en/careers.html",
    about:
      "Deloitte is the largest of the Big Four professional services firms, hiring for audit, risk, consulting and a very large technology practice in India.",
    roles: ["Analyst — Technology", "Consultant", "Cyber Risk Analyst", "Data Engineer", "Audit Associate"],
    tech: ["Java", "Python", "SQL", "SAP", "Tableau", "Azure", "AWS"],
    tips: [
      "Prepare case-style and situational questions, not just coding",
      "Deloitte's assessments include behavioural and cognitive sections",
      "Show client-facing communication skills clearly",
      "Certifications in cloud, SAP or analytics move the needle",
    ],
    salary: {
      internship: "₹20,000 - ₹40,000 / month",
      fresher: "₹6.5 - ₹12 LPA",
      experienced: "₹14 - ₹35 LPA",
    },
    ratings: { overall: 4.1, workLife: 3.7, growth: 4.2, salary: 4.0, security: 4.1, culture: 4.0 },
  }),
  mk({
    id: "ey",
    name: "EY (Ernst & Young)",
    domain: "ey.com",
    region: "Global",
    category: "Service",
    industry: "Consulting & Audit",
    founded: 1989,
    founders: ["Arthur Young", "Alwin C. Ernst"],
    hq: "London, UK",
    employees: "400,000+",
    careers: "https://www.ey.com/en_in/careers",
    about:
      "EY is a Big Four firm with a fast-growing technology consulting arm (EY GDS) in India covering cyber, data and cloud engineering.",
    roles: ["Analyst — Technology Consulting", "Cyber Security Analyst", "Data Analyst", "Audit Associate", "Cloud Consultant"],
    tech: ["Python", "SQL", "Power BI", "Azure", "SAP", "ServiceNow"],
    salary: {
      internship: "₹20,000 - ₹35,000 / month",
      fresher: "₹6 - ₹11 LPA",
      experienced: "₹13 - ₹32 LPA",
    },
    ratings: { overall: 4.0, workLife: 3.6, growth: 4.1, salary: 3.9, security: 4.0, culture: 4.0 },
  }),
  mk({
    id: "pwc",
    name: "PwC",
    domain: "pwc.com",
    region: "Global",
    category: "Service",
    industry: "Consulting & Audit",
    founded: 1998,
    founders: ["Samuel Lowell Price", "William Cooper"],
    hq: "London, UK",
    employees: "360,000+",
    careers: "https://www.pwc.in/careers.html",
    about:
      "PwC is a Big Four firm combining assurance, tax and a large advisory practice, with growing technology and analytics hiring in India.",
    roles: ["Associate — Technology", "Risk Consultant", "Data Analyst", "Cloud Engineer", "Audit Associate"],
    tech: ["Python", "SQL", "Alteryx", "Power BI", "AWS", "SAP"],
    salary: {
      internship: "₹20,000 - ₹35,000 / month",
      fresher: "₹6 - ₹11 LPA",
      experienced: "₹13 - ₹30 LPA",
    },
    ratings: { overall: 4.0, workLife: 3.7, growth: 4.0, salary: 3.9, security: 4.0, culture: 4.0 },
  }),
  mk({
    id: "kpmg",
    name: "KPMG",
    domain: "kpmg.com",
    region: "Global",
    category: "Service",
    industry: "Consulting & Audit",
    founded: 1987,
    founders: ["Piet Klynveld", "William Barclay Peat", "James Marwick"],
    hq: "Amstelveen, Netherlands",
    employees: "270,000+",
    careers: "https://kpmg.com/in/en/home/careers.html",
    about:
      "KPMG is a Big Four firm hiring for audit, tax, risk consulting and an expanding digital and cyber practice in India.",
    roles: ["Analyst — Advisory", "Cyber Analyst", "Data Analyst", "Audit Associate", "Technology Consultant"],
    tech: ["Python", "SQL", "Power BI", "Azure", "SAP", "ServiceNow"],
    salary: {
      internship: "₹18,000 - ₹35,000 / month",
      fresher: "₹5.5 - ₹10 LPA",
      experienced: "₹12 - ₹28 LPA",
    },
    ratings: { overall: 3.9, workLife: 3.6, growth: 4.0, salary: 3.8, security: 4.0, culture: 3.9 },
  }),

  // ---------- Startups ----------
  mk({
    id: "swiggy",
    name: "Swiggy",
    domain: "swiggy.com",
    region: "India",
    category: "Startup",
    industry: "Food Delivery & Quick Commerce",
    founded: 2014,
    founders: ["Sriharsha Majety", "Nandan Reddy", "Rahul Jaimini"],
    hq: "Bengaluru, India",
    employees: "5,000+",
    careers: "https://careers.swiggy.com/",
    about:
      "Swiggy runs India's leading food delivery and Instamart quick-commerce platforms, solving hard real-time logistics and routing problems.",
    roles: ["Software Engineer", "Data Scientist", "Android Engineer", "Backend Engineer", "Product Manager"],
    tech: ["Java", "Go", "Node.js", "React", "Kafka", "AWS", "Python"],
    salary: {
      internship: "₹40,000 - ₹80,000 / month",
      fresher: "₹14 - ₹28 LPA",
      experienced: "₹28 - ₹55 LPA",
    },
    ratings: { overall: 4.1, workLife: 3.8, growth: 4.3, salary: 4.3, security: 3.8, culture: 4.1 },
  }),
  mk({
    id: "zomato",
    name: "Zomato",
    domain: "zomato.com",
    region: "India",
    category: "Startup",
    industry: "Food Delivery",
    founded: 2008,
    founders: ["Deepinder Goyal", "Pankaj Chaddah"],
    hq: "Gurugram, India",
    employees: "5,000+",
    careers: "https://www.zomato.com/careers",
    about:
      "Zomato is a listed food delivery and restaurant discovery platform with Blinkit under its umbrella, known for lean teams and high ownership.",
    roles: ["Software Engineer", "Data Analyst", "Android Engineer", "Backend Engineer", "Product Manager"],
    tech: ["Go", "PHP", "React", "Kotlin", "Kafka", "AWS"],
    salary: {
      internship: "₹40,000 - ₹80,000 / month",
      fresher: "₹12 - ₹26 LPA",
      experienced: "₹26 - ₹50 LPA",
    },
    ratings: { overall: 4.0, workLife: 3.7, growth: 4.2, salary: 4.2, security: 3.7, culture: 4.0 },
  }),
  mk({
    id: "meesho",
    name: "Meesho",
    domain: "meesho.com",
    region: "India",
    category: "Startup",
    industry: "E-commerce",
    founded: 2015,
    founders: ["Vidit Aatrey", "Sanjeev Barnwal"],
    hq: "Bengaluru, India",
    employees: "2,000+",
    careers: "https://www.meesho.io/jobs",
    about:
      "Meesho is India's value e-commerce leader serving tier-2 and tier-3 users, running very high scale on a lean engineering team.",
    roles: ["Software Engineer", "Data Scientist", "Backend Engineer", "Android Engineer", "Product Manager"],
    tech: ["Java", "Python", "Kotlin", "React", "Kafka", "AWS"],
    salary: {
      internship: "₹50,000 - ₹1,00,000 / month",
      fresher: "₹16 - ₹32 LPA",
      experienced: "₹30 - ₹60 LPA",
    },
    ratings: { overall: 4.1, workLife: 3.8, growth: 4.4, salary: 4.4, security: 3.7, culture: 4.1 },
  }),
  mk({
    id: "flipkart",
    name: "Flipkart",
    domain: "flipkart.com",
    region: "India",
    category: "Startup",
    industry: "E-commerce",
    founded: 2007,
    founders: ["Sachin Bansal", "Binny Bansal"],
    hq: "Bengaluru, India",
    employees: "22,000+",
    careers: "https://www.flipkartcareers.com/",
    about:
      "Flipkart is India's home-grown e-commerce leader (now Walmart-owned) and one of the most sought-after campus recruiters for SDE roles.",
    roles: ["SDE-1", "Data Scientist", "Business Analyst", "Android Engineer", "Product Manager"],
    tech: ["Java", "Go", "React", "Kafka", "Kubernetes", "GCP"],
    salary: {
      internship: "₹80,000 - ₹1,50,000 / month",
      fresher: "₹20 - ₹35 LPA",
      experienced: "₹35 - ₹70 LPA",
    },
    ratings: { overall: 4.2, workLife: 3.9, growth: 4.3, salary: 4.5, security: 3.9, culture: 4.2 },
  }),
  mk({
    id: "ola",
    name: "Ola",
    domain: "olacabs.com",
    region: "India",
    category: "Startup",
    industry: "Mobility & EV",
    founded: 2010,
    founders: ["Bhavish Aggarwal", "Ankit Bhati"],
    hq: "Bengaluru, India",
    employees: "5,000+",
    careers: "https://www.olacabs.com/careers",
    about:
      "Ola runs India's ride-hailing network and Ola Electric, spanning mobility software, maps and EV manufacturing technology.",
    roles: ["Software Engineer", "Embedded Engineer", "Data Scientist", "Backend Engineer", "DevOps Engineer"],
    tech: ["Java", "Python", "Go", "React", "Kafka", "AWS"],
    salary: {
      internship: "₹40,000 - ₹80,000 / month",
      fresher: "₹12 - ₹25 LPA",
      experienced: "₹25 - ₹50 LPA",
    },
    ratings: { overall: 3.8, workLife: 3.5, growth: 4.0, salary: 4.0, security: 3.4, culture: 3.7 },
  }),
  mk({
    id: "uber",
    name: "Uber",
    domain: "uber.com",
    region: "Global",
    category: "Startup",
    industry: "Mobility & Delivery",
    founded: 2009,
    founders: ["Travis Kalanick", "Garrett Camp"],
    hq: "San Francisco, USA",
    employees: "30,000+",
    careers: "https://www.uber.com/careers/",
    about:
      "Uber operates ride-hailing and delivery in 70+ countries, with major engineering centres in Bengaluru and Hyderabad working on marketplace and maps systems.",
    roles: ["Software Engineer", "Data Scientist", "Machine Learning Engineer", "SRE", "Product Manager"],
    tech: ["Go", "Java", "Python", "React", "Kafka", "Kubernetes"],
    salary: {
      internship: "₹1,00,000 - ₹1,60,000 / month",
      fresher: "₹25 - ₹45 LPA",
      experienced: "₹45 - ₹1 Cr",
    },
    ratings: { overall: 4.3, workLife: 4.0, growth: 4.4, salary: 4.7, security: 4.0, culture: 4.2 },
  }),
  mk({
    id: "airbnb",
    name: "Airbnb",
    domain: "airbnb.com",
    region: "Global",
    category: "Startup",
    industry: "Travel & Marketplace",
    founded: 2008,
    founders: ["Brian Chesky", "Joe Gebbia", "Nathan Blecharczyk"],
    hq: "San Francisco, USA",
    employees: "6,500+",
    careers: "https://careers.airbnb.com/",
    about:
      "Airbnb is the global home-sharing marketplace, known for exceptional design standards and a remote-friendly 'Live Anywhere' work policy.",
    roles: ["Software Engineer", "Data Scientist", "Frontend Engineer", "Product Designer", "Machine Learning Engineer"],
    tech: ["React", "TypeScript", "Java", "Kotlin", "Kubernetes", "AWS"],
    salary: {
      internship: "₹1,20,000+ / month",
      fresher: "₹30 - ₹55 LPA",
      experienced: "₹55 LPA - ₹1.5 Cr",
    },
    ratings: { overall: 4.4, workLife: 4.3, growth: 4.2, salary: 4.7, security: 3.9, culture: 4.5 },
  }),
  mk({
    id: "stripe",
    name: "Stripe",
    domain: "stripe.com",
    region: "Global",
    category: "Startup",
    industry: "Fintech & Payments",
    founded: 2010,
    founders: ["Patrick Collison", "John Collison"],
    hq: "San Francisco / Dublin",
    employees: "8,000+",
    careers: "https://stripe.com/jobs",
    about:
      "Stripe builds payments infrastructure for the internet and is widely regarded as one of the highest engineering-quality bars in the industry.",
    roles: ["Software Engineer", "Infrastructure Engineer", "Data Engineer", "Security Engineer", "Solutions Architect"],
    tech: ["Ruby", "Go", "Java", "TypeScript", "React", "Kubernetes"],
    tips: [
      "Stripe interviews are practical — expect real bug fixing and API design",
      "Read the Stripe API docs before the interview",
      "Write production-quality code with tests, not just working code",
      "Communicate your reasoning out loud in every round",
    ],
    salary: {
      internship: "₹1,20,000+ / month",
      fresher: "₹30 - ₹55 LPA",
      experienced: "₹55 LPA - ₹1.5 Cr",
    },
    ratings: { overall: 4.4, workLife: 4.0, growth: 4.5, salary: 4.8, security: 4.0, culture: 4.4 },
  }),
  mk({
    id: "openai",
    name: "OpenAI",
    domain: "openai.com",
    region: "Global",
    category: "Startup",
    industry: "Artificial Intelligence",
    founded: 2015,
    founders: ["Sam Altman", "Ilya Sutskever", "Greg Brockman", "and others"],
    hq: "San Francisco, USA",
    employees: "3,000+",
    careers: "https://openai.com/careers",
    about:
      "OpenAI builds ChatGPT and the GPT model family. Hiring is extremely selective and skews toward research, infrastructure and applied AI engineering.",
    roles: ["Research Engineer", "Software Engineer", "Applied AI Engineer", "Infrastructure Engineer", "Data Engineer"],
    tech: ["Python", "PyTorch", "Kubernetes", "TypeScript", "React", "Triton"],
    skills: [...CORE_SKILLS, "Machine Learning", "Deep Learning", "PyTorch", "Distributed Systems"],
    salary: {
      internship: "₹1,50,000+ / month",
      fresher: "Very limited fresher hiring",
      experienced: "₹1 Cr+ (US-based roles)",
    },
    ratings: { overall: 4.4, workLife: 3.7, growth: 4.8, salary: 4.9, security: 3.8, culture: 4.2 },
  }),
  mk({
    id: "anthropic",
    name: "Anthropic",
    domain: "anthropic.com",
    region: "Global",
    category: "Startup",
    industry: "AI Safety & Research",
    founded: 2021,
    founders: ["Dario Amodei", "Daniela Amodei"],
    hq: "San Francisco, USA",
    employees: "1,000+",
    careers: "https://www.anthropic.com/careers",
    about:
      "Anthropic is an AI safety company building the Claude models, hiring researchers and engineers focused on reliable, interpretable AI systems.",
    roles: ["Research Engineer", "Software Engineer", "ML Infrastructure Engineer", "Security Engineer", "Data Engineer"],
    tech: ["Python", "PyTorch", "Rust", "TypeScript", "Kubernetes", "GCP"],
    skills: [...CORE_SKILLS, "Machine Learning", "Distributed Systems", "PyTorch", "Statistics"],
    salary: {
      internship: "₹1,50,000+ / month",
      fresher: "Very limited fresher hiring",
      experienced: "₹1 Cr+ (US-based roles)",
    },
    ratings: { overall: 4.5, workLife: 4.0, growth: 4.7, salary: 4.9, security: 3.9, culture: 4.5 },
  }),
];

export const REGIONS = ["All", "India", "Global"] as const;
export const CATEGORIES = ["All", "Product", "Indian Product", "Service", "Startup"] as const;

export function getCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function relatedCompanies(company: Company, limit = 6): Company[] {
  return COMPANIES.filter((c) => c.id !== company.id)
    .map((c) => {
      let s = 0;
      if (c.category === company.category) s += 3;
      if (c.industry === company.industry) s += 3;
      if (c.region === company.region) s += 1;
      const overlap = c.tech.filter((t) => company.tech.includes(t)).length;
      return { c, s: s + overlap };
    })
    .sort((a, b) => b.s - a.s || b.c.rating - a.c.rating)
    .slice(0, limit)
    .map((x) => x.c);
}

export function logoUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#.]/g, "");

export type MatchResult = {
  score: number;
  matched: string[];
  missingSkills: string[];
  missingCertifications: string[];
  reasons: { ok: boolean; text: string }[];
  roadmap: { week: number; topic: string }[];
  actions: string[];
};

export function matchCompany(resume: ResumeData, company: Company): MatchResult {
  const haystack = new Set<string>();
  const add = (v?: string) => {
    if (v) haystack.add(norm(v));
  };
  resume.skills.technical.forEach(add);
  resume.skills.tools.forEach(add);
  resume.projects.forEach((p) => p.tech?.forEach(add));
  const freeText = [
    resume.summary ?? "",
    ...resume.projects.map((p) => `${p.name} ${p.description ?? ""} ${(p.bullets ?? []).join(" ")}`),
    ...resume.experience.map((e) => `${e.role} ${e.bullets.join(" ")}`),
  ]
    .join(" ")
    .toLowerCase();

  const has = (skill: string) => {
    const n = norm(skill);
    if (haystack.has(n)) return true;
    for (const h of haystack) if (h.includes(n) || n.includes(h)) return true;
    return freeText.includes(skill.toLowerCase());
  };

  const matched = company.skills.filter(has);
  const missingSkills = company.skills.filter((s) => !matched.includes(s));

  const certText = resume.certifications.map((c) => `${c.name} ${c.issuer ?? ""}`.toLowerCase()).join(" | ");
  const missingCertifications = company.certifications.filter(
    (c) => !certText.includes(c.split(" ")[0].toLowerCase()),
  );

  const skillScore = company.skills.length ? (matched.length / company.skills.length) * 60 : 0;
  const projectScore = Math.min(15, resume.projects.length * 5);
  const expScore = Math.min(10, resume.experience.length * 5);
  const certScore = Math.min(
    10,
    (company.certifications.length - missingCertifications.length) * 4 + (resume.certifications.length ? 2 : 0),
  );
  const eduScore = resume.education.length ? 5 : 0;
  const score = Math.round(Math.min(99, skillScore + projectScore + expScore + certScore + eduScore));

  const reasons: { ok: boolean; text: string }[] = [];
  matched.slice(0, 4).forEach((m) => reasons.push({ ok: true, text: `Good ${m}` }));
  if (resume.projects.length >= 2) reasons.push({ ok: true, text: "Strong projects" });
  if (resume.experience.length) reasons.push({ ok: true, text: "Has internship / work experience" });
  missingSkills.slice(0, 3).forEach((m) => reasons.push({ ok: false, text: `Need better ${m}` }));
  missingCertifications.slice(0, 2).forEach((c) => reasons.push({ ok: false, text: `Missing ${c}` }));
  if (!resume.projects.length) reasons.push({ ok: false, text: "No projects on the resume" });

  const actions = [
    ...missingSkills.slice(0, 4).map((s) => `Learn ${s}`),
    ...missingCertifications.slice(0, 2).map((c) => `Complete ${c}`),
    resume.projects.length < 3 ? `Build one project using ${company.tech[0]}` : "Polish your best project's README",
    "Keep your resume ATS-friendly and one page",
  ];

  const topics = [...missingSkills, ...company.skills].filter(
    (v, i, a) => a.indexOf(v) === i,
  );
  const roadmap = Array.from({ length: 8 }, (_, i) => ({
    week: i + 1,
    topic:
      i === 6
        ? "Projects"
        : i === 7
          ? "Interview Preparation"
          : (topics[i] ?? company.skills[i] ?? "Revision"),
  }));

  return { score, matched, missingSkills, missingCertifications, reasons, roadmap, actions };
}
