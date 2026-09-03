"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/hooks/use-cart";
import { useStoreStore } from "@/stores/store-store";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Package,
  LogIn,
  Banknote,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getCdnUrl } from "@/lib/utils";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const currency = useStoreStore((state) => state.currency);
  const isAuthenticated = useCustomerAuthStore(
    (state) => state.isAuthenticated,
  );
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { data: cartData, isLoading: cartLoading } = useCart();

  const items = cartData?.items || [];
  const totalItems = cartData?.total_items || 0;
  const totalAmount = cartData?.total_amount || 0;
  const totalDiscount = cartData?.total_discount || 0;
  const totalDeposit = cartData?.total_deposit || 0;
  const totalRemaining = cartData?.total_remaining || 0;
  const totalOriginalAmount = totalAmount + totalDiscount;

  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <LogIn size={48} className="text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-heading mb-3">
            Login Required
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Please login to view your cart.
          </p>
          <Link href="/login?redirect=/cart">
            <Button size="lg" className="rounded-full px-8">
              Login
              <ArrowRight size={18} className="mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemMutation.mutate(
      { itemId, quantity: newQuantity },
      {
        onError: (error: any) => {
          toast.error(error.message || "Failed to update quantity");
        },
      },
    );
  };

  const handleRemoveItem = (itemId: string, productName: string) => {
    removeCartItemMutation.mutate(itemId, {
      onSuccess: () => {
        toast.success("Removed from cart", {
          description: productName,
        });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to remove item");
      },
    });
  };

  const handleClearCart = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Cart cleared");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to clear cart");
      },
    });
  };

  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart size={48} className="text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-heading mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button
            size="lg"
            className="rounded-full px-8"
            onClick={() => router.push("/products")}
          >
            Start Shopping
            <ArrowRight size={18} className="mr-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-2">
          Shopping Cart
        </h1>
        <p className="text-muted-foreground">{totalItems} items in your cart</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => {
            const hasImageError = imageErrors[item.id];
            const imageUrl = item.image ? getCdnUrl() + "/" + item.image : null;

            return (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-2xl border border-border bg-card"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-muted shrink-0">
                  {imageUrl && !hasImageError ? (
                    <Image
                      src={imageUrl}
                      alt={item.product_name}
                      fill
                      sizes="128px"
                      className="object-cover"
                      unoptimized
                      onError={() => handleImageError(item.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <ImageIcon
                        size={32}
                        className="text-muted-foreground/50"
                      />
                      <span className="text-xs text-muted-foreground/60">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {item.product_name}
                    </h3>
                    {item.variant_name && (
                      <p className="text-sm text-muted-foreground">
                        {item.variant_name}
                      </p>
                    )}

                    {/* Discount Badge */}
                    {item.has_discount && item.discount_percentage && (
                      <div className="mt-2 space-y-1">
                        <Badge className="bg-destructive text-destructive-foreground gap-1">
                          <Tag size={12} />-{item.discount_percentage}%
                        </Badge>
                        <p className="text-xs text-green-600">
                          You save: {item.discount_amount} {currency}
                        </p>
                      </div>
                    )}

                    {/* Deposit Info */}
                    {item.has_deposit && item.deposit_percentage && (
                      <div className="mt-2 space-y-1">
                        <Badge variant="secondary" className="gap-1">
                          <Banknote size={12} />
                          {item.deposit_percentage}% Deposit
                        </Badge>
                        <p className="text-xs text-primary">
                          Deposit now: {item.deposit_amount} {currency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Remaining: {item.remaining_amount} {currency}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-full">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:text-primary disabled:opacity-50"
                        disabled={
                          item.quantity <= 1 || updateCartItemMutation.isPending
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:text-primary disabled:opacity-50"
                        disabled={
                          item.quantity >= item.max_stock ||
                          updateCartItemMutation.isPending
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-left">
                      <span className="font-bold text-foreground">
                        {item.total_price} {currency}
                      </span>
                      {item.has_discount && item.original_total_price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {item.original_total_price} {currency}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id, item.product_name)}
                  className="self-start p-2 text-muted-foreground hover:text-destructive transition-colors"
                  disabled={removeCartItemMutation.isPending}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}

          <button
            onClick={handleClearCart}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            disabled={clearCartMutation.isPending}
          >
            <Trash2 size={14} />
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold font-heading mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              {/* Original Price */}
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
                    Discount Savings
                  </span>
                  <span className="font-semibold text-green-600">
                    -{totalDiscount} {currency}
                  </span>
                </div>
              )}

              {/* Items Total */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Items ({totalItems})
                </span>
                <span className="font-semibold">
                  {totalAmount} {currency}
                </span>
              </div>

              {/* Deposit Info */}
              {totalDeposit > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Deposit Due Now
                    </span>
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

              <Separator />

              {/* Final Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {totalAmount} {currency}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full rounded-full"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight size={18} className="mr-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full"
                onClick={() => router.push("/products")}
              >
                Continue Shopping
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                We accept
              </p>
              <div className="flex justify-center gap-3">
                <Badge variant="secondary">Cash</Badge>
                <Badge variant="secondary">Vodafone Cash</Badge>
                <Badge variant="secondary">InstaPay</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
