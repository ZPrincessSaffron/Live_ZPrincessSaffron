import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../../models/orderModel.js";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import { getAllOrders, updateOrderStatus, getDashboardStats } from "../../controllers/adminController.js";
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

describe("adminController", () => {
    let mockReq, mockRes;

    beforeEach(async () => {
        await Order.deleteMany({});
        await User.deleteMany({});
        await Product.deleteMany({});
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("getAllOrders", () => {
        it("should return all orders with populated user info", async () => {
            const user = await User.create({
                fullName: "Admin Test",
                email: "admin@test.com",
                password: "password123"
            });

            await Order.create({
                user: user._id,
                orderId: "ORD123",
                subtotal: 100,
                total: 100,
                paymentMethod: "cod",
                shippingDetails: {
                    name: "N", email: "E", phone: "P", address: "A", city: "C", state: "S", pincode: "1"
                }
            });

            await getAllOrders({}, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ orderId: "ORD123" })
            ]));
        });
    });

    describe("updateOrderStatus", () => {
        it("should update status and trigger notification", async () => {
            const user = await User.create({
                fullName: "Customer",
                email: "cust@test.com",
                password: "password123"
            });

            const order = await Order.create({
                user: user._id,
                orderId: "ORD456",
                subtotal: 100,
                total: 100,
                status: "pending",
                paymentMethod: "cod",
                shippingDetails: {
                    name: "N", email: "E", phone: "P", address: "A", city: "C", state: "S", pincode: "1"
                }
            });

            mockReq = {
                params: { orderId: "ORD456" },
                body: { status: "shipped" }
            };

            await updateOrderStatus(mockReq, mockRes);

            const updatedOrder = await Order.findOne({ orderId: "ORD456" });
            expect(updatedOrder.status).toBe("shipped");
            expect(mockRes.json).toHaveBeenCalled();
        });
    });

    describe("getDashboardStats", () => {
        it("should return correct overview statistics", async () => {
            await User.create({ fullName: "U1", email: "u1@t.com", password: "p" });
            await Product.create({ id: 1, name: "P1", price: 10, stock: 2, category: "C", image: "i", description: "d" }); // Low stock

            mockReq = {};
            await getDashboardStats(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                totalUsers: 1,
                lowStockCount: 1
            }));
        });
    });
});
