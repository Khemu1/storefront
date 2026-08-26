// services/storefront.ts
import { apiFetch } from "@/lib/api";
import type { StoreData, ProductsResponse, Category, Product } from "@/types";

export async function fetchStoreData(
  includeProducts = true,
): Promise<StoreData> {
  return apiFetch.get<StoreData>(
    `/storefront/store?include_products=${includeProducts}`,
  );
}

// services/storefront.ts
export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.category) queryParams.set("category", params.category);
  if (params?.search) queryParams.set("search", params.search);
  if (params?.sort) queryParams.set("sort", params.sort);
  if (params?.minPrice !== undefined)
    queryParams.set("minPrice", params.minPrice.toString());
  if (params?.maxPrice !== undefined)
    queryParams.set("maxPrice", params.maxPrice.toString());

  const queryString = queryParams.toString();
  return apiFetch.get<ProductsResponse>(
    `/storefront/products${queryString ? `?${queryString}` : ""}`,
  );
}

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch.get<Category[]>("/storefront/categories");
}

export async function fetchProduct(productId: string): Promise<Product> {
  return apiFetch.get<Product>(`/storefront/products/${productId}`);
}

export async function placeOrder(orderData: any): Promise<any> {
  return apiFetch.post<any>("/storefront/orders", orderData);
}
