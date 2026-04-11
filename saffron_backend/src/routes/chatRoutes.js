import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  const text = message.toLowerCase();

  /* ---------- DEFAULT BRAND ANSWERS ---------- */

  if (text.includes("z princess") || text.includes("special")) {
    return res.json({
      reply:
        "Z Princess Saffron offers premium handpicked Kashmiri saffron known for its deep aroma, rich color, and purity. Our saffron is carefully sourced and packed to deliver royal flavor and wellness benefits."
    });
  }

  if (text.includes("how to use saffron")) {
    return res.json({
      reply:
        "To use saffron, soak 2–3 strands in warm water or milk for about 5 minutes. This releases its color and aroma. You can add it to milk, biryani, desserts, tea, or even skincare remedies."
    });
  }

  if (text.includes("quality")) {
    return res.json({
      reply:
        "Z Princess Saffron is premium Kashmiri saffron with deep red strands, strong aroma, and natural coloring power. Each batch is carefully selected to maintain authenticity and quality."
    });
  }

  if (text.includes("shipping")) {
    return res.json({
      reply:
        `Here is our shipping policy:

Free shipping on orders above ₹999 within India.

Shipping Rates:
• Below ₹499 → ₹79 standard
• ₹499–₹999 → ₹49 standard
• Above ₹999 → FREE shipping

Delivery Time:
Metro cities: 3–5 days
Tier 2 cities: 5–7 days
Other areas: 7–10 days

Express delivery also available.

For help contact:
📧 zprincessaffron07@gmail.com
📞 +91 72001 50588`
    });
  }

  /* ---------- AI RESPONSE USING GROQ ---------- */

  try {
    const chatCompletion = await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content:
        "You are an assistant for Z Princess Saffron, a premium saffron brand in India. Answer politely and briefly about saffron products."
    },
    {
      role: "user",
      content: message
    }
  ],
  model: "llama-3.1-8b-instant"
});

    const reply = chatCompletion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error(error);

    res.json({
      reply:
        "Our saffron guide is currently unavailable. Please try again later."
    });
  }
});

export default router;
