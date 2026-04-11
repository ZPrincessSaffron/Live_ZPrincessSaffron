import Message from "../models/messageModel.js";

// @desc    Create a new message/inquiry
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
    const { name, email, phone, topic, contact_method, message } = req.body;

    try {
        const newMessage = await Message.create({
            name,
            email,
            phone,
            topic,
            contact_method,
            message,
        });

        if (newMessage) {
            res.status(201).json(newMessage);
        } else {
            res.status(400).json({ message: "Invalid message data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all messages (for admin use)
// @route   GET /api/messages
// @access  Private (though currently public for ease of development)
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

