import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getOrderEmailTemplate, getResetEmailTemplate, getOTPEmailTemplate } from "../utils/emailTemplates.js";

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

    console.log(`📧 Sending email from: ${process.env.EMAIL_USER} to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Email notification failed. Error details:", error);
    return null;
  }
};

export const sendResetEmail = async (to, resetUrl, fullName) => {
  try {
    if (!to || !resetUrl) {
      console.warn("⚠️ Missing email details, skipping reset notification.");
      return;
    }

    console.log(`📧 Preparing to send password reset email to ${to}...`);

    const htmlContent = getResetEmailTemplate(resetUrl, fullName);

    const mailOptions = {
      from: `"Z-Princess Saffron" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Z-Princess Saffron: Password Reset Request",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Reset email failed:", error);
    return null;
  }
};

export const sendOTPEmail = async (to, otp, fullName) => {
  try {
    if (!to || !otp) {
      console.warn("⚠️ Missing email details, skipping OTP notification.");
      return;
    }

    console.log(`📧 Preparing to send OTP verification email to ${to}...`);

    const htmlContent = getOTPEmailTemplate(otp, fullName);

    const mailOptions = {
      from: `"Z-Princess Saffron" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Z-Princess Saffron: Login Verification Code",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ OTP email failed:", error);
    return null;
  }
};

export default { sendOrderEmail, sendResetEmail, sendOTPEmail };

