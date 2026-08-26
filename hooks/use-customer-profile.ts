// hooks/use-customer-profile.ts
import { useQuery } from "@tanstack/react-query";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { apiFetch } from "@/lib/api";
import { CustomerCheckoutInfo, CustomerFullProfile } from "@/types/profile";

export function useCustomerProfile() {
  const isAuthenticated = useCustomerAuthStore(
    (state) => state.isAuthenticated,
  );

  return useQuery<CustomerFullProfile>({
    queryKey: ["customer-full-profile"],
    queryFn: async () => {
      return apiFetch.get<CustomerFullProfile>("/customers/me");
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
