import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/hero-video.mp4";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const { error } = await forgotPassword(email);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email sent!",
        description: "If an account exists, you will receive a reset link.",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      <Link to="/auth" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium tracking-wide uppercase text-sm hidden sm:inline-block">Back to Login</span>
      </Link>

      <div className="relative z-10 w-full max-w-lg px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-transparent backdrop-blur-[2px] rounded-2xl p-8 float-animation">
          <div className="mb-8 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center bg-white/10">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="font-sans text-2xl text-white tracking-[0.14em] uppercase font-light text-center mb-6">Forgot Password</h1>
          <p className="text-white/70 text-center mb-8 text-sm">Enter your email and we'll send you a link to reset your password.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-0 top-3 w-4 h-4 text-white" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white pl-8 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                placeholder="Enter Email"
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="section" type="submit" disabled={isLoading} className="w-full mt-4 py-3 bg-white text-black uppercase tracking-widest">
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
