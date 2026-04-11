import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface CartItem {
    id: string;
    product_id: string | number;
    quantity: number;
    product?: any;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    isLoading: boolean;
    addToCart: (productId: string | number, quantity?: number) => Promise<boolean>;
    updateQuantity: (productId: string | number, quantity: number) => Promise<boolean>;
    removeFromCart: (productId: string | number) => Promise<boolean>;
    clearCart: () => Promise<boolean>;
    getItemQuantity: (productId: string | number) => number;
    refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user || !user.token) {
            setCartItems([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/cart`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setCartItems(data || []);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId: string | number, quantity: number = 1) => {
        if (!user || !user.token) {
            toast({
                title: "Please sign in",
                description: "You need to be logged in to add items to cart",
                variant: "destructive",
            });
            return false;
        }

        try {
            const numericProductId = Number(productId);
            const response = await fetch(`${API_URL}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ product_id: numericProductId, quantity }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (errorData.message === "Product is out of stock") {
                    throw new Error("Product is out of stock");
                }
                throw new Error(errorData.message || "Failed to add to cart");
            }

            toast({
                title: "Added to cart",
                description: "Item has been added to your cart",
            });

            await fetchCart();
            return true;
        } catch (error) {
            // Attempt to parse out-of-stock error from backend
            let errorMessage = "Failed to add to cart";
            
            if (error instanceof Error && error.message === "Product is out of stock") {
                toast({
                    title: "Could not add product",
                    description: "Out of stock",
                });
                return false;
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            return false;
        }
    };

    const updateQuantity = async (productId: string | number, quantity: number) => {
        if (!user || !user.token) return false;

        if (quantity <= 0) {
            return removeFromCart(productId);
        }

        try {
            const numericProductId = Number(productId);
            const response = await fetch(`${API_URL}/cart/${numericProductId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ quantity }),
            });

            if (!response.ok) {
                throw new Error("Failed to update quantity");
            }

            await fetchCart();
            return true;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update quantity",
                variant: "destructive",
            });
            return false;
        }
    };

    const removeFromCart = async (productId: string | number) => {
        if (!user || !user.token) return false;

        try {
            const numericProductId = Number(productId);
            const response = await fetch(`${API_URL}/cart/${numericProductId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to remove item");
            }

            toast({
                title: "Removed",
                description: "Item has been removed from cart",
            });

            await fetchCart();
            return true;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove item",
                variant: "destructive",
            });
            return false;
        }
    };

    const clearCart = async () => {
        if (!user || !user.token) return false;

        try {
            const response = await fetch(`${API_URL}/cart`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to clear cart");
            }

            setCartItems([]);
            return true;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to clear cart",
                variant: "destructive",
            });
            return false;
        }
    };

    const getItemQuantity = (productId: string | number) => {
        const item = cartItems.find((item) => item.product_id === productId);
        return item?.quantity || 0;
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                isLoading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                getItemQuantity,
                refetchCart: fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
};
