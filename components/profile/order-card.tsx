import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "./order-status-badge";
import { CustomerOrderActions } from "./customer-order-actions";
import { CustomerOrder } from "@/types/profile";

interface OrderCardProps {
  order: CustomerOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="border border-border rounded-xl p-4 sm:p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <Separator className="my-3" />

      <div className="space-y-1.5">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
              {item.product_name}
              {item.variant_name && ` – ${item.variant_name}`}
              {" × "}
              {item.quantity}
            </span>
            <span className="font-medium shrink-0">{item.total_price} EGP</span>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Total: </span>
          <span className="font-bold">{order.total_amount} EGP</span>
        </div>
        <div className="w-auto">
          <CustomerOrderActions
            orderId={order.id}
            status={order.status}
            pendingRequest={order.pending_request}
          />
        </div>
      </div>
    </div>
  );
}
