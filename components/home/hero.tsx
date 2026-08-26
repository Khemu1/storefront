// components/home/hero.tsx
"use client";

import { ArrowLeft, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStoreStore } from "@/stores/store-store";
import Link from "next/link";

export function Hero() {
  const storeName = useStoreStore((state) => state.storeName);
  const storeDescription = useStoreStore((state) => state.storeDescription);
  const currency = useStoreStore((state) => state.currency);

  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-primary to-secondary min-h-[500px] flex items-center">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-background/5"></div>
      <div className="absolute -bottom-32 left-10 w-96 h-96 rounded-full bg-accent/10"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Always white on gradient */}
          <div className="text-white">
            <Badge className="mb-6 bg-accent text-accent-foreground hover:bg-accent px-4 py-2">
              <Flame size={14} className="ml-1" /> New Collection 2024
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 font-heading text-white">
              {storeName}
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-md leading-relaxed">
              {storeDescription}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8"
                >
                  Shop Now <ArrowLeft size={18} className="mr-2" />
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30  hover:bg-background/10 text-foreground rounded-full px-8"
                >
                  View Categories
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 text-white">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-white/80">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-sm text-white/80">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.8★</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
            </div>
          </div>

          {/* Product Card - Uses theme colors */}
          <div className="relative">
            <div className="bg-card text-card-foreground rounded-2xl shadow-2xl rotate-3 p-4 max-w-sm mx-auto">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
                  alt="Featured Product"
                  className="rounded-xl w-full h-80 object-cover"
                />
                <Badge className="absolute -top-4 -left-4 bg-accent text-accent-foreground hover:bg-accent -rotate-6 text-sm px-4 py-2">
                  ⚡ Hot Deal
                </Badge>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Fashion</p>
                    <h3 className="font-bold text-lg text-card-foreground">
                      Classic Watch Collection
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-accent text-accent"
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">
                        (4.8) · 124 reviews
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-primary">
                      899 {currency}
                    </div>
                    <div className="text-sm text-muted-foreground line-through">
                      1,199 {currency}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
