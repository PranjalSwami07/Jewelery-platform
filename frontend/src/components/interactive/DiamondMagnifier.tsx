import React, { useState } from "react";
import { ZoomIn, ShieldCheck, Calendar, Sparkles, Check } from "lucide-react";
import { JEWELRY_CATALOG } from "@/data/jewelryData";
import { SmoothMagnifier } from "@/components/common/SmoothMagnifier";

interface DiamondMagnifierProps {
  onInquire?: (piece: any) => void;
}

export const DiamondMagnifier: React.FC<DiamondMagnifierProps> = ({ onInquire }) => {
  const [selectedPiece, setSelectedPiece] = useState(JEWELRY_CATALOG[0]); // Default to Graduated Rivière Necklace from Image 1!
  const [isReserved, setIsReserved] = useState(false);

  const handleInquiry = () => {
    setIsReserved(true);
    onInquire?.(selectedPiece);
    setTimeout(() => setIsReserved(false), 3000);
  };

  return (
    <div className="relative rounded-3xl border border-gold-500/25 bg-black/70 p-6 md:p-10 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-sans">
            <ZoomIn className="w-3.5 h-3.5" /> High Precision Macro Loupe
          </span>
          <h3 className="text-3xl md:text-4xl font-serif text-gold-100 mt-2">
            Multi-Creation 58-Facet Magnifier
          </h3>
          <p className="text-neutral-400 text-sm mt-1 max-w-xl">
            Select any creation from our private reserve below to inspect stone girdle symmetry, diamond dispersion, and prong settings in ultra-smooth magnification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gold-300 font-mono border border-gold-500/30 px-3.5 py-1.5 rounded-full bg-gold-950/40">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>GIA Triple Excellent Certified</span>
        </div>
      </div>

      {/* Piece Selector Carousel / Thumbnails */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {JEWELRY_CATALOG.slice(0, 5).map((item) => {
          const isSelected = selectedPiece.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedPiece(item);
                setIsReserved(false);
              }}
              className={`flex items-center gap-3 p-2 pr-4 rounded-2xl border transition-all duration-300 shrink-0 text-left ${
                isSelected
                  ? "border-gold-400 bg-gold-950/50 shadow-[0_0_20px_rgba(197,160,89,0.3)] ring-1 ring-gold-400"
                  : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-14 h-14 rounded-xl object-cover bg-neutral-900 border border-gold-500/20"
              />
              <div>
                <div className="text-xs font-serif font-medium text-gold-100 line-clamp-1">
                  {item.name}
                </div>
                <div className="text-[10px] text-gold-400/80 font-mono">
                  {item.caratWeight}
                </div>
                <div className="text-xs text-gold-300 font-medium">
                  ${item.price.toLocaleString()}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Loupe Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Smooth Magnifier Lens */}
        <div className="lg:col-span-8">
          <SmoothMagnifier
            key={selectedPiece.id}
            imageSrc={selectedPiece.image}
            alt={selectedPiece.alt}
            zoomLevel={3.5}
            lensSize={210}
            aspectRatioClass="h-[420px] md:h-[500px]"
            title={selectedPiece.name}
          />
        </div>

        {/* Right Column: Piece Atelier Specs & Action */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-neutral-950/60 border border-gold-500/20 rounded-2xl p-6 backdrop-blur-md">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-gold-400 font-mono">
              {selectedPiece.collection}
            </div>
            <h4 className="font-serif text-2xl text-gold-100 mt-1">
              {selectedPiece.name}
            </h4>
            <div className="font-serif text-3xl font-bold text-gold-200 mt-2">
              ${selectedPiece.price.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-300 font-sans mt-3 leading-relaxed">
              {selectedPiece.description}
            </p>
          </div>

          {/* 4Cs Specifications List */}
          <div className="space-y-2 border-y border-neutral-800 py-4 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>Total Carats</span>
              <span className="text-neutral-200">{selectedPiece.caratWeight}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Clarity Grade</span>
              <span className="text-neutral-200">{selectedPiece.clarity}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Color Saturation</span>
              <span className="text-neutral-200">{selectedPiece.colorGrade}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Cut & Symmetry</span>
              <span className="text-gold-300">{selectedPiece.cutGrade}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Default Metal</span>
              <span className="text-neutral-200">{selectedPiece.metal}</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleInquiry}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              isReserved
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-gold-500 hover:bg-gold-400 text-neutral-950 shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-[1.02]"
            }`}
          >
            {isReserved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Private Viewing Reserved</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Book Salon Private Viewing</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiamondMagnifier;
