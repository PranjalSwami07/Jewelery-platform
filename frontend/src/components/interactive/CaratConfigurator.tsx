import React, { useState } from "react";
import { Sliders, Check, Gem, Sparkles } from "lucide-react";

interface MetalOption {
  id: string;
  name: string;
  purity: string;
  colorHex: string;
  reflectionGradient: string;
  priceModifier: number;
}

const METALS: MetalOption[] = [
  {
    id: "yellow-gold",
    name: "18K Yellow Gold",
    purity: "750/1000 Au",
    colorHex: "#C5A059",
    reflectionGradient: "linear-gradient(135deg, #FAF7EE 0%, #C5A059 50%, #83652B 100%)",
    priceModifier: 0,
  },
  {
    id: "rose-gold",
    name: "18K Rose Gold",
    purity: "750/1000 Au • Cu",
    colorHex: "#E0A899",
    reflectionGradient: "linear-gradient(135deg, #FFF0EC 0%, #E0A899 50%, #9C6658 100%)",
    priceModifier: 250,
  },
  {
    id: "platinum",
    name: "Platinum 950",
    purity: "950/1000 Pt",
    colorHex: "#E5E5E9",
    reflectionGradient: "linear-gradient(135deg, #FFFFFF 0%, #D4D4DC 50%, #8E8E98 100%)",
    priceModifier: 850,
  },
];

const CARATS = [
  { carat: 1.5, cut: "Brilliant", dimension: "7.4 mm", basePrice: 14800 },
  { carat: 2.2, cut: "Oval", dimension: "9.2 mm", basePrice: 26500 },
  { carat: 3.5, cut: "Emerald Cut", dimension: "10.8 mm", basePrice: 48900 },
  { carat: 5.0, cut: "Cushion", dimension: "12.4 mm", basePrice: 94000 },
];

export const CaratConfigurator: React.FC = () => {
  const [selectedMetal, setSelectedMetal] = useState<MetalOption>(METALS[0]);
  const [selectedCarat, setSelectedCarat] = useState(CARATS[1]);
  const [surfaceLuster, setSurfaceLuster] = useState(85);

  const totalPrice = selectedCarat.basePrice + selectedMetal.priceModifier;

  return (
    <div className="relative rounded-2xl border border-gold-500/25 bg-black/60 p-6 md:p-10 backdrop-blur-md overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-sans">
            <Sliders className="w-3.5 h-3.5" /> Bespoke Configurator
          </span>
          <h3 className="text-3xl md:text-4xl font-serif text-gold-100 mt-2">
            Precious Metal & Carat Atelier
          </h3>
          <p className="text-neutral-400 text-sm mt-1 max-w-lg">
            Customize precious metal metallurgy and center stone carat volume with real-time radiance modeling.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-sans">
            Estimated Atelier Value
          </span>
          <div className="text-3xl md:text-4xl font-serif text-gold-200 mt-1">
            ${totalPrice.toLocaleString()} <span className="text-xs text-neutral-400 font-sans">USD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Live Reflection Preview Box */}
        <div className="lg:col-span-7 relative h-[360px] md:h-[420px] rounded-xl overflow-hidden border border-gold-500/30 bg-neutral-950 flex flex-col items-center justify-center p-8 group">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700"
            style={{ background: selectedMetal.reflectionGradient }}
          />

          {/* Simulated Diamond Stone with dynamic scale */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className="relative transition-transform duration-500 flex items-center justify-center"
              style={{
                transform: `scale(${0.8 + selectedCarat.carat * 0.16})`,
              }}
            >
              <div
                className="w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500"
                style={{
                  background: selectedMetal.reflectionGradient,
                  boxShadow: `0 0 50px ${selectedMetal.colorHex}40`,
                }}
              >
                {/* Solitaire Diamond Facet Core */}
                <div className="w-24 h-24 rounded-full bg-white/90 backdrop-blur-md border border-white flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-60 bg-gradient-to-tr from-cyan-200/40 via-white to-pink-200/40 animate-pulse"
                    style={{ animationDuration: "3s" }}
                  />
                  <Gem className="w-12 h-12 text-neutral-900 relative z-10" />
                </div>
              </div>

              {/* Shimmer Sparkles */}
              <Sparkles className="w-6 h-6 text-gold-200 absolute -top-4 -right-4 animate-bounce" />
            </div>

            <div className="mt-8 text-center">
              <span className="text-lg font-serif text-gold-100 font-medium">
                {selectedCarat.carat} Carats • {selectedCarat.cut} Cut
              </span>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Hand-set in {selectedMetal.name} ({selectedMetal.purity})
              </p>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded text-xs font-mono text-gold-300 border border-gold-500/20">
            {selectedCarat.dimension} Table Width
          </div>
        </div>

        {/* Controls Section */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Metal Selection */}
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-300 font-sans block mb-3">
              1. Select Precious Metal
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {METALS.map((metal) => {
                const isSelected = selectedMetal.id === metal.id;
                return (
                  <button
                    key={metal.id}
                    onClick={() => setSelectedMetal(metal)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-gold-400 bg-gold-950/40 shadow-[0_0_15px_rgba(197,160,89,0.25)]"
                        : "border-neutral-800 bg-black/40 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: metal.colorHex }}
                      />
                      <div>
                        <div className="text-sm font-medium text-neutral-200">
                          {metal.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {metal.purity}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-gold-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carat Volume Selection */}
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-300 font-sans block mb-3">
              2. Diamond Carat Weight
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {CARATS.map((item) => {
                const isSelected = selectedCarat.carat === item.carat;
                return (
                  <button
                    key={item.carat}
                    onClick={() => setSelectedCarat(item)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "border-gold-400 bg-gold-950/40 shadow-[0_0_15px_rgba(197,160,89,0.25)]"
                        : "border-neutral-800 bg-black/40 hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-base font-serif text-gold-100 font-bold">
                      {item.carat} ct
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {item.cut}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Surface Luster Slider */}
          <div>
            <div className="flex justify-between text-xs text-neutral-300 mb-2">
              <span className="uppercase tracking-widest">Atelier Polishing Luster</span>
              <span className="font-mono text-gold-300">{surfaceLuster}% Mirror Polish</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={surfaceLuster}
              onChange={(e) => setSurfaceLuster(Number(e.target.value))}
              className="w-full accent-gold-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaratConfigurator;
