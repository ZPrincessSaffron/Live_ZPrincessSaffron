import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/userModel.js";
import { registerUser, loginUser } from "../../controllers/authController.js";
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

describe("authController", () => {
    let mockReq, mockRes;

    beforeEach(async () => {
        await User.deleteMany({});
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("registerUser", () => {
        it("should register a new user successfully", async () => {
            mockReq = {
                body: {
                    fullName: "New User",
                    email: "new@example.com",
                    password: "password123"
                }
            };

            await registerUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                otpRequired: true,
                userId: expect.any(Object),
                message: "Registration successful. Please verify your email."
            }));

            const userInDb = await User.findOne({ email: "new@example.com" });
            expect(userInDb).toBeDefined();
        });

        it("should return 400 if user already exists", async () => {
            await User.create({
                fullName: "Existing User",
                email: "existing@example.com",
                password: "password123"
            });

            mockReq = {
                body: {
                    fullName: "Existing User",
                    email: "existing@example.com",
                    password: "password123"
                }
            };

            await registerUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "User already exists" });
        });
    });

    describe("loginUser", () => {
        it("should login successfully with correct credentials", async () => {
            const user = await User.create({
                fullName: "Login User",
                email: "login@example.com",
                password: "password123"
            });

            mockReq = {
                body: {
                    email: "login@example.com",
                    password: "password123"
                }
            };

            await loginUser(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                email: "login@example.com",
                token: expect.any(String)
            }));
        });

        it("should return 401 with incorrect password", async () => {
            await User.create({
                fullName: "Login User",
                email: "login@example.com",
                password: "password123"
            });

            mockReq = {
                body: {
                    email: "login@example.com",
                    password: "wrongpassword"
                }
            };

            await loginUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
        });
    });
});
