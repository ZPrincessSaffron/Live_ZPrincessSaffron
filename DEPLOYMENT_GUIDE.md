# Deployment Guide: Environment Variables

This guide explains how to configure the necessary environment variables for the Z Princess Saffron application on Vercel (Frontend) and Render (Backend).

## Frontend (Vercel)

1. Go to your project settings in the Vercel Dashboard.
2. Navigate to **Settings** > **Environment Variables**.
3. Add the following variables from your `saffron_frontend/.env` file:

| Variable Name | Description |
|---------------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_API_URL` | URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Public Key ID |
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_VAPID_KEY` | Firebase VAPID Key (for push notifications) |

> [!NOTE]
> All frontend variables MUST start with `VITE_` for Vite to load them.

---

## Backend (Render)

1. Go to your web service settings in the Render Dashboard.
2. Navigate to **Environment**.
3. Add the following variables from your `saffron_backend/.env` file:

| Variable Name | Description |
|---------------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token generation |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (matching the frontend) |
| `RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `EMAIL_USER` | Gmail address for sending notifications |
| `EMAIL_PASS` | Gmail App Password (not your regular password) |
| `GROQ_API_KEY` | Groq AI API Key |
| `FIREBASE_SERVICE_ACCOUNT` | **CRITICAL**: The entire JSON content of your firebase service account file as a single-line string. |

### How to format `FIREBASE_SERVICE_ACCOUNT` for Render:
The `FIREBASE_SERVICE_ACCOUNT` must be a valid JSON string. If you have the `firebase-service-account.json` file, you can convert it to a single line using a tool or by carefully removing newlines. 

Example format:
`{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n", ...}`

---

## Security Reminders
- **Never** commit `.env` files to Git. They are included in `.gitignore` by default.
- Use `.env.example` as a template for other developers.
- Regularly rotate your secrets (especially `JWT_SECRET` and API keys) if you suspect they have been compromised.
