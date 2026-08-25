// app/page.tsx
"use client";

import { FeaturesBar } from "@/components/home/features-bar";
import { Hero } from "@/components/home/hero";
import { PromoBanner } from "@/components/home/promo-banner";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ProductsSection } from "@/components/products/products-section";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
        <ProductsSection />
        <PromoBanner />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
