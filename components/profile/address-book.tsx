"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Plus, Pencil, Trash2, Check, Star } from "lucide-react";
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/use-customer-profile";
import { confirm } from "@/lib/utils";
import type { CustomerAddress } from "@/types/profile";
import { AddressFormDialog } from "./address-form-dialog";

export function AddressBook() {
  const { data: addresses = [], isLoading } = useAddresses();
  const setDefaultMutation = useSetDefaultAddress();
  const deleteMutation = useDeleteAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );

  const handleAdd = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleEdit = (address: CustomerAddress) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleDelete = (address: CustomerAddress) => {
    confirm({
      title: "Delete address",
      description: `Are you sure you want to delete "${address.address}"?`,
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteMutation.mutateAsync(address.id);
      },
    });
  };

  const handleSetDefault = (address: CustomerAddress) => {
    if (address.is_default) return;
    setDefaultMutation.mutate(address.id);
  };

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-heading mb-1">
                My addresses
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your delivery addresses.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              className="rounded-full"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-10">
              <MapPin
                size={40}
                className="mx-auto text-muted-foreground/60 mb-3"
              />
              <p className="font-medium mb-1">No addresses yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first delivery address to get started.
              </p>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={handleAdd}
              >
                <Plus size={16} className="mr-1" />
                Add address
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-xl border border-border p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin size={18} className="text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">
                          {address.area}, {address.state}
                        </p>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {address.country}
                        </span>
                        {address.is_default && (
                          <Badge className="gap-1 bg-primary/10 text-primary">
                            <Star size={10} className="fill-current" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {address.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!address.is_default && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => handleSetDefault(address)}
                          disabled={setDefaultMutation.isPending}
                        >
                          <Check size={12} />
                          Set default
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(address)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(address)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <AddressFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        address={editingAddress}
      />
    </>
  );
}
