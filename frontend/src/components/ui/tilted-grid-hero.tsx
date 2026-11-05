"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── the curved row ──────────────────────────────────────────────
 * Scroll Tilted Grid turned on its side, with the tilt drawn as a curve.
 * One row of images streams from right to left around the inside of a
 * cylinder. The centre faces you flat, the ends bend toward you so each
 * end image curves along its length, and the ends fade into the page.
 *
 * Slices: 16 strips per tile create smooth curved geometry.
 * Dynamic scroll engine: as the user scrolls down, tiles stream from
 * right to left across the cylinder arc. Once all pieces have been
 * presented and the sequence wraps, scrolling continues down to the
 * next section of the website.
 * ─────────────────────────────────────────────────────────────── */

const SLICES = 16;
const CAMERA = 1.6;

function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

const MAX_WIDTH = 55;

function measure(
  width: number,
  height: number,
  tile: number,
  aspect: number,
  gap: number,
  bend: number,
) {
  const h = Math.min(
    (tile / 100) * height,
    ((MAX_WIDTH / 100) * width) / aspect,
  );
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0))
    return { columns: 2, sweep: 0, unit: 0, limit: 0, pitch: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
    pitch: round(pitch),
  };
}

export type TiltedGridImage = {
  src: string;
  alt?: string;
};

export type TiltedGridHeroProps = {
  images: TiltedGridImage[];
  speed?: number;
  tileHeight?: number;
  aspectRatio?: number;
  gap?: number;
  axis?: number; // Vertical center % of the curved cylinder band
  curve?: number;
  fade?: number;
  children?: React.ReactNode;
  className?: string;
  onProgressChange?: (currentImageIndex: number, progressPercent: number, isComplete: boolean) => void;
};

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 70, // Positioned in lower portion so letters sit cleanly above
  curve = 78,
  fade = 12,
  children,
  className,
  onProgressChange,
  ...props
}: React.ComponentProps<"div"> & TiltedGridHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  const [layout, setLayout] = React.useState<ReturnType<typeof measure> | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout((prev) =>
        prev?.columns === next.columns &&
        prev.sweep === next.sweep &&
        prev.unit === next.unit
          ? prev
          : next,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  // Preload images
  React.useEffect(() => {
    for (const { src } of images) new Image().src = src;
  }, [images]);

  const { columns, sweep, unit, limit, pitch } =
    layout ?? measure(1200, 600, tileHeight, aspectRatio, gap, bend);

  // --- Scroll-Driven Stream Engine ---
  // Distance in px to advance 1 image in the stream
  const SCROLL_PER_IMAGE = 240;
  const totalStreamScroll = Math.max(images.length, 1) * SCROLL_PER_IMAGE;

  const scrollAccumulator = React.useRef(0);
  const targetOffset = React.useRef(0);
  const currentOffset = React.useRef(0);
  const [renderOffset, setRenderOffset] = React.useState(0);
  const isCompletedRef = React.useRef(false);

  // Wheel & Touch Scroll Listener
  React.useEffect(() => {
    const container = ref.current;
    if (!container || !pitch) return;

    const totalAngleSpan = images.length * pitch;

    const handleWheel = (e: WheelEvent) => {
      // 1. If user has scrolled through all images and continues scrolling DOWN:
      // Allow continuous native window scroll to the next section!
      if (scrollAccumulator.current >= totalStreamScroll && e.deltaY > 0) {
        return; // Do NOT preventDefault! Allow smooth scroll down to #boutique.
      }

      // 2. If at beginning and scrolling UP, allow native window scroll UP
      if (scrollAccumulator.current <= 0 && e.deltaY < 0) {
        return;
      }

      // 3. User is scrolling DOWN through the high-jewelry gallery
      if (e.deltaY > 0) {
        const remaining = totalStreamScroll - scrollAccumulator.current;
        if (e.deltaY >= remaining) {
          // Exactly completes the full sequence of all creations
          scrollAccumulator.current = totalStreamScroll;
          targetOffset.current = totalAngleSpan;
          isCompletedRef.current = true;
          // Notify parent and allow remainder to scroll the page
          return;
        } else {
          e.preventDefault();
          scrollAccumulator.current += e.deltaY;
          const progress = scrollAccumulator.current / totalStreamScroll;
          targetOffset.current = progress * totalAngleSpan;
          return;
        }
      }

      // 4. User is scrolling UP through the gallery
      if (e.deltaY < 0) {
        if (scrollAccumulator.current > 0) {
          e.preventDefault();
          const next = Math.max(0, scrollAccumulator.current + e.deltaY);
          scrollAccumulator.current = next;
          const progress = next / totalStreamScroll;
          targetOffset.current = progress * totalAngleSpan;
          if (next < totalStreamScroll) {
            isCompletedRef.current = false;
          }
          return;
        }
      }
    };

    // Touch support for mobile: smoothly advance without trapping
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      if (deltaY > 0 && scrollAccumulator.current >= totalStreamScroll) {
        return; // Native scroll down
      }
      if (deltaY < 0 && scrollAccumulator.current <= 0) {
        return; // Native scroll up
      }

      const next = Math.min(Math.max(scrollAccumulator.current + deltaY * 1.6, 0), totalStreamScroll);
      scrollAccumulator.current = next;
      const progress = next / totalStreamScroll;
      targetOffset.current = progress * totalAngleSpan;
      if (next >= totalStreamScroll) {
        isCompletedRef.current = true;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pitch, totalStreamScroll, images.length]);

  // Buttery-smooth lerp animation loop (runs on requestAnimationFrame)
  React.useEffect(() => {
    let animId: number;

    const animate = () => {
      const diff = targetOffset.current - currentOffset.current;
      if (Math.abs(diff) > 0.01) {
        currentOffset.current += diff * 0.14;
        setRenderOffset(currentOffset.current);

        // Report progress to parent
        if (pitch && images.length > 0) {
          const rawIndex = Math.floor(currentOffset.current / pitch);
          const activeIndex = Math.min(images.length - 1, Math.max(0, rawIndex % images.length));
          const percent = Math.min(100, Math.max(0, (scrollAccumulator.current / totalStreamScroll) * 100));
          onProgressChange?.(activeIndex, percent, isCompletedRef.current);
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [pitch, images.length, totalStreamScroll, onProgressChange]);

  // Dimensional helpers
  const u = (n: number) =>
    `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(
      MAX_WIDTH / aspectRatio
    ).toFixed(4)}cqw))`;

  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;

  const turn = (deg: number) =>
    `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  const share = aspectRatio / SLICES;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${
    100 - fade
  }%,transparent)`;

  // Tile wrapping function on the cylinder loop [-sweep, sweep)
  const loopSpan = 2 * sweep || 1;
  const wrapAngle = (ang: number) => {
    let wrapped = (ang + sweep) % loopSpan;
    if (wrapped < 0) wrapped += loopSpan;
    return wrapped - sweep;
  };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
      style={{ containerType: "size", ...props.style }}
    >
      {/* 3D Cylinder Spatial Projection Surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: layout ? 1 : 0,
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          // Angular position of tile t, moving to the left as renderOffset increases
          const nominalAngle = sweep - t * pitch - renderOffset;
          const angle = wrapAngle(nominalAngle);

          // Calculate which image to show based on how many full loop rotations occurred
          const lap = Math.floor((renderOffset + t * pitch) / loopSpan);
          const first = columns - 1 - t;
          const imageIndex = Math.abs((lap * columns + first) % Math.max(images.length, 1));
          const img = images[imageIndex];

          // Hide tile if it is behind the camera / beyond screen limit
          const isOffscreen = Math.abs(angle) > limit;

          return (
            <div
              key={t}
              className="absolute transition-transform duration-75"
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                transform: turn(angle),
                visibility: isOffscreen ? "hidden" : "visible",
                willChange: "transform",
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => (
                <div
                  key={k}
                  className={cn(
                    "absolute top-0 overflow-hidden bg-neutral-900 border-y border-gold-500/20 shadow-2xl",
                    k === 0 && "rounded-l-xl border-l border-gold-500/40",
                    k === SLICES - 1 && "rounded-r-xl border-r border-gold-500/40",
                  )}
                  style={{
                    left: u((aspectRatio - share) / 2),
                    width:
                      k === SLICES - 1 ? u(share) : `calc(${u(share)} + 1px)`,
                    height: u(1),
                    transform: turn(
                      (aspectRatio / 2 - (k + 0.5) * share) * unit,
                    ),
                  }}
                >
                  {img ? (
                    <img
                      src={img.src}
                      alt={k === 0 ? (img.alt ?? "") : ""}
                      draggable={false}
                      className="absolute top-0 max-w-none object-cover brightness-[1.02] contrast-[1.05]"
                      style={{
                        left: u(-k * share),
                        width: u(aspectRatio),
                        height: u(1),
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Foreground Content (Letters & Controls positioned comfortably above moving band) */}
      {children}
    </div>
  );
}

export default TiltedGridHero;
