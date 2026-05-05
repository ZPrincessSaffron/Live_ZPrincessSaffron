import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Newsletter from "../../models/newsletterModel.js";
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

describe("Newsletter Model Database Tests", () => {
    describe("Create & Save", () => {
        it("should save a subscription correctly", async () => {
            const sub = new Newsletter({ email: "TEST@EXAMPLE.COM" });
            const saved = await sub.save();

            expect(saved._id).toBeDefined();
            expect(saved.email).toBe("test@example.com"); // lowercase
            expect(saved.active).toBe(true);
        });
    });

    describe("Uniqueness", () => {
        it("should fail with duplicate email", async () => {
            await Newsletter.create({ email: "dup@test.com" });
            const duplicate = new Newsletter({ email: "dup@test.com" });
            
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
});
