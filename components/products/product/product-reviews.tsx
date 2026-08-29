"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, ThumbsUp, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: string[];
  variant_id: string | null;
  variant_name: string | null;
  helpful_count: number;
  customer: {
    id: string;
    name: string;
  };
  created_at: string;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: string]: number;
  };
  recommended_percentage: number;
}

// ---------------------------------------------------------------------------
// Star rating — same visual language everywhere, three sizes
// ---------------------------------------------------------------------------

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return (
            <Star
              key={star}
              size={size}
              className="fill-yellow-400 text-yellow-400"
            />
          );
        }
        if (star === fullStars + 1 && hasHalfStar) {
          return (
            <div
              key={star}
              className="relative"
              style={{ width: size, height: size }}
            >
              <Star
                size={size}
                className="absolute inset-0 text-muted-foreground/25"
              />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star size={size} className="fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          );
        }
        return (
          <Star key={star} size={size} className="text-muted-foreground/25" />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar — initials, deterministic color from the name
// ---------------------------------------------------------------------------

const AVATAR_PALETTE = [
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0]?.slice(0, 2);
  return (initials || "?").toUpperCase();
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function Avatar({ name }: { name: string }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
        getAvatarColor(name),
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rating distribution bar — plain div instead of the generic Progress
// component, so we can color it to match the star it represents
// ---------------------------------------------------------------------------

function DistributionRow({
  rating,
  count,
  total,
}: {
  rating: number;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <button
      type="button"
      className="group flex w-full items-center gap-2.5 rounded-md px-1 py-1 text-left transition-colors hover:bg-muted/60"
    >
      <span className="w-3 text-xs font-medium text-muted-foreground tabular-nums">
        {rating}
      </span>
      <Star size={11} className="fill-yellow-400 text-yellow-400 shrink-0" />
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-yellow-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
        {count}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Helpful button — now actually does something
// ---------------------------------------------------------------------------

function HelpfulButton({
  reviewId,
  count,
}: {
  reviewId: string;
  count: number;
}) {
  const [marked, setMarked] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => apiFetch.post(`/reviews/${reviewId}/helpful`, {}),
    onSuccess: () => {
      setMarked(true);
      queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
    },
  });

  const displayCount = count + (marked ? 1 : 0);

  return (
    <button
      type="button"
      disabled={marked || mutation.isPending}
      onClick={() => mutation.mutate()}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        marked
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground disabled:opacity-60",
      )}
    >
      <ThumbsUp size={12} className={marked ? "fill-primary" : ""} />
      {displayCount > 0 ? `Helpful (${displayCount})` : "Helpful"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyReviews() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Star className="h-5 w-5 text-muted-foreground/50" />
      </div>
      <div>
        <p className="font-medium text-foreground">No reviews yet</p>
        <p className="text-sm text-muted-foreground">
          Be the first to share what you think of this product.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProductReviews({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["product-review-stats", productId],
    queryFn: ({ signal }) =>
      apiFetch.get<ReviewStats>(`/reviews/product/${productId}/stats`, {
        signal,
      }),
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["product-reviews", productId, page],
    queryFn: ({ signal }) =>
      apiFetch.get<PaginatedResponse<Review>>(
        `/reviews/product/${productId}?page=${page}&limit=5`,
        { signal },
      ),
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats || stats.total_reviews === 0) {
    return <EmptyReviews />;
  }

  const reviews = reviewsData?.items || [];
  const totalPages = reviewsData?.meta?.totalPages || 1;

  return (
    <div className="space-y-8">
      {/* Rating summary */}
      <div className="grid gap-8 sm:grid-cols-[auto,1fr] sm:gap-10">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-bold leading-none tracking-tight text-foreground">
              {stats.average_rating.toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground">/5</span>
          </div>
          <StarRating rating={stats.average_rating} size={18} />
          <p className="text-sm text-muted-foreground">
            {stats.total_reviews.toLocaleString()} review
            {stats.total_reviews === 1 ? "" : "s"}
          </p>
          {stats.recommended_percentage > 0 && (
            <Badge variant="secondary" className="mt-1 gap-1 font-normal">
              <ThumbsUp size={11} />
              {stats.recommended_percentage}% would recommend
            </Badge>
          )}
        </div>

        <div className="flex flex-col justify-center gap-1.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <DistributionRow
              key={rating}
              rating={rating}
              count={stats.rating_distribution[String(rating)] || 0}
              total={stats.total_reviews}
            />
          ))}
        </div>
      </div>

      <div className="border-t" />

      {/* Reviews list */}
      <div className="divide-y">
        {reviewsLoading ? (
          <div className="space-y-6 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <article key={review.id} className="py-6 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <Avatar name={review.customer.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold leading-tight text-foreground">
                        {review.customer.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={review.rating} size={13} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    {review.variant_name && (
                      <Badge
                        variant="outline"
                        className="shrink-0 font-normal text-xs"
                      >
                        Purchased: {review.variant_name}
                      </Badge>
                    )}
                  </div>

                  {review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                      {review.comment}
                    </p>
                  )}

                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {review.images.map((image, index) => (
                        <a
                          key={index}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
                          className="block h-16 w-16 overflow-hidden rounded-lg ring-1 ring-border transition-transform hover:scale-[1.03]"
                        >
                          <img
                            src={image}
                            alt={`Photo from ${review.customer.name}'s review`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No reviews found
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
