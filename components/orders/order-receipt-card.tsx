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
  MapPin,
  StickyNote,
  User,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import type { TrackOrderResponse } from "@/types/orders";
import { StatusPill } from "./order-helpers";
import { getCdnUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EGYPT_GOVERNORATES } from "@/lib/egypt-locations";
import { useStoreStore } from "@/stores/store-store";
import { CancelOrderButton } from "./cancel-order-button";

interface OrderReceiptCardProps {
  order: TrackOrderResponse;
  currency: string;
  /**
   * When true, hides the card's own "Print Receipt" button and any other
   * user-facing controls. Used when this card is rendered into a hidden
   * print-only container (see usePrintOrder) where window.print() is
   * triggered externally and there's no one around to click a button.
   */
  hideActions?: boolean;
}

export function OrderReceiptCard({
  order,
  currency,
  hideActions,
}: OrderReceiptCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const storeName = useStoreStore((state) => state.storeName);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.order_id);
    setCopied(true);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  const handlePrint = () => {
    window.print();
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

  const gov = EGYPT_GOVERNORATES.find((g) => g.value === order.shipping_state);
  const stateLabel = gov?.label ?? order.shipping_state ?? null;
  const areaLabel =
    gov?.areas.find((a) => a.value === order.shipping_area)?.label ??
    order.shipping_area ??
    null;

  const hasShippingInfo =
    order.shipping_address || stateLabel || order.shipping_country;

  return (
    <>
      {!hideActions && (
        <div className="no-print flex justify-end items-center gap-2 mb-3">
          <CancelOrderButton orderId={order.order_id} status={order.status} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full gap-2"
            onClick={handlePrint}
          >
            <Printer size={14} />
            Print Receipt
          </Button>
        </div>
      )}

      <div
        id="print-area"
        className="rounded-2xl overflow-hidden mb-7 bg-card border border-border shadow-sm"
      >
        {storeName && (
          <div className="print-brand-bg bg-primary text-gray-200 px-6 sm:px-7 py-4">
            <p className="font-heading font-bold text-lg leading-tight">
              {storeName}
            </p>
            <p className="text-xs opacity-90 mt-0.5">Order Receipt</p>
          </div>
        )}

        {/* ==================== HEADER ==================== */}
        <div className="px-6 sm:px-7 py-5 flex items-start justify-between gap-3 border-b border-border bg-muted/20">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.15em] mb-1 text-muted-foreground font-medium">
              Order ID
            </p>
            <div className="flex items-center gap-1.5">
              <p
                className="font-bold text-base font-mono text-foreground truncate"
                dir="ltr"
              >
                #{order.order_id.slice(0, 8).toUpperCase()}
              </p>
              {!hideActions && (
                <button
                  onClick={handleCopyOrderId}
                  aria-label="Copy order ID"
                  className="no-print p-1 rounded-md transition-colors text-muted-foreground hover:text-foreground shrink-0"
                >
                  {copied ? (
                    <Check size={13} className="text-primary" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Status Pill — hidden on print */}
          <div className="no-print">
            <StatusPill status={order.status} />
          </div>
        </div>

        {/* ==================== INFO GRID ==================== */}
        <div className="px-6 sm:px-7 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-b border-border">
          <InfoBlock
            icon={<User size={14} />}
            label="Customer"
            value={order.customer?.name || "—"}
          />

          <InfoBlock
            icon={<paymentInfo.icon size={14} />}
            label="Payment"
            value={paymentInfo.label}
          />

          {order.deposit_amount != null && order.deposit_amount > 0 && (
            <InfoBlock
              icon={<Banknote size={14} />}
              label="Deposit due"
              value={`${order.deposit_amount} ${currency}`}
              valueClassName="text-destructive"
              mono
            />
          )}

          <InfoBlock
            icon={null}
            label="Placed on"
            value={new Date(order.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </div>

        {/* ==================== SHIPPING ADDRESS ==================== */}
        {hasShippingInfo && (
          <div className="px-6 sm:px-7 py-5 border-b border-border avoid-break">
            <SectionLabel
              icon={<MapPin size={13} />}
              label="Shipping Address"
            />

            <div className="mt-3 space-y-1 text-sm">
              {order.shipping_address && (
                <p className="font-medium text-foreground leading-snug">
                  {order.shipping_address}
                </p>
              )}
              {(areaLabel || stateLabel) && (
                <p className="text-muted-foreground leading-snug">
                  {[areaLabel, stateLabel].filter(Boolean).join(" · ")}
                </p>
              )}
              {order.shipping_country && (
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  {order.shipping_country}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ==================== NOTES ==================== */}
        {order.notes && (
          <div className="px-6 sm:px-7 py-5 border-b border-border avoid-break">
            <SectionLabel icon={<StickyNote size={13} />} label="Order Notes" />

            <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 p-3">
              <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-wrap">
                {order.notes}
              </p>
            </div>
          </div>
        )}

        {/* ==================== ITEMS ==================== */}
        <div className="px-6 sm:px-7 py-5">
          <SectionLabel
            label={`Items · ${order.items?.length || 0}`}
            icon={<ImageIcon size={13} />}
          />

          <div className="mt-4 space-y-4">
            {order.items?.map((item, index) => {
              const hasImageError = imageErrors[item.id];
              const imageUrl = item.image
                ? getCdnUrl() + "/" + item.image
                : null;

              return (
                <div key={item.id || index} className="flex gap-3 avoid-break">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
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
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon
                          size={18}
                          className="text-muted-foreground/40"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {item.product_name}
                    </p>
                    {item.variant_name && (
                      <p className="text-xs mt-0.5 text-muted-foreground truncate">
                        {item.variant_name}
                      </p>
                    )}
                    <p className="text-xs mt-1 text-muted-foreground font-mono">
                      {item.quantity} × {item.unit_price} {currency}
                    </p>
                  </div>

                  <span className="font-semibold whitespace-nowrap text-foreground font-mono text-sm pt-0.5">
                    {item.total_price} {currency}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== TOTAL ==================== */}
        <div className="border-t border-dashed border-border" />
        <div className="px-6 sm:px-7 py-5 flex justify-between items-baseline bg-muted/20 avoid-break">
          <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Total
          </span>
          <span className="print-brand-text text-2xl font-bold text-primary font-mono">
            {order.total_amount} {currency}
          </span>
        </div>
      </div>
    </>
  );
}

/* ==================== SUB COMPONENTS ==================== */

function SectionLabel({
  icon,
  label,
}: {
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon && <span className="text-primary">{icon}</span>}
      <h3 className="text-[11px] uppercase tracking-[0.12em] font-medium">
        {label}
      </h3>
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  value,
  valueClassName,
  mono,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      {icon && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary mt-0.5">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm font-medium text-foreground truncate ${
            mono ? "font-mono" : ""
          } ${valueClassName || ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
