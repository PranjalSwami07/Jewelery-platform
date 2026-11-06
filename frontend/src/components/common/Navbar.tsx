import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Menu, X, Gem } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  onOpenConcierge?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConcierge }) => {
  const { wishlist } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Boutique Catalog", href: "#boutique" },
    { label: "3D Arc Spectrum", href: "#morph-hero" },
    { label: "Macro Loupe", href: "#magnifier" },
    { label: "Bespoke Configurator", href: "#configurator" },
    { label: "Heritage", href: "#heritage" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-black/85 backdrop-blur-md border-b border-gold-500/15 py-3 shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full border border-gold-400/40 flex items-center justify-center bg-gold-950/40 group-hover:border-gold-300 transition-colors shadow-inner">
            <Gem className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-lg md:text-xl tracking-[0.22em] uppercase text-gold-100 font-medium">
              Maison d'Élégance
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-gold-400/80 font-sans -mt-1">
              Haute Joaillerie • Mumbai & New Delhi
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-gold-300 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-400 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Wishlist Link */}
          <a
            href="#boutique"
            className="relative p-2 text-neutral-300 hover:text-rose-400 transition-colors"
            title="Saved Creations"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500/90 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </a>

          {/* AI Concierge */}
          <button
            onClick={onOpenConcierge}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/40 bg-gold-500/15 hover:bg-gold-500/25 text-gold-200 text-xs font-medium tracking-wider transition-all hover:border-gold-300 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>AI Concierge</span>
          </button>

          {/* Mobile Menu Burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-gold-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-b border-gold-500/20 px-6 py-6 flex flex-col gap-4 backdrop-blur-xl animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest text-neutral-200 hover:text-gold-400 py-2"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenConcierge?.();
            }}
            className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-full border border-gold-500/40 bg-gold-500/20 text-gold-200 text-sm font-medium tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Open AI Jewelry Concierge</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
