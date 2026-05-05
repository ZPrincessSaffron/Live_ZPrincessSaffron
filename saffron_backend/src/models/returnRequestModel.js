import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        items: [
            {
                productId: { type: Number, required: true },
                productName: { type: String, required: true },
                productImage: { type: String },
                quantity: { type: Number, default: 1 },
            }
        ],
        reason: {
            type: String,
            required: true,
            enum: [
                "Damaged product",
                "Wrong item",
                "Not as described",
                "Quality issue",
                "Size/quantity issue",
                "Other"
            ],
        },
        description: {
            type: String,
        },
        images: [
            {
                type: String,
            }
        ],
        refundType: {
            type: String,
            default: "original",
            enum: ["original"],
        },
        status: {
            type: String,
            default: "requested",
            enum: ["requested", "approved", "rejected", "picked_up", "refunded"],
        },
        returnRequestedAt: {
            type: Date,
            default: Date.now,
        },
        deliveryDate: {
            type: Date,
            required: true,
        },
        pickupAddress: {
            type: String,
        },
        contactNumber: {
            type: String,
        },
        isEligible: {
            type: Boolean,
            default: true,
        },
        adminNote: {
            type: String,
        },
        approvedAt: {
            type: Date,
        },
        rejectedAt: {
            type: Date,
        },
        refundId: {
            type: String,
        }
    },
    { timestamps: true }
);

// Prevent duplicate returns for same product in same order
// Prevent multiple overlapping requests if needed, but we handle it in controller
returnRequestSchema.index({ orderId: 1 });

const ReturnRequest = mongoose.model("ReturnRequest", returnRequestSchema);
export default ReturnRequest;
