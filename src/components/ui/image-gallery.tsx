"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatasetImage } from "@/components/ui/dataset-image";
import { ImageLightbox } from "@/components/ui/image-lightbox";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GalleryImageItem {
  id: string;
  src: string;
  alt: string;
  source?: string;
  bodySite?: string;
  skinTone?: string;
  diagnosis?: string;
}

interface ImageGalleryProps {
  images: GalleryImageItem[];
  columns?: 2 | 3 | 4;
  enableFilters?: boolean;
  maxImages?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uniqueValues(items: GalleryImageItem[], key: keyof GalleryImageItem): string[] {
  const set = new Set<string>();
  for (const item of items) {
    const v = item[key];
    if (typeof v === "string" && v) set.add(v);
  }
  return Array.from(set).sort();
}

// ---------------------------------------------------------------------------
// Filter chip
// ---------------------------------------------------------------------------

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Column class map
// ---------------------------------------------------------------------------

const COLUMN_CLASSES: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageGallery({
  images,
  columns = 3,
  enableFilters = false,
  maxImages,
}: ImageGalleryProps) {
  // -------------------------------------------------------------------------
  // Filter state
  // -------------------------------------------------------------------------

  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [bodySiteFilter, setBodySiteFilter] = useState<string | null>(null);
  const [skinToneFilter, setSkinToneFilter] = useState<string | null>(null);

  // Derived filter values
  const sources = useMemo(() => uniqueValues(images, "source"), [images]);
  const bodySites = useMemo(() => uniqueValues(images, "bodySite"), [images]);
  const skinTones = useMemo(() => uniqueValues(images, "skinTone"), [images]);

  // Filtered images
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      if (sourceFilter && img.source !== sourceFilter) return false;
      if (bodySiteFilter && img.bodySite !== bodySiteFilter) return false;
      if (skinToneFilter && img.skinTone !== skinToneFilter) return false;
      return true;
    });
  }, [images, sourceFilter, bodySiteFilter, skinToneFilter]);

  const hasActiveFilters = sourceFilter || bodySiteFilter || skinToneFilter;

  // -------------------------------------------------------------------------
  // Show-more state
  // -------------------------------------------------------------------------

  const [expanded, setExpanded] = useState(false);
  const displayLimit = maxImages && !expanded ? maxImages : filteredImages.length;
  const visibleImages = filteredImages.slice(0, displayLimit);
  const hiddenCount = filteredImages.length - visibleImages.length;

  // -------------------------------------------------------------------------
  // Lightbox state
  // -------------------------------------------------------------------------

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxOpen = lightboxIndex !== null;
  const lightboxImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  const openLightbox = useCallback(
    (imageId: string) => {
      const idx = filteredImages.findIndex((img) => img.id === imageId);
      if (idx >= 0) setLightboxIndex(idx);
    },
    [filteredImages]
  );

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null && i < filteredImages.length - 1 ? i + 1 : i
    );
  }, [filteredImages.length]);

  // -------------------------------------------------------------------------
  // Lazy loading via IntersectionObserver
  // -------------------------------------------------------------------------

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + 12, visibleImages.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleImages.length]);

  const lazyVisible = visibleImages.slice(0, visibleCount);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const colClass = COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[3];

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      {enableFilters && (sources.length > 1 || bodySites.length > 1 || skinTones.length > 1) && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSourceFilter(null);
                  setBodySiteFilter(null);
                  setSkinToneFilter(null);
                }}
                className="ml-1 text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Source filters */}
            {sources.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Source:
                </span>
                {sources.map((s) => (
                  <FilterChip
                    key={s}
                    label={s}
                    active={sourceFilter === s}
                    onClick={() =>
                      setSourceFilter((cur) => (cur === s ? null : s))
                    }
                  />
                ))}
              </div>
            )}

            {/* Body site filters */}
            {bodySites.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Body site:
                </span>
                {bodySites.map((s) => (
                  <FilterChip
                    key={s}
                    label={s}
                    active={bodySiteFilter === s}
                    onClick={() =>
                      setBodySiteFilter((cur) => (cur === s ? null : s))
                    }
                  />
                ))}
              </div>
            )}

            {/* Skin tone filters */}
            {skinTones.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Skin tone:
                </span>
                {skinTones.map((s) => (
                  <FilterChip
                    key={s}
                    label={s}
                    active={skinToneFilter === s}
                    onClick={() =>
                      setSkinToneFilter((cur) => (cur === s ? null : s))
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image counter */}
      <div className="text-sm text-muted-foreground">
        Showing {visibleImages.length} of {filteredImages.length} image{filteredImages.length !== 1 ? "s" : ""}
        {hasActiveFilters && ` (${images.length} total)`}
      </div>

      {/* Grid */}
      {visibleImages.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed py-12 text-sm text-muted-foreground">
          No images match the current filters.
        </div>
      ) : (
        <div className={cn("grid gap-4", colClass)}>
          {lazyVisible.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-lg border bg-background"
            >
              <button
                type="button"
                onClick={() => openLightbox(img.id)}
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <DatasetImage
                  src={img.src}
                  alt={img.alt}
                  className="h-48 w-full"
                  size="full"
                  source={img.source}
                  bodySite={img.bodySite}
                  skinTone={img.skinTone}
                  diagnosis={img.diagnosis}
                  showMetadata
                  enableLightbox={false}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lazy-load sentinel */}
      {visibleCount < visibleImages.length && (
        <div ref={sentinelRef} className="h-1" />
      )}

      {/* Show more button */}
      {hiddenCount > 0 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ChevronDown className="h-4 w-4" />
            Show {hiddenCount} more image{hiddenCount !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          key={lightboxImage.id}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          source={lightboxImage.source}
          bodySite={lightboxImage.bodySite}
          skinTone={lightboxImage.skinTone}
          diagnosis={lightboxImage.diagnosis}
          onPrev={goToPrev}
          onNext={goToNext}
          hasPrev={lightboxIndex !== null && lightboxIndex > 0}
          hasNext={
            lightboxIndex !== null &&
            lightboxIndex < filteredImages.length - 1
          }
          counter={
            lightboxIndex !== null
              ? `${lightboxIndex + 1} of ${filteredImages.length}`
              : undefined
          }
        />
      )}
    </div>
  );
}
