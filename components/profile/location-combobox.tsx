"use client";

import * as React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

export interface LocationOption {
  value: string;
  label: string;
  labelAr: string;
}

interface LocationComboboxProps {
  id?: string;
  options: LocationOption[];
  /** Plain string code, e.g. "cairo" or "" when nothing selected */
  value: string;
  /** Receives the plain string code, e.g. "cairo" or "" on clear */
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function LocationCombobox({
  id,
  options,
  value,
  onChange,
  placeholder = "Select...",
  emptyText = "No results found.",
  disabled,
}: LocationComboboxProps) {
  const selectedItem = React.useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  );

  return (
    <Combobox
      items={options}
      value={selectedItem}
      onValueChange={(item: LocationOption | null) =>
        onChange(item?.value ?? "")
      }
      // Match against English + Arabic labels when filtering as the user types
      itemToStringLabel={(item: LocationOption) =>
        `${item.label} ${item.labelAr}`
      }
      // What actually gets stored/submitted for this selection
      itemToStringValue={(item: LocationOption) => item.value}
      disabled={disabled}
    >
      <ComboboxInput id={id} placeholder={placeholder} showClear={!!value} />
      <ComboboxContent>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(item: LocationOption) => (
            <ComboboxItem key={item.value} value={item}>
              <span className="flex w-full items-center justify-between gap-3 truncate">
                <span className="truncate">{item.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.labelAr}
                </span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
