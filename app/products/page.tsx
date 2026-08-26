"use client";

import { useReducer, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import { useStoreStore } from "@/stores/store-store";
import { SearchBar } from "@/components/products/search-bar";
import { SortSelect } from "@/components/products/sort-select";
import { ActiveFilters } from "@/components/products/active-filters";
import { CategoriesFilter } from "@/components/products/categories-filter";
import { PriceRangeFilter } from "@/components/products/price-range-filter";
import { ProductsGrid } from "@/components/products/products-grid";
import { Pagination } from "@/components/products/pagination";
import { MobileFiltersSheet } from "@/components/products/mobile-filters-sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { productsReducer, initialState } from "@/components/products/products-reducer";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, currency } = useStoreStore();
  const [state, dispatch] = useReducer(productsReducer, initialState);

  // Initialize from URL
  useEffect(() => {
    const urlState: any = {};
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const page = searchParams.get("page");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (search) urlState.search = search;
    if (category) urlState.selectedCategory = category;
    if (sort) urlState.sortBy = sort;
    if (page) urlState.page = Number(page);
    if (minPrice) {
      urlState.appliedMinPrice = Number(minPrice);
      urlState.minPriceInput = minPrice;
    }
    if (maxPrice) {
      urlState.appliedMaxPrice = Number(maxPrice);
      urlState.maxPriceInput = maxPrice;
    }

    dispatch({ type: "INIT_FROM_URL", payload: urlState });
  }, [searchParams]);

  const hasPriceFilter =
    state.appliedMinPrice !== undefined || state.appliedMaxPrice !== undefined;

  const priceRangeLabel = useMemo(() => {
    if (
      state.appliedMinPrice !== undefined &&
      state.appliedMaxPrice !== undefined
    ) {
      return `${state.appliedMinPrice} - ${state.appliedMaxPrice}`;
    }
    if (state.appliedMinPrice !== undefined)
      return `From ${state.appliedMinPrice}`;
    if (state.appliedMaxPrice !== undefined)
      return `Up to ${state.appliedMaxPrice}`;
    return "";
  }, [state.appliedMinPrice, state.appliedMaxPrice]);

  const { data, isLoading, error } = useProducts({
    page: state.page,
    limit: state.limit,
    category: state.selectedCategory || undefined,
    search: state.search || undefined,
    sort: state.sortBy,
    minPrice: state.appliedMinPrice,
    maxPrice: state.appliedMaxPrice,
  });

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.search) params.set("search", state.search);
    if (state.selectedCategory) params.set("category", state.selectedCategory);
    if (state.appliedMinPrice !== undefined)
      params.set("minPrice", state.appliedMinPrice.toString());
    if (state.appliedMaxPrice !== undefined)
      params.set("maxPrice", state.appliedMaxPrice.toString());
    if (state.sortBy !== "newest") params.set("sort", state.sortBy);
    if (state.page > 1) params.set("page", state.page.toString());

    const url = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/products${url}`, { scroll: false });
  }, [
    state.search,
    state.selectedCategory,
    state.appliedMinPrice,
    state.appliedMaxPrice,
    state.sortBy,
    state.page,
    router,
  ]);

  const hasActiveFilters =
    state.search || state.selectedCategory || hasPriceFilter;

  const handlers = {
    search: useCallback(
      (value: string) => dispatch({ type: "SET_SEARCH", payload: value }),
      [],
    ),
    category: useCallback(
      (value: string) => dispatch({ type: "SET_CATEGORY", payload: value }),
      [],
    ),
    sort: useCallback(
      (value: string) => dispatch({ type: "SET_SORT", payload: value }),
      [],
    ),
    page: useCallback((value: number) => {
      dispatch({ type: "SET_PAGE", payload: value });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []),
    applyPrice: useCallback(() => {
      dispatch({ type: "APPLY_PRICE_RANGE" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []),
    clearPrice: useCallback(
      () => dispatch({ type: "CLEAR_PRICE_RANGE" }),
      [],
    ),
    quickPrice: useCallback(
      (value: string) =>
        dispatch({ type: "SET_QUICK_PRICE_RANGE", payload: value }),
      [],
    ),
    clearAll: useCallback(
      () => dispatch({ type: "CLEAR_ALL_FILTERS" }),
      [],
    ),
    mobileFilters: useCallback(
      (value: boolean) =>
        dispatch({ type: "SET_MOBILE_FILTERS", payload: value }),
      [],
    ),
  };

  return (
    <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 lg:py-12">
      {/* Page Header */}
      <div className="mb-6 lg:mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold font-heading mb-2 lg:mb-3">
          Products
        </h1>
        <p className="text-muted-foreground text-base lg:text-lg">
          {data?.total || 0} products available
        </p>
      </div>

      {/* Search and Sort Bar - Improved Mobile Layout */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 mb-6 lg:mb-8">
        {/* Search - Full width on mobile */}
        <div className="w-full lg:flex-1">
          <SearchBar value={state.search} onChange={handlers.search} />
        </div>

        {/* Sort and Filters - Side by side on mobile */}
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none">
            <SortSelect value={state.sortBy} onChange={handlers.sort} />
          </div>
          <Button
            variant="outline"
            className="lg:hidden rounded-full h-12 px-4 flex-shrink-0"
            onClick={() => handlers.mobileFilters(true)}
          >
            <SlidersHorizontal size={16} className="ml-2" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {[
                  state.search,
                  state.selectedCategory,
                  hasPriceFilter,
                ].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        categories={categories}
        selectedCategory={state.selectedCategory}
        hasPriceFilter={hasPriceFilter}
        priceRangeLabel={priceRangeLabel}
        search={state.search}
        currency={currency}
        onClearCategory={() => handlers.category("")}
        onClearPriceRange={handlers.clearPrice}
        onClearSearch={() => handlers.search("")}
        onClearAll={handlers.clearAll}
      />

      <div className="flex gap-10 xl:gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 space-y-6">
            <CategoriesFilter
              categories={categories}
              selectedCategory={state.selectedCategory}
              onSelect={handlers.category}
            />
            <Separator />
            <PriceRangeFilter
              currency={currency}
              selectedPriceRange={state.selectedPriceRange}
              minPriceInput={state.minPriceInput}
              maxPriceInput={state.maxPriceInput}
              hasPriceFilter={hasPriceFilter}
              onQuickRangeSelect={handlers.quickPrice}
              onMinPriceChange={(value) =>
                dispatch({ type: "SET_MIN_PRICE_INPUT", payload: value })
              }
              onMaxPriceChange={(value) =>
                dispatch({ type: "SET_MAX_PRICE_INPUT", payload: value })
              }
              onApply={handlers.applyPrice}
              onClear={handlers.clearPrice}
            />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ProductsGrid
            products={data?.items || []}
            isLoading={isLoading}
            error={error as Error | null}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handlers.clearAll}
          />
          {data && data.total_pages > 1 && (
            <Pagination
              currentPage={state.page}
              totalPages={data.total_pages}
              onPageChange={handlers.page}
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <MobileFiltersSheet
        open={state.mobileFiltersOpen}
        onOpenChange={handlers.mobileFilters}
        categories={categories}
        currency={currency}
        selectedCategory={state.selectedCategory}
        selectedPriceRange={state.selectedPriceRange}
        minPriceInput={state.minPriceInput}
        maxPriceInput={state.maxPriceInput}
        hasPriceFilter={hasPriceFilter}
        onCategorySelect={handlers.category}
        onQuickPriceRange={handlers.quickPrice}
        onMinPriceChange={(value) =>
          dispatch({ type: "SET_MIN_PRICE_INPUT", payload: value })
        }
        onMaxPriceChange={(value) =>
          dispatch({ type: "SET_MAX_PRICE_INPUT", payload: value })
        }
        onApplyPrice={handlers.applyPrice}
        onClearPrice={handlers.clearPrice}
        onClearAll={handlers.clearAll}
      />
    </div>
  );
}