import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ChevronRight, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/hooks/useOrders";

interface ProfileOrdersProps {
  orders: Order[];
  isLoading: boolean;
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  paid: "Order Paid",
};

const ProfileOrders = ({ orders, isLoading }: ProfileOrdersProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current");

  const currentOrders = orders.filter((order) =>
    ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "paid"].includes(order.status)
  );

  const orderHistory = orders.filter((order) =>
    ["delivered", "cancelled"].includes(order.status)
  );

  const renderOrderCard = (order: Order) => (
    <Link
      key={order.orderId}
      to={`/order/${order.orderId}`}
      className="block bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-border hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-mono text-sm tracking-[0.15em] text-royal-purple">
              #{order.orderId.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-xs tracking-[0.18em] text-muted-foreground">
              {statusLabels[order.status]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>

            <span className="font-medium text-foreground">
              ₹{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
      </div>
    </Link>
  );

  const renderEmptyState = (message: string) => (
    <div className="text-center py-16">
      <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
      <p className="text-muted-foreground mb-8">{message}</p>

      <Button variant="section" onClick={() => navigate("/products")}>
        Start Shopping
      </Button>
    </div>
  )


  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
        <h2 className=" font-serif text-xl sm:text-2xl md:text-3xl lg:text-center tracking-[0.25em] text-royal-purple mb-10">
          My Orders
        </h2>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
      <style>{`
        @media (max-width: 767px) {
          .tabs-list-mobile {
            display: flex !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            justify-content: flex-start !important;
            scrollbar-width: none;
            -ms-overflow-style: none;
            width: 100% !important;
          }
          .tabs-list-mobile::-webkit-scrollbar { display: none; }
          .tabs-trigger-mobile {
            flex: 0 0 auto !important;
            padding: 8px 12px !important;
            font-size: 11px !important;
            white-space: nowrap !important;
            letter-spacing: 0.12em !important;
          }
        }
      `}</style>
      
      {/* CENTERED HEADING */}
      <h2 className="text-center font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.25em] text-royal-purple mb-10">
        My Orders
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>

        {/* CLEAN RR STYLE TABS */}
        <TabsList className="grid w-full grid-cols-2 mb-10 bg-transparent border-b border-border rounded-none tabs-list-mobile">

          <TabsTrigger
            value="current"
            className="
            font-rr font-light
    px-6 py-2
    tracking-[0.18em] text-sm transition-all

    text-royal-purple/70
    hover:text-royal-purple

    data-[state=active]:bg-royal-purple
    data-[state=active]:text-white
    data-[state=active]:shadow-md
    tabs-trigger-mobile
    "
          >
            Current Orders ({currentOrders.length})
          </TabsTrigger>

          <TabsTrigger
            value="history"
            className="
    px-6 py-2 
    tracking-[0.18em] text-sm transition-all

    text-royal-purple/70
    hover:text-royal-purple

    data-[state=active]:bg-royal-purple
    data-[state=active]:text-white
    data-[state=active]:shadow-md
    tabs-trigger-mobile
    "
          >
            Order History ({orderHistory.length})
          </TabsTrigger>

        </TabsList>

        <TabsContent value="current" className="space-y-4 font-rr font-light">
          {currentOrders.length > 0
            ? currentOrders.map(renderOrderCard)
            : renderEmptyState("No current orders")}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {orderHistory.length > 0
            ? orderHistory.map(renderOrderCard)
            : renderEmptyState("No order history yet")}
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default ProfileOrders;
