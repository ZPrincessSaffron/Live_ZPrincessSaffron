import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL as string;

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'paid';

export interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  isReturned?: boolean;
  returnRequestedAt?: string;
}

export interface Order {
  orderId: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingDetails: ShippingDetails;
  paymentMethod: string;
  items: OrderItem[];
  couponCode?: string;
  razorpayOrderId?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CheckoutData {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  shippingDetails: ShippingDetails;
  paymentMethod: string;
  razorpayOrderId?: string;
  items: {
    product_id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
  }[];
}

export const useOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user || !user.token) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching orders for user:", user?.email);
      const response = await fetch(`${API_URL}/users/orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      console.log("Orders fetch response:", response.status, data);
      if (response.ok) {
        setOrders(data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setIsLoading(false);
  }, [user]);

  const fetchOrderWithItems = useCallback(async (orderId: string): Promise<Order | null> => {
    if (!user || !user.token) return null;

    try {
      const response = await fetch(`${API_URL}/users/orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data: Order[] = await response.json();
      if (response.ok) {
        return data.find((o) => o.orderId === orderId) || null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }, [user]);

  const createOrder = async (checkoutData: CheckoutData): Promise<string | null> => {
    if (!user || !user.token) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/users/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ checkoutData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      toast({
        title: "Order placed successfully!",
        description: `Order #${data.orderId} has been confirmed`,
      });

      await fetchOrders();
      return data.orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    if (!user || !user.token) return false;

    try {
      const response = await fetch(`${API_URL}/users/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }

      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled",
      });

      await fetchOrders();
      return true;
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel order",
        variant: "destructive",
      });
      return false;
    }
  };

  const submitReturnRequest = async (data: any): Promise<boolean> => {
    if (!user || !user.token) return false;

    try {
      const response = await fetch(`${API_URL}/returns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit return request");
      }

      toast({
        title: "Success",
        description: "Return request submitted successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error submitting return:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit return request",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchMyReturns = useCallback(async (): Promise<any[]> => {
    if (!user || !user.token) return [];

    try {
      const response = await fetch(`${API_URL}/returns/my`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch returns");
      return await response.json();
    } catch (error) {
      console.error("Error fetching returns:", error);
      return [];
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    fetchOrders,
    fetchOrderWithItems,
    createOrder,
    cancelOrder,
    submitReturnRequest,
    fetchMyReturns,
  };
};
