import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {  Award, Leaf, FlaskConical } from "lucide-react";

const badges = [
  
  { icon: Award, label: "FSSAI", desc: "Approved" },
  { icon: Leaf, label: "Organic", desc: "100% Pure" },
  { icon: FlaskConical, label: "Lab Tested", desc: "Quality" },
];

const features = [
  {
    title: "Hand-Picked at Dawn",
    description:
      "Our saffron is harvested during the early morning hours when the flowers are still closed, preserving maximum potency and aroma.",
  },
  {
    title: "Grade A+ Quality",
    description:
      "Only the finest crimson stigmas are selected, ensuring the highest crocin and safranal content for superior flavor and color.",
  },
  {
    title: "Direct from Kashmir",
    description:
      "Sourced directly from the pristine valleys of Pampore, Kashmir — the saffron capital of India with centuries of heritage.",
  },
  {
    title: "Rigorous Testing",
    description:
      "Every batch undergoes comprehensive laboratory testing for purity, potency, and authenticity before reaching you.",
  },
];

const WhyChooseUs = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-ivory overflow-hidden"
      style={{ perspective: "1400px" }}
    >
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%235C0011'%3E%3Ccircle cx='40' cy='40' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 md:px-6 lg:px-0 max-w-7xl">

        {/* ⭐ HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.22,1,0.36,1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="font-sans text-sm uppercase tracking-[0.35em] text-gold/70">
            The Z Princess Difference
          </span>

          <h2 className="font-serif text-4xl  tracking-[0.1em] md:text-5xl lg:text-5xl text-royal-purple mt-2 mb-4">
            Why Choose Our <br/>Saffron
          </h2>

          <div className="w-28 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
        </motion.div>

        {/* ⭐ BADGES */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 md:gap-14 mb-24"
        >
          {badges.map((badge, index) => (
  <motion.div
    key={badge.label}

    /* entrance */
    initial={{ opacity: 0, scale: 0.85 }}
    animate={isInView ? { opacity: 1, scale: 1 } : {}}
    
    /* ⭐ floating loop */
    whileInView={{
      y: [0, -10, 0],
      rotate: [0, 0.8, 0, -0.8, 0],
    }}
    viewport={{ once: false }}

    transition={{
      default: {
        duration: 0.6,
        delay: 0.35 + index * 0.15,
        ease: [0.22,1,0.36,1],
      },
      y: {
        duration: 4 + index,
        repeat: Infinity,
        ease: "easeInOut",
      },
      rotate: {
        duration: 6 + index,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }}

    /* pause on hover (luxury detail) */
    whileHover={{ y: 0, rotate: 0 }}

    className="group flex flex-col items-center"
  >
    {/* Luxury seal */}
    <div className="w-24 h-24 rounded-full bg-royal-purple-dark border border-gold/40 flex items-center justify-center shadow-elegant relative overflow-hidden">

      {/* glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gold blur-xl transition-opacity duration-500" />

      <badge.icon className="w-9 h-9 text-gold relative z-10" />
    </div>

    <span className="mt-4 font-serif text-sm text-royal-purple font-semibold tracking-wide">
      {badge.label}
    </span>

    <span className="font-sans text-xs text-muted-foreground">
      {badge.desc}
    </span>
  </motion.div>
))}

        </motion.div>

        {/* ⭐ FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 1,
                delay: 0.5 + index * 0.18,
                ease: [0.22,1,0.36,1],
              }}
              className="group relative bg-card p-10 md:p-12 rounded-sm shadow-card transition-all duration-500 hover:shadow-elegant hover:-translate-y-2"
            >
              {/* Animated gold line */}
              <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-gold to-gold/40 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

              {/* Interactive title */}
              <h3 className="relative inline-block product-title font-medium text-[20px] md:text-[20px]  tracking-[0.12em] text-royal-purple leading-[1.4] mb-4 transition-colors duration-500 group-hover:text-gold">
  {feature.title}
  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-gold transition-all duration-500 group-hover:w-full"></span>
</h3>

             <p className="product-desc font-medium text-[14px]  text-royal-purple/65 leading-[1.65] tracking-[0.04em]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;