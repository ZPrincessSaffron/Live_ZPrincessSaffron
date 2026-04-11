import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
/* ---------- CONTACT INFO ---------- */
const contactInfo = [
  { icon: MapPin, label: "Our Office", value: "Chennai, India" },
  { icon: Phone, label: "Phone", value: "+91 72001 50588", link: "tel:+917200150588" },
  { icon: Mail, label: "Email", value: "zprincessaffron07@gmail.com", link: "mailto:zprincessaffron07@gmail.com" },
  { icon: Clock, label: "Our Service", value: "24/7",}
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", topic: "", contactMethod: "", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          topic: formData.topic || null,
          contact_method: formData.contactMethod || null,
          message: formData.message,
        }),
      });

      if (!response.ok) throw new Error("Failed to send");

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        topic: "",
        contactMethod: "",
        message: "",
      });

    } catch {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>

      {/* ================= HERO ================= */}
      <section className="relative w-full bg-gradient-to-b from-royal-purple-dark to-royal-purple overflow-hidden pt-24 md:pt-32 pb-12 md:pb-16 min-h-[250px] md:min-h-[320px] flex flex-col items-center text-center">

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 blur-[180px]" />
        </div>

        <div className="w-full md:container mx-auto px-4 md:px-6 lg:px-0 text-center relative z-10">

          <motion.p
            className="font-cinzel text-gold text-sm tracking-[0.35em] uppercase mb-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          >
            <motion.div
  animate={{ y: [0, -8, 0] }}
  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
  className="mt-10 text-gold/80 font-medium text-sm tracking-[0.4em] uppercase"
>
  ✦ Get In Touch ✦
</motion.div>
            
          </motion.p>

          <motion.h1
            className="font-cinzel text-2xl md:text-5xl text-ivory mb-8 tracking-[0.1em] md:tracking-[0.25em] uppercase font-medium text-center break-words w-full px-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {"Contact Us".split("").map((char, i) => (
              <motion.span key={i}
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-ivory/80 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Whether you're interested in bulk orders, becoming a retailer, or simply have questions about our saffron, we're here to help.
          </motion.p>

        </div>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 md:px-6 lg:px-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-10">
            {contactInfo.map((info) => (
              <div key={info.label} className="bg-card p-8 shadow-elegant text-center hover:-translate-y-2 transition-all duration-500">
                <div className="inline-flex p-4 bg-gold/10 text-gold mb-4">
                  <info.icon className="w-6 h-6" />
                </div>
                <p className="text-sm uppercase font-medium tracking-wider mb-2">{info.label}</p>
                <p className="font-cinzel text-[14px] text-royal-purple break-words">{info.value}</p>
            
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FORM ================= */}
      <section className="py-28 bg-ivory">
        <div className="container mx-auto px-4 md:px-6 lg:px-0">
          <div className="max-w-3xl mx-auto">

            <div className="text-center mb-16">
              <h2 className="font-cinzel text-3xl md:text-4xl text-royal-purple tracking-[0.25em] uppercase mb-6 font-medium">
                Send a Message
              </h2>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
            </div>

            {/* FORM SAME AS YOURS BELOW */}

            {/* FORM UNCHANGED BELOW */}

            <form onSubmit={handleSubmit} className="space-y-10 backdrop-blur-md bg-white/40 p-6 sm:p-12 rounded-3xl border border-gold/20 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">

              {["name", "email", "phone"].map((field, i) => (
                <div key={i} className="relative">
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={(formData as any)[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-black/50 py-3 focus:outline-none focus:border-gold transition-all"
                  />
                  <label className="absolute left-0 top-3 text-charcoal/60 text-sm transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gold peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-xs">
                    {field === "name" ? "Your Name *" : field === "email" ? "Email *" : "Phone"}
                  </label>
                </div>
              ))}

              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: (e.target as HTMLTextAreaElement).value })}
                placeholder="Your Message *"
                className="w-full border-b border-black/50 py-3 focus:outline-none focus:border-gold bg-transparent resize-none"
              />

              <div className="flex justify-center pt-8">
                <Button
  variant="royal"
  type="submit"
  disabled={isSubmitting}
  className="!min-w-0 !px-4 !py-2 !h-auto w-auto inline-flex rounded-full"
>
  <span className="flex items-center gap-2">
    <Send className="w-3.5 h-3.5" />
    Send Message
  </span>
</Button>
              </div>
            </form>

            <div className="mt-12 flex flex-col items-center text-center">
              <p className="text-muted-foreground mb-4">
                Prefer instant messaging?
              </p>
              <a href="https://wa.me/917200150588" target="_blank" rel="noopener noreferrer">
                <Button
  variant="royal"
  className="!min-w-0 !px-4 !py-2 !h-auto w-auto inline-flex rounded-full"
>
  <span className="flex items-center gap-2">
    <MessageCircle className="w-3.5 h-3.5" />
    Chat on WhatsApp
  </span>
</Button>
              </a>
            </div>

          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Contact;