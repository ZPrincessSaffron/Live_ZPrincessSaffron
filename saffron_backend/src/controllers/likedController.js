import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const getLikedProducts = async (req, res) => {
    try {
        console.time("[DB] getLikedProducts");
        const user = await User.findById(req.user._id).select("likedProducts").lean();

        if (user) {
            // Use $in to fetch all products in a single query
            const products = await Product.find({ id: { $in: user.likedProducts } }).lean();
            
            // Map back to the expected format
            const enrichedLikedProducts = user.likedProducts.map(productId => {
                const product = products.find(p => p.id === productId);
                return {
                    product_id: productId,
                    product: product || null
                };
            });

            console.timeEnd("[DB] getLikedProducts");
            res.json(enrichedLikedProducts);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle like for a product
// @route   POST /api/users/liked
// @access  Private
export const toggleLikeProduct = async (req, res) => {
    const { product_id } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const isLiked = user.likedProducts.includes(product_id);

        if (isLiked) {
            user.likedProducts = user.likedProducts.filter(id => id !== product_id);
            await user.save();
            res.json({ message: "Product removed from wishlist", liked: false });
        } else {
            user.likedProducts.push(product_id);
            await user.save();
            res.json({ message: "Product added to wishlist", liked: true });
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

