"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStoreStore } from "@/stores/store-store";
import { useCustomerLogin } from "@/hooks/use-customer-auth";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { storeName } = useStoreStore();
  const loginMutation = useCustomerLogin();
  const isAuthenticated = useCustomerAuthStore(
    (state) => state.isAuthenticated,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // If already authenticated, redirect to products
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect");
      if (redirect) {
        router.push(decodeURIComponent(redirect));
      } else {
        router.push("/products");
      }
    }
  }, [isAuthenticated, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const redirect = searchParams.get("redirect");

    loginMutation.mutate(formData, {
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
              Welcome to {storeName}
            </h1>
            <p className="text-muted-foreground">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>

            <Button
              type="submit"
              className="w-full rounded-full h-12"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 size={18} className="ml-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Register here
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
