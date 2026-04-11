import Layout from "@/components/layout/Layout";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Plus, Pencil, Trash2, Upload, X, Menu,
  LayoutDashboard, Boxes, Loader2,
  Users, ShoppingBag, IndianRupee, AlertTriangle, ClipboardList,
   ArrowRight,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  cubicBezier,
  useScroll,
  useSpring,
} from "framer-motion";

const ease   = cubicBezier(0.22, 1, 0.36, 1);

/* ─── SCROLL PROGRESS BAR ─── */
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });
  return (
    <>
      <motion.div style={{ scaleX, transformOrigin: "left" }} className="fixed top-0 left-0 right-0 h-[3px] bg-gold z-50" />
      <motion.div style={{ scaleX, transformOrigin: "left" }} className="fixed top-0 left-0 right-0 h-[3px] bg-gold/30 blur-sm z-50" />
    </>
  );
};

/* ─── FLOATING PARTICLES ─── */
interface ParticleProps { delay: number; x: number; size: number; }
const Particle = ({ delay, x, size }: ParticleProps) => (
  <motion.div
    aria-hidden
    className="absolute rounded-full bg-gold pointer-events-none"
    style={{ left: `${x}%`, bottom: "-10px", width: size, height: size }}
    animate={{ y: [0, -320], opacity: [0, 0.5, 0], scale: [0.5, 1, 0.3] }}
    transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeOut" }}
  />
);
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 18 }).map((_, i) => (
      <Particle key={i} delay={i * 0.4} x={5 + Math.random() * 90} size={2 + Math.random() * 4} />
    ))}
  </div>
);

/* ─── HERO ─── */
const DashboardHero = () => (
  <section className="relative bg-royal-purple-dark text-ivory overflow-hidden min-h-[360px] md:min-h-[420px] flex items-center">
    <motion.div aria-hidden animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.13, 0.07] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold blur-3xl" />
    <motion.div aria-hidden animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gold blur-3xl" />
    <FloatingParticles />
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="relative w-full container mx-auto px-4 md:px-6 lg:px-0 pt-20 pb-16">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mb-6 relative inline-block">
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 rounded-2xl border border-gold/40" />
          <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
            <LayoutDashboard className="w-8 h-8 text-gold" />
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="font-cinzel text-5xl tracking-[0.09em] text-ivory leading-tight mb-5">
          Admin Dashboard
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.7 }} className="w-20 h-px bg-gold/50 mx-auto my-5" />
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }} className="product-desc text-ivory/80 text-[14px] tracking-widest uppercase">
          Z Princess Saffron · Store Management
        </motion.p>
      </div>
    </motion.div>
  </section>
);

/* ─── GLOW CARD ─── */
interface GlowCardProps { children: React.ReactNode; className?: string; }
const GlowCard = ({ children, className = "" }: GlowCardProps) => {
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}
      onMouseMove={(e) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setGlowPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden ${className}`} style={{ isolation: "isolate" }}
    >
      <motion.div aria-hidden animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.25 }} className="pointer-events-none absolute inset-0 z-0"
        style={{ background: `radial-gradient(180px circle at ${glowPos.x}px ${glowPos.y}px, rgba(88,28,135,0.08), transparent 70%)` }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* ─── FORM FIELD ─── */
const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="product-desc text-[11px] font-[400] tracking-[0.2em] uppercase text-royal-purple/60">{label}</label>
    {children}
  </div>
);

const inputCls = "border-gold/20 focus:ring-gold text-royal-purple bg-white font-rr text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
const emptyForm = () => ({ id: Date.now(), name: "", price: "" as string | number, originalPrice: "" as string | number, category: "threads", image: "", tag: "", description: "", stock: 0 });

/* ─── PANEL ─── */
interface PanelProps { icon: React.ReactNode; title: string; children: React.ReactNode; action?: React.ReactNode; }
const Panel = ({ icon, title, children, action }: PanelProps) => (
  <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55, ease }}
    className="rounded-2xl border border-charcoal/10 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-3 bg-royal-purple">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 text-gold">{icon}</div>
        <h2 className="product-title text-[13px] font-[400] tracking-[0.09em] text-ivory uppercase leading-none">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
    <div className="p-4 sm:p-8">{children}</div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════════
   3D CUBOID SIDEBAR
   Three physical faces:
     1) Front face  — glass dark panel with inner shimmer
     2) Right face  — dark extruded slab to the right  (depth illusion)
     3) Bottom face — dark extruded slab below          (depth illusion)
   Hard pixel-offset box-shadow reinforces the depth.
══════════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════════
   FLAT SIDEBAR
   A sleek, modern vertical rectangle that merges with the ivory background.
   Increased width (320px) for a more commanding presence.
══════════════════════════════════════════════════════════════════════ */
interface NavTab { id: string; label: string; icon: React.ReactNode; }
interface FlatSidebarProps {
  tabs: NavTab[];
  tab: string;
  setTab: (t: any) => void;
  setIsSidebarOpen: (v: boolean) => void;
  navigate: (path: string) => void;
  signOut: () => void;
  isMobile?: boolean;
}

const FlatSidebar = ({ tabs, tab, setTab, setIsSidebarOpen, navigate, signOut, isMobile }: FlatSidebarProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, ease }}
    className={`h-full w-[300px] flex flex-col bg-white/95 shadow-2xl border-r border-gold/20 md:bg-ivory/40 md:shadow-none md:border-gold/10 ${isMobile ? "rounded-r-2xl border-l border-gold/20" : ""}`}
    style={{ width: isMobile ? 280 : 320 }}
  >
    {/* ── HEADER ── */}
    <div className="px-3 pt-10 pb-8 relative">
      {isMobile && (
        <button onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center bg-gold/5 border border-gold/10 hover:bg-gold/10 transition-colors">
          <X className="w-4 h-4 text-royal-purple/60" />
        </button>
      )}

      {/* Brand icon - simple and clean */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gold/10 border border-gold/20 shadow-sm">
          <LayoutDashboard className="w-6 h-6 text-gold" />
        </div>
        <div>
          <h2 className="font-cinzel text-[17px] font-medium tracking-[0.12em] text-royal-purple leading-none">Z Princess Saffron</h2>
          <p className="product-desc text-[9px] font-medium tracking-[0.25em] uppercase mt-1.5 text-gold/80">Control Panel</p>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
    </div>

    {/* ── NAV ITEMS ── */}
    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
      {tabs.map((t) => {
        const isActive = tab === t.id;
        return (
          <motion.button
            key={t.id}
            onClick={() => { setTab(t.id); setIsSidebarOpen(false); }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative group 
              ${isActive 
                ? "" 
                : "border border-transparent hover:bg-[#F9F4E3]"
              }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute left-0 top-3 bottom-3 w-1 bg-gold rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className={`transition-colors duration-300 ${isActive ? "text-[#C6A85A]" : "text-gray-600 md:text-royal-purple/40 group-hover:text-gold/60"}`}>
              {t.icon}
            </span>
            <span className={`product-desc text-[13px] tracking-[0.05em] font-[400] transition-colors duration-300 ${
              isActive ? "text-royal-purple" : "text-gray-700 md:text-royal-purple/50 group-hover:text-royal-purple/80"
            }`}>
              {t.label}
            </span>
            {isActive && (
              <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="ml-auto">
                <ArrowRight className="w-3.5 h-3.5 text-gold/40" />
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </nav>

    {/* ── FOOTER ── */}
    {/* ── FOOTER ── */}
<div className="p-6 mt-auto space-y-2 border-t border-gold/5 bg-gold/3">

  {/* Storefront */}
  <Button
    variant="section"
    onClick={() => navigate("/")}
    className="w-[30px] h-[35px] "
    
  >
    
    Storefront
  </Button>

  {/* Logout */}
  <Button
    variant="section"
    onClick={() => { signOut(); navigate("/auth"); }}
    className=" w-[20px] h-[35px]"
  >
    
    Logout
  </Button>

</div>
  </motion.div>
);


/* ═══════════════════════
   TYPES
═══════════════════════ */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = `${BASE_URL}/products`;

interface Product {
  _id: string; id: number; name: string; price: number;
  originalPrice?: number; category: string; image: string;
  tag?: string; description: string; stock: number;
  rating?: number; reviews?: number;
}
type TabId = "dashboard" | "add" | "update" | "delete" | "stock" | "orders";
interface Stats { totalUsers: number; totalOrders: number; totalRevenue: number; lowStockCount: number; lowStockProducts: any[]; }
interface SalesData {
  daily: { date: string; revenue: number; orders: number }[];
  monthly: { month: string; revenue: number; orders: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
}

/* ═══════════════════════
   MAIN COMPONENT
═══════════════════════ */
const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabId>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [addData, setAddData] = useState(emptyForm());
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [stockSaving, setStockSaving] = useState(false);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  const [stats, setStats] = useState<Stats | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesPeriod, setSalesPeriod] = useState<"daily" | "monthly">("daily");
  const [chartMetric, setChartMetric] = useState<"revenue" | "orders">("revenue");

  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setListLoading(true);
    try { const res = await fetch(API); const data: Product[] = await res.json(); setProducts(data); const sm: Record<string, number> = {}; data.forEach((p) => { sm[p._id] = p.stock ?? 0; }); setStockMap(sm); }
    catch { toast({ title: "Error", description: "Could not load products", variant: "destructive" }); }
    finally { setListLoading(false); }
  }, [toast]);

  const fetchStats = useCallback(async () => {
    if (!user?.token) return; setStatsLoading(true);
    try { const res = await fetch(`${BASE_URL}/admin/stats`, { headers: { Authorization: `Bearer ${user.token}` } }); if (!res.ok) throw new Error(); setStats(await res.json()); }
    catch { toast({ title: "Error", description: "Could not load stats", variant: "destructive" }); }
    finally { setStatsLoading(false); }
  }, [toast, user]);

  const fetchSales = useCallback(async () => {
    if (!user?.token) return; setSalesLoading(true);
    try { const res = await fetch(`${BASE_URL}/admin/sales-report`, { headers: { Authorization: `Bearer ${user.token}` } }); if (!res.ok) throw new Error(); setSalesData(await res.json()); }
    catch { toast({ title: "Error", description: "Could not load sales report", variant: "destructive" }); }
    finally { setSalesLoading(false); }
  }, [toast, user]);

  const fetchAllOrders = useCallback(async () => {
    if (!user?.token) return; setOrdersLoading(true);
    try { const res = await fetch(`${BASE_URL}/admin/orders`, { headers: { Authorization: `Bearer ${user.token}` } }); const data = await res.json(); if (res.ok) setAllOrders(data); }
    catch { toast({ title: "Error", description: "Could not load orders", variant: "destructive" }); }
    finally { setOrdersLoading(false); }
  }, [user, toast]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setStatusUpdating(orderId);
    try {
      const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/status`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ status: newStatus }) });
      if (!res.ok) throw new Error();
      setAllOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)));
      toast({ title: "✅ Status Updated", description: `Order #${orderId} → ${newStatus}` });
    } catch { toast({ title: "Error", description: "Could not update status", variant: "destructive" }); }
    finally { setStatusUpdating(null); }
  };

  useEffect(() => {
    if (tab === "dashboard") { fetchStats(); fetchSales(); }
    if (tab === "delete" || tab === "stock" || tab === "update") fetchProducts();
    if (tab === "orders") fetchAllOrders();
  }, [tab, fetchProducts, fetchStats, fetchSales, fetchAllOrders]);

  if (!user || user.isAdmin !== true) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-ivory">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 p-12 rounded-2xl border border-charcoal/10 bg-white shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-100 mx-auto"><AlertTriangle className="w-8 h-8 text-red-400" /></div>
            <h1 className="font-cinzel text-2xl tracking-[0.09em] text-royal-purple">Access Denied</h1>
            <div className="w-12 h-px bg-gold/50 mx-auto" />
            <p className="product-desc text-[13px] text-royal-purple/60 tracking-[0.05em]">You do not have permission to access this area.</p>
            <Button variant="royal" onClick={() => navigate("/")} className="tracking-widest uppercase text-xs px-8">Go Home</Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void, preview: (v: string | null) => void) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "File too large", description: "Max 2 MB", variant: "destructive" }); return; }
    const reader = new FileReader();
    reader.onloadend = () => { const b64 = reader.result as string; setter(b64); preview(b64); };
    reader.readAsDataURL(file);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setAddLoading(true);
    try {
      const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ ...addData, id: Number(addData.id), price: Number(addData.price), originalPrice: addData.originalPrice ? Number(addData.originalPrice) : undefined, stock: Number(addData.stock) }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || "Failed to add product");
      toast({ title: "✅ Product Added", description: `${addData.name} saved successfully.` }); setAddData(emptyForm()); setAddImagePreview(null);
    } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    finally { setAddLoading(false); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editProduct) return; setUpdateLoading(true);
    try {
      const res = await fetch(`${API}/${editProduct._id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ ...editProduct, price: Number(editProduct.price), originalPrice: editProduct.originalPrice ? Number(editProduct.originalPrice) : undefined, stock: Number(editProduct.stock) }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || "Failed to update");
      toast({ title: "✅ Product Updated", description: `${editProduct.name} updated.` }); setEditProduct(data);
    } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    finally { setUpdateLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${user?.token}` } });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || "Failed to delete");
      toast({ title: "🗑️ Product Deleted", description: data.message }); setDeleteId(null);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
  };

  const handleSaveStock = async () => {
    setStockSaving(true);
    try { await Promise.all(products.map((p) => fetch(`${API}/${p._id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ stock: stockMap[p._id] ?? 0 }) }))); toast({ title: "✅ Stock Updated", description: "All stock levels saved." }); }
    catch { toast({ title: "Error", description: "Some stock updates failed.", variant: "destructive" }); }
    finally { setStockSaving(false); }
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Overview",      icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "orders",    label: "Orders",         icon: <ClipboardList   className="w-4 h-4" /> },
    { id: "add",       label: "Add Product",    icon: <Plus            className="w-4 h-4" /> },
    { id: "update",    label: "Update Product", icon: <Pencil          className="w-4 h-4" /> },
    { id: "delete",    label: "Delete Product", icon: <Trash2          className="w-4 h-4" /> },
    { id: "stock",     label: "Manage Stock",   icon: <Boxes           className="w-4 h-4" /> },
  ];

  const ImageUploader = ({ preview, onFile, onRemove, required = false }: { preview: string | null; onFile: (e: React.ChangeEvent<HTMLInputElement>) => void; onRemove: () => void; required?: boolean }) => (
    <div className="border-2 max-w-xs mx-auto border-dashed border-gold/20 rounded-xl p-8 text-center bg-gold/[0.02]">
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} className="h-40 w-40 object-cover rounded-lg border border-gold/20 shadow" />
          <button type="button" onClick={onRemove} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"><X className="w-3 h-3" /></button>
        </div>
      ) : (
        <div className="space-y-3">

  {/* Clickable Upload Bar */}
  <div
    onClick={() => document.getElementById("fileUpload")?.click()}
    className="cursor-pointer flex items-center justify-between px-4 py-3 rounded-xl border border-gold/20 bg-white hover:border-gold/40 hover:bg-gold/5 transition-all"
  >
    <div className="flex items-center gap-2">
      <Upload className="w-4 h-4 text-gold" />
      <span className="text-[11px] tracking-widest uppercase text-royal-purple/60">
        Select Image
      </span>
    </div>

    <span className="text-[10px] font-[400] text-gold/70">
      BROWSE
    </span>
  </div>

  {/* Hidden Input */}
  <input
    id="fileUpload"
    type="file"
    accept="image/*"
    onChange={onFile}
    required={required}
    className="hidden"
  />

  {/* Helper Text */}
  <p className="text-[10px] text-royal-purple/60 font-medium ">
    PNG, JPG up to 2 MB
  </p>

</div>
      )}
    </div>
  );

  const allStatuses = ["pending","confirmed","processing","shipped","out_for_delivery","delivered","cancelled"];
  const statusColors: Record<string, string> = {
    pending: "bg-gray-50 text-gray-600 border-gray-200",
    confirmed: "bg-blue-50 text-blue-600 border-blue-200",
    processing: "bg-amber-50 text-amber-600 border-amber-200",
    shipped: "bg-purple-50 text-purple-600 border-purple-200",
    out_for_delivery: "bg-orange-50 text-orange-600 border-orange-200",
    delivered: "bg-green-50 text-green-600 border-green-200",
    cancelled: "bg-red-50 text-red-500 border-red-200",
  };

  return (
    <Layout>
      <ScrollProgressBar />
      <div className="min-h-screen bg-ivory overflow-x-hidden">

        <DashboardHero />

        {/* ── BODY — between hero and Layout footer ── */}
        <section className="py-14">
          <div className="container mx-auto px-4 md:px-6 lg:px-0">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

              {/* ── Mobile overlay ── */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[60] lg:hidden" />
                )}
              </AnimatePresence>

              {/* ── Mobile toggle button ── */}
              <div className="lg:hidden mb-2">
                <motion.button whileTap={{ scale: 0.93 }} onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-ivory"
                  style={{ background: "linear-gradient(135deg,#2e0b54,#1c0638)", border: "1px solid rgba(212,175,55,0.25)", boxShadow: "4px 4px 0 #08010f, 0 12px 30px rgba(88,28,135,0.4)" }}>
                  <Menu className="w-4 h-4 text-gold" />
                  <span className="product-desc text-[11px] tracking-widest uppercase">Menu</span>
                </motion.button>
              </div>

              {/* ── Mobile drawer ── */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    className="fixed inset-y-0 left-0 z-[70] lg:hidden flex items-start"
                    initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <FlatSidebar tabs={tabs} tab={tab} setTab={setTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} signOut={signOut} isMobile />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Desktop sticky sidebar ── */}
              <div
                className="hidden lg:block shrink-0 self-start sticky top-8 h-[calc(100vh-140px)]"
                style={{ width: 320 }}
              >
                <FlatSidebar tabs={tabs} tab={tab} setTab={setTab} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} signOut={signOut} />
              </div>

              {/* ── MAIN PANEL ── */}
              <main className="flex-1 min-w-0">
                <AnimatePresence mode="wait">

                  {/* ═══ DASHBOARD ═══ */}
                  {tab === "dashboard" && (
                    <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }} className="space-y-8">
                      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {[
                          { label: "Total Users",    value: stats?.totalUsers ?? 0,                            icon: <Users className="w-5 h-5" />,        color: "bg-blue-50 text-blue-600",   border: "border-blue-100/80" },
                          { label: "Total Orders",   value: stats?.totalOrders ?? 0,                           icon: <ShoppingBag className="w-5 h-5" />,   color: "bg-green-50 text-green-600", border: "border-green-100/80" },
                          { label: "Total Revenue",  value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: <IndianRupee className="w-5 h-5" />,   color: "bg-amber-50 text-amber-600", border: "border-amber-100/80" },
                          { label: "Low Stock Items",value: stats?.lowStockCount ?? 0,                         icon: <AlertTriangle className="w-5 h-5" />, color: "bg-red-50 text-red-500",     border: "border-red-100/80", alert: (stats?.lowStockCount ?? 0) > 0 },
                        ].map((stat, i) => (
                          <motion.div key={i}
                            variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                            whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(0,0,0,0.09)" }}
                            className={`rounded-2xl border ${stat.border} bg-white p-6 shadow-sm transition-shadow duration-500 relative overflow-hidden`}>
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                              {(stat as any).alert && <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[9px] font-bold uppercase tracking-wider animate-pulse"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Action</span>}
                            </div>
                            <p className="product-desc text-[10px] font-[400] tracking-[0.18em] uppercase text-royal-purple/80 mb-1">{stat.label}</p>
                            <h3 className="font-sans text-lg font-medium text-royal-purple">{statsLoading ? "…" : stat.value}</h3>
                          </motion.div>
                        ))}
                      </motion.div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 rounded-3xl border border-gold/10 bg-ivory/60 backdrop-blur-md p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                          {/* HEADER */}
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="product-title font-[400] text-[18px] tracking-[0.08em] text-royal-purple uppercase">
                              Sales Performance
                            </h2>
                            <div className="flex bg-white/60 border border-gold/10 p-1 rounded-xl shadow-sm">
                              {(["revenue", "orders"] as const).map((m) => (
                                <button
                                  key={m}
                                  onClick={() => setChartMetric(m)}
                                  className={`px-3 py-1.5 text-[10px] uppercase rounded-md tracking-widest transition ${
                                    chartMetric === m
                                      ? "bg-white text-gold shadow-sm font-bold"
                                      : "text-royal-purple/40"
                                  }`}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* CONTROLS */}
                          <div className="flex items-center gap-6 mb-6">
                            <div className="flex bg-white/60 border border-gold/10 p-1 rounded-xl shadow-sm">
                              {(["daily", "monthly"] as const).map((p) => (
                                <button
                                  key={p}
                                  onClick={() => setSalesPeriod(p)}
                                  className={`px-4 py-1.5 text-[10px] uppercase rounded-md tracking-widest transition ${
                                    salesPeriod === p
                                      ? "bg-white text-gold shadow-sm font-bold"
                                      : "text-royal-purple/40"
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                            {/* AVG ORDER */}
                            <div className="ml-auto hidden sm:block text-right">
                              <p className="product-desc text-[9px] tracking-widest uppercase text-royal-purple/80">
                                Avg. Order Value
                              </p>
                              <p className="font-cinzel text-sm text-royal-purple">
                                ₹{stats?.totalOrders
                                  ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString()
                                  : "0"}
                              </p>
                            </div>
                          </div>
                          {/* CHART */}
                          <div className="h-56 overflow-x-auto">
                            {salesLoading ? (
                              <div className="h-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-gold" />
                              </div>
                            ) : (
                              (() => {
                                const rawData =
                                  (salesPeriod === "daily"
                                    ? salesData?.daily
                                    : salesData?.monthly) ?? [];
                                const data: any[] = [];
                                const now = new Date();
                                // GAP FILL
                                if (salesPeriod === "daily") {
                                  for (let i = 6; i >= 0; i--) {
                                    const d = new Date(now);
                                    d.setDate(d.getDate() - i);
                                    const ds = `${d.getFullYear()}-${String(
                                      d.getMonth() + 1
                                    ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                                    data.push(
                                      rawData.find((x: any) => x.date === ds) || {
                                        date: ds,
                                        revenue: 0,
                                        orders: 0,
                                      }
                                    );
                                  }
                                } else {
                                  for (let i = 11; i >= 0; i--) {
                                    const d = new Date(
                                      now.getFullYear(),
                                      now.getMonth() - i,
                                      1
                                    );
                                    const ms = `${d.getFullYear()}-${String(
                                      d.getMonth() + 1
                                    ).padStart(2, "0")}`;
                                    data.push(
                                      rawData.find((x: any) => x.month === ms) || {
                                        month: ms,
                                        revenue: 0,
                                        orders: 0,
                                      }
                                    );
                                  }
                                }
                                const getValue = (d: any) =>
                                  chartMetric === "revenue" ? d.revenue : d.orders;
                                const maxVal = Math.max(
                                  ...data.map(getValue),
                                  chartMetric === "revenue" ? 1000 : 50
                                );
                                return (
                                  <div className="relative h-full flex flex-col overflow-visible pt-4 pb-2">
                                    <div className="flex-1 relative flex items-end justify-between h-full min-w-[440px] gap-4 bg-white/40 rounded-2xl pt-16 p-6 pl-14 border border-gold/10 overflow-visible">
                                      {/* GRID LINES & Y-AXIS (Floating Left) */}
                                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pt-6 pb-6 pl-2 pr-6">
                                        {(chartMetric === "revenue" ? [100, 75, 50, 25, 0] : [50, 40, 30, 20, 10, 0]).map((v) => (
                                          <div key={v} className="flex items-center gap-3 w-full h-0">
                                            <span className="text-[9px] text-royal-purple/60 w-9 text-right font-bold translate-y-[-1px]">
                                              {v}{chartMetric === "revenue" ? "%" : ""}
                                            </span>
                                            <div className="border-t border-gold/10 flex-1" />
                                          </div>
                                        ))}
                                      </div>

                                      {/* BARS */}
                                      {data.map((d: any, i) => {
                                        const val = getValue(d);
                                        const h = (val / maxVal) * 80;
                                        return (
                                          <div
                                            key={i}
                                            className="flex-1 h-full flex flex-col items-center justify-end group relative z-10"
                                          >
                                            {/* TOOLTIP */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-royal-purple text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20 shadow-xl border border-gold/30">
                                              {chartMetric === "revenue" ? "₹" : ""}
                                              {val.toLocaleString()}
                                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-royal-purple border-r border-b border-gold/30" />
                                            </div>
                                            {/* BAR */}
                                            <motion.div
                                              initial={{ height: 0 }}
                                              animate={{ height: `${h}%` }}
                                              transition={{ duration: 0.9, ease: "circOut" }}
                                              className={`w-4 mx-auto ${
                                                val > 0
                                                  ? chartMetric === "revenue"
                                                    ? "bg-gradient-to-t from-[#C6A85A] to-[#E5C97A]"
                                                    : "bg-gradient-to-t from-royal-purple/60 to-royal-purple/30"
                                                  : "bg-ivory/40"
                                              } rounded-lg shadow-sm`}
                                            />
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* X-AXIS LABELS (DATES) - Aligned below the grid box */}
                                    <div className="flex justify-between min-w-[440px] gap-4 pl-[78px] pr-9 pt-4 overflow-visible">
                                      {data.map((d, i) => (
                                        <span
                                          key={i}
                                          className="flex-1 text-center product-desc text-[9px] font-bold tracking-wide text-royal-purple/60 uppercase"
                                        >
                                          {salesPeriod === "daily"
                                            ? new Date(d.date).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                              })
                                            : new Date(d.month + "-01").toLocaleDateString(
                                                "en-IN",
                                                { month: "short" }
                                              )}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()
                            )}
                          </div>
                          {/* TOP SELLING */}
                          <div className="mt-10 pt-6">
                            <p className="product-desc text-[11px] tracking-[0.2em] font-medium uppercase text-royal-purple/90 font-[400] mb-4 flex items-center gap-2">
                            Top Selling Products
                            </p>
                            <div className="space-y-4">
                              {salesData?.topProducts?.slice(0, 5).map((p, i) => {
                                const maxQ = Math.max(
                                  ...(salesData?.topProducts?.map((x) => x.quantity) ?? []),
                                  1
                                );
                                return (
                                  <div key={i}>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <p className="product-desc text-[12px] font-[400] text-royal-purple truncate max-w-[200px]">
                                        {p.name}
                                      </p>
                                      <p className="product-desc text-[10px] text-royal-purple/80">
                                        ₹{p.revenue.toLocaleString()} · {p.quantity} units
                                      </p>
                                    </div>
                                    <div className="h-1 w-full bg-ivory rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.quantity / maxQ) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full bg-gold/60"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-charcoal/10 bg-white shadow-sm overflow-hidden">
                          <div className="flex items-center gap-3 px-6 py-3 bg-royal-purple">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <h2 className="product-title text-[13px] font-[400] tracking-[0.09em] text-ivory uppercase leading-none">Low Stock</h2>
                          </div>
                          <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto">
                            {stats?.lowStockProducts?.length === 0 && <p className="product-desc text-[12px] text-royal-purple/40 text-center py-8">All products well stocked.</p>}
                            {stats?.lowStockProducts?.map((p: any) => (
                              <motion.div key={p.id} whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }} className="flex items-center gap-3 p-4 rounded-xl border border-red-100/60 bg-red-50/30">
                                <div className="flex-1 min-w-0">
                                  <p className="product-desc text-[12px] font-[400] text-royal-purple truncate">{p.name}</p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-600 uppercase tracking-wider mt-1">Stock: {p.stock}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ═══ ADD ═══ */}
                  {tab === "add" && (
                    <motion.div key="add" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                      <Panel icon={<Plus className="w-4 h-4 text-gold" />} title="Add New Product">
                        <form onSubmit={handleAdd} className="space-y-8">
                          <div className="grid md:grid-cols-2 gap-6">
                            <FormField label="Product Name"><Input value={addData.name} onChange={(e) => setAddData((p) => ({ ...p, name: e.target.value }))} required className={inputCls} /></FormField>
                            <FormField label="Category">
                              <Select 
                                value={addData.category} 
                                onValueChange={(v) => setAddData((p) => ({ ...p, category: v }))}
                              >
                                <SelectTrigger className={inputCls}>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="threads">Threads</SelectItem>
                                  <SelectItem value="powder">Powder</SelectItem>
                                  <SelectItem value="gift">Gift</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormField>
                            <FormField label="Price (₹)"><Input type="number" value={addData.price === 0 ? "" : addData.price} onChange={(e) => setAddData((p) => ({ ...p, price: e.target.value === "" ? 0 : Number(e.target.value) }))} required className={inputCls} /></FormField>
                            <FormField label="Original Price (₹)"><Input type="number" value={addData.originalPrice} onChange={(e) => setAddData((p) => ({ ...p, originalPrice: e.target.value }))} className={inputCls} /></FormField>
                            <FormField label="Tag"><Input value={addData.tag} onChange={(e) => setAddData((p) => ({ ...p, tag: e.target.value }))} className={inputCls} placeholder="e.g. Best Seller" /></FormField>
                            <FormField label="Stock"><Input type="number" value={addData.stock === 0 ? "" : addData.stock} onChange={(e) => setAddData((p) => ({ ...p, stock: e.target.value === "" ? 0 : Number(e.target.value) }))} className={inputCls} min={0} /></FormField>
                          </div>
                          <FormField label="Product Image"><ImageUploader preview={addImagePreview} onFile={(e) => handleImageChange(e, (v) => setAddData((p) => ({ ...p, image: v })), setAddImagePreview)} onRemove={() => { setAddData((p) => ({ ...p, image: "" })); setAddImagePreview(null); }} required /></FormField>
                          <FormField label="Description"><Textarea value={addData.description} onChange={(e) => setAddData((p) => ({ ...p, description: e.target.value }))} required className={`min-h-[120px] ${inputCls}`} /></FormField>
                          <div className="flex justify-center pt-2">
                            <Button variant="royal" type="submit" disabled={addLoading} className="px-10 tracking-widest uppercase text-xs">{addLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save Product"}</Button>
                          </div>
                        </form>
                      </Panel>
                    </motion.div>
                  )}

                  {/* ═══ UPDATE ═══ */}
                  {tab === "update" && (
                    <motion.div key="update" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                      <Panel icon={<Pencil className="w-4 h-4 text-gold" />} title={editProduct ? "Edit Product" : "Update Product"}
                        action={editProduct ? <button onClick={() => { setEditProduct(null); setEditImagePreview(null); }} className="flex items-center gap-1.5 product-desc text-[10px] tracking-widest uppercase text-ivory/70 hover:text-gold transition-colors"><X className="w-3 h-3" /> Back</button> : undefined}>
                        {!editProduct ? (
                          listLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div> :
                          products.length === 0 ? <p className="product-desc text-center text-[13px] text-royal-purple/40 py-16">No products found.</p> : (
                            <div className="space-y-3">
                              {products.map((p) => (
                                <GlowCard key={p._id}>
                                  <motion.div whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.06)" }} className="flex items-center justify-between gap-4 p-4 border border-gold/10 rounded-xl hover:border-gold/25 transition-colors">
                                    <div className="flex-1 min-w-0 pr-2">
                                      <p className="product-desc text-[13px] font-[400] text-royal-purple whitespace-normal sm:truncate leading-snug">{p.name}</p>
                                      <p className="product-desc text-[11px] font-[400] text-royal-purple/40 mt-0.5 tracking-wide truncate">₹{p.price.toLocaleString()} · {p.category} · Stock: {p.stock ?? 0}</p>
                                    </div>
                                    <Button variant="section" onClick={() => { setEditProduct(p); setEditImagePreview(p.image?.startsWith("data:") ? p.image : null); }} className="w-auto min-w-[70px] md:w-20 h-8 px-3 text-[10px] md:text-[11px] uppercase shrink-0">Edit</Button>
                                  </motion.div>
                                </GlowCard>
                              ))}
                            </div>
                          )
                        ) : (
                          <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                              <FormField label="Product Name"><Input value={editProduct.name} onChange={(e) => setEditProduct((p) => p && { ...p, name: e.target.value })} required className={inputCls} /></FormField>
                              <FormField label="Category">
                                <Select 
                                  value={editProduct.category} 
                                  onValueChange={(v) => setEditProduct((p) => p && { ...p, category: v })}
                                >
                                  <SelectTrigger className={inputCls}>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="threads">Threads</SelectItem>
                                    <SelectItem value="powder">Powder</SelectItem>
                                    <SelectItem value="gift">Gift</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormField>
                              <FormField label="Price (₹)"><Input type="number" value={editProduct.price === 0 ? "" : editProduct.price} onChange={(e) => setEditProduct((p) => p && { ...p, price: e.target.value === "" ? 0 : Number(e.target.value) })} required className={inputCls} /></FormField>
                              <FormField label="Original Price (₹)"><Input type="number" value={editProduct.originalPrice ?? ""} onChange={(e) => setEditProduct((p) => p && { ...p, originalPrice: Number(e.target.value) })} className={inputCls} /></FormField>
                              <FormField label="Tag"><Input value={editProduct.tag ?? ""} onChange={(e) => setEditProduct((p) => p && { ...p, tag: e.target.value })} className={inputCls} /></FormField>
                              <FormField label="Stock"><Input type="number" value={editProduct.stock === 0 ? "" : editProduct.stock} onChange={(e) => setEditProduct((p) => p && { ...p, stock: e.target.value === "" ? 0 : Number(e.target.value) })} className={inputCls} min={0} /></FormField>
                            </div>
                            <FormField label="Product Image">
                              <ImageUploader preview={editImagePreview} onFile={(e) => handleImageChange(e, (v) => setEditProduct((p) => p && { ...p, image: v }), setEditImagePreview)} onRemove={() => { setEditProduct((p) => p && { ...p, image: "" }); setEditImagePreview(null); }} />
                              {editProduct.image && !editImagePreview && (
                                <div className="mt-3 flex items-center gap-3">
                                  <img src={editProduct.image} className="w-16 h-16 object-cover rounded-lg border border-gold/20" />
                                  <p className="product-desc text-[11px] text-royal-purple/50">Current image (upload above to replace)</p>
                                </div>
                              )}
                            </FormField>
                            <FormField label="Description"><Textarea value={editProduct.description} onChange={(e) => setEditProduct((p) => p && { ...p, description: e.target.value })} required className={`min-h-[120px] ${inputCls}`} /></FormField>
                            <div className="flex justify-end">
                              <Button variant="royal" type="submit" disabled={updateLoading} className="w-[10px] uppercase text-xs">{updateLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save Changes"}</Button>
                            </div>
                          </form>
                        )}
                      </Panel>
                    </motion.div>
                  )}

                  {/* ═══ DELETE ═══ */}
                  {tab === "delete" && (
                    <motion.div key="delete" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                      <Panel icon={<Trash2 className="w-4 h-4 text-red-400" />} title="Delete Product"
                        action={<button onClick={fetchProducts} disabled={listLoading} className="product-desc text-[10px] tracking-widest uppercase text-ivory/70 hover:text-gold transition-colors">{listLoading ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Refresh"}</button>}>
                        {listLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div> :
                         products.length === 0 ? <p className="product-desc text-center text-[13px] text-royal-purple/40 py-16">No products found.</p> : (
                          <div className="space-y-3">
                            {products.map((p) => (
                              <motion.div key={p._id} whileHover={{ y: -2 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gold/10 rounded-xl hover:border-gold/25 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="product-desc text-[13px] font-[400] text-royal-purple truncate">{p.name}</p>
                                  <p className="product-desc text-[11px] font-[400] text-royal-purple/40 mt-0.5">ID: {p.id} · ₹{p.price.toLocaleString()} · Stock: {p.stock ?? 0}</p>
                                </div>
                                {deleteId === p._id ? (
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="product-desc text-[11px] text-red-500 tracking-wide">Confirm?</span>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)} className="text-[11px] h-8 tracking-wide">Yes, Delete</Button>
                                    <Button size="sm" variant="outline" onClick={() => setDeleteId(null)} className="text-[11px] h-8">Cancel</Button>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => setDeleteId(p._id)} className="shrink-0 border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 gap-1.5 text-[11px] tracking-wide">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                  </Button>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </Panel>
                    </motion.div>
                  )}

                  {/* ═══ ORDERS ═══ */}
                  {tab === "orders" && (
                    <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                      <Panel icon={<ClipboardList className="w-4 h-4 text-gold" />} title="Order Management"
                        action={<button onClick={fetchAllOrders} disabled={ordersLoading} className="product-desc text-[10px] tracking-widest uppercase text-ivory/70 hover:text-gold transition-colors">{ordersLoading ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Refresh"}</button>}>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {["all", ...allStatuses].map((s) => (
                            <motion.button key={s} whileHover={{ y: -1 }} onClick={() => setOrderFilter(s)}
                              className={`px-3 py-1 rounded-full product-desc font-medium text-[10px] uppercase tracking-widest border transition-all ${orderFilter === s ? "bg-royal-purple text-ivory border-royal-purple shadow-sm" : "border-gold/20 text-royal-purple/60 hover:border-gold/40 hover:text-royal-purple"}`}>
                              {s === "all" ? `All (${allOrders.length})` : s.replace("_", " ")}
                            </motion.button>
                          ))}
                        </div>
                        {ordersLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div> :
                         (allOrders.filter((o) => orderFilter === "all" || o.status === orderFilter)).length === 0 ? <p className="product-desc text-center text-[13px] text-royal-purple/40 py-16">No orders found.</p> : (
                          <div className="space-y-3">
                            {(allOrders.filter((o) => orderFilter === "all" || o.status === orderFilter)).map((order) => (
                              <div key={order.orderId} className="border border-gold/10 rounded-xl overflow-hidden hover:border-gold/25 transition-colors">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                      <p className="product-desc text-[13px] font-[400] text-royal-purple">#{order.orderId}</p>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full product-desc text-[9px] font-bold border uppercase tracking-widest ${statusColors[order.status] || "bg-gray-50 text-gray-500 border-gray-200"}`}>{order.status?.replace("_", " ")}</span>
                                    </div>
                                    <p className="product-desc text-[11px]  font-[400] text-royal-purple/40 mt-1 break-words tracking-wide">{order.user?.fullName || "—"} · {order.user?.email || "—"} · ₹{order.total?.toLocaleString()} · {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                                  </div>
                                  <div className="shrink-0 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                                    <Select 
                                      value={order.status} 
                                      onValueChange={(v) => handleStatusUpdate(order.orderId, v)}
                                      disabled={statusUpdating === order.orderId}
                                    >
                                      <SelectTrigger className="h-9 w-20 sm:w-[140px] border-gold/20 bg-white text-royal-purple text-[12px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {allStatuses.map((s) => (
                                          <SelectItem key={s} value={s}>
                                            {s.replace("_", " ")}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {statusUpdating === order.orderId && <Loader2 className="w-3 h-3 animate-spin inline ml-2 text-gold" />}
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {expandedOrder === order.orderId && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="border-t border-gold/10 bg-ivory/30 px-6 py-6 grid md:grid-cols-2 gap-6 overflow-hidden">
                                      <div>
                                        <p className="product-desc text-[10px] font-[400] tracking-[0.2em] uppercase text-royal-purple/40 mb-3">Customer & Address</p>
                                        <div className="space-y-1.5 product-desc text-[12px] text-royal-purple/80">
                                          <p><span className="text-royal-purple/40">Name: </span>{order.shippingDetails?.name}</p>
                                          <p><span className="text-royal-purple/40">Phone: </span>{order.shippingDetails?.phone}</p>
                                          <p><span className="text-royal-purple/40">Email: </span>{order.user?.email || order.shippingDetails?.email}</p>
                                          <p><span className="text-royal-purple/40">Address: </span>{order.shippingDetails?.address}, {order.shippingDetails?.city}, {order.shippingDetails?.state} – {order.shippingDetails?.pincode}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="product-desc text-[10px] font-[400] tracking-[0.2em] uppercase text-royal-purple/40 mb-3">Items & Payment</p>
                                        <div className="space-y-2">
                                          {order.items?.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between product-desc text-[12px] text-royal-purple/80">
                                              <span>{item.product_name} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                          ))}
                                          <div className="border-t border-gold/10 pt-2 flex justify-between product-desc text-[13px] font-[500] text-royal-purple"><span>Total</span><span>₹{order.total?.toLocaleString()}</span></div>
                                          <p className="product-desc text-[11px] font-[400]  text-royal-purple/40 mt-1">Payment: {order.paymentMethod} {order.razorpayOrderId ? `· Razorpay: ${order.razorpayOrderId}` : ""}</p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        )}
                      </Panel>
                    </motion.div>
                  )}

                  {/* ═══ STOCK ═══ */}
                  {tab === "stock" && (
                    <motion.div key="stock" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                      <Panel icon={<Boxes className="w-4 h-4 text-gold" />} title="Manage Stock"
                        action={
                          <div className="flex items-center gap-3">
                            <button onClick={fetchProducts} disabled={listLoading} className="product-desc text-[10px] tracking-widestfont-medium  uppercase text-white hover:text-gold font-medium transition-colors">{listLoading ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Refresh"}</button>
                            <button onClick={handleSaveStock} disabled={stockSaving || listLoading} className="product-desc text-[10px] font-medium tracking-widest uppercase text-white hover:text-gold font-medium transition-colors">{stockSaving ? <><Loader2 className="w-3 h-3 animate-spin inline mr-1" />Saving…</> : "Save"}</button>
                          </div>
                        }>
                        {listLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div> :
                         products.length === 0 ? <p className="product-desc text-center text-[13px] text-royal-purple/40 py-16">No products found.</p> : (
                          <>
                            <div className="space-y-3">
                              {products.map((p) => (
                                <motion.div key={p._id} whileHover={{ y: -2 }} className="flex items-center gap-4 p-4 border border-gold/10 rounded-xl hover:border-gold/25 transition-colors">
                                  <div className="flex-1 min-w-0">
                                    <p className="product-desc text-[13px] font-[400] text-royal-purple truncate">{p.name}</p>
                                    <p className="product-desc text-[11px] font-[400] text-royal-purple/40 mt-0.5">₹{p.price.toLocaleString()} · {p.category}</p>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <label className="product-desc text-[10px] font-[400] uppercase tracking-widest text-royal-purple/50">Stock</label>
                                    <Input type="number" min={0} value={(stockMap[p._id] ?? p.stock) === 0 ? "" : (stockMap[p._id] ?? p.stock)} onChange={(e) => setStockMap((m) => ({ ...m, [p._id]: e.target.value === "" ? 0 : Number(e.target.value) }))} className={`w-10 text-center ${inputCls}`} />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            <div className="flex justify-center mt-8 pt-6 border-t border-gold/10">
                              <Button variant="royal" onClick={handleSaveStock} disabled={stockSaving} className="px-5 uppercase text-xs">{stockSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save All Stock"}</Button>
                            </div>
                          </>
                        )}
                      </Panel>
                    </motion.div>
                  )}

                </AnimatePresence>
              </main>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default AdminDashboard;
