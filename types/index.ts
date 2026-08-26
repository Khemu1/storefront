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
  featured_products?: Product[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  has_deposit: boolean;
  deposit_percentage: number | null;
}

export interface ProductOption {
  id: string;
  name: string;
  values: Array<{
    id: string;
    value: string;
  }>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  base_price: string;
  discount_price?: number | null;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
  current_price?: number;
  discount_percentage?: number | null;
  has_discount?: boolean;
  images: string[];
  is_available: boolean;
  low_stock_threshold?: number;
  has_deposit?: boolean;
  deposit_percentage?: number | null;
  deposit_amount?: number | null;

  categories: Array<{
    id: string;
    name: string;
  }>;
  options?: ProductOption[];
  variants: Array<{
    id: string;
    price: string | null;
    discount_price?: number | null;
    current_price?: number;
    discount_percentage?: number | null;
    has_discount?: boolean;
    stock: number;
    images: string[] | null;
    option_values?: Array<{
      option_name: string;
      value: string;
      option?: {
        id: string;
        name: string;
      };
    }>;
  }>;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
