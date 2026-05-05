import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useProfile } from "@/hooks/useProfile";
import { getProductById } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resolveProductImage } from "@/utils/imageUtils";
import { useRazorpay } from "@/hooks/useRazorpay";

const NAME_REGEX = /^[A-Za-z\s.'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { profile, isLoading: profileLoading } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRazorpayLoaded = useRazorpay();
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  // Local state for shipping details
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Get coupon from session storage (set by cart page)
  const savedCoupon = sessionStorage.getItem("appliedCoupon");
  const savedDiscount = sessionStorage.getItem("discountPercent");
  const discount = savedDiscount ? parseInt(savedDiscount) : 0;

  const cartProducts = cartItems
    .map((item) => ({
      ...item,
      product: item.product || getProductById(item.product_id),
    }))
    .filter((item) => item.product);

  const subtotal = cartProducts.reduce(
    (sum, item) => sum + item.product!.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 2000 ? 0 : 99;
  const total = subtotal - discountAmount + shipping;

  // Initialize email from user if available
  useEffect(() => {
    if (user?.email && !shippingDetails.email) {
      setShippingDetails(prev => ({ ...prev, email: user.email || "" }));
    }
  }, [user]);

  const handleFetchFromProfile = () => {
    if (profile) {
      setShippingDetails({
        name: profile.fullName || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        address: `${profile.shipping_address || ""}${profile.shipping_area ? `, ${profile.shipping_area}` : ""}`,
        city: profile.shipping_city || "",
        state: profile.shipping_state || "",
        pincode: profile.shipping_pincode || "",
      });
      toast({
        title: "Address Fetched",
        description: "Shipping details updated from your profile.",
      });
    } else {
      toast({
        title: "Profile Incomplete",
        description: "No address details found in your profile.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "name") {
      nextValue = value.replace(/\d/g, "");
    }

    if (name === "phone") {
      nextValue = value.replace(/[^\d+\s-]/g, "");
    }

    setShippingDetails((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const validateForm = () => {
    const requiredFields: Array<keyof typeof shippingDetails> = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];
    const fieldLabels: Record<keyof typeof shippingDetails, string> = {
      name: "full name",
      email: "email",
      phone: "phone number",
      address: "address",
      city: "city",
      state: "state",
      pincode: "pincode",
    };

    for (const field of requiredFields) {
      if (!shippingDetails[field].trim()) {
        toast({
          title: "Missing Information",
          description: `Please enter your ${fieldLabels[field]}`,
          variant: "destructive",
        });
        return false;
      }
    }

    const trimmedName = shippingDetails.name.trim();
    if (!NAME_REGEX.test(trimmedName)) {
      toast({
        title: "Invalid Name",
        description: "Full name should contain only letters.",
        variant: "destructive",
      });
      return false;
    }

    if (!EMAIL_REGEX.test(shippingDetails.email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    const phoneDigits = shippingDetails.phone.replace(/\D/g, "");
    const isValidPhone =
      phoneDigits.length === 10 ||
      (phoneDigits.length === 12 && phoneDigits.startsWith("91"));

    if (!isValidPhone) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cartProducts.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create secure Razorpay Order in Backend (just for the payment session)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay secure order");
      }

      const rzpOrder = await response.json();

      // 2. Check Razorpay SDK is available
      if (!isRazorpayLoaded || !(window as any).Razorpay) {
        throw new Error(
          "Payment gateway (Razorpay) is taking too long to load or is being blocked. Please check your internet connection or disable ad-blockers."
        );
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Z Princess Saffron",
        description: "Premium Kashmiri Saffron",
        image: "https://Lovable.dev/opengraph-image-p98pqg.png",
        order_id: rzpOrder.id,
        handler: async function (response: any) {
          // ✅ Payment succeeded — NOW verify and create the order
          try {
            // 3. Verify payment signature
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            // 4. Create the order in DB ONLY after verified payment
            const orderId = await createOrder({
              subtotal,
              discount: discountAmount,
              shipping,
              total,
              couponCode: savedCoupon,
              shippingDetails,
              paymentMethod: "razorpay",
              items: cartProducts.map((item) => ({
                product_id: typeof item.product_id === 'string' ? parseInt(item.product_id) : item.product_id,
                product_name: item.product!.name,
                product_image: item.product!.image,
                quantity: item.quantity,
                price: item.product!.price,
              })),
              razorpayOrderId: response.razorpay_order_id,
            });

            if (!orderId) {
              throw new Error("Failed to create order record after payment");
            }

            // 5. Clear cart and session only after order is saved
            await clearCart();
            sessionStorage.removeItem("appliedCoupon");
            sessionStorage.removeItem("discountPercent");

            toast({
              title: "Payment Successful! 🎉",
              description: `Order #${orderId} confirmed.`,
            });

            navigate(`/order/${orderId}`);
          } catch (error) {
            console.error("Post-payment Error:", error);
            toast({
              title: "Order Creation Failed",
              description: "Payment received but order creation failed. Please contact support with your payment ID.",
              variant: "destructive",
            });
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          contact: shippingDetails.phone,
        },
        theme: {
          color: "#2E0F3A",
        },
        modal: {
          ondismiss: function () {
            // ❌ User cancelled — cart remains intact, no order was created
            setIsSubmitting(false);
            toast({
              title: "Payment Cancelled",
              description: "Your cart is still saved. Complete payment when you're ready.",
            });
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Checkout Error:", error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-ivory min-h-screen">
          <div className="container mx-auto px-4 md:px-6 lg:px-0 text-center">
            <h1 className="font-serif text-3xl text-royal-purple mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-8">You need to be logged in to checkout</p>
            <Link to="/auth">
              <Button>
                Sign In
              </Button>
            </Link>

          </div>
        </section>
      </Layout>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-ivory min-h-screen">
          <div className="container mx-auto px-4 md:px-6 lg:px-0 text-center">
            <h1 className="font-serif text-3xl text-royal-purple mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to checkout</p>
            <Link to="/products">
              <Button>
                Shop Now
              </Button>
            </Link>

          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-20 bg-ivory min-h-screen">
        <div className="container mx-auto px-4 md:px-6 lg:px-0">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-royal-purple mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <h1 className="font-serif text-4xl text-royal-purple mb-10">Checkout</h1>

          <form onSubmit={handlePayment}>
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Delivery Address & Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Delivery Address Section */}
                <div className="bg-card p-6 rounded-sm shadow-card">
                  <div className="flex flex-row items-center justify-between gap-2 mb-6">
                    <h2 className="font-serif text-sm md:text-xl text-royal-purple flex items-center gap-2">
                      <Truck className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="whitespace-nowrap">Delivery Address</span>
                    </h2>
                    <Button
                      type="button"
                      variant="royal"
                      size="sm"
                      onClick={handleFetchFromProfile}
                      disabled={profileLoading}
                      className="flex items-center justify-center gap-1 md:gap-3 text-[10px] md:text-sm h-8 md:h-10 px-2 md:px-4"
                    >
                      <span className="leading-none whitespace-nowrap">Fetch from Profile</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={shippingDetails.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingDetails.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                    <div className="span-full md:col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingDetails.address}
                        onChange={handleInputChange}
                        placeholder="Flat/House No, Street, Landmark"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={shippingDetails.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card p-6 rounded-sm shadow-card">
                  <h2 className="font-serif text-xl text-royal-purple mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border border-gold bg-gold/5 rounded-2xl">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <span className="font-medium">Razorpay Secure</span>
                        <p className="text-sm text-muted-foreground">Pay securely with Credit/Debit Card, UPI, or NetBanking</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card p-6 rounded-2xl shadow-card sticky top-28">
                  <h2 className="font-serif text-xl text-royal-purple mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {cartProducts.map(({ product_id, quantity, product }) => (
                      <div key={product_id} className="flex gap-3">
                        <img
                          src={resolveProductImage(product!.image)}
                          alt={product!.name}
                          loading="lazy"
                          decoding="async"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product!.name}</p>
                          <p className="text-xs font-rr text-muted-foreground">Qty: {quantity}</p>
                          <p className="text-sm text-gold">₹{(product!.price * quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({savedCoupon})</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4 border-t border-border">
                      <span>Total</span>
                      <span className="text-gold">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="royal"
                    disabled={isSubmitting}
                    className="w-full mt-6"
                  >
                    {isSubmitting ? "Processing..." : "Pay Now"}
                  </Button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    Secure checkout by Razorpay
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
