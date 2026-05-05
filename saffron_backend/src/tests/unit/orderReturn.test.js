import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../../models/orderModel.js";
import { requestProductReturn } from "../../controllers/orderController.js";
import { jest } from "@jest/globals";

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

describe("Order Return Logic", () => {
    let mockReq, mockRes, userId;

    beforeEach(async () => {
        await Order.deleteMany({});
        userId = new mongoose.Types.ObjectId();
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it("should allow return within 24 hours of delivery", async () => {
        const order = await Order.create({
            user: userId,
            orderId: "TEST_ORDER_1",
            subtotal: 1000,
            total: 1000,
            status: "delivered",
            deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            items: [{
                product_id: 101,
                product_name: "Test Product",
                product_image: "img.jpg",
                quantity: 1,
                price: 1000
            }],
            shippingDetails: { name: "X", email: "x@x.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1" },
            paymentMethod: "cod"
        });

        mockReq = {
            user: { _id: userId },
            params: { orderId: "TEST_ORDER_1", productId: "101" }
        };

        await requestProductReturn(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Return requested successfully"
        }));

        const updatedOrder = await Order.findOne({ orderId: "TEST_ORDER_1" });
        expect(updatedOrder.items[0].isReturned).toBe(true);
    });

    it("should block return after 24 hours", async () => {
        const order = await Order.create({
            user: userId,
            orderId: "TEST_ORDER_2",
            subtotal: 1000,
            total: 1000,
            status: "delivered",
            deliveredAt: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago
            items: [{
                product_id: 102,
                product_name: "Test Product",
                product_image: "img.jpg",
                quantity: 1,
                price: 1000
            }],
            shippingDetails: { name: "X", email: "x@x.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1" },
            paymentMethod: "cod"
        });

        mockReq = {
            user: { _id: userId },
            params: { orderId: "TEST_ORDER_2", productId: "102" }
        };

        await requestProductReturn(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Return period (24 hours) has expired"
        }));
    });

    it("should block return if status is not delivered", async () => {
        const order = await Order.create({
            user: userId,
            orderId: "TEST_ORDER_3",
            subtotal: 1000,
            total: 1000,
            status: "shipped",
            items: [{
                product_id: 103,
                product_name: "Test Product",
                product_image: "img.jpg",
                quantity: 1,
                price: 1000
            }],
            shippingDetails: { name: "X", email: "x@x.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1" },
            paymentMethod: "cod"
        });

        mockReq = {
            user: { _id: userId },
            params: { orderId: "TEST_ORDER_3", productId: "103" }
        };

        await requestProductReturn(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Only delivered orders can be returned"
        }));
    });
});
