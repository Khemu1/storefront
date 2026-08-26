import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrackOrderResponse } from "@/types/orders";

interface OrderActionsProps {
  order: TrackOrderResponse;
  storeName: string;
  whatsapp: string;
}

export function OrderActions({
  order,
  storeName,
  whatsapp,
}: OrderActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
            `Hello ${storeName}, I just placed an order with ID: ${order.order_id}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="w-full rounded-full gap-2 h-12 text-[15px] font-semibold cursor-pointer text-white bg-green-500 hover:bg-green-600">
            <MessageCircle size={18} />
            Message us on WhatsApp
          </Button>
        </a>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/profile#orders" className="flex-1">
          <Button
            variant="outline"
            className="w-full rounded-full h-12 text-[15px]"
          >
            View my orders
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button className="w-full rounded-full gap-2 h-12 text-[15px] font-semibold">
            Continue shopping
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
