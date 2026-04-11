import Layout from "@/components/layout/Layout";
import {
  HelpCircle,
  Package,
  Truck,
  CreditCard,
  Leaf,
  Gift,
  ShieldCheck,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  motion,
  cubicBezier,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

/* ================= EASING ================= */
const ease = cubicBezier(0.22, 1, 0.36, 1);
const snappy = cubicBezier(0.34, 1.56, 0.64, 1);

/* ================= VARIANTS ================= */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};


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

/* ================= FLOATING PARTICLES ================= */
const Particle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    aria-hidden
    className="absolute rounded-full bg-gold pointer-events-none"
    style={{ left: `${x}%`, bottom: "-10px", width: size, height: size }}
    animate={{
      y: [0, -320],
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

/* ================= PARALLAX HERO ================= */
const ParallaxHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section ref={ref} className="relative w-full bg-royal-purple-dark text-ivory overflow-hidden pt-24 md:pt-32 pb-12 md:pb-16 min-h-[250px] md:min-h-[320px] flex flex-col items-center text-center">
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
          {/* icon with breathing pulse ring */}
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
              <HelpCircle className="w-7 h-7 text-gold" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease }}
            className="font-cinzel text-2xl md:text-5xl tracking-[0.05em] md:tracking-[0.09em] text-ivory leading-tight mb-4 text-center break-words w-full px-4"
          >
            Frequently Asked Questions
          </motion.h1>

          {/* animated rule */}
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
            className="product-desc text-ivory/50 text-[14px] tracking-widest uppercase"
          >
            Everything you need to know about our products and services
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

/* ================= FAQ DATA ================= */
const faqCategories = [
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "About Our Saffron",
    faqs: [
      {
        question: "What makes Kashmiri saffron different?",
        answer:
          "Kashmiri saffron is known for its deep crimson color, intense aroma, and high crocin content. It is grown in Pampore at high altitude, giving it superior quality.",
      },
      {
        question: "How can I verify authenticity?",
        answer:
          "All our products are FSSAI certified and GI tagged. Genuine saffron releases color slowly in warm water and retains its thread shape.",
      },
      {
        question: "What is the shelf life?",
        answer:
          "When stored in an airtight container away from light and moisture, saffron retains quality for 2–3 years.",
      },
    ],
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "Orders & Products",
    faqs: [
      {
        question: "How do I place an order?",
        answer:
          "Browse products, add to cart, and proceed to checkout. You may create an account or checkout as guest.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "Orders can be cancelled within 24 hours if not shipped. Contact us immediately for assistance.",
      },
    ],
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Shipping & Delivery",
    faqs: [
      {
        question: "How long does delivery take?",
        answer:
          "Standard delivery takes 5–7 business days. Metro cities may receive orders within 3–5 days.",
      },
      {
        question: "How can I track my order?",
        answer:
          "You'll receive tracking details via email/SMS after shipment. You can also track via your account dashboard.",
      },
    ],
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Payment",
    faqs: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery.",
      },
      {
        question: "Is my payment secure?",
        answer:
          "Yes. We use SSL encryption and PCI-compliant payment gateways for secure transactions.",
      },
    ],
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: "Gifting",
    faqs: [
      {
        question: "Do you offer gift packaging?",
        answer:
          "Yes. We provide elegant gift boxes and personalized message options.",
      },
    ],
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Returns & Refunds",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "Returns are accepted within 7 days for damaged or defective products in original packaging.",
      },
    ],
  },
];

/* ================= CATEGORY SECTION ================= */
const CategorySection = ({
  category,
  categoryIndex,
}: {
  category: (typeof faqCategories)[0];
  categoryIndex: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const xInit = categoryIndex % 2 === 0 ? -40 : 40;
  const [hoveredIcon, setHoveredIcon] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xInit, scale: 0.97 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, ease, delay: categoryIndex * 0.08 }}
    >
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          onHoverStart={() => setHoveredIcon(true)}
          onHoverEnd={() => setHoveredIcon(false)}
          animate={{ scale: hoveredIcon ? 1.1 : 1, rotate: hoveredIcon ? 8 : 0 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="w-8 h-8 bg-royal-purple/10 rounded-xl flex items-center justify-center text-royal-purple cursor-default"
        >
          {category.icon}
        </motion.div>

        <div>
          <h2 className="product-title text-xl font-[400] tracking-[0.1em] text-royal-purple">
            {category.title}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3 + categoryIndex * 0.08, duration: 0.5, ease }}
            className="h-px w-full bg-gold/40 mt-1.5 origin-left"
          />
        </div>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="space-y-4">
        {category.faqs.map((faq, faqIndex) => (
          <FAQItem
            key={faqIndex}
            faq={faq}
            value={`${categoryIndex}-${faqIndex}`}
            index={faqIndex}
            inView={inView}
          />
        ))}
      </Accordion>
    </motion.div>
  );
};

/* ================= FAQ ITEM ================= */
const FAQItem = ({
  faq,
  value,
  index,
  inView,
}: {
  faq: { question: string; answer: string };
  value: string;
  index: number;
  inView: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.09, duration: 0.5, ease }}
      whileHover={{ y: -4 }}
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        {/* cursor glow */}
        <motion.div
          aria-hidden
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
          style={{
            background: `radial-gradient(160px circle at ${glowPos.x}px ${glowPos.y}px, rgba(88,28,135,0.07), transparent 70%)`,
          }}
        />

        <AccordionItem
          value={value}
          className="relative z-10 bg-white rounded-2xl px-6 border  border-royal-purple/5 shadow-sm hover:shadow-lg transition-all duration-500"
        >
          <AccordionTrigger className="text-[15px] font-[400] tracking-[0.09em] lowercase product-title leading-[1.9] text-left text-royal-purple py-6 hover:no-underline hover:text-gold transition-colors duration-300">
            {faq.question}
          </AccordionTrigger>

          <AccordionContent className="product-desc text-royal-purple font-[400]  pb-6 leading-[1.8] text-[15px]">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      </div>
    </motion.div>
  );
};

/* ================= CTA SECTION ================= */
const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const emailX = useMotionValue(0);
  const emailY = useMotionValue(0);
  const whatsappX = useMotionValue(0);
  const whatsappY = useMotionValue(0);
  const springEmailX = useSpring(emailX, { stiffness: 300, damping: 20 });
  const springEmailY = useSpring(emailY, { stiffness: 300, damping: 20 });
  const springWaX = useSpring(whatsappX, { stiffness: 300, damping: 20 });
  const springWaY = useSpring(whatsappY, { stiffness: 300, damping: 20 });

  const handleMouse = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLElement | null>,
    xMv: MotionValue<number>,
    yMv: MotionValue<number>
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    xMv.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    yMv.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const emailRef = useRef<HTMLAnchorElement>(null);
  const waRef = useRef<HTMLAnchorElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className="bg-gradient-to-r from-royal-purple to-royal-purple-dark rounded-3xl p-10 text-center text-ivory relative overflow-hidden"
    >
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-gold blur-3xl"
      />

      <div className="relative z-10">
        <h2 className="product-title hover:text-ivory2 text-ivory text-2xl tracking-[0.1em] mb-4">
          Still Have Questions?
        </h2>

        <p className="product-desc text-[14px] text-ivory mb-8 leading-relaxed">
          Can't find what you're looking for? Our support team is here to help.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.a
            ref={emailRef}
            href="mailto:zprincessaffron07@gmail.com"
            style={{ x: springEmailX, y: springEmailY }}
            onMouseMove={(e) => handleMouse(e, emailRef, emailX, emailY)}
            onMouseLeave={() => { emailX.set(0); emailY.set(0); }}
            whileTap={{ scale: 0.96 }}
            className="bg-ivory text-royal-purple px-8 py-3 rounded-full product-title font-medium tracking-wide inline-block"
          >
            Email Us
          </motion.a>

          <motion.a
            ref={waRef}
            href="https://wa.me/917200150588"
            target="_blank"
            rel="noopener noreferrer"
            style={{ x: springWaX, y: springWaY }}
            onMouseMove={(e) => handleMouse(e, waRef, whatsappX, whatsappY)}
            onMouseLeave={() => { whatsappX.set(0); whatsappY.set(0); }}
            whileTap={{ scale: 0.96 }}
            className="bg-white/10 text-ivory px-8 py-3 rounded-full product-title font-medium tracking-wide hover:bg-white/20 transition-all duration-300 inline-block"
          >
            WhatsApp Chat
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

/* ================= MAIN COMPONENT ================= */
const FAQ = () => {
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7 }}
              className="product-desc text-royal-purple text-[14px] font-light leading-relaxed max-w-3xl mx-auto text-center"
            >
              Browse through our most common questions below. If you still need help, we're just a message away.
            </motion.p>
          </div>
        </section>

        {/* FAQ CONTENT */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              className="max-w-4xl mx-auto space-y-16"
            >
              {faqCategories.map((category, categoryIndex) => (
                <CategorySection
                  key={categoryIndex}
                  category={category}
                  categoryIndex={categoryIndex}
                />
              ))}

              {/* CTA */}
              <CTASection />
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default FAQ;