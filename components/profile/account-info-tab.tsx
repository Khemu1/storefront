"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import type { UseMutationResult } from "@tanstack/react-query";
import type { CustomerProfile } from "@/types/profile";
import { AddressBook } from "./address-book";
import { getFieldErrors, getErrorMessage } from "@/lib/api-error";
import {
  accountInfoSchema,
  emailFormSchema,
  passwordFormSchema,
} from "@/schemas/profile";

interface AccountInfoTabProps {
  profile?: CustomerProfile;
  isLoading: boolean;
  updateMutation: UseMutationResult<any, any, any, any>;
}

export function AccountInfoTab({
  profile,
  isLoading,
  updateMutation,
}: AccountInfoTabProps) {
  // Profile form state (no address anymore)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Email form state
  const [email, setEmail] = useState("");
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({});

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
      });
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailErrors({});
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = accountInfoSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setFormErrors(fieldErrors);
      toast.error(result.error.issues[0].message);
      return;
    }

    setFormErrors({});
    updateMutation.mutate(result.data, {
      onError: (error) => {
        setFormErrors(
          getFieldErrors(error, {
            name: "Invalid name",
            phone: "Invalid phone number",
          }),
        );
      },
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailFormSchema.safeParse({ email });
    if (!result.success) {
      setEmailErrors({ email: result.error.issues[0].message });
      toast.error(result.error.issues[0].message);
      return;
    }

    setEmailErrors({});
    updateMutation.mutate(result.data, {
      onError: (error) => {
        setEmailErrors(
          getFieldErrors(error, { email: "Invalid email address" }),
        );
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = passwordFormSchema.safeParse(passwordForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setPasswordErrors(fieldErrors);
      toast.error(result.error.issues[0].message);
      return;
    }

    setPasswordErrors({});
    updateMutation.mutate(
      { new_password: result.data.new_password },
      {
        onSuccess: () => {
          setPasswordForm({ new_password: "", confirm_password: "" });
        },
        onError: (error) => {
          setPasswordErrors(
            getFieldErrors(error, { new_password: "Invalid password" }),
          );
          toast.error("Update failed", {
            description: getErrorMessage(error),
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold font-heading mb-1">
            Account information
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Update your personal contact details.
          </p>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                      aria-invalid={!!formErrors.name}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-xs text-destructive">
                      {formErrors.name}
                    </p>
                  )}
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
                      aria-invalid={!!formErrors.phone}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-xs text-destructive">
                      {formErrors.phone}
                    </p>
                  )}
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

      {/* Email Change */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold font-heading mb-1">Email address</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Change the email associated with your account.
          </p>

          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="change-email">Email address</Label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="change-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    className="pl-10 text-left"
                    dir="ltr"
                    aria-invalid={!!emailErrors.email}
                  />
                </div>
                {emailErrors.email && (
                  <p className="text-xs text-destructive">
                    {emailErrors.email}
                  </p>
                )}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Mail size={16} className="ml-2" />
                      Update email
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <AddressBook />

      {/* Password Change */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold font-heading mb-1">
            Change password
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Set a new password for your account.
          </p>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="new-password"
                    name="new_password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    className="pl-10 pr-10 text-left"
                    dir="ltr"
                    aria-invalid={!!passwordErrors.new_password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.new_password ? (
                  <p className="text-xs text-destructive">
                    {passwordErrors.new_password}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Minimum 8 characters.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="confirm-password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordChange}
                    className="pl-10 pr-10 text-left"
                    dir="ltr"
                    aria-invalid={!!passwordErrors.confirm_password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {passwordErrors.confirm_password && (
                  <p className="text-xs text-destructive">
                    {passwordErrors.confirm_password}
                  </p>
                )}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={16} className="ml-2" />
                      Change password
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
