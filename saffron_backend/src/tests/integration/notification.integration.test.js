import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import User from "../../models/userModel.js";
import Notification from "../../models/notificationModel.js";
import { generateToken } from "../../config/generateToken.js";
import { jest } from "@jest/globals";

jest.setTimeout(600000);

let mongoServer;
let userToken;
let testUser;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    testUser = await User.create({
        fullName: "Notif User",
        email: "notif@test.com",
        password: "password123"
    });
    userToken = generateToken(testUser._id, false);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe("Notification Integration Tests", () => {
    beforeEach(async () => {
        await Notification.deleteMany({});
    });

    describe("GET /api/notifications", () => {
        it("should return notification history for user", async () => {
            const fakeOrderId = new mongoose.Types.ObjectId();
            await Notification.create({
                userId: testUser._id,
                message: "Test Notif",
                orderId: fakeOrderId,
                readableOrderId: "ORD1",
                status: "shipped"
            });

            const res = await request(app)
                .get("/api/notifications")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].message).toBe("Test Notif");
        });
    });

    describe("PUT /api/notifications/:id/read", () => {
        it("should mark notification as read", async () => {
            const fakeOrderId = new mongoose.Types.ObjectId();
            const notif = await Notification.create({
                userId: testUser._id,
                message: "Unread Notif",
                orderId: fakeOrderId,
                readableOrderId: "ORD1",
                status: "shipped",
                isRead: false
            });

            const res = await request(app)
                .put(`/api/notifications/${notif._id}/read`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            
            const updatedNotif = await Notification.findById(notif._id);
            expect(updatedNotif.isRead).toBe(true);
        });
    });

    describe("DELETE /api/notifications", () => {
        it("should clear all notifications for user", async () => {
            const fakeOrderId = new mongoose.Types.ObjectId();
            await Notification.create({
                userId: testUser._id,
                message: "N1",
                orderId: fakeOrderId,
                readableOrderId: "O1",
                status: "s"
            });

            const res = await request(app)
                .delete("/api/notifications")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            
            const count = await Notification.countDocuments({ userId: testUser._id });
            expect(count).toBe(0);
        });
    });
});
