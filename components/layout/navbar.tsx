"use client";

import { ForwardRefExoticComponent, useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  Sun,
  Moon,
  Grid,
  X,
  Home,
  Tag,
  Headphones,
  Watch,
  Footprints,
  Gem,
  House,
  Palette,
  Flame,
  Puzzle,
  BookOpen,
  Coffee,
  HeartPulse,
  Car,
  PawPrint,
  Briefcase,
  ArrowLeft,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useStoreStore } from "@/stores/store-store";
import { useCustomerAuthStore, useIsAuthenticated } from "@/stores/customer-auth-store";
import { useCustomerLogout } from "@/hooks/use-customer-auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCartCount } from "@/hooks/use-cart";

const categoryIcons: Record<string, ForwardRefExoticComponent<any>> = {
  Clothing: Tag,
  Electronics: Headphones,
  Accessories: Watch,
  Footwear: Footprints,
  Jewelry: Gem,
  "Home & Living": House,
  Beauty: Palette,
  Sports: Flame,
  Toys: Puzzle,
  Books: BookOpen,
  "Food & Beverage": Coffee,
  Health: HeartPulse,
  Automotive: Car,
  "Pet Supplies": PawPrint,
  Office: Briefcase,
};

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { storeName, categories, currency } = useStoreStore();
  const user = useCustomerAuthStore((state) => state.user);
  const isAuthenticated = useIsAuthenticated();
  const logout = useCustomerLogout();

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query for cart count
  const { data: cartCount = 0 } = useCartCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  // Show first 3 categories inline
  const visibleCategories = categories.slice(0, 3);
  const remainingCategories = categories.slice(3);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 font-heading text-2xl font-bold text-foreground whitespace-nowrap"
          >
            {storeName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                  <Link
                    href="/"
                    className="px-3 py-2 font-semibold text-primary whitespace-nowrap"
                  >
                    Home
                  </Link>
                </NavigationMenuItem>

                {/* First 3 Categories (inline) */}
                {visibleCategories.map((category) => {
                  const Icon = categoryIcons[category.name] || Grid;
                  return (
                    <NavigationMenuItem key={category.id}>
                      <Link
                        href={`/products?category=${category.id}`}
                        className="px-3 py-2 font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1"
                      >
                        <Icon size={14} />
                        {category.name}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}

                {/* More Categories Dropdown */}
                {remainingCategories.length > 0 && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-semibold">
                      More
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[500px] grid-cols-2 gap-1 p-4">
                        {remainingCategories.map((category) => {
                          const Icon = categoryIcons[category.name] || Grid;
                          return (
                            <Link
                              key={category.id}
                              href={`/products?category=${category.id}`}
                              className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                            >
                              <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                                <Icon size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                  {category.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {category.description || "Browse products"}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )
              ) : (
                <Moon size={20} />
              )}
            </Button>

            {isAuthenticated && (
              <Link href="/cart">
                <Button className="gap-2 rounded-full relative">
                  <ShoppingCart size={18} />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Auth - Desktop */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" className="gap-2 rounded-full">
                    <User size={18} />
                    <span className="max-w-[100px] truncate">{user?.name}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" className="gap-2 rounded-full">
                    <LogIn size={16} />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="gap-2 rounded-full">
                    <UserPlus size={16} />
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[340px] p-0 overflow-y-auto">
          {/* Mobile Sheet Header */}
          <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {storeName}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* User Info or Login/Register - Mobile */}
          <div className="p-4 border-b border-border">
            {isAuthenticated ? (
              <Link href="/profile" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn size={16} />
                    Login
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1"
                >
                  <Button className="w-full gap-2">
                    <UserPlus size={16} />
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full bg-muted pl-10"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="p-4">
            {/* Home Link */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg p-3 bg-primary/10 text-primary font-semibold"
            >
              <Home size={18} />
              Home
            </Link>

            {/* Categories Section */}
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-bold uppercase text-muted-foreground">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.name] || Grid;
                  return (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg p-3 text-foreground transition-colors hover:bg-muted"
                    >
                      <div className="rounded-lg bg-muted p-2">
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                      <ArrowLeft
                        size={14}
                        className="mr-auto text-muted-foreground"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="sticky bottom-0 bg-card border-t border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Currency: {currency}
              </span>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {resolvedTheme === "dark" ? (
                  <Sun size={16} className="ml-2" />
                ) : (
                  <Moon size={16} className="ml-2" />
                )}
                {resolvedTheme === "dark" ? "Light" : "Dark"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
