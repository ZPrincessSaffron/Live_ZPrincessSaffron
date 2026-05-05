import jwt from "jsonwebtoken";
import { generateToken } from "../../config/generateToken.js";

describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
        const id = "123";
        const isAdmin = true;
        const token = generateToken(id, isAdmin);
        
        expect(typeof token).toBe("string");
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.id).toBe(id);
        expect(decoded.role).toBe("admin");
    });

    it("should set role to user if isAdmin is false", () => {
        const id = "456";
        const isAdmin = false;
        const token = generateToken(id, isAdmin);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.role).toBe("user");
    });
});
