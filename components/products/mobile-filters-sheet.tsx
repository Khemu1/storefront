"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICE_RANGES } from "./products-reducer";

interface MobileFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Array<{ id: string; name: string }>;
  currency: string;
  selectedCategory: string;
  selectedPriceRange: string;
  minPriceInput: string;
  maxPriceInput: string;
  hasPriceFilter: boolean;
  onCategorySelect: (categoryId: string) => void;
  onQuickPriceRange: (rangeId: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onApplyPrice: () => void;
  onClearPrice: () => void;
  onClearAll: () => void;
}

export function MobileFiltersSheet({
  open,
  onOpenChange,
  categories,
  currency,
  selectedCategory,
  selectedPriceRange,
  minPriceInput,
  maxPriceInput,
  hasPriceFilter,
  onCategorySelect,
  onQuickPriceRange,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPrice,
  onClearPrice,
  onClearAll,
}: MobileFiltersSheetProps) {
  const hasActiveFilters =
    selectedCategory || hasPriceFilter;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close filters"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onCategorySelect("")}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm border text-center truncate transition-colors",
                  !selectedCategory
                    ? "bg-primary text-primary-foreground border-primary font-semibold"
                    : "border-border hover:bg-muted",
                )}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  title={category.name}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm border text-center truncate transition-colors",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground border-primary font-semibold"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3">Price Range</h3>

            {/* Quick ranges */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => onQuickPriceRange(range.id)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm border text-center transition-colors",
                    selectedPriceRange === range.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {range.label} {currency}
                </button>
              ))}
            </div>

            {/* Custom range */}
            <div className="flex items-center gap-2 mb-3">
              <Input
                type="number"
                min={0}
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => onMinPriceChange(e.target.value)}
                className="h-11 rounded-lg text-sm"
              />
              <span className="text-muted-foreground text-sm shrink-0">to</span>
              <Input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                className="h-11 rounded-lg text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 h-10 rounded-lg"
                onClick={onApplyPrice}
                disabled={!minPriceInput && !maxPriceInput}
              >
                Apply
              </Button>
              {hasPriceFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-lg"
                  onClick={onClearPrice}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-full"
              onClick={onClearAll}
              disabled={!hasActiveFilters}
            >
              Clear All
            </Button>
            <Button
              className="flex-1 h-11 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Show Results
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}