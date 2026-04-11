import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";

dotenv.config();

const products = [
    {
        id: 1,
        name: "Royal Saffron Threads - 1g",
        price: 1499,
        originalPrice: 1999,
        rating: 4.9,
        reviews: 128,
        image: "product-saffron-jar.jpg",
        tag: "Best Seller",
        category: "threads",
        description: "Premium Grade A+ Kashmiri saffron threads. Hand-picked and naturally dried.",
    },
    {
        id: 2,
        name: "Royal Saffron Threads - 2g",
        price: 2799,
        originalPrice: 3499,
        rating: 4.9,
        reviews: 89,
        image: "product-saffron-jar.jpg",
        tag: "Popular",
        category: "threads",
        description: "Double pack of our finest saffron. Perfect for regular culinary use.",
    },
    {
        id: 3,
        name: "Premium Gift Collection",
        price: 12999,
        originalPrice: 15999,
        rating: 5.0,
        reviews: 45,
        image: "product-gift-box.jpg",
        tag: "Gift Set",
        category: "gift",
        description: "Luxury velvet box with 5 premium saffron vials. Perfect for gifting.",
    },
    {
        id: 4,
        name: "Royal Saffron Threads - 5g",
        price: 6499,
        originalPrice: 7999,
        rating: 4.8,
        reviews: 67,
        image: "product-saffron-jar.jpg",
        tag: "Value Pack",
        category: "threads",
        description: "Family pack of authentic Kashmiri saffron. Best value for regular users.",
    },
    {
        id: 5,
        name: "Saffron Powder - Pure",
        price: 999,
        originalPrice: 1299,
        rating: 4.7,
        reviews: 92,
        image: "product-saffron-jar.jpg", // Assuming jar for powder if no specific image
        category: "powder",
        description: "Finely ground saffron powder. Perfect for desserts and beverages.",
    },
    {
        id: 6,
        name: "Bridal Gift Box",
        price: 24999,
        originalPrice: 29999,
        rating: 5.0,
        reviews: 23,
        image: "product-gift-box.jpg",
        tag: "Exclusive",
        category: "gift",
        description: "Premium bridal collection with multiple saffron varieties and accessories.",
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products");

        await Product.insertMany(products);
        console.log("🌱  Database Seeded with 6 products!");

        process.exit();
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();

