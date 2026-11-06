import React from "react";
import { Gem, ShieldCheck, Award, Sparkles, MapPin, Mail, Phone } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer id="heritage" className="relative border-t border-gold-500/20 bg-black/95 text-neutral-300 pt-16 pb-12 overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gold-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Value pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gold-500/15 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center bg-gold-950/30">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif text-gold-100 text-base">Ethical Conflict-Free Gems</h4>
              <p className="text-xs text-neutral-400">Kimberley Process & RJC Certified</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center bg-gold-950/30">
              <Award className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif text-gold-100 text-base">Master Goldsmith Heritage</h4>
              <p className="text-xs text-neutral-400">Handcrafted in Mumbai & Jaipur ateliers since 1928</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center bg-gold-950/30">
              <Sparkles className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif text-gold-100 text-base">Lifetime Atelier Warranty</h4>
              <p className="text-xs text-neutral-400">Annual ultrasonic cleaning & inspection</p>
            </div>
          </div>
        </div>

        {/* Navigation & Address links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gem className="w-5 h-5 text-gold-400" />
              <span className="font-serif text-lg tracking-[0.2em] text-gold-100 uppercase">
                Maison d'Élégance
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Maison d'Élégance fuses century-old French jewelry craftsmanship with cutting-edge 3D interactive atelier previews.
            </p>
            <div className="mt-4 text-xs text-gold-300 font-serif italic">
              "L'art de la lumière éternelle"
            </div>
          </div>

          {/* Salons */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] text-gold-300 mb-4 font-sans">
              Flagship Indian Salons
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <span>The Taj Mahal Palace, Colaba, Mumbai 400001</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <span>The Leela Palace, Chanakyapuri, New Delhi 110023</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <span>Rambagh Palace Heritage Atelier, Jaipur 302005</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <span>The Collection, UB City, Bengaluru 560001</span>
              </li>
            </ul>
          </div>

          {/* Haute Joaillerie */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] text-gold-300 mb-4 font-sans">
              Curated Collections
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#corridor" className="hover:text-gold-300 transition-colors">Étoile Solitaire Collection</a></li>
              <li><a href="#corridor" className="hover:text-gold-300 transition-colors">Imperial Emerald Rivière</a></li>
              <li><a href="#corridor" className="hover:text-gold-300 transition-colors">Royal Velvet Sapphires</a></li>
              <li><a href="#magnifier" className="hover:text-gold-300 transition-colors">High Jewelry Macro Loupe</a></li>
              <li><a href="#configurator" className="hover:text-gold-300 transition-colors">Custom Carat & Metal Atelier</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] text-gold-300 mb-4 font-sans">
              Private Gazette
            </h5>
            <p className="text-xs text-neutral-400 mb-3">
              Receive confidential invitations to rare gem unveilings and private salon viewings.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter private email"
                className="bg-neutral-900 border border-gold-500/30 rounded-full px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 flex-1 focus:outline-none focus:border-gold-400"
              />
              <button className="px-4 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-neutral-950 font-medium text-xs tracking-wider uppercase transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gold-500/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Maison d'Élégance Haute Joaillerie S.A. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300">Terms of Bespoke Sale</a>
            <a href="#" className="hover:text-neutral-300">Kimberley Process Declaration</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
