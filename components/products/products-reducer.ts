// app/products/products-reducer.ts
export const PRICE_RANGES = [
  { id: "0-500", label: "Under 500", min: 0, max: 500 },
  { id: "500-1000", label: "500 - 1000", min: 500, max: 1000 },
  { id: "1000-2000", label: "1000 - 2000", min: 1000, max: 2000 },
  { id: "2000-plus", label: "Over 2000", min: 2000, max: undefined },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export interface ProductsState {
  search: string;
  selectedCategory: string;
  sortBy: string;
  page: number;
  limit: number;
  mobileFiltersOpen: boolean;
  minPriceInput: string;
  maxPriceInput: string;
  appliedMinPrice: number | undefined;
  appliedMaxPrice: number | undefined;
  selectedPriceRange: string;
}

export type ProductsAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_SORT"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_MOBILE_FILTERS"; payload: boolean }
  | { type: "SET_MIN_PRICE_INPUT"; payload: string }
  | { type: "SET_MAX_PRICE_INPUT"; payload: string }
  | { type: "APPLY_PRICE_RANGE" }
  | { type: "CLEAR_PRICE_RANGE" }
  | { type: "SET_QUICK_PRICE_RANGE"; payload: string }
  | { type: "CLEAR_ALL_FILTERS" }
  | { type: "INIT_FROM_URL"; payload: Partial<ProductsState> };

export const initialState: ProductsState = {
  search: "",
  selectedCategory: "",
  sortBy: "newest",
  page: 1,
  limit: 12,
  mobileFiltersOpen: false,
  minPriceInput: "",
  maxPriceInput: "",
  appliedMinPrice: undefined,
  appliedMaxPrice: undefined,
  selectedPriceRange: "",
};

export function productsReducer(
  state: ProductsState,
  action: ProductsAction,
): ProductsState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sortBy: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_MOBILE_FILTERS":
      return { ...state, mobileFiltersOpen: action.payload };
    case "SET_MIN_PRICE_INPUT":
      return { ...state, minPriceInput: action.payload };
    case "SET_MAX_PRICE_INPUT":
      return { ...state, maxPriceInput: action.payload };
    case "APPLY_PRICE_RANGE": {
      const min = state.minPriceInput ? Number(state.minPriceInput) : undefined;
      const max = state.maxPriceInput ? Number(state.maxPriceInput) : undefined;
      return {
        ...state,
        appliedMinPrice: min,
        appliedMaxPrice: max,
        selectedPriceRange: "",
        page: 1,
        mobileFiltersOpen: false,
      };
    }
    case "CLEAR_PRICE_RANGE":
      return {
        ...state,
        minPriceInput: "",
        maxPriceInput: "",
        appliedMinPrice: undefined,
        appliedMaxPrice: undefined,
        selectedPriceRange: "",
      };
    case "SET_QUICK_PRICE_RANGE": {
      const range = PRICE_RANGES.find((r) => r.id === action.payload);
      if (!range) return state;
      return {
        ...state,
        selectedPriceRange: range.id,
        appliedMinPrice: range.min,
        appliedMaxPrice: range.max,
        minPriceInput: range.min?.toString() || "",
        maxPriceInput: range.max?.toString() || "",
        page: 1,
        mobileFiltersOpen: false,
      };
    }
    case "CLEAR_ALL_FILTERS":
      return {
        ...state,
        search: "",
        selectedCategory: "",
        sortBy: "newest",
        page: 1,
        minPriceInput: "",
        maxPriceInput: "",
        appliedMinPrice: undefined,
        appliedMaxPrice: undefined,
        selectedPriceRange: "",
      };
    case "INIT_FROM_URL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
