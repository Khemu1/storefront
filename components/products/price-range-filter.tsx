// components/products/price-range-filter.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRICE_RANGES } from "./products-reducer";

interface PriceRangeFilterProps {
  currency: string;
  selectedPriceRange: string;
  minPriceInput: string;
  maxPriceInput: string;
  hasPriceFilter: boolean;
  onQuickRangeSelect: (rangeId: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function PriceRangeFilter({
  currency,
  selectedPriceRange,
  minPriceInput,
  maxPriceInput,
  hasPriceFilter,
  onQuickRangeSelect,
  onMinPriceChange,
  onMaxPriceChange,
  onApply,
  onClear,
}: PriceRangeFilterProps) {
  return (
    <div>
      <h3 className="font-bold text-lg mb-3">Price Range</h3>

      <div className="space-y-2 mb-4">
        {PRICE_RANGES.map((range) => (
          <button
            key={range.id}
            onClick={() => onQuickRangeSelect(range.id)}
            className={cn(
              "w-full text-right px-3 py-2 rounded-lg text-sm border transition-colors",
              selectedPriceRange === range.id
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted",
            )}
          >
            {range.label} {currency}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Min"
          value={minPriceInput}
          onChange={(e) => onMinPriceChange(e.target.value)}
          className="h-10 rounded-lg text-sm"
        />
        <span className="text-muted-foreground text-sm shrink-0">to</span>
        <Input
          type="number"
          min={0}
          placeholder="Max"
          value={maxPriceInput}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          className="h-10 rounded-lg text-sm"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          className="flex-1 h-9 rounded-lg"
          onClick={onApply}
          disabled={!minPriceInput && !maxPriceInput}
        >
          Apply
        </Button>
        {hasPriceFilter && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg"
            onClick={onClear}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
