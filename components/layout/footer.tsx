// components/layout/footer.tsx
"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiInstagram, SiFacebook } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import { useStoreStore } from "@/stores/store-store";
import { toast } from "sonner";

export function Footer() {
  const { storeName, storeDescription, whatsapp } = useStoreStore();
  const [copied, setCopied] = useState(false);

  const socialIcons = [MessageCircle, SiInstagram, SiFacebook];
  const shopLinks = [
    "All Products",
    "New Arrivals",
    "Best Sellers",
    "Sale Items",
  ];
  const supportLinks = ["Contact Us", "Shipping Info", "Returns", "FAQ"];

  const handleCopyWhatsApp = async () => {
    if (!whatsapp) return;

    try {
      await navigator.clipboard.writeText(whatsapp);
      setCopied(true);
      toast.success("Phone number copied to clipboard", {
        description: whatsapp,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy phone number");
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // If user clicks, copy to clipboard
    e.preventDefault();
    handleCopyWhatsApp();
  };

  const handleSocialClick = (index: number) => {
    if (index === 0 && whatsapp) {
      // WhatsApp - open chat
      window.open(`https://wa.me/${whatsapp}`, "_blank");
    }
    // Instagram and Facebook are placeholders
  };

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h4 className="text-2xl font-bold mb-4 font-heading text-foreground">
              {storeName}
            </h4>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {storeDescription ||
                "Quality products for your everyday life. Shop with confidence."}
            </p>
            <div className="flex gap-3">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href={i === 0 && whatsapp ? `https://wa.me/${whatsapp}` : "#"}
                  target={i === 0 ? "_blank" : undefined}
                  rel={i === 0 ? "noopener noreferrer" : undefined}
                  onClick={() => handleSocialClick(i)}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 cursor-pointer"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h5 className="font-bold uppercase text-sm mb-4 text-foreground">
              Support
            </h5>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h5 className="font-bold uppercase text-sm mb-4 text-foreground">
              Contact
            </h5>

            {/* WhatsApp Button - Click to copy */}
            <Button
              onClick={handleCopyWhatsApp}
              className="bg-green-500 hover:bg-green-600 rounded-full text-white shadow-lg shadow-green-500/20 group relative"
            >
              {copied ? (
                <Check size={18} className="ml-2" />
              ) : (
                <Copy size={18} className="ml-2" />
              )}
              {whatsapp}
            </Button>

            {/* WhatsApp Chat Link */}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
            )}

            <div className="mt-4 space-y-1">
              <p className="text-sm text-muted-foreground">
                Available 7 days a week
              </p>
              <p className="text-sm text-muted-foreground">
                9:00 AM - 10:00 PM
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex justify-between items-center flex-wrap gap-4 text-sm text-muted-foreground">
          <div>© 2024 {storeName}. All rights reserved.</div>
          <div className="flex items-center gap-1">
            Made with <span className="text-primary">❤</span> in Egypt
          </div>
        </div>
      </div>
    </footer>
  );
}
