import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import ReturnRequest from "../models/returnRequestModel.js";
import firebaseService from "../services/firebaseService.js";

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        console.time("[DB] Admin.getAllOrders");
        
        // Fetch orders and return requests in parallel for better performance
        const [orders, returns] = await Promise.all([
            Order.find({})
                .populate("user", "fullName email phone")
                .sort({ createdAt: -1 })
                .lean()
                .limit(200),
            ReturnRequest.find({}).lean()
        ]);

        // Map return requests to their corresponding orders
        const ordersWithReturns = orders.map(order => ({
            ...order,
            returnRequest: returns.find(r => r.orderId === order.orderId) || null
        }));

        console.timeEnd("[DB] Admin.getAllOrders");
        res.json(ordersWithReturns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:orderId/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const order = await Order.findOne({ orderId: req.params.orderId }).populate("user", "fcmToken fullName email");
        if (!order) return res.status(404).json({ message: "Order not found" });
        order.status = status;
        await order.save();

        // Send push notification (non-blocking) - handles all status mappings automatically
        firebaseService.sendStatusUpdateNotification(order.user, order, status);

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get dashboard overview stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        console.time("[DB] Admin.getDashboardStats");
        const [totalUsers, orderStats, lowStockProducts] = await Promise.all([
            User.countDocuments({}).lean(),
            Order.aggregate([
                { $match: { status: { $nin: ["cancelled", "pending"] } } },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: "$total" },
                    },
                },
            ]),
            Product.find({ stock: { $lt: 5 } }).select("name stock id image").lean()
        ]);
        console.timeEnd("[DB] Admin.getDashboardStats");

        const totalOrders = orderStats.length > 0 ? orderStats[0].totalOrders : 0;
        const totalRevenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue,
            lowStockCount: lowStockProducts.length,
            lowStockProducts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sales report (daily/monthly)
// @route   GET /api/admin/sales-report
// @access  Private/Admin
export const getSalesReport = async (req, res) => {
    try {
        console.time("[DB] Admin.getSalesReport");
        const [dailySales, monthlySales, topProducts] = await Promise.all([
            Order.aggregate([
                { $match: { status: { $nin: ["cancelled", "pending"] } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        revenue: { $sum: "$total" },
                        orders: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
                { $limit: 30 },
            ]),
            Order.aggregate([
                { $match: { status: { $nin: ["cancelled", "pending"] } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        revenue: { $sum: "$total" },
                        orders: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            Order.aggregate([
                { $match: { status: { $nin: ["cancelled", "pending"] } } },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.product_name",
                        quantity: { $sum: "$items.quantity" },
                        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                    }
                },
                { $sort: { quantity: -1 } },
                { $limit: 10 }
            ])
        ]);
        console.timeEnd("[DB] Admin.getSalesReport");

        res.json({
            daily: dailySales.map(item => ({ date: item._id, revenue: item.revenue, orders: item.orders })),
            monthly: monthlySales.map(item => ({ month: item._id, revenue: item.revenue, orders: item.orders })),
            topProducts: topProducts.map(item => ({ name: item._id, quantity: item.quantity, revenue: item.revenue })),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending return count
// @route   GET /api/admin/returns/count
// @access  Private/Admin
export const getPendingReturnCount = async (req, res) => {
    try {
        const count = await ReturnRequest.countDocuments({ status: "requested" });
        res.json({ pendingReturns: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
