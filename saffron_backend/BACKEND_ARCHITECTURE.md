# 🏗️ Z-Princess Saffron: Backend Architecture & Workflow

This document provides a comprehensive overview of the backend logic, technology stack, and directory workflow for the Z-Princess Saffron e-commerce platform.

---

## 🛠️ Technology Stack

The backend is built using a modern, scalable JavaScript stack (MERN-lite):
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/) (Web server and routing)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (Object Data Modeling)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- **Security**: [Bcryptjs](https://www.npmjs.com/package/bcryptjs) (Password hashing) & [Joi](https://joi.dev/) (Request validation)
- **Payment Gateway**: [Razorpay](https://razorpay.com/)
- **Cloud Services**: [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) (Push Notifications)
- **Documentation**: [Swagger / OpenAPI 3.0](https://swagger.io/)

---

## 📂 Master Documentation Index

For deep-dive technical reports on specific modules, refer to the [documentation](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/) folder:

| Module | Technical Deep-Dive Report |
| :--- | :--- |
| **Authentication** | [auth_system.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/auth_system.md) |
| **Security Middleware** | [auth_middleware_deep_dive.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/auth_middleware_deep_dive.md) |
| **Validation Edge** | [validation_middleware.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/validation_middleware.md) |
| **Integrations** | [service_integrations.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/service_integrations.md) |
| **Firebase / Push** | [firebase_integration.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/firebase_integration.md) |
| **Orders & Stock** | [product_order_management.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/product_order_management.md) |
| **Cart Logic** | [cart_management.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/cart_management.md) |
| **Admin Stats** | [admin_ops_support.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/admin_ops_support.md) |
| **Migration** | [mongodb_migration.md](file:///c:/Users/Lenovo%208xin/Downloads/Z-PrincessSaffron-main/Z-PrincessSaffron-main/documentation/mongodb_migration.md) |

---

## 📂 Folder Structure & Workflow

The project follows a clean, modular **MVC-inspired architecture**:

```text
saffron_backend/src/
├── config/             # Database connection & third-party initializations (JWT, Swagger)
├── models/             # Mongoose schemas (Data structure and validation)
├── controllers/        # Business logic (Processes requests, interacts with models)
├── routes/             # API endpoints (Maps URLs to controllers)
├── middleware/         # Security & Helpers (Auth guards, Joi validation)
├── services/           # External integrations (Firebase, Emails, Payments)
├── utils/              # Helper functions and email templates
├── app.js              # Express app configuration & middleware pipeline
└── server.js           # Entry point (Starts the server and connects to DB)
```

### Request Lifecycle Workflow:
1. **Request** hits `server.js` -> `app.js`.
2. **Routes** (`routes/`) match the URL and method.
3. **Middleware** (`validationMiddleware.js`) filters the request body via Joi.
4. **Middleware** (`authMiddleware.js`) verifies the user's token/permissions.
5. **Controller** (`controllers/`) executes the logic (e.g., `createOrder`).
6. **Model** (`models/`) performs DB operations.
7. **Response** is sent back to the client.

---

## 🧠 Core Business Logic

### 1. Authentication & Security
- **JWT Protection**: High-level `protect` middleware extracts and verifies the bearer token from headers.
- **Enumeration Protection**: Forgot-password routes spoof successful responses to prevent email mining.
- **Gato Guards**: Specialized `admin` middleware restricts access to sensitive routes using dual-check logic (`isAdmin` and `role`).

### 2. Inventory & Product Management
- **Atomic Stock Control**: Stock is validated immediately before order creation to prevent over-selling.
- **Automated Tagging**: A Mongoose `pre('save')` hook automatically marks products as "Out of Stock" when `stock === 0`.
- **Self-Healing Cart**: Automatically adjusts cart quantities to match real-time stock levels during the fetch operation.

### 3. Order & Notification Orchestration
- **Status Orchestration**: Synchronous stock reduction -> Atomic order creation.
- **Non-Blocking Alerts**: A centralized broker simultaneously triggers Push (Firebase), Email (Nodemailer), and In-App History logs without stalling the main thread.
- **Status Management**: Supports `pending`, `confirmed`, `processing`, `shipped`, `delivered`, and `cancelled`.

### 4. Admin Analytics (Aggregation)
- Uses **MongoDB Aggregation Pipelines** for high-performance calculations:
  - **Revenue**: Sums totals of all valid orders using `$match` and `$group`.
  - **Sales Trends**: Groups orders by Date or Month using `$dateToString`.
  - **Performance**: Parallelizes User, Order, and Stock lookups using `Promise.all`.

### 5. Review & Rating System
- **Verified Purchase Gate**: Only users with a `paid`, `shipped`, or `delivered` order for a specific product can leave a review.
- **Dynamic Averaging**: Automatically recalculates the product's overall rating and review count whenever a new review is added.

---

## 🚦 Getting Started (Backend)

1. **Environment**: Create a `.env` file with `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, and `EMAIL_USER`.
2. **Install**: `npm install`
3. **Run**: `npm run dev` (Nodemon) or `npm start` (Node).
4. **API Docs**: Visit `http://localhost:5000/api-docs` to view full Swagger documentation.