"use client";

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useTrackOrder } from "@/hooks/use-orders";
import { OrderReceiptCard } from "@/components/orders/order-receipt-card";
import { Button } from "@/components/ui/button";

interface PrintOrderDialogProps {
  orderId: string | null;
  currency: string;
  onClose: () => void;
}

/**
 * Fetches the full order detail (same shape OrderReceiptCard already
 * renders on the order-confirmation/tracking page) only when opened, and
 * reuses OrderReceiptCard so the receipt layout lives in exactly one
 * place. This overlay itself is hidden on print (.no-print) — only
 * OrderReceiptCard's own #print-area is meant to end up on paper, same
 * as the tracking page.
 */
export function PrintOrderDialog({
  orderId,
  currency,
  onClose,
}: PrintOrderDialogProps) {
  const { data: order, isLoading } = useTrackOrder(orderId ?? "");

  // Close on Escape for convenience
  useEffect(() => {
    if (!orderId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [orderId, onClose]);

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
      <div className="no-print flex justify-end w-full max-w-2xl mb-3">
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="rounded-full"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </Button>
      </div>

      <div className="w-full max-w-2xl">
        {isLoading || !order ? (
          <div className="no-print flex items-center justify-center rounded-2xl bg-card border border-border py-24">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <OrderReceiptCard order={order} currency={currency} />
        )}
      </div>
    </div>
  );
}
