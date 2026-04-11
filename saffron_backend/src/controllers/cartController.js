import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// @desc    Get user cart with stock validation
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
            return res.json([]);
        }

        // Logic Rule: If stock reduced -> auto adjust cart
        let itemsChanged = false;
        const enrichedItems = [];

        for (const item of cart.items) {
            const product = await Product.findOne({ id: item.product_id });

            if (!product || product.stock === 0) {
                itemsChanged = true;
                continue;
            }

            if (item.quantity > product.stock) {
                item.quantity = product.stock;
                itemsChanged = true;
            }
            
            // Convert to object and add product details
            const itemObj = item.toObject();
            itemObj.product = product;
            enrichedItems.push(itemObj);
        }

        if (itemsChanged) {
            cart.items = enrichedItems.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
            await cart.save();
        }

        res.json(enrichedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart or update quantity with stock validation
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;

    try {
        const product = await Product.findOne({ id: product_id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Logic Rule: Quantity cannot exceed stock
        if (product.stock <= 0) {
            return res.status(400).json({ message: "Product is out of stock" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // New cart
            if (quantity > product.stock) {
                return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
            }
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product_id, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product_id === product_id
            );

            if (itemIndex > -1) {
                // Logic Rule: If product already exists -> increase quantity
                const newTotalQuantity = cart.items[itemIndex].quantity + quantity;
                if (newTotalQuantity > product.stock) {
                    return res.status(400).json({ message: `Cannot add more. Only ${product.stock} items in stock (you have ${cart.items[itemIndex].quantity} in cart)` });
                }
                cart.items[itemIndex].quantity = newTotalQuantity;
            } else {
                if (quantity > product.stock) {
                    return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
                }
                cart.items.push({ product_id, quantity });
            }
            await cart.save();
        }

        // Return enriched items
        const enrichedItems = [];
        for (const item of cart.items) {
            const p = await Product.findOne({ id: item.product_id });
            const itemObj = item.toObject();
            itemObj.product = p;
            enrichedItems.push(itemObj);
        }

        res.status(201).json(enrichedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update item quantity with stock validation
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const product_id = parseInt(req.params.productId);

    try {
        const product = await Product.findOne({ id: product_id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            const itemIndex = cart.items.findIndex(
                (item) => item.product_id === product_id
            );

            if (itemIndex > -1) {
                if (quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                } else {
                    // Logic Rule: Quantity cannot exceed stock
                    if (quantity > product.stock) {
                        return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
                    }
                    cart.items[itemIndex].quantity = quantity;
                }
                await cart.save();
                
                // Return enriched items
                const enrichedItems = [];
                for (const item of cart.items) {
                    const p = await Product.findOne({ id: item.product_id });
                    const itemObj = item.toObject();
                    itemObj.product = p;
                    enrichedItems.push(itemObj);
                }
                res.json(enrichedItems);
            } else {
                res.status(404).json({ message: "Item not found in cart" });
            }
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
    const product_id = parseInt(req.params.productId);

    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = cart.items.filter((item) => item.product_id !== product_id);
            await cart.save();
            res.json(cart.items);
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = [];
            await cart.save();
            res.json({ message: "Cart cleared" });
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

