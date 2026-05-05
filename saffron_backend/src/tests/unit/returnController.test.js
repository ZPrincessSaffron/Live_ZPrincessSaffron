import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../../models/orderModel.js";
import ReturnRequest from "../../models/returnRequestModel.js";
import User from "../../models/userModel.js";
import { 
    submitReturnRequest, 
    getMyReturns, 
    getAllReturns, 
    approveReturn, 
    rejectReturn, 
    processRefund 
} from "../../controllers/returnController.js";
import { jest } from "@jest/globals";

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

describe("Return Controller Unit Tests", () => {
    let mockReq, mockRes, userId, adminId;

    beforeEach(async () => {
        await Order.deleteMany({});
        await ReturnRequest.deleteMany({});
        await User.deleteMany({});
        
        userId = new mongoose.Types.ObjectId();
        adminId = new mongoose.Types.ObjectId();
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe("submitReturnRequest", () => {
        it("should fail if no items are selected", async () => {
            mockReq = {
                body: { orderId: "ORD123", items: [], reason: "Defective", images: ["img1", "img2"] },
                user: { _id: userId }
            };

            await submitReturnRequest(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "At least one item must be selected for return"
            }));
        });

        it("should fail if not exactly 2 images are provided", async () => {
            mockReq = {
                body: { orderId: "ORD123", items: [{ productId: 101, productName: "X" }], reason: "Damaged product", images: ["img1"] },
                user: { _id: userId }
            };

            await submitReturnRequest(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Exactly 2 product photos are required for a return request"
            }));
        });

        it("should fail if order is not delivered", async () => {
            await Order.create({
                user: userId,
                orderId: "ORD123",
                subtotal: 1000,
                total: 1000,
                status: "processing",
                items: [{ product_id: 101, product_name: "X", product_image: "i", quantity: 1, price: 1000 }],
                shippingDetails: { name: "X", email: "x@x.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1" },
                paymentMethod: "cod"
            });

            mockReq = {
                body: { orderId: "ORD123", items: [{ productId: 101, productName: "X" }], reason: "Damaged product", images: ["img1", "img2"] },
                user: { _id: userId }
            };

            await submitReturnRequest(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Return allowed only for delivered orders"
            }));
        });

        it("should fail if return period (24h) has expired", async () => {
            // Using updatedAt as a proxy for delivery date in the controller
            const oldDate = new Date(Date.now() - 26 * 60 * 60 * 1000);
            const order = await Order.create({
                user: userId,
                orderId: "ORD123",
                subtotal: 1000,
                total: 1000,
                status: "delivered",
                deliveredAt: oldDate,
                items: [{ product_id: 101, product_name: "X", product_image: "i", quantity: 1, price: 1000 }],
                shippingDetails: { name: "X", email: "x@x.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1" },
                paymentMethod: "cod"
            });

            mockReq = {
                body: { orderId: "ORD123", items: [{ productId: 101, productName: "X" }], reason: "Damaged product", images: ["img1", "img2"] },
                user: { _id: userId }
            };

            await submitReturnRequest(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Return period (24 hours) has expired"
            }));
        });

        it("should succeed with valid data", async () => {
            await Order.create({
                user: userId,
                orderId: "ORD_OK",
                subtotal: 1000,
                total: 1000,
                status: "delivered",
                items: [{ product_id: 101, product_name: "X", product_image: "i", quantity: 1, price: 1000 }],
                shippingDetails: { name: "X", email: "x@x.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1" },
                paymentMethod: "cod"
            });

            mockReq = {
                body: { 
                    orderId: "ORD_OK", 
                    items: [{ productId: 101, productName: "X" }], 
                    reason: "Quality issue", 
                    images: ["img1", "img2"],
                    pickupAddress: "123 Street",
                    contactNumber: "9988776655"
                },
                user: { _id: userId }
            };

            await submitReturnRequest(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Return requested successfully"
            }));

            const rr = await ReturnRequest.findOne({ orderId: "ORD_OK" });
            expect(rr).not.toBeNull();
            expect(rr.pickupAddress).toBe("123 Street");
        });
    });

    describe("Admin Actions", () => {
        let requestId;

        beforeEach(async () => {
            const rr = await ReturnRequest.create({
                userId,
                orderId: "ORD_ADMIN",
                items: [{ productId: 101, productName: "X" }],
                reason: "Quality issue",
                images: ["1", "2"],
                status: "requested",
                deliveryDate: new Date()
            });
            requestId = rr._id;
        });

        it("should approve a return request", async () => {
            mockReq = { params: { id: requestId } };
            await approveReturn(mockReq, mockRes);
            
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Return approved"
            }));
            
            const updated = await ReturnRequest.findById(requestId);
            expect(updated.status).toBe("approved");
        });

        it("should reject a return request with a note", async () => {
            mockReq = { 
                params: { id: requestId },
                body: { adminNote: "Photos not clear" }
            };
            await rejectReturn(mockReq, mockRes);
            
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Return rejected"
            }));
            
            const updated = await ReturnRequest.findById(requestId);
            expect(updated.status).toBe("rejected");
            expect(updated.adminNote).toBe("Photos not clear");
        });

        it("should process refund only if approved", async () => {
            // First try without approval
            mockReq = { params: { id: requestId } };
            await processRefund(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            
            // Now approve and try again
            await ReturnRequest.findByIdAndUpdate(requestId, { status: "approved" });
            await Order.create({
                orderId: "ORD_ADMIN",
                user: userId,
                subtotal: 1000,
                total: 1000,
                status: "delivered",
                razorpayOrderId: "rzp_123",
                items: [],
                shippingDetails: { name: "X", email: "x@x.com", phone: "1", address: "A", city: "C", state: "S", pincode: "1" },
                paymentMethod: "razorpay"
            });

            await processRefund(mockReq, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Refund processed successfully via Razorpay"
            }));
            
            const updated = await ReturnRequest.findById(requestId);
            expect(updated.status).toBe("refunded");
        });
    });
});
