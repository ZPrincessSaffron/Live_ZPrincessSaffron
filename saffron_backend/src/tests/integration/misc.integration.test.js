import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import Blog from "../../models/blogModel.js";
import Message from "../../models/messageModel.js";
import Newsletter from "../../models/newsletterModel.js";
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

describe("Misc Features Integration Tests", () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Message.deleteMany({});
        await Newsletter.deleteMany({});
    });

    describe("Blog Routes", () => {
        it("should create and retrieve blogs", async () => {
            const createRes = await request(app)
                .post("/api/blogs")
                .send({
                    title: "Test Blog",
                    content: "This is a test blog post content.",
                    author_name: "Admin"
                });

            expect(createRes.status).toBe(201);
            expect(createRes.body.title).toBe("Test Blog");

            const getRes = await request(app).get("/api/blogs");
            expect(getRes.status).toBe(200);
            expect(getRes.body.length).toBe(1);
        });
    });

    describe("Newsletter Routes", () => {
        it("should subscribe an email", async () => {
            const res = await request(app)
                .post("/api/newsletter")
                .send({ email: "news@test.com" });

            expect(res.status).toBe(201);
            expect(res.body.message).toContain("subscribed");
        });

        it("should prevent duplicate subscriptions", async () => {
            await Newsletter.create({ email: "dup@test.com" });
            
            const res = await request(app)
                .post("/api/newsletter")
                .send({ email: "dup@test.com" });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain("already subscribed");
        });
    });

    describe("Message Routes", () => {
        it("should save an inquiry message", async () => {
            const res = await request(app)
                .post("/api/messages")
                .send({
                    name: "Inquirer",
                    email: "inq@test.com",
                    message: "I have a question about my order."
                });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe("Inquirer");
        });
    });
});
