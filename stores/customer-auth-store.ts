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
  isAuthenticated: boolean;
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
      isAuthenticated: false,

      login: (user, cartSummary) => {
        // Set user
        set({
          user,
          isAuthenticated: true,
        });

        // Update cart store with summary
        if (cartSummary) {
          useCartStore
            .getState()
            .setTotals(cartSummary.total_items, cartSummary.total_amount);
        }
      },

      logout: () => {
        // Clear cart when logging out
        useCartStore.getState().clearCart();

        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : state.user,
        })),
    }),
    {
      name: "customer-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
