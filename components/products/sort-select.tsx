import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "./products-reducer";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const sortLabel =
    SORT_OPTIONS.find((opt) => opt.value === value)?.label || "Sort by";

  return (
    <Select
      value={value}
      onValueChange={(newValue) => {
        if (newValue) onChange(newValue);
      }}
    >
      <SelectTrigger className="w-full lg:w-55 h-12 rounded-full">
        <ArrowUpDown size={14} className="ml-2" />
        <SelectValue placeholder="Sort by">{sortLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
