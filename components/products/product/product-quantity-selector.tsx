"use client";

import { Minus, Plus } from "lucide-react";

interface ProductQuantitySelectorProps {
  quantity: number;
  currentStock: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductQuantitySelector({
  quantity,
  currentStock,
  onQuantityChange,
}: ProductQuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <h3 className="font-semibold">Quantity:</h3>
      <div className="flex items-center border rounded-full">
        <button
          onClick={() => onQuantityChange(quantity - 1)}
          className="p-3 hover:text-primary disabled:opacity-50 disabled:hover:text-inherit"
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="p-3 hover:text-primary disabled:opacity-50 disabled:hover:text-inherit"
          disabled={quantity >= currentStock}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
