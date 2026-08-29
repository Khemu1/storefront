"use client";

import { cn } from "@/lib/utils";

interface ProductOption {
  id: string;
  name: string;
  values: Array<{
    id: string;
    value: string;
  }>;
}

interface ProductOptionsSelectorProps {
  options: ProductOption[];
  selectedOptions: Record<string, string>;
  onOptionSelect: (optionId: string, value: string) => void;
}

export function ProductOptionsSelector({
  options,
  selectedOptions,
  onOptionSelect,
}: ProductOptionsSelectorProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <h3 className="font-semibold mb-3">
            {option.name}:{" "}
            <span className="text-muted-foreground font-normal">
              {selectedOptions[option.id] || "Select"}
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => (
              <button
                key={value.id}
                onClick={() => onOptionSelect(option.id, value.value)}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                  selectedOptions[option.id] === value.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary hover:text-primary",
                )}
              >
                {value.value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
