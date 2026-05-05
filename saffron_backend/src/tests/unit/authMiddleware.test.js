import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/userModel.js";
import { protect, admin } from "../../middleware/authMiddleware.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000); // 10 minutes for downloading MongoDB binary

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe("authMiddleware", () => {
    let mockReq, mockRes, next;

    beforeEach(async () => {
        await User.deleteMany({});
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    describe("protect", () => {
        it("should authorize a valid token", async () => {
            const user = await User.create({
                fullName: "Test User",
                email: "test@example.com",
                password: "password123"
            });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            mockReq = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            };

            await protect(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
            expect(mockReq.user).toBeDefined();
            expect(mockReq.user._id.toString()).toBe(user._id.toString());
        });

        it("should fail if no token provided", async () => {
            mockReq = { headers: {} };
            await protect(mockReq, mockRes, next);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Not authorized, no token" });
        });

        it("should fail if token is invalid", async () => {
            mockReq = {
                headers: {
                    authorization: "Bearer invalid-token"
                }
            };
            await protect(mockReq, mockRes, next);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Not authorized, token failed" });
        });
    });

    describe("admin", () => {
        it("should allow access for admin users", () => {
            mockReq = { user: { role: "admin" } };
            admin(mockReq, mockRes, next);
            expect(next).toHaveBeenCalled();
        });

        it("should deny access for non-admin users", () => {
            mockReq = { user: { role: "user" } };
            expect(() => admin(mockReq, mockRes, next)).toThrow("Access denied");
            expect(mockRes.status).toHaveBeenCalledWith(403);
        });
    });
});
