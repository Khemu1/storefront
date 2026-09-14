"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStoreStore } from "@/stores/store-store";
import { useCustomerRegister } from "@/hooks/use-customer-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Lock,
  Phone,
  User,
  MapPin,
  ArrowLeft,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { registerSchema } from "@/schemas/register";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import {
  EGYPT_GOVERNORATES,
  getAreasForGovernorate,
} from "@/lib/egypt-locations";
import { LocationCombobox } from "@/components/profile/location-combobox";

export default function RegisterPage() {
  const { storeName } = useStoreStore();
  const registerMutation = useCustomerRegister();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showAddress, setShowAddress] = useState(false);
  const [country, setCountry] = useState("Egypt");
  const [governorate, setGovernorate] = useState("");
  const [area, setArea] = useState("");
  const [addressLine, setAddressLine] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const clearAddressError = (field: string) => {
    setErrors((prev) => ({ ...prev, [`addressDetails.${field}`]: "" }));
  };

  const handleRemoveAddress = () => {
    setShowAddress(false);
    setCountry("Egypt");
    setGovernorate("");
    setArea("");
    setAddressLine("");
    setErrors((prev) => {
      const next = { ...prev };
      delete next["addressDetails.state"];
      delete next["addressDetails.area"];
      delete next["addressDetails.address"];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse({
      ...formData,
      addressDetails: showAddress
        ? {
            country: country.trim() || "Egypt",
            state: governorate,
            area,
            address: addressLine.trim(),
          }
        : undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error(result.error.issues[0].message);
      return;
    }

    setErrors({});

    const { addressDetails, ...rest } = result.data;
    const payload = {
      ...rest,
      ...(addressDetails ? { address: addressDetails } : {}),
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        if (redirect) {
          router.push(decodeURIComponent(redirect));
        } else {
          router.push("/products");
        }
      },
      onError: (error) => {
        const fieldErrors = getFieldErrors(error, {
          name: "Invalid name",
          email: "Invalid email address",
          phone: "Invalid phone number",
          password: "Invalid password",
        });
        setErrors(fieldErrors);
        toast.error("Registration failed", {
          description: getErrorMessage(error),
        });
      },
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Card className="border-none shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-heading mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground">Join {storeName} today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
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
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
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
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 text-left"
                  dir="ltr"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
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
                  aria-invalid={!!errors.phone}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 text-left"
                  dir="ltr"
                  aria-invalid={!!errors.password}
                />
              </div>
              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              )}
            </div>

            {/* Address (optional, structured) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Address (Optional)</Label>
                {showAddress ? (
                  <button
                    type="button"
                    onClick={handleRemoveAddress}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <X size={12} />
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddress(true)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Plus size={12} />
                    Add address
                  </button>
                )}
              </div>

              {showAddress && (
                <div className="space-y-3 rounded-xl border border-border p-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-xs">
                      Country / Region
                    </Label>
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Egypt"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="governorate" className="text-xs">
                      Governorate
                    </Label>
                    <LocationCombobox
                      id="governorate"
                      options={governorateOptions}
                      value={governorate}
                      onChange={(value) => {
                        setGovernorate(value);
                        clearAddressError("state");
                      }}
                      placeholder="Select governorate"
                      emptyText="No governorate found."
                    />
                    {errors["addressDetails.state"] && (
                      <p className="text-xs text-destructive">
                        {errors["addressDetails.state"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-xs">
                      Area / Neighborhood
                    </Label>
                    <LocationCombobox
                      id="area"
                      options={areaOptions}
                      value={area}
                      onChange={(value) => {
                        setArea(value);
                        clearAddressError("area");
                      }}
                      placeholder={
                        governorate
                          ? "Select area"
                          : "Select a governorate first"
                      }
                      emptyText="No area found."
                      disabled={!governorate}
                    />
                    {errors["addressDetails.area"] && (
                      <p className="text-xs text-destructive">
                        {errors["addressDetails.area"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-xs">
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        id="address"
                        value={addressLine}
                        onChange={(e) => {
                          setAddressLine(e.target.value);
                          clearAddressError("address");
                        }}
                        placeholder="89 El Thawra St, Building 5, Apt 3"
                        className="pl-10"
                      />
                    </div>
                    {errors["addressDetails.address"] && (
                      <p className="text-xs text-destructive">
                        {errors["addressDetails.address"]}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-full h-12"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 size={18} className="ml-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Continue shopping
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
