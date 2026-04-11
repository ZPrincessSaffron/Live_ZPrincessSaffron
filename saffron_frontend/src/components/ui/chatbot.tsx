import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, ChevronDown } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

interface ChatBotProps {
  externalOpen?: boolean;
  onClose?: () => void;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Namaste I'm your saffron guide. How may I help you discover the golden treasure of Kashmir today?",
    isBot: true,
  },
];

const quickReplies = [
  "What makes Z Princess special?",
  "How to use saffron?",
  "Check product quality",
  "Shipping information",
];

export const ChatBot = ({ externalOpen, onClose }: ChatBotProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const setIsOpen = (value: boolean) => {
    if (externalOpen !== undefined) {
      if (!value && onClose) onClose();
    } else {
      setInternalOpen(value);
    }
  };

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      return data.reply || "I'm here to help  Please try again.";
    } catch {
      return "Our saffron guide is resting 🌙 Please try again shortly.";
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    setMessages((prev) => [...prev, { id: Date.now(), text: messageText, isBot: false }]);
    setInput("");
    setIsTyping(true);

    const botReply = await fetchBotResponse(messageText);
    setMessages((prev) => [...prev, { id: Date.now() + 1, text: botReply, isBot: true }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      {externalOpen === undefined && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-24 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl ${isOpen ? "hidden" : ""}`}
          style={{ background: "#2D2438" }}
        >
          {/* Gold pulse ring */}
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "rgba(200,134,10,0.25)" }}
          />
          <MessageCircle className="w-6 h-6 relative z-10" style={{ color: "#FAF8F2" }} />
          {/* Gold dot indicator */}
          <span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2"
            style={{ background: "#C8860A", borderColor: "#FAF8F2" }}
          />
        </motion.button>
      )}

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.92 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-8 right-8 z-50 flex flex-col overflow-hidden shadow-2xl"
            style={{
              width: 380,
              height: 560,
              borderRadius: 20,
              
              background: "#EDEEE8",
            }}
          >

            {/* ════ HEADER ════ */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background: "rgba(30,10,50,0.97)",
                
              }}
            >
              {/* Avatar + title */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative"
                  
                >
                  <Sparkles className="w-4 h-4" style={{ color: "white" }} />
                 
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className=" tracking-wide"
                      style={{
                        fontFamily: "'font-cinzel'",
                        fontSize: "1.05rem",
                        color: "#FAF8F2",
                        lineHeight: 1.2,
                        letterSpacing: "0.15em"
                        
                      }}
                    >
                      Saffron Guide
                    </h4>
                   
                    
                  </div>
                  <p
                    style={{
                      fontFamily: "font-rr",
                      fontSize: "0.7rem",
                      color: "rgba(250,248,242,0.55)",
                    }}
                  >
                    Royal Spice, Timeless Grace
                  </p>
                </div>
              </div>

              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                <ChevronDown className="w-5 h-5" style={{ color: "rgba(250,248,242,0.7)" }} />
              </motion.button>
            </div>

            {/* Thin gold accent line below header */}
            <div
              className="h-px flex-shrink-0"
              style={{
                background: "linear-gradient(to right, transparent, #C8860A, transparent)",
                opacity: 0.5,
              }}
            />

            {/* ════ MESSAGES ════ */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{
                background: "#EDEEE8",
                scrollbarWidth: "none",
              }}
            >
              {messages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, delay: i === 0 ? 0 : 0 }}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  {/* Bot avatar dot */}
                  {message.isBot && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                      style={{
                        background: "rgba(30,10,50,0.97)",
                        
                      }}
                    >
                      <Sparkles
                        className="w-3 h-3"
                        style={{ color: "white" }}
                      />
                    </div>
                  )}

                  <div
  className="max-w-[78%] px-3.5 py-2.5"
  style={
    message.isBot
      ? {
          background: "#FAF8F2",
          border: "1px solid rgba(200,134,10,0.18)",
          borderRadius: "4px 16px 16px 16px",
          boxShadow: "0 1px 8px rgba(45,36,56,0.06)",
          color: "rgba(30,10,50,0.97)",
        }
      : {
          background: "rgba(30,10,50,0.97)",
          borderRadius: "16px 4px 16px 16px",
          color: "#FAF8F2",
        }
  }
>
                    <p
                      style={{
                        fontFamily: "font-rr",
                        fontWeight: "Thin" ,
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
                        letterSpacing: "0.05em"
                      }}
                    >
                      {message.text}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start items-end gap-2"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(30,10,50,0.97)8", border: "1px solid rgba(200,134,10,0.3)" }}
                    >
                      <Sparkles className="w-3 h-3" style={{ color: "#C8860A" }} />
                    </div>
                    <div
                      className="px-4 py-3 flex gap-1.5 items-center"
                      style={{
                        background: "rgba(30,10,50,0.97)8",
                        border: "1px solid rgba(200,134,10,0.18)",
                        borderRadius: "4px 16px 16px 16px",
                      }}
                    >
                      {[0, 150, 300].map((delay, i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "#C8860A", opacity: 0.6 }}
                          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: delay / 1000,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ════ QUICK REPLIES ════ */}
            <div
              className="flex gap-2 px-4 py-2 overflow-x-auto flex-shrink-0"
              style={{
                background: "rgba(30,10,50,0.97)8",
                borderTop: "1px solid rgba(200,134,10,0.12)",
                scrollbarWidth: "none",
              }}
            >
              {quickReplies.map((reply) => (
                <motion.button
                  key={reply}
                  whileHover={{ scale: 1.03,  color: "rgba(30,10,50,0.97)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSend(reply)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-left transition"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.04em",
                    background: "#FAF8F2",
                    
                    color: "rgba(30,10,50,0.97)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {reply}
                </motion.button>
              ))}
            </div>

            {/* ════ INPUT ════ */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{
                background: "#FAF8F2",
                borderTop: "1px solid rgba(200,134,10,0.15)",
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about saffron..."
                className="flex-1 px-4 py-2.5 rounded-full text-sm focus:outline-none transition"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.82rem",
                  background: "#EDEEE8",
                  border: "1px solid rgba(200,134,10,0.2)",
                  color: "rgba(30,10,50,0.97)",
                  // focus ring via onFocus/onBlur to keep inline
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.border = "1px solid rgba(45,36,56,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.border = "1px solid rgba(200,134,10,0.2)")
                }
              />

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSend()}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition"
                style={{
                  background: input.trim() ? "#391368" : "rgba(30,10,50,0.97)",
                }}
              >
                <Send className="w-4 h-4" style={{ color: "white" }} />
              </motion.button>
            </div>

            {/* Bottom brand tag */}
            <div
              className="text-center py-1.5 flex-shrink-0"
              style={{
                background: "#FAF8F2",
                borderTop: "1px solid rgba(200,134,10,0.08)",
              }}
            >
              <span
                style={{
                  fontFamily: "font-rr",
                  fontSize: "0.6rem",
                  
                  color: "rgba(45,36,56,0.35)",
                  
                }}
              >
                Z Princess Saffron · Royal Spice, Timeless Grace
              </span>
            </div><br/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};