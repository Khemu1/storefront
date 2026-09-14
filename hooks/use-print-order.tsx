"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiFetch } from "@/lib/api";
import type { TrackOrderResponse } from "@/types/orders";
import { OrderReceiptCard } from "@/components/orders/order-receipt-card";
import { useStoreStore } from "@/stores/store-store";

/**
 * Prints a single order's receipt without showing any dialog first.
 * Fetches the full order detail on demand, mounts it into the live DOM
 * via a portal, and calls window.print() once it's actually rendered.
 *
 * While printing, document.title is temporarily set to
 * "{storeName} - {orderId}" since most browsers (Chrome, Edge) default
 * the "Save as PDF" filename to the page title. The original title is
 * restored right after the print dialog is dismissed.
 *
 * NOTE: the printable content is NOT positioned off-screen (no
 * fixed/-9999px trick). Some browsers exclude off-canvas-positioned
 * elements from print output entirely, regardless of the visibility
 * CSS in @media print — which was the cause of an earlier blank-page bug.
 * Instead it's rendered inline, and briefly visible on-screen for the
 * short window between mount and window.print() firing.
 */
export function usePrintOrder(currency: string) {
  const [order, setOrder] = useState<TrackOrderResponse | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const storeName = useStoreStore((state) => state.storeName);

  const printOrder = async (orderId: string) => {
    setIsPrinting(true);
    try {
      const data = await apiFetch.get<TrackOrderResponse>(
        `/storefront/orders/${orderId}`,
      );
      setOrder(data);
    } catch {
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    if (!order || !containerRef.current) return;

    const container = containerRef.current;
    const originalTitle = document.title;

    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };

    const triggerPrint = () => {
      const shortId = order.order_id.slice(0, 8).toUpperCase();
      document.title = storeName ? `${storeName} - ${shortId}` : shortId;

      // Restore the real title once the print dialog closes (works for
      // both "print" and "cancel"). Some browsers don't reliably fire
      // afterprint for the Save-as-PDF path, so also restore on a timer
      // as a fallback.
      window.addEventListener("afterprint", restoreTitle, { once: true });
      setTimeout(restoreTitle, 5000);

      window.print();
      setIsPrinting(false);
      setOrder(null);
    };

    // Wait for any images inside the receipt to finish loading (product
    // thumbnails load async and a print snapshot taken too early can
    // render blank/broken images), then give the browser a couple of
    // paint frames to actually commit layout before printing.
    const images = Array.from(container.querySelectorAll("img"));
    const pendingImages = images.filter((img) => !img.complete);

    let cancelled = false;

    const waitThenPrint = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) triggerPrint();
        });
      });
    };

    if (pendingImages.length === 0) {
      waitThenPrint();
    } else {
      let remaining = pendingImages.length;
      const onDone = () => {
        remaining -= 1;
        if (remaining <= 0) waitThenPrint();
      };
      pendingImages.forEach((img) => {
        img.addEventListener("load", onDone, { once: true });
        img.addEventListener("error", onDone, { once: true });
      });
      // Safety net: don't hang forever if an image never resolves
      const timeout = setTimeout(waitThenPrint, 3000);
      return () => {
        cancelled = true;
        clearTimeout(timeout);
        pendingImages.forEach((img) => {
          img.removeEventListener("load", onDone);
          img.removeEventListener("error", onDone);
        });
      };
    }

    return () => {
      cancelled = true;
    };
  }, [order, storeName]);

  const PrintPortal =
    typeof document !== "undefined" && order
      ? createPortal(
          <div ref={containerRef}>
            <OrderReceiptCard order={order} currency={currency} hideActions />
          </div>,
          document.body,
        )
      : null;

  return { printOrder, isPrinting, PrintPortal };
}
