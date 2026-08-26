// app/order-confirmation/[orderId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useStoreStore } from "@/stores/store-store";
import { useTrackOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSuccessHero } from "@/components/orders/order-success-hero";
import { OrderReceiptCard } from "@/components/orders/order-receipt-card";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { OrderActions } from "@/components/orders/order-actions";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { storeName, whatsapp, currency } = useStoreStore();
  const { data: order, isLoading } = useTrackOrder(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-xl mx-auto px-5 py-20">
          <div className="text-center mb-10">
            <Skeleton className="h-20 w-20 rounded-full mx-auto mb-5" />
            <Skeleton className="h-7 w-56 mx-auto mb-2" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <p className="text-lg mb-5 text-destructive">
            We couldn't find that order.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/products")}
            className="rounded-full"
          >
            Continue shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-5 py-14 lg:py-20">
        <OrderSuccessHero order={order} />
        <OrderReceiptCard order={order} currency={currency} />
        <OrderTimeline order={order} />
        <OrderActions order={order} storeName={storeName} whatsapp={whatsapp} />
      </div>
    </div>
  );
}
