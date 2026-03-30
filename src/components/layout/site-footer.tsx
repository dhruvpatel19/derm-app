import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Crosshair, FileText } from "lucide-react";

const footerLinks = [
  { href: "/explorer", label: "Condition Explorer" },
  { href: "/glossary", label: "Morphology Glossary" },
  { href: "/trainer", label: "Practice Trainer" },
  { href: "/cases", label: "Clinical Cases" },
  { href: "/simulation", label: "Simulation Lab" },
  { href: "/dashboard", label: "Progress Dashboard" },
];

const quickStarts = [
  {
    href: "/explorer",
    label: "Review conditions",
    icon: BookOpen,
  },
  {
    href: "/trainer",
    label: "Run a quiz session",
    icon: Brain,
  },
  {
    href: "/cases",
    label: "Solve a clinical case",
    icon: FileText,
  },
  {
    href: "/simulation",
    label: "Practice procedures",
    icon: Crosshair,
  },
];

export function SiteFooter() {
  return (
    <footer className="pb-8 pt-12">
      <div className="page-shell">
        <div className="surface-panel rounded-[34px] px-6 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr_1fr]">
            <div className="space-y-4">
              <div className="eyebrow">Educational use only</div>
              <div className="max-w-xl">
                <h2 className="text-[2rem] text-foreground sm:text-[2.35rem]">
                  A sharper interface for structured dermatology learning.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                  DermEd Studio is built to help learners move between visual
                  recognition, case reasoning, and procedural decision-making
                  without feeling like they are jumping across disconnected tools.
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Not for clinical diagnosis or direct patient care
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Explore
              </p>
              <div className="mt-4 grid gap-2">
                {footerLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center justify-between rounded-[20px] border border-white/50 bg-white/45 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/6 dark:bg-white/4"
                  >
                    <span>{label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Quick starts
              </p>
              <div className="mt-4 grid gap-3">
                {quickStarts.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="ink-panel flex items-center gap-3 rounded-[24px] px-4 py-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{label}</div>
                      <div className="text-xs text-white/70">Open module</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/50 pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between dark:border-white/6">
            <p>&copy; 2026 DermEd Studio</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">
              Designed for medical education workflows
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
