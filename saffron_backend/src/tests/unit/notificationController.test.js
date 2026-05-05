import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Notification from "../../models/notificationModel.js";
import { getUserNotifications, markAsRead } from "../../controllers/notificationController.js";
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

describe("notificationController", () => {
    let mockReq, mockRes, userId;

    beforeEach(async () => {
        await Notification.deleteMany({});
        userId = new mongoose.Types.ObjectId();
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("getUserNotifications", () => {
        it("should return notifications for the user", async () => {
            await Notification.create({
                userId,
                orderId: new mongoose.Types.ObjectId(),
                readableOrderId: "#ORD123",
                message: "Test Message",
                status: "confirmed"
            });

            mockReq = { user: { _id: userId } };
            await getUserNotifications(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ message: "Test Message" })
            ]));
        });
    });

    describe("markAsRead", () => {
        it("should mark notification as read", async () => {
            const note = await Notification.create({
                userId,
                orderId: new mongoose.Types.ObjectId(),
                readableOrderId: "#ORD456",
                message: "Unread Message",
                status: "shipped"
            });

            mockReq = {
                user: { _id: userId },
                params: { id: note._id }
            };

            await markAsRead(mockReq, mockRes);

            const updatedNote = await Notification.findById(note._id);
            expect(updatedNote.isRead).toBe(true);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Notification marked as read" });
        });
    });
});
