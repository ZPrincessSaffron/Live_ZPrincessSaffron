import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../../models/orderModel.js";
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

describe("Order Model Database Tests", () => {
    let testUser;

    beforeEach(async () => {
        testUser = await User.create({
            fullName: "Order User",
            email: "order@test.com",
            password: "password123"
        });
    });

    const validOrderData = (userId) => ({
        user: userId,
        orderId: "ORD123",
        subtotal: 1000,
        total: 1000,
        paymentMethod: "cod",
        items: [{
            product_id: 101,
            product_name: "Test P",
            product_image: "test.jpg",
            quantity: 2,
            price: 500
        }],
        shippingDetails: {
            name: "U", email: "u@t.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1"
        }
    });

    describe("Create & Save", () => {
        it("should save an order correctly", async () => {
            const order = new Order(validOrderData(testUser._id));
            const saved = await order.save();

            expect(saved._id).toBeDefined();
            expect(saved.user.toString()).toBe(testUser._id.toString());
            expect(saved.status).toBe("pending");
        });
    });

    describe("Validation", () => {
        it("should fail with invalid status enum", async () => {
            const order = new Order({
                ...validOrderData(testUser._id),
                status: "invalid_status"
            });
            let err;
            try {
                await order.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.status).toBeDefined();
        });

        it("should fail without required shipping details", async () => {
            const data = validOrderData(testUser._id);
            delete data.shippingDetails.city;
            const order = new Order(data);
            let err;
            try {
                await order.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors["shippingDetails.city"]).toBeDefined();
        });
    });

    describe("Uniqueness", () => {
        it("should fail with duplicate orderId", async () => {
            await Order.create(validOrderData(testUser._id));
            const duplicate = new Order({
                ...validOrderData(testUser._id),
                orderId: "ORD123"
            });
            let err;
            try {
                await duplicate.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.code).toBe(11000);
        });
    });

    describe("Relations", () => {
        it("should populate user data", async () => {
            const order = await Order.create(validOrderData(testUser._id));
            const populatedOrder = await Order.findById(order._id).populate("user");
            expect(populatedOrder.user.fullName).toBe("Order User");
        });
    });
});
