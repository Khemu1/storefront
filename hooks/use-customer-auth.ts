// hooks/use-customer-auth.ts
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { CustomerUser, useIsAuthenticated } from "@/stores/customer-auth-store";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { ApiError } from "next/dist/server/api-utils";
import { useCartStore } from "@/stores/cart-store";
import { CustomerAddress } from "@/types/profile";

interface CustomerLoginResponse {
  access_token: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    store_id: string;
  };
  total_items: number;
}

export const useCustomerLogin = () => {
  const login = useCustomerAuthStore((state) => state.login);
  const setTotals = useCartStore((state) => state.setTotals);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiFetch.post<CustomerLoginResponse>(
        "/customers/login",
        credentials,
      );

      const user: CustomerUser = {
        id: response.customer.id,
        name: response.customer.name,
        email: response.customer.email,
        phone: "", // Not returned in login response
        store_id: response.customer.store_id,
        token: response.access_token,
      };

      // Login user
      login(user);

      // Update cart total items
      setTotals(response.total_items, 0);

      return user;
    },
    onSuccess: (data) => {
      toast.success("Welcome back", {
        description: `Signed in as ${data.name}`,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Login failed", {
        description: error.message || "Invalid email or password",
      });
    },
  });
};

export const useCustomerRegister = () => {
  const router = useRouter();
  const login = useCustomerAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      password: string;
      address?: CustomerAddress;
    }) => {
      const response = await apiFetch.post<CustomerLoginResponse>(
        "/customers/register",
        data,
      );

      const user: CustomerUser = {
        id: response.customer.id,
        name: response.customer.name,
        email: response.customer.email,
        phone: "",
        store_id: response.customer.store_id,
        token: response.access_token,
      };

      // Save to store
      login(user);

      return user;
    },
    onSuccess: (data) => {
      toast.success("Account created", {
        description: `Welcome, ${data.name}!`,
      });
      router.push("/products");
    },
    onError: (error) => {
      toast.error("Registration failed", {
        description: error.message || "Please try again",
      });
    },
  });
};

export const useCustomerLogout = () => {
  const router = useRouter();
  const logout = useCustomerAuthStore((state) => state.logout);

  return () => {
    logout();
    toast.success("Signed out", {
      description: "You have been logged out successfully.",
    });
    router.push("/");
  };
};

export const useCustomerUpdate = () => {
  const updateUser = useCustomerAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      phone?: string;
      address?: string;
    }) => {
      const response = await apiFetch.put<CustomerLoginResponse>(
        "/customers/me",
        data,
      );

      updateUser({
        name: response.customer.name,
        phone: response.customer.phone,
      });

      return response;
    },
    onSuccess: () => {
      toast.success("Profile updated", {
        description: "Your information has been updated successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Update failed", {
        description: error.message || "Please try again",
      });
    },
  });
};
export function useRequireAuth() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const requireAuth = (callback: () => void, from_path?: string) => {
    if (!isAuthenticated) {
      // Redirect to login
      router.push(`/login${from_path && "?redirect=" + from_path}`);
      return;
    }
    callback();
  };

  return { requireAuth, isAuthenticated };
}

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  store_id: string;
  created_at: string;
}

export function useCustomerProfile() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery<CustomerProfile>({
    queryKey: ["customer-profile"],
    queryFn: async () => {
      return apiFetch.get<CustomerProfile>("/customers/me");
    },
    enabled: isAuthenticated,
  });
}
