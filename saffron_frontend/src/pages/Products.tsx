import { useState, useMemo, useEffect, useRef } from "react";
import { Heart, ShoppingCart, Share2, Star, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { products } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useLikedProducts } from "@/hooks/useLikedProducts";
import heroVideo from "@/assets/products-hero-video.mp4";
import { Button } from "@/components/ui/button";
import { preloadImages, resolveProductImage } from "@/utils/imageUtils";

const priceRanges = [
  { key: "all", label: "All Prices", min: 0, max: Infinity },
  { key: "under-2000", label: "Under ₹2,000", min: 0, max: 2000 },
  { key: "2000-5000", label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { key: "5000-10000", label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { key: "above-10000", label: "Above ₹10,000", min: 10000, max: Infinity },
];

const ratingOptions = [
  { key: "all", label: "All Ratings", min: 0 },
  { key: "4.5+", label: "4.5★ & above", min: 4.5 },
  { key: "4+", label: "4★ & above", min: 4 },
];

const saffronTypes = [
  { key: "all", label: "All Types" },
  { key: "threads", label: "Strands" },
  { key: "powder", label: "Powder" },
];

const waitForImage = (imagePath: string, priority: "high" | "auto" = "auto") =>
  new Promise<void>((resolve) => {
    const src = resolveProductImage(imagePath);

    if (!src) {
      resolve();
      return;
    }

    const image = new Image();
    image.decoding = priority === "high" ? "sync" : "async";
    image.setAttribute("fetchpriority", priority);
    image.src = src;

    if (image.complete) {
      resolve();
      return;
    }

    image.onload = () => resolve();
    image.onerror = () => resolve();
  });

const Products = () => {
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [showHeroText, setShowHeroText] = useState(false);
  const { addToCart } = useCart();
  const { toggleLike, isProductLiked } = useLikedProducts();
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const productsGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fallbackProducts = products
      .filter((product) => product.id !== 2 && product.id !== "2")
      .slice(0, 6);

    preloadImages(fallbackProducts.slice(0, 2).map((product) => product.image), { priority: "high" });
    preloadImages(fallbackProducts.slice(2).map((product) => product.image));

    let isActive = true;
    const revealProductsWhenReady = async (productList: any[]) => {
      const visibleProducts = productList.slice(0, 6);

      await Promise.all(
        visibleProducts.map((product, index) =>
          waitForImage(product.image, index < 2 ? "high" : "auto")
        )
      );

      if (isActive) {
        window.clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    const loadingTimeout = window.setTimeout(() => {
      if (isActive) {
        setIsLoading(false);
      }
    }, 1000);

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const criticalProducts = data
          .filter((product: any) => product.id !== 2 && product.id !== "2")
          .slice(0, 6);

        preloadImages(criticalProducts.slice(0, 2).map((product: any) => product.image), { priority: "high" });
        preloadImages(criticalProducts.slice(2).map((product: any) => product.image));
        if (isActive) {
          setApiProducts(data);
        }

        await revealProductsWhenReady(criticalProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    void revealProductsWhenReady(fallbackProducts);
    void fetchProducts();

    const timer = window.setTimeout(() => setShowHeroText(true), 50);
    return () => {
      isActive = false;
      window.clearTimeout(loadingTimeout);
      window.clearTimeout(timer);
    };
  }, []);

  const scrollToProducts = () => {
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredProducts = useMemo(() => {
    let result = apiProducts.length > 0 ? [...apiProducts] : [...products];
    result = result.filter(p => p.id !== 2 && p.id !== "2");
    const priceRange = priceRanges.find((p) => p.key === priceFilter);
    if (priceRange && priceFilter !== "all") {
      result = result.filter(
        (p) => p.price >= priceRange.min && p.price < priceRange.max
      );
    }
    const ratingOption = ratingOptions.find((r) => r.key === ratingFilter);
    if (ratingOption && ratingFilter !== "all") {
      result = result.filter((p) => p.rating >= ratingOption.min);
    }
    if (typeFilter !== "all") {
      result = result.filter((p) => p.category === typeFilter);
    } else {
      result = result.filter((p) => p.category === "threads" || p.category === "powder");
    }
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return result;
  }, [apiProducts, priceFilter, ratingFilter, typeFilter, sortBy]);

  useEffect(() => {
    if (isLoading || filteredProducts.length === 0) return;

    const aboveFoldProducts = filteredProducts.slice(0, 6);
    preloadImages(aboveFoldProducts.slice(0, 2).map((product) => product.image), { priority: "high" });
    preloadImages(aboveFoldProducts.slice(2).map((product) => product.image));
  }, [filteredProducts, isLoading]);

  useEffect(() => {
    if (isLoading || filteredProducts.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      preloadImages(filteredProducts.map((product) => product.image));
      return;
    }

    const productCards = productsGridRef.current?.querySelectorAll<HTMLElement>("[data-product-index]");
    if (!productCards || productCards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(entry.target.getAttribute("data-product-index"));
          if (Number.isNaN(index)) return;

          const upcomingProducts = filteredProducts.slice(index, index + 6);
          preloadImages(upcomingProducts.map((product) => product.image), {
            priority: index === 0 ? "high" : "auto",
          });
        });
      },
      {
        rootMargin: "900px 0px",
        threshold: 0.01,
      }
    );

    productCards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredProducts, isLoading]);

  const activeFiltersCount = [priceFilter, ratingFilter, typeFilter].filter(
    (f) => f !== "all"
  ).length;

  const clearFilters = () => {
    setPriceFilter("all");
    setRatingFilter("all");
    setTypeFilter("all");
  };

  return (
    <Layout>
      <section className="relative h-[100svh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-royal-purple-dark/30 backdrop-blur-[5px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-gold/10 opacity-60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showHeroText ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: showHeroText ? 1 : 0 }}
              transition={{ duration: 1, delay: 0 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"
            />
            <br />
            <br />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showHeroText ? 1 : 0, y: showHeroText ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0 }}
              className="font-sans font-medium text-gold text-sm tracking-[0.4em] uppercase mb-6"
            >
              The Royal Collection
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: showHeroText ? 1 : 0, y: showHeroText ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-cinzel text-[clamp(1.5rem,7vw,4rem)] font-medium text-ivory mb-8 leading-[1.2]"
            >
              Each product begins
              <br />
              <span className="text-gold">as a flower</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showHeroText ? 1 : 0, y: showHeroText ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="font-sans text-white text-sm md:text-lg tracking-[0.1em] mb-12"
            >
              Choose your chapter of luxury.
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: showHeroText ? 1 : 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"
            />
          </motion.div>
          <motion.button
            onClick={scrollToProducts}
            initial={{ opacity: 0 }}
            animate={{ opacity: showHeroText ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/60 hover:text-gold transition-colors cursor-pointer group"
          >
            <span className="text-xs tracking-[0.3em] uppercase">Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6 group-hover:text-gold transition-colors" />
            </motion.div>
          </motion.button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ivory/10 via-ivory/10 to-transparent" />
      </section>

      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.6 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans font-medium text-gold text-sm tracking-[0.35em] uppercase mb-4"
            >
              Our Collection
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.6 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-3xl md:text-5xl text-royal-purple mb-6"
            >
              Elite Saffron
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ amount: 0.6 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto origin-center"
            />
          </div>

          {/* ── FILTER BAR ── */}
          <div className="flex flex-wrap items-center gap-16 mb-10">

            {/* Mobile filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1.5 px-2 py-1 bg-royal-purple text-ivory text-[10px] uppercase tracking-wider font-bold rounded-full"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-0.5 w-4 h-4 bg-gold text-royal-purple-dark rounded-full text-[9px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Filter dropdowns */}
            <div
              className={`
                ${showFilters ? "flex" : "hidden"}
                md:flex
                flex-wrap
                items-center
                gap-60
                w-full
                md:w-auto
              `}
            >

              {/* Price Range */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground tracking-[0.07em] font-medium font-serif text-royal-purple-dark/80">Price Range</label>
                <div className="relative group w-full max-w-[180px]">
                  <div className="px-3 py-2 w-full min-w-[110px] bg-ivory-dark border border-border text-sm product-desc text-royal-purple flex justify-between items-center cursor-pointer group-hover:border-gold transition">
                    {priceRanges.find(p => p.key === priceFilter)?.label || "All Prices"}
                    <span className="text-gold ml-2"><ChevronDown className="w-4 h-4" /></span>
                  </div>
                  <div className="absolute left-0 mt-2 w-full min-w-[130px] bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {priceRanges.map((range) => (
                      <div
                        key={range.key}
                        onClick={() => setPriceFilter(range.key)}
                        className="px-3 py-2 text-xs product-desc text-royal-purple hover:bg-royal-purple hover:text-ivory cursor-pointer transition"
                      >
                        {range.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-royal-purple-dark/80 tracking-[0.07em] text-muted-foreground font-serif font-medium">Rating</label>
                <div className="relative group w-full max-w-[180px]">
                  <div className="px-3 py-2 w-full min-w-[110px] bg-ivory-dark border border-border text-sm product-desc text-royal-purple flex justify-between items-center cursor-pointer group-hover:border-gold transition">
                    {ratingOptions.find(r => r.key === ratingFilter)?.label || "All Ratings"}
                    <ChevronDown className="w-4 h-4 text-gold ml-2" />
                  </div>
                  <div className="absolute left-0 mt-2 w-full min-w-[130px] bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {ratingOptions.map((option) => (
                      <div
                        key={option.key}
                        onClick={() => setRatingFilter(option.key)}
                        className="px-3 py-2 text-xs product-desc text-royal-purple hover:bg-royal-purple hover:text-ivory cursor-pointer transition"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-royal-purple-dark/80 tracking-[0.07em] text-muted-foreground font-serif font-medium">Type</label>
                <div className="relative group w-full max-w-[180px]">
                  <div className="px-3 py-2 w-full min-w-[110px] bg-ivory-dark border border-border text-sm product-desc text-royal-purple flex justify-between items-center cursor-pointer group-hover:border-gold transition">
                    {saffronTypes.find(t => t.key === typeFilter)?.label || "All Types"}
                    <ChevronDown className="w-4 h-4 text-gold ml-2" />
                  </div>
                  <div className="absolute left-0 mt-2 w-full min-w-[130px] bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {saffronTypes.map((type) => (
                      <div
                        key={type.key}
                        onClick={() => setTypeFilter(type.key)}
                        className="px-3 py-2 text-xs product-desc text-royal-purple hover:bg-royal-purple hover:text-ivory cursor-pointer transition"
                      >
                        {type.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-serif text-royal-purple hover:text-gold transition-colors mt-5"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-royal-purple-dark/80 tracking-[0.07em] font-serif text-muted-foreground whitespace-nowrap">Sort by:</span>
              <div className="relative group w-full max-w-[180px]">
                <div className="px-3 py-2 w-full min-w-[140px] bg-ivory-dark border border-border text-sm product-desc text-royal-purple flex justify-between items-center cursor-pointer group-hover:border-gold transition">
                  {
                    {
                      "featured": "Featured",
                      "price-low": "Price: Low to High",
                      "price-high": "Price: High to Low",
                      "rating": "Highest Rated"
                    }[sortBy]
                  }
                  <ChevronDown className="w-4 h-4 text-gold ml-2" />
                </div>
                <div className="absolute right-0 mt-2 w-full min-w-[150px] bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {[
                    { key: "featured", label: "Featured" },
                    { key: "price-low", label: "Price: Low to High" },
                    { key: "price-high", label: "Price: High to Low" },
                    { key: "rating", label: "Highest Rated" },
                  ].map((option) => (
                    <div
                      key={option.key}
                      onClick={() => setSortBy(option.key)}
                      className="px-3 py-2 text-xs product-desc text-royal-purple hover:bg-royal-purple hover:text-ivory cursor-pointer transition"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <p className="text-sm text-royal-purple-dark/50 font-serif text-muted-foreground mb-6">
            {isLoading ? "Loading products..." : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
          </p>

          <div ref={productsGridRef} className="flex flex-wrap justify-center gap-12">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="w-full md:w-[calc(50%-2rem)] max-w-[550px] h-[500px] bg-gray-100 animate-pulse rounded-3xl" />
              ))
            ) : (
              filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  data-product-index={index}
                  className="group relative bg-card rounded-3xl shadow-card overflow-hidden transition-all duration-700 hover:shadow-elegant hover:-translate-y-2 w-full md:w-[calc(50%-2rem)] max-w-[550px]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {product.tag && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-4 py-1 bg-ivory text-royal-purple text-xs font-semibold tracking-wider uppercase rounded-full">
                        {product.tag}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <button
                      onClick={() => toggleLike(product.id)}
                      className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${isProductLiked(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-ivory/90 text-royal-purple hover:bg-gold hover:text-royal-purple-dark"
                        }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isProductLiked(product.id) ? "fill-current" : ""}`} />
                    </button>
                    <button
                      className="w-10 h-10 bg-ivory/90 backdrop-blur-sm rounded-full flex items-center justify-center text-royal-purple hover:bg-gold hover:text-royal-purple-dark transition-colors"
                      aria-label="Share product"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <div className="relative aspect-square flex items-center justify-center overflow-visible">
                      <img
                        src={resolveProductImage(product.image)}
                        alt={product.name}
                        fetchPriority={index < 2 ? "high" : "auto"}
                        loading={index < 6 ? "eager" : "lazy"}
                        decoding={index === 0 ? "sync" : "async"}
                        className="
                          max-h-[80%] object-contain
                          transition-all duration-700
                          group-hover:scale-105
                          drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]
                        "
                      />
                      <div className="absolute bottom-6 w-28 h-6 bg-black/40 blur-[25px] rounded-full opacity-60" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-royal-purple-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div
                      className="
                        absolute bottom-3 inset-x-0 flex justify-center
                        sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2
                      "
                    >
                      <Button
                        variant="white"
                        onClick={() => addToCart(product.id)}
                        className="
                          min-w-[170px] h-[38px] px-5 text-[11px] transition-none
                          [&>span]:transition-none
                          sm:min-w-[220px] sm:h-[42px] sm:px-10 sm:text-[12px] sm:transition-all
                          sm:[&>span]:transition-all
                        "
                      >
                        <span className="flex items-center gap-2 sm:gap-3">
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Add to Cart
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                              ? "fill-brand-gold text-brand-gold"
                              : "fill-muted text-muted"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                    <br />
                    <h3 className="font-cinzel text-royal-purple/80 uppercase font-bold text-[16px] tracking-[0.09em]">
                      {product.name}
                    </h3>
                    <p className="product-desc font-medium text-[14px] text-royal-purple-dark/50 tracking-[0.05em]">
                      {product.description}
                    </p>
                    <br />
                    <div className="flex items-center gap-2">
                      <span className="font-Outfit text-l font-bold text-brand-gold">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-md font-bold text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
