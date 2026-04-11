import express from "express";
import { createMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Contact messages management
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a contact message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of messages
 */
router.post("/", createMessage);
router.get("/", getMessages);

export default router;

