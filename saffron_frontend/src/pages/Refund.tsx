import Layout from "@/components/layout/Layout";
import {
  RotateCcw,
  Package,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import {
  motion,
  cubicBezier,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  
} from "framer-motion";
import { useRef, useState } from "react";

/* ─────────────────────────────────────────────
   EASING  (same as Privacy / Shipping / Terms)
───────────────────────────────────────────── */
const ease   = cubicBezier(0.22, 1, 0.36, 1);
const snappy = cubicBezier(0.34, 1.56, 0.64, 1);

/* ─────────────────────────────────────────────
   VARIANTS
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR  (from Privacy)
───────────────────────────────────────────── */
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });
  return (
    <>
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gold z-50"
      />
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gold/30 blur-sm z-50"
      />
    </>
  );
};

/* ─────────────────────────────────────────────
   FLOATING PARTICLES  (from Privacy)
───────────────────────────────────────────── */
interface ParticleProps {
  delay: number;
  x: number;
  size: number;
}

const Particle = ({ delay, x, size }: ParticleProps) => (
  <motion.div
    aria-hidden
    className="absolute rounded-full bg-gold pointer-events-none"
    style={{ left: `${x}%`, bottom: "-10px", width: size, height: size }}
    animate={{ y: [0, -320], opacity: [0, 0.5, 0], scale: [0.5, 1, 0.3] }}
    transition={{
      duration: 4 + Math.random() * 3,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 18 }).map((_, i) => (
      <Particle
        key={i}
        delay={i * 0.4}
        x={5 + Math.random() * 90}
        size={2 + Math.random() * 4}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   MAGNETIC LINK  (from Privacy)
───────────────────────────────────────────── */
interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
}

const MagneticLink = ({ href, children }: MagneticLinkProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top  - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-2 font-rr text-royal-purple font-medium group"
    >
      <span className="border-b border-gold pb-0.5 group-hover:text-gold transition-colors duration-200">
        {children}
      </span>
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight className="w-4 h-4 text-gold" />
      </motion.span>
    </motion.a>
  );
};

/* ─────────────────────────────────────────────
   CURSOR GLOW CARD  (from Privacy)
───────────────────────────────────────────── */
interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlowCard = ({ children, className = "" }: GlowCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setGlowPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{ isolation: "isolate" }}
    >
      <motion.div
        aria-hidden
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(180px circle at ${glowPos.x}px ${glowPos.y}px, rgba(88,28,135,0.08), transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PARALLAX HERO  (from Privacy / Shipping / Terms)
───────────────────────────────────────────── */
const ParallaxHero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section
      ref={ref}
      className="relative w-full bg-royal-purple-dark text-ivory overflow-hidden pt-24 md:pt-32 pb-12 md:pb-16 min-h-[250px] md:min-h-[320px] flex flex-col items-center text-center"
    >
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.13, 0.07] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gold blur-3xl"
      />

      <FloatingParticles />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative w-full container mx-auto px-4 md:px-6 lg:px-0"
      >
        <div className="max-w-2xl mx-auto text-center">

          {/* icon — pulse ring, same as Privacy/Shipping/Terms */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.15, duration: 0.75, ease: snappy }}
            className="mb-5 relative inline-block"
          >
            <motion.div
              aria-hidden
              animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl border border-gold/40"
            />
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20">
              <RotateCcw className="w-7 h-7 text-gold" />
            </div>
          </motion.div>

          {/* font-cinzel — exact Privacy h1 spec */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease }}
            className="font-cinzel text-2xl md:text-5xl tracking-[0.05em] md:tracking-[0.09em] text-ivory leading-tight mb-4 text-center break-words w-full px-4"
          >
            Refund Policy
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="w-16 h-px bg-gold/50 mx-auto my-4 origin-center"
          />

          {/* font-rr text-xs tracking-widest uppercase — exact Privacy subtitle spec */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="product-desc text-ivory/80 text-[14px] tracking-widest uppercase"
          >
            Your satisfaction is our priority
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   POLICY CARD  (Eligible / Not Eligible)
   — header bar mirrors Privacy's PolicySection
───────────────────────────────────────────── */
interface PolicyCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  index: number;
}

const PolicyCard = ({ title, icon, items, index }: PolicyCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const xInit = index % 2 === 0 ? -40 : 40;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xInit, scale: 0.97 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, ease, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.10)" }}
      className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden shadow-sm transition-shadow duration-500"
    >
      <GlowCard>
        {/* purple header bar — font-cinzel text-[13px] tracking-[0.08em], exact Privacy spec */}
        <div className="flex items-center gap-3 px-6 py-3 bg-royal-purple">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-6 h-6 rounded-md  flex items-center justify-center flex-shrink-0"
          >
            <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
          </motion.div>
          <h2 className="product-title text-[14px] font-[400] tracking-[0.09em] text-ivory uppercase leading-none">
            {title}
          </h2>
        </div>

        {/* body — staggered list, same as Privacy PolicySection body */}
        <motion.ol
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="px-6 py-4 space-y-2.5"
        >
          {items.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              onHoverStart={() => setHoveredItem(i)}
              onHoverEnd={() => setHoveredItem(null)}
              className="flex items-start gap-3 cursor-default"
            >
              {/* animated dot — same as Privacy / Shipping / Terms */}
              <motion.span
                animate={{
                  scale: hoveredItem === i ? 1.6 : 1,
                  boxShadow: hoveredItem === i
                    ? "0 0 6px 2px rgba(212,175,55,0.4)"
                    : "none",
                }}
                transition={{ duration: 0.2 }}
                className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0"
              />
              {/* font-rr text-[14.5px] — exact Privacy list item spec */}
              <motion.span
                animate={{
                  x: hoveredItem === i ? 3 : 0,
                  color: hoveredItem === i
                    ? "rgba(75,0,130,0.85)"
                    : "rgba(40,40,40,0.65)",
                }}
                transition={{ duration: 0.2 }}
                className="product-desc leading-relaxed text-royal-purple tracking-[0.09em] font-[400] text-[12px]"
              >
                {item}
              </motion.span>
            </motion.li>
          ))}
        </motion.ol>
      </GlowCard>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const Refund = () => {
  /* refs for each section's inView */
  const commitRef   = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepsRef    = useRef<HTMLDivElement>(null);
  const methodsRef  = useRef<HTMLDivElement>(null);
  const faqRef      = useRef<HTMLDivElement>(null);

  const commitInView   = useInView(commitRef,   { once: true, margin: "-50px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-50px" });
  const stepsInView    = useInView(stepsRef,    { once: true, margin: "-50px" });
  const methodsInView  = useInView(methodsRef,  { once: true, margin: "-50px" });
  const faqInView      = useInView(faqRef,      { once: true, margin: "-50px" });

  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [hoveredMethod, setHoveredMethod] = useState<number | null>(null);
  const [hoveredFaq, setHoveredFaq] = useState<number | null>(null);

  return (
    <Layout>
      <ScrollProgressBar />

      <div className="min-h-screen bg-ivory overflow-hidden">

        {/* HERO */}
        <ParallaxHero />

        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            <div className="max-w-5xl mx-auto space-y-16">

              {/* ── COMMITMENT ── */}
              <motion.div
                ref={commitRef}
                initial={{ opacity: 0, y: 32 }}
                animate={commitInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease }}
                whileHover={{ y: -3, boxShadow: "0 16px 48px rgba(0,0,0,0.07)" }}
                className="bg-gradient-to-r from-royal-purple/5 to-gold/5 rounded-3xl p-10 text-center relative overflow-hidden transition-shadow duration-500"
              >
                {/* shimmer lines */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                {/* font-cinzel text-2xl tracking-[0.05em] — exact Privacy section heading */}
                <h2 className="product-title text-2xl tracking-[0.09em] font-[400] text-royal-purple mb-4">
                  Our Commitment
                </h2>
                {/* font-rr text-[14.5px] — Privacy body spec */}
                <p className="product-desc text-[14px] text-royal-purple/80 tracking-[0.09em] font-[400] leading-relaxed max-w-3xl mx-auto">
                  We take immense pride in our premium saffron quality.
                  If you're not satisfied for any valid reason,
                  we are here to make it right.
                </p>
              </motion.div>

              {/* ── TIMELINE ── */}
              <motion.div
                ref={timelineRef}
                initial={{ opacity: 0, y: 32 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease }}
              >
                {/* font-cinzel text-2xl tracking-[0.05em] — Privacy section heading */}
                <h2 className="product-title text-2xl tracking-[0.09em] font-[400] text-royal-purple mb-10 text-center">
                  Refund Process Timeline
                </h2>

                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { day: "Day 1–2", title: "Request Received" },
                    { day: "Day 3–5", title: "Review" },
                    { day: "Day 6–7", title: "Processing" },
                    { day: "Day 8–14", title: "Credited" },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 24 }}
                      animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.09, duration: 0.55, ease }}
                      whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(0,0,0,0.10)" }}
                      onHoverStart={() => setHoveredStep(index)}
                      onHoverEnd={() => setHoveredStep(null)}
                      className="rounded-2xl border border-charcoal/10 bg-white p-6 text-center shadow-sm transition-shadow duration-500 relative overflow-hidden"
                    >
                      {/* top accent on hover */}
                      <motion.div
                        animate={{ scaleX: hoveredStep === index ? 1 : 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="absolute top-0 left-0 right-0 h-[2px] bg-gold origin-left"
                      />

                      {/* font-rr text-xs tracking-widest — exact Privacy eyebrow/label spec */}
                      <p className="product-title text-sm font-[400] tracking-[0.09em] uppercase text-gold mb-2">
                        {step.day}
                      </p>
                      {/* font-cinzel text-[13px] tracking-[0.08em] — Privacy card header spec */}
                      <h3 className="product-desc text-[14px] tracking-[0.09em] font-[400] text-royal-purple uppercase leading-none">
                        {step.title}
                      </h3>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── ELIGIBLE / NOT ELIGIBLE ── */}
              <div className="grid md:grid-cols-2 gap-10 ">
                <PolicyCard
                  title="Eligible for Refund"
                  icon={<CheckCircle className="w-4 h-4 text-green-500" />}
                  items={[
                    "Damaged product on delivery",
                    "Wrong item delivered",
                    "Quality issues",
                    "Missing items",
                  ]}
                  index={0}
                />
                <PolicyCard
                  title="Not Eligible"
                  icon={<XCircle className="w-4 h-4 text-red-400" />}
                  items={[
                    "Opened or used products",
                    "Requests after 7 days",
                    "Change of mind",
                    "Improper storage damage",
                  ]}
                  index={1}
                />
              </div>

              {/* ── HOW TO REQUEST A RETURN ── */}
              <motion.div
                ref={stepsRef}
                initial={{ opacity: 0, y: 32 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease }}
              >
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Package className="w-8 h-8 text-royal-purple" />
                  </motion.div>
                  {/* font-cinzel text-2xl tracking-[0.05em] */}
                  <h2 className="product-title text-2xl tracking-[0.09em] font-[400] text-royal-purple">
                    How to Request a Return
                  </h2>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                  {[
                    "Contact us within 24 hours with order details.",
                    "Provide clear photo/video proof.",
                    "Ship product securely after approval.",
                    "Refund processed after inspection.",
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -32 }}
                      animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.09, duration: 0.55, ease }}
                      onHoverStart={() => setHoveredStep(100 + index)}
                      onHoverEnd={() => setHoveredStep(null)}
                      className="flex gap-5 items-start cursor-default"
                    >
                      {/* step number bubble */}
                      <motion.div
                        animate={{
                          scale: hoveredStep === 100 + index ? 1.12 : 1,
                          boxShadow: hoveredStep === 100 + index
                            ? "0 0 0 4px rgba(212,175,55,0.25)"
                            : "0 0 0 0px rgba(212,175,55,0)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="w-8 h-8 bg-royal-purple text-ivory rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        {/* font-cinzel for step number — luxury numeral feel */}
                        <span className="product-title text-[12px] text-white tracking-wide">{index + 1}</span>
                      </motion.div>

                      {/* font-rr text-[14.5px] — Privacy list item spec */}
                      <motion.p
                        animate={{
                          x: hoveredStep === 100 + index ? 3 : 0,
                          color: hoveredStep === 100 + index
                            ? "rgba(75,0,130,0.85)"
                            : "rgba(40,40,40,0.65)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="product-desc text-[14px] font-[400] tracking-[0.09em] text-royal purple leading-relaxed pt-2"
                      >
                        {item}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── REFUND TIMELINES ── */}
              <motion.div
                ref={methodsRef}
                initial={{ opacity: 0, y: 32 }}
                animate={methodsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease }}
                className="bg-cream rounded-3xl p-10 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                {/* font-cinzel text-2xl tracking-[0.05em] */}
                <h2 className="product-title text-2xl tracking-[0.09em] font-[400] text-royal-purple mb-6">
                  Refund Timelines
                </h2>

                <div className="grid md:grid-cols-1 centre gap-4 max-w-sm mx-auto">
                  {[
                    "Credit/Debit Card — 3 to 5 business days",
                    "UPI — 3 to 5 business days",
                    "Net Banking — 5 to 7 business days",
                    "COD — 7 to 10 business days (Bank Transfer)",
                  ].map((method, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={methodsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: i * 0.08, duration: 0.5, ease }}
                      onHoverStart={() => setHoveredMethod(i)}
                      onHoverEnd={() => setHoveredMethod(null)}
                      className="flex items-center gap-3 cursor-default"
                    >
                      <motion.span
                        animate={{
                          scale: hoveredMethod === i ? 1.6 : 1,
                          boxShadow: hoveredMethod === i
                            ? "0 0 6px 2px rgba(212,175,55,0.4)"
                            : "none",
                        }}
                        transition={{ duration: 0.2 }}
                        className="w-1 h-1 rounded-full bg-gold flex-shrink-0"
                      />
                      {/* font-rr text-[14.5px] */}
                      <motion.span
                        animate={{
                          x: hoveredMethod === i ? 3 : 0,
                          color: hoveredMethod === i
                            ? "rgba(75,0,130,0.85)"
                            : "rgba(40,40,40,0.65)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="product-desc text-[14px] tracking-[0.09em] font-[400] text-royal-purple  leading-relaxed text-center"
                      >
                        {method}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── COMMON QUESTIONS ── */}
              <motion.div
                ref={faqRef}
                initial={{ opacity: 0, y: 32 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease }}
              >
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <HelpCircle className="w-8 h-8 text-royal-purple" />
                  </motion.div>
                  {/* font-cinzel text-2xl tracking-[0.05em] */}
                  <h2 className="product-title text-2xl tracking-[0.09em] font-[400] text-royal-purple">
                    Common Questions
                  </h2>
                </div>

                <div className="space-y-3 max-w-2xl mx-auto">
                  {[
                    "Yes, exchanges are available based on stock.",
                    "Return shipping covered if product error is ours.",
                    "Contact us if refund seems delayed.",
                  ].map((answer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.97 }}
                      animate={faqInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                      transition={{ delay: index * 0.09, duration: 0.6, ease }}
                      whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(0,0,0,0.09)" }}
                      onHoverStart={() => setHoveredFaq(index)}
                      onHoverEnd={() => setHoveredFaq(null)}
                      className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden shadow-sm transition-shadow duration-500"
                    >
                      <GlowCard>
                        <div className="flex items-start gap-3 px-6 py-4">
                          <motion.span
                            animate={{
                              scale: hoveredFaq === index ? 1.6 : 1,
                              boxShadow: hoveredFaq === index
                                ? "0 0 6px 2px rgba(212,175,55,0.4)"
                                : "none",
                            }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0"
                          />
                          {/* font-rr text-[14.5px] — Privacy list item spec */}
                          <motion.p
                            animate={{
                              x: hoveredFaq === index ? 3 : 0,
                              color: hoveredFaq === index
                                ? "rgba(75,0,130,0.85)"
                                : "rgba(40,40,40,0.65)",
                            }}
                            transition={{ duration: 0.2 }}
                            className="product-desc font-[400] text-[14px] text-royal-purple tracking-[0.09em] leading-relaxed"
                          >
                            {answer}
                          </motion.p>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── CONTACT  (mirrors Privacy / Shipping / Terms exactly) ── */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7 }}
                className="text-center py-12 border-t border-charcoal/10"
              >
                {/* font-cinzel text-2xl tracking-[0.05em] */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="product-title text-2xl tracking-[0.09em] font-[400] text-royal-purple mb-3"
                >
                  Need Help with a Refund?
                </motion.h2>

                {/* font-rr text-[14.5px] — Privacy body spec */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="product-desc text-[14px] text-royal-purple font-[400] tracking-[0.09em] mb-7"
                >
                  Our support team is ready to assist you.
                </motion.p>

                {/* MagneticLinks — same as Privacy / Shipping / Terms */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="flex flex-col sm:flex-row justify-center gap-6"
                >
                  <MagneticLink href="mailto:Crocus@zprincesssaffron.com">
                    Crocus@zprincesssaffron.com
                  </MagneticLink>
                  <MagneticLink href="tel:+91 75388 70577">
                    +91 75388 70577
                  </MagneticLink>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Refund;
