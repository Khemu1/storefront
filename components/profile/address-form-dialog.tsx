"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppDialog } from "../ui/app-dialog";
import type { CustomerAddress } from "@/types/profile";
import {
  EGYPT_GOVERNORATES,
  getAreasForGovernorate,
} from "@/lib/egypt-locations";
import {
  useCreateAddress,
  useUpdateAddress,
  AddressPayload,
} from "@/hooks/use-customer-profile";
import { LocationCombobox } from "./location-combobox";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";
import { addressSchema } from "@/schemas/profile";

interface AddressFormDialogProps {
  open: boolean;
  onClose: () => void;
  address?: CustomerAddress | null;
}

export function AddressFormDialog({
  open,
  onClose,
  address,
}: AddressFormDialogProps) {
  const isEditMode = !!address;
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [country, setCountry] = useState("Egypt");
  const [governorate, setGovernorate] = useState("");
  const [area, setArea] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableAreas = useMemo(
    () => getAreasForGovernorate(governorate),
    [governorate],
  );

  const governorateOptions = useMemo(
    () =>
      EGYPT_GOVERNORATES.map((gov) => ({
        value: gov.value,
        label: gov.label,
        labelAr: gov.labelAr,
      })),
    [],
  );

  const areaOptions = useMemo(
    () =>
      availableAreas.map((a) => ({
        value: a.value,
        label: a.label,
        labelAr: a.labelAr,
      })),
    [availableAreas],
  );

  useEffect(() => {
    if (open) {
      if (address) {
        setCountry(address.country || "Egypt");
        setGovernorate(address.state || "");
        setArea(address.area || "");
        setAddressLine(address.address || "");
        setIsDefault(address.is_default);
      } else {
        setCountry("Egypt");
        setGovernorate("");
        setArea("");
        setAddressLine("");
        setIsDefault(false);
      }
      setErrors({});
    }
  }, [open, address]);

  useEffect(() => {
    if (area && governorate) {
      const stillValid = availableAreas.some((a) => a.value === area);
      if (!stillValid) setArea("");
    }
  }, [governorate, area, availableAreas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = addressSchema.safeParse({
      country: country.trim() || "Egypt",
      state: governorate,
      area,
      address: addressLine.trim(),
      is_default: isDefault,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error(result.error.issues[0].message);
      return;
    }

    setErrors({});
    const payload: AddressPayload = result.data;

    const onError = (error: unknown) => {
      setErrors(
        getFieldErrors(error, {
          country: "Invalid country",
          state: "Invalid governorate",
          area: "Invalid area",
          address: "Invalid address",
        }),
      );
      toast.error("Update failed", {
        description: getErrorMessage(error),
      });
    };

    if (isEditMode && address) {
      updateMutation.mutate(
        { id: address.id, ...payload },
        { onSuccess: onClose, onError },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose, onError });
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Address" : "Add New Address"}
      preventOutsideClose
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2" noValidate>
        <div className="space-y-2">
          <Label htmlFor="country">
            Country / Region <span className="text-destructive">*</span>
          </Label>
          <Input
            id="country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setErrors((prev) => ({ ...prev, country: "" }));
            }}
            placeholder="Egypt"
            disabled
            aria-invalid={!!errors.country}
          />
          {errors.country && (
            <p className="text-xs text-destructive">{errors.country}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="governorate">
            Governorate <span className="text-destructive">*</span>
          </Label>
          <LocationCombobox
            id="governorate"
            options={governorateOptions}
            value={governorate}
            onChange={(value) => {
              setGovernorate(value);
              setErrors((prev) => ({ ...prev, state: "" }));
            }}
            placeholder="Select governorate"
            emptyText="No governorate found."
            disabled={isPending}
          />
          {errors.state && (
            <p className="text-xs text-destructive">{errors.state}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">
            Area / Neighborhood <span className="text-destructive">*</span>
          </Label>
          <LocationCombobox
            id="area"
            options={areaOptions}
            value={area}
            onChange={(value) => {
              setArea(value);
              setErrors((prev) => ({ ...prev, area: "" }));
            }}
            placeholder={
              governorate ? "Select area" : "Select a governorate first"
            }
            emptyText="No area found."
            disabled={!governorate || isPending}
          />
          {errors.area && (
            <p className="text-xs text-destructive">{errors.area}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address"
            value={addressLine}
            onChange={(e) => {
              setAddressLine(e.target.value);
              setErrors((prev) => ({ ...prev, address: "" }));
            }}
            placeholder="89 El Thawra St, Building 5, Apt 3"
            disabled={isPending}
            aria-invalid={!!errors.address}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address}</p>
          )}
        </div>

        {!isEditMode && (
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              disabled={isPending}
              className="rounded border-border"
            />
            Set as default address
          </label>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {isEditMode ? "Saving..." : "Adding..."}
              </>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Add Address"
            )}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
