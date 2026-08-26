// hooks/use-orders.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/stores/cart-store";
import { apiFetch } from "@/lib/api";
import {
  CreateOrderRequestData,
  OrderRequest,
  PlaceOrderData,
  TrackOrderResponse,
} from "@/types/orders";
import { toast } from "sonner";

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (orderData: PlaceOrderData) =>
      apiFetch.post("/storefront/orders", orderData),
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
export function useTrackOrder(orderId: string) {
  return useQuery<TrackOrderResponse>({
    queryKey: ["order", orderId],
    queryFn: () =>
      apiFetch.get<TrackOrderResponse>(`/storefront/orders/${orderId}`),
    enabled: !!orderId,
  });
}

export function useCreateOrderRequest(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequestData) =>
      apiFetch.post(`/orders/customer/orders/${orderId}/requests`, data),
    onSuccess: () => {
      toast.success("Request submitted", {
        description: "We'll review your request shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["order-requests", orderId] });
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
    },
    onError: (error: any) => {
      toast.error("Request failed", {
        description: error.message || "Please try again",
      });
    },
  });
}

export function useOrderRequests(orderId: string) {
  return useQuery<OrderRequest[]>({
    queryKey: ["order-requests", orderId],
    queryFn: () =>
      apiFetch.get<OrderRequest[]>(
        `/orders/customer/orders/${orderId}/requests`,
      ),
    enabled: !!orderId,
  });
}

export function useCancelOrderDirectly(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch.put(`/orders/customer/orders/${orderId}/cancel`, {}),
    onSuccess: () => {
      toast.success("Order cancelled", {
        description: "Your order has been cancelled successfully.",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey.some(
            (k) => typeof k === "string" && k.toLowerCase().includes("profile"),
          ),
      });
    },
    onError: (error: any) => {
      toast.error("Failed to cancel order", {
        description: error.message || "Please try again",
      });
    },
  });
}
