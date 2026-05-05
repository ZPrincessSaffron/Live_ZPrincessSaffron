import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  Pencil,
  LayoutDashboard
} from "lucide-react";

import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useLikedProducts } from "@/hooks/useLikedProducts";

const BRAND_GOLD = "#C6A85A";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About Us", path: "/about" },
  { name: "Blogs", path: "/blogs" },
  { name: "Contact Us", path: "/contact" },
];

/* ===== PREMIUM ANIMATION VARIANTS ===== */
const sidebarPanelVariants: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: "0%",
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
    },
  },
  exit: {
    x: "-100%",
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      when: "afterChildren",
    },
  },
};

const menuContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      staggerDirection: -1,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: 1,
      when: "afterChildren",
    },
  },
};

const menuItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
    y: 28,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -12,
    y: 12,
    filter: "blur(8px)",
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const { likedCount } = useLikedProducts();

  const isAdmin = user?.isAdmin;

  /* ===== FORCE HEADER ON CERTAIN PAGES ===== */
  useEffect(() => {
    const forceSolidPages = ["/cart", "/wishlist", "/checkout"];

    if (
      forceSolidPages.includes(location.pathname) ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/order") ||
      location.pathname.startsWith("/admin")
    ) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  /* ===== CLOSE PROFILE IF CLICKED OUTSIDE ===== */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          isScrolled
            ? "backdrop-blur-2xl bg-[rgba(40,18,60,0.72)] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.6)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between lg:gap-12">
            {/* MOBILE MENU TOGGLE (Left on mobile, hidden on lg) */}
            <div className="flex-1 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>

            {/* LOGO (Centered on mobile, Left-aligned on lg) */}
            <div className="flex flex-1 lg:flex-none justify-center lg:justify-start order-2 lg:order-first">
              <Link to="/products">
                <motion.img
                  whileHover={{ scale: 1.05, y: -1 }}
                  src={logo}
                  alt="Z Princess Saffron"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="h-10 lg:h-12 w-auto"
                />
              </Link>
            </div>

            {/* NAV (Hidden on mobile, Center-aligned on lg) */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center order-2">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;

                return (
                  <Fragment key={link.path}>
                    <Link
                      to={link.path}
                      className={`relative font-sans text-sm tracking-[0.25em] uppercase text-white transition-all duration-300 group ${
                        isActive ? "text-[#C6A85A]" : ""
                      }`}
                    >
                      {link.name}

                      {/* GLASS HOVER */}
                      <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-b from-white/10 to-transparent blur-[2px]" />

                      {/* GOLD LINE */}
                      <span
                        className={`absolute left-0 -bottom-1 h-[1px] bg-[#C6A85A] transition-all duration-500 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>

                    {index < navLinks.length - 1 && (
                      <div className="w-[1px] h-5 bg-[#C6A85A] opacity-100" />
                    )}
                  </Fragment>
                );
              })}
            </nav>

            {/* RIGHT SIDE (Wishlist, Cart, Profile) */}
            <div className="flex-1 lg:flex-none flex items-center justify-end gap-3 md:gap-5 order-3">
              {/* WISHLIST */}
              <Link
                to={user ? "/wishlist" : "/auth"}
                className="text-white hover:text-[#C6A85A] transition relative flex items-center"
              >
                <Heart className="w-5 h-5" />
                {user && likedCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: BRAND_GOLD, color: "#2E0F3A" }}
                  >
                    {likedCount}
                  </span>
                )}
              </Link>

              {/* CART */}
              <Link
                to={user ? "/cart" : "/auth"}
                className="text-white hover:text-[#C6A85A] transition relative flex items-center"
              >
                <ShoppingCart className="w-5 h-5" />
                {user && cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: BRAND_GOLD, color: "#2E0F3A" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* PROFILE */}
              <div
                ref={profileRef}
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
                className="relative"
              >
                <button
                  className="text-white hover:text-[#C6A85A] transition flex items-center"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 mt-5 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden"
                    >
                      {user ? (
                        <>
                          <div className="px-6 py-5 border-b border-gray-100 bg-royal-purple/5">
                            <p className="text-[10px] tracking-[0.2em] text-royal-purple/50 font-bold uppercase mb-1">
                              Welcome
                            </p>
                            <p className="text-sm font-serif font-light text-royal-purple truncate">
                              {user.fullName}
                            </p>
                          </div>

                          <div className="py-2">
                            <Link className="menu-item" to="/profile/edit">
                              <Pencil className="icon" /> Edit Profile
                            </Link>

                            <Link className="menu-item" to="/profile/address">
                              <MapPin className="icon" /> Address Book
                            </Link>

                            <Link className="menu-item" to="/profile/orders">
                              <Package className="icon" /> My Orders
                            </Link>

                            {isAdmin && (
                              <Link className="menu-item text-gold font-medium" to="/admin">
                                <LayoutDashboard className="icon" /> Admin Dashboard
                              </Link>
                            )}
                          </div>

                          <div className="border-t border-gray-100 py-2">
                            <button onClick={signOut} className="menu-item text-red-600">
                              <LogOut className="icon" /> Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-1 py-2 border-b border-gray-100">
                            <p className="text-l tracking-widest text-black-400 font-medium px-2">
                              WELCOME
                            </p>
                          </div>

                          <div className="p-3 flex flex-col gap-2">
                            <Link
                              to="/auth"
                              className="flex items-center justify-center gap-2 py-2 rounded-xl px-4 bg-[#2E0F3A] text-white text-sm font-semibold hover:bg-[#3A164B] transition"
                            >
                              <User className="w-4 h-4" />
                              Login
                            </Link>

                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-px bg-gray-200" />
                              <span className="text-xs text-gray-400">OR</span>
                              <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <Link
                              to="/auth?tab=signup"
                              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl px-4 border border-[#C6A85A]/40 text-[#2E0F3A] text-sm font-semibold hover:bg-[#C6A85A]/10 transition"
                            >
                              <User className="w-4 h-4" />
                              Register
                            </Link>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* MENU ITEM STYLE */}
        <style>{`
          .menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            font-size: 14px;
            color: #374151;
            transition: 0.25s;
          }
          .menu-item:hover {
            color: #C6A85A;
            text-shadow:
              0 0 3px rgba(198,168,90,0.9),
              0 0 10px rgba(198,168,90,0.6);
          }
          .icon {
            width: 16px;
            height: 16px;
          }
        `}</style>
      </header>

      {/* MOBILE MENU SIDE PANEL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />

            {/* SIDE PANEL */}
            <motion.div
              variants={sidebarPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 left-0 w-[85%] max-w-[340px] bg-[rgba(30,10,50,0.98)] backdrop-blur-2xl z-[110] lg:hidden border-r border-white/10 shadow-2xl flex flex-col"
            >
              {/* PANEL HEADER */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                  <img
                    src={logo}
                    alt="Z Princess Saffron"
                    loading="eager"
                    decoding="async"
                    className="h-8 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* PANEL CONTENT */}
              <motion.div
                variants={menuContainerVariants}
                className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-2 items-center"
              >
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      variants={menuItemVariants}
                      className="w-full flex justify-center"
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-center text-[11px] tracking-[0.2em] uppercase py-4 px-4 rounded-xl transition-all duration-300 w-full text-center ${
                          isActive
                            ? "text-[#C6A85A] bg-white/5"
                            : "text-white/80 hover:text-[#C6A85A] hover:bg-white/5"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div variants={menuItemVariants} className="h-px bg-white/10 my-6 w-full" />

                {user ? (
                  <div className="flex flex-col gap-2 w-full items-center">
                    {[
                      { to: "/profile/edit", icon: Pencil, label: "Edit Profile" },
                      { to: "/profile/address", icon: MapPin, label: "Address Book" },
                      { to: "/profile/orders", icon: Package, label: "My Orders" },
                    ].map((item) => (
                      <motion.div
                        key={item.to}
                        variants={menuItemVariants}
                        className="w-full flex justify-center"
                      >
                        <Link
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-white/60 text-[11px] py-4 px-4 rounded-xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-4 uppercase tracking-[0.15em] w-full text-center"
                        >
                          <item.icon className="w-4 h-4 text-[#C6A85A]" /> {item.label}
                        </Link>
                      </motion.div>
                    ))}

                    {isAdmin && (
                      <motion.div variants={menuItemVariants} className="w-full flex justify-center">
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[#C6A85A] text-[11px] py-4 px-4 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-4 font-medium uppercase tracking-[0.15em] w-full text-center"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      </motion.div>
                    )}

                    <motion.button
                      variants={menuItemVariants}
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-red-400 text-[11px] py-4 px-4 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.15em] w-full text-center"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </motion.button>
                  </div>
                ) : (
                  <motion.div variants={menuItemVariants} className="w-full">
                    <Link
                      to="/auth"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mt-4 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#C6A85A] text-[#2E0F3A] text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#d4b86a] transition-all"
                    >
                      <User className="w-5 h-5" /> Login / Register
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* PANEL FOOTER */}
              <div className="p-8 border-t border-white/10 bg-black/20">
                <p className="text-[10px] text-white/30 tracking-[0.3em] uppercase text-center font-medium">
                  © 2026 Z Princess Saffron
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
