"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import { AppDialog } from "./app-dialog";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/dialog-store";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const CONFIRM_DIALOG_KEY = "confirm-dialog";

export interface ConfirmDialogData {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function ConfirmDialog() {
  const isOpen = useDialogStore((state) => state.isOpen(CONFIRM_DIALOG_KEY));
  const data = useDialogStore((state) =>
    state.getData<ConfirmDialogData>(CONFIRM_DIALOG_KEY),
  );
  const close = useDialogStore((state) => state.close);

  const [isPending, setIsPending] = useState(false);

  const handleClose = () => {
    if (isPending) return;
    close(CONFIRM_DIALOG_KEY);
    data?.onCancel?.();
  };

  const handleConfirm = async () => {
    if (!data?.onConfirm) return;
    try {
      setIsPending(true);
      await data.onConfirm();
      close(CONFIRM_DIALOG_KEY);
    } catch (error) {
      // Error handled by caller, keep dialog open
    } finally {
      setIsPending(false);
    }
  };

  if (!data) return null;

  const isDestructive = data.variant === "destructive";

  return (
    <AppDialog
      open={isOpen}
      onClose={handleClose}
      title={data.title}
      description={data.description}
      className="sm:max-w-md"
    >
      <div className="space-y-4 py-2">
        {/* Icon (shown for destructive by default) */}
        {(data.icon || isDestructive) && (
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "p-2 rounded-lg shrink-0",
                isDestructive
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary",
              )}
            >
              {data.icon || <AlertTriangle size={20} />}
            </div>
            {data.description && (
              <p className="text-sm text-muted-foreground pt-1">
                {data.description}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            {data.cancelLabel || "Cancel"}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              data.confirmLabel || "Confirm"
            )}
          </Button>
        </div>
      </div>
    </AppDialog>
  );
}
