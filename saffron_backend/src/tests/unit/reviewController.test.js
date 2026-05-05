import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";
import { createReview, getReviews } from "../../controllers/reviewController.js";
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

describe("reviewController", () => {
    let mockReq, mockRes, user, product;

    beforeEach(async () => {
        await Review.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        
        user = await User.create({
            fullName: "Reviewer",
            email: "reviewer@example.com",
            password: "password123",
            orders: [] // Mocking orders array even if not in schema
        });

        product = await Product.create({
            id: 1,
            name: "Reviewable Product",
            price: 100,
            image: "i",
            category: "C",
            description: "D"
        });

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("createReview", () => {
        it("should return 403 if user has not purchased the product", async () => {
            mockReq = {
                user: { _id: user._id, fullName: user.fullName },
                body: {
                    product_id: 1,
                    rating: 5,
                    review_text: "Great!"
                }
            };

            // Note: user.orders will be undefined/empty in the test
            await createReview(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "You can only review products you have purchased" });
        });

        it("should create a guest review if no product_id is provided", async () => {
            mockReq = {
                body: {
                    rating: 4,
                    review_text: "Nice shop!",
                    reviewer_name: "Guest User"
                }
            };

            await createReview(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            const review = await Review.findOne({ reviewer_name: "Guest User" });
            expect(review).toBeDefined();
            expect(review.rating).toBe(4);
        });
    });

    describe("getReviews", () => {
        it("should return published reviews", async () => {
            await Review.create({
                rating: 5,
                review_text: "Excellent",
                reviewer_name: "User A",
                published: true
            });

            mockReq = { query: {} };
            await getReviews(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ review_text: "Excellent" })
            ]));
        });
    });
});
