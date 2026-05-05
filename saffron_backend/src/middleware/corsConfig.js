import cors from "cors";

// Define allowed origins from environment variable or hardcoded defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173", "https://z-princess-saffron.vercel.app", "https://www.zprincesssaffron.com", "https://zprincesssaffron.com"];

// CORS configuration middleware
export const corsMiddleware = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in the allowed list or if all origins are allowed via wildcard
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies and headers to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
    optionsSuccessStatus: 200, // Legacy browser support for OPTIONS success
});

// Middleware to handle CORS errors gracefully
export const handleCorsError = (err, req, res, next) => {
    if (err.message === "Not allowed by CORS") {
        res.status(403).json({
            status: "error",
            message: "CORS policy violation: This origin is not allowed to access the resource."
        });
    } else {
        next(err); // Pass non-CORS errors to the next error handler
    }
};
