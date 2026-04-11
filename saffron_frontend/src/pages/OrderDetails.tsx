import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, Phone, Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders, Order, OrderStatus } from "@/hooks/useOrders";

const statusSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "pending", label: "Order Placed", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle },
  { status: "processing", label: "Processing", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle },
];

const getStatusIndex = (status: OrderStatus): number => {
  if (status === "cancelled") return -1;
  // Map "paid" to "confirmed" for backward compatibility or if backend still uses it
  const effectiveStatus = status === "paid" ? "confirmed" : status;
  return statusSteps.findIndex((step) => step.status === effectiveStatus);
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const { fetchOrderWithItems, cancelOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        const data = await fetchOrderWithItems(orderId);
        setOrder(data);
      }
      setIsLoading(false);
    };
    loadOrder();
  }, [orderId, fetchOrderWithItems]);

  const handleCancel = async () => {
    if (!order || isCancelling) return;
    setIsCancelling(true);
    const success = await cancelOrder(order.orderId);
    if (success) {
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
    }
    setIsCancelling(false);
  };

  if (!user) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-ivory min-h-screen">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-3xl text-royal-purple mb-4">Please Sign In</h1>
            <Link
              to="/auth"
              className="inline-block px-8 py-4 bg-royal-purple text-ivory font-semibold text-sm uppercase tracking-widest hover:bg-royal-purple-light transition-colors rounded-full"
            >
              Sign In
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-ivory min-h-screen">
          <div className="container mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-ivory min-h-screen">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-3xl text-royal-purple mb-4">Order Not Found</h1>
            <Link
              to="/orders"
              className="inline-block px-8 py-4 bg-royal-purple text-ivory font-semibold text-sm uppercase tracking-widest hover:bg-royal-purple-light transition-colors rounded-full"
            >
              View All Orders
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const currentStepIndex = getStatusIndex(order.status);
  const isCancelled = order.status === "cancelled";
  const canCancel = order.status !== "cancelled" && order.status !== "delivered";

  return (
    <Layout>
      <section className="pt-28 pb-20 bg-ivory min-h-screen">
        <div className="container mx-auto px-6 relative">
         <Link
  to="/orders"
  className="group inline-flex items-center gap-2 text-muted-foreground 
             hover:text-royal-purple mb-8 transition-all duration-300 
             hover:scale-105"
>
  <ArrowLeft
      className="w-5 h-5 transition-transform duration-300 
                 group-hover:-translate-x-1 
                 group-hover:text-royal-purple"
    />
  <span className="transition-colors duration-300">
    BACK TO ORDERS
  </span>
</Link>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="group absolute top-0 right-6 px-6 py-2 
                         border border-red-500 text-red-500 
                         font-medium text-sm uppercase tracking-widest 
                         rounded-full
                         transition-all duration-300
                         hover:bg-red-500 hover:text-white
                         hover:shadow-lg hover:-translate-y-1
                         active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h1 className="product-title font-medium text-2xl text-royal-purple mb-2">
                Order {order.orderId.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-muted-foreground font-medium font-sans">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Tracking */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status Timeline */}
              <div className="bg-card p-6 font-sans rounded-2xl shadow-card">
                <h2 className="font-serif text-xl text-royal-purple mb-6">Order Status</h2>

                {isCancelled ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700">Order Cancelled</p>
                      <p className="text-sm text-red-600">This order has been cancelled</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                    <div className="space-y-6">
                      {statusSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                          <div key={step.status} className="relative flex items-center gap-4">
                            <div
                              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                ? "bg-[#C6A85A] text-royal-purple-dark"
                                : "bg-muted text-muted-foreground"
                                } ${isCurrent ? "ring-2 ring-[#C6A85A] ring-offset-2" : ""}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p
                                className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"
                                  }`}
                              >
                                {step.label}
                              </p>
                              {isCurrent && step.status === "shipped" && order.trackingNumber && (
                                <p className="text-sm text-muted-foreground">
                                  Tracking: {order.trackingNumber}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {order.estimatedDelivery && !isCancelled && order.status !== "delivered" && (
                  <div className="mt-6 p-4 bg-gold/10 rounded-2xl">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Estimated Delivery: </span>
                      <span className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-card p-6 rounded-2xl shadow-card">
                <h2 className="font-serif text-xl text-royal-purple mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium font-rr">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground font-rr">Quantity: {item.quantity}</p>
                        <p className="text-[#C6A85A] font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Shipping */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-card p-6 rounded-2xl shadow-card">
                <h2 className="font-serif text-xl text-royal-purple mb-4">Payment Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{Number(order.subtotal).toLocaleString()}</span>
                  </div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-rr">
                      <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                      <span>-₹{Number(order.discount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{Number(order.shipping) === 0 ? "Free" : `₹${Number(order.shipping)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-rrfont-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-[#C6A85A]">₹{Number(order.total).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground font-rr">Payment Method</p>
                  <p className="font-medium font-rr capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card p-6 rounded-sm shadow-card">
                <h2 className="font-serif text-xl text-royal-purple mb-4">Shipping Address</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium font-rr">{order.shippingDetails.name}</p>
                      <p className="text-muted-foreground font-rr">{order.shippingDetails.address}</p>
                      <p className="text-muted-foreground font-rr">
                        {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-rr">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{order.shippingDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 font-rr">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{order.shippingDetails.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderDetails;
