"use client";

import { Banknote, Smartphone, Zap, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  paymentMethods: {
    cod?: { enabled: boolean };
    vodafone_cash?: { enabled: boolean; accounts: any[] };
    instapay?: { enabled: boolean; accounts: any[] };
  } | null;
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
}

export function PaymentMethodSelector({
  paymentMethods,
  selectedMethod,
  onMethodSelect,
}: PaymentMethodSelectorProps) {
  const paymentOptions = [
    {
      id: "COD",
      label: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: Banknote,
      enabled: paymentMethods?.cod?.enabled ?? true,
    },
    {
      id: "VODAFONE_CASH",
      label: "Vodafone Cash",
      description: "Pay via Vodafone Cash wallet",
      icon: Smartphone,
      enabled: paymentMethods?.vodafone_cash?.enabled ?? false,
      accounts: paymentMethods?.vodafone_cash?.accounts || [],
    },
    {
      id: "INSTAPAY",
      label: "InstaPay",
      description: "Pay via InstaPay",
      icon: Zap,
      enabled: paymentMethods?.instapay?.enabled ?? false,
      accounts: paymentMethods?.instapay?.accounts || [],
    },
  ];

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Banknote size={20} className="text-primary" />
          <h2 className="text-xl font-bold font-heading">Payment Method</h2>
        </div>

        <div className="space-y-3">
          {paymentOptions
            .filter((option) => option.enabled)
            .map((option) => {
              const isSelected = selectedMethod === option.id;
              const hasAccounts = option.accounts && option.accounts.length > 0;

              return (
                <div
                  key={option.id}
                  className={cn(
                    "rounded-lg border transition-all overflow-hidden",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <button
                    onClick={() => onMethodSelect(option.id)}
                    className="w-full flex items-start gap-3 p-4"
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg shrink-0",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <option.icon size={20} />
                    </div>
                    <div className="flex-1 text-right min-w-0">
                      <p className="font-semibold text-foreground">
                        {option.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check size={20} className="text-primary shrink-0 mt-1" />
                    )}
                  </button>

                  {isSelected && hasAccounts && (
                    <div className="px-4 pb-4">
                      <Separator className="mb-3" />
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {option.accounts.length > 1
                          ? "Pay to any of the following:"
                          : "Pay to:"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {option.accounts.map((account: any) => (
                          <div
                            key={account.id}
                            className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2"
                          >
                            <div className="min-w-0 text-right">
                              {account.label && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {account.label}
                                </p>
                              )}
                              <p
                                className="text-sm font-semibold text-foreground truncate"
                                dir="ltr"
                              >
                                {account.phone_number || account.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
