// components/product-card.tsx
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    oldPrice?: number;
    image: string;
    rating: number;
    reviews: number;
    badge: string;
    badgeColor: "danger" | "warning" | "success" | "info";
    colors: string[];
  };
}

const badgeStyles = {
  danger: "bg-destructive text-destructive-foreground",
  warning: "bg-accent text-accent-foreground",
  success: "bg-green-500 text-white dark:bg-green-600",
  info: "bg-blue-500 text-white dark:bg-blue-600",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group border-none shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <Badge
          className={`absolute top-3 left-3 ${badgeStyles[product.badgeColor]}`}
        >
          {product.badge}
        </Badge>

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 rounded-full bg-background/90 hover:bg-background backdrop-blur-sm"
        >
          <Heart size={16} className="text-foreground" />
        </Button>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-card/95 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button className="w-full rounded-full gap-2">
            <ShoppingCart size={16} />
            Quick Add
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="font-bold mt-1 text-card-foreground">{product.name}</h3>

        <div className="flex gap-1 mt-2">
          {product.colors.map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border-2 border-background shadow ring-1 ring-border cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 mt-2">
          <Star size={12} className="fill-accent text-accent" />
          <span className="text-sm font-semibold text-card-foreground">
            {product.rating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-card-foreground">
            {product.price} EGP
          </span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.oldPrice}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
