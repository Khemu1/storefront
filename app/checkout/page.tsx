// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { useStoreStore } from "@/stores/store-store";
import { useCustomerCheckoutInfo, useCustomerProfile } from "@/hooks/use-customer-profile";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Phone,
  MapPin,
  Banknote,
  Smartphone,
  Zap,
  Loader2,
  ArrowRight,
  Package,
  Check,
  StickyNote,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { usePlaceOrder } from "@/hooks/use-orders";

export default function CheckoutPage() {
  const router = useRouter();
  const currency = useStoreStore((state) => state.currency);
  const paymentMethods = useStoreStore((state) => state.paymentMethods);
  const { data: profile, isLoading: profileLoading } =
    useCustomerCheckoutInfo();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const placeOrderMutation = usePlaceOrder();

  // Use cart data directly from API
  const items = cartData?.items || [];
  const totalItems = cartData?.total_items || 0;
  const totalAmount = cartData?.total_amount || 0;
  const totalDeposit = cartData?.total_deposit || 0;
  const totalRemaining = cartData?.total_remaining || 0;
  const totalDiscount = cartData?.total_discount || 0;
  const totalOriginalAmount = totalAmount + totalDiscount;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        notes: "",
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/products");
      return;
    }

    placeOrderMutation.mutate(
      {
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
        notes: formData.notes || undefined,
        address: formData.address || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success("Order placed successfully!");
          router.push(`/order-confirmation/${data.order_id}`);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to place order");
        },
      },
    );
  };

  const paymentOptions = [
    {
      id: "COD",
      label: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: Banknote,
      enabled: paymentMethods?.cod?.enabled ?? true,
    },
    {
      id: "VODAFONE_CASH",
      label: "Vodafone Cash",
      description: "Pay via Vodafone Cash wallet",
      icon: Smartphone,
      enabled: paymentMethods?.vodafone_cash?.enabled ?? false,
      accounts: paymentMethods?.vodafone_cash?.accounts || [],
    },
    {
      id: "INSTAPAY",
      label: "InstaPay",
      description: "Pay via InstaPay",
      icon: Zap,
      enabled: paymentMethods?.instapay?.enabled ?? false,
      accounts: paymentMethods?.instapay?.accounts || [],
    },
  ];

  // Show loading while cart is being fetched
  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto mb-4 text-primary"
          />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no items
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
          <p className="text-muted-foreground mb-8">
            Add some products to your cart before checking out.
          </p>
          <Link href="/products">
            <Button size="lg" className="rounded-full px-8">
              Browse Products
              <ArrowRight size={18} className="mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowRight size={16} />
            Back to Cart
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User size={20} className="text-primary" />
                  <h2 className="text-xl font-bold font-heading">
                    Customer Information
                  </h2>
                </div>

                {profileLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <User
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className={cn(
                            "pr-10",
                            errors.name && "border-destructive",
                          )}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="01XXXXXXXXX"
                          className={cn(
                            "pr-10 text-left",
                            errors.phone && "border-destructive",
                          )}
                          dir="ltr"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-destructive">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">
                        Shipping Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Your address"
                          className={cn(
                            "pr-10",
                            errors.address && "border-destructive",
                          )}
                        />
                      </div>
                      {errors.address && (
                        <p className="text-xs text-destructive">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <div className="relative">
                        <StickyNote
                          size={16}
                          className="absolute right-3 top-3 text-muted-foreground"
                        />
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Any special instructions for your order"
                          className="pr-10 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Banknote size={20} className="text-primary" />
                  <h2 className="text-xl font-bold font-heading">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {paymentOptions
                    .filter((option) => option.enabled)
                    .map((option) => {
                      const isSelected = paymentMethod === option.id;
                      const hasAccounts =
                        option.accounts && option.accounts.length > 0;

                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "rounded-lg border transition-all overflow-hidden",
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/50",
                          )}
                        >
                          <button
                            onClick={() => setPaymentMethod(option.id)}
                            className="w-full flex items-start gap-3 p-4"
                          >
                            <div
                              className={cn(
                                "p-2 rounded-lg shrink-0",
                                isSelected
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <option.icon size={20} />
                            </div>
                            <div className="flex-1 text-right min-w-0">
                              <p className="font-semibold text-foreground">
                                {option.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                            {isSelected && (
                              <Check
                                size={20}
                                className="text-primary shrink-0 mt-1"
                              />
                            )}
                          </button>

                          {isSelected && hasAccounts && (
                            <div className="px-4 pb-4">
                              <Separator className="mb-3" />
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                {option.accounts.length > 1
                                  ? "Pay to any of the following:"
                                  : "Pay to:"}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {option.accounts.map((account: any) => (
                                  <div
                                    key={account.id}
                                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2"
                                  >
                                    <div className="min-w-0 text-right">
                                      {account.label && (
                                        <p className="text-xs text-muted-foreground truncate">
                                          {account.label}
                                        </p>
                                      )}
                                      <p
                                        className="text-sm font-semibold text-foreground truncate"
                                        dir="ltr"
                                      >
                                        {account.phone_number || account.value}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-bold font-heading mb-6">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.product_name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package
                            size={20}
                            className="text-muted-foreground"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.product_name}
                      </p>
                      {item.variant_name && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant_name}
                        </p>
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
                    <span className="text-sm font-semibold shrink-0">
                      {item.total_price} {currency}
                    </span>
                  </div>
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

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">
                    Calculated by seller
                  </span>
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
                onClick={handlePlaceOrder}
                disabled={placeOrderMutation.isPending}
              >
                {placeOrderMutation.isPending ? (
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
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
