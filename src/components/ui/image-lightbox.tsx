"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  // Optional metadata
  source?: string;
  bodySite?: string;
  skinTone?: string;
  diagnosis?: string;
  annotations?: Array<{ label: string; value: string }>;
  // Gallery navigation
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  /** e.g. "3 of 12" */
  counter?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function getTouchDistance(t1: React.Touch, t2: React.Touch) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageLightbox({
  isOpen,
  onClose,
  src,
  alt,
  source,
  bodySite,
  skinTone,
  diagnosis,
  annotations,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  counter,
}: ImageLightboxProps) {
  // State
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  // Refs
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef(0);
  const pinchStartZoom = useRef(1);
  const overlayRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------------------
  // Keyboard handling
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          setZoom((z) => clamp(z + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
          break;
        case "-":
        case "_":
          setZoom((z) => {
            const next = clamp(z - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
            if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
            return next;
          });
          break;
        case "ArrowLeft":
          if (onPrev && hasPrev) onPrev();
          break;
        case "ArrowRight":
          if (onNext && hasNext) onNext();
          break;
        case "0":
          setZoom(MIN_ZOOM);
          setPan({ x: 0, y: 0 });
          break;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // -------------------------------------------------------------------------
  // Zoom helpers
  // -------------------------------------------------------------------------

  const zoomIn = useCallback(() => {
    setZoom((z) => clamp(z + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const next = clamp(z - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  }, []);

  // -------------------------------------------------------------------------
  // Scroll wheel zoom
  // -------------------------------------------------------------------------

  const handleWheel = useCallback((e: ReactWheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP * 0.5 : ZOOM_STEP * 0.5;
    setZoom((z) => {
      const next = clamp(z + delta, MIN_ZOOM, MAX_ZOOM);
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // -------------------------------------------------------------------------
  // Mouse drag-to-pan
  // -------------------------------------------------------------------------

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      if (zoom <= MIN_ZOOM) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { ...pan };
    },
    [zoom, pan]
  );

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({
        x: panStart.current.x + dx,
        y: panStart.current.y + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // -------------------------------------------------------------------------
  // Touch pinch-to-zoom + pan
  // -------------------------------------------------------------------------

  const handleTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      if (e.touches.length === 2) {
        pinchStartDist.current = getTouchDistance(e.touches[0], e.touches[1]);
        pinchStartZoom.current = zoom;
      } else if (e.touches.length === 1 && zoom > MIN_ZOOM) {
        setIsDragging(true);
        dragStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        panStart.current = { ...pan };
      }
    },
    [zoom, pan]
  );

  const handleTouchMove = useCallback(
    (e: ReactTouchEvent) => {
      if (e.touches.length === 2) {
        const dist = getTouchDistance(e.touches[0], e.touches[1]);
        const ratio = dist / pinchStartDist.current;
        const next = clamp(pinchStartZoom.current * ratio, MIN_ZOOM, MAX_ZOOM);
        setZoom(next);
        if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      } else if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;
        setPan({
          x: panStart.current.x + dx,
          y: panStart.current.y + dy,
        });
      }
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // -------------------------------------------------------------------------
  // Don't render when closed
  // -------------------------------------------------------------------------

  if (!isOpen) return null;

  const hasAnyMeta = source || bodySite || skinTone || diagnosis || (annotations && annotations.length > 0);
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${alt}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
      />

      {/* Main container */}
      <div className="relative z-10 flex h-full w-full flex-col">
        {/* ---- Top bar ---- */}
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {counter && (
              <span className="text-sm font-medium text-white/70">
                {counter}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Zoom controls */}
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[3rem] text-center text-xs font-medium text-white/60">
              {zoomPercent}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <div className="mx-2 h-4 w-px bg-white/20" />

            {/* Toggle info panel */}
            {hasAnyMeta && (
              <button
                type="button"
                onClick={() => setShowInfo((v) => !v)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                  showInfo && "bg-white/10 text-white"
                )}
                aria-label="Toggle info panel"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            )}

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ---- Content area ---- */}
        <div className="flex min-h-0 flex-1">
          {/* Prev button */}
          {hasPrev && onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="flex w-12 shrink-0 items-center justify-center text-white/40 transition-colors hover:text-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Image viewport */}
          <div
            className={cn(
              "relative flex-1 overflow-hidden",
              zoom > MIN_ZOOM ? "cursor-grab" : "cursor-default",
              isDragging && "cursor-grabbing"
            )}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex h-full w-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-h-full max-w-full select-none object-contain transition-transform duration-150"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                  willChange: "transform",
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Next button */}
          {hasNext && onNext && (
            <button
              type="button"
              onClick={onNext}
              className="flex w-12 shrink-0 items-center justify-center text-white/40 transition-colors hover:text-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Info panel (right side) */}
          {hasAnyMeta && showInfo && (
            <div className="hidden w-72 shrink-0 overflow-y-auto border-l border-white/10 bg-black/40 px-4 py-4 md:block">
              <h3 className="mb-4 text-sm font-semibold text-white/90">
                Image Details
              </h3>
              <dl className="flex flex-col gap-3">
                {source && (
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                      Source
                    </dt>
                    <dd className="mt-0.5 text-sm text-white/80">{source}</dd>
                  </div>
                )}
                {bodySite && (
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                      Body Site
                    </dt>
                    <dd className="mt-0.5 text-sm text-white/80">
                      {bodySite}
                    </dd>
                  </div>
                )}
                {skinTone && (
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                      Skin Tone
                    </dt>
                    <dd className="mt-0.5 text-sm text-white/80">
                      {skinTone}
                    </dd>
                  </div>
                )}
                {diagnosis && (
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                      Diagnosis
                    </dt>
                    <dd className="mt-0.5 text-sm text-white/80">
                      {diagnosis}
                    </dd>
                  </div>
                )}
                {annotations &&
                  annotations.map((a, i) => (
                    <div key={i}>
                      <dt className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                        {a.label}
                      </dt>
                      <dd className="mt-0.5 text-sm text-white/80">
                        {a.value}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
        </div>

        {/* ---- Bottom metadata (mobile) ---- */}
        {hasAnyMeta && showInfo && (
          <div className="flex shrink-0 flex-wrap gap-2 border-t border-white/10 bg-black/40 px-4 py-3 md:hidden">
            {source && (
              <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80">
                {source}
              </span>
            )}
            {bodySite && (
              <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs text-blue-200">
                {bodySite}
              </span>
            )}
            {skinTone && (
              <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs text-amber-200">
                {skinTone}
              </span>
            )}
            {diagnosis && (
              <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs text-green-200">
                {diagnosis}
              </span>
            )}
            {annotations?.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80"
              >
                {a.label}: {a.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
