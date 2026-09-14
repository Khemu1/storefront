import {
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  RotateCcw,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { TrackOrderResponse } from "@/types/orders";

interface OrderSuccessHeroProps {
  order: TrackOrderResponse;
}

interface StatusConfig {
  icon: LucideIcon;
  title: string;
  message: string;
  tone: "neutral" | "danger" | "warning";
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  PENDING: {
    icon: Clock,
    title: "Your order is in!",
    message: "We'll reach out shortly to confirm the details.",
    tone: "neutral",
  },
  CONFIRMED: {
    icon: CheckCircle2,
    title: "Order confirmed!",
    message: "Your order has been confirmed and is being prepared.",
    tone: "neutral",
  },
  SHIPPED: {
    icon: Truck,
    title: "Order shipped!",
    message: "Your order is on its way to you.",
    tone: "neutral",
  },
  DELIVERED: {
    icon: Package,
    title: "Order delivered!",
    message: "Your order has been delivered. We hope you love it!",
    tone: "neutral",
  },
  CANCELLED: {
    icon: XCircle,
    title: "Order cancelled",
    message:
      "This order has been cancelled. Contact us if this wasn't expected.",
    tone: "danger",
  },
  REFUNDED: {
    icon: RotateCcw,
    title: "Order refunded",
    message: "This order has been refunded to your original payment method.",
    tone: "warning",
  },
};

const TONE_STYLES = {
  neutral: {
    card: "bg-muted/50",
    iconWrap: "bg-primary/10",
    icon: "text-primary",
    title: "text-foreground",
    message: "text-muted-foreground",
  },
  danger: {
    card: "bg-destructive/10 border border-destructive/30",
    iconWrap: "bg-background",
    icon: "text-destructive",
    title: "text-destructive",
    message: "text-destructive/90",
  },
  warning: {
    card: "bg-amber-500/10 border border-amber-500/30",
    iconWrap: "bg-background",
    icon: "text-amber-600 dark:text-amber-500",
    title: "text-amber-700 dark:text-amber-500",
    message: "text-amber-700/90 dark:text-amber-500/90",
  },
} as const;

export function OrderSuccessHero({ order }: OrderSuccessHeroProps) {
  const config = STATUS_CONFIGS[order.status] ?? STATUS_CONFIGS.PENDING;
  const styles = TONE_STYLES[config.tone];
  const Icon = config.icon;

  return (
    <div className={`text-center mb-10 rounded-2xl px-6 py-10 ${styles.card}`}>
      <div
        className={`w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center ${styles.iconWrap}`}
      >
        <Icon size={32} className={styles.icon} strokeWidth={2} />
      </div>
      <h1
        className={`text-[1.75rem] leading-tight mb-2 font-heading font-bold ${styles.title}`}
      >
        {config.title}
      </h1>
      <p className={`text-[15px] ${styles.message}`}>{config.message}</p>
    </div>
  );
}
