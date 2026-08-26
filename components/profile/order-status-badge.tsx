// components/orders/order-status-badge.tsx
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { className: string; icon: LucideIcon; label: string }
> = {
  PENDING: {
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    icon: Clock,
    label: "Pending",
  },
  CONFIRMED: {
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    icon: CheckCircle,
    label: "Confirmed",
  },
  SHIPPED: {
    className: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
    icon: Truck,
    label: "Shipped",
  },
  DELIVERED: {
    className: "bg-green-100 text-green-700 hover:bg-green-100",
    icon: Package,
    label: "Delivered",
  },
  CANCELLED: {
    className: "bg-gray-100 text-gray-500 hover:bg-gray-100",
    icon: XCircle,
    label: "Cancelled",
  },
  REFUNDED: {
    className: "bg-red-100 text-red-700 hover:bg-red-100",
    icon: RotateCcw,
    label: "Refunded",
  },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} gap-1 font-medium`}>
      <Icon size={12} />
      {config.label}
    </Badge>
  );
}
