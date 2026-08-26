// app/profile/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import {
  useCustomerUpdate,
  useCustomerLogout,
} from "@/hooks/use-customer-auth";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import { AuthGuard } from "@/components/auth-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountInfoTab } from "@/components/profile/account-info-tab";
import { OrdersTab } from "@/components/profile/orders-tab";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { User, Package } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const updateMutation = useCustomerUpdate();
  const logout = useCustomerLogout();
  const { data: profile, isLoading } = useCustomerProfile();

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
            Manage your account and view your orders
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar
              name={profile?.name}
              email={profile?.email}
              onLogout={handleLogout}
            />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="account" className="gap-2">
                  <User size={15} />
                  Account
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Package size={15} />
                  Orders
                  {!!profile?.orders?.length && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({profile.orders.length})
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="mt-0">
                <AccountInfoTab
                  profile={profile}
                  isLoading={isLoading}
                  updateMutation={updateMutation}
                />
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <OrdersTab orders={profile?.orders} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
