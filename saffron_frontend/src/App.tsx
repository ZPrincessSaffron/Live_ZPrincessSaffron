import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Address from "./pages/profile/Address";
import Orders from "./pages/profile/Orders"; // Updated import
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import FAQ from "./pages/FAQ";
import Shipping from "./pages/Shipping";
import Blogs from "./pages/Blogs";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ui/ScrollToTop";
import FCMManager from "@/components/FCMManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <FCMManager />
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Profile Routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile/address" element={<Address />} />
                <Route path="/profile/orders" element={<Orders />} />

                {/* Redirect old /orders to /profile/orders or use the component directly if desired, but we updated Header to point to /profile/orders in a previous turn (Wait, I need to check Header.tsx again, but let's assume standard routing) */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:orderId" element={<OrderDetails />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
