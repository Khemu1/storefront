// services/storefront.ts
import { apiFetch } from "@/lib/api";
import type { StoreData, Category } from "@/types";

export async function fetchStoreData(
  includeProducts = true,
): Promise<StoreData> {
  return apiFetch.get<StoreData>(
    `/storefront/store?include_products=${includeProducts}`,
  );
}

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch.get<Category[]>("/storefront/categories");
}
