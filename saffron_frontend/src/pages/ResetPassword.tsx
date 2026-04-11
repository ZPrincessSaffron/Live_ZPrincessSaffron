import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/hero-video.mp4";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (!token) return;

    setIsLoading(true);
    const { error } = await resetPassword(token, password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your password has been reset. Please login with your new password.",
      });
      navigate("/auth");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-transparent backdrop-blur-[2px] rounded-2xl p-8 float-animation">
          <div className="mb-8 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center bg-white/10">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="font-sans text-2xl text-white tracking-[0.14em] uppercase font-light text-center mb-6">Reset Password</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-0 top-3 w-4 h-4 text-white" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white pl-8 pr-10 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                placeholder="New Password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-3 text-white/70">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-0 top-3 w-4 h-4 text-white" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white pl-8 py-2 auth-input-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                placeholder="Confirm Password"
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="section" type="submit" disabled={isLoading} className="w-full mt-4 py-3 bg-white text-black uppercase tracking-widest">
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
