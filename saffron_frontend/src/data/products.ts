import product1 from "@/assets/product1.png";
import product3 from "@/assets/product3.png";

export interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  tag?: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Elite Saffron - 2G",
    price: 1450,
    originalPrice: 1667,
    rating: 4.5,
    reviews: 50,
    image: product1,
    tag: "ELITE",
    category: "threads",
    description: "our finest saffron. Perfect for regular culinary use.",
  },

  {
    id: 3,
    name: "Premium Saffron - 2G",
    price: 1450,
    originalPrice: 1667,
    rating: 5,
    reviews: 45,
    image: product3,
    tag: "PREMIUM",
    category: "threads",
    description: "Experience the luxury.",
  },

];

export const getProductById = (id: number | string): Product | undefined => {
  return products.find((product) => product.id.toString() === id.toString());
};
