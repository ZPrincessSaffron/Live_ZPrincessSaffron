import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("_id fullName isAdmin role").lean();

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Optional protection - populates req.user if token is present, but doesn't block if not
export const optionalProtect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("_id fullName isAdmin role").lean();
            return next();
        } catch (error) {
            console.error("Optional Auth Error:", error);
            // Even if token fails, we allow guests to proceed in optional mode
            return next();
        }
    }
    next();
};

export const admin = (req, res, next) => {
    if (req.user && (req.user.isAdmin === true || req.user.role === "admin")) {
        return next();
    } else {
        res.status(403);
        const error = new Error("Access denied: Admin credentials required.");
        error.status = 403;
        throw error;
    }
};

