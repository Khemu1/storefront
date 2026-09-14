import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/stores/customer-auth-store";
import { apiFetch } from "@/lib/api";
import {
  CustomerAddress,
  CustomerCheckoutInfo,
  CustomerOrdersResponse,
  CustomerProfile,
} from "@/types/profile";
import { toast } from "sonner";

export function useCustomerProfile() {
  const isAuthenticated = useIsAuthenticated();

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
  const isAuthenticated = useIsAuthenticated();

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

// ==================== QUERIES ====================

export function useAddresses() {
  return useQuery({
    queryKey: ["customer-addresses"],
    queryFn: () => apiFetch.get<CustomerAddress[]>("/customers/me/addresses"),
  });
}

export function useDefaultAddress() {
  return useQuery({
    queryKey: ["customer-addresses", "default"],
    queryFn: () =>
      apiFetch.get<CustomerAddress | null>("/customers/me/addresses/default"),
  });
}

// ==================== MUTATIONS ====================

export interface AddressPayload {
  country: string;
  state: string;
  area: string;
  address: string;
  is_default?: boolean;
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddressPayload) =>
      apiFetch.post<CustomerAddress>("/customers/me/addresses", dto),
    onSuccess: () => {
      toast.success("Address added");
      qc.invalidateQueries({ queryKey: ["customer-addresses"] });
      qc.invalidateQueries({ queryKey: ["customer-profile"] });
      qc.invalidateQueries({ queryKey: ["customer-checkout-info"] });
    },
    onError: (error) => {
      toast.error("Failed to add address", {
        description: error.message,
      });
    },
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: Partial<AddressPayload> & { id: string }) =>
      apiFetch.put<CustomerAddress>(`/customers/me/addresses/${id}`, dto),
    onSuccess: () => {
      toast.success("Address updated");
      qc.invalidateQueries({ queryKey: ["customer-addresses"] });
      qc.invalidateQueries({ queryKey: ["customer-profile"] });
      qc.invalidateQueries({ queryKey: ["customer-checkout-info"] });
    },
    onError: (error) => {
      toast.error("Failed to update address", {
        description: error.message,
      });
    },
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch.patch<CustomerAddress>(
        `/customers/me/addresses/${id}/default`,
        {},
      ),
    onSuccess: () => {
      toast.success("Default address updated");
      qc.invalidateQueries({ queryKey: ["customer-addresses"] });
      qc.invalidateQueries({ queryKey: ["customer-profile"] });
      qc.invalidateQueries({ queryKey: ["customer-checkout-info"] });
    },
    onError: (error) => {
      toast.error("Failed to set default", {
        description: error.message,
      });
    },
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch.delete(`/customers/me/addresses/${id}`),
    onSuccess: () => {
      toast.success("Address deleted");
      qc.invalidateQueries({ queryKey: ["customer-addresses"] });
      qc.invalidateQueries({ queryKey: ["customer-profile"] });
      qc.invalidateQueries({ queryKey: ["customer-checkout-info"] });
    },
    onError: (error) => {
      toast.error("Failed to delete address", {
        description: error.message,
      });
    },
  });
}
