import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import product1 from "@/assets/product1.png";
import product3 from "@/assets/product3.png";
import { useEffect, useState } from "react";
import { preloadImages, resolveProductImage } from "@/utils/imageUtils";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Elite Saffron - 2G",
    price: "₹1,140",
    image: product1,
    tag: "Elite",
    rating: 4.5,
    reviews: 50,
    description:
      "Our finest saffron, hand-harvested from the pristine valleys of Kashmir for unmatched purity.",
  },
  {
    id: 3,
    name: "Premium Saffron - 2G",
    price: "₹5,700",
    image: product3,
    tag: "Premium",
    rating: 5.0,
    reviews: 45,
    description:
      "Experience the ultimate luxury with our large-format premium saffron collection.",
  },
];

const waitForImage = (imagePath: string) =>
  new Promise<void>((resolve) => {
    const src = resolveProductImage(imagePath);

    if (!src) {
      resolve();
      return;
    }

    const image = new Image();
    image.decoding = "async";
    image.setAttribute("fetchpriority", "high");
    image.src = src;

    if (image.complete) {
      resolve();
      return;
    }

    image.onload = () => resolve();
    image.onerror = () => resolve();
  });

const ProductShowcase = () => {
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const featuredStaticProducts = products.slice(0, 2);
    preloadImages(featuredStaticProducts.map((product) => product.image), { priority: "high" });

    let isActive = true;

    const revealProductsWhenReady = async () => {
      await Promise.all(featuredStaticProducts.map((product) => waitForImage(product.image)));

      if (isActive) {
        setIsLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        const data = await response.json() as any[];
        const filtered = data.filter(p => p.id !== 2 && p.id !== "2");
        const featuredProducts = filtered.slice(0, 2);
        preloadImages(featuredProducts.map((product) => product.image), { priority: "high" });
        if (isActive) {
          setApiProducts(featuredProducts);
        }
      } catch {
        // silently fall back to static products
      }
    };

    revealProductsWhenReady();
    fetchProducts();

    const handleScroll = () => {
      setOffset(window.scrollY * 0.12);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      isActive = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const displayProducts = apiProducts.length > 0 ? apiProducts : products;
  

  return (
    <section className="py-24 bg-ivory">
      <div className="container mx-auto px-4 md:px-6 lg:px-0">

        {/* FLOATING HEADER */}
        <div
          style={{
            transform: `translateY(${-offset}px)`,
            transition: "transform 0.1s linear",
          }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <br />
          <br />

          <p className="font-sans text-gold font-medium text-sm tracking-[0.3em] uppercase mb-4">
            Curated Excellence
          </p>

          <h2 className="font-cinzel text-3xl md:text-4xl tracking-[0.18em] lg:text-5xl text-royal-purple mb-6 font-medium">
            Experience Luxury
          </h2>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />

          <p className="text-muted-foreground leading-relaxed  font-rr text-[16px]">
            Each strand of saffron is a symbol of luxury, purity, and authenticity—sourced directly from the highlands of Kashmir.
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="flex flex-wrap justify-center gap-12 max-w-12xl mx-auto mb-20">
          {isLoading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="w-full lg:w-[calc(50%-1.5rem)] h-[500px] bg-gray-100 animate-pulse" />
            ))
          ) : (
            displayProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative overflow-hidden bg-card shadow-card transition-all duration-700 hover:shadow-elegant hover:-translate-y-2 w-full lg:w-[calc(50%-1.5rem)]"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* TAG */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-4 py-1 bg-ivory text-royal-purple text-xs font-semibold tracking-wider uppercase rounded-full">
                    {product.tag}
                  </span>
                </div>

                {/* IMAGE */}
                <div className="relative h-[420px] md:h-[600px] flex items-center justify-center bg-gradient-to-b from-[#faf7f2] to-[#f3ede6] overflow-hidden">

  {/* LIGHT GLOW */}
  <div className="absolute w-[70%] h-[70%] bg-white/40 blur-[80px] rounded-full" />

  {/* IMAGE */}
  <img
    src={resolveProductImage(product.image)}
    alt={product.name}
    fetchPriority="high"
    loading="eager"
    decoding="async"
    className="
      relative z-10
      max-h-[80%] w-auto object-contain
      transition-all duration-700
      group-hover:scale-105
      group-hover:-translate-y-2
      drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]
    "
  />

  {/* GROUND SHADOW */}
  <div className="absolute bottom-8 w-[60%] h-[20px] bg-royal-purple-dark/60 blur-2xl rounded-full" />

</div>

                {/* CONTENT */}
                <div className="p-8 md:p-10">

                 

                  {/* RATING */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "fill-brand-gold  text-brand-gold"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                   
                  </div>

                  {/* TITLE */}
                  <h3 className="-mt-1 font-cinzel capitalize font-bold uppercase text-royal-purple/80 text-[20px] tracking-[0.09em]">
                    {product.name}
                  </h3>
<br/>
                  {/* DESCRIPTION */}
                  <p className="product-desc  font-medium text-[15px] text-royal-purple-dark/50 tracking-[0.05em]">
                    {product.description}
                  </p>

                  
                </div>

                {/* GOLD LINE */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))
          )}
        </div>

        {/* BUTTON */}
        <div className="text-center">
          <Link to="/products">
            <Button variant="section" className="min-w-[240px]">
              View All Products
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;
