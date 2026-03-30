"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type {
  MorphologyTerm,
  MorphologyTermCategory,
} from "@/lib/domain/schemas";
import {
  ArrowRight,
  BookOpenText,
  Brain,
  Lightbulb,
  Search,
} from "lucide-react";
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

function TermListItem({
  term,
  active,
  onSelect,
}: {
  term: MorphologyTerm;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-[22px] border p-4 text-left transition-all duration-150",
        active
          ? "border-primary bg-primary/8 shadow-[0_20px_40px_rgba(24,98,96,0.12)]"
          : "border-white/55 bg-white/52 hover:-translate-y-0.5 hover:shadow-card-hover dark:border-white/8 dark:bg-white/5"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={categoryStyles[term.category].chip}>
          {categoryLabels[term.category]}
        </Badge>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {term.term[0].toUpperCase()}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{term.term}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {term.definition}
      </p>
    </button>
  );
}

function TermDetailPanel({
  term,
  allTerms,
  onSelectTerm,
}: {
  term: MorphologyTerm;
  allTerms: MorphologyTerm[];
  onSelectTerm: (termId: string) => void;
}) {
  const relatedTerms = (term.relatedTerms ?? [])
    .map((id) => allTerms.find((candidate) => candidate.id === id))
    .filter(Boolean) as MorphologyTerm[];
  const style = categoryStyles[term.category];

  return (
    <article className="surface-panel relative overflow-hidden rounded-[32px] p-6 sm:p-7">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-28 bg-gradient-to-br opacity-90",
          style.tint
        )}
      />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className={style.chip}>{categoryLabels[term.category]}</Badge>
            <h2 className="mt-4 text-foreground">{term.term}</h2>
          </div>
          <div className="rounded-full border border-white/55 bg-white/60 px-4 py-2 text-sm font-semibold text-muted-foreground dark:border-white/8 dark:bg-white/6">
            Morphology reference
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground">
          {term.definition}
        </p>

        {term.mnemonic && (
          <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
              <Lightbulb className="h-3.5 w-3.5" />
              Memory hook
            </div>
            <p className="mt-2 text-sm italic leading-7 text-amber-800 dark:text-amber-200">
              {term.mnemonic}
            </p>
          </div>
        )}

        {term.confusionPoints && term.confusionPoints.length > 0 && (
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Distinguish from
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {term.confusionPoints.map((confusionPoint, index) => (
                <div
                  key={`${confusionPoint.confusedWith}-${index}`}
                  className="rounded-[22px] border border-white/55 bg-white/52 px-4 py-4 dark:border-white/8 dark:bg-white/5"
                >
                  <p className="text-sm font-semibold text-foreground">
                    vs {confusionPoint.confusedWith}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {confusionPoint.distinction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedTerms.length > 0 && (
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Related terms
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTerms.map((relatedTerm) => (
                <button
                  key={relatedTerm.id}
                  type="button"
                  onClick={() => onSelectTerm(relatedTerm.id)}
                  className="rounded-full border border-primary/18 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {relatedTerm.term}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 grid gap-4 border-t border-white/55 pt-5 dark:border-white/8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-[22px] border border-white/55 bg-white/52 px-4 py-4 dark:border-white/8 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <BookOpenText className="h-3.5 w-3.5 text-primary" />
              How to use this term
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Use this descriptor when you want your lesion description to be precise, reproducible, and useful for narrowing a differential.
            </p>
          </div>

          <Link
            href="/trainer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[0_16px_30px_rgba(18,36,60,0.14)] transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-[#10233f]"
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
  const [selectedTermId, setSelectedTermId] = useState<string | null>(
    morphologyTerms[0]?.id ?? null
  );

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

  const effectiveSelectedTermId =
    selectedTermId && filtered.some((term) => term.id === selectedTermId)
      ? selectedTermId
      : filtered[0]?.id ?? null;

  const selectedTerm =
    filtered.find((term) => term.id === effectiveSelectedTermId) ?? null;

  const activeLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const term of filtered) {
      letters.add(term.term[0].toUpperCase());
    }
    return letters;
  }, [filtered]);

  const jumpToLetter = useCallback(
    (letter: string) => {
      const target = filtered.find(
        (term) => term.term[0].toUpperCase() === letter
      );
      if (!target) return;
      setSelectedTermId(target.id);
    },
    [filtered]
  );

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <section className="surface-panel rounded-[30px] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Search the language
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search term or definition"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11"
            />
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Browse the vocabulary of lesion description without getting buried in a giant page.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[20px] border border-white/55 bg-white/52 px-4 py-3 dark:border-white/8 dark:bg-white/5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Showing
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {filtered.length} terms
              </div>
            </div>
            <div className="rounded-[20px] border border-white/55 bg-white/52 px-4 py-3 dark:border-white/8 dark:bg-white/5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Focus
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {selectedTerm ? selectedTerm.term : "No match"}
              </div>
            </div>
            <div className="rounded-[20px] border border-white/55 bg-white/52 px-4 py-3 dark:border-white/8 dark:bg-white/5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Mode
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                Reference atlas
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
            {presentCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(29,126,120,0.22)]"
                    : "border border-white/55 bg-white/48 text-muted-foreground hover:text-foreground dark:border-white/6 dark:bg-white/4"
                )}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </section>

        <section className="surface-panel rounded-[30px] p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            A-Z jump
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALPHABET.map((letter) => {
              const enabled = activeLetters.has(letter);
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => enabled && jumpToLetter(letter)}
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

          <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {filtered.map((term) => (
              <TermListItem
                key={term.id}
                term={term}
                active={term.id === selectedTerm?.id}
                onSelect={() => setSelectedTermId(term.id)}
              />
            ))}
          </div>
        </section>
      </aside>

      <main>
        {selectedTerm ? (
          <TermDetailPanel
            term={selectedTerm}
            allTerms={morphologyTerms}
            onSelectTerm={setSelectedTermId}
          />
        ) : (
          <div className="surface-panel rounded-[30px] px-6 py-14 text-center">
            <p className="font-heading text-2xl text-foreground">
              No glossary terms match that search.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Try a broader keyword or switch back to all concept groups.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
