// hooks/use-products.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { PaginatedResponse } from "@/types";
import { ProductCard, StorefrontProductDetail } from "@/types/product";

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Fetch products list with filters
 */
export function useProducts(params?: UseProductsParams) {
  return useQuery<PaginatedResponse<ProductCard[]>>({
    queryKey: ["products", params],
    queryFn: ({ signal }) => {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());
      if (params?.category) queryParams.set("category", params.category);
      if (params?.search) queryParams.set("search", params.search);
      if (params?.sort) queryParams.set("sort", params.sort);
      if (params?.minPrice !== undefined)
        queryParams.set("minPrice", params.minPrice.toString());
      if (params?.maxPrice !== undefined)
        queryParams.set("maxPrice", params.maxPrice.toString());

      const queryString = queryParams.toString();
      const endpoint = `/storefront/products${queryString ? `?${queryString}` : ""}`;

      return apiFetch.get<PaginatedResponse<ProductCard[]>>(endpoint, {
        signal,
      });
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });
}

/**
 * Fetch single product details
 */
export function useProduct(productId: string) {
  return useQuery<StorefrontProductDetail>({
    queryKey: ["product", productId],
    queryFn: ({ signal }) =>
      apiFetch.get<StorefrontProductDetail>(
        `/storefront/products/${productId}`,
        {
          signal,
        },
      ),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
