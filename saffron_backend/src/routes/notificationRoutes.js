import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markAsRead,
  clearNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notification history
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get("/", protect, getUserNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 */
router.put("/:id/read", protect, markAsRead);

/**
 * @swagger
 * /api/notifications:
 *   delete:
 *     summary: Clear all notifications for the user
 *     tags: [Notifications]
 */
router.delete("/", protect, clearNotifications);

export default router;

