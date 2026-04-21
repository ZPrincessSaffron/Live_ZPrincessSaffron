import express from "express";
import cors from "cors";
import helmet from "helmet";
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
import notificationRoutes from "./routes/notificationRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { globalLimiter, authLimiter } from "./middleware/rateLimiter.js";

const app = express();

// Trust proxy for Render/Vercel to get correct IP addresses
app.set("trust proxy", 1);

// Security Headers
app.use(helmet({
    contentSecurityPolicy: false, // Disabled to ensure Swagger UI compatibility
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow resources to be loaded across origins
}));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Apply Global Rate Limiting
app.use("/api", globalLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Stricter Rate Limiting for Auth Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "Backend is running 🚀" });
});

app.get("/", (req, res) => {
    res.send('<h1>Backend is running 🚀</h1><p>API Documentation: <a href="/api-docs">/api-docs</a></p><p>Please visit the frontend at <a href="http://localhost:5173">http://localhost:5173</a></p>');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Backend Error:", err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

export default app;

