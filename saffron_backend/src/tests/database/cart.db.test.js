import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Cart from "../../models/cartModel.js";
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

describe("Cart Model Database Tests", () => {
    let testUser;

    beforeEach(async () => {
        testUser = await User.create({
            fullName: "Cart User",
            email: "cart@test.com",
            password: "password123"
        });
    });

    describe("Create & Save", () => {
        it("should save a cart correctly", async () => {
            const cart = new Cart({
                user: testUser._id,
                items: [{ product_id: 101, quantity: 2 }]
            });
            const saved = await cart.save();

            expect(saved._id).toBeDefined();
            expect(saved.items.length).toBe(1);
            expect(saved.items[0].product_id).toBe(101);
        });
    });

    describe("Validation", () => {
        it("should fail without a user reference", async () => {
            const cart = new Cart({
                items: [{ product_id: 101 }]
            });
            let err;
            try {
                await cart.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.user).toBeDefined();
        });

        it("should fail if cart item is missing product_id", async () => {
            const cart = new Cart({
                user: testUser._id,
                items: [{ quantity: 2 }]
            });
            let err;
            try {
                await cart.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors["items.0.product_id"]).toBeDefined();
        });
    });

    describe("Defaults", () => {
        it("should apply default quantity if not provided", async () => {
            const cart = await Cart.create({
                user: testUser._id,
                items: [{ product_id: 101 }]
            });
            expect(cart.items[0].quantity).toBe(1);
        });

        it("should default items to an empty array", async () => {
            const cart = await Cart.create({
                user: testUser._id
            });
            expect(cart.items).toEqual([]);
        });
    });
});
