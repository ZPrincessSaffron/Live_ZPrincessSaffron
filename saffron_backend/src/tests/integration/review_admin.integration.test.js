import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import User from "../../models/userModel.js";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import Review from "../../models/reviewModel.js";
import { generateToken } from "../../config/generateToken.js";
import firebaseService from "../../services/firebaseService.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

// Mock firebaseService
jest.spyOn(firebaseService, "sendStatusUpdateNotification").mockImplementation(() => {});

let mongoServer;
let adminToken;
let userToken;
let adminUser;
let testUser;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    adminUser = await User.create({
        fullName: "Admin",
        email: "admin@test.com",
        password: "password123",
        isAdmin: true
    });
    adminToken = generateToken(adminUser._id, true);

    testUser = await User.create({
        fullName: "User",
        email: "user@test.com",
        password: "password123",
        isAdmin: false,
        orders: []
    });
    userToken = generateToken(testUser._id, false);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe("Review Integration Tests", () => {
    beforeEach(async () => {
        await Review.deleteMany({});
        await Product.deleteMany({});
        await User.updateOne({ _id: testUser._id }, { orders: [] });
    });

    describe("POST /api/reviews", () => {
        it("should allow guest reviews", async () => {
            const res = await request(app)
                .post("/api/reviews")
                .send({
                    rating: 5,
                    review_text: "Great products!",
                    location: "Dubai",
                    reviewer_name: "Guest User"
                });

            expect(res.status).toBe(201);
            expect(res.body.reviewer_name).toBe("Guest User");
        });

        it("should fail for product review without login", async () => {
            const res = await request(app)
                .post("/api/reviews")
                .send({
                    product_id: 101,
                    rating: 5,
                    review_text: "Nice"
                });

            expect(res.status).toBe(401);
        });

        it("should fail for product review without purchase", async () => {
            const res = await request(app)
                .post("/api/reviews")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    product_id: 101,
                    rating: 5,
                    review_text: "Nice"
                });

            expect(res.status).toBe(403);
            expect(res.body.message).toContain("purchased");
        });

        it("should allow product review after purchase", async () => {
            // Mock purchase in user orders
            await User.updateOne(
                { _id: testUser._id },
                { 
                    orders: [{ 
                        status: "delivered", 
                        items: [{ product_id: 101 }] 
                    }] 
                }
            );

            await Product.create({
                id: 101,
                name: "P1",
                price: 10,
                category: "C",
                image: "i.jpg",
                description: "D",
                stock: 5
            });

            const res = await request(app)
                .post("/api/reviews")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    product_id: 101,
                    rating: 4,
                    review_text: "Actually good",
                    reviewer_name: "Happy Customer"
                });

            expect(res.status).toBe(201);
            
            const product = await Product.findOne({ id: 101 });
            expect(product.rating).toBe(4);
            expect(product.reviews).toBe(1);
        });
    });

    describe("GET /api/reviews", () => {
        it("should return published reviews", async () => {
            await Review.create({ reviewer_name: "R1", rating: 5, review_text: "T1", published: true });
            await Review.create({ reviewer_name: "R2", rating: 5, review_text: "T2", published: false });

            const res = await request(app).get("/api/reviews");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });
});

describe("Admin Integration Tests", () => {
    beforeEach(async () => {
        await Order.deleteMany({});
    });

    describe("GET /api/admin/stats", () => {
        it("should return dashboard stats for admin", async () => {
            const res = await request(app)
                .get("/api/admin/stats")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("totalUsers");
            expect(res.body).toHaveProperty("totalRevenue");
        });

        it("should deny access to non-admin", async () => {
            const res = await request(app)
                .get("/api/admin/stats")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });

    describe("PUT /api/admin/orders/:orderId/status", () => {
        it("should update order status", async () => {
            const order = await Order.create({
                user: testUser._id,
                orderId: "ADM123",
                total: 500,
                subtotal: 500,
                status: "pending",
                paymentMethod: "cod",
                shippingDetails: {
                    name: "U", email: "u@t.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1"
                },
                items: []
            });

            const res = await request(app)
                .put("/api/admin/orders/ADM123/status")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ status: "shipped" });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("shipped");
        });
    });
});
