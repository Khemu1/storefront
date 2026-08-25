// components/features-bar.tsx
import { Truck, ShieldCheck, RefreshCw, Headset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders over 500 EGP",
    color: "text-primary bg-primary/10",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% protected",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "7-day return policy",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    desc: "We're here to help",
    color: "text-yellow-600 bg-yellow-100",
  },
];

export function FeaturesBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <Card key={feature.title} className="border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`p-3 rounded-lg ${feature.color}`}>
                <feature.icon size={24} />
              </div>
              <div>
                <h6 className="font-bold text-sm">{feature.title}</h6>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
