// stores/store-store.ts
import { create } from "zustand";
import type { StoreData, Category, Product, PaymentMethods } from "@/types";

interface StoreState {
  storeData: StoreData | null;
  storeName: string;
  storeDescription: string;
  currency: string;
  whatsapp: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  paymentMethods: PaymentMethods;
  showOutOfStock: boolean;
  themeColor: string | null;
  categories: Category[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: Error | null;
  setStoreData: (data: StoreData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  getCategoryById: (id: string) => Category | undefined;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  storeData: null,
  storeName: "",
  storeDescription: "",
  currency: "EGP",
  whatsapp: "",
  logoUrl: null,
  bannerUrl: null,
  paymentMethods: {
    cod: { enabled: true },
    vodafone_cash: { enabled: false, accounts: [] },
    instapay: { enabled: false, accounts: [] },
  },
  showOutOfStock: true,
  themeColor: null,
  categories: [],
  featuredProducts: [],
  isLoading: true,
  error: null,

  setStoreData: (data) =>
    set({
      storeData: data,
      storeName: data.store.name,
      storeDescription: data.store.description || "",
      currency: data.store.currency || "EGP",
      whatsapp: data.store.whatsapp_number || "",
      logoUrl: data.store.logo_url,
      bannerUrl: data.store.banner_url,
      paymentMethods: data.settings.payment_methods,
      showOutOfStock: data.settings.show_out_of_stock,
      themeColor: data.settings.theme_color,
      categories: data.categories || [],
      featuredProducts: data.featured_products || [],
      isLoading: false,
      error: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),

  getCategoryById: (id) => {
    return get().categories.find((cat) => cat.id === id);
  },
}));
