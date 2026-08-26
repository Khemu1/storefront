// hooks/use-store.ts
import { useQuery } from "@tanstack/react-query";
import { fetchStoreData } from "@/services/storefront";
import type { StoreData } from "@/types";

export function useStore(includeProducts = true) {
  return useQuery<StoreData>({
    queryKey: ["store", { includeProducts }],
    queryFn: () => fetchStoreData(includeProducts),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
