import { useState, useEffect } from "react";

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.getElementById("razorpay-checkout-js");
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-checkout-js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Optional: Clean up if desired, though usually kept for session
    };
  }, []);

  return isLoaded;
};
