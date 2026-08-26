"use client";

import { useEffect } from "react";
import { useStore } from "@/hooks/use-store";
import { useStoreStore } from "@/stores/store-store";

export function StoreInitializer() {
  const { data: storeData, isLoading, error } = useStore(true);
  const setStoreData = useStoreStore((state) => state.setStoreData);
  const setLoading = useStoreStore((state) => state.setLoading);
  const setError = useStoreStore((state) => state.setError);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else if (error) {
      setError(error as Error);
    } else if (storeData) {
      setStoreData(storeData);
    }
  }, [storeData, isLoading, error, setStoreData, setLoading, setError]);

  return null;
}
