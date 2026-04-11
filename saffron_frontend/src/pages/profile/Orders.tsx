import ProfileLayout from "./ProfileLayout";
import { useOrders } from "@/hooks/useOrders";
import ProfileOrders from "@/components/profile/ProfileOrders";
import { Loader2 } from "lucide-react";

const Orders = () => {
  const { orders, isLoading } = useOrders();

  return (
    <ProfileLayout
      title=""
      description=""
    >
      <div className="text-center mb-10">
        <p className="text-muted-foreground font-rr font-medium tracking-wide">
          View and track your order history.
        </p>
      </div>

      {/* CENTER ALIGN WRAPPER */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl">

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-royal-purple" />
            </div>
          ) : (
            <ProfileOrders
              orders={orders}
              isLoading={isLoading}
            />
          )}

        </div>
      </div>
    </ProfileLayout>
  );
};

export default Orders;
