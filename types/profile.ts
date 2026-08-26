export interface CustomerOrderItem {
  id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CustomerOrder {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items_count?: number;
  items: {
    id: string;
    product_name: string;
    variant_name?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
  // NEW — populated from getFullProfile's pending_request field
  pending_request?: PendingOrderRequest | null;
}
export enum OrderRequestType {
  CANCEL = "CANCEL",
  REFUND = "REFUND",
}

export enum OrderRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface PendingOrderRequest {
  id: string;
  type: OrderRequestType;
  reason?: string | null;
  created_at: string;
}

export interface CustomerFullProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  store_id: string;
  created_at: string;
  updated_at: string;
  orders: CustomerOrder[];
  cart: {
    id: string;
    items_count: number;
    items: Array<{
      id: string;
      product_id: string;
      variant_id: string;
      quantity: number;
    }>;
  } | null;
}

export interface CustomerCheckoutInfo {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  email: string;
  store_id: string;
}
