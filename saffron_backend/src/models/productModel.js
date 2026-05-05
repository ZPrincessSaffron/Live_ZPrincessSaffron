import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"],
        },
        originalPrice: {
            type: Number,
        },
        rating: {
            type: Number,
            default: 5.0,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        image: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            default: 0,
            min: [0, "Stock cannot be negative"],
        },
    },
    { timestamps: true }
);

// Automatic tag management based on stock
productSchema.pre("save", async function () {
    if (this.isNew || this.isModified("stock")) {
        if (this.stock === 0) {
            this.tag = "Out of Stock";
        } else if (this.stock > 0 && this.tag === "Out of Stock") {
            this.tag = ""; // Clear the tag if stock is back and it was "Out of Stock"
        }
    }
});

// Indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;

