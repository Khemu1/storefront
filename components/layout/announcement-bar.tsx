import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-card border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />

      <div className="relative flex items-center justify-center gap-2 px-4 py-2 text-sm">
        <Sparkles
          size={14}
          className="text-accent shrink-0"
          aria-hidden="true"
        />

        <span className="text-muted-foreground">Summer Sale:</span>

        <span className="font-semibold text-foreground">
          Up to <span className="text-accent font-bold">40% Off</span> on
          Selected Items
        </span>

        <button
          type="button"
          className="ml-2 font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Shop Now →
        </button>
      </div>
    </div>
  );
}
