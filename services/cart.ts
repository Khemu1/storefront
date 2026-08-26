import { apiFetch } from "@/lib/api";
import type { CartResponse } from "@/types/cart";

export async function fetchCart(): Promise<CartResponse> {
  return apiFetch.get<CartResponse>("/cart");
}

export async function addToCart(data: {
  product_id: string;
  variant_id: string;
  quantity: number;
}): Promise<CartResponse> {
  return apiFetch.post<CartResponse>("/cart/items", data);
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
): Promise<CartResponse> {
  return apiFetch.put<CartResponse>(`/cart/items/${itemId}`, { quantity });
}

export async function removeCartItem(itemId: string): Promise<CartResponse> {
  return apiFetch.delete<CartResponse>(`/cart/items/${itemId}`);
}

export async function clearCart(): Promise<CartResponse> {
  return apiFetch.delete<CartResponse>("/cart");
}
