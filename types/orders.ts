export interface PlaceOrderData {
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
  }>;
  payment_method: string;
  notes?: string;
  address?: string;
}
export interface OrderItem {
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface TrackOrderResponse {
  order_id: string;
  status: string;
  total_amount: number;
  deposit_amount: number | null;
  payment_method: string;
  items: OrderItem[];
  customer: {
    name: string;
  };
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
