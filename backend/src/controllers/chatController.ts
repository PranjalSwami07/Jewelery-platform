import { Request, Response } from "express";
import { generateConciergeResponse } from "../services/aiService.js";

export const handleChatInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        error: "Invalid inquiry",
        message: "A message string is required to consult the Private Concierge.",
      });
      return;
    }

    const reply = await generateConciergeResponse(message);

    res.status(200).json({
      success: true,
      role: "concierge",
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat controller error:", error);
    res.status(500).json({
      error: "Concierge unavailable",
      message: "Our senior gemologist is currently assisting another private client. Please try again shortly.",
    });
  }
};
