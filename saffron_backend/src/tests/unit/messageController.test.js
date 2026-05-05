import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Message from "../../models/messageModel.js";
import { createMessage, getMessages } from "../../controllers/messageController.js";
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

describe("messageController", () => {
    let mockReq, mockRes;

    beforeEach(async () => {
        await Message.deleteMany({});
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("createMessage", () => {
        it("should save a new inquiry message", async () => {
            mockReq = {
                body: {
                    name: "Inquirer",
                    email: "inq@test.com",
                    message: "Help please"
                }
            };

            await createMessage(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            const msg = await Message.findOne({ email: "inq@test.com" });
            expect(msg).toBeDefined();
        });
    });
});
