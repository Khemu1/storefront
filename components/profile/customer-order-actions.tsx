"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XCircle, RotateCcw, Clock } from "lucide-react";
import { OrderRequestModal } from "./order-request-modal";
import type { OrderRequestType } from "@/types/orders";

interface PendingRequest {
  id: string;
  type: OrderRequestType;
  reason?: string | null;
  created_at: string;
}

interface CustomerOrderActionsProps {
  orderId: string;
  status: string;
  pendingRequest?: PendingRequest | null;
}

export function CustomerOrderActions({
  orderId,
  status,
  pendingRequest,
}: CustomerOrderActionsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const canCancelDirectly = status === "PENDING" || status === "CONFIRMED";
  const canRequestCancellation = status === "SHIPPED";
  const canRequestRefund = status === "DELIVERED";

  if (!canCancelDirectly && !canRequestCancellation && !canRequestRefund) {
    return null;
  }

  // A request-based action (cancellation or refund) is already awaiting
  // store review — show that instead of letting the customer queue up
  // another one. Direct cancel (PENDING/CONFIRMED) isn't request-based,
  // so it's never blocked by this.
  if (pendingRequest && !canCancelDirectly) {
    const label =
      pendingRequest.type === "CANCEL"
        ? "Cancellation request pending"
        : "Refund request pending";

    return (
      <Badge
        variant="outline"
        className="gap-1.5 font-normal text-muted-foreground"
      >
        <Clock size={12} />
        {label}
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {/* Direct Cancel (PENDING/CONFIRMED) */}
      {canCancelDirectly && (
        <Button
          variant="destructive"
          size="sm"
          className="rounded-full"
          onClick={() => setShowCancelModal(true)}
        >
          <XCircle size={14} className="ml-2" />
          Cancel order
        </Button>
      )}

      {/* Cancel Request (SHIPPED) */}
      {canRequestCancellation && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/5"
          onClick={() => setShowCancelModal(true)}
        >
          <XCircle size={14} className="ml-2" />
          Request cancellation
        </Button>
      )}

      {/* Refund Request (DELIVERED) */}
      {canRequestRefund && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => setShowRefundModal(true)}
        >
          <RotateCcw size={14} className="ml-2" />
          Request refund
        </Button>
      )}

      {/* Cancel/Request Modal */}
      <OrderRequestModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        orderId={orderId}
        type="CANCEL"
        isDirectCancel={canCancelDirectly}
      />

      {/* Refund Modal */}
      <OrderRequestModal
        open={showRefundModal}
        onOpenChange={setShowRefundModal}
        orderId={orderId}
        type="REFUND"
        isDirectCancel={false}
      />
    </div>
  );
}
