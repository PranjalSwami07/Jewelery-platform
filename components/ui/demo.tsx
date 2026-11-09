"use client";

import React, { useState } from "react";
import { TiltedGridHero, TiltedGridImage } from "@/components/ui/tilted-grid-hero";
import { Sparkles, Gem, ArrowDown, CheckCircle2 } from "lucide-react";

// Curated High Jewelry Stock Images for the 3D cylindrical stream
export const JEWELRY_STREAM_IMAGES: TiltedGridImage[] = [
  {
    src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
    alt: "Graduated diamond rivière necklace sparkling under studio illumination",
  },
  {
    src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
    alt: "58-facet brilliant halo solitaire diamond ring",
  },
  {
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
    alt: "Fine gold necklace and emerald gemstone atelier creation",
  },
  {
    src: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop",
    alt: "Brilliant cushion cut diamond ring with pavé halo",
  },
  {
    src: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1200&auto=format&fit=crop",
    alt: "Luxury gold bridal necklace handcrafted with pearls and diamonds",
  },
  {
    src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
    alt: "Diamond chandelier drop earrings with articulating rosettes",
  },
  {
    src: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1200&auto=format&fit=crop",
    alt: "Handcrafted platinum and diamond tennis bracelet",
  },
  {
    src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop",
    alt: "Golden artisan pendant with precious colored gemstones",
  },
  {
    src: "https://images.unsplash.com/photo-1611591475152-473523dd66c8?q=80&w=1200&auto=format&fit=crop",
    alt: "Curated jewelry collection on natural botanical backdrop",
  },
  {
    src: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop",
    alt: "Art Deco diamond earrings on black velvet presentation display",
  },
  {
    src: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop",
    alt: "Sculptural gold cuff with pave diamond accents",
  },
  {
    src: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=1200&auto=format&fit=crop",
    alt: "Emerald-cut sapphire ring flanked by trapezoid side stones",
  },
];

export default function TiltedGridHeroDemo() {
  const [streamProgress, setStreamProgress] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scrollToBoutique = () => {
    const el = document.getElementById("boutique");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <TiltedGridHero
      images={JEWELRY_STREAM_IMAGES}
      tileHeight={27}
      aspectRatio={16 / 9}
      axis={72} // Band is positioned in the lower portion so letters are 100% unobstructed
      curve={76}
      fade={12}
      onProgressChange={(idx, percent, complete) => {
        setActiveImageIndex(idx);
        setStreamProgress(percent);
        setIsComplete(complete);
      }}
      className="h-[580px] xs:h-[620px] sm:h-[730px] w-full rounded-2xl sm:rounded-3xl border border-gold-500/30 bg-[#070707] shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
    >
      <div className="relative z-10 flex h-full flex-col justify-between py-6 px-3.5 sm:py-10 sm:px-12 text-center pointer-events-none select-none">
        {/* ── TOP SECTION: Letters positioned cleanly ABOVE the moving images ── */}
        <div className="flex flex-col items-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3.5 pt-1 sm:pt-2">
          {/* Atelier Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gold-500/40 bg-gold-950/70 backdrop-blur-md text-gold-300 text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.28em] shadow-lg">
            <Gem className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400 shrink-0" />
            <span className="truncate">Place Vendôme 3D Curved Spectrum</span>
          </div>

          {/* Main Title: High contrast gold typography */}
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-serif text-gold-100 tracking-tight leading-[1.12] drop-shadow-xl">
            Every creation,
            <br />
            <span className="italic font-light bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
              brought into focus.
            </span>
          </h2>

          {/* Subtitle Description */}
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-300 max-w-xl mx-auto font-sans leading-relaxed tracking-wide px-2">
            Swipe left or scroll down to stream creations around an architectural cylinder. Once all pieces are presented, scrolling glides seamlessly into the boutique catalog.
          </p>

          {/* Stream Progress Bar & Counter Strip */}
          <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
              {isComplete ? (
                <span className="text-gold-300 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-gold-400" /> All Explored
                </span>
              ) : (
                "Swipe / Scroll"
              )}
            </span>
            <div className="w-24 xs:w-28 sm:w-36 h-1.5 bg-neutral-900 border border-gold-500/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-150"
                style={{ width: `${Math.min(100, streamProgress)}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400">
              {activeImageIndex + 1} / {JEWELRY_STREAM_IMAGES.length}
            </span>
          </div>
        </div>

        {/* ── BOTTOM SECTION: Action Cue & Continuous Scroll Indicator ── */}
        <div className="pointer-events-auto flex justify-center pb-2">
          {isComplete ? (
            <button
              onClick={scrollToBoutique}
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black px-5 sm:px-6 py-2.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(197,160,89,0.55)] hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
            >
              <span>Scroll Down to Boutique</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-black/70 border border-gold-500/25 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-gold-300/90 shadow-md">
              <span>Swipe left or scroll down to glide</span>
              <ArrowDown className="w-3 h-3 text-gold-400" />
            </div>
          )}
        </div>
      </div>
    </TiltedGridHero>
  );
}
