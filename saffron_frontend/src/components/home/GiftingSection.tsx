import { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import giftBox from "@/assets/product-gift-box.jpg";

const GiftingSection = () => {
  const [copied, setCopied] = useState(false);
  const couponCode = "ROYAL25";

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-ivory relative overflow-hidden">

      {/* Decorative background glow */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-royal-purple rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative overflow-hidden  shadow-elegant"
            >
              <img
                src={giftBox}
                alt="Premium Gift Collection"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              />

              {/* cinematic light sweep */}
              <motion.div
                initial={{ x: "-120%" }}
                whileInView={{ x: "120%" }}
                transition={{ duration: 2.2, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />

              <div className="absolute inset-0 border border-gold/20" />
            </motion.div>

            {/* Floating luxury discount seal */}
            <motion.div
              animate={{
                y: [0, -6, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-6 -right-6 w-28 h-28 bg-gold rounded-full flex flex-col items-center justify-center shadow-gold-glow z-10 border-4 border-ivory"
            >
              <span className="text-royal-purple-dark text-xs font-sans font-bold uppercase tracking-wider">
                Save
              </span>
              <span className="text-royal-purple-dark text-3xl font-serif font-bold">
                25%
              </span>
            </motion.div>
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="pl-0 lg:pl-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-6 h-6 text-gold" />
              <p className="font-sans text-gold text-sm tracking-[0.3em] uppercase">
                Premium Gifting
              </p>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-royal-purple mb-6 leading-tight">
              Gift the Legacy of
              <span className="text-gold block">Kashmiri Gold</span>
            </h2>

            <p className="font-sans text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Our luxury gift boxes are perfect for weddings, festivals, and special occasions. Each set comes in elegant packaging with a certificate of authenticity.
            </p>

            {/* COUPON CARD */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
              className="bg-card p-6 rounded-2xl shadow-card mb-8"
            >
              <p className="font-sans text-sm text-muted-foreground mb-3">
                Use code for exclusive discount:
              </p>

              <div className="flex items-center gap-4">
                {/* CODE BOX */}
                <div className="relative flex-1 px-6 py-3 bg-ivory-dark border border-gold/40 rounded-2xl overflow-hidden">

                  {/* shimmer */}
                  <motion.div
                    initial={{ x: "-120%" }}
                    whileHover={{ x: "120%" }}
                    transition={{ duration: 1.4 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />

                  <span className="relative z-10 font-serif text-xl font-bold text-royal-purple tracking-widest">
                    {couponCode}
                  </span>
                </div>

                {/* COPY BUTTON */}

                <button
                  onClick={handleCopy}
                  className="
    group relative inline-flex items-center justify-center gap-2 rounded-full
    px-5 py-3
    border border-royal-purple/40
    text-royal-purple
    bg-transparent
    font-sans text-sm tracking-[0.15em] uppercase
    transition-all duration-500
    hover:border-transparent
    hover:text-[#C6A85A]
    hover:shadow-[0_6px_18px_rgba(198,168,90,0.25)]
    overflow-hidden
  "
                >
                  {/* TEXT */}
                  <span className="relative z-10 flex items-center gap-2">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </span>

                  {/* ⭐ ROTATING OUTLINE SVG */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 276 46"
                    preserveAspectRatio="none"
                  >
                    {/* base outline */}
                    <path
                      d="
        M 1 23
        A 22 22 0 0 1 23 1
        L 253 1
        A 22 22 0 0 1 275 23
        A 22 22 0 0 1 253 45
        L 23 45
        A 22 22 0 0 1 1 23
      "
                      className="rr-outline-base"
                      fill="transparent"
                      strokeWidth="0.8"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* running stroke */}
                    <path
                      d="
        M 1 23
        A 22 22 0 0 1 23 1
        L 253 1
        A 22 22 0 0 1 275 23
        A 22 22 0 0 1 253 45
        L 23 45
        A 22 22 0 0 1 1 23
      "
                      className="rr-outline-anim"
                      fill="transparent"
                      strokeWidth="0.8"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </button>

              </div>
            </motion.div>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-4">
              {["Free Gift Wrapping", "Certificate of Authenticity", "Express Delivery"].map((feature) => (
                <motion.span
                  key={feature}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.25 }}
                  className="px-4 py-2 bg-royal-purple/10 text-royal-purple text-sm font-sans rounded-full"
                >
                  {feature}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default GiftingSection;
