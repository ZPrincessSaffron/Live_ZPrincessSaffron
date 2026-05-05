import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Message from "../../models/messageModel.js";
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

describe("Message Model Database Tests", () => {
    const validMessageData = {
        name: "Inquirer",
        email: "inquirer@test.com",
        message: "Hello, I have a question."
    };

    describe("Create & Save", () => {
        it("should save a message correctly", async () => {
            const msg = new Message(validMessageData);
            const saved = await msg.save();

            expect(saved._id).toBeDefined();
            expect(saved.name).toBe(validMessageData.name);
            expect(saved.read).toBe(false);
        });
    });

    describe("Validation", () => {
        it("should fail without required fields", async () => {
            const msg = new Message({ name: "No Email" });
            let err;
            try {
                await msg.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.email).toBeDefined();
            expect(err.errors.message).toBeDefined();
        });
    });
});
