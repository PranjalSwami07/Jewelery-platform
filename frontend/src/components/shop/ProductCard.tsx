import React, { useState } from "react";
import { Heart, ZoomIn, Eye, Sparkles } from "lucide-react";
import { JewelryItem, MetalType } from "@/types/jewelry";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: JewelryItem;
  onQuickView: (product: JewelryItem) => void;
  onInspect: (product: JewelryItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onInspect,
}) => {
  const { toggleWishlist, isInWishlist } = useCart();
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(product.metal);

  const isFavorited = isInWishlist(product.id);

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col rounded-2xl border border-gold-500/25 bg-white/90 dark:bg-neutral-950/70 hover:border-gold-500 hover:shadow-[0_12px_40px_rgba(197,160,89,0.18)] dark:hover:shadow-[0_12px_40px_rgba(197,160,89,0.15)] transition-all duration-500 overflow-hidden cursor-pointer shadow-md dark:shadow-none"
    >
      {/* Top Media Frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900 select-none">
        <img
          src={product.image}
          alt={product.alt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider bg-gold-500 text-black font-semibold shadow-md">
              <Sparkles className="w-3 h-3" /> Iconic
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider bg-black/60 text-gold-300 border border-gold-500/30 backdrop-blur-sm">
            {product.caratWeight}
          </span>
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? "bg-rose-500/90 text-white shadow-lg shadow-rose-500/40"
              : "bg-black/50 text-neutral-300 hover:text-rose-400 hover:bg-black/70"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>

        {/* Hover Quick Action Overlays */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect(product);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-black/85 hover:bg-black text-gold-200 border border-gold-500/40 text-xs font-medium backdrop-blur-md transition-all shadow-lg hover:border-gold-300"
          >
            <ZoomIn className="w-3.5 h-3.5 text-gold-400" />
            <span>Macro Loupe</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="py-2 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-medium backdrop-blur-md transition-all"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="flex flex-col p-5 flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-neutral-400 font-mono tracking-widest uppercase">
            <span>{product.collection}</span>
            <span className="text-gold-700 dark:text-gold-400/90 font-medium">{product.cutGrade}</span>
          </div>

          <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-gold-100 mt-1 line-clamp-1 group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-600 dark:text-neutral-400 font-sans mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Metal Variants Chips */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.availableMetals.map((metal) => {
            const isSelected = selectedMetal === metal;
            const colorMap: Record<MetalType, string> = {
              "Platinum 950": "#E5E5E9",
              "18K White Gold": "#F1F1F5",
              "18K Yellow Gold": "#C5A059",
              "18K Rose Gold": "#E0A899",
            };
            return (
              <button
                key={metal}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMetal(metal);
                }}
                title={metal}
                className={`w-4 h-4 rounded-full border transition-all ${
                  isSelected
                    ? "ring-2 ring-gold-500 ring-offset-2 ring-offset-white dark:ring-offset-black scale-110"
                    : "opacity-60 hover:opacity-100 border-neutral-400 dark:border-neutral-600"
                }`}
                style={{ backgroundColor: colorMap[metal] }}
              />
            );
          })}
          <span className="text-[10px] text-stone-500 dark:text-neutral-500 font-sans ml-1">
            {selectedMetal}
          </span>
        </div>

        {/* Price & View Details Action */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-neutral-900">
          <div>
            <div className="font-serif text-xl font-semibold text-gold-800 dark:text-gold-200">
              ${product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 dark:text-neutral-500 line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 bg-gold-500/10 hover:bg-gold-500 text-gold-300 hover:text-black border border-gold-500/30 hover:border-gold-400 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
