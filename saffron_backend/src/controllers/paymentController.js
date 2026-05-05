import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import firebaseService from "../services/firebaseService.js";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
    const { currency } = req.body;

    try {
        // 1. Fetch user's cart from DB
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 2. Fetch real product prices and calculate total amount
        let totalAmount = 0;
        for (const item of cart.items) {
            const product = await Product.findOne({ id: item.product_id });
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product_id}` });
            }
            totalAmount += product.price * item.quantity;
        }

        const options = {
            amount: Math.round(totalAmount * 100), // amount in paise
            currency: currency || "INR",
            receipt: `receipt_${Math.random().toString(36).substring(2, 11)}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ message: "Failed to create Razorpay order", error: error.message });
    }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            // Payment is verified
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id }).populate("user");
            if (order) {
                order.status = "paid";
                await order.save();
                
                // Trigger non-blocking email and push notification
                firebaseService.sendStatusUpdateNotification(order.user, order, "payment_success");
            }
            res.status(200).json({ status: "success", message: "Payment verified successfully" });
        } else {
            // Payment failed - notify the user if order exists
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id }).populate("user");
            if (order) {
                firebaseService.sendStatusUpdateNotification(order.user, order, "payment_failed");
            }
            res.status(400).json({ status: "failure", message: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ message: "Internal server error during verification" });
    }
};

