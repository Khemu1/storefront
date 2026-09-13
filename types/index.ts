import { ProductCard } from "./product";

// types/index.ts
export interface VodafoneCashAccount {
  id: string;
  phone_number: string;
  label?: string;
}

export interface InstaPayAccount {
  id: string;
  type: "handle" | "phone" | "link";
  value: string;
  label?: string;
}

export interface PaymentMethods {
  cod: {
    enabled: boolean;
  };
  vodafone_cash: {
    enabled: boolean;
    accounts: VodafoneCashAccount[];
  };
  instapay: {
    enabled: boolean;
    accounts: InstaPayAccount[];
  };
}

export interface StoreData {
  store: {
    id: string;
    name: string;
    description: string;
    logo_url: string | null;
    banner_url: string | null;
    whatsapp_number: string;
    currency: string;
    locale: string;
  };
  settings: {
    payment_methods: PaymentMethods;
    show_out_of_stock: boolean;
    theme_color: string | null;
  };
  categories: Category[];
  featured_products?: ProductCard[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  has_deposit: boolean;
  deposit_percentage: number | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export type NewAttachmentSource = UploadFileInfo | { id: number };
export interface UploadFileInfo {
  key: string;
  name: string;
  size: number;
  mime_type: string;
}

export interface AttachmentSource {
  id: number;
  filename: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}
