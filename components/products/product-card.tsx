// components/products/product-card.tsx
"use client";

import {
  ShoppingCart,
  AlertTriangle,
  Flame,
  Layers,
  Tag,
  Banknote,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStoreStore } from "@/stores/store-store";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    base_price: string;
    discount_price?: number | null;
    current_price?: number;
    discount_percentage?: number | null;
    has_discount?: boolean;
    has_deposit?: boolean;
    deposit_percentage?: number | null;
    images: string[];
    is_available: boolean;
    low_stock_threshold?: number;
    categories: Array<{
      id: string;
      name: string;
    }>;
    variants: Array<{
      id: string;
      price: string | null;
      discount_price?: number | null;
      current_price?: number;
      has_discount?: boolean;
      discount_percentage?: number | null;
      stock: number;
      images: string[] | null;
    }>;
  };
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  health:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
  clothing:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
  office:
    "https://images.unsplash.com/photo-1497493292307-31c376b6e479?w=600&h=600&fit=crop",
  electronics:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop",
  home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
  beauty:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop",
  sports:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
  default:
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop",
};

function getFallbackImage(categoryName: string) {
  const key = categoryName.trim().toLowerCase();
  return CATEGORY_FALLBACK_IMAGES[key] || CATEGORY_FALLBACK_IMAGES.default;
}

export function ProductCard({ product }: ProductCardProps) {
  const currency = useStoreStore((state) => state.currency);

  // Get available stock
  const totalStock = product.variants.reduce(
    (sum, variant) => sum + (variant.stock || 0),
    0,
  );

  // Get the lowest current price among variants
  const variantPrices = product.variants
    .filter((v) => v.current_price !== undefined && v.current_price !== null)
    .map((v) => Number(v.current_price));

  const displayPrice =
    variantPrices.length > 0
      ? Math.min(...variantPrices)
      : product.current_price || Number(product.base_price);

  // Get original price for strikethrough
  const originalPrice = Number(product.base_price);
  const hasDiscount = product.has_discount || displayPrice < originalPrice;
  const discountPercentage =
    product.discount_percentage ||
    (hasDiscount
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : null);

  // Deposit info
  const hasDeposit = product.has_deposit || false;
  const depositPercentage = product.deposit_percentage || null;

  // Determine stock status
  const isInStock = totalStock > 0;
  const lowStockThreshold = product.low_stock_threshold || 5;
  const isLowStock = isInStock && totalStock <= lowStockThreshold;

  const categoryName = product.categories?.[0]?.name || "";
  const productImage = product.images?.[0] || getFallbackImage(categoryName);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group border-none rounded-2xl shadow-md hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-2 overflow-hidden bg-card flex flex-col py-0 gap-0"
    >
      <div className="relative overflow-hidden aspect-square shrink-0">
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <img
          src={productImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-700 ease-out"
          onError={(e) => {
            e.currentTarget.src = getFallbackImage(categoryName);
          }}
        />

        {/* Category pill */}
        {categoryName && (
          <span className="absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-widest text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
            {categoryName}
          </span>
        )}

        {/* Badges Container - Top Right */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 items-end">
          {/* Discount Badge */}
          {hasDiscount && discountPercentage && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/40 px-3 py-1.5 rounded-full">
              <Tag size={12} />-{discountPercentage}%
            </span>
          )}

          {/* Deposit Badge */}
          {/* {hasDeposit && depositPercentage && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white bg-primary shadow-lg shadow-primary/40 px-3 py-1.5 rounded-full">
              <Banknote size={12} />
              {depositPercentage}% Deposit
            </span>
          )} */}

          {/* Low Stock Badge */}
          {isLowStock && !hasDiscount && !hasDeposit && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-orange-500/40 px-3 py-1.5 rounded-full">
              <Flame size={12} className="fill-white" />
              Low Stock
            </span>
          )}

          {/* Sold Out Badge */}
          {!isInStock && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white bg-zinc-800/90 px-3 py-1.5 rounded-full">
              <AlertTriangle size={12} />
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        {isInStock && (
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 translate-y-[130%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <Button className="w-full rounded-full gap-2 font-bold shadow-xl shadow-black/30 h-11 cursor-pointer">
              <ShoppingCart size={16} />
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-lg text-card-foreground tracking-tight line-clamp-1">
          {product.name}
        </h3>

        <p
          className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-snug min-h-10"
          dangerouslySetInnerHTML={{
            __html: product.description || "",
          }}
        ></p>

        <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-muted-foreground min-h-4">
          {product.variants.length > 0 && (
            <>
              <Layers size={13} />
              {product.variants.length} variant
              {product.variants.length !== 1 ? "s" : ""} available
            </>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-card-foreground tracking-tight">
            {displayPrice}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            {currency}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </CardContent>
    </Link>
  );
}
