import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/cartModel.js";
import { getOrders, createOrder } from "../../controllers/orderController.js";
import firebaseService from "../../services/firebaseService.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

// Mock firebaseService
jest.unstable_mockModule("../../services/firebaseService.js", () => ({
    default: {
        sendStatusUpdateNotification: jest.fn()
    }
}));

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

describe("orderController", () => {
    let mockReq, mockRes, user;

    beforeEach(async () => {
        await Order.deleteMany({});
        await Product.deleteMany({});
        await Cart.deleteMany({});
        
        user = { _id: new mongoose.Types.ObjectId() };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("createOrder", () => {
        it("should create an order and reduce stock", async () => {
            const product = await Product.create({
                id: 1,
                name: "Test Product",
                price: 100,
                stock: 10,
                category: "C",
                image: "i",
                description: "d"
            });

            mockReq = {
                user: { _id: user._id },
                body: {
                    checkoutData: {
                        items: [{ product_id: 1, product_name: "Test Product", product_image: "i", quantity: 2, price: 100 }],
                        subtotal: 200,
                        discount: 0,
                        shipping: 0,
                        total: 200,
                        shippingDetails: {
                            name: "Test",
                            email: "test@example.com",
                            phone: "1234567890",
                            address: "123 St",
                            city: "City",
                            state: "State",
                            pincode: "123456"
                        },
                        paymentMethod: "card"
                    }
                }
            };

            await createOrder(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            
            const updatedProduct = await Product.findOne({ id: 1 });
            expect(updatedProduct.stock).toBe(8);

            const orderInDb = await Order.findOne({ user: user._id });
            expect(orderInDb).toBeDefined();
            expect(orderInDb.total).toBe(200);
        });

        it("should fail if stock is insufficient", async () => {
            await Product.create({
                id: 1,
                name: "Test Product",
                price: 100,
                stock: 1,
                category: "C",
                image: "i",
                description: "d"
            });

            mockReq = {
                user: { _id: user._id },
                body: {
                    checkoutData: {
                        items: [{ product_id: 1, product_name: "Test Product", quantity: 5, price: 100 }],
                        subtotal: 500,
                        total: 500
                    }
                }
            };

            await createOrder(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining("Insufficient stock")
            }));
        });
    });
});
