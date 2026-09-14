import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * When true, clicking outside the dialog or pressing Escape will not
   * close it. Useful for forms where accidental dismissal would lose data;
   * the dialog can then only be closed via an explicit action (e.g. a
   * Cancel/Save button that calls onClose).
   */
  preventOutsideClose?: boolean;
}

export function AppDialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  preventOutsideClose = false,
}: AppDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen, eventDetails) => {
        if (isOpen) return;
        if (
          preventOutsideClose &&
          (eventDetails.reason === "outside-press" ||
            eventDetails.reason === "escape-key" ||
            eventDetails.reason === "focus-out")
        ) {
          eventDetails.cancel();
          return;
        }
        onClose();
      }}
    >
      <DialogContent
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "sm:max-w-125 max-h-[85vh] overflow-y-auto",
          className,
        )}
      >
        {title ? (
          <DialogTitle>{title}</DialogTitle>
        ) : (
          <VisuallyHidden>
            <DialogTitle>Dialog</DialogTitle>
          </VisuallyHidden>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}
