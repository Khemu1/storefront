// components/products-section.tsx
import { Grid, List, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 1299,
    oldPrice: 1599,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    badgeColor: "warning" as const,
    colors: ["#1a1a1a", "#C81E5C", "#FFC93C"],
  },
  {
    id: 2,
    name: "Minimalist Watch",
    category: "Accessories",
    price: 899,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    rating: 4.9,
    reviews: 256,
    badge: "New",
    badgeColor: "success" as const,
    colors: ["#C0C0C0", "#8B4513", "#000"],
  },
  {
    id: 3,
    name: "Leather Backpack",
    category: "Fashion",
    price: 749,
    oldPrice: 999,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    rating: 4.7,
    reviews: 89,
    badge: "-25%",
    badgeColor: "danger" as const,
    colors: ["#8B4513", "#2F4F4F"],
  },
  {
    id: 4,
    name: "Smart Watch Pro",
    category: "Electronics",
    price: 2499,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
    rating: 4.6,
    reviews: 167,
    badge: "Hot",
    badgeColor: "danger" as const,
    colors: ["#000", "#C0C0C0"],
  },
  {
    id: 5,
    name: "Sunglasses",
    category: "Accessories",
    price: 399,
    oldPrice: 599,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    rating: 4.5,
    reviews: 45,
    badge: "-33%",
    badgeColor: "danger" as const,
    colors: ["#000", "#8B4513"],
  },
  {
    id: 6,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 599,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    rating: 4.8,
    reviews: 312,
    badge: "Best Seller",
    badgeColor: "warning" as const,
    colors: ["#fff", "#000"],
  },
  {
    id: 7,
    name: "Sneakers",
    category: "Fashion",
    price: 1199,
    oldPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    rating: 4.9,
    reviews: 201,
    badge: "-20%",
    badgeColor: "danger" as const,
    colors: ["#FF6B4A", "#fff", "#000"],
  },
  {
    id: 8,
    name: "Camera Lens",
    category: "Electronics",
    price: 3499,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80",
    rating: 4.7,
    reviews: 78,
    badge: "Premium",
    badgeColor: "info" as const,
    colors: ["#000"],
  },
];

export function ProductsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-heading">Featured Products</h2>
          <p className="text-muted-foreground">Handpicked just for you</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Grid size={18} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <List size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" size="lg" className="rounded-full px-8">
          View All Products
          <ArrowLeft size={18} className="mr-2" />
        </Button>
      </div>
    </section>
  );
}
