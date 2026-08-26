import { CheckCircle2, Package, Truck } from "lucide-react";
import type { TrackOrderResponse } from "@/types/orders";

interface OrderTimelineProps {
  order: TrackOrderResponse;
}

const STATUS_ORDER = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

export function OrderTimeline({ order }: OrderTimelineProps) {
  const isTerminalOther =
    order.status === "CANCELLED" || order.status === "REFUNDED";

  if (isTerminalOther) return null;

  const currentStep = STATUS_ORDER.indexOf(order.status as any);
  const getLabel = (step: string) => {
    const labels: Record<string, string> = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
    };
    return labels[step] || step;
  };

  const getIcon = (step: string) => {
    const icons: Record<string, any> = {
      PENDING: CheckCircle2,
      CONFIRMED: CheckCircle2,
      SHIPPED: Truck,
      DELIVERED: Package,
    };
    return icons[step] || CheckCircle2;
  };

  return (
    <div className="mb-10 px-1">
      <div className="flex items-center">
        {STATUS_ORDER.map((step, i) => {
          const reached = currentStep >= i;
          const isLast = i === STATUS_ORDER.length - 1;
          const Icon = getIcon(step);

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    reached
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span
                  className={`text-[11px] uppercase tracking-wide font-medium whitespace-nowrap ${
                    reached ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {getLabel(step)}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-2 rounded-full ${
                    currentStep > i ? "bg-primary" : "bg-muted"
                  }`}
                  style={{ marginBottom: "18px" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
