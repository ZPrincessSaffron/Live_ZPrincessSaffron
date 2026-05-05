import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getReturnEmailTemplate } from "../utils/returnEmailTemplates.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Isolated service for sending return-related emails.
 * Uses a non-blocking approach to ensure API performance.
 */
export const sendReturnEmail = async ({ to, subject, html }) => {
  try {
    if (!to) {
      console.warn("⚠️ No recipient email provided for return notification.");
      return;
    }

    const mailOptions = {
      from: `"Z-Princess Saffron" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Z-Princess Saffron: ${subject}`,
      html,
    };

    // Non-blocking execution is handled at the controller level via .catch()
    // but we add a small log here for tracking.
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Return email sent to ${to}. ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Return email failed:", error.message);
    // We do not throw error here to keep it non-blocking
    return null;
  }
};

/**
 * Orchestrator for sending specific return lifecycle emails.
 */
export const notifyReturnStatus = async (user, returnRequest, status, extraNote = "") => {
    try {
        const email = user.email;
        const name = user.fullName || "Customer";
        const orderId = returnRequest.orderId;
        const productName = returnRequest.items[0]?.productName || "Product";
        
        const subjectMap = {
            requested: "Return Request Received",
            approved: "Return Approved",
            rejected: "Return Rejected",
            refunded: "Refund Initiated"
        };

        const subject = subjectMap[status] || "Return Update";
        const html = getReturnEmailTemplate(name, productName, orderId, status, extraNote);

        // Fire and forget
        sendReturnEmail({ to: email, subject, html });
    } catch (err) {
        console.error("Return notification orchestrator failed:", err.message);
    }
};

export default { sendReturnEmail, notifyReturnStatus };
