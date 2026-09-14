"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirm } from "@/lib/utils";
import { useCancelOrderDirectly } from "@/hooks/use-orders";

const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED"];

interface CancelOrderButtonProps {
  orderId: string;
  status: string;
  className?: string;
}

export function CancelOrderButton({
  orderId,
  status,
  className,
}: CancelOrderButtonProps) {
  const cancelMutation = useCancelOrderDirectly(orderId);

  if (!CANCELLABLE_STATUSES.includes(status)) {
    return null;
  }

  const handleClick = () => {
    confirm({
      title: "Cancel this order?",
      description:
        "This can't be undone. The order will be marked as cancelled.",
      confirmLabel: "Yes, Cancel Order",
      cancelLabel: "Keep Order",
      variant: "destructive",
      icon: <XCircle size={20} />,
      onConfirm: async () => {
        await cancelMutation.mutateAsync(undefined);
      },
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className={className ?? "gap-2 text-xs!"}
      onClick={handleClick}
    >
      <XCircle size={16} />
      Cancel Order
    </Button>
  );
}
