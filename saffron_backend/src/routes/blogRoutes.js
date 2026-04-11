import express from "express";
import { createBlog, getBlogs } from "../controllers/blogController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog posts management
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.post("/", createBlog);
router.get("/", getBlogs);

export default router;

