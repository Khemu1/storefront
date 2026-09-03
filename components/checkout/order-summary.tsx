"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowRight, Tag } from "lucide-react";
import { OrderItem } from "./order-item";
import type { CartItem } from "@/types/cart";

interface OrderSummaryProps {
  items: CartItem[];
  currency: string;
  totalItems: number;
  totalAmount: number;
  totalDeposit: number;
  totalRemaining: number;
  totalDiscount: number;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
}

export function OrderSummary({
  items,
  currency,
  totalItems,
  totalAmount,
  totalDeposit,
  totalRemaining,
  totalDiscount,
  isSubmitting,
  onPlaceOrder,
}: OrderSummaryProps) {
  const totalOriginalAmount = totalAmount + totalDiscount;

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold font-heading mb-6">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <OrderItem key={item.id} item={item} currency={currency} />
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        {/* Original Subtotal */}
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-muted-foreground line-through">
              {totalOriginalAmount} {currency}
            </span>
          </div>
        )}

        {/* Discount Savings */}
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1">
              <Tag size={14} />
              You Saved
            </span>
            <span className="font-semibold text-green-600">
              -{totalDiscount} {currency}
            </span>
          </div>
        )}

        {/* Items Total */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({totalItems})</span>
          <span className="font-semibold">
            {totalAmount} {currency}
          </span>
        </div>

        {/* Deposit Info */}
        {totalDeposit > 0 && (
          <>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deposit Due Now</span>
              <span className="font-semibold text-primary">
                {totalDeposit} {currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Remaining on Delivery
              </span>
              <span className="font-semibold text-secondary">
                {totalRemaining} {currency}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-muted-foreground">Calculated by seller</span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">
            {totalAmount} {currency}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full rounded-full mt-6"
        onClick={onPlaceOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="ml-2 animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            Place Order
            <ArrowRight size={18} className="mr-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        By placing this order, you agree to the terms and conditions
      </p>
    </div>
  );
}
