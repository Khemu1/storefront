// src/components/profile/reviews-tab.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { getCdnUrl } from "@/lib/utils";
import type { CustomerReview, CustomerReviewsMeta } from "@/types/reviews";
import { StarRating } from "../star-rating";
import { ReviewFormDialog } from "../orders/review-form-dialog";
import { confirm } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

interface ReviewsTabProps {
  reviews: CustomerReview[];
  isLoading: boolean;
  meta?: CustomerReviewsMeta;
}

export function ReviewsTab({ reviews, isLoading, meta }: ReviewsTabProps) {
  const queryClient = useQueryClient();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(
    null,
  );

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) =>
      apiFetch.delete(`/reviews/${reviewId}`),
    onSuccess: () => {
      toast.success("Review deleted", {
        description: "Your review has been removed",
      });
      queryClient.invalidateQueries({ queryKey: ["customer-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["product-review-stats"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete review", {
        description: error.message || "Please try again later",
      });
    },
  });

  const handleImageError = (reviewId: string) => {
    setImageErrors((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleDelete = (review: CustomerReview) => {
    confirm({
      title: "Delete Review",
      description: `Are you sure you want to delete your review for "${review.product_name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "destructive",
      icon: <Trash2 size={20} />,
      onConfirm: async () => {
        await deleteReviewMutation.mutateAsync(review.id);
      },
    });
  };

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold font-heading mb-1">My reviews</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {meta?.totalItems
              ? `${meta.totalItems} review${meta.totalItems === 1 ? "" : "s"} written so far.`
              : "Review products you've purchased."}
          </p>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : !reviews?.length ? (
            <div className="text-center py-12">
              <Star
                size={40}
                className="mx-auto text-muted-foreground/60 mb-4"
              />
              <p className="font-medium mb-1">No reviews yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Reviews you write will show up here.
              </p>
              <Link href="/products">
                <Button variant="outline" className="rounded-full">
                  Browse products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const hasImageError = imageErrors[review.id];
                const imageUrl = review.product_image
                  ? review.product_image.startsWith("http")
                    ? review.product_image
                    : getCdnUrl() + "/" + review.product_image
                  : null;

                return (
                  <div
                    key={review.id}
                    className="rounded-xl border border-border hover:border-primary/50 hover:shadow-sm transition-all"
                  >
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <Link
                          href={`/products/${review.product_id}`}
                          className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0"
                        >
                          {imageUrl && !hasImageError ? (
                            <Image
                              src={imageUrl}
                              alt={review.product_name}
                              fill
                              sizes="56px"
                              className="object-cover"
                              unoptimized
                              onError={() => handleImageError(review.id)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon
                                size={20}
                                className="text-muted-foreground/50"
                              />
                            </div>
                          )}
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${review.product_id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {review.product_name}
                          </Link>
                          {review.variant_name && (
                            <p className="text-xs text-muted-foreground">
                              {review.variant_name}
                            </p>
                          )}
                        </div>

                        <StarRating rating={review.rating} size={16} />
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <p className="text-sm text-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      )}

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted"
                            >
                              <Image
                                src={getCdnUrl() + "/" + image}
                                alt={`Review ${index + 1}`}
                                fill
                                sizes="64px"
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer with Edit/Delete */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>

                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            onClick={() => setEditingReview(review)}
                          >
                            <Pencil size={12} />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDelete(review)}
                          >
                            <Trash2 size={12} />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingReview && (
        <ReviewFormDialog
          open={!!editingReview}
          onClose={() => setEditingReview(null)}
          productId={editingReview.product_id}
          variantId={editingReview.variant_id}
          productName={editingReview.product_name}
          variantName={editingReview.variant_name}
          productImage={editingReview.product_image}
          existingReview={{
            id: editingReview.id,
            rating: editingReview.rating,
            comment: editingReview.comment,
            images: editingReview.images || [],
          }}
        />
      )}
    </>
  );
}
