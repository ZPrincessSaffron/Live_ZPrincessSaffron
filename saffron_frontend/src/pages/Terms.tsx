import Layout from "@/components/layout/Layout";
import {
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  AlertCircle,
  Scale,
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
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";

const ease = cubicBezier(0.22, 1, 0.36, 1);
const snappy = cubicBezier(0.34, 1.56, 0.64, 1);

/* ── Scroll Progress Bar ─────────────────────────── */
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });
  return (
    <>
      <motion.div style={{ scaleX, transformOrigin: "left" }} className="fixed top-0 left-0 right-0 h-[3px] bg-gold z-50" />
      <motion.div style={{ scaleX, transformOrigin: "left" }} className="fixed top-0 left-0 right-0 h-[3px] bg-gold/30 blur-sm z-50" />
    </>
  );
};

/* ── Floating Particles ──────────────────────────── */
interface ParticleProps { delay: number; x: number; size: number }
const Particle = ({ delay, x, size }: ParticleProps) => (
  <motion.div
    aria-hidden
    className="absolute rounded-full bg-gold pointer-events-none"
    style={{ left: `${x}%`, bottom: "-10px", width: size, height: size }}
    animate={{ y: [0, -320], opacity: [0, 0.5, 0], scale: [0.5, 1, 0.3] }}
    transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeOut" }}
  />
);
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 18 }).map((_, i) => (
      <Particle key={i} delay={i * 0.4} x={5 + Math.random() * 90} size={2 + Math.random() * 4} />
    ))}
  </div>
);

/* ── Magnetic Link ───────────────────────────────── */
interface MagneticLinkProps { href: string; children: React.ReactNode }
const MagneticLink = ({ href, children }: MagneticLinkProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  return (
    <motion.a
      ref={ref} href={href} style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-2 font-rr text-royal-purple font-medium group"
    >
      <span className="border-b border-gold pb-0.5 group-hover:text-gold transition-colors duration-200">{children}</span>
      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
        <ArrowRight className="w-4 h-4 text-gold" />
      </motion.span>
    </motion.a>
  );
};

/* ── Cursor Glow Card ────────────────────────────── */
interface GlowCardProps { children: React.ReactNode; className?: string }
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

/* ── ORIGINAL HERO (untouched) ───────────────────── */
const ParallaxHero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section ref={ref} className="relative w-full bg-royal-purple-dark text-ivory overflow-hidden pt-24 md:pt-32 pb-12 md:pb-16 min-h-[250px] md:min-h-[320px] flex flex-col items-center text-center">
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
      <motion.div style={{ y, opacity, scale }} className="relative w-full container mx-auto px-4 md:px-6 lg:px-0">
        <div className="max-w-2xl mx-auto text-center">
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
              <FileText className="w-7 h-7 text-gold" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease }}
            className="font-cinzel text-2xl md:text-5xl tracking-[0.05em] md:tracking-[0.09em] text-ivory leading-tight mb-4 text-center break-words w-full px-4"
          >
            Terms & Conditions
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="w-16 h-px bg-gold/50 mx-auto my-4 origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="product-desc text-ivory/50 text-[14px] font-[400] tracking-widest uppercase"
          >
            Last updated — March 2026
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

/* ── Intro Block (original styles) ──────────────── */
const IntroBlock = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
    >
      <p className="product-desc text-center text-royal-purple leading-relaxed text-[16px] font-[400] tracking-[0.09em] mb-8">
        Welcome to Z Princess Saffron. By accessing our website and placing orders,
        you agree to be bound by these Terms and Conditions.
      </p>

      <motion.div
        whileHover={{ y: -3, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="bg-cream rounded-3xl p-8 shadow-sm transition-shadow duration-500 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <p className="product-desc text-center text-[14px] font-[400] tracking-[0.09em] text-royal-purple/80 leading-relaxed">
          <span className="product-title font-[400] text-2xl tracking-[0.09em] text-royal-purple uppercase">
            Company Details
          </span>
          <br /><br />
          Z Princess Saffron – A project of HeyRam Infrastructure
          <br /><br />
          FSSAI: 12423008002367 &nbsp;|&nbsp; GSTIN: 33ABFA6551N1ZZ
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </motion.div>
    </motion.div>
  );
};

/* ── Terms Section Card — clean white header ─────── */
interface TermsItem { subtitle: string; content: string }
interface TermsSectionProps {
  icon: React.ReactNode;
  title: string;
  items: TermsItem[];
  index: number;
}

const TermsSection = ({ icon, title, items, index }: TermsSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [expanded, setExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const xInit = index % 2 === 0 ? -40 : 40;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xInit, scale: 0.97 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, ease, delay: index * 0.07 }}
      className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden"
    >
      <GlowCard>
        {/* ── Clean white header (no purple fill) ── */}
        <motion.button
          onClick={() => setExpanded((p) => !p)}
          whileHover={{ backgroundColor: "rgba(212,175,55,0.05)" }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15 }}
          className="w-full flex items-center justify-between gap-3 px-6 py-4 bg-white border-b border-charcoal/8 text-left"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-7 h-7 rounded-lg  flex items-center justify-center text-gold flex-shrink-0"
            >
              <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
            </motion.div>

            {/* ── Exact original header font class ── */}
            <h2 className="product-tile text-[14px] tracking-[0.09em] font-[400] text-royal-purple uppercase leading-none">
              {title}
            </h2>
          </div>

          {/* chevron */}
          <motion.div
            animate={{ rotate: expanded ? 0 : -90 }}
            transition={{ duration: 0.3, ease }}
            className="text-gold/50 flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.button>

        {/* collapsible body */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease }}
              style={{ overflow: "hidden" }}
            >
              <div className="px-6 py-4 space-y-4">
                {items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 + i * 0.09, duration: 0.5, ease }}
                    onHoverStart={() => setHoveredItem(i)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className="flex items-start gap-3 cursor-default"
                  >
                    <motion.span
                      animate={{
                        scale: hoveredItem === i ? 1.6 : 1,
                        boxShadow: hoveredItem === i ? "0 0 6px 2px rgba(212,175,55,0.4)" : "none",
                      }}
                      transition={{ duration: 0.2 }}
                      className="mt-[7px] w-1 h-1 rounded-full bg-gold flex-shrink-0"
                    />
                    <div>
                      {/* ── Exact original body font styles ── */}
                      <motion.p
                        animate={{
                          x: hoveredItem === i ? 3 : 0,
                          color: hoveredItem === i ? "rgba(40,40,40,0.80)" : "rgba(40,40,40,0.60)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="product-desc leading-relaxed font-[400] tracking-[0.09em] text-[14px]"
                      >
                        <span className="product-desc leading-relaxed font-[400] tracking-[0.09em] text-[14px] text-royal-purple/90" style={{ fontWeight: 500 }}>
                          {item.subtitle}:&nbsp;
                        </span>
                        {item.content}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlowCard>
    </motion.div>
  );
};

/* ── Contact Section (original styles) ──────────── */
const ContactSection = () => (
  <section className="py-16 border-t border-charcoal/10">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7 }}
        className="max-w-xl mx-auto text-center"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="product-title text-2xl tracking-[0.09em] font-[400] text-royal-purple mb-3"
        >
          Questions?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="product-desc text-royal-purple/80 font-[400] text-[14px] tracking-[0.09em] mb-7"
        >
          For any clarification regarding these terms:
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center text-[13px] gap-6"
        >
          <MagneticLink href="mailto:Crocus@zprincesssaffron.com">
            Crocus@zprincesssaffron.com
          </MagneticLink>
          <MagneticLink href="tel:+917538870577">
            +91 75388 70577
          </MagneticLink>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ── Sections Data ───────────────────────────────── */
const sections = [
  {
    icon: <ShoppingBag />,
    title: "Orders & Products",
    items: [
      { subtitle: "Product Information", content: "We strive to display accurate product descriptions and prices. We reserve the right to correct errors without prior notice." },
      { subtitle: "Order Acceptance", content: "All orders are subject to availability and approval. We may cancel orders in case of fraud or stock issues." },
      { subtitle: "Authenticity", content: "All saffron products are 100% authentic Kashmiri saffron certified by FSSAI." },
    ],
  },
  {
    icon: <CreditCard />,
    title: "Payment Terms",
    items: [
      { subtitle: "Accepted Payments", content: "We accept Credit/Debit Cards, UPI, Net Banking." },
      { subtitle: "Security", content: "All payments are processed through encrypted gateways. We do not store card details." },
    ],
  },
  {
    icon: <Truck />,
    title: "Shipping & Delivery",
    items: [
      { subtitle: "Delivery Timeline", content: "Standard delivery takes 3 - 5 business days within India." },
      { subtitle: "Shipping Charges", content: "Free shipping on orders above ₹999 all over South India. For other places free shipping on orders above ₹2999" },
    ],
  },
  {
    icon: <AlertCircle />,
    title: "User Responsibilities",
    items: [
      { subtitle: "Account Security", content: "You are responsible for maintaining confidentiality of your login details." },
      { subtitle: "Accurate Information", content: "You agree to provide correct and updated information." },
    ],
  },
  {
    icon: <Scale />,
    title: "Legal & Liability",
    items: [
      { subtitle: "Limitation of Liability", content: "We are not liable for indirect or consequential damages." },
      { subtitle: "Governing Law", content: "These terms are governed by Indian law under Chennai jurisdiction." },
    ],
  },
];

/* ── Main Page ───────────────────────────────────── */
const Terms = () => (
  <Layout>
    <ScrollProgressBar />
    <div className="min-h-screen bg-ivory overflow-hidden">

      {/* ✅ Original hero — untouched */}
      <ParallaxHero />

      {/* INTRO */}
      <section className="py-12 border-b border-charcoal/8">
        <div className="container mx-auto px-4 md:px-6 lg:px-0">
          <div className="max-w-5xl mx-auto">
            <IntroBlock />
          </div>
        </div>
      </section>

      {/* TERMS SECTIONS */}
      <section className="py-14">
        <div className="container mx-auto px-4 md:px-6 lg:px-0">
          <div className="max-w-5xl mx-auto space-y-4">
            {sections.map((s, i) => (
              <TermsSection key={s.title} icon={s.icon} title={s.title} items={s.items} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

    </div>
  </Layout>
);

export default Terms;
