// src/components/reviews/review-form-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Loader2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import UppyAttachmentUploader from "@/components/uppy/uppy-attachment-uploader";
import { getCdnUrl, cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { AppDialog } from "../ui/app-dialog";

const MAX_IMAGES = 3;

interface UploadedImage {
  id: string;
  url: string;
}

interface ExistingReview {
  id: string;
  rating: number;
  comment: string | null;
  images: string[];
}

interface ReviewFormDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  orderId?: string;
  productImage: string | null;
  /** When provided, dialog is in edit mode */
  existingReview?: ExistingReview | null;
}

export function ReviewFormDialog({
  open,
  onClose,
  productId,
  variantId,
  productName,
  variantName,
  orderId,
  productImage,
  existingReview,
}: ReviewFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!existingReview;

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [productImageError, setProductImageError] = useState(false);
  const [reviewImageErrors, setReviewImageErrors] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (open) {
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment || "");
        setImages(
          (existingReview.images || []).map((url) => ({
            id: url,
            url,
          })),
        );
      } else {
        setRating(0);
        setComment("");
        setImages([]);
      }
      setHoveredRating(0);
      setProductImageError(false);
      setReviewImageErrors({});
    }
  }, [open, existingReview]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const body = {
        rating,
        comment: comment.trim(),
        images: images.map((img) => img.url),
      };

      if (isEditMode && existingReview) {
        return apiFetch.put(`/reviews/${existingReview.id}`, body);
      }

      return apiFetch.post("/reviews", {
        product_id: productId,
        variant_id: variantId,
        order_id: orderId,
        ...body,
      });
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Review updated" : "Review submitted", {
        description: isEditMode
          ? "Your changes have been saved"
          : "Thank you for your feedback!",
      });
      queryClient.invalidateQueries({ queryKey: ["customer-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["product-review-stats"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(
        isEditMode ? "Failed to update review" : "Failed to submit review",
        {
          description: error.message || "Please try again later",
        },
      );
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    submitMutation.mutate();
  };

  const handleUploadComplete = (data: { id: string; url: string }) => {
    setImages((prev) => [...prev, { id: data.id, url: data.url }]);
  };

  const handleRemoveImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const displayRating = hoveredRating || rating;

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Review" : "Review Product"}
    >
      <div className="space-y-5 py-2 overflow-y-auto h-[65dvh]">
        {/* Product Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
            {productImage && !productImageError ? (
              <Image
                src={
                  productImage.startsWith("http")
                    ? productImage
                    : getCdnUrl() + "/" + productImage
                }
                alt={productName}
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
                onError={() => setProductImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={20} className="text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{productName}</p>
            {variantName && (
              <p className="text-xs text-muted-foreground truncate">
                {variantName}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label>
            Rating <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              >
                <Star
                  size={32}
                  className={cn(
                    "transition-colors cursor-pointer",
                    star <= displayRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30",
                  )}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Your Review (Optional)</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you liked or disliked about this product..."
            rows={4}
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground text-right">
            {comment.length}/1000
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Add Photos (Optional)
            <span className="text-xs text-muted-foreground ml-2">
              {images.length}/{MAX_IMAGES}
            </span>
          </Label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((image) => {
                const hasError = reviewImageErrors[image.id];

                return (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
                  >
                    {!hasError ? (
                      <Image
                        src={getCdnUrl() + "/" + image.url}
                        alt="Review image"
                        fill
                        sizes="120px"
                        className="object-cover"
                        unoptimized
                        onError={() =>
                          setReviewImageErrors((prev) => ({
                            ...prev,
                            [image.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon
                          size={24}
                          className="text-muted-foreground/50"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {images.length < MAX_IMAGES && (
            <UppyAttachmentUploader
              key={`review-images-${images.length}`}
              maxFiles={MAX_IMAGES - images.length}
              fileTypes="images"
              instantUpload={true}
              allowCrop={false}
              onUploadComplete={handleUploadComplete}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={submitMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitMutation.isPending || rating === 0}
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              {isEditMode ? "Saving..." : "Submitting..."}
            </>
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </AppDialog>
  );
}
