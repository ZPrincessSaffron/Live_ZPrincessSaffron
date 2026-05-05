import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2,  Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Country, State, City } from "country-state-city";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, Address } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingAddressProps {
  profile: Profile | null;
  addAddress: (address: any) => Promise<boolean>;
  updateAddress: (id: string, updates: any) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
}

const ShippingAddress = ({ 
  profile, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
}: ShippingAddressProps) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    shipping_address: "",
    shipping_area: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pincode: "",
    shipping_country: "",
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "shipping_pincode") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      shipping_address: "",
      shipping_area: "",
      shipping_city: "",
      shipping_state: "",
      shipping_pincode: "",
      shipping_country: "",
      isDefault: false,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      shipping_address: address.shipping_address,
      shipping_area: address.shipping_area,
      shipping_city: address.shipping_city,
      shipping_state: address.shipping_state,
      shipping_pincode: address.shipping_pincode,
      shipping_country: address.shipping_country,
      isDefault: address.isDefault,
    });
    setEditingId(address._id);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (formData.shipping_pincode && formData.shipping_pincode.length !== 6) {
      toast({ title: "Invalid Pincode", description: "Pincode must be 6 digits.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    let success = false;
    if (editingId) {
      success = await updateAddress(editingId, formData);
    } else {
      success = await addAddress(formData);
    }
    
    if (success) resetForm();
    setIsSaving(false);
  };

  const countries = Country.getAllCountries();
  const selectedCountry = countries.find(c => c.name === formData.shipping_country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const selectedState = states.find(s => s.name === formData.shipping_state);
  const cities = selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) : [];

  const addresses = profile?.addresses || [];
  const addressSelectTriggerClassName = "h-11 rounded-full border-gold/20 bg-white/80 px-5 text-sm font-rr text-royal-purple shadow-[0_8px_24px_rgba(46,15,58,0.08)] focus:ring-gold/40";
  const addressSelectContentClassName = "rounded-[1.5rem] border-gold/15 bg-[#fffaf4]/95 shadow-[0_18px_45px_rgba(46,15,58,0.14)]";
  const addressSelectItemClassName = "rounded-xl py-1.5 pl-8 pr-3 text-[13px] font-rr leading-5 text-royal-purple/85 focus:bg-gold/12 focus:text-royal-purple";

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-[0_10px_60px_rgba(0,0,0,0.08)] p-5 md:p-10">
        
        <div className="text-center mb-12">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.30em] text-royal-purple uppercase">
            Shipping Addresses
          </h2>
        </div>

        {!isAdding && (
          <div className="flex justify-center mb-10">
            <Button variant="section" onClick={() => setIsAdding(true)}>
              Add New Address
            </Button>
          </div>
        )}

        {isAdding ? (
          <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-3 md:col-span-2">
                <Label>House / Flat / Street</Label>
                <Input name="shipping_address" value={formData.shipping_address} onChange={handleInputChange} className="rounded-full h-11 px-6" />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label>Area / Landmark</Label>
                <Input name="shipping_area" value={formData.shipping_area} onChange={handleInputChange} className="rounded-full h-11 px-6" />
              </div>
              <div className="space-y-3">
                <Label>Country</Label>
                <Select
                  value={formData.shipping_country || undefined}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, shipping_country: value, shipping_state: "", shipping_city: "" }))
                  }
                >
                  <SelectTrigger className={addressSelectTriggerClassName}>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className={addressSelectContentClassName}>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.isoCode}
                        value={country.name}
                        className={addressSelectItemClassName}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>State</Label>
                <Select
                  value={formData.shipping_state || undefined}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, shipping_state: value, shipping_city: "" }))
                  }
                  disabled={!selectedCountry}
                >
                  <SelectTrigger className={addressSelectTriggerClassName}>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className={addressSelectContentClassName}>
                    {states.map((state) => (
                      <SelectItem
                        key={state.isoCode}
                        value={state.name}
                        className={addressSelectItemClassName}
                      >
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>City</Label>
                <Select
                  value={formData.shipping_city || undefined}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, shipping_city: value }))
                  }
                  disabled={!selectedState}
                >
                  <SelectTrigger className={addressSelectTriggerClassName}>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent className={addressSelectContentClassName}>
                    {cities.map((city) => (
                      <SelectItem
                        key={city.name}
                        value={city.name}
                        className={addressSelectItemClassName}
                      >
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Pincode</Label>
                <Input name="shipping_pincode" value={formData.shipping_pincode} onChange={handleInputChange} className="rounded-full h-11 px-6" type="tel" maxLength={6} />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={(e) => setFormData(p => ({ ...p, isDefault: e.target.checked }))} className="w-4 h-4" />
                <Label htmlFor="isDefault" className="cursor-pointer">Set as default address</Label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-12 w-full">
              <Button 
                variant="royal" 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full sm:w-auto min-w-0 sm:min-w-[210px]"
              >
                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : editingId ? "Update Address" : "Save Address"}
              </Button>
              <Button 
                variant="royalOutline" 
                onClick={resetForm}
                className="w-full sm:w-auto min-w-0 sm:min-w-[210px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div key={address._id} className={`relative bg-white/60 backdrop-blur-sm border ${address.isDefault ? 'border-royal-purple shadow-md' : 'border-royal-purple/20 shadow-sm'} rounded-2xl p-8 transition-all hover:shadow-lg`}>
                  {address.isDefault && (
                    <div className="absolute top-4 right-8 flex items-center gap-1 text-royal-purple font-bold text-[10px] tracking-[0.2em] uppercase">
                      <CheckCircle2 className="w-3 h-3" /> Default
                    </div>
                  )}
                  
                  <div className="font-rr  text-royal-purple text-[18px] font-medium leading-7 tracking-[0.02em] mb-6">
                    <p>{address.shipping_address}, {address.shipping_area}</p>
                    <p>{address.shipping_city}, {address.shipping_state} – {address.shipping_pincode}</p>
                    <p>{address.shipping_country}</p>
                  </div>

                  <div className="flex gap-4 border-t border-royal-purple/10 pt-6">
                    <button onClick={() => handleEdit(address)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-royal-purple/70 hover:text-royal-purple transition-colors">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => deleteAddress(address._id)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                    {!address.isDefault && (
                      <button onClick={() => setDefaultAddress(address._id)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-royal-purple/40 hover:text-royal-purple transition-colors ml-auto">
                        Make Default
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-10">No addresses saved yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingAddress;
