"use client";

import { useEffect, useState } from "react";
import {
  Ban,
  LogOut,
  MessageCircle,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { useStoreStore } from "@/stores/store-store";
import { useRouter } from "next/navigation";

const NO_REASON_VALUES = new Set(["", "no reason", "n/a", "none", "unknown"]);

function cleanReason(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (NO_REASON_VALUES.has(trimmed.toLowerCase())) return null;
  return trimmed;
}

export default function BannedPage() {
  const navigate = useRouter();
  const logout = useCustomerAuthStore((state) => state.logout);
  const bannedReason = useCustomerAuthStore((state) => state.bannedReason);
  const { storeName, whatsapp } = useStoreStore();

  // Resolve reason: prefer store, fall back to sessionStorage on hard reload
  const [reason, setReason] = useState<string | null>(
    cleanReason(bannedReason),
  );

  useEffect(() => {
    if (reason) return;
    try {
      const raw = sessionStorage.getItem("banned_info");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { reason?: string };
      const cleaned = cleanReason(parsed.reason);
      if (cleaned) setReason(cleaned);
    } catch {
      // ignore
    }
  }, [reason]);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("banned_info");
    } catch {
      // ignore
    }
    logout();
    navigate.push("/login");
  };

  const handleContactSupport = () => {
    if (!whatsapp) return;
    const lines = [
      `Hello, I'd like to inquire about my account ban at ${storeName || "the store"}.`,
      reason ? `Reason shown: ${reason}` : null,
    ].filter(Boolean);
    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate.back();
    } else {
      navigate.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
              <Ban className="h-12 w-12 text-destructive" />
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping opacity-40" />
          </div>
        </div>

        {/* Title + Description */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-3">
            Account Banned
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            {storeName
              ? `Your account has been banned from ${storeName}.`
              : "Your account has been banned."}
          </p>
        </div>

        {/* Reason box (only if we have a real reason) */}
        {reason && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div className="text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-destructive mb-1">
                  Reason
                </p>
                <p className="text-foreground leading-relaxed">{reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="rounded-xl border border-border bg-muted/30 p-5 mb-8 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">
                What should I do?
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                If you believe this was a mistake, please contact our support
                team for assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {whatsapp && (
            <Button
              size="lg"
              className="w-full rounded-full gap-2 h-12"
              onClick={handleContactSupport}
            >
              <MessageCircle size={18} />
              Contact Support
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-full gap-2 h-12"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Log Out
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-muted-foreground"
            onClick={handleBack}
          >
            <ArrowLeft size={14} />
            Go Back
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          If you have any questions, please reach out to our support team.
        </p>
      </div>
    </div>
  );
}
