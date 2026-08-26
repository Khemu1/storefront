// hooks/use-cart.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { toast } from "sonner";
import type { CartResponse } from "@/types/cart";

// Types for mutations
interface AddToCartData {
  product_id: string;
  variant_id: string;
  quantity: number;
}

interface UpdateCartItemData {
  itemId: string;
  quantity: number;
}

/**
 * Fetch full cart data
 * Used in cart page and checkout page
 */
export function useCart() {
  const isAuthenticated = useCustomerAuthStore(
    (state) => state.isAuthenticated,
  );

  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: ({ signal }) => apiFetch.get<CartResponse>("/cart", { signal }),
    enabled: isAuthenticated,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch only cart count for navbar badge
 * Lighter query that only returns total_items
 */
export function useCartCount() {
  const isAuthenticated = useCustomerAuthStore(
    (state) => state.isAuthenticated,
  );

  return useQuery<number>({
    queryKey: ["cart-count"],
    queryFn: async ({ signal }) => {
      const cart = await apiFetch.get<CartResponse>("/cart", { signal });
      return cart.total_items;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

/**
 * Add item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartData) =>
      apiFetch.post<CartResponse>("/cart/items", data),
    onSuccess: (data) => {
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });

      // Set cart data directly
      if (data) {
        queryClient.setQueryData<CartResponse>(["cart"], data);
        queryClient.setQueryData<number>(["cart-count"], data.total_items);
      }
    },
    onError: (error) => {
      toast.error("Failed to add to cart", {
        description: error.message || "Please try again",
      });
    },
  });
}

/**
 * Update cart item quantity
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: UpdateCartItemData) =>
      apiFetch.put<CartResponse>(`/cart/items/${itemId}`, { quantity }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });

      if (data) {
        queryClient.setQueryData<CartResponse>(["cart"], data);
        queryClient.setQueryData<number>(["cart-count"], data.total_items);
      }
    },
    onError: (error) => {
      toast.error("Failed to update quantity", {
        description: error.message || "Please try again",
      });
    },
  });
}

/**
 * Remove item from cart
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) =>
      apiFetch.delete<CartResponse>(`/cart/items/${itemId}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });

      if (data) {
        queryClient.setQueryData<CartResponse>(["cart"], data);
        queryClient.setQueryData<number>(["cart-count"], data.total_items);
      }
    },
    onError: (error) => {
      toast.error("Failed to remove item", {
        description: error.message || "Please try again",
      });
    },
  });
}

/**
 * Clear entire cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiFetch.delete<CartResponse>("/cart"),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });

      if (data) {
        queryClient.setQueryData<CartResponse>(["cart"], data);
        queryClient.setQueryData<number>(["cart-count"], 0);
      }
    },
    onError: (error) => {
      toast.error("Failed to clear cart", {
        description: error.message || "Please try again",
      });
    },
  });
}
