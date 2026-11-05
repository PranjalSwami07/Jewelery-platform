import { Router } from "express";
import { createProductAdmin } from "../controllers/productController.js";
import { verifyAuthToken, requireAdmin } from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = Router();

// Protect all admin endpoints with authentication and ADMIN role check
router.use(verifyAuthToken);
router.use(requireAdmin);

// POST /api/admin/products with multipart images (up to 5 images per piece)
router.post(
  "/products",
  uploadMiddleware.array("images", 5),
  createProductAdmin
);

export default router;
