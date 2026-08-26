"use client";

import { useStoreStore } from "@/stores/store-store";
import { Loader2, Store, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StoreLoading({ children }: { children: React.ReactNode }) {
  const isLoading = useStoreStore((state) => state.isLoading);
  const error = useStoreStore((state) => state.error);

  // Show loading spinner while store data is being fetched
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="relative">
          {/* Animated logo/icon */}
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-lg font-medium">Loading store...</span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we prepare your shopping experience
        </p>
      </div>
    );
  }

  // Show error state if store failed to load
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-foreground">
          Store Not Found
        </h1>

        <p className="mt-2 text-center text-muted-foreground max-w-md">
          We couldn't load this store. Please check the URL or try again later.
        </p>

        <Button className="mt-6" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Store loaded successfully - render children
  return <>{children}</>;
}
