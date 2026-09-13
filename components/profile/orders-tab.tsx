"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
} from "lucide-react";
import { getCdnUrl } from "@/lib/utils";
import { CustomerOrder, CustomerOrdersMeta } from "@/types/profile";
import { useCustomerReviews } from "@/hooks/use-reviews";
import { ReviewFormDialog } from "../orders/review-form-dialog";

interface OrdersTabProps {
  orders: CustomerOrder[];
  isLoading: boolean;
  meta?: CustomerOrdersMeta;
  page: number;
  onPageChange: (page: number) => void;
}

export function OrdersTab({
  orders,
  isLoading,
  meta,
  page,
  onPageChange,
}: OrdersTabProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    productId: string;
    variantId: string | null;
    productName: string;
    variantName: string | null;
    orderId: string;
    productImage: string | null;
  } | null>(null);

  const { data: reviewsData } = useCustomerReviews();
  const reviewedProductIds = new Set(
    reviewsData?.items?.map((r) => r.product_id) || [],
  );

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  const handleWriteReview = (
    item: any,
    orderId: string,
    imageUrl: string | null,
  ) => {
    setSelectedItem({
      productId: item.product_id,
      variantId: item.variant_id,
      productName: item.product_name,
      variantName: item.variant_name,
      orderId,
      productImage: imageUrl,
    });
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedItem(null);
  };

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
    <>
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold font-heading mb-1">My orders</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {meta?.totalItems
              ? `${meta.totalItems} order${meta.totalItems === 1 ? "" : "s"} placed so far.`
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
            <>
              <div className="space-y-4">
                {orders.map((order) => {
                  // Calculate total items quantity
                  const totalQuantity =
                    order.items?.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    ) || 0;

                  // Get unique product count
                  const uniqueProducts = order.items?.length || 0;

                  const isDelivered = order.status === "DELIVERED";

                  return (
                    <div
                      key={order.id}
                      className="rounded-xl border border-border hover:border-primary/50 hover:shadow-sm transition-all"
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
                          <Link
                            href={`/order-confirmation/${order.id}`}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            View Details
                            <ArrowRight size={14} className="rtl:rotate-180" />
                          </Link>
                        </div>

                        {/* Items with Images and Navigation */}
                        <div className="space-y-2 mb-3">
                          {order.items?.slice(0, 3).map((item) => {
                            const hasImageError = imageErrors[item.id];
                            const imageUrl = item.image
                              ? getCdnUrl() + "/" + item.image
                              : null;
                            const isReviewed = reviewedProductIds.has(
                              item?.product_id,
                            );

                            return (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                {item.product_id ? (
                                  <Link
                                    href={`/products/${item.product_id}`}
                                    className="relative w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0"
                                  >
                                    {imageUrl && !hasImageError ? (
                                      <Image
                                        src={imageUrl}
                                        alt={item.product_name}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                        unoptimized
                                        onError={() =>
                                          handleImageError(item.id)
                                        }
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon
                                          size={18}
                                          className="text-muted-foreground/50"
                                        />
                                      </div>
                                    )}
                                  </Link>
                                ) : (
                                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                                    {imageUrl && !hasImageError ? (
                                      <Image
                                        src={imageUrl}
                                        alt={item.product_name}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                        unoptimized
                                        onError={() =>
                                          handleImageError(item.id)
                                        }
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon
                                          size={18}
                                          className="text-muted-foreground/50"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Item Info - Clickable */}
                                <div className="flex-1 min-w-0">
                                  {item.product_id ? (
                                    <Link
                                      href={`/products/${item.product_id}`}
                                      className="text-sm font-medium truncate hover:text-primary transition-colors block"
                                    >
                                      {item.product_name}
                                    </Link>
                                  ) : (
                                    <p className="text-sm font-medium truncate">
                                      {item.product_name}
                                    </p>
                                  )}
                                  {item.variant_name && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {item.variant_name}
                                    </p>
                                  )}
                                </div>

                                {/* Quantity */}
                                <span className="text-xs text-muted-foreground shrink-0">
                                  × {item.quantity}
                                </span>

                                {/* Review Button (only for delivered + has product_id) */}
                                {isDelivered && item.product_id && (
                                  <div className="shrink-0">
                                    {isReviewed ? (
                                      <Badge
                                        variant="outline"
                                        className="gap-1 text-green-600 border-green-200 bg-green-50"
                                      >
                                        <Check size={12} />
                                        Reviewed
                                      </Badge>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 h-7 text-xs"
                                        onClick={() =>
                                          handleWriteReview(
                                            item,
                                            order.id,
                                            imageUrl,
                                          )
                                        }
                                      >
                                        <Star size={12} />
                                        Review
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {uniqueProducts > 3 && (
                            <p className="text-xs text-muted-foreground pl-14">
                              +{uniqueProducts - 3} more items
                            </p>
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
                              {totalQuantity} item
                              {totalQuantity !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

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
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onPageChange(Math.min(meta.totalPages, page + 1))
                    }
                    disabled={page === meta.totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedItem && (
        <ReviewFormDialog
          open={reviewDialogOpen}
          onClose={handleCloseReviewDialog}
          productId={selectedItem.productId}
          variantId={selectedItem.variantId}
          productName={selectedItem.productName}
          variantName={selectedItem.variantName}
          orderId={selectedItem.orderId}
          productImage={selectedItem.productImage}
        />
      )}
    </>
  );
}
