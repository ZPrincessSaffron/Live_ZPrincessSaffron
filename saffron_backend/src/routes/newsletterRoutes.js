import express from "express";
import { subscribeNewsletter, getSubscribers } from "../controllers/newsletterController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Newsletter
 *   description: Newsletter subscriptions management
 */

/**
 * @swagger
 * /api/newsletter:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscribed successfully
 *   get:
 *     summary: Get all newsletter subscribers
 *     tags: [Newsletter]
 *     responses:
 *       200:
 *         description: List of subscribers
 */
router.post("/", subscribeNewsletter);
router.get("/", getSubscribers);

export default router;

