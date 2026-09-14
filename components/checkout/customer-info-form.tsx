"use client";

import { User, Phone, StickyNote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CustomerInfoFormProps {
  formData: {
    name: string;
    phone: string;
    notes: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  onFieldChange: (field: string, value: string) => void;
}

export function CustomerInfoForm({
  formData,
  errors,
  isLoading,
  onFieldChange,
}: CustomerInfoFormProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <User size={20} className="text-primary" />
          <h2 className="text-xl font-bold font-heading">
            Customer Information
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => onFieldChange("name", e.target.value)}
                  placeholder="Your full name"
                  className={cn("pr-10", errors.name && "border-destructive")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => onFieldChange("phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={cn(
                    "pr-10 text-left",
                    errors.phone && "border-destructive",
                  )}
                  dir="ltr"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <div className="relative">
                <StickyNote
                  size={16}
                  className="absolute right-3 top-3 text-muted-foreground"
                />
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => onFieldChange("notes", e.target.value)}
                  placeholder="Any special instructions for your order"
                  className="pr-10 min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
