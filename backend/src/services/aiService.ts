import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey && apiKey !== "demo_key" ? new GoogleGenerativeAI(apiKey) : null;

const HIGH_JEWELRY_SYSTEM_PROMPT = `
You are the Private Client Concierge and Senior Gemologist of "Maison d'Élégance", an elite Haute Joaillerie atelier with private salons in Mumbai (The Taj Mahal Palace), New Delhi (The Leela Palace), Jaipur (Rambagh Palace), and Bengaluru.
Your tone is sophisticated, polite, discrete, and knowledgeable in haute horlogerie, precious stones, metallurgy, and diamond grading (GIA/SSEF standards).

Key Knowledge Base:
- "The Graduated Rivière Diamond Necklace": 36.80 Total Carats, 51 matched round brilliants, Platinum 950, D-E Color, Flawless to VVS1.
- "L'Impératrice Pear Diamond Cascade Collier": 44.20 Total Carats, 7.50 ct D-Flawless pear cut center pendant.
- "The Étoile 58-Facet Halo Solitaire Ring": 3.85 Total Carats, rose gold milgrain inner halo, platinum shank.
- Metals: Platinum 950 (950/1000 Pt), 18K Yellow Gold (750/1000 Au), 18K Rose Gold, 18K White Gold.
- We offer bespoke private salon viewing by appointment in Mumbai, New Delhi, Jaipur, and Bengaluru.
- We do not discuss cheap commercial jewelry; we deal in museum-grade, ethical RJC & Kimberley Process certified creations.

Respond gracefully in 2 to 4 sentences, offering to arrange private salon viewing or gemological certificates when appropriate.
`;

export const generateConciergeResponse = async (userPrompt: string): Promise<string> => {
  if (!genAI) {
    // Intelligent fallback response when GEMINI_API_KEY is in development demo mode
    const lower = userPrompt.toLowerCase();
    if (lower.includes("riviere") || lower.includes("necklace")) {
      return "Our Graduated Rivière Diamond Necklace features 51 perfectly calibrated Type IIa brilliant diamonds totaling 36.80 carats, individually seated in low-profile platinum baskets to capture uninterrupted light. May I arrange a private salon viewing for you in Mumbai or New Delhi?";
    }
    if (lower.includes("halo") || lower.includes("solitaire") || lower.includes("ring")) {
      return "The Étoile 58-Facet Halo Solitaire highlights an exceptional D-color diamond framed by an 18K rose gold milgrain inner gallery. Each facet is cut to exacting Hearts & Arrows symmetry.";
    }
    if (lower.includes("salon") || lower.includes("appointment") || lower.includes("mumbai") || lower.includes("delhi") || lower.includes("jaipur")) {
      return "I would be delighted to reserve an exclusive salon viewing for you at our private suite at The Taj Mahal Palace, Mumbai or in New Delhi. Our private client director will ensure Champagne hospitality and a curated showcase.";
    }
    return `Thank you for your inquiry regarding "${userPrompt}". Maison d'Élégance's master gemologists are at your disposal to share our GIA dossiers and bespoke commission possibilities.`;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: HIGH_JEWELRY_SYSTEM_PROMPT,
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    return response.text() || "Our atelier is at your full disposal.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Our senior gemologist is reviewing your bespoke request. Please allow our salon concierge to prepare your tailored portfolio.";
  }
};
