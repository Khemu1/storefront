import { CheckCircle2, Clock, Package, XCircle, RotateCcw, Truck } from "lucide-react";
import type { TrackOrderResponse } from "@/types/orders";

interface OrderSuccessHeroProps {
  order: TrackOrderResponse;
}

export function OrderSuccessHero({ order }: OrderSuccessHeroProps) {
  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: {
        icon: Clock,
        title: "Your order is in!",
        message: "We'll reach out shortly to confirm the details.",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-700",
      },
      CONFIRMED: {
        icon: CheckCircle2,
        title: "Order confirmed!",
        message: "Your order has been confirmed and is being prepared.",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      },
      SHIPPED: {
        icon: Truck,
        title: "Order shipped!",
        message: "Your order is on its way to you.",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-700",
      },
      DELIVERED: {
        icon: Package,
        title: "Order delivered!",
        message: "Your order has been delivered. We hope you love it!",
        iconBg: "bg-green-100",
        iconColor: "text-green-700",
      },
      CANCELLED: {
        icon: XCircle,
        title: "Order cancelled",
        message: "This order has been cancelled.",
        iconBg: "bg-muted",
        iconColor: "text-muted-foreground",
      },
      REFUNDED: {
        icon: RotateCcw,
        title: "Order refunded",
        message: "This order has been refunded.",
        iconBg: "bg-destructive/10",
        iconColor: "text-destructive",
      },
    };

    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  const config = getStatusConfig(order.status);
  const Icon = config.icon;

  return (
    <div className="text-center mb-10">
      <div
        className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${config.iconBg}`}
      >
        <Icon size={38} className={config.iconColor} strokeWidth={2} />
      </div>
      <h1 className="text-[2rem] leading-tight mb-2 font-heading text-foreground font-bold">
        {config.title}
      </h1>
      <p className="text-[15px] text-muted-foreground">{config.message}</p>
    </div>
  );
}
