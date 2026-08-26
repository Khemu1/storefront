// components/home/products-section.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { useStoreStore } from "@/stores/store-store";
import Link from "next/link";

export function ProductsSection() {
  const featuredProducts = useStoreStore((state) => state.featuredProducts);
  const currency = useStoreStore((state) => state.currency);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-heading">Featured Products</h2>
          <p className="text-muted-foreground">Handpicked just for you</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} currency={currency} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link href="/products">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            View All Products
            <ArrowLeft size={18} className="mr-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
