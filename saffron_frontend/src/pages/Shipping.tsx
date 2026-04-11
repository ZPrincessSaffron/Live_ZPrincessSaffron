import Layout from "@/components/layout/Layout";
import {
  Truck,
  Clock,
  Package,
  
 
  ArrowRight,
} from "lucide-react";
import {
  motion,
  cubicBezier,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useState, ReactNode } from "react";

/* ─────────────────────────────────────────────
   EASING  (same as Privacy)
───────────────────────────────────────────── */
const ease   = cubicBezier(0.22, 1, 0.36, 1);
const snappy = cubicBezier(0.34, 1.56, 0.64, 1);

/* ─────────────────────────────────────────────
   VARIANTS  (same naming as Privacy)
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
   SCROLL PROGRESS BAR  (lifted from Privacy)
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
   FLOATING PARTICLES  (lifted from Privacy)
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
   MAGNETIC LINK  (lifted from Privacy)
───────────────────────────────────────────── */
interface MagneticLinkProps {
  href: string;
  children: ReactNode;
}

const MagneticLink = ({ href, children }: MagneticLinkProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.35);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
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
   CURSOR GLOW CARD  (lifted from Privacy)
───────────────────────────────────────────── */
interface GlowCardProps {
  children: ReactNode;
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
   PARALLAX HERO  (structure mirrors Privacy's ParallaxHero)
───────────────────────────────────────────── */
const ParallaxHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section
      ref={ref}
      className="relative w-full bg-royal-purple-dark text-ivory overflow-hidden pt-24 md:pt-32 pb-12 md:pb-16 min-h-[250px] md:min-h-[320px] flex flex-col items-center text-center"
    >
      {/* animated gradient orbs */}
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

          {/* Icon — breathing pulse ring, same as Privacy shield */}
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
              <Truck className="w-7 h-7 text-gold" />
            </div>
          </motion.div>

          {/* font-cinzel — exact same class used in Privacy h1 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease }}
            className="font-cinzel text-2xl md:text-5xl tracking-[0.05em] md:tracking-[0.09em] text-ivory leading-tight mb-4 text-center break-words w-full px-4"
          >
            Shipping Policy
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="w-16 h-px bg-gold/50 mx-auto my-4 origin-center"
          />

          {/* font-rr uppercase tracking — same as Privacy subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="product-desc text-ivory/50 text-[14px] tracking-widest uppercase"
          >
            Fast, secure delivery of premium saffron to your doorstep
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};


      
    
  
/* ─────────────────────────────────────────────
   SHIPPING RATES TABLE
───────────────────────────────────────────── */
const ShippingRates = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, ease }}
    >
      <div className="flex items-center gap-3 mb-8 justify-center">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Package className="w-7 h-7 text-royal-purple" />
        </motion.div>
        {/* font-cinzel section heading — matches Privacy section titles */}
        <h2 className="product-title font-[400] text-2xl tracking-[0.09em] text-royal-purple">
          Shipping Rates
        </h2>
      </div>

      <GlowCard className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
        <table className="w-full text-sm">
          {/* thead: font-cinzel uppercase tracking — mirrors Privacy card headers */}
          <thead className="bg-royal-purple text-ivory">
            <tr>
              {["Order Value", "Standard", "Express"].map((h, i) => (
                <th key={i} className="text-left py-4 px-6">
                  <span className="product-title text-[12px] tracking-[0.12em] uppercase text-ivory">
                    {h}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[
              { order: "Below ₹499",  std: "₹79",  exp: "₹149", free: false },
              { order: "₹499 – ₹999", std: "₹49",  exp: "₹99",  free: false },
              { order: "Above ₹999",  std: "FREE", exp: "₹49",  free: true  },
            ].map((row, i) => (
              <motion.tr
                key={i}
                onHoverStart={() => setHoveredRow(i)}
                onHoverEnd={() => setHoveredRow(null)}
                className="border-t border-royal-purple/8 relative"
                animate={{
                  backgroundColor:
                    hoveredRow === i ? "rgba(88,28,135,0.04)" : "rgba(255,255,255,1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <td className="py-4 px-6 relative">
                  {/* left gold accent bar on row hover */}
                  <motion.div
                    animate={{ scaleY: hoveredRow === i ? 1 : 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold origin-top"
                  />
                  {/* font-rr for all table body text — matches Privacy list items */}
                  <motion.span
                    animate={{ x: hoveredRow === i ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="product-desc text-royal-purple font-[400] tracking-[0.09em] text-[12px]"
                  >
                    {row.order}
                  </motion.span>
                </td>
                <td className="py-4 px-6">
                  <motion.span
                    animate={{ x: hoveredRow === i ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`product-desc tracking-[0.09em] text-[12px] font-[400] ${row.free ? "text-green-600" : "text-royal-purple/70"}`}
                  >
                    {row.std}
                  </motion.span>
                </td>
                <td className="py-4 px-6">
                  <motion.span
                    animate={{ x: hoveredRow === i ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="product-desc tracking=[0.09em] text-[12px] font-[400] text-royal-purple/60"
                  >
                    {row.exp}
                  </motion.span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </GlowCard>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   DELIVERY TIMELINE CARDS
───────────────────────────────────────────── */
const DeliveryTimeline = () => {
  const [hoveredItems, setHoveredItems] = useState<Record<string, boolean>>({});

  const cards = [
    {
      title: "Standard Delivery",
      icon: <Package className="w-4 h-4" />,
      points: [
        "Metro Cities: 3–5 business days",
        "Tier 2 Cities: 5–7 business days",
        "Other Areas: 7–10 business days",
      ],
    },
    {
      title: "Express Delivery",
      icon: <Clock className="w-4 h-4" />,
      points: [
        "Metro Cities: 1–2 business days",
        "Tier 2 Cities: 2–3 business days",
        "Other Areas: 3–5 business days",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, ease }}
    >
      <div className="flex items-center gap-3 mb-8 justify-center">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Clock className="w-7 h-7 text-royal-purple" />
        </motion.div>
        <h2 className="product-title font-[400] text-2xl tracking-[0.09em] text-royal-purple">
          Delivery Timeline
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            /* alternating slide-in — exactly as Privacy's PolicySection */
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease, delay: index * 0.08 }}
            whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
            className="rounded-3xl border border-charcoal/10 bg-white overflow-hidden shadow-sm transition-shadow duration-500"
          >
            <GlowCard>
              {/* card header — mirrors Privacy's PolicySection purple header exactly */}
              <div className="flex items-center gap-3 px-6 py-3 bg-royal-purple">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-6 h-6 rounded-md  flex items-center justify-center text-gold flex-shrink-0"
                >
                  {card.icon}
                </motion.div>
                {/* font-cinzel text-[13px] tracking-[0.08em] — exact Privacy card header */}
                <h3 className="product-title text-[12px] tracking-[0.09em] text-ivory uppercase leading-none">
                  {card.title}
                </h3>
              </div>

              {/* card body — staggered list, same as Privacy PolicySection body */}
              <motion.ul
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="px-6 py-4 space-y-2.5"
              >
                {card.points.map((point, i) => {
                  const key = `${index}-${i}`;
                  return (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      onHoverStart={() =>
                        setHoveredItems((p) => ({ ...p, [key]: true }))
                      }
                      onHoverEnd={() =>
                        setHoveredItems((p) => ({ ...p, [key]: false }))
                      }
                      className="flex items-start gap-3 cursor-default"
                    >
                      {/* animated dot — same as Privacy list dots */}
                      <motion.span
                        animate={{
                          scale: hoveredItems[key] ? 1.6 : 1,
                          boxShadow: hoveredItems[key]
                            ? "0 0 6px 2px rgba(212,175,55,0.4)"
                            : "none",
                        }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0"
                      />
                      {/* font-rr text-[14.5px] — exact Privacy list item style */}
                      <motion.span
                      
                        animate={{
                          x: hoveredItems[key] ? 3 : 0,
                          color: hoveredItems[key]
                            ? "rgba(75,0,130,0.85)"
                            : "rgba(40,40,40,0.65)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="product-desc text-royal-purple font-[400] tracking-[0.09] leading-relaxed text-[12px]"
                      >
                        {point}
                      </motion.span>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   CONTACT SECTION  (mirrors Privacy's ContactSection exactly)
───────────────────────────────────────────── */
const ContactSection = () => (
  <section className="py-16 border-t border-charcoal/10">
    <div className="container mx-auto px-4 md:px-6 lg:px-0">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7 }}
        className="max-w-xl mx-auto text-center"
      >
        {/* font-cinzel heading — same as Privacy contact */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="product-title text-xl font-[400] tracking-[0.09em] text-royal-purple mb-3"
        >
          Questions About Shipping?
        </motion.h2>

        {/* font-rr body — same as Privacy */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="product-desc text-royal-purple font-[400] text-[14px] mb-7"
        >
          Contact our support team for any shipping-related queries.
        </motion.p>

        {/* MagneticLinks — exactly as Privacy's ContactSection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <MagneticLink href="mailto:zprincessaffron07@gmail.com">
            zprincessaffron07@gmail.com
          </MagneticLink>
          <MagneticLink href="tel:+917200150588">
            +91 72001 50588
          </MagneticLink>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const Shipping = () => (
  <Layout>
    <ScrollProgressBar />

    <div className="min-h-screen bg-ivory overflow-hidden">

      <ParallaxHero />

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-0">
          <div className="max-w-5xl mx-auto space-y-16">
            
            <ShippingRates />
            <DeliveryTimeline />
          </div>
        </div>
      </section>

      <ContactSection />

    </div>
  </Layout>
);

export default Shipping;