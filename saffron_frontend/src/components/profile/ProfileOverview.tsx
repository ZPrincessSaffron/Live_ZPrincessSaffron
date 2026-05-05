import { useState, useRef } from "react";
import { User, Camera, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, ProfileUpdate } from "@/hooks/useProfile";

import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProfileOverviewProps {
  profile: Profile | null;
  userEmail: string | undefined;
  userId: string | undefined;
  onUpdate: (updates: ProfileUpdate) => Promise<boolean>;
}

const ProfileOverview = ({
  profile,
  userEmail,
  onUpdate,
}: ProfileOverviewProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    alternate_phone: profile?.alternate_phone || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Custom validation for phone fields: only 10 digits allowed
    if (name === "phone" || name === "alternate_phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Validate Primary Phone
    if (formData.phone && formData.phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Primary phone must be exactly 10 digits.",
        variant: "destructive",
      });
      return;
    }

    // Validate Alternate Phone (if provided)
    if (formData.alternate_phone && formData.alternate_phone.length !== 10) {
      toast({
        title: "Invalid Alternate Phone",
        description: "Alternate phone must be exactly 10 digits if provided.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const success = await onUpdate(formData);
    if (success) setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || "",
      phone: profile?.phone || "",
      alternate_phone: profile?.alternate_phone || "",
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Avatar file upload is not yet configured on the backend.
    // This feature will be available in a future update.
    toast({
      title: "Coming Soon",
      description: "Avatar upload will be available soon.",
    });
    e.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 md:p-8 bg-white/70 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl"
    >
      {/* HEADER */}
      <div className="relative z-10 mb-16 text-center w-full">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.30em] text-royal-purple uppercase">
          Profile Overview
        </h2>

        {!isEditing && (
          <div className="mt-8 flex justify-center">
            <Button variant="royal"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        )}
<br/>
      </div>


      <div className="flex flex-col items-center w-full">

        {/* AVATAR CENTERED */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-royal-purple/10 flex items-center justify-center overflow-hidden">
              {isUploadingAvatar ? (
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              ) : profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-royal-purple/50" />
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleAvatarClick}
              className="absolute bottom-2 right-2 w-9 h-9 rounded-full  flex items-center justify-center"
            >
              <Camera className="w-6 h-6 text-royal-purple-dark" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mt-4 tracking-wide">
            Click to upload
          </p>
        </div>

        {/* FORM FIELDS */}
        <div className=" max-w-4xl mx-auto">


          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">



            <Field
              label="Full Name"
              editing={isEditing}
              value={formData.fullName}
              name="fullName"
              onChange={handleInputChange}
              display={profile?.fullName}
            />

            <StaticField label="Email ID" value={userEmail} />

            <Field
              label="Primary Phone"
              editing={isEditing}
              value={formData.phone}
              name="phone"
              onChange={handleInputChange}
              display={profile?.phone}
              type="tel"
              maxLength={10}
            />

            <Field
              label="Alternate Phone"
              editing={isEditing}
              value={formData.alternate_phone}
              name="alternate_phone"
              onChange={handleInputChange}
              display={profile?.alternate_phone}
              type="tel"
              maxLength={10}
            />
          </div>
        </div>

        {/* CENTERED BUTTONS */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-12 w-full"
            >
              <Button 
                variant="royal" 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full sm:w-auto min-w-0 sm:min-w-[210px]"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>

              <Button 
                variant="royal" 
                onClick={handleCancel}
                className="w-full sm:w-auto min-w-0 sm:min-w-[210px]"
              >
                Cancel
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ---------- reusable fields ---------- */

const Field = ({ label, editing, value, name, onChange, display, ...props }: any) => (
  <div className="space-y-2 w-full">

    <Label className="tracking-[0.15em] text-xs uppercase">
      {label}
    </Label>
    {editing ? (
      <Input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        className="rounded-full"
        type={props.type || "text"}
        {...props}
      />
    ) : (
      <p className="py-2">{display || "Not set"}</p>
    )}
  </div>
);

const StaticField = ({ label, value }: any) => (
  <div className="space-y-2">
    <Label className="tracking-[0.15em] text-xs uppercase">
      {label}
    </Label>
    <p className="py-2 break-words">
      {value || "Not set"}
    </p>
  </div>
);

export default ProfileOverview;
