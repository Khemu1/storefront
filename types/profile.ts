// src/types/customer.ts

// ==================== ENUMS ====================

export enum OrderRequestType {
  CANCEL = "CANCEL",
  REFUND = "REFUND",
}

export enum OrderRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ==================== ORDER TYPES ====================

export interface CustomerOrderItem {
  id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  deposit_percentage?: number | null;
  /** Main image URL (storage path - needs CDN prefix) */
  image: string | null;
  /** All image URLs (storage paths - need CDN prefix) */
  images?: string[];
}

export interface PendingOrderRequest {
  id: string;
  type: OrderRequestType;
  reason?: string | null;
  created_at: string;
}

export interface CustomerOrder {
  id: string;
  status: string;
  total_amount: number;
  deposit_amount?: number | null;
  created_at: string;
  updated_at?: string;
  items_count?: number;
  items: CustomerOrderItem[];
  pending_request?: PendingOrderRequest | null;
}

export interface CustomerOrdersMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface CustomerOrdersResponse {
  items: CustomerOrder[];
  meta: CustomerOrdersMeta;
}

// ==================== PROFILE TYPES ====================

export interface CustomerProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  store_id: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCheckoutInfo {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  email: string;
  store_id: string;
}

// ==================== CART TYPES ====================

export interface CustomerCartSummary {
  id: string;
  items_count: number;
  items: Array<{
    id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
  }>;
}
