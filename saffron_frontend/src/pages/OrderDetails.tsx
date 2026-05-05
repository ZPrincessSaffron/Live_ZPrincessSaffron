import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders, Order, OrderStatus } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import ReturnRequestModal from "@/components/orders/ReturnRequestModal";

const statusSteps: { status: string; label: string; icon: React.ElementType }[] = [
  { status: "pending", label: "Order Placed", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle },
  { status: "processing", label: "Processing", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle },
  { status: "requested", label: "Return Requested", icon: Clock },
  { status: "approved", label: "Return Approved", icon: CheckCircle },
  { status: "refunded", label: "Refunded", icon: CheckCircle },
];

const getStatusIndex = (status: string, overallReturnStatus?: string | null): number => {
  if (status === "cancelled") return -1;
  
  // If order is delivered, we might be in the return phase
  if (status === "delivered" && overallReturnStatus) {
    return statusSteps.findIndex((step) => step.status === overallReturnStatus);
  }

  const effectiveStatus = status === "paid" ? "confirmed" : status;
  return statusSteps.findIndex((step) => step.status === effectiveStatus);
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const { fetchOrderWithItems, cancelOrder, submitReturnRequest, fetchMyReturns } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [returns, setReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (orderId) {
          const [orderData, returnsData] = await Promise.all([
            fetchOrderWithItems(orderId),
            fetchMyReturns(),
          ]);
          setOrder(orderData);
          setReturns(returnsData);
        }
      } catch (error) {
        console.error("Error loading order details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [orderId, fetchOrderWithItems, fetchMyReturns]);

  const handleCancel = async () => {
    if (!order || isCancelling) return;
    setIsCancelling(true);
    const success = await cancelOrder(order.orderId);
    if (success) {
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
    }
    setIsCancelling(false);
  };

  const handleReturnSubmit = async (data: any) => {
    const success = await submitReturnRequest(data);
    if (success) {
      const returnsData = await fetchMyReturns();
      setReturns(returnsData);
    }
    return success;
  };

  const getReturnStatusColor = (status: string) => {
    if (status === "requested") return "#f59e0b"; // Orange/Amber
    if (status === "approved") return "#10b981";  // Green
    if (status === "rejected") return "#ef4444";  // Red
    if (status === "refunded") return "#C6A85A";  // Gold
    return "#6b7280";                             // Gray
  };

  const getReturnStatus = (productId: number) => {
    const allReturns = [...returns, ...(order?.returnRequests || [])];
    const request = allReturns.find(r => r.orderId === order?.orderId && r.items?.some((i: any) => Number(i.productId) === productId));
    return request?.status;
  };

  const getOverallReturnStatus = () => {
    // Combine state returns and backend-attached returns
    const allReturns = [...(returns || []), ...(order?.returnRequests || [])];
    
    // Filter out any invalid or empty objects
    const validReturns = allReturns.filter(r => r && r.status && r.orderId === order?.orderId);
    
    if (validReturns.length === 0) return null;
    
    // Priority: refunded > approved > requested
    if (validReturns.some(r => r.status === "refunded")) return "refunded";
    if (validReturns.some(r => r.status === "approved")) return "approved";
    if (validReturns.some(r => r.status === "requested")) return "requested";
    return null;
  };

  const overallReturnStatus = getOverallReturnStatus();
  const currentStep = order ? getStatusIndex(order.status, overallReturnStatus) : -1;

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

  const isCancelled = order.status === "cancelled";
  // Restrict cancellation to before processing starts
  const canCancel = ["pending", "confirmed"].includes(order.status);

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
          {!isCancelled && order.status !== "delivered" && (
            <button
              onClick={handleCancel}
              disabled={isCancelling || !canCancel}
              className="group absolute top-0 right-6 px-6 py-2 
                         border border-red-500 text-red-500 
                         font-medium text-sm uppercase tracking-widest 
                         rounded-full
                         transition-all duration-300
                         hover:enabled:bg-red-500 hover:enabled:text-white
                         hover:enabled:shadow-lg hover:enabled:-translate-y-1
                         active:enabled:scale-95
                         disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed
                         disabled:border-gray-400 disabled:text-gray-400"
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
                      {statusSteps
                        .filter((step, index) => {
                          if (index <= 5) return true;
                          return !!overallReturnStatus;
                        })
                        .map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                          <div key={step.status} className="relative flex items-center gap-4">
                            <div
                              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                ? "bg-[#C6A85A] text-royal-purple-dark shadow-md shadow-[#C6A85A]/20"
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
                              {isCurrent && (
                                <p className="text-xs text-[#C6A85A] font-bold uppercase tracking-widest mt-0.5">
                                  Current Stage
                                </p>
                              )}
                              {isCurrent && step.status === "shipped" && order.trackingNumber && (
                                <p className="text-sm text-muted-foreground mt-1">
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
                        {(() => {
                          const date = new Date(order.estimatedDelivery);
                          return isNaN(date.getTime()) ? "TBD" : date.toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                        })()}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-card p-6 rounded-2xl shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="font-serif text-xl text-royal-purple">Order Items</h2>
                  
                  {order.status?.toLowerCase() === "delivered" && (
                    (() => {
                      // Consolidate all return data sources
                      const allReturns = [...(returns || []), ...(order?.returnRequests || [])];
                      const returnedProductIds = allReturns
                        .filter(r => r.orderId === order?.orderId)
                        .flatMap(r => (r.items || []).map((i: any) => Number(i.productId)));
                        
                      const returnableItems = (order.items || []).filter((item: any) => !returnedProductIds.includes(Number(item.product_id)));
                      
                      // For debugging, we'll show the button if there are returnable items
                      if (returnableItems.length > 0) {
                        return (
                          <Button
                            variant="royal"
                            onClick={() => setIsReturnModalOpen(true)}
                            className="h-[40px] min-w-[180px] bg-royal-purple hover:bg-royal-purple/90 text-[11px] text-white rounded-full px-5 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          >
                            Return Items
                          </Button>
                        );
                      }
                      return null;
                    })()
                  )}
                </div>

                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          loading="lazy"
                          decoding="async"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="font-medium font-rr">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground font-rr">Quantity: {item.quantity}</p>
                            <p className="text-[#C6A85A] font-medium">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                          {order.status === "delivered" && (
                            <div className="mt-2 sm:mt-0">
                              {(() => {
                                  const status = getReturnStatus(item.product_id);
                                  if (status) {
                                    return (
                                      <span 
                                        className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/50 border"
                                        style={{ color: getReturnStatusColor(status), borderColor: `${getReturnStatusColor(status)}20` }}
                                      >
                                        Return {status}
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                            </div>
                          )}
                        </div>
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
      {/* Return Modal */}
      {order && (
        <ReturnRequestModal
          isOpen={isReturnModalOpen}
          onClose={() => {
            setIsReturnModalOpen(false);
            setSelectedProduct(null);
          }}
          order={order}
          initialProduct={selectedProduct}
          onSubmit={handleReturnSubmit}
          existingReturns={returns}
        />
      )}
    </Layout>
  );
};

export default OrderDetails;
