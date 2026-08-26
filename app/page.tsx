// app/page.tsx
"use client";

import { FeaturesBar } from "@/components/home/features-bar";
import { Hero } from "@/components/home/hero";
import { PromoBanner } from "@/components/home/promo-banner";
import { ProductsSection } from "@/components/home/products-section";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesBar />
      <ProductsSection />
      <PromoBanner />
    </>
  );
}
