import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export const ParallaxBanner: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl border border-gold-500/30 bg-gradient-to-r from-neutral-950 via-black to-neutral-900 p-8 md:p-16 overflow-hidden shadow-2xl transition-all duration-300 group"
    >
      {/* Background Floating Jewelry Layer (Far Z) */}
      <div
        className="absolute -right-12 -top-12 w-[480px] h-[480px] opacity-35 transition-transform duration-300 ease-out pointer-events-none"
        style={{
          transform: `translate(${coords.x * 40}px, ${coords.y * 40}px) rotate(${coords.x * 10}deg)`,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop"
          alt="High Jewelry Gemstones"
          className="w-full h-full object-cover rounded-full filter blur-sm"
        />
      </div>

      {/* Mid Layer Floating Jewels (Mid Z) */}
      <div
        className="absolute right-12 md:right-32 bottom-0 w-[300px] h-[300px] opacity-80 transition-transform duration-200 ease-out pointer-events-none"
        style={{
          transform: `translate(${coords.x * -60}px, ${coords.y * -60}px) scale(1.05)`,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop"
          alt="Cascade Diamond Necklace"
          className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(197,160,89,0.3)]"
        />
      </div>

      {/* Atmospheric Gold Dust Glow (Near Z) */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          background: `radial-gradient(circle at ${50 + coords.x * 40}% ${
            50 + coords.y * 40
          }%, rgba(197,160,89,0.18) 0%, transparent 60%)`,
        }}
      />

      {/* Content Layer (Foreground) */}
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-950/40 text-gold-300 text-xs uppercase tracking-[0.2em] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Haute Joaillerie Commission</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-gold-100 leading-tight">
          Bespoke Creations Crafted by Master Artisans
        </h2>
        <p className="mt-4 text-neutral-300 text-sm md:text-base font-sans leading-relaxed">
          From sourcing untreated Kashmir sapphires and Golconda diamonds to lost-wax casting in our Place Vendôme atelier, collaborate directly with our Creative Director.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-black font-medium text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(197,160,89,0.4)]"
          >
            <span>Book Private Salon Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <span className="text-xs text-gold-400/80 font-mono tracking-wider">
            Geneva • Paris • London • New York
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParallaxBanner;
