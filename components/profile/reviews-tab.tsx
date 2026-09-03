"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, Image as ImageIcon, ChevronRight } from "lucide-react";
import { getCdnUrl } from "@/lib/utils";
import type { CustomerReview, CustomerReviewsMeta } from "@/types/reviews";
import { StarRating } from "../star-rating";

interface ReviewsTabProps {
  reviews: CustomerReview[];
  isLoading: boolean;
  meta?: CustomerReviewsMeta;
}

export function ReviewsTab({ reviews, isLoading, meta }: ReviewsTabProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (reviewId: string) => {
    setImageErrors((prev) => ({ ...prev, [reviewId]: true }));
  };

  return (
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
            <Star size={40} className="mx-auto text-muted-foreground/60 mb-4" />
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
                ? getCdnUrl() + "/" + review.product_image
                : null;

              return (
                <div
                  key={review.id}
                  className="rounded-xl border border-border hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <div className="p-4">
                    {/* Header - Product and Rating */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Product Image */}
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

                      {/* Product Info */}
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

                      {/* Rating */}
                      <StarRating rating={review.rating} size={16} />
                    </div>

                    {/* Review Comment */}
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

                    {/* Footer - Date */}
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
                      <Link
                        href={`/products/${review.product_id}`}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        View Product
                        <ChevronRight size={14} className="rtl:rotate-180" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
