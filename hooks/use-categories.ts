// hooks/use-categories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/storefront";
import type { Category } from "@/types";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
