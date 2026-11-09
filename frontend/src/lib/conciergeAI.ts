/**
 * Maison d'Élégance - Haute Joaillerie Conversational Intelligence Engine
 * Provides discrete, sophisticated, and comprehensive expert gemological & concierge advice.
 */

export interface ChatMessage {
  role: "user" | "concierge";
  content: string;
  timestamp?: string;
  action?: {
    type: "appointment" | "catalog" | "loupe";
    label: string;
    city?: string;
  };
}

export interface ConciergeAnswer {
  reply: string;
  action?: {
    type: "appointment" | "catalog" | "loupe";
    label: string;
    city?: string;
  };
  suggestedFollowUps?: string[];
}

export function generateSmartConciergeReply(
  userText: string,
  history: ChatMessage[] = []
): ConciergeAnswer {
  const query = userText.trim().toLowerCase();

  // Extract recent context from history (e.g. if previous messages mentioned Mumbai, a ring, etc.)
  const recentHistoryText = history
    .slice(-4)
    .map((m) => m.content.toLowerCase())
    .join(" ");

  // 1. GREETINGS & INTENT TO RECEIVE HELP ("ok i need ur help", "can you help me", "hello", "hi")
  if (
    /^(ok\s*)?(i\s*need\s*(ur|your)\s*help|help\s*me|can\s*you\s*help|i\s*need\s*help|need\s*assistance|assist\s*me|help)$/i.test(
      query
    ) ||
    /^(ok\s+)?(i\s*need\s*(ur|your)\s*help)/i.test(query)
  ) {
    return {
      reply:
        "I am completely at your service. Whether you are seeking advice on selecting an exceptional diamond, understanding the 4Cs and GIA certification, arranging a private salon appointment in Mumbai or New Delhi, or commissioning a bespoke heirloom piece, please tell me what you have in mind.",
      suggestedFollowUps: [
        "Guide me on selecting an engagement ring",
        "Book a private salon suite in Mumbai",
        "Explain the 4Cs of diamond grading",
        "How do custom bespoke commissions work?",
      ],
    };
  }

  if (
    /^(hi|hello|hey|namaste|bonjour|good\s*(morning|afternoon|evening)|greetings|hola)\b/i.test(
      query
    )
  ) {
    return {
      reply:
        "Namaste and a warm welcome to Maison d'Élégance. I am your Private Client Concierge and Senior Gemological Advisor. How may I assist you with our Haute Joaillerie creations, bespoke commissions, or private salon arrangements today?",
      suggestedFollowUps: [
        "Explore Iconic Rivière Necklaces",
        "Book a Private Salon Viewing in Mumbai",
        "What makes Type IIa diamonds rare?",
      ],
    };
  }

  // 2. APPOINTMENTS & PRIVATE SALONS (Mumbai, New Delhi, Jaipur, Bengaluru, Hyderabad, Kolkata)
  if (
    query.includes("mumbai") ||
    query.includes("delhi") ||
    query.includes("jaipur") ||
    query.includes("bengaluru") ||
    query.includes("bangalore") ||
    query.includes("hyderabad") ||
    query.includes("kolkata") ||
    query.includes("salon") ||
    query.includes("appointment") ||
    query.includes("viewing") ||
    query.includes("visit") ||
    query.includes("suite") ||
    query.includes("reserve") ||
    query.includes("schedule")
  ) {
    let city = "Mumbai";
    let locationDetails =
      "our private sea-facing salon suite at The Taj Mahal Palace, Colaba, Mumbai";

    if (query.includes("delhi")) {
      city = "New Delhi";
      locationDetails =
        "our private diplomatic suite at The Leela Palace, Chanakyapuri, New Delhi";
    } else if (query.includes("jaipur")) {
      city = "Jaipur";
      locationDetails =
        "our heritage atelier at Rambagh Palace, Jaipur, housing our archival Golconda and royal bridal collection";
    } else if (query.includes("bengaluru") || query.includes("bangalore")) {
      city = "Bengaluru";
      locationDetails =
        "our private salon suite at The Collection, UB City, Bengaluru";
    } else if (query.includes("hyderabad")) {
      city = "Hyderabad";
      locationDetails =
        "our private royal suite at Taj Falaknuma Palace, Hyderabad";
    } else if (query.includes("kolkata")) {
      city = "Kolkata";
      locationDetails =
        "our heritage salon suite on Camac Street / Park Street, Kolkata";
    }

    return {
      reply: `I would be delighted to arrange an exclusive private viewing for you at ${locationDetails}. During your visit, our Senior Gemologist will present your requested creations with Champagne hospitality, GIA dossier dossiers, and tactile 58-facet loupe inspection. Would you like to confirm a viewing slot?`,
      action: {
        type: "appointment",
        label: `Book Private Salon Viewing (${city})`,
        city,
      },
      suggestedFollowUps: [
        `Reserve appointment in ${city}`,
        "What creations can I view during the appointment?",
        "What are your private salon hours?",
      ],
    };
  }

  // 3. DIAMOND 4Cs, CUTS, & GEMOLOGY (Hearts & Arrows, Carat, Clarity, Color, Type IIa, GIA)
  if (
    query.includes("4c") ||
    query.includes("carat") ||
    query.includes("clarity") ||
    query.includes("color") ||
    query.includes("cut") ||
    query.includes("facet") ||
    query.includes("type iia") ||
    query.includes("type 2a") ||
    query.includes("hearts and arrows") ||
    query.includes("gia") ||
    query.includes("ssef") ||
    query.includes("grading") ||
    query.includes("certification")
  ) {
    if (query.includes("type iia") || query.includes("type 2a")) {
      return {
        reply:
          "Type IIa diamonds represent less than 1.5% to 2% of all mined diamonds in the world. They contain zero detectable nitrogen impurities, producing extraordinary optical transparency and pure light dispersion reminiscent of historic Golconda diamonds. Maison d'Élégance sources Type IIa stones for our premier solitaire and rivière commissions.",
        suggestedFollowUps: [
          "View The Graduated Rivière Diamond Necklace",
          "What is Hearts & Arrows symmetry?",
          "How are diamonds certified?",
        ],
      };
    }

    if (query.includes("cut") || query.includes("facet") || query.includes("hearts")) {
      return {
        reply:
          "Every Maison d'Élégance diamond is cut with 58 mathematically calibrated facets to achieve flawless Hearts & Arrows optical symmetry. This precision ensures total internal reflection, dispersing light into vivid spectral fire and brilliance without light leakage through the pavilion.",
        suggestedFollowUps: [
          "Inspect diamond with 58-Facet Macro Loupe",
          "Compare Round Brilliant vs Pear Cut",
          "What clarity grade do you recommend?",
        ],
      };
    }

    return {
      reply:
        "Our creations strictly adhere to GIA triple-excellent standards across the 4Cs: Color (D–E colorless spectrum), Clarity (Flawless to VVS1 with laser-inscribed girdle provenance), Cut (58-facet optical symmetry), and Carats (from 2 ct solitaires up to 44 ct statement colliers). Each stone is delivered with official GIA dossiers.",
      action: {
        type: "loupe",
        label: "Activate Macro Loupe Inspection",
      },
      suggestedFollowUps: [
        "What is Type IIa diamond purity?",
        "What is the 4Cs profile of the Étoile Solitaire?",
        "Book private GIA consultation in Mumbai",
      ],
    };
  }

  // 4. SPECIFIC PIECES & CATALOG INQUIRIES (Rivière, Étoile, Collier, Earrings, Signet)
  if (
    query.includes("riviere") ||
    query.includes("necklace") ||
    query.includes("collier") ||
    query.includes("solitaire") ||
    query.includes("ring") ||
    query.includes("earring") ||
    query.includes("chandelier") ||
    query.includes("etoile") ||
    query.includes("étoile") ||
    query.includes("imperatrice") ||
    query.includes("bracelet")
  ) {
    if (query.includes("solitaire") || query.includes("etoile") || query.includes("étoile")) {
      return {
        reply:
          "The Étoile 58-Facet Halo Solitaire Ring ($38,200) features a 3.20 ct D-color center stone set in a low-profile Platinum 950 band, bordered by a subtle 18K rose gold milgrain inner gallery. It delivers exceptional scintillation and timeless finger presence.",
        action: {
          type: "catalog",
          label: "View The Étoile Solitaire",
        },
        suggestedFollowUps: [
          "Can I choose a different carat weight?",
          "Can this ring be made in Platinum 950?",
          "Reserve private salon viewing in Mumbai",
        ],
      };
    }

    if (query.includes("riviere") || query.includes("necklace")) {
      return {
        reply:
          "The Graduated Rivière Diamond Necklace ($84,500) features 51 perfectly calibrated Type IIa brilliant diamonds totaling 36.80 carats. Each stone is individually seated in hand-polished Platinum 950 baskets for a fluid, skin-contouring drape.",
        action: {
          type: "catalog",
          label: "View The Rivière Necklace",
        },
        suggestedFollowUps: [
          "Inspect Rivière with Macro Loupe",
          "What is L'Impératrice Pear Diamond Collier?",
          "Schedule viewing in New Delhi",
        ],
      };
    }

    if (query.includes("earring") || query.includes("chandelier")) {
      return {
        reply:
          "Our Artisan Cascade Chandelier Drop Earrings ($46,000) feature 14.60 total carats of articulating diamond rosettes that dance with the wearer's movements, handcrafted in featherlight Platinum 950 for effortless gala wear.",
        action: {
          type: "catalog",
          label: "View Cascade Chandelier Earrings",
        },
        suggestedFollowUps: [
          "Explore bridal suite earrings",
          "Book salon appointment in Jaipur",
        ],
      };
    }

    return {
      reply:
        "Our catalog comprises graduated rivières, 58-facet solitaires, emerald-cut cocktail rings, and articulated chandelier earrings. Every creation is certified by GIA with laser hallmarking. May I guide you to a specific category or arrange a salon showcase?",
      action: {
        type: "catalog",
        label: "Explore Salon Boutique Catalog",
      },
      suggestedFollowUps: [
        "Show me engagement solitaires",
        "Show me diamond necklaces",
        "Book private viewing in Mumbai",
      ],
    };
  }

  // 5. PRECIOUS METALS (Platinum vs Yellow Gold vs Rose Gold vs White Gold)
  if (
    query.includes("metal") ||
    query.includes("platinum") ||
    query.includes("gold") ||
    query.includes("18k") ||
    query.includes("alloy") ||
    query.includes("palladium")
  ) {
    return {
      reply:
        "Maison d'Élégance works exclusively in noble alloys: Platinum 950 (dense, hypoallergenic, holding diamonds with maximum prong security and aging into a satin patina), 18K Yellow Gold (750/1000 Au, rich warm regal glow), 18K Rose Gold (blended with copper for a soft blush romantic tone), and 18K White Gold with rhodium finish. Which alloy appeals to your aesthetic?",
      suggestedFollowUps: [
        "Is Platinum better than White Gold for rings?",
        "Can I customize a piece in 18K Rose Gold?",
        "Use Atelier Carat & Metal Configurator",
      ],
    };
  }

  // 6. BESPOKE COMMISSIONS & CUSTOM CREATIONS
  if (
    query.includes("bespoke") ||
    query.includes("commission") ||
    query.includes("custom") ||
    query.includes("design") ||
    query.includes("make my own") ||
    query.includes("craft") ||
    query.includes("tailor")
  ) {
    return {
      reply:
        "Our bespoke commissions allow private patrons to collaborate directly with our Creative Director and Master Goldsmiths in Mumbai and Jaipur. We sketch initial hand-painted gouache renderings, source rare untreated gemstones globally (such as Kashmir sapphires or Golconda diamonds), and precision-cast in Platinum 950 over 6 to 10 weeks.",
      action: {
        type: "appointment",
        label: "Request Bespoke Commission Consultation",
        city: "Mumbai",
      },
      suggestedFollowUps: [
        "How long does a bespoke piece take to craft?",
        "Can you source unheated Kashmir sapphires?",
        "Schedule appointment at Jaipur Atelier",
      ],
    };
  }

  // 7. GIFT RECOMMENDATIONS, ENGAGEMENT & WEDDING ADVICE
  if (
    query.includes("gift") ||
    query.includes("wife") ||
    query.includes("husband") ||
    query.includes("fiance") ||
    query.includes("fiancée") ||
    query.includes("engagement") ||
    query.includes("wedding") ||
    query.includes("anniversary") ||
    query.includes("recommend") ||
    query.includes("choose") ||
    query.includes("suggest")
  ) {
    if (query.includes("engagement") || query.includes("wedding") || query.includes("fiancée")) {
      return {
        reply:
          "For an unforgettable engagement, our patrons overwhelmingly favor The Étoile 58-Facet Halo Solitaire Ring or a bespoke emerald-cut diamond set in Platinum 950. We ensure every center diamond possesses exceptional Hearts & Arrows light return. May I schedule a private ring consultation for you?",
        action: {
          type: "appointment",
          label: "Book Private Engagement Consultation",
          city: "Mumbai",
        },
        suggestedFollowUps: [
          "How to determine the right ring size?",
          "What is the price of your Étoile Solitaire?",
          "Book viewing at The Leela Palace, New Delhi",
        ],
      };
    }

    if (query.includes("anniversary") || query.includes("gift")) {
      return {
        reply:
          "For a milestone anniversary or special celebration, The Graduated Rivière Diamond Necklace or an articulated tennis bracelet in Platinum 950 are classic timeless heirlooms. For a grand gala occasion, our Cascade Chandelier Earrings offer breathtaking movement and light.",
        suggestedFollowUps: [
          "View The Graduated Rivière Necklace",
          "Show me creations under $50,000",
          "Book Champagne Salon Appointment in Mumbai",
        ],
      };
    }

    return {
      reply:
        "I would be honored to curate personal recommendations for you. Could you share your preferred aesthetic—such as an understated solitaire, an iconic diamond rivière necklace, or dramatic gala chandelier earrings?",
      suggestedFollowUps: [
        "Recommend an engagement ring",
        "Recommend an anniversary gift",
        "What creations are under $50,000?",
      ],
    };
  }

  // 8. PRICING, BUDGET, AND INVESTMENT
  if (
    query.includes("price") ||
    query.includes("cost") ||
    query.includes("dollar") ||
    query.includes("how much") ||
    query.includes("budget") ||
    query.includes("under") ||
    query.includes("expensive") ||
    query.includes("worth") ||
    query.includes("value")
  ) {
    return {
      reply:
        "Our permanent Haute Joaillerie creations range from $28,500 for our cushion signet rings to $118,000 for museum colliers such as L'Impératrice Pear Diamond Collier. Bespoke high jewelry commissions with rare Golconda diamonds or unheated sapphires are individually valued by our Master Gemologist with official GIA certification.",
      action: {
        type: "catalog",
        label: "Browse Full Boutique Pricing",
      },
      suggestedFollowUps: [
        "What is the price of The Graduated Rivière?",
        "Do you offer bespoke commissions under $50,000?",
        "Book private viewing in Mumbai",
      ],
    };
  }

  // 9. CLEANING, CARE, SIZING, AND LIFETIME ATELIER GUARANTEE
  if (
    query.includes("clean") ||
    query.includes("care") ||
    query.includes("maintain") ||
    query.includes("size") ||
    query.includes("resize") ||
    query.includes("warranty") ||
    query.includes("guarantee") ||
    query.includes("repair")
  ) {
    return {
      reply:
        "All Maison d'Élégance creations carry our Lifetime Atelier Guarantee. We provide complimentary annual ultrasonic cleaning, prong tension checks, and rhodium rejuvenation at our Mumbai, Delhi, and Jaipur salons. We also provide complimentary sizing for all bespoke rings upon reservation.",
      suggestedFollowUps: [
        "How do I clean my diamond jewelry at home?",
        "Book a complimentary maintenance appointment",
        "What is the Maison Guarantee of Provenance?",
      ],
    };
  }

  // 10. ETHICAL PROVENANCE & CONFLICT-FREE SOURCING
  if (
    query.includes("ethical") ||
    query.includes("conflict") ||
    query.includes("kimberley") ||
    query.includes("rjc") ||
    query.includes("source") ||
    query.includes("provenance")
  ) {
    return {
      reply:
        "Maison d'Élégance is a certified member of the Responsible Jewellery Council (RJC) and adheres strictly to the Kimberley Process. 100% of our diamonds and colored gemstones are ethically sourced with verified mine-to-finger traceability and laser-engraved authenticity serials.",
      suggestedFollowUps: [
        "What gemological certificates are provided?",
        "Schedule salon consultation in Mumbai",
      ],
    };
  }

  // 11. SHORT AFFIRMATIVE / COURTESY FOLLOW-UPS ("thank you", "ok", "yes", "sure", "perfect")
  if (
    /^(thank\s*you|thanks|thx|merci|great|wonderful|awesome|cool|perfect|got\s*it|understood|alright)\b/i.test(
      query
    )
  ) {
    return {
      reply:
        "It is our genuine pleasure to assist you. Should you wish to inspect any creation under our 58-facet Macro Loupe or reserve private salon hospitality in Mumbai, New Delhi, or Jaipur, please let me know at any moment.",
      suggestedFollowUps: [
        "Book Private Salon Suite",
        "Inspect Solitaire with Macro Loupe",
        "Explore Boutique Catalog",
      ],
    };
  }

  if (/^(yes|sure|please|ok|yep|definitely|let's\s*do\s*it)\b/i.test(query)) {
    if (recentHistoryText.includes("mumbai") || recentHistoryText.includes("salon")) {
      return {
        reply:
          "Splendid. I will prepare your private viewing dossier. You can choose your preferred date and time at our Taj Mahal Palace salon suite right now using the booking option below.",
        action: {
          type: "appointment",
          label: "Confirm Mumbai Salon Date & Time",
          city: "Mumbai",
        },
      };
    }
    return {
      reply:
        "Delighted to proceed. Would you like me to reserve a private salon suite in Mumbai or New Delhi, or would you prefer to explore our latest high jewelry catalog?",
      suggestedFollowUps: [
        "Reserve Private Salon in Mumbai",
        "Reserve Private Salon in New Delhi",
        "Explore Boutique Catalog",
      ],
    };
  }

  // 12. NATURAL INTELLIGENT FALLBACK FOR ANY ARBITRARY QUESTION
  // Extracts key nouns/themes and crafts a dignified, helpful, non-robotic response
  return {
    reply:
      "Thank you for sharing your inquiry with Maison d'Élégance. Our atelier specializes in museum-grade Type IIa diamonds, 58-facet optical symmetry, and bespoke commissions across Platinum 950 and 18K gold. To assist you with complete precision, would you like to explore our catalog pieces, review gemological certification, or reserve an appointment with our Senior Gemologist at our Mumbai or New Delhi salons?",
    suggestedFollowUps: [
      "Book Private Salon Viewing in Mumbai",
      "Guide me through your High Jewelry Catalog",
      "Explain GIA certification & 4Cs",
      "Commission a custom bespoke piece",
    ],
  };
}

