import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Menu, X, Gem, Sun, Moon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onOpenConcierge?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConcierge }) => {
  const { wishlist } = useCart();
  const { theme, isDark, toggleTheme } = useTheme();
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
          ? "bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-gold-500/20 py-3 shadow-lg shadow-black/5 dark:shadow-black/50"
          : "bg-gradient-to-b from-white/90 via-white/50 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gold-400/50 flex items-center justify-center bg-gold-500/15 dark:bg-gold-950/40 group-hover:border-gold-500 transition-colors shadow-inner shrink-0">
            <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600 dark:text-gold-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col text-left truncate">
            <span className="font-serif text-base sm:text-lg md:text-xl tracking-[0.16em] sm:tracking-[0.22em] uppercase text-stone-900 dark:text-gold-100 font-medium truncate">
              Maison d'Élégance
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.22em] sm:tracking-[0.35em] uppercase text-gold-700 dark:text-gold-400/80 font-sans -mt-0.5 sm:-mt-1 truncate max-w-[160px] sm:max-w-none">
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
              className="text-xs uppercase tracking-[0.2em] text-stone-700 dark:text-neutral-300 hover:text-gold-600 dark:hover:text-gold-300 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-500 hover:after:w-full after:transition-all font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Light / Dark Mode Toggle Switcher */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
            className="p-2 rounded-full border border-gold-500/35 bg-gold-500/10 hover:bg-gold-500/20 text-gold-700 dark:text-gold-200 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            title={`Switch to ${isDark ? "Light Mode (Palais Royal Ivory)" : "Dark Mode (Place Vendôme Noir)"}`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gold-300 animate-fadeIn" />
            ) : (
              <Moon className="w-4 h-4 text-gold-700 animate-fadeIn" />
            )}
          </button>

          {/* Wishlist Link */}
          <a
            href="#boutique"
            className="relative p-1.5 sm:p-2 text-stone-700 dark:text-neutral-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            title="Saved Creations"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </a>

          {/* AI Concierge */}
          <button
            onClick={onOpenConcierge}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-gold-500/40 bg-gold-500/15 hover:bg-gold-500/25 text-gold-800 dark:text-gold-200 text-xs font-medium tracking-wider transition-all hover:border-gold-400 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 animate-pulse shrink-0" />
            <span className="hidden xs:inline">AI Concierge</span>
            <span className="xs:hidden">AI</span>
          </button>

          {/* Mobile Menu Burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-stone-700 dark:text-neutral-300 hover:text-gold-600 dark:hover:text-gold-300 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-black/95 border-b border-gold-500/20 px-6 py-6 flex flex-col gap-4 backdrop-blur-xl animate-fadeIn shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest text-stone-800 dark:text-neutral-200 hover:text-gold-600 dark:hover:text-gold-400 py-2 font-medium"
            >
              {link.label}
            </a>
          ))}

          {/* Theme switcher inside mobile drawer */}
          <div className="pt-2 border-t border-gold-500/15 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-stone-600 dark:text-neutral-400 font-mono">
              Appearance Theme
            </span>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/35 bg-gold-500/10 text-xs font-mono font-medium text-gold-800 dark:text-gold-200 cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenConcierge?.();
            }}
            className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-full border border-gold-500/40 bg-gold-500/20 text-gold-800 dark:text-gold-200 text-sm font-medium tracking-wider cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-gold-600 dark:text-gold-400" />
            <span>Open AI Jewelry Concierge</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
