import { useState, useEffect, useRef } from "react";
import dancer from "@/assets/dancer1.webp";
import dancer2 from "@/assets/dancer2.png";
import { preloadImages } from "@/utils/imageUtils";

const sections = [
  { title: "Who We Are", number: "01", accent: "#C9A84C", accent2: "#F0D080", desc: "Fruit of passion, tradition, and technological excellence. Launched by HeyRam Infrastructure to bridge the digital future with age-old agricultural heritage." },
  { title: "Our Essence", number: "02", accent: "#D4AF37", accent2: "#FFD966", desc: "Curators of a living legacy. From high Himalayan valleys to sun-kissed Spanish fields, we preserve a piece of heritage in every harvest." },
  { title: "Origin Sourcing", number: "03", accent: "#B8960C", accent2: "#E8C040", desc: "Traceability is a responsibility. Direct partnerships with farms in Kashmir, Iran, and Spain to ensure peak bloom potency." },
  { title: "Laboratory Tested", number: "04", accent: "#C9A84C", accent2: "#F0D080", desc: "Verified for purity, aroma profile, and color strength. Authenticity must be proven, not promised." },
  { title: "Crafted Experiences", number: "05", accent: "#D4AF37", accent2: "#FFD966", desc: "Wellness. Celebration. Healing. Royalty. From sacred rituals to Michelin-starred kitchens, elevating moments that matter." },
  { title: "A Culture of Saffron", number: "06", accent: "#B8960C", accent2: "#E8C040", desc: "Make luxury ethical. Make authenticity accessible. Redefining saffron from a commodity to a cherished craft." },
];

const AUTO_MS = 4000;

export default function SensoryExperience() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = (n: number) => {
    if (transitioning || n === active) return;
    setTransitioning(true);
    setPrev(active);
    setActive(n);
    setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 800);
  };

  const advance = () => {
    if (transitioning) return;
    const next = (active + 1) % sections.length;
    goTo(next);
  };

  useEffect(() => {
    timerRef.current = setInterval(advance, AUTO_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, transitioning]);

  useEffect(() => {
    preloadImages([dancer, dancer2], { priority: "high" });
  }, []);

  const current = sections[active];
  const prevSection = prev !== null ? sections[prev] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; border: none; background: none; padding: 0; }

        /* New panel wipes in from bottom */
        @keyframes panelWipeIn {
          0%   { clip-path: inset(100% 0 0 0); transform: translateY(20px); }
          100% { clip-path: inset(0% 0 0 0);   transform: translateY(0); }
        }
        /* Old panel wipes out to top */
        @keyframes panelWipeOut {
          0%   { clip-path: inset(0 0 0% 0); opacity: 1; }
          100% { clip-path: inset(0 0 100% 0); opacity: 0; }
        }

        /* Left number column slides */
        @keyframes numSlideIn {
          0%   { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0px);  opacity: 1; }
        }
        @keyframes numSlideOut {
          0%   { transform: translateY(0px);  opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }

        /* Title letter stagger */
        @keyframes letterDrop {
          0%   { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }

        /* Desc fade up */
        @keyframes fadeUp {
          0%   { transform: translateY(18px); opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }

        /* Line expand */
        @keyframes lineExpand {
          0%   { transform: scaleX(0); transform-origin: left; }
          100% { transform: scaleX(1); transform-origin: left; }
        }

        /* Shimmer */
        @keyframes shimmer {
          0%   { transform: translateX(-100%) skewX(-10deg); }
          100% { transform: translateX(250%) skewX(-10deg); }
        }

        /* Progress fill */
        @keyframes progressAnim {
          0%   { width: 0%; }
          100% { width: 100%; }
        }

        /* Ambient float */
        @keyframes ambientFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%     { transform: translateY(-8px) scale(1.02); }
        }

        @keyframes dancerIn {
          from { opacity: 0; transform: translateY(-50%) scale(0.94); }
          to   { opacity: 0.1; transform: translateY(-50%) scale(1); }
        }
        @keyframes dancerInR {
          from { opacity: 0; transform: translateY(-50%)  scale(0.94); }
          to   { opacity: 0.1; transform: translateY(-50%)  scale(1); }
        }

        .panel-new {
          animation: panelWipeIn 0.75s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .panel-old {
          animation: panelWipeOut 0.72s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .num-in {
          animation: numSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
        }
        .num-out {
          animation: numSlideOut 0.4s ease-in forwards;
        }
        .line-in {
          animation: lineExpand 0.7s cubic-bezier(0.76, 0, 0.24, 1) 0.3s both;
        }
        .desc-in {
          animation: fadeUp 0.6s ease-out 0.45s both;
        }
        @media (max-width: 1024px) {
          .experience-container { 
            padding: 100px 24px 60px !important; 
            min-height: 100svh !important; 
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
          }
          .experience-title { 
            font-size: clamp(1.4rem, 5vw, 2.2rem) !important; 
            margin-bottom: 2.5rem !important;
            line-height: 1.3 !important;
            max-width: 95% !important;
          }
          .panel-container { 
            height: auto !important; 
            min-height: 350px !important; 
            margin-top: 1.5rem !important;
            max-width: 86% !important;
            width: 86% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .num-column { display: none !important; }
          .content-panel { 
            padding: 36px 24px !important; 
            background: rgba(30, 15, 56, 0.96) !important; 
            backdrop-filter: blur(15px) !important;
            border-radius: 20px !important;
          }
          .content-title { font-size: clamp(20px, 6vw, 30px) !important; }
          .content-desc { font-size: clamp(14px, 4vw, 18px) !important; }
          .quote-text { font-size: clamp(1rem, 4vw, 1.5rem) !important; margin-top: 40px !important; }
          .dancer-mobile { 
            position: absolute !important;
            inset: 0 !important; 
            width: 100% !important; 
            height: 100% !important; 
            object-fit: cover !important; 
            object-position: center !important;
            opacity: 0.1 !important; 
            z-index: 1 !important;
            animation: none !important;
            transform: none !important;
            left: 0 !important;
            top: 0 !important;
          }
          .dancer-desktop-hide { display: none !important; }
        }
      `}</style>

      <section 
        className="experience-container"
        style={{
          background: "#FAF6EF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px 56px",
          position: "relative",
          overflow: "hidden",
        }}>

        <img src={dancer} alt="" aria-hidden fetchPriority="high" loading="eager" decoding="async" className="dancer-mobile" style={{
          position: "absolute", left: "-130px", top: "50%", height: "90%",
          objectFit: "contain", filter: "grayscale(100%) contrast(70%)",
          pointerEvents: "none", zIndex: 0,
          animation: "dancerIn 6s ease-out forwards",
        }} />
        <img src={dancer2} alt="" aria-hidden fetchPriority="high" loading="eager" decoding="async" className="dancer-mobile dancer-desktop-hide hidden lg:block" style={{
          position: "absolute", right: "-2%", top: "50%", height: "80%",
          objectFit: "contain", filter: "grayscale(100%) contrast(70%)",
          pointerEvents: "none", zIndex: 0,
          animation: "dancerInR 6s ease-out forwards",
        }} />

        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background: `radial-gradient(ellipse 55% 50% at 50% 50%, ${current.accent}15 0%, transparent 68%)`,
          transition: "background 0.8s ease",
        }} />

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "36px", position: "relative", zIndex: 3 }}>

          <h2 className="font-cinzel text-3xl md:text-4xl tracking-[0.06em] experience-title" style={{ color: "#2C1B4E", marginBottom: "10px" }}>
            Ancient <span style={{ color: "#C9A84C" }}>Heritage</span> Meets <span style={{ color: "#C9A84C" }}>Modern</span> Purity
          </h2>
          <div style={{ width: "60px", height: "1px", margin: "0 auto", background: `linear-gradient(90deg, transparent, ${current.accent}, transparent)`, transition: "background 0.6s" }} />
        </div>

        {/* ── MAIN PANEL STRUCTURE ── */}
        <div 
          className="panel-container"
          style={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            maxWidth: "760px",
            height: "370px",
            overflow: "hidden",
            margin: "0 auto",
          }}>

          {/* OUTGOING PANEL */}
          {prevSection && (
            <div className="panel-old" style={{ position: "absolute", inset: 0, zIndex: 4 }}>
              <PanelLayout section={prevSection} isLeaving />
            </div>
          )}

          {/* INCOMING PANEL */}
          <div
            className={transitioning ? "panel-new" : ""}
            key={active}
            style={{ position: "absolute", inset: 0, zIndex: 3 }}
          >
            <PanelLayout section={current} isLeaving={false} />
          </div>
        </div>

        {/* ── STEP TICKER ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "20px",
          marginTop: "28px", position: "relative", zIndex: 3,
        }}>
          {/* Prev button */}
          <button
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              const prev = (active - 1 + sections.length) % sections.length;
              goTo(prev);
              timerRef.current = setInterval(advance, AUTO_MS);
            }}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `1px solid ${current.accent}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: current.accent, fontSize: "14px",
              transition: "all 0.3s ease",
              background: "transparent",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${current.accent}18`)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            ←
          </button>

          {/* Step dots */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {sections.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  goTo(i);
                  timerRef.current = setInterval(advance, AUTO_MS);
                }}
                style={{
                  width: i === active ? "24px" : "6px",
                  height: "6px", borderRadius: "3px",
                  background: i === active ? `linear-gradient(90deg, ${s.accent}, ${s.accent2})` : "rgba(44,27,78,0.15)",
                  boxShadow: i === active ? `0 0 8px ${s.accent}55` : "none",
                  transition: "all 0.35s ease",
                }}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              advance();
              timerRef.current = setInterval(advance, AUTO_MS);
            }}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `1px solid ${current.accent}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: current.accent, fontSize: "14px",
              transition: "all 0.3s ease",
              background: "transparent",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${current.accent}18`)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            →
          </button>
        </div>

        {/* Auto-progress bar */}
        <div style={{
          width: "200px", height: "2px",
          background: "rgba(44,27,78,0.08)",
          borderRadius: "1px", marginTop: "12px",
          position: "relative", zIndex: 3, overflow: "hidden",
        }}>
          <div
            key={active}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${current.accent}, ${current.accent2})`,
              borderRadius: "1px",
              boxShadow: `0 0 6px ${current.accent}70`,
              animation: `progressAnim ${AUTO_MS}ms linear forwards`,
            }}
          />
        </div>

        {/* QUOTE */}
        <div style={{ textAlign: "center", marginTop: "28px", maxWidth: "620px", zIndex: 3, position: "relative" }}>
          <p className="font-sans font-medium text-lg lg:text-2xl leading-[1.9] tracking-[0.03em] quote-text" style={{ color: "rgba(44,27,78,0.65)" }}>
            "Every thread must whisper <em style={{ color: "#B8960C", fontWeight: "400", fontStyle: "normal" }}>luxury</em>, <em style={{ color: "#B8960C", fontWeight: "400", fontStyle: "normal" }}>heritage</em>, and <em style={{ color: "#B8960C", fontWeight: "400", fontStyle: "normal" }}>healing</em>"
          </p>
        </div>
      </section>
    </>
  );
}

function PanelLayout({ section, isLeaving }: {
  section: typeof sections[0];
  isLeaving: boolean;
}) {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex",
      gap: "0",
      overflow: "hidden",
    }}>

      {/* ── LEFT: BIG NUMBER COLUMN ── */}
      <div 
        className="num-column"
        style={{
          width: "120px",
          flexShrink: 0,
          background: `linear-gradient(180deg, #1a0d2e 0%, #100820 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          borderRight: `1px solid ${section.accent}20`,
        }}>
        {/* Vertical shimmer line */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "50%",
          width: "1px",
          background: `linear-gradient(180deg, transparent, ${section.accent}50 30%, ${section.accent}80 50%, ${section.accent}50 70%, transparent)`,
          transform: "translateX(-50%)",
        }} />

        {/* Big number */}
        <div
          className={isLeaving ? "num-out" : "num-in"}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "72px",
            fontWeight: 700,
            color: "#C9A84C",
            lineHeight: 1,
            textShadow: `0 0 40px ${section.accent}60, 0 0 80px ${section.accent}30`,
            letterSpacing: "-0.04em",
          }}
        >
          {section.number}
        </div>

        {/* Vertical label */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: `${section.accent}50`,
          writingMode: "vertical-rl",
          marginTop: "16px",
          textOrientation: "mixed",
          transform: "rotate(180deg)",
        }}>

        </div>

        {/* Top corner bracket */}
        <div style={{ position: "absolute", top: 14, left: 14, width: 16, height: 16, borderTop: `1px solid ${section.accent}45`, borderLeft: `1px solid ${section.accent}45` }} />
        <div style={{ position: "absolute", bottom: 14, right: 14, width: 16, height: 16, borderBottom: `1px solid ${section.accent}45`, borderRight: `1px solid ${section.accent}45` }} />
      </div>

      {/* ── RIGHT: CONTENT PANEL ── */}
      <div 
        className="content-panel"
        style={{
          flex: 1,
          background: `linear-gradient(135deg, #1e0f38 0%, #150b28 50%, #0e0620 100%)`,
          position: "relative",
          overflow: "hidden",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>

        {/* Shimmer sweep */}
        {!isLeaving && (
          <div style={{
            position: "absolute", inset: 0, width: "30%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 50%, transparent)",
            animation: "shimmer 5s ease-in-out 0.5s infinite",
            zIndex: 10, pointerEvents: "none",
          }} />
        )}

        {/* Top glow wash */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "100px",
          background: `linear-gradient(180deg, ${section.accent}15 0%, transparent 100%)`,
          pointerEvents: "none",
        }} />

        {/* Border lines */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, ${section.accent}80, ${section.accent}40, transparent)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, ${section.accent}30, transparent)` }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "1px", background: `linear-gradient(180deg, ${section.accent}40, transparent 70%)` }} />

        {/* Ghost title watermark */}
        <div style={{
          position: "absolute", right: 1, bottom: -8,
          fontFamily: "'Cinzel', serif",
          fontSize: "65px", fontWeight: 500,
          color: section.accent,
          opacity: 0.04,
          lineHeight: 1,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          letterSpacing: "-0.04em",
          animation: "ambientFloat 8s ease-in-out infinite",
        }}>
          {section.title}
        </div>

        {/* Particles */}
        {!isLeaving && [
          { x: "88%", y: "18%", d: "0.3s", s: 3 },
          { x: "75%", y: "65%", d: "1.1s", s: 2 },
          { x: "92%", y: "82%", d: "0.7s", s: 2 },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", left: p.x, top: p.y,
            width: `${p.s}px`, height: `${p.s}px`,
            borderRadius: "50%",
            background: section.accent2,
            opacity: 0.55,
            zIndex: 5,
            animationDelay: p.d,
            pointerEvents: "none",
          }} />
        ))}

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "9px",
              letterSpacing: "0.45em", textTransform: "uppercase", color: `${section.accent}70`,
            }}>
              Heritage
            </span>
            <div style={{ width: "30px", height: "1px", background: `${section.accent}40` }} />
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 6 }}>
          {/* Title */}
          <h3 
            className="content-title"
            style={{
              fontFamily: "font-sans",
              fontSize: "30px", fontWeight: 200,
              color: "#F8F3E8", lineHeight: 1.1,
              marginBottom: "18px",
              textShadow: `0 2px 20px ${section.accent}20`,
              overflow: "hidden",
            }}>
            {section.title}
          </h3>

          {/* Animated line */}
          <div
            className={isLeaving ? "" : "line-in"}
            style={{
              display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px",
            }}
          >
            <div style={{ width: "32px", height: "2px", background: `linear-gradient(90deg, ${section.accent}, ${section.accent2})`, boxShadow: `0 0 8px ${section.accent}60` }} />
            <div style={{ width: "6px", height: "6px", transform: "rotate(45deg)", background: `linear-gradient(135deg, ${section.accent}, ${section.accent2})`, boxShadow: `0 0 8px ${section.accent}80`, flexShrink: 0 }} />
            <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${section.accent}30, transparent)` }} />
          </div>

          {/* Description */}
          <p
            className={isLeaving ? "content-desc" : "desc-in content-desc"}
            style={{
              fontFamily: "font-rr",
              fontSize: "20px",
              lineHeight: 1.85, color: "rgba(248,243,232,0.65)",
              letterSpacing: "0.02em",
            }}
          >
            {section.desc}
          </p>
        </div>

        {/* Bottom row */}
        <div style={{ position: "relative", zIndex: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "18px", height: "1px", background: `linear-gradient(90deg, ${section.accent}, ${section.accent2})` }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "8px",
              letterSpacing: "0.4em", textTransform: "uppercase", color: `${section.accent}45`,
            }}>

            </span>
          </div>
          {!isLeaving && (
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: `radial-gradient(circle, ${section.accent2}, ${section.accent})`,
              boxShadow: `0 0 14px ${section.accent}90, 0 0 28px ${section.accent}40`,
            }} />
          )}
        </div>
      </div>
    </div>
  );
}
