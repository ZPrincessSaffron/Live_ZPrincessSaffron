import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

