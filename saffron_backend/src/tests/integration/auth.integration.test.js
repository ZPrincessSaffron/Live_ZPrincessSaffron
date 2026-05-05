import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import User from "../../models/userModel.js";
import crypto from "crypto";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

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

describe("Auth Integration Tests", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    fullName: "Test User",
                    email: "test@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("otpRequired", true);
            expect(res.body).toHaveProperty("userId");
            expect(res.body.message).toBe("Registration successful. Please verify your email.");

            const user = await User.findOne({ email: "test@example.com" });
            expect(user).toBeDefined();
        });

        it("should fail if user already exists", async () => {
            await User.create({
                fullName: "Existing User",
                email: "existing@example.com",
                password: "password123"
            });

            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    fullName: "Existing User",
                    email: "existing@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("User already exists");
        });

        it("should fail with invalid input (validation middleware)", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    fullName: "", // Assuming fullName is required and non-empty
                    email: "invalid-email",
                    password: "123" // Assuming password has min length
                });

            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login successfully with correct credentials", async () => {
            await User.create({
                fullName: "Login User",
                email: "login@example.com",
                password: "password123"
            });

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "login@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
        });

        it("should fail with incorrect credentials", async () => {
            await User.create({
                fullName: "Login User",
                email: "login@example.com",
                password: "password123"
            });

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "login@example.com",
                    password: "wrongpassword"
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Invalid email or password");
        });
    });

    describe("POST /api/auth/forgot-password", () => {
        it("should return success message regardless of user existence", async () => {
            const res = await request(app)
                .post("/api/auth/forgot-password")
                .send({ email: "nonexistent@example.com" });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Email sent");
        });

        it("should generate reset token for existing user", async () => {
            await User.create({
                fullName: "Forgot User",
                email: "forgot@example.com",
                password: "password123"
            });

            const res = await request(app)
                .post("/api/auth/forgot-password")
                .send({ email: "forgot@example.com" });

            expect(res.status).toBe(200);
            
            const user = await User.findOne({ email: "forgot@example.com" });
            expect(user.resetPasswordToken).toBeDefined();
            expect(user.resetPasswordExpires).toBeDefined();
        });
    });

    describe("POST /api/auth/reset-password/:token", () => {
        it("should reset password with valid token", async () => {
            const resetToken = "validtoken123";
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
            
            await User.create({
                fullName: "Reset User",
                email: "reset@example.com",
                password: "oldpassword",
                resetPasswordToken: hashedToken,
                resetPasswordExpires: Date.now() + 3600000 // 1 hour from now
            });

            const res = await request(app)
                .post(`/api/auth/reset-password/${resetToken}`)
                .send({ password: "newpassword123" });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Password reset successful");

            const user = await User.findOne({ email: "reset@example.com" });
            expect(user.resetPasswordToken).toBeUndefined();
            expect(await user.comparePassword("newpassword123")).toBe(true);
        });

        it("should fail with invalid or expired token", async () => {
            const res = await request(app)
                .post("/api/auth/reset-password/invalidtoken")
                .send({ password: "newpassword123" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid or expired token");
        });
    });
});
