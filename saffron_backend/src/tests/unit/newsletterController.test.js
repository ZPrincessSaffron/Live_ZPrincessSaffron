import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Newsletter from "../../models/newsletterModel.js";
import { subscribeNewsletter, getSubscribers } from "../../controllers/newsletterController.js";
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

describe("newsletterController", () => {
    let mockReq, mockRes;

    beforeEach(async () => {
        await Newsletter.deleteMany({});
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("subscribeNewsletter", () => {
        it("should subscribe a new email", async () => {
            mockReq = { body: { email: "news@test.com" } };
            await subscribeNewsletter(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Successfully subscribed to newsletter!" });
        });

        it("should return 400 if already subscribed", async () => {
            await Newsletter.create({ email: "news@test.com" });
            mockReq = { body: { email: "news@test.com" } };
            
            await subscribeNewsletter(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "You are already subscribed to our newsletter!" });
        });
    });
});
