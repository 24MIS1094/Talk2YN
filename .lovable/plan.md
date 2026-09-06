# ATS Score Predictor (Deloitte-grade, deterministic)

Today the "Find it out" screen asks the AI to guess an ATS score — the number wobbles between runs and isn't tied to real ATS rules. Real ATS tools (Jobscan, Resume Worded, Deloitte's internal parser) score with fixed rubrics + job-description keyword matching. We'll do the same.

## What we're building

1. **Deterministic rule-based ATS engine** — same resume, same score, every time. No AI randomness in the number.
2. **Job Description matching** — paste a JD, get keyword coverage % + missing keywords (the core of every real ATS checker).
3. **New `/ats` page** — big score ring, sub-scores, fix list, JD paste box, keyword chips (present / missing / partial).
4. **ATS-friendly guardrails baked into the build flow** — so users can't accidentally produce a resume the scorer would fail.

## The scoring rubric (100 pts, fixed weights)

Modeled on Jobscan / Resume Worded / typical corporate ATS parsers:

| Category | Weight | What we actually check (deterministic) |
|---|---|---|
| Contact parseable | 10 | Name, valid email regex, phone (E.164-ish), city, LinkedIn URL |
| Standard sections present | 10 | Summary, Experience, Education, Skills all non-empty |
| Job title / role match (JD) | 10 | Resume roles vs JD title (token overlap) — skipped & reweighted if no JD |
| Hard-skill keyword match (JD) | 20 | % of JD hard skills found in resume (skills + bullets + projects) |
| Soft-skill keyword match (JD) | 5 | Same, soft skills |
| Action verbs in bullets | 8 | % of bullets starting with a strong verb (whitelist of ~120) |
| Quantified achievements | 8 | % of bullets containing a number / % / $ / time unit |
| Bullet length sanity | 5 | Each bullet 8–32 words; penalize wall-of-text and one-liners |
| Dates format | 5 | Every experience has parseable start + end (or "Present") |
| File-format friendliness | 5 | Flags: emojis, tables, images, multi-column, non-ASCII bullets, headers/footers, uncommon section names |
| Grammar / spelling smell test | 4 | Regex checks: doubled words, lowercase sentence starts, "i " pronoun, trailing spaces |
| Length appropriateness | 5 | 350–900 words for <5 yrs; 500–1200 for senior |
| Tense consistency | 5 | Current role uses present tense; past roles past tense (verb-list check) |

**No JD provided** → the JD-dependent categories (35 pts) redistribute proportionally, so the score stays on a 0–100 scale and users always see a real number.

Every category returns `{ score, max, checks: [{ pass, message, fix }] }` — the UI shows exactly which check failed and how to fix it, like Jobscan does.

## Where AI is (and isn't) used

- **Not** for the ATS number itself → deterministic.
- **Yes** for a small "Aaruba's take" panel on the page — one paragraph of human-readable summary using the existing `/api/analyze` output. Users see one trustworthy score + optional AI commentary, not two conflicting scores.

## ATS-friendly guardrails in the build flow

Small, non-intrusive additions so the resume is ATS-clean from the start:

- **Templates page**: badge each template as "ATS-safe" (Classic, Modern Professional, Minimal, Technical, Student) or "Design-first — may reduce ATS score" (Executive with sidebar, Creative). Sort ATS-safe first when a JD is loaded.
- **PDF export**: keep current single-page renderer, but ensure text stays as real text (already true — we render HTML, not images) and confirm no emoji/icon glyphs leak into headings.
- **Build chat**: when Aaruba receives a bullet with no verb or no number, quietly append it to a "weak bullets" list the ATS page surfaces (no interruption to the interview).
- **Live ATS chip** in the build header: tiny pill showing current deterministic ATS score, updates as the resume updates — same engine, so users see it climb in real time.

## New / changed files

**New**
- `src/lib/ats-engine.ts` — pure function `scoreResume(data, jd?) → AtsReport`. No network. Fully unit-testable.
- `src/lib/ats-verbs.ts` — action-verb whitelist + weak-verb list.
- `src/lib/jd-parser.ts` — extract hard skills, soft skills, title, years-required from a pasted JD (heuristic + small keyword dictionary; no AI call needed, keeps it instant and free).
- `src/routes/ats.tsx` — new page: score ring, category breakdown, JD paste box, keyword chips, per-check fix list, "Recompute" button.

**Changed**
- `src/routes/build.tsx` — add small live ATS pill in header, link it to `/ats`.
- `src/routes/analysis.tsx` — replace the AI-generated ATS number with the deterministic one; keep the rest of the AI analysis (writing/skills/etc.) as coaching commentary.
- `src/routes/templates.tsx` — ATS-safe badge + sort-when-JD-present.

Nothing about the existing UI, chat flow, colors, or PDF pipeline changes beyond these additions.

## User flow

```text
Build page ──► live ATS pill (e.g. "ATS 72") ──► click ──► /ats
   /ats: paste JD (optional) ──► instant recompute
           ├── Overall score ring
           ├── 13 category cards with pass/fail checks + one-line fixes
           ├── Keyword coverage: [present chips] [missing chips]
           └── "Apply Aaruba's fixes" → runs existing /api/rewrite on weak bullets
```

## Open question

Want a **live ATS pill in the build header** (updates as you chat), or keep the score behind a click on `/ats` only? Default in this plan is: show the pill — it makes the ATS focus visible without being loud.