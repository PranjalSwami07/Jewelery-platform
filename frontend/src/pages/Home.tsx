import React, { useState } from "react";
import { Sparkles, Gem, Award, ArrowUpRight, Compass, Shield, ShoppingBag, Eye } from "lucide-react";
import { BackgroundCanvas } from "@/components/3d/BackgroundCanvas";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { AIChatDrawer } from "@/components/ui/AIChatDrawer";
import { DiamondMagnifier } from "@/components/interactive/DiamondMagnifier";
import { CaratConfigurator } from "@/components/interactive/CaratConfigurator";
import { ParallaxBanner } from "@/components/interactive/ParallaxBanner";
import TiltedGridHeroDemo from "@/components/ui/demo";
import { JEWELRY_CATALOG } from "@/data/jewelryData";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { ProductQuickViewModal } from "@/components/shop/ProductQuickViewModal";
import { AppointmentModal } from "@/components/common/AppointmentModal";
import { JewelryItem } from "@/types/jewelry";

export const Home: React.FC = () => {
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<JewelryItem | null>(null);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [appointmentCity, setAppointmentCity] = useState("Mumbai");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInspect = (product: JewelryItem) => {
    setQuickViewProduct(product);
  };

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden selection:bg-gold-500/20 selection:text-gold-200">
      {/* Fixed 3D Canvas Background reacting dynamically to scroll and mouse */}
      <BackgroundCanvas />

      {/* Haute Joaillerie Navigation */}
      <Navbar onOpenConcierge={() => setIsConciergeOpen(true)} />

      {/* ── 1. LUXURY HERO SECTION WITH SCROLL ANIMATION ──────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-24 pb-16">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-950/40 backdrop-blur-md mb-6 sm:mb-8 animate-fadeIn">
            <Gem className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-gold-300 font-sans">
              Haute Joaillerie • Mumbai & Jaipur Ateliers
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-serif text-gold-100 tracking-tight leading-[1.08] font-normal drop-shadow-2xl">
            L'Art de la
            <br />
            <span className="italic font-light bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
              Lumière Éternelle
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="mt-6 sm:mt-8 text-neutral-300 max-w-2xl text-sm sm:text-lg font-sans font-light tracking-wide leading-relaxed px-2">
            Where heritage French goldsmithing converges with 3D spatial optics. Discover graduated diamond rivières, 58-facet halo solitaires, and museum-grade masterworks with real-time macro inspection.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <button
              onClick={() => scrollToSection("boutique")}
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-neutral-950 text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(197,160,89,0.4)] hover:scale-105 active:scale-95"
            >
              <Gem className="w-4 h-4" />
              <span>Explore Boutique</span>
            </button>

            <button
              onClick={() => scrollToSection("morph-hero")}
              className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border border-gold-500/40 bg-black/40 hover:bg-gold-950/40 text-gold-200 text-xs font-medium uppercase tracking-widest transition-all duration-300 backdrop-blur-sm active:scale-95"
            >
              Explore 3D Arc Spectrum
            </button>

            <button
              onClick={() => setIsConciergeOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-neutral-800 bg-neutral-950/60 hover:border-gold-500/40 text-neutral-300 text-xs font-medium uppercase tracking-widest transition-all duration-300 backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>AI Concierge</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ScrollIndicator onClick={() => scrollToSection("morph-hero")} />
        </div>
      </section>

      {/* ── 2. SECTION AFTER SCROLL HERO: 3D CYLINDRICAL TILTED GRID SPECTRUM ── */}
      <section id="morph-hero" className="relative py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <TiltedGridHeroDemo />
      </section>

      {/* ── 3. E-COMMERCE BOUTIQUE CATALOG (EASY, INTUITIVE CLOTHING-STYLE SHOPPING) ── */}
      <ShopCatalog
        onQuickView={(p) => setQuickViewProduct(p)}
        onInspect={handleInspect}
      />

      {/* ── 4. MULTI-CREATION MACRO LOUPE ATELIER (SMOOTH FOR ALL JEWELRY) ── */}
      <section id="magnifier" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <DiamondMagnifier />
      </section>

      {/* ── 5. BESPOKE ATELIER & CARAT CONFIGURATOR ─────────────────── */}
      <section id="configurator" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-950/30 text-gold-400 text-xs uppercase tracking-[0.25em] mb-4">
            <Award className="w-3.5 h-3.5" /> Bespoke Commission
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-gold-100 leading-tight">
            Haute Joaillerie Atelier Configurator
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base font-sans">
            Tailor diamond carat weights, simulate 18K gold and platinum metallurgy reflections, and commission your private heirloom.
          </p>
        </div>

        {/* Bespoke Carat & Metal Customizer */}
        <CaratConfigurator />

        {/* Parallax Banner */}
        <ParallaxBanner />
      </section>

      {/* ── 6. ATELIER HERITAGE ACCENTS ──────────────────────────────── */}
      <section className="relative py-20 px-6 max-w-5xl mx-auto text-center border-t border-gold-500/15">
        <Shield className="w-8 h-8 text-gold-400 mx-auto mb-4" />
        <h3 className="text-3xl font-serif text-gold-100">
          The Maison Guarantee of Provenance
        </h3>
        <p className="mt-4 text-neutral-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Every gemstone placed within our graduated rivières, solitaires, and bespoke creations is laser-inscribed with a microscopic hallmark, accompanied by GIA/SSEF certificates and full mine-to-finger ethical traceability.
        </p>
      </section>

      {/* ── 7. QUICK VIEW MODAL (WITH EMBEDDED SMOOTH LOUPE FOR ANY PRODUCT) ── */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onBookViewing={(product) => {
          setAppointmentCity("Mumbai");
          setIsAppointmentOpen(true);
        }}
      />

      {/* ── 8. AI CONCIERGE DRAWER ───────────────────────────────────── */}
      <AIChatDrawer
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        onOpenAppointment={(city) => {
          if (city) setAppointmentCity(city);
          setIsAppointmentOpen(true);
        }}
      />

      {/* ── 9. GLOBAL SALON APPOINTMENT MODAL ────────────────────────── */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        preselectedCity={appointmentCity}
      />

      {/* ── 10. LUXURY FOOTER ────────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default Home;
