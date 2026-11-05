import rateLimit from "express-rate-limit";

// Rate limiter for AI Concierge: max 10 requests per 15 minutes per IP
export const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Concierge limit reached",
    message: "Our master gemologists are currently inundated with private inquiries. Please pause for a few moments before submitting further questions.",
  },
});

// Rate limiter for contact inquiry submissions: max 5 requests per 15 minutes
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Inquiry frequency exceeded",
    message: "You have submitted multiple salon viewing requests. Our client advisor has received your details and will reach out shortly.",
  },
});
