import { ConfirmDialogData, CONFIRM_DIALOG_KEY } from "@/components/ui/confirm-dialog";
import { useDialogStore } from "@/stores/dialog-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getCdnUrl = () => {
  return process.env.NEXT_PUBLIC_CDN_URL || "";
};

/**
 * Open a confirmation dialog from anywhere.
 *
 * @example
 * confirm({
 *   title: "Delete Review",
 *   description: "This action cannot be undone.",
 *   confirmLabel: "Delete",
 *   variant: "destructive",
 *   onConfirm: async () => {
 *     await deleteReview();
 *   },
 * });
 */
export function confirm(data: ConfirmDialogData) {
  useDialogStore.getState().open(CONFIRM_DIALOG_KEY, data);
}
