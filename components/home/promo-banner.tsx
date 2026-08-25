// components/promo-banner.tsx
import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-3xl min-h-[300px] bg-gradient-to-l from-primary via-secondary to-primary">
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-32 left-20 w-80 h-80 rounded-full bg-black/10"></div>

        <div className="relative z-10 grid lg:grid-cols-2 items-center p-8 lg:p-12">
          <div>
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm px-3 py-2 border border-white/20">
              <Clock size={14} className="ml-1" /> Limited Time Offer
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-heading text-white">
              End of Season Sale
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Up to{" "}
              <span className="text-white font-bold underline decoration-accent decoration-4">
                40% OFF
              </span>{" "}
              on selected items
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-accent hover:text-accent-foreground rounded-full px-8 font-bold"
            >
              Shop the Sale <ArrowLeft size={18} className="mr-2" />
            </Button>
          </div>
          <div className="text-center lg:text-left">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-7xl font-extrabold text-white">-40%</div>
              <div className="text-white/80 mt-2">On Selected Items</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
