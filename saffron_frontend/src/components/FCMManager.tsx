import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { requestForToken, onMessageListener } from "@/firebase";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL as string;

const FCMManager = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Only attempt setup if user is logged in and has a JWT token
    if (user && user.token) {
      const setupFCM = async () => {
        try {
          const token = await requestForToken();
          if (token) {
            const response = await fetch(`${API_URL}/users/fcm-token`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({ fcmToken: token }),
            });

            if (response.ok) {
              console.log("FCM token registered with backend");
            } else {
              console.warn(" Failed to register FCM token with backend");
            }
          }
        } catch (error) {
          console.error("FCM Setup Error:", error);
        }
      };

      setupFCM();

      // Listen for foreground messages
      const unsubscribe = onMessageListener((payload: any) => {
        if (payload && payload.notification) {
          toast(payload.notification.title, {
            description: payload.notification.body,
          });
        }
      });

      return () => {
        unsubscribe(); // Unsubscribe with component unmount or user change
      };
    }
  }, [user]);

  return null; // This component handles side effects only
};

export default FCMManager;
