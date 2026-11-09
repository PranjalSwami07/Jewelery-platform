import React, { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, Sparkles } from "lucide-react";

interface SmoothMagnifierProps {
  imageSrc: string;
  alt?: string;
  zoomLevel?: number; // e.g. 3.2
  lensSize?: number; // e.g. 180 (pixels)
  className?: string;
  aspectRatioClass?: string;
  showReticle?: boolean;
  title?: string;
}

export const SmoothMagnifier: React.FC<SmoothMagnifierProps> = ({
  imageSrc,
  alt = "High Jewelry Macro Inspection",
  zoomLevel = 3.4,
  lensSize = 190,
  className = "",
  aspectRatioClass = "h-[450px] md:h-[520px]",
  showReticle = true,
  title,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50, pxX: 0, pxY: 0 });
  const [currentZoom, setCurrentZoom] = useState(zoomLevel);
  const [actualLensSize, setActualLensSize] = useState(lensSize);
  const targetPos = useRef({ x: 50, y: 50, pxX: 0, pxY: 0 });
  const animFrameId = useRef<number | null>(null);

  // Dynamically calibrate lens size for mobile phone viewports
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== "undefined" && window.innerWidth < 640) {
        setActualLensSize(Math.min(lensSize, 140));
      } else {
        setActualLensSize(lensSize);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [lensSize]);

  // Smooth lerp animation loop
  const updateLens = useCallback(() => {
    if (!isHovered) return;

    setLensPos((prev) => {
      const dx = targetPos.current.x - prev.x;
      const dy = targetPos.current.y - prev.y;
      const dPxX = targetPos.current.pxX - prev.pxX;
      const dPxY = targetPos.current.pxY - prev.pxY;

      // Smooth interpolation factor (0.25 gives responsive, buttery smooth glide)
      return {
        x: prev.x + dx * 0.25,
        y: prev.y + dy * 0.25,
        pxX: prev.pxX + dPxX * 0.25,
        pxY: prev.pxY + dPxY * 0.25,
      };
    });

    animFrameId.current = requestAnimationFrame(updateLens);
  }, [isHovered]);

  useEffect(() => {
    if (isHovered) {
      animFrameId.current = requestAnimationFrame(updateLens);
    } else if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
    }
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isHovered, updateLens]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const pxX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pxY = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const percentX = (pxX / rect.width) * 100;
    const percentY = (pxY / rect.height) * 100;

    targetPos.current = {
      x: percentX,
      y: percentY,
      pxX,
      pxY,
    };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsHovered(true);
    handlePointerMove(e);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  // Direct Smartphone Touch Gestures: seamless glide under user's finger
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    const pxX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pxY = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const percentX = (pxX / rect.width) * 100;
    const percentY = (pxY / rect.height) * 100;

    targetPos.current = {
      x: percentX,
      y: percentY,
      pxX,
      pxY,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsHovered(true);
    handleTouchMove(e);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
  };

  const halfLens = actualLensSize / 2;

  return (
    <div className={`relative flex flex-col gap-2.5 ${className}`}>
      {/* ── EXTERNAL CONTROLS TOOLBAR (Outside the image box so hovering is completely undisturbed) ── */}
      <div className="flex items-center justify-between gap-2 px-1 select-none">
        {title ? (
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gold-200 font-serif tracking-wide truncate max-w-[130px] xs:max-w-[200px] sm:max-w-xs md:max-w-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="truncate">{title}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] uppercase tracking-widest text-gold-400 font-mono truncate">
            <Sparkles className="w-3 h-3 text-gold-400 shrink-0 animate-pulse" />
            <span>Macro Loupe</span>
          </div>
        )}

        {/* Quick Zoom Controls Floating Bar — Placed outside so mouse hover over image is never disturbed */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-black/85 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gold-500/35 shadow-lg shrink-0">
          <span className="text-[10px] sm:text-[11px] uppercase font-mono text-gold-400/90 font-semibold tracking-wider pr-0.5 sm:pr-1">
            ZOOM
          </span>
          {[2.5, 3.5, 5.0].map((level) => (
            <button
              key={level}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentZoom(level);
              }}
              aria-label={`Set magnification to ${level}x`}
              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium transition-all ${
                currentZoom === level
                  ? "bg-gold-500 text-black shadow-[0_0_12px_rgba(197,160,89,0.6)] font-bold scale-105"
                  : "text-neutral-400 hover:text-gold-200 bg-neutral-900/70 hover:bg-neutral-800"
              }`}
            >
              {level === 5 ? "5x" : `${level}x`}
            </button>
          ))}
        </div>
      </div>

      {/* Loupe Viewport Container */}
      <div
        ref={containerRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full ${aspectRatioClass} rounded-2xl overflow-hidden cursor-crosshair border border-gold-500/25 bg-neutral-950 select-none shadow-2xl group touch-none`}
      >
        {/* Main Base Image */}
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          draggable={false}
          loading="eager"
        />

        {/* Ambient Darkened Edge Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/60 pointer-events-none" />

        {/* The Smooth Optical Loupe Lens */}
        {isHovered && (
          <div
            className="absolute pointer-events-none rounded-full overflow-hidden border-2 border-gold-400 shadow-[0_0_35px_rgba(197,160,89,0.7),inset_0_0_20px_rgba(255,255,255,0.4)] z-30 transition-opacity duration-200"
            style={{
              width: `${actualLensSize}px`,
              height: `${actualLensSize}px`,
              left: `${lensPos.pxX}px`,
              top: `${lensPos.pxY}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Zoomed Background Surface */}
            <div
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${currentZoom * 100}%`,
                backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
              }}
            />

            {/* Specular Curved Glass Reflection Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/30 pointer-events-none rounded-full" />

            {/* Facet Alignment Reticle / Crosshair */}
            {showReticle && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                <div className="w-full h-[1px] bg-gold-400/60" />
                <div className="h-full w-[1px] bg-gold-400/60 absolute" />
                <div className="w-8 h-8 rounded-full border border-gold-300/60 absolute" />
              </div>
            )}

            {/* Magnification Factor Badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-gold-500/40 text-[9px] sm:text-[10px] font-mono tracking-wider text-gold-300 uppercase shadow-md">
              {currentZoom.toFixed(1)}x Loupe
            </div>
          </div>
        )}

        {/* Floating Instruction / Status Indicator (pointer-events-none so mouse is not blocked) */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2 pointer-events-none bg-black/75 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-gold-500/30 text-[10px] sm:text-xs text-neutral-200 shadow-lg max-w-[85%] sm:max-w-none">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400 animate-pulse shrink-0" />
          <span className="font-sans tracking-wide truncate">
            {isHovered ? "58-Facet Diamond Symmetry" : "Drag finger or hover to inspect"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmoothMagnifier;
