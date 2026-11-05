import { Router } from "express";
import { syncUserProfile } from "../controllers/authController.js";
import { verifyAuthToken } from "../middleware/authMiddleware.js";

const router = Router();

router.use(verifyAuthToken);

router.post("/sync", syncUserProfile);

export default router;

