// stores/cart-store.ts
import { create } from "zustand";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  totalDiscount: number;
  totalDeposit: number;
  totalRemaining: number;
  isLoading: boolean;
  setCart: (data: {
    items: CartItem[];
    total_items: number;
    total_amount: number;
    total_discount?: number;
    total_deposit?: number;
    total_remaining?: number;
  }) => void;
  setTotals: (totalItems: number, totalAmount: number) => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  totalDiscount: 0,
  totalDeposit: 0,
  totalRemaining: 0,
  isLoading: false,

  setCart: (data) =>
    set({
      items: data.items,
      totalItems: data.total_items,
      totalAmount: data.total_amount,
      totalDiscount: data.total_discount || 0,
      totalDeposit: data.total_deposit || 0,
      totalRemaining:
        data.total_remaining || data.total_amount - (data.total_deposit || 0),
    }),

  setTotals: (totalItems, totalAmount) =>
    set({
      totalItems,
      totalAmount,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearCart: () =>
    set({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalDeposit: 0,
      totalRemaining: 0,
    }),
}));
