import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { generalLimiter, paymentLimiter, messageLimiter, chatLimiter } from "./middleware/rateLimiter.js"; // Import rate limiters
import { corsMiddleware, handleCorsError } from "./middleware/corsConfig.js"; // Import CORS configuration and error handler

const app = express();
app.use(corsMiddleware); // Apply CORS policy as the very first middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", generalLimiter); // Apply general rate limit to all /api routes

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/messages", messageLimiter, messageRoutes); // Apply message rate limit to messages
app.use("/api/newsletter", messageLimiter, newsletterRoutes); // Apply message rate limit to newsletter
app.use("/api/chat", chatLimiter, chatRoutes); // Apply chat rate limit to chat
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/payments", paymentLimiter, paymentRoutes); // Apply payment rate limit to payments
app.use("/api/notifications", notificationRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "Backend is running 🚀" });
});

app.get("/", (req, res) => {
    res.send('<h1>Backend is running 🚀</h1><p>API Documentation: <a href="/api-docs">/api-docs</a></p><p>Please visit the frontend at <a href="http://localhost:5173">http://localhost:5173</a></p>');
});

app.use(handleCorsError); // Catch and handle CORS policy violations specifically

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Backend Error:", err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

export default app;

