"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import type { SimulationModule } from "@/data/simulation-modules";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  RotateCcw,
  MousePointerClick,
  Trophy,
  Eye,
  ArrowLeft,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SVG_WIDTH = 500;
const SVG_HEIGHT = 400;

const QUALITY_COLORS: Record<
  string,
  { fill: string; stroke: string; label: string; bg: string; dot: string }
> = {
  ideal: {
    fill: "rgba(16, 185, 129, 0.25)",
    stroke: "#10b981",
    label: "Ideal",
    bg: "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20",
    dot: "bg-emerald-500",
  },
  acceptable: {
    fill: "rgba(245, 158, 11, 0.25)",
    stroke: "#f59e0b",
    label: "Acceptable",
    bg: "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20",
    dot: "bg-amber-500",
  },
  poor: {
    fill: "rgba(249, 115, 22, 0.25)",
    stroke: "#f97316",
    label: "Poor",
    bg: "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/20",
    dot: "bg-orange-500",
  },
  dangerous: {
    fill: "rgba(239, 68, 68, 0.25)",
    stroke: "#ef4444",
    label: "Dangerous",
    bg: "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/20",
    dot: "bg-red-500",
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TargetSelectorProps {
  module: SimulationModule;
}

interface ClickResult {
  x: number;
  y: number;
  zone: NonNullable<SimulationModule["targetZones"]>[number] | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pointInZone(
  x: number,
  y: number,
  zone: NonNullable<SimulationModule["targetZones"]>[number],
): boolean {
  const { region } = zone;
  if (region.type === "circle") {
    const [cx, cy] = region.coordinates;
    const r = region.radiusPx ?? 30;
    return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) <= r;
  }
  const [rx, ry, rw, rh] = region.coordinates;
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TargetSelector({ module }: TargetSelectorProps) {
  const zones = useMemo(() => module.targetZones ?? [], [module.targetZones]);
  const svgRef = useRef<SVGSVGElement>(null);

  const [clickResult, setClickResult] = useState<ClickResult | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [bestQuality, setBestQuality] = useState<string | null>(null);
  const [flashZone, setFlashZone] = useState<string | null>(null);

  const submitted = clickResult !== null;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (revealed) return;

      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const scaleX = SVG_WIDTH / rect.width;
      const scaleY = SVG_HEIGHT / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const sortedZones = [...zones].sort((a, b) => {
        const order: Record<string, number> = {
          ideal: 0,
          acceptable: 1,
          poor: 2,
          dangerous: 3,
        };
        return (order[a.quality] ?? 4) - (order[b.quality] ?? 4);
      });

      let hitZone: (typeof zones)[number] | null = null;
      for (const zone of sortedZones) {
        if (pointInZone(x, y, zone)) {
          hitZone = zone;
          break;
        }
      }

      const result: ClickResult = { x, y, zone: hitZone };
      setClickResult(result);
      setAttempts((a) => a + 1);

      // Flash the zone 3 times
      if (hitZone) {
        setFlashZone(hitZone.id);
        setTimeout(() => setFlashZone(null), 1200);

        const qualityRank: Record<string, number> = {
          ideal: 4,
          acceptable: 3,
          poor: 2,
          dangerous: 1,
        };
        const currentBestRank = bestQuality
          ? qualityRank[bestQuality] ?? 0
          : 0;
        const newRank = qualityRank[hitZone.quality] ?? 0;
        if (newRank > currentBestRank) {
          setBestQuality(hitZone.quality);
        }
      }
    },
    [zones, revealed, bestQuality],
  );

  const handleRetry = useCallback(() => {
    setClickResult(null);
    setFlashZone(null);
  }, []);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleFullReset = useCallback(() => {
    setClickResult(null);
    setRevealed(false);
    setAttempts(0);
    setBestQuality(null);
    setFlashZone(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const resultColor = clickResult?.zone
    ? QUALITY_COLORS[clickResult.zone.quality]
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Target className="h-4 w-4" />
          </div>
          <Badge variant="outline" className="rounded-full">
            Target Selection
          </Badge>
          <DifficultyBadge difficulty={module.difficulty} />
        </div>
        <h1 className="text-2xl font-bold">{module.title}</h1>
      </div>

      {/* Case stem card */}
      <Card className="shadow-card rounded-xl">
        <CardHeader>
          <CardTitle>Clinical Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-[1.7]">{module.caseStem}</p>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground shadow-card">
        <MousePointerClick className="h-4 w-4 shrink-0 text-primary" />
        <span>
          {revealed
            ? "All target zones revealed below."
            : submitted
              ? "Your selection is shown. Retry or reveal all zones."
              : "Click where you would perform the biopsy."}
        </span>
      </div>

      {/* Interactive SVG viewport */}
      <Card className="overflow-hidden shadow-card rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-xl">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className={`w-full ${!revealed && !submitted ? "cursor-crosshair" : ""}`}
              onClick={handleSvgClick}
              role="img"
              aria-label="Lesion diagram - click to select biopsy target"
            >
              {/* Background - realistic skin-tone radial gradient */}
              <defs>
                <radialGradient id="skinGrad" cx="50%" cy="50%" r="80%">
                  <stop offset="0%" stopColor="#f5e0cc" />
                  <stop offset="30%" stopColor="#f0d5bd" />
                  <stop offset="60%" stopColor="#e8c9ad" />
                  <stop offset="100%" stopColor="#ddb99a" />
                </radialGradient>
                <radialGradient id="lesionGrad" cx="45%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#c4956a" />
                  <stop offset="40%" stopColor="#b8856a" />
                  <stop offset="100%" stopColor="#d4a574" />
                </radialGradient>
                <filter
                  id="lesionShadow"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                  <feOffset dx="0" dy="2" />
                  <feComposite
                    in2="SourceAlpha"
                    operator="arithmetic"
                    k2={-1}
                    k3={1}
                  />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="skinTexture">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.5"
                    numOctaves={3}
                    result="noise"
                  />
                  <feColorMatrix
                    type="saturate"
                    values="0"
                    in="noise"
                    result="grayNoise"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="grayNoise"
                    mode="soft-light"
                  />
                </filter>
              </defs>

              <rect
                x="0"
                y="0"
                width={SVG_WIDTH}
                height={SVG_HEIGHT}
                fill="url(#skinGrad)"
                filter="url(#skinTexture)"
              />

              {/* Irregular lesion shape */}
              <path
                d="M 250,120 C 310,100 380,130 390,200 C 400,260 360,310 300,320 C 260,330 210,320 180,290 C 140,250 120,200 140,160 C 155,130 200,110 250,120 Z"
                fill="url(#lesionGrad)"
                opacity="0.7"
                filter="url(#lesionShadow)"
              />

              {/* Inner darker area */}
              <path
                d="M 260,160 C 310,150 350,170 340,220 C 335,260 300,280 265,275 C 230,270 200,240 205,200 C 210,170 230,155 260,160 Z"
                fill="#a87854"
                opacity="0.5"
              />

              {/* Edge dots */}
              <circle cx="170" cy="180" r="3" fill="#c98a5f" opacity="0.4" />
              <circle cx="360" cy="230" r="4" fill="#c98a5f" opacity="0.3" />
              <circle cx="220" cy="300" r="3" fill="#b87a5f" opacity="0.4" />
              <circle cx="330" cy="160" r="2.5" fill="#b87a5f" opacity="0.3" />

              {/* Zone flash highlight (invisible zones until clicked) */}
              {flashZone &&
                zones
                  .filter((z) => z.id === flashZone)
                  .map((zone) => {
                    const colors = QUALITY_COLORS[zone.quality];
                    if (zone.region.type === "circle") {
                      const [cx, cy] = zone.region.coordinates;
                      const r = zone.region.radiusPx ?? 30;
                      return (
                        <circle
                          key={`flash-${zone.id}`}
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill={colors.fill}
                          stroke={colors.stroke}
                          strokeWidth="3"
                          className="animate-flash-3"
                        />
                      );
                    }
                    const [rx, ry, rw, rh] = zone.region.coordinates;
                    return (
                      <rect
                        key={`flash-${zone.id}`}
                        x={rx}
                        y={ry}
                        width={rw}
                        height={rh}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="3"
                        className="animate-flash-3"
                      />
                    );
                  })}

              {/* Zone labels (when revealed) */}
              {revealed &&
                zones.map((zone) => {
                  const colors = QUALITY_COLORS[zone.quality];
                  if (zone.region.type === "circle") {
                    const [cx, cy] = zone.region.coordinates;
                    const r = zone.region.radiusPx ?? 30;
                    return (
                      <g key={zone.id}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill={colors.fill}
                          stroke={colors.stroke}
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        <text
                          x={cx}
                          y={cy - r - 6}
                          textAnchor="middle"
                          fill={colors.stroke}
                          fontSize="11"
                          fontWeight="600"
                        >
                          {zone.label}
                        </text>
                      </g>
                    );
                  }
                  const [rx, ry, rw, rh] = zone.region.coordinates;
                  return (
                    <g key={zone.id}>
                      <rect
                        x={rx}
                        y={ry}
                        width={rw}
                        height={rh}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <text
                        x={rx + rw / 2}
                        y={ry - 6}
                        textAnchor="middle"
                        fill={colors.stroke}
                        fontSize="11"
                        fontWeight="600"
                      >
                        {zone.label}
                      </text>
                    </g>
                  );
                })}

              {/* User click marker */}
              {clickResult && (
                <g>
                  <circle
                    cx={clickResult.x}
                    cy={clickResult.y}
                    r="10"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={clickResult.x}
                    cy={clickResult.y}
                    r="3"
                    fill="#0d9488"
                  />
                  <line
                    x1={clickResult.x - 16}
                    y1={clickResult.y}
                    x2={clickResult.x + 16}
                    y2={clickResult.y}
                    stroke="#0d9488"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={clickResult.x}
                    y1={clickResult.y - 16}
                    x2={clickResult.x}
                    y2={clickResult.y + 16}
                    stroke="#0d9488"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </svg>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-end gap-2">
          {submitted && !revealed && (
            <>
              <Button variant="outline" onClick={handleRetry}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button variant="secondary" onClick={handleReveal}>
                <Eye className="mr-2 h-4 w-4" />
                Reveal All Zones
              </Button>
            </>
          )}
          {revealed && (
            <Button variant="outline" onClick={handleFullReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Zone legend -- always visible, colored dots */}
      <Card className="shadow-card rounded-xl">
        <CardHeader>
          <CardTitle className="text-sm">Zone Quality Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(QUALITY_COLORS).map(([key, colors]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className={`h-3.5 w-3.5 rounded-full shadow-sm ${colors.dot}`}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {colors.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result feedback */}
      {submitted && (
        <Card className="animate-in fade-in duration-300 shadow-card rounded-xl">
          <CardContent className="flex flex-col gap-4 pt-6">
            {clickResult.zone ? (
              <div className={`rounded-xl border p-4 ${resultColor?.bg}`}>
                <div className="mb-2 flex items-center gap-2">
                  <Badge
                    variant={
                      clickResult.zone.quality === "ideal"
                        ? "default"
                        : clickResult.zone.quality === "acceptable"
                          ? "secondary"
                          : "destructive"
                    }
                    className="rounded-full"
                  >
                    {resultColor?.label}
                  </Badge>
                  <span className="text-sm font-semibold">
                    {clickResult.zone.label}
                  </span>
                </div>
                <p className="text-sm leading-[1.7]">
                  {clickResult.zone.explanation}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-muted bg-muted/30 p-4">
                <p className="font-semibold">Outside target area</p>
                <p className="text-sm text-muted-foreground">
                  Your click did not land within any defined target zone. Try
                  again and aim for a specific region of the lesion or
                  surrounding skin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All zones revealed */}
      {revealed && (
        <Card className="animate-in fade-in duration-300 shadow-card rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm">All Target Zones</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {zones.map((zone, i) => {
              const colors = QUALITY_COLORS[zone.quality];
              return (
                <div
                  key={zone.id}
                  className={`animate-stagger-in rounded-xl border p-3 shadow-sm ${colors.bg}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <div
                      className={`h-3.5 w-3.5 rounded-full shadow-sm ${colors.dot}`}
                    />
                    <Badge
                      variant={
                        zone.quality === "ideal"
                          ? "default"
                          : zone.quality === "acceptable"
                            ? "secondary"
                            : "destructive"
                      }
                      className="rounded-full text-xs"
                    >
                      {colors.label}
                    </Badge>
                    <span className="text-sm font-medium">{zone.label}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {zone.explanation}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Overall explanation */}
      {revealed && (
        <>
          <Separator />
          <Card className="shadow-card rounded-xl">
            <CardContent className="pt-6">
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm dark:border-teal-800 dark:bg-teal-950/20">
                <p className="mb-1 font-semibold text-teal-800 dark:text-teal-300">
                  Key Teaching Point
                </p>
                <p className="leading-[1.7] text-teal-700 dark:text-teal-200">
                  {module.explanation}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Score */}
      {revealed && (
        <Card className="shadow-card rounded-xl">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-4">
              <Trophy className="h-8 w-8 text-amber-500" />
              <div className="text-center">
                <div className="text-2xl font-bold">
                  Your best:{" "}
                  {bestQuality
                    ? QUALITY_COLORS[bestQuality]?.label ?? "Unknown"
                    : "No hit"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {attempts} attempt{attempts !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Retry / back */}
      {revealed && (
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={handleFullReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Link href="/simulation">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lab
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-component
// ---------------------------------------------------------------------------

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config: Record<string, { label: string; className: string }> = {
    beginner: {
      label: "Beginner",
      className:
        "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    intermediate: {
      label: "Intermediate",
      className:
        "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    },
    advanced: {
      label: "Advanced",
      className:
        "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300",
    },
  };
  const diff = config[difficulty] ?? config.intermediate;
  return (
    <Badge
      variant="outline"
      className={`rounded-full text-xs ${diff.className}`}
    >
      {diff.label}
    </Badge>
  );
}
