import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import jallikattuImg from "@/assets/jallikattu.jpeg";
import ankletImg from "@/assets/girlfeet.jpeg";

const FounderCulture: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section className="relative py-16 md:py-32 lg:py-24 bg-ivory overflow-hidden min-h-[85vh] lg:min-h-[500px] flex items-center">

      {/* ================= BACKGROUND IMAGES ================= */}

      {/* LEFT PANEL — anklet */}
      <div className="absolute top-[10%] left-0 w-full h-[40%] md:w-1/2 h-1/2 md:h-full lg:h-[85%] lg:top-[5%] overflow-hidden z-0">
        <motion.img
          src={ankletImg}
          alt=""
          style={{ y: y1 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.23 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-full h-full object-cover md:object-cover object-bottom opacity-40 md:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory/20 via-transparent to-ivory" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/60 via-transparent to-ivory/60" />
      </div>

      {/* RIGHT PANEL — jallikattu */}
      <div className="absolute bottom-0 bottom-[1%] md:top-0 lg:top-[10%] right-0 w-full md:w-1/2 h-1/3 md:h-full lg:h-[85%] overflow-hidden z-0">
        <motion.img
          src={jallikattuImg}
          alt=""
          style={{ y: y2 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.19 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
          className="absolute top-0 left-0 w-full h-full object-cover md:object-cover object-top opacity-30 md:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-ivory/20 via-transparent to-ivory" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/60 via-transparent to-ivory/60" />
      </div>

      {/* Gold shimmer */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-transparent via-gold/5 to-transparent" />

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto px-4 md:px-6 lg:px-0 relative z-10 flex flex-col justify-center items-center h-full w-full">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.2 }}
          className="w-20 h-[1px] mx-auto mt-5 bg-gradient-to-r from-transparent via-gold to-transparent"
        /><br />
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-cinzel text-2xl md:text-3xl tracking-[0.06em] text-royal-purple/70 font-medium leading-tight"
          >
            Rooted in <span className="text-brand-gold">Tradition</span> &{" "}
            <span className="text-brand-gold">Strength</span>
          </motion.h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2 }}
            className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          style={{ wordSpacing: "6px" }}
          className="text-center mt-5 text-sm md:text-base lg:text-xl font-[600] tracking-[0.1em] font-medium leading-relaxed px-4 sm:px-6 md:px-8 lg:px-0"
        >
          <span className="text-royal-purple/60">The founder is deeply connected to<br /> </span>
          <span className="text-royal-purple/60 ">cultural roots</span><br />
          <span className="text-royal-purple/60"> from </span>
          <span className="text-brand-gold ">timeless traditions</span>
          <span className="text-royal-purple/60"> to </span><br />
          <span className="text-brand-gold ">fearless spirit</span>
        </motion.p>

        <br /><br />

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.2 }}
          className="w-20 h-[1px] mx-auto mt-5 bg-gradient-to-r from-transparent via-gold to-transparent"
        />

      </div>
    </section>
  );
};

export default FounderCulture;