import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Cart from "../../models/cartModel.js";
import Product from "../../models/productModel.js";
import { getCart, addToCart } from "../../controllers/cartController.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

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

describe("cartController", () => {
    let mockReq, mockRes, user;

    beforeEach(async () => {
        await Cart.deleteMany({});
        await Product.deleteMany({});
        
        user = { _id: new mongoose.Types.ObjectId() };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("addToCart", () => {
        it("should add item to cart successfully", async () => {
            await Product.create({
                id: 1,
                name: "Cart Product",
                price: 100,
                stock: 10,
                category: "C",
                image: "i",
                description: "d"
            });

            mockReq = {
                user: { _id: user._id },
                body: { product_id: 1, quantity: 2 }
            };

            await addToCart(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            
            const cart = await Cart.findOne({ user: user._id });
            expect(cart.items.length).toBe(1);
            expect(cart.items[0].quantity).toBe(2);
        });

        it("should return 400 if quantity exceeds stock", async () => {
            await Product.create({
                id: 1,
                name: "Cart Product",
                price: 100,
                stock: 5,
                category: "C",
                image: "i",
                description: "d"
            });

            mockReq = {
                user: { _id: user._id },
                body: { product_id: 1, quantity: 10 }
            };

            await addToCart(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining("Only 5 items available")
            }));
        });
    });

    describe("getCart", () => {
        it("should auto-adjust quantity if stock decreases", async () => {
            await Product.create({
                id: 1,
                name: "Volatile Product",
                price: 100,
                stock: 2, // Stock dropped to 2
                category: "C",
                image: "i",
                description: "d"
            });

            await Cart.create({
                user: user._id,
                items: [{ product_id: 1, quantity: 5 }] // User had 5 in cart
            });

            mockReq = { user: { _id: user._id } };

            await getCart(mockReq, mockRes);

            const cart = await Cart.findOne({ user: user._id });
            expect(cart.items[0].quantity).toBe(2); // Auto-adjusted to stock
            expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ quantity: 2 })
            ]));
        });
    });
});
