"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type {
  MorphologyTerm,
  MorphologyTermCategory,
} from "@/lib/domain/schemas";
import { ArrowRight, Brain, Lightbulb, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categoryLabels: Record<MorphologyTermCategory, string> = {
  primary_lesion: "Primary lesions",
  secondary_lesion: "Secondary lesions",
  surface_change: "Surface changes",
  distribution: "Distribution",
  configuration: "Configuration",
  color: "Color",
};

const categoryOrder: MorphologyTermCategory[] = [
  "primary_lesion",
  "secondary_lesion",
  "surface_change",
  "distribution",
  "configuration",
  "color",
];

const categoryStyles: Record<
  MorphologyTermCategory,
  { chip: string; tint: string }
> = {
  primary_lesion: {
    chip: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200",
    tint: "from-blue-500/20 to-sky-500/6",
  },
  secondary_lesion: {
    chip: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200",
    tint: "from-violet-500/20 to-fuchsia-500/6",
  },
  surface_change: {
    chip: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200",
    tint: "from-amber-500/22 to-yellow-500/6",
  },
  distribution: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200",
    tint: "from-emerald-500/20 to-teal-500/6",
  },
  configuration: {
    chip: "border-pink-200 bg-pink-50 text-pink-800 dark:border-pink-900 dark:bg-pink-950/30 dark:text-pink-200",
    tint: "from-pink-500/20 to-rose-500/6",
  },
  color: {
    chip: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200",
    tint: "from-orange-500/22 to-amber-500/6",
  },
};

interface GlossaryContentProps {
  morphologyTerms: MorphologyTerm[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function TermCard({
  term,
  allTerms,
}: {
  term: MorphologyTerm;
  allTerms: MorphologyTerm[];
}) {
  const relatedTerms = (term.relatedTerms ?? [])
    .map((id) => allTerms.find((candidate) => candidate.id === id))
    .filter(Boolean) as MorphologyTerm[];
  const style = categoryStyles[term.category];

  return (
    <article
      id={`term-${term.id}`}
      className="surface-panel card-hover relative overflow-hidden rounded-[30px] p-5 sm:p-6"
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-20 bg-gradient-to-br opacity-80",
          style.tint
        )}
      />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge className={style.chip}>{categoryLabels[term.category]}</Badge>
            <h3 className="mt-4 text-foreground">{term.term}</h3>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {term.definition}
        </p>

        {term.mnemonic && (
          <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
              <Lightbulb className="h-3.5 w-3.5" />
              Mnemonic
            </div>
            <p className="mt-2 text-sm italic leading-7 text-amber-800 dark:text-amber-200">
              {term.mnemonic}
            </p>
          </div>
        )}

        {term.confusionPoints && term.confusionPoints.length > 0 && (
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Distinguish from
            </div>
            <div className="mt-3 grid gap-2">
              {term.confusionPoints.map((confusionPoint, index) => (
                <div
                  key={`${confusionPoint.confusedWith}-${index}`}
                  className="rounded-[20px] border border-white/55 bg-white/45 px-4 py-3 dark:border-white/7 dark:bg-white/4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    vs {confusionPoint.confusedWith}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    {confusionPoint.distinction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedTerms.length > 0 && (
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Related terms
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTerms.map((relatedTerm) => (
                <a
                  key={relatedTerm.id}
                  href={`#term-${relatedTerm.id}`}
                  className="rounded-full border border-primary/18 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {relatedTerm.term}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-white/55 pt-4 dark:border-white/7">
          <Link
            href="/trainer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Brain className="h-4 w-4" />
            Test this concept in the trainer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GlossaryContent({ morphologyTerms }: GlossaryContentProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const presentCategories = useMemo(() => {
    const categories = new Set(morphologyTerms.map((term) => term.category));
    return categoryOrder.filter((category) => categories.has(category));
  }, [morphologyTerms]);

  const filtered = useMemo(() => {
    return morphologyTerms.filter((term) => {
      const matchesSearch =
        search === "" ||
        term.term.toLowerCase().includes(search.toLowerCase()) ||
        term.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [morphologyTerms, search, selectedCategory]);

  const activeLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const term of filtered) {
      letters.add(term.term[0].toUpperCase());
    }
    return letters;
  }, [filtered]);

  const scrollToLetter = useCallback(
    (letter: string) => {
      const target = filtered.find(
        (term) => term.term[0].toUpperCase() === letter
      );
      if (!target) return;
      document.getElementById(`term-${target.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [filtered]
  );

  const activeCategoryLabel =
    selectedCategory === "all"
      ? "All concept groups"
      : categoryLabels[selectedCategory as MorphologyTermCategory];

  return (
    <div className="mt-6 space-y-6">
      <section className="surface-panel rounded-[32px] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Search the language
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search terms, descriptors, or definitions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-11"
              />
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Use the glossary as a quick-reference atlas for the vocabulary
              that powers skin description and differential thinking.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] border border-white/55 bg-white/45 px-4 py-3 dark:border-white/7 dark:bg-white/4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Showing
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">
                {filtered.length} terms
              </div>
            </div>
            <div className="rounded-[20px] border border-white/55 bg-white/45 px-4 py-3 dark:border-white/7 dark:bg-white/4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Group
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">
                {activeCategoryLabel}
              </div>
            </div>
            <div className="rounded-[20px] border border-white/55 bg-white/45 px-4 py-3 dark:border-white/7 dark:bg-white/4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Quick nav
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">
                A-Z jump list
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold",
              selectedCategory === "all"
                ? "bg-foreground text-background shadow-[0_16px_30px_rgba(18,36,60,0.14)]"
                : "border border-white/55 bg-white/48 text-muted-foreground hover:text-foreground dark:border-white/6 dark:bg-white/4"
            )}
          >
            All groups
          </button>
          {presentCategories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(29,126,120,0.22)]"
                    : "border border-white/55 bg-white/48 text-muted-foreground hover:text-foreground dark:border-white/6 dark:bg-white/4"
                )}
              >
                {categoryLabels[category]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="surface-panel sticky top-24 rounded-[28px] p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {ALPHABET.map((letter) => {
            const enabled = activeLetters.has(letter);
            return (
              <button
                key={letter}
                type="button"
                onClick={() => enabled && scrollToLetter(letter)}
                disabled={!enabled}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                  enabled
                    ? "bg-white/70 text-foreground hover:bg-primary hover:text-primary-foreground dark:bg-white/7"
                    : "cursor-default text-muted-foreground/30"
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="surface-panel rounded-[30px] px-6 py-14 text-center">
          <p className="font-heading text-2xl text-foreground">
            No glossary terms match that search.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Try a broader keyword or switch back to all concept groups.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {filtered.map((term) => (
            <TermCard key={term.id} term={term} allTerms={morphologyTerms} />
          ))}
        </div>
      )}
    </div>
  );
}
