// app/profile/page.tsx
"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCustomerUpdate,
  useCustomerLogout,
} from "@/hooks/use-customer-auth";
import {
  useCustomerProfile,
  useCustomerOrders,
} from "@/hooks/use-customer-profile";
import { useCustomerReviews } from "@/hooks/use-reviews";
import { AuthGuard } from "@/components/auth-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountInfoTab } from "@/components/profile/account-info-tab";
import { OrdersTab } from "@/components/profile/orders-tab";
import { ReviewsTab } from "@/components/profile/reviews-tab";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { User, Package, Star } from "lucide-react";

type TabValue = "account" | "orders" | "reviews";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateMutation = useCustomerUpdate();
  const logout = useCustomerLogout();

  // Get active tab from URL or default to "account"
  const tabParam = searchParams.get("tab") as TabValue | null;
  const activeTab: TabValue = tabParam || "account";

  // Orders pagination
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  const { data: profile, isLoading: profileLoading } = useCustomerProfile();

  // Only fetch orders when orders tab is active
  const { data: ordersData, isLoading: ordersLoading } = useCustomerOrders(
    page,
    10,
    activeTab === "orders",
  );

  // Fetch reviews when reviews tab is active
  const { data: reviewsData, isLoading: reviewsLoading } = useCustomerReviews(
    activeTab === "reviews",
  );

  const orders = ordersData?.items || [];
  const ordersMeta = ordersData?.meta;
  const reviews = reviewsData?.items || [];
  const reviewsMeta = reviewsData?.meta;

  // Update URL when tab changes
  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      // Reset page when switching tabs
      if (value !== "orders") {
        params.delete("page");
      }
      router.push(`/profile?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Update URL when page changes
  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "orders");
      params.set("page", String(newPage));
      router.push(`/profile?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-2">
            My profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account, view orders, and review products
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar
              name={profile?.name}
              email={profile?.email || ""}
              onLogout={handleLogout}
            />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="account" className="gap-2">
                  <User size={15} />
                  Account
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Package size={15} />
                  Orders
                  {ordersMeta?.totalItems ? (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({ordersMeta.totalItems})
                    </span>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2">
                  <Star size={15} />
                  Reviews
                  {reviewsMeta?.totalItems ? (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({reviewsMeta.totalItems})
                    </span>
                  ) : null}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="mt-0">
                <AccountInfoTab
                  profile={profile}
                  isLoading={profileLoading}
                  updateMutation={updateMutation}
                />
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <OrdersTab
                  orders={orders}
                  isLoading={ordersLoading}
                  meta={ordersMeta}
                  page={page}
                  onPageChange={handlePageChange}
                />
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <ReviewsTab
                  reviews={reviews}
                  isLoading={reviewsLoading}
                  meta={reviewsMeta}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
