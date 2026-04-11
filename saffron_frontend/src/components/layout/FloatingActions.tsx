import { useState, useEffect } from "react";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";
import { ChatBot } from "@/components/ui/chatbot";

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* RIGHT SIDE ACTIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">

        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className={`w-12 h-12 rounded-full bg-royal-purple text-ivory shadow-elegant flex items-center justify-center transition-all duration-500 hover:bg-royal-purple-light hover:shadow-gold ${showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Chatbot Button */}
        <button
          onClick={() => setOpenChat(true)}
          className="w-12 h-12 rounded-full bg-gradient-royal text-ivory shadow-gold-glow flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      {/* LEFT SIDE – WHATSAPP CALL */}
      <a
        href="https://wa.me/917200150588"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-gradient-royal text-ivory shadow-gold-glow flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Call us on WhatsApp"
      >
        <Phone className="w-6 h-6" />
      </a>

      <ChatBot externalOpen={openChat} onClose={() => setOpenChat(false)} />
    </>
  );
};

export default FloatingActions;
