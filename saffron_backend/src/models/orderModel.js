import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        subtotal: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        shipping: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
            default: "pending",
        },
        items: [
            {
                product_id: {
                    type: Number,
                    required: true,
                },
                product_name: {
                    type: String,
                    required: true,
                },
                product_image: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        shippingDetails: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        razorpayOrderId: {
            type: String,
        },
    },
    { timestamps: true }
);

// Indexes for performance
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;

