// app/layout.tsx
import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { StoreInitializer } from "@/components/store-initializer";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";
import { StoreLoading } from "@/components/store-loading";
import "./globals.css";
import { CartInitializer } from "@/components/cart-initializer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Storefront",
  description: "Your store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable}`}>
        <Providers>
          <StoreInitializer />
          {/* <CartInitializer /> */}

          <StoreLoading>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
            </div>
          </StoreLoading>
          <Toaster richColors />
          <ConfirmDialog />
        </Providers>
      </body>
    </html>
  );
}
