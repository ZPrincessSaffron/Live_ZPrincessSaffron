import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/userModel.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

describe("User Model Database Tests", () => {
    const validUserData = {
        fullName: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "1234567890"
    };

    describe("Create & Save", () => {
        it("should save a user correctly with hashed password", async () => {
            const user = new User(validUserData);
            const savedUser = await user.save();

            expect(savedUser._id).toBeDefined();
            expect(savedUser.fullName).toBe(validUserData.fullName);
            expect(savedUser.email).toBe(validUserData.email.toLowerCase());
            expect(savedUser.password).not.toBe(validUserData.password); // Hashed
        });
    });

    describe("Validation", () => {
        it("should fail to save without a required field (fullName)", async () => {
            const userWithoutName = new User({
                email: "test@example.com",
                password: "password123"
            });
            let err;
            try {
                await userWithoutName.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.fullName).toBeDefined();
        });

        it("should fail to save without a required field (email)", async () => {
            const userWithoutEmail = new User({
                fullName: "Test User",
                password: "password123"
            });
            let err;
            try {
                await userWithoutEmail.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.email).toBeDefined();
        });
    });

    describe("Uniqueness", () => {
        it("should fail to save users with duplicate emails", async () => {
            await User.create(validUserData);
            const duplicateUser = new User(validUserData);

            let err;
            try {
                await duplicateUser.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.code).toBe(11000); // Duplicate key error
        });
    });

    describe("Defaults", () => {
        it("should apply default values correctly", async () => {
            const user = await User.create(validUserData);
            expect(user.isAdmin).toBe(false);
            expect(user.orders).toEqual([]);
            expect(user.likedProducts).toEqual([]);
            expect(user.addresses).toEqual([]);
        });
    });

    describe("Methods", () => {
        it("should compare passwords correctly", async () => {
            const user = await User.create(validUserData);
            const isMatch = await user.comparePassword("password123");
            const isNotMatch = await user.comparePassword("wrongpassword");

            expect(isMatch).toBe(true);
            expect(isNotMatch).toBe(false);
        });
    });

    describe("Queries", () => {
        it("should find, update, and delete a user", async () => {
            const user = await User.create(validUserData);

            // Find
            const foundUser = await User.findOne({ email: "test@example.com" });
            expect(foundUser.fullName).toBe("Test User");

            // Update
            foundUser.phone = "9999999999";
            await foundUser.save();
            const updatedUser = await User.findById(user._id);
            expect(updatedUser.phone).toBe("9999999999");

            // Delete
            await User.findByIdAndDelete(user._id);
            const deletedUser = await User.findById(user._id);
            expect(deletedUser).toBeNull();
        });
    });

    describe("Relations & Subdocuments", () => {
        it("should manage subdocuments (addresses) correctly", async () => {
            const user = await User.create(validUserData);
            
            user.addresses.push({
                shipping_address: "123 Main St",
                shipping_city: "Test City",
                isDefault: true
            });
            await user.save();

            const userWithAddr = await User.findById(user._id);
            expect(userWithAddr.addresses.length).toBe(1);
            expect(userWithAddr.addresses[0].shipping_address).toBe("123 Main St");
            expect(userWithAddr.addresses[0].isDefault).toBe(true);
        });
    });
});
