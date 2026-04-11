import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    const { product_id, rating, review_text, location, reviewer_name } = req.body;
    const userId = req.user ? req.user._id : null;

    try {
        // If it's a product-specific review
        if (product_id) {
            if (!userId) {
                return res.status(401).json({ message: "You must be logged in to review a product" });
            }

            // 1. Check if user has purchased the product
            const user = await User.findById(userId);
            const hasPurchased = user.orders.some(order =>
                (order.status === "paid" || order.status === "shipped" || order.status === "delivered" || order.status === "confirmed") &&
                order.items.some(item => item.product_id === product_id)
            );

            if (!hasPurchased) {
                return res.status(403).json({ message: "You can only review products you have purchased" });
            }

            // 2. Check for existing review
            const alreadyReviewed = await Review.findOne({ user: userId, product_id });
            if (alreadyReviewed) {
                return res.status(400).json({ message: "You have already reviewed this product" });
            }
        }

        // 3. Create the review
        const reviewData = {
            rating,
            review_text,
            location,
            product_id: product_id || null,
        };

        if (userId) {
            reviewData.user = userId;
        }

        // Always prioritize the name provided in the review form
        reviewData.reviewer_name = reviewer_name || (req.user ? req.user.fullName : "Guest");

        const review = await Review.create(reviewData);

        if (review) {
            // 4. Update Product average rating and count if it's a product review
            if (product_id) {
                const reviews = await Review.find({ product_id, published: true });
                const reviewCount = reviews.length;
                const avgRating = reviewCount > 0 
                    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount 
                    : rating;

                await Product.findOneAndUpdate(
                    { id: product_id },
                    {
                        rating: parseFloat(avgRating.toFixed(1)),
                        reviews: reviewCount
                    }
                );
            }

            res.status(201).json(review);
        } else {
            res.status(400).json({ message: "Invalid review data format" });
        }
    } catch (error) {
        console.error("❌ Review Creation Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }
        res.status(500).json({ message: error.message || "Internal server error during review creation" });
    }
};

// @desc    Get all reviews or reviews for a product
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
    const { product_id } = req.query;
    try {
        const filter = { published: true };
        if (product_id) filter.product_id = product_id;

        const reviews = await Review.find(filter)
            .populate("user", "fullName avatar_url")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

