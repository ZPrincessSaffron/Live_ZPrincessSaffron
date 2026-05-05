import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Blog from "../../models/blogModel.js";
import { createBlog, getBlogs } from "../../controllers/blogController.js";
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

describe("blogController", () => {
    let mockReq, mockRes;

    beforeEach(async () => {
        await Blog.deleteMany({});
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("createBlog", () => {
        it("should create a blog article", async () => {
            mockReq = {
                body: {
                    title: "Test Blog",
                    content: "Content...",
                    author_name: "Author"
                }
            };

            await createBlog(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            const blog = await Blog.findOne({ title: "Test Blog" });
            expect(blog).toBeDefined();
        });
    });

    describe("getBlogs", () => {
        it("should return published blogs only", async () => {
            await Blog.create({ title: "Published", content: "...", author_name: "A", published: true });
            await Blog.create({ title: "Draft", content: "...", author_name: "A", published: false });

            await getBlogs({}, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ title: "Published" })
            ]));
            expect(mockRes.json).toHaveBeenCalledWith(expect.not.arrayContaining([
                expect.objectContaining({ title: "Draft" })
            ]));
        });
    });
});
