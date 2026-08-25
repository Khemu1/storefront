"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  Sun,
  Moon,
  Grid,
  Headphones,
  Tag,
  Watch,
  Palette,
  House,
  Gem,
  Flame,
  Sparkles,
  TrendingUp,
  Clock,
  BadgePercent,
} from "lucide-react";
import { useTheme } from "next-themes";

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

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

const categories = [
  {
    name: "All Products",
    icon: Grid,
    description: "Browse everything",
    color: "text-primary bg-primary/10",
  },
  {
    name: "Electronics",
    icon: Headphones,
    description: "Gadgets & tech",
    color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/40",
  },
  {
    name: "Fashion",
    icon: Tag,
    description: "Clothing & style",
    color: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-950/40",
  },
  {
    name: "Accessories",
    icon: Watch,
    description: "Complete your look",
    color:
      "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950/40",
  },
  {
    name: "Beauty",
    icon: Palette,
    description: "Makeup & care",
    color: "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-950/40",
  },
  {
    name: "Home & Living",
    icon: House,
    description: "Decor & furniture",
    color:
      "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/40",
  },
  {
    name: "Jewelry",
    icon: Gem,
    description: "Precious pieces",
    color:
      "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40",
  },
  {
    name: "Sports",
    icon: Flame,
    description: "Fitness & outdoors",
    color:
      "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-950/40",
  },
];

const quickLinks = [
  {
    name: "New Arrivals",
    icon: Sparkles,
    description: "Latest products",
  },
  {
    name: "Best Sellers",
    icon: TrendingUp,
    description: "Most popular",
  },
  {
    name: "Deals",
    icon: BadgePercent,
    description: "Special offers",
  },
  {
    name: "Coming Soon",
    icon: Clock,
    description: "Upcoming items",
  },
];

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#"
            className="shrink-0 font-heading text-2xl font-bold text-foreground"
          >
            Souq<span className="text-primary">ly</span>
          </a>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="px-3 py-2 font-semibold text-primary"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Categories */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  Categories
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-1 p-4">
                    {categories.map((category) => {
                      const Icon = category.icon;

                      return (
                        <a
                          key={category.name}
                          href="#"
                          className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                        >
                          <div
                            className={cn(
                              "shrink-0 rounded-lg p-2",
                              category.color,
                            )}
                          >
                            <Icon size={20} />
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                              {category.name}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Quick Links */}
              {quickLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink
                      href="#"
                      className="px-3 py-2 font-semibold text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}

              {/* Sale */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="px-3 py-2 font-bold text-destructive transition-colors hover:text-destructive/80"
                >
                  Sale
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="hidden max-w-xs flex-1 md:flex">
            <div className="group relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border-transparent bg-muted pr-10 transition-all focus:border-primary"
              />

              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative"
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

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />

              <Badge className="absolute -right-1 -top-1 h-4 w-4 bg-destructive p-0 text-[10px] text-destructive-foreground">
                3
              </Badge>
            </Button>

            {/* Desktop Cart */}
            <Button className="hidden gap-2 rounded-full sm:flex">
              <ShoppingCart size={18} />

              <span>Cart</span>

              <Badge variant="secondary" className="h-5 min-w-5 rounded-full">
                2
              </Badge>
            </Button>

            {/* Mobile Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative sm:hidden"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />

              <Badge className="absolute -right-1 -top-1 h-4 w-4 bg-destructive p-0 text-[10px] text-destructive-foreground">
                2
              </Badge>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                type="button"
                aria-label="Open menu"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center",
                  "rounded-md",
                  "text-foreground",
                  "transition-colors",
                  "hover:bg-muted",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-ring",
                  "lg:hidden",
                )}
              >
                <Menu size={20} />
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-heading text-2xl font-bold">
                    Souq<span className="text-primary">ly</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="relative mb-4 mt-6">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-full bg-muted pr-10"
                  />

                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>

                {/* Mobile Navigation */}
                <div className="flex flex-col gap-1">
                  {/* Home */}
                  <a
                    href="#"
                    className="py-2 font-semibold text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Home
                  </a>

                  {/* Categories */}
                  <div className="py-2">
                    <p className="mb-2 font-semibold text-foreground">
                      Categories
                    </p>

                    <div className="grid grid-cols-2 gap-1 pr-4">
                      {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                          <a
                            key={category.name}
                            href="#"
                            className="flex items-center gap-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            onClick={() => setMobileOpen(false)}
                          >
                            <Icon size={16} />

                            <span className="text-sm">{category.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Links */}
                  {quickLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <a
                        key={link.name}
                        href="#"
                        className="flex items-center gap-2 py-2 font-semibold text-foreground transition-colors hover:text-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon size={16} />

                        {link.name}
                      </a>
                    );
                  })}

                  {/* Sale */}
                  <a
                    href="#"
                    className="py-2 font-bold text-destructive"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sale
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
