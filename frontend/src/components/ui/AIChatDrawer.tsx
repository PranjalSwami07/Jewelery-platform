import React, { useState } from "react";
import { X, Send, Sparkles, Gem, Clock, ShieldCheck, User } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "concierge";
  content: string;
  timestamp: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "concierge",
      content:
        "Namaste. I am your Maison d'Élégance Private Concierge. Whether you seek guidance on GIA diamond grading, rare Kashmir sapphire acquisitions, or arranging a private salon viewing in Mumbai, New Delhi, or Jaipur, how may I assist you today?",
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const predefinedPrompts = [
    "What is the 4Cs profile of your Étoile Solitaire?",
    "How does bespoke private commission work?",
    "Schedule a private salon appointment in Mumbai or Delhi",
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              role: "concierge",
              content: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Backend server offline or in standalone mode — fallback to local luxury advisor logic
    }

    // Graceful luxury client concierge fallback
    setTimeout(() => {
      let reply = "Our Haute Joaillerie atelier is at your full disposal.";
      if (text.toLowerCase().includes("solitaire") || text.toLowerCase().includes("4c")) {
        reply = "The Étoile Solitaire features only Type IIa diamonds—the top 1-2% of all gem-quality diamonds in the world, certified Flawless to VVS1 with triple-excellent cut parameters by GIA.";
      } else if (text.toLowerCase().includes("bespoke") || text.toLowerCase().includes("commission")) {
        reply = "Our bespoke commission process begins with a one-on-one consultation with our Master Jeweler. We sketch custom gouache renderings, source unheated gemstones globally, and craft the final creation over 8 to 12 weeks.";
      } else if (
        text.toLowerCase().includes("appointment") ||
        text.toLowerCase().includes("mumbai") ||
        text.toLowerCase().includes("delhi") ||
        text.toLowerCase().includes("jaipur") ||
        text.toLowerCase().includes("salon")
      ) {
        reply = "I would be honored to reserve a private salon suite for you at The Taj Mahal Palace, Mumbai or in New Delhi. Our private client advisor will contact your concierge with champagne hospitality.";
      } else {
        reply = `Thank you for your inquiry regarding "${text}". Our senior gemologist and private salon director will prepare a bespoke portfolio tailored to your exact specifications.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "concierge",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full sm:max-w-md bg-neutral-950/95 border-l border-gold-500/25 h-full flex flex-col z-10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gold-500/20 flex items-center justify-between bg-gold-950/20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold-400/50 flex items-center justify-center bg-gold-950/50 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold-300" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg text-gold-100 font-medium">
                Maison AI Concierge
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gold-400/80 font-sans tracking-widest uppercase">
                24/7 Haute Joaillerie Advisor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-neutral-400 hover:text-gold-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gold-500/20 text-gold-100 border border-gold-500/30 rounded-br-none"
                    : "bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-bl-none shadow-md"
                }`}
              >
                {m.content}
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 font-mono px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gold-400 text-xs italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Consulting atelier gemologists...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 sm:px-6 py-2 border-t border-gold-500/10 flex flex-wrap gap-1.5 sm:gap-2">
          {predefinedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] sm:text-[11px] text-gold-300/85 hover:text-gold-100 bg-black/40 hover:bg-gold-950/40 border border-gold-500/25 px-2.5 py-1 rounded-full transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 border-t border-gold-500/20 bg-black/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about carats, certification, salons..."
              className="flex-1 bg-neutral-900 border border-gold-500/30 rounded-full px-4 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-gold-400 transition-colors"
            />
            <button
              type="submit"
              className="p-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-neutral-950 transition-colors flex items-center justify-center shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatDrawer;
