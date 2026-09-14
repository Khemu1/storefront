import { useState } from "react";
import { MapPin, Plus, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CustomerAddress } from "@/types/profile";
import { AddressFormDialog } from "@/components/profile/address-form-dialog";
import { EGYPT_GOVERNORATES } from "@/lib/egypt-locations";

const MAX_ADDRESSES = 5;

interface AddressSelectorProps {
  addresses: CustomerAddress[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

function formatAddressLine(addr: CustomerAddress) {
  const gov = EGYPT_GOVERNORATES.find((g) => g.value === addr.state);
  const area = gov?.areas.find((a) => a.value === addr.area);
  const parts = [addr.address, area?.label, gov?.label, addr.country].filter(
    Boolean,
  );
  return parts.join(", ");
}

export function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  isLoading,
}: AddressSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );

  const atLimit = addresses.length >= MAX_ADDRESSES;

  const handleAddNew = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleEdit = (addr: CustomerAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-primary" />
            <h2 className="text-xl font-bold font-heading">Shipping Address</h2>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                You don&apos;t have any saved addresses yet.
              </p>
              <Button type="button" onClick={handleAddNew}>
                <Plus size={16} className="ml-2" />
                Add an address
              </Button>
            </div>
          ) : (
            <div
              className="space-y-3"
              role="radiogroup"
              aria-label="Shipping address"
            >
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedId;
                return (
                  <label
                    key={addr.id}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <input
                      type="radio"
                      name="shipping-address"
                      value={addr.id}
                      checked={isSelected}
                      onChange={() => onSelect(addr.id)}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {addr.is_default && (
                          <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1 break-words">
                        {formatAddressLine(addr)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleEdit(addr, e)}
                      className="text-muted-foreground hover:text-foreground p-1 shrink-0"
                      aria-label="Edit address"
                    >
                      <Pencil size={14} />
                    </button>
                  </label>
                );
              })}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddNew}
                disabled={atLimit}
              >
                <Plus size={16} className="ml-2" />
                {atLimit
                  ? `Maximum of ${MAX_ADDRESSES} addresses reached`
                  : "Add new address"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddressFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        address={editingAddress}
      />
    </>
  );
}
