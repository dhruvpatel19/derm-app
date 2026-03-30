"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Crosshair,
  FileText,
  Menu,
  Microscope,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/explorer", label: "Explorer", icon: BookOpen },
  { href: "/glossary", label: "Glossary", icon: Microscope },
  { href: "/trainer", label: "Trainer", icon: Brain },
  { href: "/cases", label: "Cases", icon: FileText },
  { href: "/simulation", label: "Simulation", icon: Crosshair },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 px-0 pt-4">
        <div className="page-shell">
          <div className="surface-panel flex items-center justify-between gap-4 rounded-[30px] px-4 py-3 sm:px-5">
            <Link
              href="/"
              className="group flex min-w-0 items-center gap-3 rounded-[20px] pr-2"
            >
              <div className="ink-panel flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-heading text-[1.2rem] leading-none text-foreground">
                  DermEd Studio
                </div>
                <div className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Dermatology learning workspace
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-white/55 bg-white/45 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] lg:flex dark:border-white/6 dark:bg-white/4">
              {navItems.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[0.84rem] font-semibold text-muted-foreground",
                      active
                        ? "bg-foreground text-background shadow-[0_14px_30px_rgba(18,36,60,0.16)]"
                        : "hover:bg-white/65 hover:text-foreground dark:hover:bg-white/7"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/52 px-3 py-2 text-xs font-semibold text-muted-foreground xl:flex dark:border-white/6 dark:bg-white/4">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                Progress synced locally
              </div>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <div className="hidden md:block">
                <Link href="/trainer">
                  <Button size="sm">Resume learning</Button>
                </Link>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-[16px] border border-white/55 bg-white/55 p-2 text-muted-foreground lg:hidden dark:border-white/6 dark:bg-white/5"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#08111d]/55 backdrop-blur-md"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute inset-x-4 top-4 animate-scale-in">
            <div className="surface-panel-strong rounded-[30px] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="ink-panel flex h-10 w-10 items-center justify-center rounded-[16px]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-heading text-lg text-foreground">
                      DermEd Studio
                    </div>
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Learn, compare, reason
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-[16px] border border-white/60 bg-white/60 p-2 text-muted-foreground dark:border-white/6 dark:bg-white/5"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 grid gap-2">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const active = isActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-[22px] border px-4 py-3",
                        active
                          ? "border-primary/25 bg-primary/10 text-primary"
                          : "border-white/55 bg-white/45 text-foreground dark:border-white/7 dark:bg-white/4"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-foreground/6 dark:bg-white/7">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold">{label}</div>
                          <div className="text-xs text-muted-foreground">
                            Open {label.toLowerCase()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] border border-white/50 bg-white/42 px-4 py-3 dark:border-white/7 dark:bg-white/4">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Appearance
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Light, dark, or system
                  </div>
                </div>
                <ThemeToggle />
              </div>

              <div className="mt-4">
                <Link href="/trainer" onClick={() => setDrawerOpen(false)}>
                  <Button className="w-full">Resume learning</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
