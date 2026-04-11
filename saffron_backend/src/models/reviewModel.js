import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // Optional for guest site reviews
        },
        reviewer_name: {
            type: String,
        },
        product_id: {
            type: Number,
            // Optional for site reviews
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review_text: {
            type: String,
            required: true,
        },
        location: {
            type: String,
        },
        published: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Ensure one review per user per product (only for specific products)
// This skips the unique check for site-wide reviews (where product_id is null)
reviewSchema.index(
    { user: 1, product_id: 1 },
    { 
        unique: true, 
        partialFilterExpression: { 
            user: { $exists: true }, 
            product_id: { $type: "number" } 
        } 
    }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;

