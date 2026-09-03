// src/types/reviews.ts

export interface CustomerReview {
  id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  product_image: string | null;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomerReviewsMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface CustomerReviewsResponse {
  items: CustomerReview[];
  meta: CustomerReviewsMeta;
}
