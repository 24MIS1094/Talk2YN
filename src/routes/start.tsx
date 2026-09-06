import { createFileRoute, Link } from "@tanstack/react-router";
import { MessagesSquare, Building2, ChevronRight, LayoutDashboard, LifeBuoy } from "lucide-react";

const title = "Where to begin — Talk2YN";
const desc =
  "Chat with Aaruba to build your resume, or search top Indian and global companies to plan your placement.";

export const Route = createFileRoute("/start")({
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
  component: StartPage,
});

function StartPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-50 animate-drift"
          style={{ background: "radial-gradient(circle, #ff6b35 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-40 animate-float"
          style={{ background: "radial-gradient(circle, #e84393 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-14 md:py-20">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Welcome to Talk2YN
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          What would you like to do?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-lg">
          Build your resume in a simple conversation with Aaruba, or explore companies and see
          exactly what it takes to get placed there.
        </p>

        <div className="mt-9 grid gap-3">
          <Link
            to="/build"
            className="w-full rounded-2xl px-5 py-6 text-white flex items-center justify-between gap-4 hover:scale-[1.005] active:scale-[0.995] transition shadow-[0_20px_55px_-20px_rgba(255,107,53,0.9)]"
            style={{ background: "var(--gradient-ember)" }}
          >
            <span className="flex items-center gap-3 min-w-0 text-left">
              <MessagesSquare className="size-6 shrink-0" />
              <span className="min-w-0">
                <span className="block text-base font-semibold">Chat with Aaruba</span>
                <span className="block text-[10px] uppercase tracking-widest opacity-80">
                  Answer simple questions · resume builds live
                </span>
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0" />
          </Link>

          <Link
            to="/companies"
            className="w-full rounded-2xl glass-ember px-5 py-6 flex items-center justify-between gap-4 hover:border-white/40 transition"
          >
            <span className="flex items-center gap-3 min-w-0 text-left">
              <Building2 className="size-6 shrink-0 text-[color:var(--ember)]" />
              <span className="min-w-0">
                <span className="block text-base font-semibold">Search for a company</span>
                <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Indian &amp; global employers · how to get placed
                </span>
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          </Link>

          <Link
            to="/dashboard"
            className="w-full rounded-2xl glass px-5 py-4 flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground hover:border-white/30 transition"
          >
            <LayoutDashboard className="size-4" /> My saved resumes
          </Link>

          <Link
            to="/contact"
            className="w-full rounded-2xl glass px-5 py-4 flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground hover:border-white/30 transition"
          >
            <LifeBuoy className="size-4" /> Contact admin
          </Link>
        </div>
      </div>
    </div>
  );
}
