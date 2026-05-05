import express from "express";
import { getDashboardStats, getSalesReport, getAllOrders, updateOrderStatus, getPendingReturnCount } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, admin, getDashboardStats);
router.get("/sales-report", protect, admin, getSalesReport);
router.get("/orders", protect, admin, getAllOrders);
router.get("/returns/count", protect, admin, getPendingReturnCount);
router.put("/orders/:orderId/status", protect, admin, updateOrderStatus);

export default router;

