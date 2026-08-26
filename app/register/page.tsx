"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import router from "next/router";

export default function RegisterPage() {
  const { storeName } = useStoreStore();
  const registerMutation = useCustomerRegister();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData, {
      onSuccess: () => {
        if (redirect) {
          router.push(decodeURIComponent(redirect));
        } else {
          router.push("/products");
        }
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                />
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
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 text-left"
                  dir="ltr"
                  required
                />
              </div>
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
                  required
                />
              </div>
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
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
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
