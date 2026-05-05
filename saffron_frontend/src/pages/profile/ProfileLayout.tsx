import { Link, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  MapPin,
  Package,
  ChevronRight,
  ArrowLeft,
  X
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  hideHeaderMobile?: boolean;
}

const sidebarItems = [
  { title: "Dashboard", href: "/profile", icon: LayoutDashboard },
  { title: "Edit Profile", href: "/profile/edit", icon: User },
  { title: "Shipping Address", href: "/profile/address", icon: MapPin },
  { title: "Orders", href: "/profile/orders", icon: Package },
];

const ProfileLayout = ({ children, title, description, className, hideHeaderMobile }: ProfileLayoutProps) => {
  const { user, signOut, isLoading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <Layout>
      <div className="bg-ivory min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-royal-purple transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-royal-purple font-medium">My Account</span>
          </nav>

          {/* Back to Dashboard Link */}
          {location.pathname !== "/profile" && (
            <Link
              to="/profile"
              className="inline-flex items-center text-[10px] tracking-[0.25em] font-bold uppercase text-royal-purple/50 hover:text-royal-purple transition-all duration-300 mb-4 group"
            >
              <ArrowLeft className="h-3 w-3 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Dashboard
            </Link>
          )}

          {/* Header row with menu button */}
          <div className="flex items-center justify-between mb-6">

            <div className={cn("max-w-xl", hideHeaderMobile && "hidden md:block")}>
              {title && (
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-royal-purple uppercase tracking-tight md:tracking-normal leading-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mt-2 font-rr leading-relaxed max-w-lg">
                  {description}
                </p>
              )}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="group w-5 h-8 flex flex-col justify-center gap-2 ml-auto"
            >
              <motion.span
                className="h-[1.5px] w-full bg-royal-purple"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
              <motion.span
                className="h-[1.5px] w-full bg-royal-purple"
                whileHover={{ y: 0 }}
              />
              <motion.span
                className="h-[1.5px] w-full bg-royal-purple"
                whileHover={{ y: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
            </button>


          </div>

          {/* CONTENT */}
          <div className="relative">
            <main className={cn("bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-6 sm:p-8 animate-fade-in-up", className)}>
              {children}
            </main>
          </div>

        </div>
      </div>

      {/* =============================
         LUXURY SIDEBAR DRAWER
      ============================== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* SIDEBAR PANEL */}
            <motion.aside
              initial={{ x: -420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -420, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="
    fixed left-0 top-0 h-full w-[280px] sm:w-[400px] lg:w-[500px]
    z-50
    px-6 sm:px-10 pt-20 pb-10
    flex flex-col
    text-ivory
    overflow-hidden
    items-end
    text-right

    bg-gradient-to-b
    from-[#12051f]
    via-[#160724]
    to-[#0b0215]

    shadow-[0_0_90px_rgba(0,0,0,0.75)]
  "
            >

              {/* ✨ Moving light gradient */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  opacity: [0.05, 0.08, 0.05],
                  x: [-40, 40, -40],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "radial-gradient(circle at 20% 30%, rgba(198,168,90,0.08), transparent 60%)",
                }}
              />

              {/* Gold edge glow */}
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

              {/* ================= HEADER ================= */}
              <div className="w-full flex items-center justify-between mb-8 sm:mb-16 relative z-10">

                {/* CLOSE BUTTON — LEFT */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-ivory/70 hover:text-ivory transition duration-500"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* TITLE — RIGHT */}
                <motion.h2
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-xl tracking-[0.25em] text-ivory"
                >
                  My Account
                </motion.h2>
              </div>

              {/* ================= MENU ================= */}
              <div className="space-y-4 sm:space-y-8 relative z-10">

                {sidebarItems.map((item, index) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -160 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.15 + index * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className="group flex items-center gap-4 relative"
                      >

                        {/* GOLD LINE */}
                        <motion.span
                          layout
                          className={cn(
                            "w-[1px] h-6 transition-all duration-500",
                            isActive
                              ? "bg-gold"
                              : "bg-white/30 group-hover:bg-gold"
                          )}
                        />

                        {/* TEXT */}
                        <span
                          className={cn(
                            "text-[13px] tracking-[0.30em] uppercase font-sans transition-all duration-500",
                            isActive
                              ? "text-gold"
                              : "text-ivory/70 group-hover:text-gold"
                          )}
                        >
                          {item.title}
                        </span>

                        {/* ✨ GOLD HOVER SLIDE */}
                        <motion.div
                          className="absolute left-0 bottom-[-6px] h-px bg-gradient-to-r from-gold/0 via-gold to-gold/0"
                          initial={{ width: 0, opacity: 0 }}
                          whileHover={{ width: "100%", opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        />
                      </Link>
                    </motion.div>
                  );
                })}

                {/* SIGN OUT */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => signOut()}
                  className="
        group flex items-center gap-4 mt-8
        text-[13px] tracking-[0.30em] uppercase font-sans
        text-red-400/80 transition-all duration-500
      "
                >
                  <span className="w-[1px] h-6 bg-red-400/50 group-hover:bg-red-400" />
                  <span className="group-hover:text-red-300">Sign Out</span>
                </motion.button>

              </div>

              {/* ================= FOOTER SHIMMER ================= */}
              <motion.div
                className="mt-auto pt-12 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                  animate={{
                    backgroundPosition: ["0% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% 100%" }}
                />
              </motion.div>

            </motion.aside>

          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ProfileLayout;
