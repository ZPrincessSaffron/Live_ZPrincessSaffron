import Layout from "@/components/layout/Layout";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Mail,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  motion,
  cubicBezier,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";

/* ================= EASING ================= */
const ease = cubicBezier(0.22, 1, 0.36, 1);
const snappy = cubicBezier(0.34, 1.56, 0.64, 1);

/* ================= VARIANTS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

/* ================= DATA ================= */
const sections = [
  {
    icon: <Database className="w-4 h-4" />,
    title: "Information We Collect",
    content: [
      "Personal details including name, email, phone number, and address.",
      "Account information such as login credentials and preferences.",
      "Transaction data including order history and payment details.",
      "Usage analytics including browser type and website interactions.",
      "Customer support communication records.",
    ],
  },
  {
    icon: <Eye className="w-4 h-4" />,
    title: "How We Use Your Information",
    content: [
      "To process and deliver your orders.",
      "To provide updates and tracking notifications.",
      "To improve our website and customer experience.",
      "To send promotional offers with your consent.",
      "To prevent fraud and ensure transaction security.",
    ],
  },
  {
    icon: <Lock className="w-4 h-4" />,
    title: "Data Security",
    content: [
      "SSL encryption for secure data transmission.",
      "PCI-compliant secure payment processing.",
      "Restricted access to authorized personnel only.",
      "Regular security audits and monitoring.",
      "No storage of full credit card details on our servers.",
    ],
  },
  {
    icon: <Mail className="w-4 h-4" />,
    title: "Information Sharing",
    content: [
      "We do not sell or rent personal data.",
      "Data may be shared with trusted shipping and payment partners.",
      "Disclosure may occur if legally required.",
      "Data transfer in case of merger with safeguards.",
    ],
  },
  {
    icon: <Clock className="w-4 h-4" />,
    title: "Data Retention",
    content: [
      "Information retained only as necessary.",
      "Order data stored for accounting and compliance.",
      "Users may request account deletion.",
      "Anonymous data may be retained for analytics.",
    ],
  },
];

const rights = [
  "Access your personal data.",
  "Correct inaccurate information.",
  "Request deletion of your data.",
  "Opt-out of marketing communications.",
  "File complaints with relevant authorities.",
];

/* ================= SCROLL PROGRESS BAR ================= */
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

/* ================= FLOATING PARTICLES (hero) ================= */
const Particle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    aria-hidden
    className="absolute rounded-full bg-gold pointer-events-none"
    style={{ left: `${x}%`, bottom: "-10px", width: size, height: size }}
    animate={{
      y: [-0, -320],
      opacity: [0, 0.5, 0],
      scale: [0.5, 1, 0.3],
    }}
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

/* ================= MAGNETIC BUTTON ================= */
const MagneticLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-2 font-rr text-royal-purple font-medium group relative"
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

/* ================= CURSOR GLOW CARD ================= */
const GlowCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
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

/* ================= PARALLAX HERO ================= */
const ParallaxHero = () => {
  const ref = useRef(null);
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

      <motion.div
        style={{ y, opacity, scale }}
        className="relative w-full container mx-auto px-4 md:px-6 lg:px-0"
      >
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
              <Shield className="w-7 h-7 text-gold" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease }}
            className="font-cinzel text-2xl md:text-5xl tracking-[0.05em] md:tracking-[0.09em] text-ivory leading-tight mb-4 text-center break-words w-full px-4"
          >
            Privacy Policy
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

/* ================= POLICY SECTION CARD ================= */
const PolicySection = ({
  icon,
  title,
  content,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  content: string[];
  index: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [expanded, setExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const xInit = index % 2 === 0 ? -40 : 40;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xInit, scale: 0.97 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, ease, delay: index * 0.08 }}
      className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden"
    >
      <GlowCard>
        {/* ── White header (matching terms.tsx style) ── */}
        <motion.button
          onClick={() => setExpanded((p) => !p)}
          whileHover={{ backgroundColor: "rgba(212,175,55,0.05)" }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15 }}
          className="w-full flex items-center justify-between gap-3 px-6 py-4 bg-white border-b border-charcoal/8 text-left"
        >
          <div className="flex items-center gap-3">
            {/* ── Gold-tinted icon box (matching terms.tsx style) ── */}
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-7 h-7  flex items-center justify-center text-gold flex-shrink-0"
            >
              <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
            </motion.div>
            <h2 className="product-title text-[14px] font-[400] tracking-[0.09em] text-royal-purple uppercase leading-none">
              {title}
            </h2>
          </div>
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

        {/* body with AnimatePresence for collapse */}
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
              <motion.ul
                variants={stagger}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="px-6 py-4 space-y-2.5"
              >
                {content.map((item, i) => (
                  <motion.li
                    key={i}
                    variants={fadeUp}
                    onHoverStart={() => setHoveredItem(i)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className="flex items-start gap-3 group cursor-default"
                  >
                    <motion.span
                      animate={{
                        scale: hoveredItem === i ? 1.6 : 1,
                        boxShadow: hoveredItem === i ? "0 0 6px 2px rgba(212,175,55,0.4)" : "none",
                      }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0"
                    />
                    <motion.span
                      animate={{
                        x: hoveredItem === i ? 3 : 0,
                        color: hoveredItem === i ? "rgba(40,40,40,0.80)" : "rgba(40,40,40,0.60)",
                      }}
                      transition={{ duration: 0.2 }}
                      className="product-desc font-[400] tracking-[0.09em] text-[14px] leading-relaxed text-royal-purple"
                    >
                      {item}
                    </motion.span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </GlowCard>
    </motion.div>
  );
};

/* ================= YOUR RIGHTS ================= */
const YourRights = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeRight, setActiveRight] = useState<number | null>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden"
    >
      {/* ── White header with gold icon box (matching terms.tsx) ── */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-charcoal/8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="w-7 h-7  flex items-center justify-center text-gold flex-shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
        </motion.div>
        <h2 className="product-title text-[14px] tracking-[0.09em] font-[400] text-royal-purple uppercase leading-none">
          Your Rights
        </h2>
      </div>

      <ul className="divide-y divide-royal-purple/8">
        {rights.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.09, duration: 0.5, ease }}
            onHoverStart={() => setActiveRight(i)}
            onHoverEnd={() => setActiveRight(null)}
            className="flex items-start gap-4 px-6 py-3.5 cursor-default relative overflow-hidden"
          >
            <motion.div
              aria-hidden
              animate={{ x: activeRight === i ? "0%" : "-100%" }}
              transition={{ duration: 0.28, ease }}
              className="absolute inset-0 bg-royal-purple/5 pointer-events-none"
            />
            <motion.span
              animate={{
                scale: activeRight === i ? 1.5 : 1,
                boxShadow: activeRight === i ? "0 0 6px 2px rgba(212,175,55,0.35)" : "none",
              }}
              transition={{ duration: 0.2 }}
              className="relative mt-1.5 w-1 h-1 rounded-full bg-gold flex-shrink-0"
            />
            <motion.span
              animate={{ x: activeRight === i ? 4 : 0 }}
              transition={{ duration: 0.2 }}
              className="relative product-desc text-royal-purple leading-relaxed text-[14px] font-[400] tracking-[0.09em]"
            >
              {item}
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

/* ================= CONTACT SECTION ================= */
const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="py-16 border-t border-charcoal/10" ref={ref}>
      <div className="container mx-auto px-4 md:px-6 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="product-title text-2xl tracking-[0.09em] font-[400] text-royal-purple mb-3"
          >
            Questions About Privacy?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="product-desc leading-relaxed font-[400] tracking-[0.09em] text-[14px] text-royal-purple/80 mb-7"
          >
            Our Data Protection Officer is here to help.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6 }}
            className='text-[14px]'
          >
            <MagneticLink href="mailto:zprincessaffron07@gmail.com">
              zprincessaffron07@gmail.com
            </MagneticLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ================= MAIN PAGE ================= */
const Privacy = () => {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-40px" });

  return (
    <Layout>
      <ScrollProgressBar />

      <div className="min-h-screen bg-ivory overflow-hidden">

        {/* HERO */}
        <ParallaxHero />

        {/* INTRO */}
        <section className="py-12 border-b border-charcoal/8">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            <motion.p
              ref={introRef}
              initial={{ opacity: 0, y: 20 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="product-desc leading-relaxed font-[400] tracking-[0.09em] text-[16px] text-royal-purple/80 max-w-5xl mx-auto text-center"
            >
              At Z Princess Saffron, we are committed to protecting your privacy
              and ensuring the security of your personal information. This policy
              explains how we collect, use, and safeguard your data.
            </motion.p>
          </div>
        </section>

        {/* POLICY SECTIONS */}
        <section className="py-14">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            {/* max-w-5xl to match terms.tsx */}
            <div className="max-w-5xl mx-auto space-y-4">
              {sections.map((s, i) => (
                <PolicySection
                  key={s.title}
                  icon={s.icon}
                  title={s.title}
                  content={s.content}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* YOUR RIGHTS */}
        <section className="pb-14">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            <div className="max-w-5xl mx-auto">
              <YourRights />
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <ContactSection />

      </div>
    </Layout>
  );
};

export default Privacy;