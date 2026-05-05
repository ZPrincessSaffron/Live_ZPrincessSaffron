import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Flower2,
  Hand,
  Droplets,
  Package,
  Crown,
} from "lucide-react";

import cultivationImg from "@/assets/saffron-cultivation.jpg";
import pickingImg from "@/assets/saffron-picking.webp";
import extractionImg from "@/assets/saffron-extraction.jpeg";
import dryingImg from "@/assets/saffron-drying.jpg";
import packagingImg from "@/assets/saffron-packaging.jpg";

const steps = [
  {
    step: "01",
    title: "Cultivation",
    subtitle: "Birth of Gold",
    description:
      "Crocus sativus flowers are grown in the pristine valleys of Kashmir at optimal altitude and climate.",
    image: cultivationImg,
    icon: Flower2,
  },
  {
    step: "02",
    title: "Hand Picking",
    subtitle: "At First Light",
    description:
      "Each flower is delicately hand-picked at dawn before the petals fully open, preserving purity.",
    image: pickingImg,
    icon: Hand,
  },
  {
    step: "03",
    title: "Extraction",
    subtitle: "Three Sacred Threads",
    description:
      "Only three crimson stigmas are extracted from each flower — the very heart of saffron’s magic.",
    image: extractionImg,
    icon: Droplets,
  },
  {
    step: "04",
    title: "Drying & Grading",
    subtitle: "Perfected by Nature",
    description:
      "Stigmas are naturally dried and graded based on color, aroma, and crocin content.",
    image: dryingImg,
    icon: Package,
  },
  {
    step: "05",
    title: "Royal Packaging",
    subtitle: "Preserved Forever",
    description:
      "The finest threads are sealed in airtight royal packaging to retain freshness and potency.",
    image: packagingImg,
    icon: Crown,
  },
];

const bgGradients = [
  "from-royal-purple-dark via-royal-purple to-royal-purple-dark",
  "from-royal-purple via-royal-purple-dark to-royal-purple",
  "from-royal-purple-dark to-gold/20",
  "from-gold/10 via-ivory-dark to-ivory",
  "from-royal-purple-dark via-royal-purple to-royal-purple-dark",
];

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* cinematic micro motion */
  const imageParallax = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const textFloat = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={containerRef} className="relative">

      {/* Sticky Header */}
      <div className="sticky top-0 h-[100svh] flex items-center justify-center bg-gradient-hero z-10 isolate">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center px-4 md:px-6 lg:px-0 max-w-3xl"
        >
          <p className="font-sans text-sm tracking-[0.35em] uppercase text-gold mb-4">
            From Flower to Table
          </p>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-6">
            Golden Expedition
          </h2>

          <p className="font-sans text-lg text-ivory/70">
            A slow, sacred process shaped by land, hands, and centuries of tradition.
          </p>
        </motion.div>
      </div>

      {/* Steps */}
      {steps.map((step, index) => {
        const isEven = index % 2 === 0;

        return (
          <section
            key={step.step}
            className={`sticky top-0 h-[100svh] w-full flex items-center bg-gradient-to-b ${bgGradients[index]} overflow-hidden`}
            style={{ zIndex: 20 + index }}
          >
            {/* overlay */}
            <div className="absolute inset-0 bg-royal-purple-dark/60 pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-12">

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* TEXT */}
                <motion.div
                  style={{ y: textFloat }}
                  initial={{ opacity: 0, x: isEven ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-200px" }}
                  className={isEven ? "" : "lg:order-2"}
                >
                  {/* glowing step number */}
                  <motion.span
                    animate={{ opacity: [0.3, 0.45, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={`font-serif text-6xl lg:text-8xl leading-none ${index === 3 ? "text-gold-dark/30" : "text-gold/30"}`}
                  >
                    {step.step}
                  </motion.span>

                  <h3 className={`font-serif text-3xl lg:text-4xl mt-4 mb-2 ${index === 3 ? "text-royal-purple-dark" : "text-ivory"}`}>
                    {step.title}
                  </h3>

                  <p className={`font-sans text-sm font-medium tracking-[0.13em] uppercase mb-4 ${index === 3 ? "text-gold-dark" : "text-gold"}`}>
                    {step.subtitle}
                  </p>

                  <p className={`font-sans text-lg leading-relaxed max-w-xl ${index === 3 ? "text-royal-purple-dark/80" : "text-ivory/80"}`}>
                    {step.description}
                  </p>
                </motion.div>

                {/* IMAGE */}
                <motion.div
                  style={{ y: imageParallax, scale: imageScale }}
                  initial={{ opacity: 0, x: isEven ? 80 : -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 }}
                  viewport={{ once: true, margin: "-200px" }}
                  className={`relative ${isEven ? "" : "lg:order-1"}`}
                >
                  <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-luxury relative">

                    {/* subtle floating frame */}
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="w-full h-full"
                    >
                      <img
                        src={step.image}
                        alt={step.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* luxury light sweep */}
                    <motion.div
                      initial={{ x: "-120%" }}
                      whileInView={{ x: "120%" }}
                      transition={{ duration: 2.2, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                  </div>

                  <div className="absolute -inset-4 border border-gold/20 rounded-sm pointer-events-none" />
                </motion.div>

              </div>
            </div>
          </section>
        );
      })}
    </section >
  );
};

export default JourneySection;
