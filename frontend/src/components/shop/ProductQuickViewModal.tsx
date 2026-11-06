import React, { useState } from "react";
import { X, Heart, ShieldCheck, Gem, Sparkles, Check, Truck, Calendar, MapPin } from "lucide-react";
import { JewelryItem, MetalType } from "@/types/jewelry";
import { SmoothMagnifier } from "@/components/common/SmoothMagnifier";
import { useCart } from "@/context/CartContext";

interface ProductQuickViewModalProps {
  product: JewelryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookViewing?: (product: JewelryItem) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onBookViewing,
}) => {
  const { toggleWishlist, isInWishlist } = useCart();
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(
    product ? product.metal : "Platinum 950"
  );
  const [isBooked, setIsBooked] = useState(false);

  // Sync selected metal when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedMetal(product.metal);
      setIsBooked(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);

  const handleBooking = () => {
    setIsBooked(true);
    onBookViewing?.(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-gold-500/30 bg-neutral-950/95 shadow-2xl backdrop-blur-2xl overflow-hidden z-10 flex flex-col lg:flex-row my-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-gold-500/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Interactive Smooth Magnifier Lens */}
        <div className="lg:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-black/50 border-b lg:border-b-0 lg:border-r border-gold-500/15">
          <SmoothMagnifier
            imageSrc={product.image}
            alt={product.alt}
            zoomLevel={3.5}
            lensSize={200}
            aspectRatioClass="h-[380px] sm:h-[460px] md:h-[500px]"
            title={product.name}
          />

          <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Certification: {product.cutGrade}</span>
            <span className="text-gold-300">{product.caratWeight}</span>
          </div>
        </div>

        {/* Right Column: E-commerce Details & Configuration */}
        <div className="lg:w-5/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            {/* Collection & Title */}
            <div>
              <div className="text-xs uppercase tracking-widest text-gold-400/90 font-mono">
                {product.collection}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-gold-100 font-medium mt-1">
                {product.name}
              </h2>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-gold-200">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-neutral-400 font-sans">
                (Atelier Valuation)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* 4Cs Specifications Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl border border-gold-500/20 bg-neutral-900/60 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Total Carat
                </span>
                <span className="font-mono text-neutral-200 font-medium">
                  {product.caratWeight}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Diamond Clarity
                </span>
                <span className="font-mono text-neutral-200 font-medium">
                  {product.clarity}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Color Grade
                </span>
                <span className="font-mono text-neutral-200 font-medium">
                  {product.colorGrade}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Cut Precision
                </span>
                <span className="font-mono text-gold-300 font-medium">
                  {product.cutGrade}
                </span>
              </div>
            </div>

            {/* Metal Alloy Selector */}
            <div>
              <label className="text-xs uppercase tracking-widest text-neutral-300 font-sans block mb-2">
                Precious Metal Alloy:{" "}
                <span className="text-gold-300 font-medium">{selectedMetal}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableMetals.map((metal) => {
                  const isSelected = selectedMetal === metal;
                  return (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans border transition-all ${
                        isSelected
                          ? "border-gold-400 bg-gold-950/60 text-gold-200 shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                          : "border-neutral-800 text-neutral-400 hover:border-neutral-700 bg-black/40"
                      }`}
                    >
                      {metal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Pillars */}
            <div className="space-y-2 pt-2 border-t border-neutral-900 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Private Salon Viewing in Mumbai, New Delhi & Jaipur</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>GIA / SSEF Authenticity Certificate & Laser Hallmark</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={handleBooking}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-xl ${
                isBooked
                  ? "bg-emerald-600 text-white"
                  : "bg-gold-500 hover:bg-gold-400 text-neutral-950 hover:shadow-[0_0_20px_rgba(197,160,89,0.5)]"
              }`}
            >
              {isBooked ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Viewing Request Reserved</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Book Private Salon Viewing</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isFavorited
                  ? "border-rose-500 bg-rose-500/20 text-rose-400"
                  : "border-neutral-800 hover:border-gold-500/40 bg-neutral-900 text-neutral-300"
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
