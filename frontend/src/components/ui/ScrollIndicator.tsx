import React from "react";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  label?: string;
  onClick?: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  label = "Scroll to Explore Haute Joaillerie",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="inline-flex flex-col items-center gap-3 cursor-pointer group select-none transition-all duration-300"
    >
      <div className="text-[11px] tracking-[0.3em] uppercase text-gold-300/80 font-sans group-hover:text-gold-200 transition-colors">
        {label}
      </div>
      <div className="w-6 h-10 rounded-full border border-gold-500/30 flex items-start justify-center p-1.5 backdrop-blur-sm bg-black/20 group-hover:border-gold-400 transition-all">
        <div className="w-1.5 h-2.5 rounded-full bg-gold-400 animate-bounce transition-transform" />
      </div>
      <ChevronDown className="w-4 h-4 text-gold-400/60 -mt-1 group-hover:text-gold-300 transition-colors animate-pulse" />
    </div>
  );
};

export default ScrollIndicator;
