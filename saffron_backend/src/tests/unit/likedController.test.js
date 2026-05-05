import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import { toggleLikeProduct, getLikedProducts } from "../../controllers/likedController.js";
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

describe("likedController", () => {
    let mockReq, mockRes, user;

    beforeEach(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
        
        user = await User.create({
            fullName: "Liker",
            email: "liker@test.com",
            password: "password123",
            likedProducts: []
        });

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("toggleLikeProduct", () => {
        it("should add product to liked list if not present", async () => {
            mockReq = {
                user: { _id: user._id },
                body: { product_id: 101 }
            };

            await toggleLikeProduct(mockReq, mockRes);

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.likedProducts).toContain(101);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ liked: true }));
        });

        it("should remove product from liked list if already present", async () => {
            user.likedProducts.push(101);
            await user.save();

            mockReq = {
                user: { _id: user._id },
                body: { product_id: 101 }
            };

            await toggleLikeProduct(mockReq, mockRes);

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.likedProducts).not.toContain(101);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ liked: false }));
        });
    });
});
