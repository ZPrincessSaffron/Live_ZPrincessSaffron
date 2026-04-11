import Newsletter from "../models/newsletterModel.js";

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "You are already subscribed to our newsletter!" });
        }

        const subscription = await Newsletter.create({ email });

        if (subscription) {
            res.status(201).json({ message: "Successfully subscribed to newsletter!" });
        } else {
            res.status(400).json({ message: "Invalid subscription data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all subscribers (for admin use)
// @route   GET /api/newsletter
// @access  Private (currently public for development)
export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

