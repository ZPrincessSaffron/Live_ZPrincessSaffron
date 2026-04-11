import { useState, useEffect } from "react";
import { Product } from "../data/products";
import productJar from "@/assets/product-saffron-jar.jpg";
import giftBox from "@/assets/product-gift-box.jpg";

const API_URL = import.meta.env.VITE_API_URL as string;

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const data = await response.json();

                // If we have products in the DB, we can either append or replace.
                // For a clean storefront, replacing or prepending is better.
                // Let's combine them, ensuring uniqueness by ID if possible, 
                // or just showing the DB ones first.
                if (data && Array.isArray(data)) {
                    const mappedData = data.map((p: any) => {
                        let finalImage = p.image;
                        // Map local filenames to imported assets
                        if (p.image === "product-saffron-jar.jpg") finalImage = productJar;
                        else if (p.image === "product-gift-box.jpg") finalImage = giftBox;

                        return {
                            ...p,
                            id: p.id || p._id, // Use numeric id if exists, otherwise fallback to _id string
                            price: Number(p.price || 0),
                            rating: Number(p.rating || 5),
                            reviews: Number(p.reviews || 0),
                            image: finalImage
                        };
                    });
                    setProducts(mappedData);
                } else {
                    console.warn("API returned non-array data");
                    setProducts([]);
                }
            } catch (_err) {
                setError("Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};
