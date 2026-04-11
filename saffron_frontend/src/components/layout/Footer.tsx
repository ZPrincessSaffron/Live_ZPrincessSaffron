import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

import logo from "@/assets/logo.png";
import razorpayLogo from "@/assets/razorpay.png";
import visaLogo from "@/assets/visa.svg";
import mastercardLogo from "@/assets/mastercard.svg";
import upiLogo from "@/assets/upi.svg";

const footerLinks = {
  shop: [
    { name: "All Products", path: "/products" },
    { name: "Gift Boxes", path: "/products?category=gift" },
  ],
  company: [
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Blogs", path: "/blogs" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Refund Policy", path: "/refund" },
  ],
  support: [
    { name: "FAQ", path: "/faq" },
    { name: "Shipping Policy", path: "/shipping" },
    { name: "Corporate Essentials", path: "/about#corporate" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const paymentMethods = [
  { name: "RazorPay", logo: razorpayLogo },
  { name: "Visa", logo: visaLogo },
  { name: "Mastercard", logo: mastercardLogo },
  { name: "UPI", logo: upiLogo }
];

const Footer = () => {
  return (
    <footer className="relative bg-royal-purple-dark text-ivory overflow-hidden">

      {/* Background Bloom */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-[-150px] w-[520px] h-[520px] bg-gold/10 blur-[160px]" />
        <div className="absolute -bottom-40 left-[-200px] w-[500px] h-[500px] bg-gold/10 blur-[160px]" />
      </div>

      {/* Subtle Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='40' cy='40' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative container mx-auto px-4 md:px-6 lg:px-0 py-16 font-cinzel"
      >

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6 group">
              <img
                src={logo}
                alt="Z Princess Saffron"
                className="h-16 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300"
              />
            </Link>

            <p className="text-ivory/60 product-title font-[400] text-[12px] leading-relaxed mb-6 max-w-xs tracking-[0.2em]">
              Z Princess Saffron <br /> Royal Spice, Timeless Grace
            </p>

            <div className="space-y-3 text-sm tracking-[0.15em] ">
              <a href="tel:+917200150588" className="flex items-center gap-3  text-ivory/70 hover:text-gold transition-colors">
                <Phone className="w-4 h-4 text-gold" />
                +91 72001 50588
              </a>

              <a href="mailto:zprincessaffron07@gmail.com" className="flex items-center gap-3 text-ivory/70 hover:text-gold transition-colors">
                <Mail className="w-4 h-4 text-gold" />
                zprincessaffron07@gmail.com
              </a>

              <div className="flex items-start font-rr gap-3 text-ivory/70">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                Chennai, India
              </div>
            </div>
          </div>

          {/* LINK GROUPS */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-medium uppercase tracking-[0.35em] text-ivory mb-6">
                {title}
              </h4>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="relative inline-block text-sm text-ivory/70 tracking-[0.15em] transition-all duration-300 hover:text-gold hover:[text-shadow:0_0_6px_rgba(212,175,55,0.6)] after:absolute after:left-0 after:bottom-[-2px] after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full hover:after:shadow-[0_0_6px_rgba(212,175,55,0.7)]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* GOLD DIVIDER */}
        <div className="relative my-12 h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="absolute inset-0 animate-[shimmer_6s_linear_infinite] bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-40" />
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* PAYMENTS */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-ivory/50 text-xs uppercase tracking-[0.35em]">
              Secure Payments:
            </span>

            <div className="flex flex-wrap items-center justify-center md:items-center md:justify-start gap-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.name}
                  whileHover={{ y: -2, scale: 1.03 }}
                  className="flex items-center gap-2 px-3 py-2 bg-ivory/10 rounded-md hover:bg-ivory/20 transition-all duration-300 shadow-sm hover:shadow-gold-glow"
                >
                  <img src={method.logo} alt={method.name} className="h-4 sm:h-5 w-auto" />
                  <span className="text-xs text-ivory/70 tracking-[0.15em]">
                    {method.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SOCIAL */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                whileHover={{ y: -4, scale: 1.08 }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                  y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-ivory/70 hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-300"
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>

        </div>
      </motion.div>

      {/* COPYRIGHT */}
      <div className="border-t border-ivory/10 py-5">
        <div className="container mx-auto px-4 md:px-6 lg:px-0">
          <p className="text-center text-ivory/50 text-xs tracking-[0.35em] uppercase">
            © 2026 Z Princess Saffron. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;