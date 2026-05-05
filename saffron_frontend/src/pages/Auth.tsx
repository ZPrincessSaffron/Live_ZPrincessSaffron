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
  KeyRound,
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
  console.log("Auth component rendering - Fix Applied");
  const { toast } = useToast();
  const {
    user,
    signUp,
    signIn,
    verifyOtp,
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

  // OTP States
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpUserId, setOtpUserId] = useState("");
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    setShowOtpInput(false);
  }, [isLogin]);

  useEffect(() => {
    // Generate/Get deviceId
    let id = localStorage.getItem("saffron_device_id");
    if (!id) {
      id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("saffron_device_id", id);
    }
    setDeviceId(id);
  }, []);

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

    if (showOtpInput) {
      return handleOtpSubmit(e);
    }

    if (!validateForm()) return;

    setIsLoading(true);
    let error = null;
    let data: any = null;

    if (isLogin) {
      const result = await signIn(formData.email, formData.password, deviceId);
      error = result.error;
      data = result.data;

      if (error) {
        toast({
          title: "Sign in failed",
          description: String(error),
          variant: "destructive",
        });
      } else if (data?.otpRequired) {
        setOtpUserId(data.userId);
        setShowOtpInput(true);
        toast({
          title: "Verification required",
          description: "A 6-digit OTP has been sent to your email.",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        // Admin redirect
        if (data?.isAdmin) {
          navigate("/admin");
        }
      }
    } else {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.name,
        deviceId
      );
      error = result.error;
      data = result.data;

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.otpRequired) {
        setOtpUserId(data.userId);
        setShowOtpInput(true);
        toast({
          title: "Verification required",
          description: "A 6-digit OTP has been sent to your email to complete registration.",
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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter a 6-digit code.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const { error, data } = await verifyOtp(otpUserId, otp, deviceId);

    if (error) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Device verified and logged in successfully.",
      });

      if (data?.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
    setIsLoading(false);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      const { error, data } = await signInWithGoogle(tokenResponse.access_token, deviceId);
      if (error) {
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.otpRequired) {
        setOtpUserId(data.userId);
        setShowOtpInput(true);
        toast({
          title: "Verification required",
          description: "A 6-digit OTP has been sent to your email.",
        });
      } else {
        toast({
          title: "Welcome!",
          description: "Successfully signed in with Google.",
        });

        if (data?.isAdmin) {
          navigate("/admin");
        }
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
            className={`bg-transparent backdrop-blur-[2px] rounded-2xl p-8 ${isLogin ? "" : "float-animation"}`}
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
                  className="w-full bg-transparent border-b border-white pl-8 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-white"
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
                  className="w-full bg-transparent border-b border-white pl-8 pr-10 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-white"
                  placeholder="Enter Password"
                  disabled={showOtpInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-white/70"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {showOtpInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="relative"
                >
                  <KeyRound className="absolute left-0 top-3 w-4 h-4 text-[#C6A85A]" />
                  <input
                    type="text"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent border-b border-[#C6A85A] pl-8 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-[#C6A85A] text-[#C6A85A] tracking-[0.5em] font-bold"
                    placeholder="Enter 6-Digit OTP"
                    autoFocus
                  />
                </motion.div>
              )}

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
                  {isLoading ? "Processing..." : showOtpInput ? "Verify OTP" : isLogin ? "Login" : "Register"}
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
