import Link from "next/link";
import {
  ClipboardCheck,
  Crosshair,
  ListOrdered,
  Target,
} from "lucide-react";
import {
  simulationModules,
  type SimulationModule,
} from "@/data/simulation-modules";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Simulation Lab - DermEd",
  description:
    "Practice procedural reasoning through decision-based dermatology simulations.",
};

const typeMeta: Record<
  SimulationModule["type"],
  { label: string; icon: typeof Crosshair; description: string; tint: string }
> = {
  biopsy_choice: {
    label: "Biopsy Choice",
    icon: Crosshair,
    description:
      "Choose the safest and most appropriate biopsy technique for each scenario.",
    tint: "from-teal-500/20 to-cyan-500/8",
  },
  target_selector: {
    label: "Target Selection",
    icon: Target,
    description:
      "Select the exact lesion or skin region that should be sampled.",
    tint: "from-emerald-500/20 to-teal-500/8",
  },
  procedure_sequence: {
    label: "Procedure Sequencing",
    icon: ListOrdered,
    description:
      "Arrange procedural steps in order and review common pitfalls.",
    tint: "from-amber-500/20 to-orange-500/8",
  },
  interactive_procedure: {
    label: "Procedure Lab",
    icon: ClipboardCheck,
    description:
      "Run a fuller workflow with equipment choice, anesthesia, lesion targeting, pathology review, and follow-up planning.",
    tint: "from-rose-500/20 to-orange-500/8",
  },
};

const difficultyConfig: Record<string, { label: string; className: string }> = {
  beginner: {
    label: "Beginner",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200",
  },
  intermediate: {
    label: "Intermediate",
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200",
  },
  advanced: {
    label: "Advanced",
    className:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200",
  },
};

function groupByType(modules: SimulationModule[]) {
  const groups: Record<SimulationModule["type"], SimulationModule[]> = {
    biopsy_choice: [],
    target_selector: [],
    procedure_sequence: [],
    interactive_procedure: [],
  };

  for (const simulationModule of modules) {
    if (simulationModule.isActive) groups[simulationModule.type].push(simulationModule);
  }

  return groups;
}

export default function SimulationPage() {
  const groups = groupByType(simulationModules);
  const activeCount = simulationModules.filter((simulationModule) => simulationModule.isActive).length;
  const activeFormats = Object.values(groups).filter((items) => items.length > 0).length;

  return (
    <div className="page-shell pb-24 pt-8 sm:pt-10">
      <PageHeader
        title="Simulation Lab"
        description="Practice procedural reasoning with guided modules ranging from focused biopsy decisions to full procedure-lab workflows."
        breadcrumbs={[{ label: "Simulation" }]}
      >
        <div className="flex flex-wrap gap-3">
          <div className="metric-chip">
            <strong>{activeCount}</strong>
            active simulations
          </div>
          <div className="metric-chip">
            <strong>{activeFormats}</strong>
            procedural formats
          </div>
          <div className="metric-chip">
            <strong>Guided</strong>
            feedback after each attempt
          </div>
        </div>
      </PageHeader>

      <div className="mt-6 flex flex-col gap-8">
        {(Object.entries(groups) as [SimulationModule["type"], SimulationModule[]][]).map(
          ([type, modules]) => {
            if (modules.length === 0) return null;
            const meta = typeMeta[type];
            const Icon = meta.icon;

            return (
              <section key={type} className="space-y-4">
                <div className="surface-panel rounded-[30px] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-foreground text-background dark:bg-white dark:text-[#10233f]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Simulation track
                        </div>
                        <h2 className="mt-2 text-[1.85rem] text-foreground">
                          {meta.label}
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                          {meta.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{modules.length} modules</Badge>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {modules.map((simulationModule, index) => {
                    const difficulty =
                      difficultyConfig[simulationModule.difficulty] ??
                      difficultyConfig.intermediate;

                    return (
                      <Link key={simulationModule.id} href={`/simulation/${simulationModule.id}`} className="group block">
                        <article
                          className="surface-panel card-hover relative h-full overflow-hidden rounded-[30px] p-5 animate-card-enter sm:p-6"
                          style={{ animationDelay: `${Math.min(index * 50, 320)}ms` }}
                        >
                          <div
                            className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${meta.tint} opacity-90`}
                          />
                          <div className="relative flex h-full flex-col">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={difficulty.className}>{difficulty.label}</Badge>
                              {simulationModule.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <h3 className="mt-5 text-foreground">{simulationModule.title}</h3>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                              {simulationModule.description}
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-[18px] border border-white/55 bg-white/48 px-3 py-2.5 dark:border-white/7 dark:bg-white/4">
                                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                  Objectives
                                </div>
                                <div className="mt-1 text-sm font-bold text-foreground">
                                  {simulationModule.objectives.length}
                                </div>
                              </div>
                              <div className="rounded-[18px] border border-white/55 bg-white/48 px-3 py-2.5 dark:border-white/7 dark:bg-white/4">
                                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                  Format
                                </div>
                                <div className="mt-1 text-sm font-bold text-foreground">
                                  {meta.label}
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          }
        )}
      </div>
    </div>
  );
}
