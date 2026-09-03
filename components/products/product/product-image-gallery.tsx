"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn, getCdnUrl } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";
import { ProductImage } from "@/types/product";

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
  const [imageError, setImageError] = useState(false);

  const hasImages = images.length > 0;
  const activeImageUrl = hasImages
    ? getCdnUrl() + "/" + images[activeImage]
    : null;
  const showPlaceholder = !hasImages || imageError;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Area */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
        {showPlaceholder ? (
          // Placeholder when no images or image failed to load
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3">
            <ImageIcon className="h-20 w-20 text-muted-foreground/40" />
            <span className="text-sm text-muted-foreground/60 font-medium">
              No Image Available
            </span>
          </div>
        ) : (
          <Image
            src={activeImageUrl!}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
            unoptimized
            onError={handleImageError}
          />
        )}

        {!isInStock && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && !showPlaceholder && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveImage(index);
                setImageError(false); // Reset error when switching images
              }}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors shrink-0",
                activeImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground",
              )}
            >
              <Image
                src={getCdnUrl() + "/" + image}
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
