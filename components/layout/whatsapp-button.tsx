"use client";
import { useStoreStore } from "@/stores/store-store";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
  const { whatsapp } = useStoreStore();

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Contact on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
