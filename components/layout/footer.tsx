// components/footer.tsx
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiInstagram, SiFacebook } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const socialIcons = [MessageCircle, SiInstagram, SiFacebook];
  const shopLinks = [
    "All Products",
    "New Arrivals",
    "Best Sellers",
    "Sale Items",
  ];
  const supportLinks = ["Contact Us", "Shipping Info", "Returns", "FAQ"];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h4 className="text-2xl font-bold mb-4 font-heading text-foreground">
              Souq<span className="text-primary">ly</span>
            </h4>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Quality products for your everyday life. Shop with confidence.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h5 className="font-bold uppercase text-sm mb-4 text-foreground">
              Shop
            </h5>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
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
            <Button className="bg-green-500 hover:bg-green-600 rounded-full text-white shadow-lg shadow-green-500/20">
              <MessageCircle size={18} className="ml-2" />
              +20 123 456 7890
            </Button>
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
          <div>© 2024 Souqly. All rights reserved.</div>
          <div className="flex items-center gap-1">
            Made with <span className="text-primary">❤</span> in Egypt
          </div>
        </div>
      </div>
    </footer>
  );
}
