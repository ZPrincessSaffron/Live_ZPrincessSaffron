import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface Address {
  _id: string;
  shipping_address: string;
  shipping_area: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_country: string;
  isDefault: boolean;
}

export interface Profile {
  _id: string;
  fullName: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  alternate_phone: string | null;
  addresses: Address[];
  shipping_address?: string;
  shipping_area?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  shipping_country?: string;
}

export interface ProfileUpdate {
  fullName?: string;
  avatar_url?: string;
  phone?: string;
  alternate_phone?: string;
  shipping_address?: string;
  shipping_area?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  shipping_country?: string;
}

export const useProfile = () => {
  const { user, updateUserData } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user || !user.token) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
    setIsLoading(false);
  }, [user]);

  const updateProfile = async (updates: ProfileUpdate): Promise<boolean> => {
    if (!user || !user.token) return false;

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      if (updates.fullName) {
        updateUserData({ fullName: updates.fullName });
      }

      await fetchProfile();
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return false;
    }
  };

  const hasCompleteAddress = (): boolean => {
    if (!profile) return false;
    return !!(
      profile.fullName &&
      profile.phone &&
      profile.shipping_address &&
      profile.shipping_city &&
      profile.shipping_state &&
      profile.shipping_pincode
    );
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const addAddress = async (address: Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }): Promise<boolean> => {
    if (!user || !user.token) return false;
    try {
      const response = await fetch(`${API_URL}/users/profile/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(address),
      });
      if (response.ok) {
        await fetchProfile();
        toast({ title: "Success", description: "Address added successfully" });
        return true;
      }
      throw new Error("Failed to add address");
    } catch (error) {
      console.error("Error adding address:", error);
      toast({ title: "Error", description: "Failed to add address", variant: "destructive" });
      return false;
    }
  };

  const updateAddress = async (addressId: string, updates: Partial<Address>): Promise<boolean> => {
    if (!user || !user.token) return false;
    try {
      const response = await fetch(`${API_URL}/users/profile/addresses/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        await fetchProfile();
        toast({ title: "Success", description: "Address updated successfully" });
        return true;
      }
      throw new Error("Failed to update address");
    } catch (error) {
      console.error("Error updating address:", error);
      toast({ title: "Error", description: "Failed to update address", variant: "destructive" });
      return false;
    }
  };

  const deleteAddress = async (addressId: string): Promise<boolean> => {
    if (!user || !user.token) return false;
    try {
      const response = await fetch(`${API_URL}/users/profile/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        await fetchProfile();
        toast({ title: "Success", description: "Address deleted successfully" });
        return true;
      }
      throw new Error("Failed to delete address");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({ title: "Error", description: "Failed to delete address", variant: "destructive" });
      return false;
    }
  };

  const setDefaultAddress = async (addressId: string): Promise<boolean> => {
    if (!user || !user.token) return false;
    try {
      const response = await fetch(`${API_URL}/users/profile/addresses/${addressId}/default`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        await fetchProfile();
        toast({ title: "Success", description: "Default address set successfully" });
        return true;
      }
      throw new Error("Failed to set default address");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast({ title: "Error", description: "Failed to set default address", variant: "destructive" });
      return false;
    }
  };

  return {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
    hasCompleteAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
