"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/use-products";
import { useStoreStore } from "@/stores/store-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft, AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";
import { useAddToCart } from "@/hooks/use-cart";
import { useRequireAuth } from "@/hooks/use-customer-auth";
import { ProductImageGallery } from "@/components/products/product/product-image-gallery";
import { ProductPrice } from "@/components/products/product/product-price";
import { ProductOptionsSelector } from "@/components/products/product/product-options-selector";
import { ProductQuantitySelector } from "@/components/products/product/product-quantity-selector";
import { ProductReviews } from "@/components/products/product/product-reviews";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const currency = useStoreStore((state) => state.currency);
  const addToCartMutation = useAddToCart();
  const { requireAuth } = useRequireAuth();

  const { data: product, isLoading, error } = useProduct(productId);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const options = useMemo(() => {
    if (!product?.options) return [];
    return product.options.map((option) => ({
      id: option.id,
      name: option.name,
      values: option.values || [],
    }));
  }, [product]);

  // Initialize default selections
  useEffect(() => {
    if (product?.options && product.options.length > 0) {
      const defaultSelections: Record<string, string> = {};
      product.options.forEach((option) => {
        if (option.values && option.values.length > 0) {
          defaultSelections[option.id] = option.values[0].value;
        }
      });
      setSelectedOptions(defaultSelections);
    }
  }, [product?.options]);

  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) {
      setSelectedVariant(null);
      return;
    }

    if (options.length === 0) {
      setSelectedVariant(product.variants[0]);
      return;
    }

    const allOptionsSelected = options.every(
      (option) => selectedOptions[option.id] !== undefined,
    );

    if (!allOptionsSelected) {
      setSelectedVariant(null);
      return;
    }

    const variant = product.variants.find((v) => {
      const variantOptions = v.option_values || [];
      return options.every((option) => {
        const selectedValue = selectedOptions[option.id];
        const optionValue = variantOptions.find(
          (ov) => ov.option?.id === option.id || ov.option_name === option.name,
        );
        return optionValue?.value === selectedValue;
      });
    });

    setSelectedVariant(variant || null);
  }, [selectedOptions, product, options]);

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id]);

  const displayPrice = useMemo(() => {
    if (selectedVariant?.current_price)
      return Number(selectedVariant.current_price);
    if (selectedVariant?.discount_price)
      return Number(selectedVariant.discount_price);
    if (selectedVariant?.price) return Number(selectedVariant.price);
    if (product?.current_price) return Number(product.current_price);
    if (product?.discount_price) return Number(product.discount_price);
    if (product?.base_price) return Number(product.base_price);
    return 0;
  }, [selectedVariant, product]);

  const originalPrice = useMemo(() => {
    if (selectedVariant?.price) return Number(selectedVariant.price);
    return Number(product?.base_price || 0);
  }, [selectedVariant, product]);

  const hasDiscount = displayPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : null;

  const currentStock = selectedVariant?.stock ?? 0;
  const isInStock = currentStock > 0;

  const depositPercentage = product?.deposit_percentage || null;
  const hasDeposit = product?.has_deposit || false;
  const depositAmount =
    hasDeposit && depositPercentage
      ? (displayPrice * depositPercentage) / 100
      : null;
  const remainingAmount =
    hasDeposit && depositAmount ? displayPrice - depositAmount : null;

  /**
   * GALLERY IMAGES LOGIC:
   *
   * Priority order:
   * 1. Product images - If the product itself has images, use them (always shown)
   * 2. Selected option value images - When user selects an option that has images
   *    (e.g., selecting "Red" shows red swatches)
   * 3. First option value with images - Fallback when product has no images
   *    (e.g., shows "green" swatches by default since it's the first value with images)
   * 4. Empty array - Shows placeholder in gallery
   */
  const galleryImages = useMemo(() => {
    // 1. Product has images → use them
    if (product?.images && product.images.length > 0) {
      return product.images;
    }

    // 2. Collect images from selected option values
    const selectedImages: string[] = [];
    if (product?.options) {
      product.options.forEach((option) => {
        const selectedValue = selectedOptions[option.id];
        if (selectedValue) {
          const value = option.values.find((v) => v.value === selectedValue);
          if (value?.images && value.images.length > 0) {
            selectedImages.push(...value.images);
          }
        }
      });
    }

    if (selectedImages.length > 0) {
      return selectedImages;
    }

    // 3. Fallback: first option value that has images
    if (product?.options) {
      for (const option of product.options) {
        for (const value of option.values) {
          if (value.images && value.images.length > 0) {
            return value.images;
          }
        }
      }
    }

    // 4. No images
    return [];
  }, [product, selectedOptions]);

  const handleOptionSelect = useCallback((optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  }, []);

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity < 1) return;
      if (newQuantity > currentStock) {
        toast.warning("Not enough stock available");
        return;
      }
      setQuantity(newQuantity);
    },
    [currentStock],
  );

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    requireAuth(() => {
      if (options.length > 0 && !selectedVariant) {
        toast.warning("Please select all options");
        return;
      }

      if (!isInStock) {
        toast.error("Product is out of stock");
        return;
      }

      const variantId =
        selectedVariant?.id || product.variants?.[0]?.id || product.id;

      addToCartMutation.mutate(
        {
          product_id: product.id,
          variant_id: variantId,
          quantity,
        },
        {
          onSuccess: () => {
            toast.success("Added to cart", {
              description: `${product.name} × ${quantity}`,
            });
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to add to cart");
          },
        },
      );
    }, `/products/${productId}`);
  }, [
    product,
    productId,
    selectedVariant,
    quantity,
    isInStock,
    addToCartMutation,
  ]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-lg shrink-0" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-40" />
            <Separator />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-destructive text-lg mb-4">Product not found</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft size={16} className="ml-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Products
      </button>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Images */}
        <ProductImageGallery
          images={galleryImages}
          productName={product.name}
          isInStock={isInStock}
        />

        {/* Product Info */}
        <div className="space-y-7">
          {/* Categories */}
          {product.categories?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {product.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Name */}
          <h1 className="text-3xl lg:text-4xl font-bold font-heading leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <ProductPrice
            displayPrice={displayPrice}
            originalPrice={originalPrice}
            currency={currency}
            hasDiscount={hasDiscount}
            discountPercentage={discountPercentage}
            hasDeposit={hasDeposit}
            depositPercentage={depositPercentage}
            depositAmount={depositAmount}
            remainingAmount={remainingAmount}
          />

          <Separator />

          {/* Options Selection */}
          <ProductOptionsSelector
            options={options}
            selectedOptions={selectedOptions}
            onOptionSelect={handleOptionSelect}
          />

          {/* Stock Info */}
          <div className="flex items-center gap-2">
            {isInStock ? (
              currentStock <= 5 ? (
                <Badge variant="secondary" className="gap-1.5">
                  <AlertTriangle size={14} />
                  Only {currentStock} left
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1.5">
                  <Package size={14} />
                  In Stock
                </Badge>
              )
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity Selector */}
          {isInStock && (
            <ProductQuantitySelector
              quantity={quantity}
              currentStock={currentStock}
              onQuantityChange={handleQuantityChange}
            />
          )}

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-full px-10 h-12"
            onClick={handleAddToCart}
            disabled={!isInStock || (options.length > 0 && !selectedVariant)}
          >
            <ShoppingCart size={18} className="ml-2" />
            {!isInStock
              ? "Out of Stock"
              : options.length > 0 && !selectedVariant
                ? "Select Options"
                : "Add to Cart"}
          </Button>

          {/* Deposit Note */}
          {hasDeposit && (
            <p className="text-xs text-muted-foreground">
              * A {depositPercentage}% deposit is required for this product. The
              remaining amount is due upon delivery.
            </p>
          )}
        </div>
      </div>

      {/* Description Section */}
      {product.description && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div className="prose prose-sm sm:prose-base max-w-none text-foreground leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <ProductReviews productId={productId} />
      </div>
    </div>
  );
}
