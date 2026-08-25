import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ phoneNumber = "201234567890" }) {
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
