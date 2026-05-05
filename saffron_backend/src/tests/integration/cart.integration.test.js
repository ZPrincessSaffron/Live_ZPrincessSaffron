import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/cartModel.js";
import { generateToken } from "../../config/generateToken.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

let mongoServer;
let userToken;
let testUser;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    testUser = await User.create({
        fullName: "Cart User",
        email: "cart@example.com",
        password: "password123"
    });
    userToken = generateToken(testUser._id, false);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe("Cart Integration Tests", () => {
    let product;

    beforeEach(async () => {
        await Cart.deleteMany({});
        await Product.deleteMany({});

        product = await Product.create({
            id: 201,
            name: "Cart Product",
            price: 50,
            category: "Cat",
            image: "cart.jpg",
            description: "D",
            stock: 5
        });
    });

    describe("GET /api/cart", () => {
        it("should return empty array and create cart if none exists", async () => {
            const res = await request(app)
                .get("/api/cart")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);

            const cart = await Cart.findOne({ user: testUser._id });
            expect(cart).toBeDefined();
        });
    });

    describe("POST /api/cart", () => {
        it("should add item to cart", async () => {
            const res = await request(app)
                .post("/api/cart")
                .set("Authorization", `Bearer ${userToken}`)
                .send({ product_id: 201, quantity: 2 });

            expect(res.status).toBe(201);
            expect(res.body.length).toBe(1);
            expect(res.body[0].product_id).toBe(201);
            expect(res.body[0].quantity).toBe(2);
        });

        it("should increment quantity if item already in cart", async () => {
            await request(app)
                .post("/api/cart")
                .set("Authorization", `Bearer ${userToken}`)
                .send({ product_id: 201, quantity: 1 });

            const res = await request(app)
                .post("/api/cart")
                .set("Authorization", `Bearer ${userToken}`)
                .send({ product_id: 201, quantity: 2 });

            expect(res.status).toBe(201);
            expect(res.body[0].quantity).toBe(3);
        });

        it("should fail if quantity exceeds stock", async () => {
            const res = await request(app)
                .post("/api/cart")
                .set("Authorization", `Bearer ${userToken}`)
                .send({ product_id: 201, quantity: 10 });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain("Only 5 items available");
        });
    });

    describe("PUT /api/cart/:productId", () => {
        it("should update item quantity", async () => {
            await Cart.create({
                user: testUser._id,
                items: [{ product_id: 201, quantity: 1 }]
            });

            const res = await request(app)
                .put("/api/cart/201")
                .set("Authorization", `Bearer ${userToken}`)
                .send({ quantity: 4 });

            expect(res.status).toBe(200);
            expect(res.body[0].quantity).toBe(4);
        });
    });

    describe("DELETE /api/cart/:productId", () => {
        it("should remove item from cart", async () => {
            await Cart.create({
                user: testUser._id,
                items: [{ product_id: 201, quantity: 1 }]
            });

            const res = await request(app)
                .delete("/api/cart/201")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });

    describe("DELETE /api/cart", () => {
        it("should clear the entire cart", async () => {
            await Cart.create({
                user: testUser._id,
                items: [{ product_id: 201, quantity: 1 }]
            });

            const res = await request(app)
                .delete("/api/cart")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Cart cleared");

            const cart = await Cart.findOne({ user: testUser._id });
            expect(cart.items.length).toBe(0);
        });
    });
});
