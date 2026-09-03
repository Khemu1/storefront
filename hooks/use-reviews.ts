import { useQuery } from "@tanstack/react-query";
import type { CustomerReviewsResponse } from "@/types/reviews";
import { apiFetch } from "@/lib/api";

export function useCustomerReviews(enabled: boolean = true) {
  return useQuery<CustomerReviewsResponse>({
    queryKey: ["customer-reviews"],
    queryFn: ({ signal }) =>
      apiFetch.get<CustomerReviewsResponse>("/reviews/mine", { signal }),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}
