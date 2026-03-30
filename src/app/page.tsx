import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ClipboardList,
  Crosshair,
  FileText,
  FlaskConical,
  GitCompare,
  ImageIcon,
  Microscope,
} from "lucide-react";
import { getDatasetStats } from "@/lib/data-loader";
import { cases } from "@/data/cases";
import { simulationModules } from "@/data/simulation-modules";
import { Button } from "@/components/ui/button";

function buildStats() {
  const ds = getDatasetStats();
  return {
    conditions: ds.totalConditions,
    images: ds.totalImages,
    quizItems: ds.quizItemCount,
    cases: cases.length,
    simulations: simulationModules.filter((simulationModule) => simulationModule.isActive).length,
  };
}

const modules = [
  {
    href: "/explorer",
    title: "Condition Explorer",
    description:
      "Browse conditions with clinical images, differentials, and red-flag teaching points in one place.",
    icon: BookOpen,
    metricKey: "conditions" as const,
    metricLabel: "conditions mapped",
    accent: "from-[#1d7e78]/15 to-[#205f7d]/12",
    span: "lg:col-span-5",
  },
  {
    href: "/glossary",
    title: "Morphology Glossary",
    description:
      "Study the language of skin description with quick confusion guides and cross-linked terms.",
    icon: Microscope,
    metricKey: null,
    metricLabel: "reference library",
    accent: "from-[#d19a45]/18 to-[#f2cf92]/10",
    span: "lg:col-span-3",
  },
  {
    href: "/trainer",
    title: "Practice Studio",
    description:
      "Run image-based drills that push observation, description, diagnosis, and differential ranking.",
    icon: Brain,
    metricKey: "quizItems" as const,
    metricLabel: "quiz prompts",
    accent: "from-[#205f7d]/18 to-[#6b63b5]/12",
    span: "lg:col-span-4",
  },
  {
    href: "/cases",
    title: "Clinical Cases",
    description:
      "Work through patient stories with structured reasoning, feedback, and review-ready explanations.",
    icon: FileText,
    metricKey: "cases" as const,
    metricLabel: "cases available",
    accent: "from-[#1d7e78]/14 to-[#d19a45]/12",
    span: "lg:col-span-4",
  },
  {
    href: "/compare",
    title: "Compare Mode",
    description:
      "Train contrastive thinking by placing look-alike conditions side by side.",
    icon: GitCompare,
    metricKey: null,
    metricLabel: "pattern separation",
    accent: "from-[#6b63b5]/18 to-[#205f7d]/10",
    span: "lg:col-span-4",
  },
  {
    href: "/simulation",
    title: "Simulation Lab",
    description:
      "Practice biopsy choice, target selection, and step sequencing in a guided environment.",
    icon: Crosshair,
    metricKey: "simulations" as const,
    metricLabel: "interactive sims",
    accent: "from-[#d19a45]/18 to-[#c0657b]/10",
    span: "lg:col-span-4",
  },
  {
    href: "/dashboard",
    title: "Progress Dashboard",
    description:
      "See weak concepts, learning streaks, recent work, and where to go next.",
    icon: BarChart3,
    metricKey: null,
    metricLabel: "personal analytics",
    accent: "from-[#205f7d]/14 to-[#1d7e78]/10",
    span: "lg:col-span-12",
  },
];

const learningSteps = [
  {
    number: "01",
    title: "Start with the visual language",
    description:
      "Build fluency in lesion morphology before you memorize labels.",
    icon: Microscope,
  },
  {
    number: "02",
    title: "Move into image recognition",
    description:
      "Practice repeated, high-volume observation on authentic clinical examples.",
    icon: ImageIcon,
  },
  {
    number: "03",
    title: "Apply it in context",
    description:
      "Use cases and compare mode to connect pattern recognition to reasoning.",
    icon: FlaskConical,
  },
  {
    number: "04",
    title: "Check retention and target gaps",
    description:
      "Return to weak concepts with guided review and progress analytics.",
    icon: Activity,
  },
];

export default function Home() {
  const stats = buildStats();

  const statChips = [
    {
      label: "Condition atlas",
      value: stats.conditions.toLocaleString(),
      detail: "diagnostic summaries",
      icon: BookOpen,
    },
    {
      label: "Clinical image bank",
      value: stats.images.toLocaleString(),
      detail: "open-access examples",
      icon: ImageIcon,
    },
    {
      label: "Quiz items",
      value: stats.quizItems.toLocaleString(),
      detail: "pattern-recognition prompts",
      icon: ClipboardList,
    },
    {
      label: "Reasoning cases",
      value: stats.cases.toLocaleString(),
      detail: "structured patient scenarios",
      icon: FileText,
    },
  ];

  const moduleMetrics = {
    conditions: stats.conditions.toLocaleString(),
    quizItems: stats.quizItems.toLocaleString(),
    cases: stats.cases.toLocaleString(),
    simulations: stats.simulations.toLocaleString(),
  } as const;

  return (
    <div className="page-shell pb-24 pt-8 sm:pt-10">
      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="surface-panel-strong rounded-[36px] px-6 py-7 sm:px-8 sm:py-9">
          <div className="eyebrow">Dermatology education reimagined</div>
          <h1 className="mt-5 max-w-4xl text-foreground">
            Train your eye, sharpen your differential, and learn like a modern
            clinical workspace.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            DermEd Studio combines visual pattern recognition, morphology,
            case-based reasoning, and procedural simulation into a single
            teaching environment built for publishable-quality medical learning.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/trainer">
              <Button size="lg">
                Start with the trainer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explorer">
              <Button variant="outline" size="lg">
                Browse the condition atlas
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statChips.map(({ label, value, detail, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[24px] border border-white/55 bg-white/58 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] dark:border-white/7 dark:bg-white/5"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                    {label}
                  </span>
                </div>
                <div className="mt-3 text-2xl font-extrabold text-foreground">
                  {value}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ink-panel rounded-[36px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                Inside the studio
              </div>
              <h2 className="mt-3 text-[2rem] text-white sm:text-[2.35rem]">
                Built around how people actually study medicine
              </h2>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 sm:block">
              7 linked modules
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-[26px] border border-white/10 bg-white/8 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                    Review layer
                  </div>
                  <div className="mt-2 font-heading text-[1.45rem] text-white">
                    Explorer + Glossary
                  </div>
                </div>
                <div className="metric-chip bg-white/10 text-white dark:bg-white/10">
                  <strong>{stats.conditions}</strong>
                  conditions
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Dense, reference-first surfaces for condition review,
                morphology, differentials, and terminology.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/7 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Practice loop
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-white/10">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Trainer</div>
                    <div className="text-sm text-white/65">
                      High-frequency image drills
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/7 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Clinical reasoning
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-white/10">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Cases</div>
                    <div className="text-sm text-white/65">
                      Scenario-based feedback
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/8 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
                  Simulation layer
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
                  Analytics layer
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Procedural modules and a progress dashboard close the loop so
                practice leads to targeted review instead of random repetition.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 flex flex-wrap gap-3">
        {[
          "Publishable-quality visual hierarchy",
          "Responsive teaching flows",
          "Case reasoning + morphology in one system",
          "Educational only, not for patient care",
        ].map((item) => (
          <div key={item} className="metric-chip">
            <span>{item}</span>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow">Learning system</div>
            <h2 className="mt-4 text-foreground">A full-stack med-ed toolkit</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Every module is designed to feel like part of one environment,
            whether the learner is scanning images, solving cases, or reviewing
            weak concepts.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          {modules.map(
            ({
              href,
              title,
              description,
              icon: Icon,
              metricKey,
              metricLabel,
              accent,
              span,
            }) => {
              const metric = metricKey ? moduleMetrics[metricKey] : null;
              return (
                <Link
                  key={href}
                  href={href}
                  className={span}
                >
                  <div className="surface-panel card-hover relative h-full overflow-hidden rounded-[32px] p-5 sm:p-6">
                    <div
                      className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${accent} opacity-80`}
                    />
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-foreground text-background shadow-[0_16px_30px_rgba(18,36,60,0.16)] dark:bg-white dark:text-[#10233f]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="mt-8">
                        <h3 className="text-foreground">{title}</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {description}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <div className="metric-chip">
                          <strong>{metric ?? "Live"}</strong>
                          {metricLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="ink-panel rounded-[34px] px-6 py-7 sm:px-7">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
            Learning pathway
          </div>
          <h2 className="mt-4 text-[2rem] text-white sm:text-[2.5rem]">
            Designed to move from description to decision-making
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
            The strongest med-ed interfaces do not just look better. They make
            the next cognitive step obvious. This studio is organized around
            that principle.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {learningSteps.map(({ number, title, description, icon: Icon }) => (
            <div
              key={number}
              className="surface-panel rounded-[30px] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-extrabold tracking-[0.2em] text-muted-foreground">
                  {number}
                </div>
              </div>
              <h3 className="mt-6 text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[34px] border border-amber-200 bg-amber-50/80 px-6 py-5 shadow-[0_18px_40px_rgba(155,110,35,0.08)] dark:border-amber-900/60 dark:bg-amber-950/22">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="max-w-3xl text-sm leading-7 text-amber-900 dark:text-amber-200">
              DermEd Studio is an educational tool only. It is intended to
              support study, pattern recognition, and structured practice, not
              diagnosis or direct clinical decision-making.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="secondary">
              View your dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
