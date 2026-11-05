import { Router } from "express";
import { handleContactSubmission } from "../controllers/contactController.js";
import { contactRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Rate-limited contact inquiry endpoint for private salon appointments
router.post("/", contactRateLimiter, handleContactSubmission);

export default router;
