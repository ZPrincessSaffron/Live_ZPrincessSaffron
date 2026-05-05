import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/userModel.js";
import { getUserProfile, updateUserProfile, addUserAddress } from "../../controllers/userController.js";
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

describe("userController", () => {
    let mockReq, mockRes, user;

    beforeEach(async () => {
        await User.deleteMany({});
        user = await User.create({
            fullName: "Saffron User",
            email: "saffron@example.com",
            password: "password123",
            isAdmin: false
        });

        mockReq = {
            user: { _id: user._id },
            body: {},
            params: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("getUserProfile", () => {
        it("should return user profile if user exists", async () => {
            await getUserProfile(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                _id: user._id,
                fullName: "Saffron User",
                email: "saffron@example.com"
            }));
        });

        it("should return 404 if user does not exist", async () => {
            mockReq.user._id = new mongoose.Types.ObjectId();
            await getUserProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });

    describe("updateUserProfile", () => {
        it("should update user profile fields", async () => {
            mockReq.body = { fullName: "Updated Name", email: "updated@example.com" };
            
            await updateUserProfile(mockReq, mockRes);

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.fullName).toBe("Updated Name");
            expect(updatedUser.email).toBe("updated@example.com");
            expect(mockRes.json).toHaveBeenCalled();
        });
    });

    describe("addUserAddress", () => {
        it("should add a new address to user", async () => {
            mockReq.body = {
                shipping_address: "123 Main St",
                shipping_city: "Mumbai",
                shipping_pincode: "400001",
                shipping_country: "India"
            };

            await addUserAddress(mockReq, mockRes);

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.addresses.length).toBe(1);
            expect(updatedUser.addresses[0].shipping_city).toBe("Mumbai");
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });

        it("should set the first address as default", async () => {
            mockReq.body = {
                shipping_address: "123 Main St",
                shipping_city: "Mumbai",
                shipping_pincode: "400001",
                shipping_country: "India"
            };

            await addUserAddress(mockReq, mockRes);

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.addresses[0].isDefault).toBe(true);
            expect(updatedUser.shipping_city).toBe("Mumbai"); // top-level sync
        });
    });
});
