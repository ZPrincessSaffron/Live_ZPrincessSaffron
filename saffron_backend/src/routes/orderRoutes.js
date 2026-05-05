import express from "express";
import { requestProductReturn } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders/{orderId}/return/{productId}:
 *   post:
 *     summary: Request product return
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return requested successfully
 */
router.route("/:orderId/return/:productId").post(protect, requestProductReturn);

export default router;
