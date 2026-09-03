import { LuStar } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, size = 14, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <LuStar
          key={star}
          size={size}
          className={cn(
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
