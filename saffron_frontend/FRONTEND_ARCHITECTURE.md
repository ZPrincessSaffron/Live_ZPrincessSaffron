# 🎨 Z-Princess Saffron: Frontend Architecture & Workflow

This document provides a comprehensive overview of the frontend development stack, directory structure, and core logic for the Z-Princess Saffron e-commerce platform.

---

## 🛠️ Technology Stack

The frontend is built with a focus on speed, type-safety, and premium aesthetics:
- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Lightning-fast HMR and bundling)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/) (Component primitive library)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Smooth transitions and micro-interactions)
- **State Management**: [React Context API](https://reactjs.org/docs/context.html) (Global auth and theme)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest) (Server state synchronization)
- **Routing**: [React Router Dom v6](https://reactrouter.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) (Validation)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)

---

## 📂 Folder Structure & Workflow

The frontend uses a feature-based organization to remain scalable:

```text
saffron_frontend/src/
├── components/         # Reusable UI elements (Buttons, Inputs, Cards)
│   ├── home/           # Homepage-specific components
│   ├── profile/        # User profile and order components
│   └── ui/             # Shadcn base components
├── contexts/           # Global state (AuthContext, ThemeContext)
├── hooks/              # Custom logic hooks (useOrders, useCart, useToast)
├── pages/              # Main view components (Home, Products, Admin, Auth)
├── lib/                # Utility configurations (utils.ts for tailwind-merge)
├── App.tsx             # Routing and Provider setup
└── main.tsx            # Application entry point
```

### Component Development Workflow:
1. **Context Initialization**: `AuthContext` provides user data and tokens globally.
2. **Hook logic**: `hooks/` (e.g., `useOrders.ts`) manage API calls, loading states, and error toasts.
3. **Atomic Components**: `components/ui/` are small, reusable building blocks.
4. **Composite Components**: Combine UI blocks into feature sections (e.g., `ProfileOrders.tsx`).
5. **Page Assembly**: Pages in `pages/` (e.g., `AdminDashboard.tsx`) assemble components and connect them to hooks.

---

## 🧠 Core Frontend Logic

### 1. Global Authentication (`AuthContext.tsx`)
- Manages login, registration, and logout states.
- Persists user data and JWT tokens in `localStorage`.
- Provides an `admin` flag for conditional routing and UI rendering.

### 2. Specialized Data Hooks
- **`useOrders.ts`**: Centralized logic for fetching order history, creating new orders, and cancelling existing ones. It includes built-in refresh logic to keep the UI in sync after actions.
- **`useCart.ts`**: Manages the shopping cart state, allowing for adding/removing items while communicating with the backend to verify stock levels.

### 3. Premium Admin Dashboard
- **Dynamic Stats**: Fetches real-time store performance data (Total Revenue, Orders, Users) via `fetchStats`.
- **Interactive Charts**: Uses [Recharts](https://recharts.org/) to visualize sales trends.
- **Inventory Control**: A specialized multi-tab interface for bulk stock updates and product CRUD operations.

### 4. User Experience (UX)
- **Responsive Design**: Mobile-first layouts using Tailwind's layout engine.
- **Toast Notifications**: Interactive feedback via `sonner` and `shadcn-toast` for all critical actions (Order success, Auth errors, etc.).
- **Smooth Navigation**: `framer-motion` page transitions and `ScrollToTop` helpers for a professional "single-page app" feel.

---

## 🚦 Getting Started (Frontend)

1. **Environment**: Create a `.env` file with `VITE_API_URL` (pointing to the backend) and `VITE_GOOGLE_CLIENT_ID`.
2. **Install**: `npm install`
3. **Run**: `npm run dev`
4. **Build**: `npm run build` for production-ready assets.
