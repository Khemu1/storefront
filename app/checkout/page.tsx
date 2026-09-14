// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { useStoreStore } from "@/stores/store-store";
import { useCustomerCheckoutInfo } from "@/hooks/use-customer-profile";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { usePlaceOrder } from "@/hooks/use-orders";
import { CustomerInfoForm } from "@/components/checkout/customer-info-form";
import { AddressSelector } from "@/components/checkout/address-selector";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";

export default function CheckoutPage() {
  const router = useRouter();
  const currency = useStoreStore((state) => state.currency);
  const paymentMethods = useStoreStore((state) => state.paymentMethods);
  const { data: profile, isLoading: profileLoading } =
    useCustomerCheckoutInfo();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const placeOrderMutation = usePlaceOrder();

  const items = cartData?.items || [];
  const totalItems = cartData?.total_items || 0;
  const totalAmount = cartData?.total_amount || 0;
  const totalDeposit = cartData?.total_deposit || 0;
  const totalRemaining = cartData?.total_remaining || 0;
  const totalDiscount = cartData?.total_discount || 0;

  const addresses = profile?.addresses || [];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill name/phone from profile
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        phone: profile.phone || "",
      }));
    }
  }, [profile]);

  // address when it's the only one.
  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }
    setSelectedAddressId((current) => {
      if (current && addresses.some((a) => a.id === current)) {
        return current;
      }
      const defaultAddr = addresses.find((a) => a.is_default);
      return (defaultAddr ?? addresses[0]).id;
    });
  }, [addresses]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
    if (!selectedAddressId) {
      newErrors.address = "Please select or add a shipping address";
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
        address_id: selectedAddressId!,
      },
      {
        onSuccess: (data) => {
          toast.success("Order placed successfully!");
          router.push(`/order-confirmation/${data.id}`);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to place order");
        },
      },
    );
  };

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
            <CustomerInfoForm
              formData={formData}
              errors={errors}
              isLoading={profileLoading}
              onFieldChange={handleFormChange}
            />

            <AddressSelector
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
              isLoading={profileLoading}
            />
            {errors.address && (
              <p className="text-xs text-destructive -mt-4">{errors.address}</p>
            )}

            <PaymentMethodSelector
              paymentMethods={paymentMethods}
              selectedMethod={paymentMethod}
              onMethodSelect={setPaymentMethod}
            />
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              currency={currency}
              totalItems={totalItems}
              totalAmount={totalAmount}
              totalDeposit={totalDeposit}
              totalRemaining={totalRemaining}
              totalDiscount={totalDiscount}
              isSubmitting={placeOrderMutation.isPending}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
