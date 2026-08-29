"use client";

import { Badge } from "@/components/ui/badge";
import { Banknote } from "lucide-react";

interface ProductPriceProps {
  displayPrice: number;
  originalPrice: number;
  currency: string;
  hasDiscount: boolean;
  discountPercentage: number | null;
  hasDeposit: boolean;
  depositPercentage: number | null;
  depositAmount: number | null;
  remainingAmount: number | null;
}

export function ProductPrice({
  displayPrice,
  originalPrice,
  currency,
  hasDiscount,
  discountPercentage,
  hasDeposit,
  depositPercentage,
  depositAmount,
  remainingAmount,
}: ProductPriceProps) {
  return (
    <div className="space-y-4">
      {/* Price Display */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-primary">
          {displayPrice} {currency}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {originalPrice} {currency}
            </span>
            <Badge className="bg-destructive text-destructive-foreground">
              -{discountPercentage}%
            </Badge>
          </>
        )}
      </div>

      {/* Deposit Info */}
      {hasDeposit && depositPercentage && depositAmount && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Banknote size={16} className="text-primary" />
            <p className="text-sm font-semibold text-primary">
              Requires {depositPercentage}% Deposit
            </p>
          </div>
          <div className="pl-6 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deposit amount now:</span>
              <span className="font-semibold text-primary">
                {depositAmount.toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Remaining on delivery:
              </span>
              <span className="font-semibold text-secondary">
                {remainingAmount?.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
