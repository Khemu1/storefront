"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Image as ImageIcon } from "lucide-react";
import { getCdnUrl } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface OrderItemProps {
  item: CartItem;
  currency: string;
}

export function OrderItem({ item, currency }: OrderItemProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = item.image ? getCdnUrl() + "/" + item.image : null;

  return (
    <div className="flex gap-3">
      {/* Product Image */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={item.product_name}
            fill
            sizes="56px"
            className="object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ImageIcon size={20} className="text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
        {item.variant_name && (
          <p className="text-xs text-muted-foreground">{item.variant_name}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {item.quantity} × {item.unit_price} {currency}
        </p>
        {item.has_deposit && item.deposit_percentage && (
          <p className="text-xs text-primary mt-0.5">
            Deposit: {item.deposit_amount} {currency}
          </p>
        )}
      </div>

      {/* Total Price */}
      <span className="text-sm font-semibold shrink-0">
        {item.total_price} {currency}
      </span>
    </div>
  );
}
