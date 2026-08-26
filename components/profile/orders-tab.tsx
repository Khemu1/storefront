import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrderCard } from "./order-card";
import { CustomerOrder } from "@/types/profile";

interface OrdersTabProps {
  orders?: CustomerOrder[];
  isLoading: boolean;
}

export function OrdersTab({ orders, isLoading }: OrdersTabProps) {
  const getStatusBadge = (status: string) => {
    const configs: Record<
      string,
      { className: string; icon: any; label: string }
    > = {
      PENDING: {
        className: "bg-amber-100 text-amber-700",
        icon: Clock,
        label: "Pending",
      },
      CONFIRMED: {
        className: "bg-primary/10 text-primary",
        icon: CheckCircle2,
        label: "Confirmed",
      },
      SHIPPED: {
        className: "bg-indigo-100 text-indigo-700",
        icon: Truck,
        label: "Shipped",
      },
      DELIVERED: {
        className: "bg-green-100 text-green-700",
        icon: Package,
        label: "Delivered",
      },
      CANCELLED: {
        className: "bg-muted text-muted-foreground",
        icon: XCircle,
        label: "Cancelled",
      },
      REFUNDED: {
        className: "bg-destructive/10 text-destructive",
        icon: RotateCcw,
        label: "Refunded",
      },
    };
    const config = configs[status] || configs.PENDING;
    const Icon = config.icon;
    return (
      <Badge className={`${config.className} gap-1`}>
        <Icon size={12} />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold font-heading mb-1">My orders</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {orders?.length
            ? `${orders.length} order${orders.length === 1 ? "" : "s"} placed so far.`
            : "Track and manage orders you've placed."}
        </p>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : !orders?.length ? (
          <div className="text-center py-12">
            <Package
              size={40}
              className="mx-auto text-muted-foreground/60 mb-4"
            />
            <p className="font-medium mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Orders you place will show up here.
            </p>
            <Link href="/products">
              <Button variant="outline" className="rounded-full">
                Start shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              // Calculate total items quantity
              const totalQuantity =
                order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

              // Get unique product count
              const uniqueProducts = order.items?.length || 0;

              return (
                <Link
                  key={order.id}
                  href={`/order-confirmation/${order.id}`}
                  className="block rounded-xl border border-border hover:border-primary/50 hover:shadow-sm transition-all group"
                >
                  <div className="p-4">
                    {/* Header - Order ID and Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-semibold text-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        View Details
                        <ArrowRight size={14} className="rtl:rotate-180" />
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {order.items?.slice(0, 3).map((item) => (
                        <Badge
                          key={item.id}
                          variant="outline"
                          className="font-normal"
                        >
                          {item.product_name}
                          {item.variant_name && ` - ${item.variant_name}`}
                          {" × "}
                          {item.quantity}
                        </Badge>
                      ))}
                      {uniqueProducts > 3 && (
                        <Badge variant="secondary" className="font-normal">
                          +{uniqueProducts - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Footer - Date and Total */}
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          {order.total_amount} EGP
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Pending Request Indicator */}
                    {order.pending_request && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <Badge className="bg-amber-100 text-amber-700 gap-1">
                          <Clock size={12} />
                          {order.pending_request.type === "CANCEL"
                            ? "Cancellation"
                            : "Refund"}{" "}
                          request pending
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
