"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCartStore } from "@/stores/cart-store";

export function CartInitializer() {
  const { data, isLoading } = useCart();
  const setCart = useCartStore((state) => state.setCart);
  const setLoading = useCartStore((state) => state.setLoading);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else if (data) {
      setCart(data);
      setLoading(false);
    }
  }, [data, isLoading, setCart, setLoading]);

  return null;
}
