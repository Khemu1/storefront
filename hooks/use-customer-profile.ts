// hooks/use-customer-profile.ts
import { useQuery } from "@tanstack/react-query";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { apiFetch } from "@/lib/api";
import {
  CustomerCheckoutInfo,
  CustomerOrdersResponse,
  CustomerProfile,
} from "@/types/profile";

export function useCustomerProfile() {
  const isAuthenticated = useCustomerAuthStore(
    (state) => state.isAuthenticated,
  );

  return useQuery<CustomerProfile>({
    queryKey: ["customer-full-profile"],
    queryFn: async () => {
      return apiFetch.get<CustomerProfile>("/customers/me");
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
export function useCustomerCheckoutInfo() {
  const isAuthenticated = useCustomerAuthStore(
    (state) => state.isAuthenticated,
  );

  return useQuery<CustomerCheckoutInfo>({
    queryKey: ["customer-checkout-info"],
    queryFn: () =>
      apiFetch.get<CustomerCheckoutInfo>("/customers/me/checkout-info"),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCustomerOrders(
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
) {
  return useQuery<CustomerOrdersResponse>({
    queryKey: ["customer-orders", page, limit],
    queryFn: ({ signal }) =>
      apiFetch.get<CustomerOrdersResponse>(
        `/storefront/orders/me?page=${page}&limit=${limit}`,
        { signal },
      ),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}
