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
const FAKE_PRODUCT_IMAGES: Record<string, string[]> = {
  Clothing: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop",
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
  ],
  Footwear: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop",
  ],
  Jewelry: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
  ],
  "Home & Living": [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop",
  ],
  Beauty: [
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop",
  ],
  Sports: [
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop",
  ],
  Toys: [
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop",
  ],
  Books: [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&h=600&fit=crop",
  ],
  "Food & Beverage": [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=600&fit=crop",
  ],
  Health: [
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
  ],
  Automotive: [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=600&fit=crop",
  ],
  "Pet Supplies": [
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop",
  ],
  Office: [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1524749292158-7540c2494485?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=600&fit=crop",
  ],
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
];

function getFakeImages(categoryName: string | undefined): string[] {
  if (categoryName && FAKE_PRODUCT_IMAGES[categoryName]) {
    return FAKE_PRODUCT_IMAGES[categoryName];
  }
  return DEFAULT_IMAGES;
}
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const currency = useStoreStore((state) => state.currency);
  const addToCartMutation = useAddToCart();
  const { isAuthenticated, requireAuth } = useRequireAuth();

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

  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) {
      setSelectedVariant(null);
      return;
    }

    if (options.length === 0) {
      setSelectedVariant(product.variants[0]);
      return;
    }

    const variant = product.variants.find((v) => {
      const variantOptions = v.option_values || [];
      return options.every((option) => {
        const selectedValue = selectedOptions[option.id];
        if (!selectedValue) return true;
        const optionValue = variantOptions.find(
          (ov) => ov.option?.id === option.id,
        );
        return optionValue?.value === selectedValue;
      });
    });

    setSelectedVariant(variant || null);
  }, [selectedOptions, product, options]);

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

  const productImages = useMemo(() => {
    if (product?.images?.length) return product.images;
    if (selectedVariant?.images?.length) return selectedVariant.images;
    const primaryCategory = product?.categories?.[0]?.name;
    return getFakeImages(primaryCategory);
  }, [product, selectedVariant]);

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
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-40" />
            <Separator />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-48" />
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
      {/* Breadcrumb */}
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
          images={productImages}
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

          {/* Description */}
          {product.description && (
            <p
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            ></p>
          )}

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

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <ProductReviews productId={productId} />
      </div>
    </div>
  );
}
