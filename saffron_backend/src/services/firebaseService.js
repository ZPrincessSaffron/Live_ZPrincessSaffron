import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Notification from "../models/notificationModel.js";
import { sendOrderEmail } from "./emailService.js";

dotenv.config();

/**
 * Mapping of order statuses to notification titles and messages.
 */
const ORDER_STATUS_MESSAGES = {
  confirmed: {
    title: "Order Placed! 🎉",
    message: (name, orderId) => `Your order #${orderId} has been placed successfully!`
  },
  processing: {
    title: "Order Processing ⚙️",
    message: (name, orderId) => `Great news! Your order #${orderId} is now being processed.`
  },
  shipped: {
    title: "Order Shipped! 🚚",
    message: (name, orderId) => `Your order #${orderId} is on the way 🚚`
  },
  out_for_delivery: {
    title: "Out for Delivery! 🚲",
    message: (name, orderId) => `Get ready! Your order #${orderId} is out for delivery.`
  },
  delivered: {
    title: "Order Delivered! 📦",
    message: (name, orderId) => `Order #${orderId} delivered successfully 📦`
  },
  cancelled: {
    title: "Order Cancelled 🛑",
    message: (name, orderId) => `Your order #${orderId} has been cancelled ❌`
  },
  payment_success: {
    title: "Payment Successful! 💰",
    message: (name, orderId) => "Payment successful 💰"
  },
  payment_failed: {
    title: "Payment Declined! ⚠️",
    message: (name, orderId) => "Payment declined ⚠️"
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app;

try {
  const serviceAccountPath = path.join(__dirname, "../config/firebase-service-account.json");
  let serviceAccount;

  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (serviceAccount) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized");
  } else {
    console.warn("⚠️ Firebase service account not found. FCM notifications will be disabled.");
  }
} catch (error) {
  console.error("❌ Firebase Admin Initialization Error:", error.message);
}

/**
 * Send a push notification to a device token.
 * 
 * @param {string} token - The FCM registration token for the target device.
 * @param {string} title - The notification title.
 * @param {string} body - The notification body content.
 * @param {Object} [data={}] - Optional data payload for the notification.
 */
export const sendNotification = async (token, title, body, data = {}) => {
  if (!app) {
    console.warn("⚠️ Firebase logic is reaching sendNotification but app is not initialized.");
    return;
  }
  if (!token) {
    console.warn("⚠️ Cannot send notification: token is missing.");
    return;
  }

  console.log(`📡 Preparing to send FCM notification to token prefix: ${token.substring(0, 10)}...`);

  const message = {
    notification: {
      title,
      body,
    },
    data: {
      ...data,
      click_action: "FLUTTER_NOTIFICATION_CLICK", // Standard for some clients, good to have
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(`✅ Successfully sent FCM notification. ID: ${response}`);
    return response;
  } catch (error) {
    console.error(`❌ Error sending FCM notification: ${error.code} - ${error.message}`);
    if (error.code === 'messaging/registration-token-not-registered') {
      console.warn("⚠️ The registration token is no longer valid. Prompt the user to re-register.");
    }
    return null;
  }
};

/**
 * Send a notification based on order status change and save to history.
 * 
 * @param {Object} user - The user object (must contain fcmToken/id and fullName).
 * @param {Object} order - The order object (must contain _id and orderId).
 * @param {string} status - The new order status.
 */
export const sendStatusUpdateNotification = async (user, order, status) => {
  console.log(`🔔 Triggering notification for Order: ${typeof order === "string" ? order : order?.orderId} | Status: ${status}`);
  try {
    const readableOrderId = typeof order === "string" ? order : order.orderId;
    const orderObjectId = typeof order === "object" ? order._id : null;

    const config = ORDER_STATUS_MESSAGES[status.toLowerCase()];
    if (!config) return;

    const title = config.title;
    const body = config.message(user.fullName || "Customer", readableOrderId);

    // 1. Save to Notification History (Internal DB) - Non-blocking
    if (user._id && orderObjectId) {
      Notification.create({
        userId: user._id,
        orderId: orderObjectId,
        readableOrderId: readableOrderId,
        message: body,
        status: status.toUpperCase(),
      }).catch(err => console.error("❌ Notification history save failed:", err.message));
    }

    // 2. Send Push Notification (Firebase) - Non-blocking
    if (user.fcmToken) {
      sendNotification(user.fcmToken, title, body, { orderId: readableOrderId, status });
    } else {
      console.log("No FCM token found, skipping push notification (history still saved)");
    }

    // 3. Send Email Notification (Nodemailer) - Non-blocking
    const emailTo = user.email || (order && order.shippingDetails && order.shippingDetails.email);
    if (emailTo) {
      // Map internal statuses to user-friendly email statuses
      let emailStatus = status.toUpperCase();
      if (emailStatus === "CONFIRMED") emailStatus = "ORDERED";

      sendOrderEmail(emailTo, readableOrderId, emailStatus, user.fullName || "Customer")
        .catch(err => console.error("❌ Email notification failed:", err.message));
    }
  } catch (err) {
    console.error("Notification process failed, but order flow continues:", err.message);
  }
};

export default { sendNotification, sendStatusUpdateNotification };

