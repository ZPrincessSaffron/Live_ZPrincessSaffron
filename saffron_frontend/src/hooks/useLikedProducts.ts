import { useWishlistContext } from "@/contexts/WishlistContext";

export { type LikedProduct } from "@/contexts/WishlistContext";

export const useLikedProducts = () => {
  const context = useWishlistContext();

  return {
    likedProducts: context.likedProducts,
    isLoading: context.isLoading,
    toggleLike: context.toggleLike,
    isProductLiked: context.isProductLiked,
    likedCount: context.likedCount,
    refetch: context.refetchWishlist,
  };
};
