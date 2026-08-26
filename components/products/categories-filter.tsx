import { cn } from "@/lib/utils";

interface CategoriesFilterProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}

export function CategoriesFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoriesFilterProps) {
  return (
    <div>
      <h3 className="font-bold text-lg mb-3">Categories</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelect("")}
          className={cn(
            "px-3 py-2 rounded-lg text-sm border text-center truncate transition-colors",
            !selectedCategory
              ? "bg-primary text-primary-foreground border-primary font-semibold"
              : "border-border hover:bg-muted",
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            title={category.name}
            className={cn(
              "px-3 py-2 rounded-lg text-sm border text-center truncate transition-colors",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground border-primary font-semibold"
                : "border-border hover:bg-muted",
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
