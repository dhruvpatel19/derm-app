"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon-sm" aria-label="Toggle theme">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle theme"
        aria-expanded={open}
        className="relative border-white/50 bg-white/50 dark:bg-white/6"
      >
        <Sun
          className={cn(
            "h-4 w-4 transition-all duration-300",
            resolvedTheme === "dark"
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
          style={{ position: "absolute" }}
        />
        <Moon
          className={cn(
            "h-4 w-4 transition-all duration-300",
            resolvedTheme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
          style={{ position: "absolute" }}
        />
      </Button>

      {open && (
        <div className="surface-panel animate-scale-in absolute right-0 top-full z-50 mt-3 w-40 rounded-[22px] p-2 text-popover-foreground">
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-[16px] px-3 py-2 text-sm transition-colors",
                theme === value
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
