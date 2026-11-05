"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Sparkles, Eye, Gem, ArrowDown } from "lucide-react";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
  onCardClick?: (index: number) => void;
}

// --- FlipCard Component ---
const IMG_WIDTH = 68;
const IMG_HEIGHT = 96;

function FlipCard({
  src,
  index,
  total,
  phase,
  target,
  onCardClick,
}: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 45,
        damping: 18,
      }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        zIndex: Math.round(target.scale * 10),
      }}
      onClick={() => onCardClick?.(index)}
      className="cursor-pointer group hover:z-30"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-2xl border border-gold-500/35 bg-neutral-900"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={`jewelry-card-${index}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-0 transition-opacity" />
          <div className="absolute bottom-1 right-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-2.5 h-2.5 text-gold-300" />
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-2xl bg-gradient-to-b from-neutral-900 to-black flex flex-col items-center justify-center p-2 border border-gold-400/60"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center flex flex-col items-center">
            <Gem className="w-3.5 h-3.5 text-gold-400 mb-1 animate-pulse" />
            <p className="text-[7px] font-bold text-gold-300 uppercase tracking-widest">
              Inspect
            </p>
            <p className="text-[10px] font-serif font-medium text-white line-clamp-1">
              Details
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Hero Component ---
export const TOTAL_IMAGES = 20;
const CYCLE_THRESHOLD = 420;

export const JEWELRY_MORPH_IMAGES = [
  "/images/graduated-riviere-diamond-necklace.jpg",
  "/images/halo-solitaire-ring.png",
  "/images/pear-diamond-cascade-necklace.jpg",
  "/images/diamond-chandelier-earrings.jpg",
  "/images/diamond-tennis-bracelet.jpg",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611591475152-473523dd66c8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608042314453-ae338d80c427?q=80&w=800&auto=format&fit=crop",
];

export interface ScrollMorphHeroProps {
  images?: string[];
  onCardClick?: (index: number) => void;
  className?: string;
}

export default function IntroAnimation({
  images = JEWELRY_MORPH_IMAGES,
  onCardClick,
  className = "",
}: ScrollMorphHeroProps) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [cycleCompleted, setCycleCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  // --- Virtual Scroll & Wheel Handling ---
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  const scrollRotate = useTransform(virtualScroll, [0, CYCLE_THRESHOLD], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 50, damping: 22 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current >= CYCLE_THRESHOLD && e.deltaY > 0) {
        return; // Continuous scroll down
      }

      if (scrollRef.current <= 0 && e.deltaY < 0) {
        return;
      }

      if (e.deltaY > 0) {
        const remaining = CYCLE_THRESHOLD - scrollRef.current;
        if (e.deltaY >= remaining) {
          scrollRef.current = CYCLE_THRESHOLD;
          virtualScroll.set(CYCLE_THRESHOLD);
          setCycleCompleted(true);
          return;
        } else {
          e.preventDefault();
          scrollRef.current += e.deltaY;
          virtualScroll.set(scrollRef.current);
          return;
        }
      }

      if (e.deltaY < 0) {
        if (scrollRef.current > 0) {
          e.preventDefault();
          const next = Math.max(0, scrollRef.current + e.deltaY);
          scrollRef.current = next;
          virtualScroll.set(next);
          if (next < CYCLE_THRESHOLD) {
            setCycleCompleted(false);
          }
          return;
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      if (deltaY > 0 && scrollRef.current >= CYCLE_THRESHOLD) {
        return;
      }
      if (deltaY < 0 && scrollRef.current <= 0) {
        return;
      }

      const next = Math.min(Math.max(scrollRef.current + deltaY * 1.5, 0), CYCLE_THRESHOLD);
      scrollRef.current = next;
      virtualScroll.set(next);
      if (next >= CYCLE_THRESHOLD) {
        setCycleCompleted(true);
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
  }, [virtualScroll]);

  // --- Mouse Parallax ---
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  // --- Intro Sequence (Scatter -> Line -> Circle) ---
  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase("line"), 500);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const scatterPositions = useMemo(() => {
    return images.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, [images]);

  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubscribeRotate();
      unsubscribeParallax();
    };
  }, [smoothScrollRotate, smoothMouseX]);

  const scrollToBoutique = () => {
    const el = document.getElementById("boutique");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#0a0a0a] text-[#ededed] overflow-hidden select-none ${className}`}
    >
      <div className="absolute inset-0 bg-radial-gradient from-gold-500/10 via-transparent to-black pointer-events-none" />

      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 px-4 max-w-sm sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={introPhase === "circle" ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase tracking-[0.25em] mb-3 transition-all duration-500 ${
              cycleCompleted
                ? "border-gold-400 bg-gold-950/80 text-gold-200 shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                : "border-gold-500/30 bg-gold-950/40 text-gold-300"
            }`}
          >
            <Sparkles className="w-3 h-3 text-gold-400" />
            {cycleCompleted
              ? "Spectrum Assembled in Circle"
              : "Place Vendôme 3D Arc Spectrum"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={introPhase === "circle" ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight text-gold-100 drop-shadow-md"
          >
            Haute Joaillerie in Infinite Motion
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={introPhase === "circle" ? { opacity: 0.9 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-3 text-[11px] sm:text-xs font-mono font-medium tracking-[0.2em] uppercase text-gold-400/90 transition-all duration-300"
          >
            {cycleCompleted ? (
              <span className="flex items-center justify-center gap-1.5 text-gold-300 font-semibold animate-pulse">
                Scroll Down To Explore Boutique <ArrowDown className="w-3.5 h-3.5" />
              </span>
            ) : (
              "Scroll To Rotate 3D Circle Spectrum"
            )}
          </motion.p>
        </div>

        <div className="relative flex items-center justify-center w-full h-full">
          {images.slice(0, TOTAL_IMAGES).map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i] || { x: 0, y: 0, rotation: 0, scale: 0.6, opacity: 0 };
            } else if (introPhase === "line") {
              const lineSpacing = 78;
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);
              const circleRadius = Math.min(minDimension * 0.36, 360);

              const baseAngle = (i / TOTAL_IMAGES) * 360;
              const currentAngle = baseAngle + rotateValue;
              const circleRad = (currentAngle * Math.PI) / 180;

              const depthFactor = Math.sin(circleRad);
              const dynamicScale = isMobile
                ? 0.95 + depthFactor * 0.12
                : 1.08 + depthFactor * 0.16;
              const dynamicOpacity = 0.88 + depthFactor * 0.12;

              target = {
                x: Math.cos(circleRad) * circleRadius + parallaxValue * 0.35,
                y: Math.sin(circleRad) * circleRadius,
                rotation: currentAngle + 90,
                scale: dynamicScale,
                opacity: dynamicOpacity,
              };
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
                onCardClick={onCardClick}
              />
            );
          })}
        </div>

        {cycleCompleted && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={scrollToBoutique}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(197,160,89,0.5)] hover:scale-105 cursor-pointer"
          >
            <span>Continue to Boutique</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </motion.button>
        )}

        <div className="absolute bottom-5 right-6 z-20 hidden sm:flex items-center gap-2 pointer-events-none bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-500/20 text-[11px] font-mono text-gold-300">
          <Eye className="w-3.5 h-3.5 text-gold-400" />
          <span>Interactive 3D Virtual Wheel • Continuous Scroll</span>
        </div>
      </div>
    </div>
  );
}
