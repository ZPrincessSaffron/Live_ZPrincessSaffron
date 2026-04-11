import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface LikedProduct {
    product_id: string | number;
    product?: any;
}

interface WishlistContextType {
    likedProducts: LikedProduct[];
    likedCount: number;
    isLoading: boolean;
    toggleLike: (productId: string | number) => Promise<boolean>;
    isProductLiked: (productId: string | number) => boolean;
    refetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLikedProducts = useCallback(async () => {
        if (!user || !user.token) {
            setLikedProducts([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/liked`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setLikedProducts(data || []);
            }
        } catch (error) {
            console.error("Error fetching liked products:", error);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchLikedProducts();
    }, [fetchLikedProducts]);

    const toggleLike = async (productId: string | number) => {
        if (!user || !user.token) {
            toast({
                title: "Please sign in",
                description: "You need to be logged in to save products",
                variant: "destructive",
            });
            return false;
        }

        try {
            const response = await fetch(`${API_URL}/users/liked`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ product_id: productId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to toggle like");
            }

            toast({
                title: data.liked ? "Added to wishlist" : "Removed",
                description: data.message,
            });

            await fetchLikedProducts();
            return true;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update wishlist",
                variant: "destructive",
            });
            return false;
        }
    };

    const isProductLiked = (productId: string | number) => {
        return likedProducts.some((item) => String(item.product_id) === String(productId));
    };

    const likedCount = likedProducts.length;

    return (
        <WishlistContext.Provider
            value={{
                likedProducts,
                likedCount,
                isLoading,
                toggleLike,
                isProductLiked,
                refetchWishlist: fetchLikedProducts,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlistContext = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlistContext must be used within a WishlistProvider");
    }
    return context;
};
