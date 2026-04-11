import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroVideo from "@/assets/hero-video.mp4";
{/*import crocusLogo from "@/assets/userlogo.png";*/ }
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

const Auth = () => {
  const { toast } = useToast();
  const {
    user,
    signUp,
    signIn,
    signInWithGoogle,
    isLoading: authLoading,
  } = useAuth();

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};

    try {
      emailSchema.parse(formData.email);
    } catch { }

    try {
      passwordSchema.parse(formData.password);
    } catch { }

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        // Admin redirect
        const adminEmails = ["princesssaffron519@gmail.com", "Princesraja555777@gmail.com"];
        if (adminEmails.includes(formData.email)) {
          navigate("/admin");
        }
      }
    } else {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.name
      );

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "You are now signed in.",
        });
      }
    }

    setIsLoading(false);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      const { error } = await signInWithGoogle(tokenResponse.access_token);
      if (error) {
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome!",
          description: "Successfully signed in with Google.",
        });
      }
      setIsGoogleLoading(false);
    },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">

      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium tracking-wide uppercase text-sm hidden sm:inline-block">
          Back to Home
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-lg px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-transparent backdrop-blur-[2px] rounded-2xl p-8 float-animation"
          >

            {/* Crocus Flower Logo  <div className="mb-8 flex items-center justify-center"> <img src={crocusLogo} alt="Crocus Sativus" className="w-20 h-20 object-contain" /> </div> */}


            {/* Crocus Flower Logo */}
            <div className="mb-8 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center bg-white/10">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl text-white tracking-[0.14em] uppercase font-light text-center mb-10">
              {isLogin ? "Customer Login" : "Customer Register"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-0 top-3 w-4 h-4 text-white" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-white pl-8 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                    placeholder="Enter Name"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-0 top-3 w-4 h-4 text-white" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white pl-8 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter Email"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-0 top-3 w-4 h-4 text-white" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white pl-8 pr-10 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-white/70"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="font-rr text-xs text-white/70 hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="section"
                  type="submit"
                  disabled={isLoading || authLoading}
                  className="w-full mt-8 py-3 bg-white text-black uppercase tracking-widest"
                >
                  {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
                </Button>
              </motion.div>
            </form>

            {/* Divider + Google */}
            {isLogin && (
              <div className="mt-10 space-y-6">
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-white/50"></div>
                  <span className="mx-4 text-xs uppercase tracking-[0.3em] text-white/50">
                    Or Continue With
                  </span>
                  <div className="flex-grow border-t border-white/50"></div>
                </div>

                <Button
                  type="button"
                  variant="google"
                  onClick={() => loginWithGoogle()}
                  disabled={isGoogleLoading}
                  className="w-full"
                />
              </div>
            )}

            {/* Toggle */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:text-[#C6A85A] text-sm tracking-wide transition-all duration-300 hover:[text-shadow:0_0_6px_rgba(212,175,55,0.6)]"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;