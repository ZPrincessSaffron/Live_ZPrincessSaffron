import express from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: User reviews management
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewer_name:
 *                 type: string
 *               rating:
 *                 type: number
 *               review_text:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.post("/", optionalProtect, createReview);
router.get("/", getReviews);

export default router;

