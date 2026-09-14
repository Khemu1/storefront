// stores/customer-auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "./cart-store";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  store_id: string;
  token: string;
}

interface CustomerAuthState {
  user: CustomerUser | null;
  isBanned: boolean;
  bannedReason: string | null;
  bannedMessage: string | null;

  setBanned: (reason?: string, message?: string) => void;
  login: (
    user: CustomerUser,
    cartSummary?: { total_items: number; total_amount: number },
  ) => void;
  logout: () => void;
  updateUser: (user: Partial<CustomerUser>) => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      user: null,
      isBanned: false,
      bannedReason: null,
      bannedMessage: null,

      setBanned: (reason, message) =>
        set({
          user: null,
          isBanned: true,
          bannedReason: reason ?? null,
          bannedMessage: message ?? null,
        }),

      login: (user, cartSummary) => {
        set({ user });

        if (cartSummary) {
          useCartStore
            .getState()
            .setTotals(cartSummary.total_items, cartSummary.total_amount);
        }
      },

      logout: () =>
        set({
          user: null,
          isBanned: false,
          bannedReason: null,
          bannedMessage: null,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : state.user,
        })),
    }),
    {
      name: "customer-auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export const useIsAuthenticated = () =>
  useCustomerAuthStore((s) => !!s.user?.token);

export const useCustomerToken = () =>
  useCustomerAuthStore((s) => s.user?.token ?? null);
