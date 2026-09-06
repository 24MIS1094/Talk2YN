import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Globe,
  Calendar,
  Building2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  ListChecks,
  Award,
  Route as RouteIcon,
  Lightbulb,
  Wallet,
  HeartHandshake,
  Cpu,
  Gauge,
  Target,
  CalendarRange,
  Newspaper,
  Check,
  X,
} from "lucide-react";
import {
  getCompany,
  relatedCompanies,
  matchCompany,
  type Company,
  type MatchResult,
} from "@/lib/companies";
import { CompanyLogo } from "@/routes/companies.index";
import { emptyResume, type ResumeData } from "@/lib/resume-schema";
import { getActiveId, getResume } from "@/lib/resume-store";

export const Route = createFileRoute("/companies/$companyId")({
  loader: ({ params }) => {
    const company = getCompany(params.companyId);
    if (!company) throw notFound();
    return { company };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Company not found | Talk2YN" }, { name: "robots", content: "noindex" }],
      };
    }
    const c = loaderData.company;
    const title = `${c.name} — Roles, Skills, Interview Process & Salary | Talk2YN`;
    const desc = `${c.name} hiring guide: popular roles, required skills, certifications, interview rounds, eligibility, salary range, benefits and placement tips.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CompanyDetail,
});

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {icon} {label}
      </div>
      {children}
    </section>
  );
}

function Chips({ items, tone = "ember" }: { items: string[]; tone?: "ember" | "violet" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span
          key={i}
          className="rounded-full glass px-3 py-1.5 text-xs"
          style={{
            borderColor: tone === "violet" ? "color-mix(in srgb, var(--violet) 40%, transparent)" : undefined,
          }}
        >
          {i}
        </span>
      ))}
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-semibold">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${(value / 5) * 100}%`, background: "var(--gradient-ember)" }}
        />
      </div>
    </div>
  );
}

function CompanyDetail() {
  const { company } = Route.useLoaderData() as { company: Company };
  const [resume, setResume] = useState<ResumeData>(emptyResume);

  useEffect(() => {
    const id = getActiveId();
    const stored = id ? getResume(id) : null;
    if (stored?.data) setResume(stored.data);
  }, []);

  const match: MatchResult = useMemo(() => matchCompany(resume, company), [resume, company]);
  const related = useMemo(() => relatedCompanies(company), [company]);
  const hasResume = Boolean(resume.personalInfo.fullName || resume.skills.technical.length);

  const details: Array<[string, string, React.ReactNode]> = [
    ["Company name", company.name, <Building2 key="a" className="size-3.5" />],
    ["Founded", String(company.founded), <Calendar key="b" className="size-3.5" />],
    [
      "Founder(s)",
      company.founders.length ? company.founders.join(", ") : "—",
      <Users key="c" className="size-3.5" />,
    ],
    ["Headquarters", company.hq, <MapPin key="d" className="size-3.5" />],
    ["Industry", company.industry, <Briefcase key="e" className="size-3.5" />],
    ["Company type", company.type, <Building2 key="f" className="size-3.5" />],
    ["Employees", company.employees, <Users key="g" className="size-3.5" />],
    ["Global presence", company.presence, <Globe key="h" className="size-3.5" />],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-8 md:py-12">
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> All companies
        </Link>

        {/* 1-3: logo, name, overview */}
        <header className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <CompanyLogo domain={company.domain} name={company.name} size={72} />
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{company.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-[color:var(--ember)]">
                <Star className="size-3.5 fill-current" />
                <span className="tabular-nums font-semibold">{company.rating.toFixed(1)}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" /> {company.hq}
              </span>
              <span>{company.industry}</span>
              <span>{company.type}</span>
            </div>
          </div>
        </header>
        <p className="mt-5 text-sm md:text-base text-foreground/85 leading-relaxed">{company.about}</p>

        {/* 4: details */}
        <Section icon={<Building2 className="size-4" />} label="Company details">
          <div className="grid sm:grid-cols-2 gap-2.5">
            {details.map(([label, value, icon]) => (
              <div key={label} className="glass rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  {icon} {label}
                </div>
                <div className="text-sm mt-1">{value}</div>
              </div>
            ))}
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl px-4 py-3 hover:border-white/40 transition sm:col-span-2"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Globe className="size-3.5" /> Official website
              </div>
              <div className="text-sm mt-1 inline-flex items-center gap-1.5 text-[color:var(--ember)]">
                {company.website} <ExternalLink className="size-3.5" />
              </div>
            </a>
          </div>
        </Section>

        {/* 15-17: AI match */}
        <Section icon={<Target className="size-4" />} label="Your AI match score (Talk2YN)">
          <div className="glass-ember rounded-3xl p-5">
            {hasResume ? (
              <>
                <div className="flex items-center gap-4">
                  <div
                    className="grid place-items-center size-20 rounded-full shrink-0"
                    style={{
                      background: `conic-gradient(var(--ember) ${match.score * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
                    }}
                  >
                    <div className="grid place-items-center size-16 rounded-full bg-background">
                      <span className="text-xl font-semibold tabular-nums">{match.score}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Your match score
                    </div>
                    <div className="text-lg font-semibold">{company.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Based on your skills, projects, experience and certifications.
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-1.5">
                  {match.reasons.map((r) => (
                    <div key={r.text} className="flex items-start gap-2 text-sm">
                      {r.ok ? (
                        <Check className="size-4 mt-0.5 text-emerald-400 shrink-0" />
                      ) : (
                        <X className="size-4 mt-0.5 text-[color:var(--ember)] shrink-0" />
                      )}
                      <span className={r.ok ? "text-foreground/85" : "text-muted-foreground"}>
                        {r.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                    Missing requirements — to increase your chances
                  </div>
                  <ul className="space-y-1.5">
                    {match.actions.map((a) => (
                      <li key={a} className="text-sm text-foreground/85 flex gap-2">
                        <span className="text-[color:var(--ember)]">•</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Finish your chat with Aaruba first — then your personal match score for{" "}
                {company.name} appears here.{" "}
                <Link to="/build" className="text-[color:var(--ember)] underline">
                  Start the chat
                </Link>
              </div>
            )}
          </div>
        </Section>

        <Section icon={<CalendarRange className="size-4" />} label="Recommended 8-week roadmap">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {match.roadmap.map((w) => (
              <div key={w.week} className="glass rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Week {w.week}
                </div>
                <div className="text-sm mt-1">{w.topic}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 5-7 */}
        <Section icon={<Briefcase className="size-4" />} label="Popular job roles">
          <Chips items={company.roles} />
        </Section>

        <Section icon={<ListChecks className="size-4" />} label="Skills required">
          <div className="flex flex-wrap gap-2">
            {company.skills.map((s) => {
              const have = match.matched.includes(s);
              return (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1.5 text-xs inline-flex items-center gap-1.5 ${
                    have ? "bg-emerald-500/15 text-emerald-300" : "glass"
                  }`}
                >
                  {have && <Check className="size-3" />}
                  {s}
                </span>
              );
            })}
          </div>
        </Section>

        <Section icon={<Award className="size-4" />} label="Preferred certifications">
          <Chips items={company.certifications} tone="violet" />
        </Section>

        {/* 8 */}
        <Section icon={<RouteIcon className="size-4" />} label="Interview process">
          <ol className="space-y-2.5">
            {company.process.map((p, i) => (
              <li key={p} className="glass rounded-2xl px-4 py-3 flex gap-3 items-start">
                <span
                  className="shrink-0 grid place-items-center size-6 rounded-full text-[10px] font-bold text-white"
                  style={{ background: "var(--gradient-ember)" }}
                >
                  {i + 1}
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Round {i + 1}
                  </div>
                  <div className="text-sm">{p}</div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* 9 */}
        <Section icon={<Lightbulb className="size-4" />} label="Placement preparation tips">
          <ul className="space-y-1.5">
            {company.tips.map((t) => (
              <li key={t} className="text-sm text-foreground/85 flex gap-2">
                <span className="text-[color:var(--violet)]">•</span> {t}
              </li>
            ))}
          </ul>
        </Section>

        {/* 10 */}
        <Section icon={<GraduationCap className="size-4" />} label="Eligibility criteria">
          <ul className="space-y-1.5">
            {company.eligibility.map((e) => (
              <li key={e} className="text-sm text-foreground/85 flex gap-2">
                <span className="text-[color:var(--ember)]">•</span> {e}
              </li>
            ))}
          </ul>
        </Section>

        {/* 11 */}
        <Section icon={<Wallet className="size-4" />} label="Salary information">
          <div className="grid sm:grid-cols-3 gap-2.5">
            {[
              ["Internship stipend", company.salary.internship],
              ["Fresh graduate", company.salary.fresher],
              ["Experienced", company.salary.experienced],
            ].map(([k, v]) => (
              <div key={k} className="glass rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
                <div className="text-sm mt-1 font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Salary ranges are approximate and may vary by role, location, and experience.
          </p>
        </Section>

        {/* 12 */}
        <Section icon={<HeartHandshake className="size-4" />} label="Company benefits">
          <Chips items={company.benefits} />
        </Section>

        {/* 13 */}
        <Section icon={<Cpu className="size-4" />} label="Technologies used">
          <Chips items={company.tech} tone="violet" />
        </Section>

        {/* 14 */}
        <Section icon={<Gauge className="size-4" />} label="Company rating">
          <div className="glass rounded-3xl p-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            <RatingBar label="Overall rating" value={company.ratings.overall} />
            <RatingBar label="Work-life balance" value={company.ratings.workLife} />
            <RatingBar label="Career growth" value={company.ratings.growth} />
            <RatingBar label="Salary & benefits" value={company.ratings.salary} />
            <RatingBar label="Job security" value={company.ratings.security} />
            <RatingBar label="Company culture" value={company.ratings.culture} />
          </div>
        </Section>

        {/* 18 */}
        <Section icon={<Building2 className="size-4" />} label="Related companies">
          <div className="grid sm:grid-cols-2 gap-2.5">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/companies/$companyId"
                params={{ companyId: r.id }}
                className="glass rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-white/40 transition"
              >
                <CompanyLogo domain={r.domain} name={r.name} size={36} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{r.industry}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* 19 */}
        <Section icon={<ExternalLink className="size-4" />} label="Official links">
          <div className="grid sm:grid-cols-2 gap-2.5">
            {[
              ["🌐 Official website", company.website],
              ["💼 Careers page", company.careers],
              ["🎓 Internship opportunities", company.internships],
              ["📰 Latest news", company.news],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl px-4 py-3.5 text-sm flex items-center justify-between gap-2 hover:border-white/40 transition"
              >
                <span>{label}</span>
                <ExternalLink className="size-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </Section>

        <a
          href={company.careers}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 w-full rounded-2xl px-5 py-4 text-white flex items-center justify-center gap-2 hover:scale-[1.005] transition text-sm font-semibold"
          style={{ background: "var(--gradient-ember)" }}
        >
          Apply on {company.name} careers <Newspaper className="size-4" />
        </a>
      </div>
    </div>
  );
}
