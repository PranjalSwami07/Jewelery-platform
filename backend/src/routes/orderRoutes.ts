import { Router } from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import { verifyAuthToken } from "../middleware/authMiddleware.js";

const router = Router();

router.use(verifyAuthToken);

router.post("/", createOrder);
router.get("/my-orders", getUserOrders);

export default router;

