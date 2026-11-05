import React, { useState, useRef } from "react";
import { RotateCw, Sparkles, Compass } from "lucide-react";

export const RingRotation360: React.FC = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentAngleRef = useRef(0);

  // Multi-angle perspective simulation of an 18K Emerald & Diamond high jewelry ring
  const angles = [
    {
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop",
      title: "Frontal Pavilion",
    },
    {
      url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=900&auto=format&fit=crop",
      title: "Three-Quarter Table",
    },
    {
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=900&auto=format&fit=crop",
      title: "Side Profile Gallery",
    },
    {
      url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=900&auto=format&fit=crop",
      title: "Under-Gallery & Shank",
    },
  ];

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newAngle = (currentAngleRef.current + deltaX * 0.8 + 360) % 360;
    setRotationAngle(newAngle);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    currentAngleRef.current = rotationAngle;
  };

  // Determine active frame based on 360 degrees
  const frameIndex = Math.floor((rotationAngle / 360) * angles.length) % angles.length;
  const currentFrame = angles[frameIndex];

  return (
    <div className="relative rounded-2xl border border-gold-500/25 bg-black/60 p-6 md:p-10 backdrop-blur-md overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-sans">
            <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} /> 360° Atelier Turntable
          </span>
          <h3 className="text-3xl md:text-4xl font-serif text-gold-100 mt-2">
            The Étoile Solitaire Turntable
          </h3>
          <p className="text-neutral-400 text-sm mt-1 max-w-lg">
            Drag horizontally across the preview to rotate the high jewelry ring across 360 degrees of radiant reflections.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gold-300 font-mono border border-gold-500/30 px-3 py-1.5 rounded-full bg-gold-950/40">
          <Compass className="w-4 h-4 text-gold-400" />
          <span>Bearing: {Math.round(rotationAngle)}°</span>
        </div>
      </div>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-[380px] md:h-[460px] w-full rounded-xl overflow-hidden cursor-ew-resize border border-gold-500/20 bg-neutral-950 select-none flex items-center justify-center group"
      >
        {/* Dynamic Image Projection */}
        <img
          src={currentFrame.url}
          alt={currentFrame.title}
          className="h-full w-full object-cover transition-all duration-150 transform group-hover:scale-105"
          style={{
            filter: `brightness(${1 + Math.sin((rotationAngle * Math.PI) / 180) * 0.15}) contrast(1.05)`,
          }}
          draggable={false}
        />

        {/* Ambient Ring Lighting Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/80 pointer-events-none" />

        {/* Interactive Drag Handle Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/30 text-xs text-gold-200">
          <RotateCw className="w-4 h-4 text-gold-400 animate-pulse" />
          <span>Drag horizontally to rotate 360°</span>
        </div>

        {/* Turntable Degree Indicator Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center gap-1.5 pointer-events-none">
          {angles.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i === frameIndex ? "bg-gold-400 shadow-[0_0_8px_#C5A059]" : "bg-neutral-800"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RingRotation360;
