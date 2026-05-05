import rateLimit from "express-rate-limit";

// General rate limiter for all API routes (500 requests per 15 minutes)
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // Limit each IP to 2000 requests per windowMs
    message: { message: "Too many requests from this IP, please try again after 15 minutes" },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for authentication routes (50 requests per 15 minutes)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: { message: "Too many login/register attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for payment-related routes (20 requests per hour)
export const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 requests per windowMs
    message: { message: "Too many payment attempts, please try again after an hour" },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for messages and newsletter (10 requests per hour)
export const messageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { message: "Too many message requests, please try again after an hour" },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for chat functionality (30 requests per minute)
export const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 requests per windowMs
    message: { message: "Too many chat messages, please slow down" },
    standardHeaders: true,
    legacyHeaders: false,
});
