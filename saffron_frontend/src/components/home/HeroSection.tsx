import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/hero-video.mp4";


const HeroSection = () => {
  return (
    <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden">

       {/* Background Video */}
<div className="absolute inset-0">

  {/* Gradient Background (shows before video loads) */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-[#1a1a1a] to-black"></div>

  {/* Video */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src={heroVideo} type="video/mp4" />
  </video>

</div>

      {/* Content */}
      <div className="relative z-10 w-full md:container mx-auto px-4 md:px-6 lg:px-0 text-center">
        <div className="max-w-4xl mx-auto">

          {/* Subtitle */}
          <motion.p
            className="font-sans text-[#C6A85A] text-xs sm:text-sm tracking-[0.35em] uppercase -mt-2 mb-10 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22,1,0.36,1] }}
          >
            Premium Kashmiri Saffron
          </motion.p>

          {/* Brand Name */}
          <motion.h1
            className="font-cinzel text-[clamp(1.75rem,8vw,3.5rem)] md:text-6xl lg:text-7xl font-light text-white tracking-[0.12em] leading-[1.2]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.23,1,0.32,1] }}
          >
            Z PRINCESS SAFFRON
          </motion.h1>

          {/* Supporting Line */}
          <motion.p
            className="font-sans text-[#C6A85A] text-[10px] sm:text-xs tracking-[0.35em] uppercase mt-10 md:mt-12 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
          >
            Now Yours
          </motion.p>

          {/* CTA Button (Updated Only This Section) */}
          <motion.div
            className="flex justify-center mt-10 md:mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
          >
            <Link to="/products">
  <Button>
    Explore Collection
  </Button>
</Link>

          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <span className="font-sans text-[#C6A85A] text-[11px] tracking-[0.35em] uppercase">
          Unveil the Essence
        </span>

        <ChevronDown className="w-6 h-6 text-[#C6A85A]/80 animate-bounce" />
      </motion.div>

      {/* Corner Decoration */}
      <div className="absolute top-0 left-0 w-28 h-28 border-l border-t border-[#C6A85A]/20" />
      <div className="absolute bottom-0 right-0 w-28 h-28 border-r border-b border-[#C6A85A]/20" />
    </section>
  );
};

export default HeroSection;
