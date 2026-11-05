import { Router } from "express";
import { handleChatInquiry } from "../controllers/chatController.js";
import { chatRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Rate-limited Gemini AI Concierge endpoint
router.post("/", chatRateLimiter, handleChatInquiry);

export default router;
