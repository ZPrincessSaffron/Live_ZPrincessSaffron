import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"; // ✅ Using your global button

import { useAuth } from "@/contexts/AuthContext";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  reviewText: z.string().trim().min(10).max(500),
  reviewerName: z.string().trim().min(2).max(50),
  location: z.string().trim().max(50).optional(),
});

interface WriteReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewSubmitted: () => void;
}

const WriteReviewModal = ({
  open,
  onOpenChange,
  onReviewSubmitted,
}: WriteReviewModalProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewText("");
    setReviewerName(user?.fullName || "");
    setLocation("");
    setErrors({});
  };

  // Pre-fill name ONLY once when modal opens and we have a user
  useEffect(() => {
    if (open && user?.fullName && !reviewerName) {
      setReviewerName(user.fullName);
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = reviewSchema.safeParse({
      rating,
      reviewText,
      reviewerName,
      location: location || undefined,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }

      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          reviewer_name: result.data.reviewerName,
          rating: result.data.rating,
          review_text: result.data.reviewText,
          location: result.data.location || null,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Server error");
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your experience with us!",
      });

      resetForm();
      onOpenChange(false);
      onReviewSubmitted();
    } catch (err) {
      console.error("Review submission error:", err);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-ivory border border-gold/20 shadow-elegant">
        <DialogHeader>
          <DialogTitle className="font-sans text-2xl tracking-[0.11em] text-royal-purple text-center  font-medium">
            Share Your Experience
          </DialogTitle>

          <DialogDescription className="text-center font-sans text-muted-foreground">
            Help others discover the magic of pure Kashmiri saffron
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">

          {/* ⭐ RATING */}
          <div className="text-center">
            <Label className="font-sans text-sm text-foreground mb-3 block">
              Your Rating
            </Label>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 rounded"
                >
                  <Star
                    className={`w-8 h-8 transition-all ${star <= (hoveredRating || rating)
                      ? "fill-gold text-gold drop-shadow-[0_0_10px_rgba(198,168,90,0.6)]"
                      : "text-royal-purple/20"
                      }`}
                  />
                </button>
              ))}
            </div>

            {errors.rating && (
              <p className="text-destructive text-sm mt-2">{errors.rating}</p>
            )}
          </div>

          {/* REVIEW TEXT */}
          <div>
            <Label className="font-sans text-sm text-foreground">
              Your Review
            </Label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience..."
              className="mt-2 min-h-[120px] bg-ivory border border-gold/20 focus:border-gold"
            />
            {errors.reviewText && (
              <p className="text-destructive text-sm mt-1">{errors.reviewText}</p>
            )}
          </div>

          {/* NAME */}
          <div>
            <Label className="font-sans text-sm text-foreground">
              Your Name
            </Label>
            <Input
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 bg-ivory border border-gold/20 focus:border-gold"
              required
            />
            {errors.reviewerName && (
              <p className="text-destructive text-sm mt-1">{errors.reviewerName}</p>
            )}
          </div>

          {/* LOCATION */}
          <div>
            <Label className="font-sans text-sm text-foreground">
              City (Optional)
            </Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Mumbai, Delhi"
              className="mt-2 bg-ivory border border-gold/20 focus:border-gold"
            />
            {errors.location && (
              <p className="text-destructive text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* ✅ GLOBAL BUTTON */}
          <div className="flex justify-center pt-4">
            <Button
              variant="royal" // ⭐ Using the section variant for a more elegant look
              type="submit"
              disabled={isSubmitting}
              className="min-w-[220px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewModal;
