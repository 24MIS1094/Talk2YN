// Whitelist of strong resume action verbs (base forms + common tenses).
// Used by the ATS engine to check bullet quality — deterministic, no AI.

export const STRONG_ACTION_VERBS = new Set<string>([
  // leadership
  "led", "leads", "leading", "directed", "directs", "managed", "manages", "managing",
  "oversaw", "oversees", "spearheaded", "spearheads", "chaired", "coordinated", "coordinates",
  "supervised", "supervises", "mentored", "mentors", "guided", "guides", "headed",
  // building / creating
  "built", "builds", "building", "created", "creates", "creating", "designed", "designs",
  "developed", "develops", "developing", "engineered", "engineers", "architected", "architects",
  "implemented", "implements", "implementing", "launched", "launches", "shipped", "ships",
  "produced", "produces", "delivered", "delivers", "prototyped", "prototypes", "authored",
  "programmed", "coded", "assembled", "constructed",
  // improving
  "improved", "improves", "improving", "optimized", "optimizes", "optimizing", "increased",
  "increases", "reduced", "reduces", "reducing", "accelerated", "accelerates", "streamlined",
  "streamlines", "enhanced", "enhances", "upgraded", "upgrades", "refined", "refines",
  "boosted", "boosts", "cut", "cuts", "saved", "saves", "eliminated", "eliminates",
  "automated", "automates", "automating", "consolidated", "consolidates",
  // analysis
  "analyzed", "analyzes", "analyzing", "researched", "researches", "evaluated", "evaluates",
  "assessed", "assesses", "audited", "audits", "measured", "measures", "modeled", "models",
  "forecasted", "forecasts", "identified", "identifies", "investigated", "investigates",
  "diagnosed", "diagnoses",
  // communication
  "presented", "presents", "communicated", "communicates", "negotiated", "negotiates",
  "collaborated", "collaborates", "collaborating", "partnered", "partners", "advised",
  "advises", "consulted", "consults", "trained", "trains", "training", "taught", "teaches",
  "facilitated", "facilitates", "influenced", "influences",
  // achievement
  "achieved", "achieves", "won", "wins", "earned", "earns", "secured", "secures",
  "exceeded", "exceeds", "surpassed", "surpasses", "awarded", "recognized",
  // other high-signal
  "drove", "drives", "driving", "owned", "owns", "solved", "solves", "resolved",
  "resolves", "executed", "executes", "deployed", "deploys", "deploying", "integrated",
  "integrates", "integrating", "migrated", "migrates", "scaled", "scales", "tested",
  "tests", "testing", "validated", "validates", "conducted", "conducts", "generated",
  "generates", "established", "establishes", "initiated", "initiates", "pioneered",
  "orchestrated", "transformed", "reengineered", "revamped",
]);

// Weak / passive openers we should flag
export const WEAK_OPENERS = new Set<string>([
  "responsible", "duties", "worked", "helped", "assisted", "participated", "involved",
  "tasked", "handled", "did", "was", "were", "am", "is", "are", "been", "being",
  "attempted", "tried",
]);

// Vague filler phrases that hurt bullets
export const VAGUE_PHRASES = [
  "a lot of", "various", "many things", "team player", "hard worker",
  "detail oriented", "results driven", "go-getter", "self starter",
  "think outside the box", "synergy", "wear many hats",
];
