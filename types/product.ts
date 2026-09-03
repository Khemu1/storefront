// src/types/products.ts

// ==================== DETAIL TYPES (Dashboard) ====================

export interface ProductImage {
  id: string;
  url: string;
  mime_type?: string;
  position: number;
}

export interface ProductDetailOptionValue {
  id: string;
  value: string;
  images: string[];
}

export interface ProductDetailOption {
  id: string;
  name: string;
  values: ProductDetailOptionValue[];
}

export interface ProductDetailVariantOptionValue {
  id: string;
  value: string;
}

export interface ProductDetailVariant {
  id: string;
  price: number | null;
  discount_price: number | null;
  stock: number;
  option_values: ProductDetailVariantOptionValue[];
}

export interface ProductDetailCategory {
  product_id: string;
  category_id: string;
  category: {
    id: string;
    name: string;
  };
}

export interface ProductDetail {
  id: string;
  store_id: string;
  name: string;
  description: string;
  base_price: number;
  discount_price: number | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  /** Flattened product images */
  images: ProductImage[];
  low_stock_threshold: number;
  is_available: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  options: ProductDetailOption[];
  variants: ProductDetailVariant[];
  categoryLinks: ProductDetailCategory[];
}

// ==================== STOREFRONT TYPES ====================

export interface ProductCardCategory {
  id: string;
  name: string;
}

export interface ProductCardVariant {
  id: string;
  price: string | null;
  discount_price?: number | null;
  current_price?: number;
  has_discount?: boolean;
  discount_percentage?: number | null;
  stock: number;
}

export interface ProductCard {
  id: string;
  name: string;
  description: string;
  base_price: string;
  discount_price?: number | null;
  current_price?: number;
  discount_percentage?: number | null;
  has_discount?: boolean;
  has_deposit?: boolean;
  deposit_percentage?: number | null;
  /** Main image URL (single string) */
  image: string | null;
  is_available: boolean;
  low_stock_threshold?: number;
  average_rating?: number;
  total_reviews?: number;
  categories: ProductCardCategory[];
  variants: ProductCardVariant[];
}

// Storefront Product Detail
export interface StorefrontProductDetailCategory {
  id: string;
  name: string;
  has_deposit?: boolean;
  deposit_percentage?: number | null;
}

export interface StorefrontProductDetailOptionValue {
  id: string;
  value: string;
  /** Flattened image URLs - just strings */
  images: string[];
}

export interface StorefrontProductDetailOption {
  id: string;
  name: string;
  values: StorefrontProductDetailOptionValue[];
}

export interface StorefrontProductDetailVariantOptionValue {
  option_name: string;
  value: string;
  option: {
    id: string;
    name: string;
  };
}

export interface StorefrontProductDetailVariant {
  id: string;
  price: number | null;
  discount_price: number | null;
  current_price: number;
  discount_percentage: number | null;
  has_discount: boolean;
  stock: number;
  option_values: StorefrontProductDetailVariantOptionValue[];
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recommended_percentage: number;
}

export interface StorefrontProductDetail {
  id: string;
  name: string;
  description: string;
  base_price: number;
  discount_price: number | null;
  current_price: number;
  discount_percentage: number | null;
  has_discount: boolean;
  /** ALL product image URLs - just strings */
  images: string[];
  is_available: boolean;
  low_stock_threshold: number;
  average_rating: number;
  total_reviews: number;
  review_stats: ReviewStats;
  has_deposit: boolean;
  deposit_percentage: number | null;
  deposit_amount: number | null;
  categories: StorefrontProductDetailCategory[];
  options: StorefrontProductDetailOption[];
  variants: StorefrontProductDetailVariant[];
}

// ==================== LISTING TYPE (Dashboard) ====================

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  base_price: number;
  discount_price: number | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  images: string[] | null;
  low_stock_threshold: number;
  is_available: boolean;
  total_stock: number;
  variants_count: number;
  has_out_of_stock: boolean;
  has_low_stock: boolean;
  has_discount: boolean;
  has_product_discount: boolean;
  has_variant_discount: boolean;
  store_currency: string | null;
  categories_count: number;
  store_name: string;
  store_slug: string | null;
  total_reviews: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface UseProductsOptions {
  page: number;
  limit?: number;
  search?: string;
  storeId?: string;
  isAvailable?: boolean;
  includeStore?: boolean;
}
