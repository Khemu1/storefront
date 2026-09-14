export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  original_unit_price?: number;
  total_price: number;
  original_total_price?: number;
  discount_percentage?: number | null;
  discount_amount?: number;
  has_discount?: boolean;
  has_deposit?: boolean;
  deposit_percentage?: number | null;
  deposit_amount?: number;
  remaining_amount?: number;
  stock: number;
  max_stock: number;
  image: string | null;
  images?: string[];
}

export interface CartResponse {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  total_discount: number;
  total_deposit: number;
  total_remaining: number;
}
