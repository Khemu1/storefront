// hooks/use-products.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { Product, ProductsResponse } from "@/types";

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Fetch products list with filters
 */
export function useProducts(params?: UseProductsParams) {
  return useQuery<ProductsResponse>({
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

      return apiFetch.get<ProductsResponse>(endpoint, { signal });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch single product details
 */
export function useProduct(productId: string) {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: ({ signal }) =>
      apiFetch.get<Product>(`/storefront/products/${productId}`, { signal }),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch featured products (for home page)
 */
export function useFeaturedProducts(limit: number = 8) {
  return useQuery<ProductsResponse>({
    queryKey: ["featured-products", limit],
    queryFn: ({ signal }) =>
      apiFetch.get<ProductsResponse>(
        `/storefront/products?limit=${limit}&page=1`,
        { signal },
      ),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch products by category
 */
export function useCategoryProducts(categoryId: string, page?: number) {
  return useQuery<ProductsResponse>({
    queryKey: ["category-products", categoryId, page],
    queryFn: ({ signal }) =>
      apiFetch.get<ProductsResponse>(
        `/storefront/products?category=${categoryId}&page=${page || 1}`,
        { signal },
      ),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Search products
 */
export function useSearchProducts(search: string, page?: number) {
  return useQuery<ProductsResponse>({
    queryKey: ["search-products", search, page],
    queryFn: ({ signal }) =>
      apiFetch.get<ProductsResponse>(
        `/storefront/products?search=${encodeURIComponent(search)}&page=${page || 1}`,
        { signal },
      ),
    enabled: !!search && search.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
