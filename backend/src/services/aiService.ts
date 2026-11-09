import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey && apiKey !== "demo_key" ? new GoogleGenerativeAI(apiKey) : null;

const HIGH_JEWELRY_SYSTEM_PROMPT = `
You are the Private Client Concierge and Senior Gemological Advisor of "Maison d'Élégance", an elite Haute Joaillerie atelier with private salons in Mumbai (The Taj Mahal Palace, Colaba), New Delhi (The Leela Palace, Chanakyapuri), Jaipur (Rambagh Palace Heritage Atelier), and Bengaluru (The Collection, UB City).
Your tone is sophisticated, polite, discrete, and knowledgeable in haute joaillerie, rare unheated gemstones, precious metallurgy, and diamond grading (GIA/SSEF standards).

Key Knowledge Base:
- "The Graduated Rivière Diamond Necklace": 36.80 Total Carats, 51 matched Type IIa round brilliants, Platinum 950, D-E Color, Flawless to VVS1 ($84,500).
- "L'Impératrice Pear Diamond Cascade Collier": 44.20 Total Carats, 7.50 ct D-Flawless pear cut center pendant ($118,000).
- "The Étoile 58-Facet Halo Solitaire Ring": 3.85 Total Carats, rose gold milgrain inner halo, platinum shank ($38,200).
- "Artisan Cascade Chandelier Drop Earrings": 14.60 Total Carats of articulating rosettes ($46,000).
- Metals: Platinum 950 (950/1000 Pt, hypoallergenic, maximum prong security), 18K Yellow Gold (750/1000 Au, rich warm glow), 18K Rose Gold, 18K White Gold.
- Private Salons: Exclusive private suites with Champagne hospitality by appointment in Mumbai, New Delhi, Jaipur, and Bengaluru.
- Bespoke Commissions: 6 to 10 weeks hand-sketching gouache, sourcing unheated Kashmir sapphires/Golconda diamonds, lost-wax casting, and laser hallmarking.
- Ethical Sourcing: RJC and Kimberley Process certified 100% conflict-free.

Always provide helpful, refined, and conversational answers. Offer to arrange a private salon viewing or gemological consultation when relevant.
`;

export const generateConciergeResponse = async (userPrompt: string): Promise<string> => {
  const query = userPrompt.trim().toLowerCase();

  // Try real Gemini API first if configured
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: HIGH_JEWELRY_SYSTEM_PROMPT,
      });

      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      const text = response.text();
      if (text) return text;
    } catch (error) {
      console.warn("Gemini API call failed, switching to expert concierge engine:", error);
    }
  }

  // --- High-End Native Conversational Intelligence Engine ---
  // 1. HELP & GREETINGS ("ok i need ur help", "can you help me", "hello", "hi")
  if (
    /^(ok\s*)?(i\s*need\s*(ur|your)\s*help|help\s*me|can\s*you\s*help|i\s*need\s*help|need\s*assistance|assist\s*me|help)$/i.test(query) ||
    /^(ok\s+)?(i\s*need\s*(ur|your)\s*help)/i.test(query)
  ) {
    return "I am completely at your service. Whether you are seeking advice on selecting an exceptional diamond, understanding the 4Cs and GIA certification, arranging a private salon appointment in Mumbai or New Delhi, or commissioning a bespoke heirloom piece, please tell me what you have in mind.";
  }

  if (/^(hi|hello|hey|namaste|bonjour|good\s*(morning|afternoon|evening)|greetings|hola)\b/i.test(query)) {
    return "Namaste and a warm welcome to Maison d'Élégance. I am your Private Client Concierge and Senior Gemological Advisor. How may I assist you with our Haute Joaillerie creations, bespoke commissions, or private salon arrangements today?";
  }

  // 2. APPOINTMENTS & SALONS (Mumbai, New Delhi, Jaipur, Bengaluru)
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
    query.includes("suite")
  ) {
    let locationDetails = "our sea-facing private salon suite at The Taj Mahal Palace, Colaba, Mumbai";
    if (query.includes("delhi")) locationDetails = "our diplomatic suite at The Leela Palace, Chanakyapuri, New Delhi";
    if (query.includes("jaipur")) locationDetails = "our heritage atelier at Rambagh Palace, Jaipur";
    if (query.includes("bengaluru") || query.includes("bangalore")) locationDetails = "our salon suite at The Collection, UB City, Bengaluru";

    return `I would be honored to reserve a private salon viewing for you at ${locationDetails}. During your visit, our Senior Gemologist will present your requested creations with Champagne hospitality, GIA dossier reviews, and tactile 58-facet loupe inspection. May I proceed with arranging your preferred date and time?`;
  }

  // 3. DIAMONDS & 4Cs (Hearts & Arrows, Carat, Clarity, Color, Type IIa, GIA)
  if (
    query.includes("4c") ||
    query.includes("carat") ||
    query.includes("clarity") ||
    query.includes("color") ||
    query.includes("cut") ||
    query.includes("type iia") ||
    query.includes("type 2a") ||
    query.includes("hearts") ||
    query.includes("gia") ||
    query.includes("grading")
  ) {
    if (query.includes("type iia") || query.includes("type 2a")) {
      return "Type IIa diamonds represent less than 2% of all mined diamonds globally. Containing zero measurable nitrogen impurities, they boast extraordinary optical purity and spectral fire, historically celebrated in Golconda diamonds. Maison d'Élégance sources Type IIa stones for our premier solitaire and rivière creations.";
    }
    return "Every diamond in our collection adheres to GIA triple-excellent standards: Color (D–E colorless spectrum), Clarity (Flawless to VVS1), and Cut (58 mathematically calibrated facets ensuring Hearts & Arrows optical symmetry without light leakage). Each piece is accompanied by full GIA dossiers and microscopic laser inscriptions.";
  }

  // 4. SPECIFIC PIECES (Rivière, Étoile, Collier, Earrings)
  if (query.includes("riviere") || query.includes("necklace") || query.includes("collier")) {
    return "Our Graduated Rivière Diamond Necklace ($84,500) features 51 perfectly calibrated Type IIa brilliant diamonds totaling 36.80 carats, seated in low-profile Platinum 950 baskets for a fluid, skin-contouring drape. We also present L'Impératrice Pear Diamond Collier ($118,000, 44.20 ct) with a 7.50 ct D-Flawless pear cut drop. Would you like to inspect either under our Macro Loupe?";
  }

  if (query.includes("solitaire") || query.includes("etoile") || query.includes("étoile") || query.includes("ring")) {
    return "The Étoile 58-Facet Halo Solitaire Ring ($38,200) highlights an exceptional 3.20 ct D-color center diamond framed by an 18K rose gold milgrain inner gallery on a solid Platinum 950 shank. It delivers breathtaking brilliance and timeless finger presence.";
  }

  // 5. BESPOKE COMMISSIONS & CUSTOM CREATION
  if (query.includes("bespoke") || query.includes("commission") || query.includes("custom") || query.includes("design")) {
    return "Our bespoke commission process begins with a personal consultation with our Creative Director. We hand-paint gouache renderings, source unheated Kashmir sapphires, Burmese rubies, or Golconda diamonds globally, and lost-wax cast your piece in Platinum 950 or 18K gold over 6 to 10 weeks.";
  }

  // 6. METALS & ALLOY COMPARISON
  if (query.includes("metal") || query.includes("platinum") || query.includes("gold") || query.includes("18k")) {
    return "Maison d'Élégance crafts exclusively in Platinum 950 (hypoallergenic, naturally white, maximum prong security), 18K Yellow Gold (750/1000 Au, rich warm glow), 18K Rose Gold (delicate romantic blush), and 18K White Gold with rhodium finish. Platinum is our foremost recommendation for enduring heirloom rings.";
  }

  // 7. GIFTS & RECOMMENDATIONS
  if (query.includes("gift") || query.includes("wife") || query.includes("fiance") || query.includes("anniversary") || query.includes("recommend")) {
    return "For milestone anniversaries, our patrons cherish The Graduated Rivière Diamond Necklace or an articulated tennis bracelet. For engagements, The Étoile Solitaire Ring in Platinum 950 is an iconic choice. I would be delighted to curate a personalized selection based on your preferred aesthetic.";
  }

  // 8. ETHICAL SOURCING & LIFETIME GUARANTEE
  if (query.includes("ethical") || query.includes("conflict") || query.includes("clean") || query.includes("care") || query.includes("guarantee")) {
    return "Maison d'Élégance is a certified Responsible Jewellery Council (RJC) member adhering strictly to the Kimberley Process. All creations carry our Lifetime Atelier Guarantee, which includes complimentary annual ultrasonic cleaning, prong inspection, and ring sizing at our Mumbai, Delhi, and Jaipur salons.";
  }

  // 9. COURTESY / SHORT FOLLOW-UPS
  if (/^(thank\s*you|thanks|thx|great|perfect|wonderful|alright|ok|understood)\b/i.test(query)) {
    return "It is our genuine pleasure to assist you. Please let me know whenever you wish to inspect our creations under the 58-facet Macro Loupe or reserve a private salon suite in Mumbai or New Delhi.";
  }

  // 10. ARBITRARY / GENERAL QUESTIONS FALLBACK
  return "Thank you for consulting Maison d'Élégance. Our atelier specializes in museum-grade Type IIa diamonds, 58-facet optical symmetry, and bespoke commissions across Platinum 950 and 18K gold. To assist you with complete precision, would you like to explore our catalog pieces, review gemological certification, or reserve an appointment with our Senior Gemologist at our Mumbai or New Delhi salons?";
};
