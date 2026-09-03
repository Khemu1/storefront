"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  Banknote,
  Smartphone,
  Zap,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { TrackOrderResponse } from "@/types/orders";
import { StatusPill, Row } from "./order-helpers";
import { getCdnUrl } from "@/lib/utils";

interface OrderReceiptCardProps {
  order: TrackOrderResponse;
  currency: string;
}

export function OrderReceiptCard({ order, currency }: OrderReceiptCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.order_id);
    setCopied(true);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  const getPaymentMethodInfo = (method: string) => {
    const methods: Record<string, { label: string; icon: any }> = {
      COD: { label: "Cash on Delivery", icon: Banknote },
      VODAFONE_CASH: { label: "Vodafone Cash", icon: Smartphone },
      INSTAPAY: { label: "InstaPay", icon: Zap },
    };
    return methods[method] || { label: method, icon: Banknote };
  };

  const paymentInfo = getPaymentMethodInfo(order.payment_method || "COD");

  return (
    <div className="relative rounded-2xl overflow-hidden mb-7 bg-card border border-border shadow-sm">
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-1.5 text-muted-foreground">
              Order ID
            </p>
            <div className="flex items-center gap-2">
              <p
                className="font-bold text-lg font-mono text-foreground"
                dir="ltr"
              >
                {order.order_id}
              </p>
              <button
                onClick={handleCopyOrderId}
                aria-label="Copy order ID"
                className="p-1 rounded-md transition-colors text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <Check size={14} className="text-primary" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>
          <StatusPill status={order.status} />
        </div>

        <div className="h-px w-full bg-border" />

        {/* Customer + Payment */}
        <div className="space-y-3 py-5 text-sm">
          <Row label="Customer" value={order.customer?.name} />
          <Row
            label="Payment method"
            value={paymentInfo.label}
            Icon={paymentInfo.icon}
          />
          {order.deposit_amount && (
            <Row
              label="Deposit due"
              value={`${order.deposit_amount} ${currency}`}
              valueColor="text-destructive"
              mono
            />
          )}
        </div>

        <div className="h-px w-full bg-border" />

        {/* Items */}
        <div className="py-5">
          <h3 className="text-[11px] uppercase tracking-[0.12em] mb-4 text-muted-foreground">
            Items
          </h3>
          <div className="space-y-4">
            {order.items?.map((item, index) => {
              const hasImageError = imageErrors[item.id];
              const imageUrl = item.image
                ? getCdnUrl() + "/" + item.image
                : null;

              return (
                <div key={item.id || index} className="flex gap-3">
                  {/* Item Image */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    {imageUrl && !hasImageError ? (
                      <Image
                        src={imageUrl}
                        alt={item.product_name}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <ImageIcon
                          size={20}
                          className="text-muted-foreground/50"
                        />
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {item.product_name}
                    </p>
                    {item.variant_name && (
                      <p className="text-xs mt-0.5 text-muted-foreground">
                        {item.variant_name}
                      </p>
                    )}
                    <p className="text-xs mt-0.5 text-muted-foreground font-mono">
                      {item.quantity} × {item.unit_price} {currency}
                    </p>
                  </div>

                  {/* Total Price */}
                  <span className="font-semibold whitespace-nowrap text-foreground font-mono text-sm">
                    {item.total_price} {currency}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tear line */}
        <div className="border-t border-dashed my-1 border-border" />

        {/* Total */}
        <div className="flex justify-between items-baseline pt-5">
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Total
          </span>
          <span className="text-2xl font-bold text-primary font-mono">
            {order.total_amount} {currency}
          </span>
        </div>
      </div>
    </div>
  );
}
