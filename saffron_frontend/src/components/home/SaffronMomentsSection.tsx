import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";

import healthImage from "@/assets/moments-health.jpg";
import beautyImage from "@/assets/moments-beauty3.jpeg";
import culinaryImage from "@/assets/moments-culinary.jpg";

// ─── Z Princess Saffron brand tokens ─────────────────────────────────────────
const BRAND = {
  plum:       "#2D2438",
  plumMid:    "#3D3250",
  plumLight:  "#4A3D60",
  gold:       "#C8860A",
  goldLight:  "#E8A020",
  goldPale:   "#F5DEB3",
  cream:      "#FAF8F2",
  sageBg:     "#EDEEE8",
  textMid:    "#5A5468",
  textSoft:   "#8A8298",
};

// ─── Chapter data ─────────────────────────────────────────────────────────────
const chapters = [
  {
    id: "health",
    image: healthImage,
    tag: "Wellness",
    text: "Nurturing Life, Naturally",
    sub: "Ancient antioxidants that restore what modern life takes — gently, with centuries of Kashmiri trust.",
    stat: { val: "6000+", lbl: "Years of Healing" },
    extra: { val: "100%", lbl: "Natural" },
  },
  {
    id: "beauty",
    image: beautyImage,
    tag: "Beauty",
    text: "Radiance in Every Strand",
    sub: "Persian gold refined into your daily ritual of luminosity — your skin, reborn in amber light.",
    stat: { val: "24K", lbl: "Golden Glow" },
    extra: { val: "0 SLS", lbl: "No Chemicals" },
  },
  {
    id: "culinary",
    image: culinaryImage,
    tag: "Culinary",
    text: "Flavor That Becomes Memory",
    sub: "One pinch transforms a dish. One meal becomes a memory that lasts long after the table is cleared.",
    stat: { val: "0.3g", lbl: "Colors a Feast" },
    extra: { val: "A+", lbl: "ISO Grade" },
  },
];

// ─── Saffron thread particle ──────────────────────────────────────────────────
const SaffronThread = ({
  left,
  duration,
  delay,
  height,
  opacity: op,
}: {
  left: string;
  duration: number;
  delay: number;
  height: number;
  opacity: number;
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left, width: 1.5, height, borderRadius: 2, top: "110%" }}
    animate={{ top: ["-10%", "110%"], opacity: [0, op, op, 0], rotate: [0, 8, -4, 12] }}
    transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(to bottom, transparent, ${BRAND.gold}, transparent)`,
        borderRadius: 2,
      }}
    />
  </motion.div>
);

// ─── Animated counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({ value, inView }: { value: string; inView: boolean }) => {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) { setDisplay(value); return; }
    const num = parseFloat(numMatch[0]);
    const suffix = value.replace(/[\d.]+/, "");
    const hasDecimal = value.includes(".");
    let current = 0;
    const step = num / 55;
    const timer = setInterval(() => {
      current = Math.min(current + step, num);
      setDisplay(
        (hasDecimal ? current.toFixed(1) : Math.round(current).toString()) + suffix
      );
      if (current >= num) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <>{display}</>;
};

// ─── Single Panel ─────────────────────────────────────────────────────────────
const Panel = ({ chapter }: { chapter: (typeof chapters)[0]; index: number }) => {
  const ref        = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { margin: "-25% 0px -25% 0px" });
  const mouseX     = useMotionValue(0);
  const mouseY     = useMotionValue(0);
  const springX    = useSpring(mouseX, { stiffness: 55, damping: 18 });
  const springY    = useSpring(mouseY, { stiffness: 55, damping: 18 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Image effects
  const scale      = useTransform(scrollYProgress, [0, 0.45, 0.65, 1], [1.24, 1.03, 1.03, 1.2]);
  const opacity    = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const brightness = useTransform(scrollYProgress, [0, 0.38, 0.62, 1], [0.68, 1.04, 1.04, 0.68]);
  const imgFilter  = useMotionTemplate`brightness(${brightness}) saturate(1.05)`;

  // Mouse parallax on image
  const imgX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const imgY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  

  // Content float
  const tagY     = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);
  const headingY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);
  const subY     = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const ctaY     = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);

  // Ornament line scale
  const ornScale = useTransform(scrollYProgress, [0.2, 0.48], [0, 1]);


  const handleMouseMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  };

  const threadSeeds = [
    { left: "6%",  duration: 8,   delay: 0,   height: 30, opacity: 0.7 },
    { left: "19%", duration: 9.5, delay: 1.3, height: 42, opacity: 0.5 },
    { left: "44%", duration: 7.2, delay: 0.6, height: 28, opacity: 0.6 },
    { left: "67%", duration: 8.8, delay: 2.1, height: 38, opacity: 0.5 },
    { left: "86%", duration: 7.5, delay: 3.0, height: 34, opacity: 0.7 },
  ];

  return (
    <div ref={ref} className="relative min-h-screen">
      <motion.section
        ref={sectionRef}
        style={{ opacity }}
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      >
        {/* ── Full-bleed image with parallax ── */}
        <motion.div
          className="absolute inset-0"
          style={{ x: imgX, y: imgY, scale: 1.08 }}
        >
          <motion.img
            src={chapter.image}
            alt={chapter.tag}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ scale, filter: imgFilter }}
          />
        </motion.div>

        {/* ── Plum vignette — top + bottom, brand-matched ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom,
              ${BRAND.plum}BB 0%,
              ${BRAND.plum}26 28%,
              ${BRAND.plum}26 72%,
              ${BRAND.plum}D9 100%
            )`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 65% 50% at 50% 50%,
              transparent 0%,
              ${BRAND.plum}80 100%
            )`,
          }}
        />

        {/* ── Saffron threads ── */}
        {isInView && threadSeeds.map((t, i) => <SaffronThread key={i} {...t} />)}

       

        

        {/* ── Centered content stack ── */}
        <div
          className="relative z-15 flex flex-col items-center text-center w-full"
          style={{ padding: "0 clamp(1.5rem,6vw,5rem)", maxWidth: 860 }}
        >
          {/* Tag row */}
          <motion.div
            style={{ y: tagY }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3 mb-6 moments-tag-row"
          >
            <div style={{ height: 1, width: 26, background: BRAND.gold }} />
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.9rem",
                letterSpacing: "0.45em",
                color: "#C6A85A",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
              className="moments-tag-label"
            >
              {chapter.tag}
            </span>
            <div style={{ height: 1, width: 26, background: BRAND.gold }} />
          </motion.div>
<br/>
          {/* Heading */}
          <motion.h2
            style={{
              y: headingY,
              fontFamily: "'sans'",
              fontSize: "clamp(1.6rem,5vw,3.5rem)",
              color: BRAND.cream,
              fontWeight: 100,
              letterSpacing: "0.06em",
              textShadow: `0 4px 40px ${BRAND.plum}99`,
            }}
            className="leading-none lg:whitespace-nowrap moments-heading"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03, textShadow: `0 0 15px rgba(250,248,242,0.5)`, transition: { duration: 0.3 } }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {chapter.text}
          </motion.h2>

          {/* Gold ornament */}
          <div className="flex items-center justify-center gap-4 my-6">
            <motion.div
              style={{
                height: 1,
                width: 55,
                background: `linear-gradient(to right, transparent, ${BRAND.gold})`,
                scaleX: ornScale,
                transformOrigin: "right",
              }}
            />
            <motion.div
              style={{
                width: 5,
                height: 5,
                background: BRAND.gold,
                rotate: 45,
                flexShrink: 0,
                scale: ornScale,
              }}
            />
            <motion.div
              style={{
                height: 1,
                width: 55,
                background: `linear-gradient(to left, transparent, ${BRAND.gold})`,
                scaleX: ornScale,
                transformOrigin: "left",
              }}
            />
          </div>

          {/* Sub text */}
          <motion.p
            className="moments-description"
            style={{
              y: subY,
              fontFamily: "'rr'",
              fontSize: "clamp(1rem,1.8vw,1.2rem)",
              color: "rgba(250,248,242,0.72)",
              lineHeight: 1.78,
              maxWidth: 460
              
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {chapter.sub}
          </motion.p>

          {/* Stats + CTA */}
          <motion.div
            style={{ y: ctaY }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center flex-wrap gap-8 mt-10 moments-stats-container"
          >
            {/* Left stat */}
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div
                style={{
                  fontFamily: "'sans'",
                  fontSize: "clamp(1.6rem,3.5vw,3.4rem)",
                  color: "#C6A85A",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                <AnimatedCounter value={chapter.stat.val} inView={isInView} />
              </div>
              <div
                style={{
                  fontFamily: "'sans'",
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  color: "rgba(250,248,242,0.45)",
                  textTransform: "uppercase",
                  marginTop: 5,
                }}
              >
                {chapter.stat.lbl}
              </div>
            </motion.div>

            {/* Divider */}
            <div style={{ width: 1, height: 38, background: "rgba(250,248,242,0.14)" }} />

            {/* Divider */}
            <div style={{ width: 1, height: 38, background: "rgba(250,248,242,0.14)" }} />

            {/* Right stat */}
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div
                style={{
                  fontFamily: "'sans'",
                  fontSize: "clamp(1.6rem,3.5vw,3.4rem)",
                  color: "#C6A85A",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {chapter.extra.val}
              </div>
              <div
                style={{
                  fontFamily: "'sans'",
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  color: "rgba(250,248,242,0.45)",
                  textTransform: "uppercase",
                  marginTop: 5,
                }}
              >
                {chapter.extra.lbl}
              </div>
            </motion.div>
          </motion.div>
        </div>

        

        {/* Marquee and Mobile Overrides */}
        <style>{`
          @keyframes zpMarquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }

          @media (max-width: 768px) {
            .moments-tag-row {
              margin-bottom: 2.5rem !important;
            }
            .moments-tag-label {
              letter-spacing: 0.6em !important;
              font-size: 0.8rem !important;
            }
            .moments-heading {
              letter-spacing: 0.12em !important;
              line-height: 1.35 !important;
              margin-bottom: 2rem !important;
              font-weight: 200 !important;
            }
            .moments-description {
              letter-spacing: 0.05em !important;
              line-height: 1.9 !important;
              margin-bottom: 3.5rem !important;
              max-width: 320px !important;
              opacity: 0.9 !important;
            }
            .moments-stats-container {
              margin-top: 4.5rem !important;
              gap: 2.5rem !important;
            }
          }
        `}</style>
      </motion.section>
    </div>
  );
};

// ─── Root Section ─────────────────────────────────────────────────────────────
const SaffronMomentsSection = () => {
  return (
    <section style={{ background: BRAND.sageBg }}>
      {chapters.map((chapter, index) => (
        <Panel key={chapter.id} chapter={chapter} index={index} />
      ))}
    </section>
  );
};

export default SaffronMomentsSection;