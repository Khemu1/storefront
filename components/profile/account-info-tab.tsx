"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import { CustomerFullProfile } from "@/types/profile";

interface AccountInfoTabProps {
  profile?: CustomerFullProfile;
  isLoading: boolean;
  updateMutation: UseMutationResult<any, any, any, any>;
}

export function AccountInfoTab({
  profile,
  isLoading,
  updateMutation,
}: AccountInfoTabProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      address: formData.address || undefined,
    });
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold font-heading mb-1">
          Account information
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Update your contact details and delivery address.
        </p>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="pl-10 text-left bg-muted"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email can't be changed. Contact support if you need to update
                it.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Your address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="rounded-full px-8"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="ml-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="ml-2" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
