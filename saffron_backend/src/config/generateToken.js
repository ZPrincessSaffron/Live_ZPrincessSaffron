import jwt from "jsonwebtoken";

export const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, role: isAdmin ? "admin" : "user" }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

