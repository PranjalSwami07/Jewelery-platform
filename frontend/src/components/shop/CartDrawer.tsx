import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import confetti from "canvas-confetti";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartCount,
    cartTotal,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "VENDOME") {
      setDiscountPercent(0.05); // 5% VIP discount
      setPromoMessage("✓ VIP Concierge discount (5%) applied");
    } else {
      setDiscountPercent(0);
      setPromoMessage("Code not recognized. Use 'VENDOME'");
    }
  };

  const discountAmount = cartTotal * discountPercent;
  const finalTotal = cartTotal - discountAmount;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C5A059", "#FAF7EE", "#E8D7AA", "#ffffff"],
        });
      } catch (err) {
        // fallback
      }
    }, 1200);
  };

  const handleResetOrder = () => {
    setOrderComplete(false);
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-in Drawer */}
      <div className="relative w-full max-w-md bg-neutral-950 border-l border-gold-500/25 h-full flex flex-col z-10 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gold-500/20 flex items-center justify-between bg-gold-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-400/40 flex items-center justify-center bg-gold-950/50">
              <ShoppingBag className="w-5 h-5 text-gold-300" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-gold-100 font-medium">
                Maison Shopping Bag
              </h3>
              <p className="text-[11px] text-gold-400/80 font-sans tracking-widest uppercase">
                {cartCount} {cartCount === 1 ? "Creation" : "Creations"} Selected
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-neutral-400 hover:text-gold-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Completed View */}
        {orderComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-300 mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-2xl text-gold-100">
              Félicitations! Your Acquisition is Reserved
            </h4>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Order #MDE-883921 has been submitted to our Place Vendôme master goldsmith atelier. A private client director will contact you immediately to coordinate insured armored courier delivery.
            </p>
            <button
              onClick={handleResetOrder}
              className="mt-6 px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-widest transition-all"
            >
              Continue Exploring Collection
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Bag View */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-neutral-600 stroke-[1.5]" />
            <h4 className="font-serif text-xl text-neutral-300">Your bag is empty</h4>
            <p className="text-xs text-neutral-400 max-w-xs font-sans">
              Explore our graduated rivière necklaces, solitaires, and bespoke creations to add to your collection.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="px-5 py-2.5 rounded-full border border-gold-500/40 text-gold-300 text-xs uppercase tracking-wider hover:bg-gold-950/40"
            >
              Discover High Jewelry
            </button>
          </div>
        ) : (
          /* Non-Empty Cart View */
          <>
            {/* Free Armored Courier Progress Indicator */}
            <div className="px-6 py-3 bg-gold-950/30 border-b border-gold-500/10 flex items-center gap-2.5 text-xs text-gold-300 font-sans">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Complimentary Insured Armored Courier Unlocked</span>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-900">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedMetal}`} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.alt}
                    className="w-20 h-24 object-cover rounded-xl border border-gold-500/20 bg-neutral-900 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-medium text-gold-100 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedMetal)}
                          className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-gold-400/80 font-mono mt-0.5">
                        {item.selectedMetal} • {item.product.caratWeight}
                      </div>

                      <div className="font-serif text-sm font-semibold text-gold-200 mt-1">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedMetal, item.quantity - 1)
                          }
                          className="p-1 hover:text-gold-300 text-neutral-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-neutral-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedMetal, item.quantity + 1)
                          }
                          className="p-1 hover:text-gold-300 text-neutral-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[10px] text-neutral-500 font-sans">
                        GIA Certified
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code & Summary Footer */}
            <div className="p-6 border-t border-gold-500/20 bg-black/60 space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="VIP Promo (e.g. VENDOME)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 uppercase placeholder:normal-case placeholder:text-neutral-500 focus:outline-none focus:border-gold-400"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl border border-gold-500/40 text-gold-300 hover:bg-gold-500/20 text-xs font-medium uppercase tracking-wider"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <div
                  className={`text-[11px] font-mono ${
                    discountPercent > 0 ? "text-emerald-400" : "text-neutral-400"
                  }`}
                >
                  {promoMessage}
                </div>
              )}

              {/* Price rows */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200">${cartTotal.toLocaleString()}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Salon Privilege (5%)</span>
                    <span className="font-mono">-${discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Insured Armored Freight</span>
                  <span className="text-emerald-400 uppercase font-mono text-[10px]">Complimentary</span>
                </div>

                <div className="flex justify-between font-serif text-lg text-gold-100 font-semibold pt-2 border-t border-neutral-900">
                  <span>Acquisition Total</span>
                  <span className="text-gold-200">${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Securing Vault Allocation...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Private Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
