"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DatasetImage } from "@/components/ui/dataset-image";
import { X, ZoomIn } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string | null;
  alt: string;
  bodySite?: string;
  skinTone?: string;
  source: string;
}

interface ConditionImageGalleryProps {
  images: GalleryImage[];
}

export function ConditionImageGallery({ images }: ConditionImageGalleryProps) {
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sources = useMemo(() => {
    const s = new Set(images.map((img) => img.source));
    return Array.from(s).sort();
  }, [images]);

  const filtered = useMemo(() => {
    if (selectedSource === "all") return images;
    return images.filter((img) => img.source === selectedSource);
  }, [images, selectedSource]);

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Source filter pills */}
      {sources.length > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedSource("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedSource === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({images.length})
          </button>
          {sources.map((src) => {
            const count = images.filter((i) => i.source === src).length;
            return (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedSource === src
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {src} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Image count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "image" : "images"}
      </p>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((img, index) => (
          <button
            key={img.id}
            onClick={() => setLightboxIndex(index)}
            className="group/img relative overflow-hidden rounded-xl bg-card text-left shadow-card transition-shadow hover:shadow-card-hover"
          >
            <DatasetImage
              src={img.url}
              alt={img.alt}
              className="h-36 w-full"
            />
            {/* Zoom overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/img:bg-black/20">
              <ZoomIn className="h-6 w-6 text-white opacity-0 transition-opacity group-hover/img:opacity-100" />
            </div>
            {/* Source badge overlay */}
            <div className="absolute left-2 top-2">
              <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                {img.source}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 p-2">
              {img.bodySite && (
                <Badge variant="secondary" className="text-[10px]">
                  {img.bodySite}
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="max-h-[80vh] max-w-[90vw] overflow-hidden rounded-xl bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <DatasetImage
              src={filtered[lightboxIndex].url}
              alt={filtered[lightboxIndex].alt}
              className="max-h-[70vh] w-auto"
            />
            <div className="flex flex-wrap items-center gap-2 border-t p-3">
              <Badge variant="outline">{filtered[lightboxIndex].source}</Badge>
              {filtered[lightboxIndex].bodySite && (
                <Badge variant="secondary">
                  {filtered[lightboxIndex].bodySite}
                </Badge>
              )}
              <span className="ml-auto text-xs text-muted-foreground">
                {lightboxIndex + 1} of {filtered.length}
              </span>
            </div>
          </div>

          {/* Navigation arrows */}
          {filtered.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    lightboxIndex > 0
                      ? lightboxIndex - 1
                      : filtered.length - 1
                  );
                }}
                className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                &larr;
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    lightboxIndex < filtered.length - 1
                      ? lightboxIndex + 1
                      : 0
                  );
                }}
                className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                &rarr;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
