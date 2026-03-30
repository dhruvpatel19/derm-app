import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "surface-panel-strong micro-grid relative overflow-hidden rounded-[34px] px-5 py-6 sm:px-7 sm:py-7",
        className
      )}
    >
      <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-warning/12 blur-3xl" />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="relative mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            {badge && <Badge>{badge}</Badge>}
            <div className="eyebrow">Med-ed module</div>
          </div>
          <h1 className="mt-4 text-[2.4rem] text-foreground sm:text-[3.1rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {actions}
          </div>
        )}
      </div>

      {children && (
        <div className="relative mt-6 border-t border-white/55 pt-5 dark:border-white/7">
          {children}
        </div>
      )}
    </section>
  );
}
