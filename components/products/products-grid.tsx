import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProductsGridProps {
  products: any[];
  isLoading: boolean;
  error: Error | null;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ProductsGrid({
  products,
  isLoading,
  error,
  hasActiveFilters,
  onClearFilters,
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive text-lg">Error loading products</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No products found</p>
        {hasActiveFilters && (
          <Button variant="outline" className="mt-5" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
