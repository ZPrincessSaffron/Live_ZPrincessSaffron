import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Cart from "../../models/cartModel.js";
import Product from "../../models/productModel.js";
import { jest } from "@jest/globals";

const createOrderMock = jest.fn().mockResolvedValue({ id: "order_123", amount: 200000 });

// Mock Razorpay
jest.unstable_mockModule("razorpay", () => {
    return {
        default: jest.fn().mockImplementation(() => ({
            orders: {
                create: createOrderMock
            }
        }))
    };
});

// Re-import after mocking
const { default: Razorpay } = await import("razorpay");
const { createRazorpayOrder } = await import("../../controllers/paymentController.js");

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

describe("paymentController Security", () => {
    let mockReq, mockRes, user, product;

    beforeEach(async () => {
        await Cart.deleteMany({});
        await Product.deleteMany({});
        
        user = { _id: new mongoose.Types.ObjectId() };
        
        product = await Product.create({
            id: 1,
            name: "Premium Saffron",
            price: 1000,
            stock: 10,
            category: "Saffron",
            image: "saffron.jpg",
            description: "Pure Kashmiri Saffron"
        });

        await Cart.create({
            user: user._id,
            items: [{ product_id: 1, quantity: 2 }]
        });

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it("should calculate total amount from DB and ignore req.body amount", async () => {
        mockReq = {
            user: { _id: user._id },
            body: {
                amount: 1, // Tampered amount
                currency: "INR"
            }
        };

        await createRazorpayOrder(mockReq, mockRes);
        
        // Expect amount to be 2000 * 100 = 200000 paise
        expect(createOrderMock).toHaveBeenCalledWith(expect.objectContaining({
            amount: 200000,
            currency: "INR"
        }));

        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if cart is empty", async () => {
        await Cart.deleteMany({});

        mockReq = {
            user: { _id: user._id },
            body: { currency: "INR" }
        };

        await createRazorpayOrder(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Cart is empty"
        }));
    });
});
