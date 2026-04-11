import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import firebaseService from "../services/firebaseService.js";

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
export const getOrders = async (req, res) => {
    try {
        console.time(`[DB] Order.find (user:${req.user._id})`);
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();
        console.timeEnd(`[DB] Order.find (user:${req.user._id})`);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order with stock orchestration
// @route   POST /api/users/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { checkoutData } = req.body;

        // 1. & 2. Validate and Reduce stock in parallel
        console.time("[DB] Order Creation Orchestration");
        await Promise.all(checkoutData.items.map(async (item) => {
            const product = await Product.findOne({ id: item.product_id });
            if (!product) {
                throw new Error(`Product ${item.product_name} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }
            product.stock -= item.quantity;
            return product.save();
        }));
        console.timeEnd("[DB] Order Creation Orchestration");

        // 3. Create order record in dedicated collection
        // Status is "confirmed" because this is only called after payment is verified
        const order = new Order({
            user: req.user._id,
            orderId: Math.random().toString(36).substring(2, 11).toUpperCase(),
            subtotal: checkoutData.subtotal,
            discount: checkoutData.discount,
            shipping: checkoutData.shipping,
            total: checkoutData.total,
            status: "confirmed",
            items: checkoutData.items,
            shippingDetails: checkoutData.shippingDetails,
            paymentMethod: checkoutData.paymentMethod,
            razorpayOrderId: checkoutData.razorpayOrderId,
        });

        const createdOrder = await order.save();

        // Send push notification (non-blocking)
        firebaseService.sendStatusUpdateNotification(req.user, createdOrder, "confirmed");

        // 4. Clear user cart
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel order and restore stock
// @route   PUT /api/users/orders/:orderId/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
    try {
        const requestedId = String(req.params.orderId).trim();

        const order = await Order.findOne({ orderId: requestedId, user: req.user._id });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({ message: "Order is already cancelled" });
        }

        // Restore stock in parallel
        console.time("[DB] Order Cancel Stock Restoration");
        await Promise.all(order.items.map(async (item) => {
            if (item.product_id) {
                const product = await Product.findOne({ id: item.product_id });
                if (product) {
                    product.stock += (Number(item.quantity) || 0);
                    return product.save();
                }
            }
        }));
        console.timeEnd("[DB] Order Cancel Stock Restoration");

        order.status = "cancelled";
        await order.save();

        // Send push & email notification (non-blocking)
        firebaseService.sendStatusUpdateNotification(req.user, order, "cancelled");

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

