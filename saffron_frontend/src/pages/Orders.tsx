import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Orders are now managed in the Profile page
// This redirect ensures backward compatibility
const Orders = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Navigate to="/profile" replace />;
};

export default Orders;
