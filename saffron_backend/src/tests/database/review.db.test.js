import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Review from "../../models/reviewModel.js";
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

describe("Review Model Database Tests", () => {
    let testUser;

    beforeEach(async () => {
        testUser = await User.create({
            fullName: "Reviewer",
            email: "reviewer@test.com",
            password: "password123"
        });
    });

    describe("Create & Save", () => {
        it("should save a review correctly", async () => {
            const review = new Review({
                user: testUser._id,
                product_id: 101,
                rating: 5,
                review_text: "Excellent product!"
            });
            const saved = await review.save();

            expect(saved._id).toBeDefined();
            expect(saved.rating).toBe(5);
            expect(saved.published).toBe(true);
        });

        it("should allow guest reviews (no user ref)", async () => {
            const review = new Review({
                reviewer_name: "Guest",
                rating: 4,
                review_text: "Good service"
            });
            const saved = await review.save();
            expect(saved.reviewer_name).toBe("Guest");
        });
    });

    describe("Validation", () => {
        it("should fail with rating out of bounds", async () => {
            const review = new Review({
                rating: 6,
                review_text: "Too good?"
            });
            let err;
            try {
                await review.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.rating).toBeDefined();
        });

        it("should fail without review_text", async () => {
            const review = new Review({
                rating: 3
            });
            let err;
            try {
                await review.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.review_text).toBeDefined();
        });
    });

    describe("Uniqueness (Partial Index)", () => {
        it("should fail for duplicate user review on same product", async () => {
            await Review.create({
                user: testUser._id,
                product_id: 101,
                rating: 5,
                review_text: "First review"
            });

            const duplicate = new Review({
                user: testUser._id,
                product_id: 101,
                rating: 4,
                review_text: "Second review"
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

        it("should allow multiple guest reviews for the same product", async () => {
            await Review.create({
                product_id: 101,
                rating: 5,
                review_text: "Guest 1"
            });

            const secondGuest = new Review({
                product_id: 101,
                rating: 4,
                review_text: "Guest 2"
            });

            const saved = await secondGuest.save();
            expect(saved._id).toBeDefined();
        });
    });
});
