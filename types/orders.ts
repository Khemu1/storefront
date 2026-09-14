// src/types/orders.ts

export interface PlaceOrderData {
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
  }>;
  payment_method: string;
  notes?: string;
  address_id: string;
}

export interface OrderItem {
  id: string; // Added - item ID from database
  product_id: string | null; // Can be null if product deleted
  variant_id: string | null; // Can be null if variant deleted
  product_name: string;
  variant_name: string | null;
  image: string | null;
  images?: string[];
  quantity: number;
  unit_price: number;
  total_price: number;
  deposit_percentage?: number | null; // Added - for deposit info
}

export interface TrackOrderResponse {
  order_id: string;
  status: string;
  total_amount: number;
  shipping_country: string | null;
  shipping_address: string | null;
  shipping_area: string | null;
  shipping_state: string | null;
  deposit_amount: number | null;
  payment_method: string;
  notes: string | null;
  items: OrderItem[];
  customer: {
    name: string;
  } | null; // Can be null if customer deleted
  created_at: string;
  updated_at: string;
}

export interface PlaceOrderResponse {
  order_id: string;
  status: string;
  total_amount: number;
  deposit_amount: number | null;
  payment_method: string;
  items: OrderItem[];
  created_at: string;
}

export type OrderRequestType = "CANCEL" | "REFUND";
export type OrderRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OrderRequest {
  id: string;
  order_id: string;
  type: OrderRequestType;
  status: OrderRequestStatus;
  reason: string | null;
  requested_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequestData {
  type: OrderRequestType;
  reason?: string;
}

export interface UpdateOrderRequestData {
  status: "APPROVED" | "REJECTED";
}
