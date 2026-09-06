import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, Star, ChevronRight, Building2 } from "lucide-react";
import { COMPANIES, REGIONS, CATEGORIES, logoUrl } from "@/lib/companies";

const title = "Search Companies — Indian & Global Employers | Talk2YN";
const desc =
  "Explore top Indian and global companies: roles, skills, certifications, interview process, salary, ratings and how to get placed.";

export const Route = createFileRoute("/companies/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompaniesPage,
});

export function CompanyLogo({
  domain,
  name,
  size = 44,
}: {
  domain: string;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="shrink-0 grid place-items-center rounded-xl bg-white/10 font-semibold"
        style={{ width: size, height: size, fontSize: size / 2.6 }}
      >
        {name.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={logoUrl(domain, 128)}
      alt={`${name} logo`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-xl bg-white/95 object-contain p-1.5"
      style={{ width: size, height: size }}
    />
  );
}

function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPANIES.filter(
      (c) =>
        (region === "All" || c.region === region) &&
        (category === "All" || c.category === category) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.roles.some((r) => r.toLowerCase().includes(q)) ||
          c.tech.some((t) => t.toLowerCase().includes(q))),
    ).sort((a, b) => b.rating - a.rating);
  }, [query, region, category]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-8 md:py-12">
        <Link
          to="/result"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> Back to result
        </Link>

        <header className="mt-6 mb-7">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Company explorer</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            {COMPANIES.length} top employers — product, service, Indian product and startups. Open
            any company for roles, skills, certifications, interview rounds, salary, ratings and your
            personal match score.
          </p>
        </header>

        <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3 mb-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, industry, role or tech…"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`rounded-xl px-4 py-2.5 text-[11px] uppercase tracking-widest transition border ${
                region === r
                  ? "text-white border-transparent"
                  : "glass text-muted-foreground hover:text-foreground border-white/10"
              }`}
              style={region === r ? { background: "var(--gradient-ember)" } : undefined}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-2 text-[11px] transition border ${
                category === c
                  ? "border-[color:var(--ember)] text-foreground"
                  : "glass text-muted-foreground hover:text-foreground border-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {list.map((c) => (
            <Link
              key={c.id}
              to="/companies/$companyId"
              params={{ companyId: c.id }}
              className="group text-left rounded-2xl glass px-4 py-4 hover:border-white/40 transition flex gap-3 items-start"
            >
              <CompanyLogo domain={c.domain} name={c.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-base font-semibold truncate">{c.name}</div>
                  <span className="inline-flex items-center gap-1 text-xs text-[color:var(--ember)] shrink-0">
                    <Star className="size-3.5 fill-current" />
                    <span className="tabular-nums font-semibold">{c.rating.toFixed(1)}</span>
                  </span>
                </div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  {c.industry} · {c.category}
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.about}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-foreground/70 group-hover:text-foreground">
                  View details <ChevronRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
          {list.length === 0 && (
            <div className="text-sm text-muted-foreground py-10 flex items-center gap-2">
              <Building2 className="size-4" /> No companies matched.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
