"use client";

import { useState, useCallback, useRef } from "react";
import {
  Camera,
  ZoomIn,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "@/components/ui/image-lightbox";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DatasetImageProps {
  src: string | null;
  alt: string;
  className?: string;
  /** @deprecated Use showMetadata instead */
  showAltOnError?: boolean;
  // Metadata
  source?: string; // "SCIN" | "PAD-UFES-20" | "Seed"
  bodySite?: string;
  skinTone?: string;
  diagnosis?: string;
  // Features
  enableZoom?: boolean;
  enableLightbox?: boolean;
  showMetadata?: boolean;
  aspectRatio?: "square" | "video" | "auto";
  size?: "sm" | "md" | "lg" | "full";
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIZE_MAP: Record<string, string> = {
  sm: "max-w-[150px]",
  md: "max-w-[300px]",
  lg: "max-w-[450px]",
  full: "w-full",
};

const ASPECT_MAP: Record<string, string> = {
  square: "aspect-square",
  video: "aspect-video",
  auto: "",
};

// ---------------------------------------------------------------------------
// Shimmer keyframes (injected once via a style element)
// ---------------------------------------------------------------------------

const SHIMMER_STYLE_ID = "dataset-image-shimmer";

function ensureShimmerStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(SHIMMER_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = SHIMMER_STYLE_ID;
  style.textContent = `
    @keyframes dataset-image-shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DatasetImage({
  src,
  alt,
  className,
  showAltOnError = true,
  source,
  bodySite,
  skinTone,
  diagnosis,
  enableZoom = true,
  enableLightbox = true,
  showMetadata = false,
  aspectRatio = "auto",
  size = "md",
}: DatasetImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inject shimmer CSS once
  if (typeof window !== "undefined") {
    ensureShimmerStyle();
  }

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
  }, []);

  const handleClick = useCallback(() => {
    if (enableLightbox && src && !error) {
      setLightboxOpen(true);
    }
  }, [enableLightbox, src, error]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  // -------------------------------------------------------------------------
  // Size class
  // -------------------------------------------------------------------------

  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md;
  const aspectClass = ASPECT_MAP[aspectRatio] ?? "";

  // -------------------------------------------------------------------------
  // Error state -- clean card with alt text
  // -------------------------------------------------------------------------

  if (!src || error) {
    if (showAltOnError) {
      return (
        <div
          className={cn(
            "flex items-center justify-center rounded-xl border border-border bg-gradient-to-br from-muted/60 to-muted/30 p-6",
            aspectClass,
            size !== "full" && sizeClass,
            className
          )}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Camera className="h-5 w-5 text-muted-foreground/60" />
            </div>
            <p className="max-w-[220px] text-sm italic leading-relaxed text-muted-foreground">
              {alt}
            </p>
            {error && (
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <RotateCcw className="h-3 w-3" />
                Load Image
              </button>
            )}
          </div>
        </div>
      );
    }
    return null;
  }

  // -------------------------------------------------------------------------
  // Metadata badges
  // -------------------------------------------------------------------------

  const hasMetadata = showMetadata && (source || bodySite || skinTone);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <>
      <div
        ref={containerRef}
        role={enableLightbox ? "button" : undefined}
        tabIndex={enableLightbox ? 0 : undefined}
        aria-label={enableLightbox ? `View ${alt} in fullscreen` : undefined}
        onClick={handleClick}
        onKeyDown={enableLightbox ? handleKeyDown : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "group relative overflow-hidden rounded-xl",
          enableLightbox && "cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          aspectClass,
          size !== "full" && sizeClass,
          className
        )}
      >
        {/* Loading skeleton with gradient shimmer sweep */}
        {loading && (
          <div
            className="absolute inset-0 z-10 rounded-xl"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.08) 50%, hsl(var(--muted)) 75%)",
              backgroundSize: "400px 100%",
              animation: "dataset-image-shimmer 1.5s ease-in-out infinite",
            }}
          />
        )}

        {/* Image -- object-cover, rounded corners, fade-in on load */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={cn(
            "h-full w-full rounded-xl object-cover transition-all duration-300",
            loading ? "opacity-0" : "animate-img-reveal",
            enableZoom && "group-hover:scale-[1.03]"
          )}
          onError={() => setError(true)}
          onLoad={() => setLoading(false)}
          loading="lazy"
          draggable={false}
        />

        {/* Hover overlay with "Click to zoom" text and ZoomIn icon */}
        {enableLightbox && !loading && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-black/0 transition-all duration-200",
              hovered && "bg-black/30"
            )}
          >
            <ZoomIn
              className={cn(
                "h-7 w-7 text-white opacity-0 drop-shadow-md transition-opacity duration-200",
                hovered && "opacity-90"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium text-white opacity-0 drop-shadow-md transition-opacity duration-200",
                hovered && "opacity-90"
              )}
            >
              Click to zoom
            </span>
          </div>
        )}

        {/* Metadata overlay badges */}
        {hasMetadata && !loading && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex flex-wrap gap-1 rounded-b-xl bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-6 opacity-0 transition-opacity duration-200",
              hovered && "opacity-100"
            )}
          >
            {source && (
              <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-800 dark:bg-black/70 dark:text-gray-200">
                {source}
              </span>
            )}
            {bodySite && (
              <span className="inline-flex items-center rounded-full bg-blue-100/90 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-900/70 dark:text-blue-200">
                {bodySite}
              </span>
            )}
            {skinTone && (
              <span className="inline-flex items-center rounded-full bg-amber-100/90 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/70 dark:text-amber-200">
                {skinTone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {enableLightbox && (
        <ImageLightbox
          key={src ?? alt}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          src={src}
          alt={alt}
          source={source}
          bodySite={bodySite}
          skinTone={skinTone}
          diagnosis={diagnosis}
        />
      )}
    </>
  );
}
