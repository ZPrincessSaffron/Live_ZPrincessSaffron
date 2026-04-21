import { rateLimit } from "express-rate-limit";

/**
 * Global rate limiter for all API routes.
 * Limits each IP to 100 requests per 15-minute window.
 */
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: "draft-7", // Use modern RateLimit headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
});

/**
 * Stricter rate limiter for sensitive authentication routes.
 * Limits each IP to 10 requests per 15-minute window.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts, please try again after 15 minutes",
    },
});
