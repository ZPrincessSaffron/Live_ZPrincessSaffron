import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Blog from "../../models/blogModel.js";
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

describe("Blog Model Database Tests", () => {
    const validBlogData = {
        title: "Kashmiri Saffron Benefits",
        content: "Saffron is great for health...",
        author_name: "Admin"
    };

    describe("Create & Save", () => {
        it("should save a blog post correctly", async () => {
            const blog = new Blog(validBlogData);
            const saved = await blog.save();

            expect(saved._id).toBeDefined();
            expect(saved.title).toBe(validBlogData.title);
            expect(saved.published).toBe(true);
        });
    });

    describe("Validation", () => {
        it("should fail without a required field", async () => {
            const blog = new Blog({ title: "No Content" });
            let err;
            try {
                await blog.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.content).toBeDefined();
            expect(err.errors.author_name).toBeDefined();
        });
    });
});
