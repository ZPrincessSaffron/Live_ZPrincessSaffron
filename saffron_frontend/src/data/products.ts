import product1 from "@/assets/product1.png";
import product2 from "@/assets/product2.png";
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
    price: 1140,
    originalPrice: 2000,
    rating: 4.5,
    reviews: 50,
    image: product1,
    tag: "ELITE",
    category: "threads",
    description: "our finest saffron. Perfect for regular culinary use.",
  },
  {
    id: 2,
    name: "Royal Saffron - 2G",
    price: 1140,
    originalPrice: 2000,
    rating: 5,
    reviews: 89,
    image: product2,
    tag: "BEST SELLER",
    category: "threads",
    description: "Family pack of authentic Kashmiri saffron. Best value for regular users.",
  },
  {
    id: 3,
    name: "Premium Saffron - 10G",
    price: 5700,
    originalPrice: 6300,
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
