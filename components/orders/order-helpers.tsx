import {
  Clock,
  CheckCircle2,
  Package,
  XCircle,
  RotateCcw,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Row({
  label,
  value,
  Icon,
  valueColor = "text-foreground",
  mono = false,
}: {
  label: string;
  value?: string;
  Icon?: any;
  valueColor?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon size={15} />}
        <span>{label}</span>
      </div>
      <span
        className={`font-semibold ${valueColor} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<
    string,
    { className: string; icon: any; label: string }
  > = {
    PENDING: {
      className: "bg-primary/10 text-primary",
      icon: Clock,
      label: "Pending",
    },
    CONFIRMED: {
      className: "bg-primary/10 text-primary",
      icon: CheckCircle2,
      label: "Confirmed",
    },
    SHIPPED: {
      className: "bg-primary/10 text-primary",
      icon: Truck,
      label: "Shipped",
    },
    DELIVERED: {
      className: "bg-primary/10 text-primary",
      icon: Package,
      label: "Delivered",
    },
    CANCELLED: {
      className: "bg-red-100/50 text-destructive",
      icon: XCircle,
      label: "Cancelled",
    },
    REFUNDED: {
      className: "bg-destructive/10 text-destructive",
      icon: RotateCcw,
      label: "Refunded",
    },
  };

  const config = styles[status] || styles.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}
