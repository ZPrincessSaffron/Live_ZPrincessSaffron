import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Notification from "../../models/notificationModel.js";
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

describe("Notification Model Database Tests", () => {
    const validNotifData = {
        userId: new mongoose.Types.ObjectId(),
        orderId: new mongoose.Types.ObjectId(),
        readableOrderId: "ORD123",
        message: "Your order is shipped",
        status: "SHIPPED"
    };

    describe("Create & Save", () => {
        it("should save a notification correctly", async () => {
            const notif = new Notification(validNotifData);
            const saved = await notif.save();

            expect(saved._id).toBeDefined();
            expect(saved.isRead).toBe(false);
        });
    });

    describe("Validation", () => {
        it("should fail without required fields", async () => {
            const notif = new Notification({ message: "No IDs" });
            let err;
            try {
                await notif.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.userId).toBeDefined();
            expect(err.errors.orderId).toBeDefined();
        });
    });
});
