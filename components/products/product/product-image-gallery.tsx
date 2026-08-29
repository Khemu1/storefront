"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  isInStock: boolean;
}

export function ProductImageGallery({
  images,
  productName,
  isInStock,
}: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
        <Image
          src={images[activeImage]}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
          unoptimized
        />
        {!isInStock && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors shrink-0",
                activeImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground",
              )}
            >
              <Image
                src={image}
                alt={`${productName} - ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
