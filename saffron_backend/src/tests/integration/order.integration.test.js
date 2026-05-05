import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import Order from "../../models/orderModel.js";
import Cart from "../../models/cartModel.js";
import { generateToken } from "../../config/generateToken.js";
import firebaseService from "../../services/firebaseService.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

// Mock firebaseService
jest.spyOn(firebaseService, "sendStatusUpdateNotification").mockImplementation(() => {});

let mongoServer;
let userToken;
let testUser;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    testUser = await User.create({
        fullName: "Order User",
        email: "order@example.com",
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

describe("Order Integration Tests", () => {
    let product;

    beforeEach(async () => {
        await Order.deleteMany({});
        await Product.deleteMany({});
        await Cart.deleteMany({});

        product = await Product.create({
            id: 101,
            name: "Order Test Product",
            price: 100,
            category: "Test",
            image: "test.jpg",
            description: "Test Desc",
            stock: 10
        });

        await Cart.create({
            user: testUser._id,
            items: [{ product_id: 101, quantity: 2 }]
        });
    });

    describe("POST /api/users/orders", () => {
        const checkoutData = {
            items: [{ 
                product_id: 101, 
                product_name: "Order Test Product", 
                quantity: 2, 
                price: 100,
                product_image: "test.jpg"
            }],
            subtotal: 200,
            total: 200,
            shipping: 0,
            discount: 0,
            shippingDetails: {
                name: "Test User",
                email: "test@example.com",
                phone: "1234567890",
                address: "123 Street",
                city: "City",
                state: "State",
                pincode: "123456"
            },
            paymentMethod: "cod"
        };

        it("should create an order, reduce stock, and clear cart", async () => {
            const res = await request(app)
                .post("/api/users/orders")
                .set("Authorization", `Bearer ${userToken}`)
                .send({ checkoutData });

            if (res.status !== 201) {
                console.error("Order Creation Failed:", res.body);
            }

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("orderId");
            expect(res.body.status).toBe("confirmed");

            // Verify stock reduction
            const updatedProduct = await Product.findOne({ id: 101 });
            expect(updatedProduct.stock).toBe(8);

            // Verify cart cleared
            const cart = await Cart.findOne({ user: testUser._id });
            expect(cart.items.length).toBe(0);

            // Verify order in DB
            const order = await Order.findOne({ user: testUser._id });
            expect(order).toBeDefined();
        });

        it("should fail if stock is insufficient", async () => {
            const res = await request(app)
                .post("/api/users/orders")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    checkoutData: {
                        ...checkoutData,
                        items: [{ 
                            product_id: 101, 
                            product_name: "Order Test Product", 
                            quantity: 20, 
                            price: 100,
                            product_image: "test.jpg"
                        }]
                    }
                });

            expect(res.status).toBe(500);
            expect(res.body.message).toContain("Insufficient stock");
        });
    });

    describe("GET /api/users/orders", () => {
        it("should return user orders", async () => {
            await Order.create({
                user: testUser._id,
                orderId: "ORD123",
                total: 200,
                subtotal: 200,
                status: "confirmed",
                paymentMethod: "cod",
                shippingDetails: {
                    name: "Test User",
                    email: "test@example.com",
                    phone: "1234567890",
                    address: "123 Street",
                    city: "City",
                    state: "State",
                    pincode: "123456"
                },
                items: []
            });

            const res = await request(app)
                .get("/api/users/orders")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].orderId).toBe("ORD123");
        });
    });

    describe("PUT /api/users/orders/:orderId/cancel", () => {
        it("should cancel order and restore stock", async () => {
            const order = await Order.create({
                user: testUser._id,
                orderId: "ORD999",
                total: 200,
                subtotal: 200,
                status: "confirmed",
                paymentMethod: "cod",
                shippingDetails: {
                    name: "Test User",
                    email: "test@example.com",
                    phone: "1234567890",
                    address: "123 Street",
                    city: "City",
                    state: "State",
                    pincode: "123456"
                },
                items: [{ 
                    product_id: 101, 
                    quantity: 5, 
                    price: 100, 
                    product_name: "P", 
                    product_image: "i.jpg" 
                }]
            });

            // Initial stock was 10.
            const res = await request(app)
                .put(`/api/users/orders/ORD999/cancel`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("cancelled");

            // Verify stock restored (10 + 5 = 15?) 
            // Wait, in beforeEach we created product with stock 10.
            const updatedProduct = await Product.findOne({ id: 101 });
            expect(updatedProduct.stock).toBe(15);
        });

        it("should return 404 for non-existent order id", async () => {
            const res = await request(app)
                .put(`/api/users/orders/NONEXISTENT/cancel`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(404);
        });
    });
});
