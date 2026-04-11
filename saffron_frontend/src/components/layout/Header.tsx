import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
        ${isScrolled
          ? `
              backdrop-blur-2xl
              bg-[rgba(40,18,60,0.72)]
              shadow-[0_15px_50px_-15px_rgba(0,0,0,0.6)]
              py-3
            `
          : `
              bg-transparent
              py-5
            `
        }
      `}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/">
            <motion.img
              whileHover={{ scale: 1.05, y: -1 }}
              src={logo}
              alt="Z Princess Saffron"
              className="h-12 w-auto"
            />
          </Link>

          {/* NAV */}
          <nav className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative font-sans text-sm tracking-[0.25em] uppercase
                    text-white transition-all duration-300 group
                    ${isActive ? "text-[#C6A85A]" : ""}
                  `}
                >
                  {link.name}

                  {/* GLASS HOVER */}
                  <span className="
                      absolute inset-0 rounded-md opacity-0
                      group-hover:opacity-100 transition duration-500
                      bg-gradient-to-b from-white/10 to-transparent blur-[2px]
                  "/>

                  {/* GOLD LINE */}
                  <span className={`
                      absolute left-0 -bottom-1 h-[1px] bg-[#C6A85A]
                      transition-all duration-500
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `} />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">

            {/* WISHLIST */}
            <Link
              to={user ? "/wishlist" : "/auth"}
              className="text-white hover:text-[#C6A85A] transition relative"
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
              className="text-white hover:text-[#C6A85A] transition relative"
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
              <button className="text-white hover:text-[#C6A85A] transition">
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25 }}
                    className="
                      absolute right-0 mt-5 w-64
                      bg-white/95 backdrop-blur-xl
                      rounded-2xl shadow-2xl
                      border border-white/40
                      overflow-hidden
                    "
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
                        {/* ===== GUEST MENU ===== */}
                        <div className="px-1 py-2 border-b border-gray-100">
                          <p className="text-l tracking-widest text-black-400 font-medium px-2">
                            WELCOME
                          </p>
                        </div>

                        <div className="p-3 flex flex-col gap-2">

                          <Link
                            to="/auth"
                            className="
                              flex items-center justify-center gap-2
                               py-2 rounded-xl px-4
                              bg-[#2E0F3A] text-white text-sm font-semibold
                              hover:bg-[#3A164B] transition
                            "
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
                            className="
                              flex items-center justify-center gap-2
                              w-full py-2 rounded-xl px-4
                              border border-[#C6A85A]/40
                              text-[#2E0F3A] text-sm font-semibold
                              hover:bg-[#C6A85A]/10 transition
                            "
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

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>
      </div>

      {/* MENU ITEM STYLE */}
      <style>{`
        .menu-item{
          display:flex;
          align-items:center;
          gap:10px;
          padding:12px 24px;
          font-size:14px;
          color:#374151;
          transition:0.25s;
        }
        .menu-item:hover {
  color: #C6A85A;
  text-shadow:
    0 0 3px rgba(198,168,90,0.9),
    0 0 10px rgba(198,168,90,0.6);
}
        .icon{
          width:16px;
          height:16px;
        }
      `}</style>

      {/* MOBILE MENU PANEL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-[rgba(30,10,50,0.97)] backdrop-blur-2xl border-t border-white/10"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      font-sans text-sm tracking-[0.25em] uppercase py-3 px-4 rounded-xl
                      transition-all duration-300
                      ${isActive
                        ? "text-[#C6A85A] bg-white/10"
                        : "text-white hover:text-[#C6A85A] hover:bg-white/10"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="h-px bg-white/10 my-3" />

              {user ? (
                <>
                  <Link
                    to="/profile/edit"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/70 text-sm py-3 px-4 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center gap-3"
                  >
                    <Pencil className="w-4 h-4" /> Edit Profile
                  </Link>
                  <Link
                    to="/profile/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/70 text-sm py-3 px-4 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center gap-3"
                  >
                    <Package className="w-4 h-4" /> My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gold text-sm py-3 px-4 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                    className="text-red-400 text-sm py-3 px-4 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#C6A85A] text-[#2E0F3A] text-sm font-semibold hover:bg-[#d4b86a] transition-all"
                >
                  <User className="w-4 h-4" /> Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
