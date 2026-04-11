import ProfileLayout from "./ProfileLayout";
import { useProfile } from "@/hooks/useProfile";
import ShippingAddress from "@/components/profile/ShippingAddress";
import { Loader2 } from "lucide-react";

const Address = () => {
  const { 
    profile, 
    isLoading, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useProfile();

  if (isLoading) {
    return (
      <ProfileLayout title="Shipping Address" hideHeaderMobile>
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      title="Shipping Address"
      description="Manage your delivery address for faster checkout."
      hideHeaderMobile
    >
      <div className="md:hidden text-center mb-10">
        <p className="text-muted-foreground font-rr text-sm">
          Manage your delivery address for faster checkout.
        </p>
      </div>
      {/* CENTER ALIGN WRAPPER */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl">
          <ShippingAddress
            profile={profile}
            addAddress={addAddress}
            updateAddress={updateAddress}
            deleteAddress={deleteAddress}
            setDefaultAddress={setDefaultAddress}
          />
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Address;
