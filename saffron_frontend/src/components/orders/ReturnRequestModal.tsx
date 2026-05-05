import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, Loader2, Upload } from "lucide-react";

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  initialProduct?: any;
  onSubmit: (data: any) => Promise<boolean>;
  existingReturns: any[];
}

const ReturnRequestModal = ({
  isOpen,
  onClose,
  order,
  initialProduct,
  onSubmit,
  existingReturns,
}: ReturnRequestModalProps) => {
  const { toast } = useToast();
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>(order?.shippingDetails?.phone || "");
  const [pickupAddress, setPickupAddress] = useState<string>(order?.shippingDetails?.address || "");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Identify which items are already requested or returned for THIS specific order
  // Standardize IDs as strings for consistent comparison
  const returnedProductIds = (existingReturns || [])
    .filter(r => r.orderId === order?.orderId)
    .flatMap(r => (r.items || []).map((i: any) => String(i.productId || "")));
  
  // Available items for return (must not be already returned in this order)
  const availableItems = (order?.items || []).filter((item: any) => {
    const id = String(item.product_id || item.productId || "");
    return id && !returnedProductIds.includes(id);
  });

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>(
    initialProduct ? [initialProduct.product_id] : []
  );

  const toggleProduct = (productId: number) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 2) {
      toast({ title: "Limit Exceeded", description: "You can only upload maximum 2 photos", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
        if (prev => prev.length + 1 === files.length + images.length) {
           setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const trimmedDescription = description.trim();
    const trimmedPickupAddress = pickupAddress.trim();
    const trimmedContactNumber = contactNumber.trim();
    const phoneDigits = trimmedContactNumber.replace(/\D/g, "");

    if (!reason) {
      toast({ title: "Error", description: "Please select a reason for return", variant: "destructive" });
      return;
    }
    if (reason === "Other" && !trimmedDescription) {
      toast({ title: "Error", description: "Please provide a description", variant: "destructive" });
      return;
    }
    if (!trimmedPickupAddress) {
      toast({ title: "Error", description: "Please enter the pickup address", variant: "destructive" });
      return;
    }
    if (!trimmedContactNumber) {
      toast({ title: "Error", description: "Please enter the contact number", variant: "destructive" });
      return;
    }
    if (!(phoneDigits.length === 10 || (phoneDigits.length === 12 && phoneDigits.startsWith("91")))) {
      toast({ title: "Error", description: "Please enter a valid contact number", variant: "destructive" });
      return;
    }
    if (!isConfirmed) {
      toast({ title: "Error", description: "Please confirm the 24-hour window", variant: "destructive" });
      return;
    }
    if (images.length !== 2) {
      toast({ title: "Error", description: "Please upload exactly 2 photos of the product", variant: "destructive" });
      return;
    }

    if (selectedProductIds.length === 0) {
      toast({ title: "Error", description: "Please select at least one item to return", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    const selectedItems = order.items
      .filter((item: any) => selectedProductIds.includes(item.product_id))
      .map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        productImage: item.product_image,
        quantity: item.quantity
      }));

    const success = await onSubmit({
      orderId: order.orderId,
      items: selectedItems,
      reason,
      description: trimmedDescription,
      contactNumber: trimmedContactNumber,
      pickupAddress: trimmedPickupAddress,
      images,
      refundType: "original",
    });
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-cinzel tracking-wider">Return Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Order ID</Label>
              <p className="font-medium">{order?.orderId}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Delivery Date</Label>
              <p className="font-medium">
                {new Date(order?.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-royal-purple font-cinzel">Select Items to Return</Label>
              {availableItems.length > 1 && (
                <button 
                  onClick={() => {
                    if (selectedProductIds.length === availableItems.length) {
                      setSelectedProductIds([]);
                    } else {
                      setSelectedProductIds(availableItems.map((i: any) => i.product_id));
                    }
                  }}
                  className="text-[10px] font-bold text-royal-purple hover:underline uppercase tracking-wider"
                >
                  {selectedProductIds.length === availableItems.length ? "Deselect All" : "Select All Items"}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {availableItems.length === 0 ? (
                <div className="p-4 border border-dashed rounded-lg text-center text-[11px] text-muted-foreground">
                  No items available for return in this order.
                </div>
              ) : (
                availableItems.map((item: any) => (
                  <div 
                    key={item.product_id || item.productId || Math.random()}
                    onClick={() => toggleProduct(item.product_id || item.productId)}
                    className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                      selectedProductIds.includes(item.product_id || item.productId) 
                        ? "border-royal-purple bg-royal-purple/5 shadow-sm" 
                        : "border-border hover:border-royal-purple/30"
                    }`}
                  >
                    <Checkbox 
                      checked={selectedProductIds.includes(item.product_id || item.productId)}
                      onCheckedChange={() => toggleProduct(item.product_id || item.productId)}
                    />
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[11px] leading-tight line-clamp-1">{item.product_name}</p>
                      <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason for Return</Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Damaged product">Damaged product</SelectItem>
                <SelectItem value="Wrong item">Wrong item</SelectItem>
                <SelectItem value="Not as described">Not as described</SelectItem>
                <SelectItem value="Quality issue">Quality issue</SelectItem>
                <SelectItem value="Size/quantity issue">Size/quantity issue</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reason === "Other" && (
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Please describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Pickup Address</Label>
            <Input
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Contact Number</Label>
            <Input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value.replace(/[^\d+\s-]/g, ""))}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex justify-between items-center">
              Product Photos (Upload exactly 2)
              <span className="text-[10px] text-royal-purple font-medium bg-royal-purple/5 px-2 py-0.5 rounded-full">MANDATORY</span>
            </Label>
            
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-royal-purple/10">
                  <img src={img} className="w-full h-full object-cover" alt="Product preview" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {images.length < 2 && (
                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-royal-purple/10 hover:border-royal-purple/30 hover:bg-royal-purple/5 cursor-pointer transition-all">
                  <Camera className="w-5 h-5 text-royal-purple mb-1" />
                  <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Add Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    multiple={images.length === 0}
                    onChange={handleImageUpload} 
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Refund Method</Label>
            <p className="text-sm font-medium">Original Payment Method (Razorpay)</p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="confirm"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
            />
            <Label htmlFor="confirm" className="text-xs font-normal cursor-pointer">
              I confirm that I am requesting this return within 24 hours of successful delivery.
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="royalOutline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full min-w-0 px-4 text-[11px] tracking-[0.16em] sm:w-auto sm:min-w-[140px] sm:px-5 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            variant="royal"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full min-w-0 px-4 text-[11px] tracking-[0.16em] sm:w-auto sm:min-w-[140px] sm:px-5 bg-royal-purple hover:bg-royal-purple/90 text-white hover:text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Return"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnRequestModal;
