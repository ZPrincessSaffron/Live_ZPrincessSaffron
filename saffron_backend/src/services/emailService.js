import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getOrderEmailTemplate } from "../utils/emailTemplates.js";

dotenv.config();

/**
 * Configure Nodemailer transporter with Gmail SMTP.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email notification for an order status update.
 * This is non-blocking and will log errors without crashing the main flow.
 */
export const sendOrderEmail = async (to, orderId, status, fullName) => {
  try {
    if (!to || !orderId || !status) {
      console.warn("⚠️ Missing email details, skipping email notification.");
      return;
    }

    console.log(`📧 Preparing to send email for order #${orderId} to ${to}...`);

    const htmlContent = getOrderEmailTemplate(orderId, status, fullName);

    const mailOptions = {
      from: `"Z-Princess Saffron" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Z-Princess Saffron: Order Status Update [#${orderId}]`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Notification failed, but order flow continues:", error.message);
    return null;
  }
};

export default { sendOrderEmail };

