import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveFiltersProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  hasPriceFilter: boolean;
  priceRangeLabel: string;
  search: string;
  currency: string;
  onClearCategory: () => void;
  onClearPriceRange: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  categories,
  selectedCategory,
  hasPriceFilter,
  priceRangeLabel,
  search,
  currency,
  onClearCategory,
  onClearPriceRange,
  onClearSearch,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters = search || selectedCategory || hasPriceFilter;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {selectedCategory && (
        <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 text-sm">
          {categories.find((c) => c.id === selectedCategory)?.name}
          <button onClick={onClearCategory}>
            <X size={12} />
          </button>
        </Badge>
      )}
      {hasPriceFilter && (
        <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 text-sm">
          {priceRangeLabel} {currency}
          <button onClick={onClearPriceRange}>
            <X size={12} />
          </button>
        </Badge>
      )}
      {search && (
        <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 text-sm">
          Search: {search}
          <button onClick={onClearSearch}>
            <X size={12} />
          </button>
        </Badge>
      )}
      <button
        onClick={onClearAll}
        className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
      >
        Clear all
      </button>
    </div>
  );
}
