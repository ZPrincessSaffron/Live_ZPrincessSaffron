import Product from "../models/productModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        console.time("[DB] Product.find (all)");
        const products = await Product.find({})
            .lean()
            .select("id name price originalPrice rating reviews image tag category description stock");
        console.timeEnd("[DB] Product.find (all)");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Admin (to be protected later)
export const createProduct = async (req, res) => {
    try {
        const { id, name, price, originalPrice, rating, reviews, image, tag, category, description, stock } = req.body;

        // Validation
        if (price < 0) {
            return res.status(400).json({ message: "Price cannot be negative" });
        }
        if (stock < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }

        console.time(`[DB] Product.findOne (id:${id})`);
        const productExists = await Product.findOne({ id }).lean();
        console.timeEnd(`[DB] Product.findOne (id:${id})`);
        if (productExists) {
            return res.status(400).json({ message: "Product with this ID already exists" });
        }

        const product = await Product.create({
            id,
            name,
            price,
            originalPrice,
            rating,
            reviews,
            image,
            tag,
            category,
            description,
            stock: stock ?? 0,
        });

        if (product) {
            res.status(201).json(product);
        } else {
            res.status(400).json({ message: "Invalid product data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single product by MongoDB _id
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        console.time(`[DB] Product.findById (${req.params.id})`);
        const product = await Product.findById(req.params.id).lean();
        console.timeEnd(`[DB] Product.findById (${req.params.id})`);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Validation
        if (req.body.price !== undefined && req.body.price < 0) {
            return res.status(400).json({ message: "Price cannot be negative" });
        }
        if (req.body.stock !== undefined && req.body.stock < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }

        const fields = ["name", "price", "originalPrice", "image", "category", "description", "stock", "rating", "reviews", "tag"];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) product[field] = req.body[field];
        });

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

