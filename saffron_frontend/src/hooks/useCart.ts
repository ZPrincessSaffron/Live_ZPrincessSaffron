import { useCartContext } from "@/contexts/CartContext";

export { type CartItem } from "@/contexts/CartContext";

export const useCart = () => {
  const context = useCartContext();

  return {
    cartItems: context.cartItems,
    isLoading: context.isLoading,
    addToCart: context.addToCart,
    updateQuantity: context.updateQuantity,
    removeFromCart: context.removeFromCart,
    clearCart: context.clearCart,
    getItemQuantity: context.getItemQuantity,
    cartCount: context.cartCount,
    refetch: context.refetchCart,
  };
};
