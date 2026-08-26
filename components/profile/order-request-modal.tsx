// components/order/order-request-modal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, XCircle, RotateCcw } from "lucide-react";
import { useCreateOrderRequest, useCancelOrderDirectly } from "@/hooks/use-orders";
import { OrderRequestType } from "@/types/orders";

interface OrderRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  type: OrderRequestType;
  isDirectCancel?: boolean;
}

export function OrderRequestModal({
  open,
  onOpenChange,
  orderId,
  type,
  isDirectCancel = false,
}: OrderRequestModalProps) {
  const [reason, setReason] = useState("");
  const createRequestMutation = useCreateOrderRequest(orderId);
  const cancelDirectlyMutation = useCancelOrderDirectly(orderId);

  const isCancel = type === "CANCEL";

  const handleSubmit = () => {
    if (isDirectCancel) {
      // Direct cancel - no request needed
      cancelDirectlyMutation.mutate(undefined, {
        onSuccess: () => {
          setReason("");
          onOpenChange(false);
        },
      });
      return;
    }

    // Request-based cancel/refund
    createRequestMutation.mutate(
      {
        type,
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          setReason("");
          onOpenChange(false);
        },
      },
    );
  };

  const isLoading = isDirectCancel
    ? cancelDirectlyMutation.isPending
    : createRequestMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCancel ? (
              <XCircle size={20} className="text-destructive" />
            ) : (
              <RotateCcw size={20} className="text-primary" />
            )}
            {isDirectCancel
              ? "Cancel Order"
              : isCancel
                ? "Request Cancellation"
                : "Request Refund"}
          </DialogTitle>
          <DialogDescription>
            {isDirectCancel
              ? "Are you sure you want to cancel this order?"
              : isCancel
                ? "Your order has been shipped. Cancellation requires approval from the store."
                : "Please let us know why you'd like a refund."}
          </DialogDescription>
        </DialogHeader>

        {!isDirectCancel && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                {isCancel ? "Reason for cancellation" : "Reason for refund"}
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please explain..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={isCancel ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="ml-2 animate-spin" />
                Processing...
              </>
            ) : isDirectCancel ? (
              "Cancel Order"
            ) : isCancel ? (
              "Submit Request"
            ) : (
              "Request Refund"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
