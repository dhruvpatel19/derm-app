import Link from "next/link";
import { Clock, HelpCircle, Signal } from "lucide-react";
import { cases } from "@/data/cases";
import { conditions } from "@/data/conditions";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Clinical Cases - DermEd",
  description:
    "Interactive case-based learning modules for dermatology education.",
};

const difficultyConfig: Record<
  string,
  { label: string; className: string; tint: string }
> = {
  beginner: {
    label: "Beginner",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200",
    tint: "from-emerald-500/18 to-teal-500/8",
  },
  intermediate: {
    label: "Intermediate",
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200",
    tint: "from-amber-500/20 to-orange-500/8",
  },
  advanced: {
    label: "Advanced",
    className:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200",
    tint: "from-red-500/18 to-rose-500/8",
  },
};

export default function CasesPage() {
  const conditionMap = Object.fromEntries(conditions.map((condition) => [condition.id, condition]));

  return (
    <div className="page-shell pb-24 pt-8 sm:pt-10">
      <PageHeader
        title="Clinical Cases"
        description="Work through interactive patient scenarios to build clinical reasoning skills. Each case includes history, exam findings, and multi-format questions."
        breadcrumbs={[{ label: "Cases" }]}
      >
        <div className="flex flex-wrap gap-3">
          <div className="metric-chip">
            <strong>{cases.length}</strong>
            case modules
          </div>
          <div className="metric-chip">
            <strong>{cases.reduce((sum, item) => sum + item.questions.length, 0)}</strong>
            total questions
          </div>
          <div className="metric-chip">
            <strong>Guided</strong>
            answer explanations
          </div>
        </div>
      </PageHeader>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {cases.map((caseItem, index) => {
          const condition = conditionMap[caseItem.conditionId];
          const conditionName = condition?.name ?? "Unknown";
          const difficulty = difficultyConfig[caseItem.difficulty ?? "intermediate"];
          const questionCount = caseItem.questions.length;

          return (
            <Link
              key={caseItem.id}
              href={`/cases/${caseItem.id}`}
              className="group block"
            >
              <article
                className="surface-panel card-hover relative h-full overflow-hidden rounded-[30px] p-5 animate-card-enter sm:p-6"
                style={{ animationDelay: `${Math.min(index * 50, 420)}ms` }}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${difficulty.tint} opacity-90`}
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={difficulty.className}>{difficulty.label}</Badge>
                    <Badge variant="outline">{conditionName}</Badge>
                  </div>

                  <h3 className="mt-5 text-foreground">{caseItem.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {caseItem.patientSummary}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[18px] border border-white/55 bg-white/48 px-3 py-2.5 dark:border-white/7 dark:bg-white/4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Signal className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                          Level
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-foreground">
                        {difficulty.label}
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-white/55 bg-white/48 px-3 py-2.5 dark:border-white/7 dark:bg-white/4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <HelpCircle className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                          Questions
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-foreground">
                        {questionCount}
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-white/55 bg-white/48 px-3 py-2.5 dark:border-white/7 dark:bg-white/4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                          Time
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-foreground">
                        {caseItem.estimatedMinutes ? `~${caseItem.estimatedMinutes} min` : "Flexible"}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
