import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full pl-12 h-12 text-base"
      />
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
