"use client";

import { useCallback } from "react";
import { createLocalStorageStore, useHydrated } from "@/lib/hooks/local-storage-store";

// v2: key = "<groupSlug>/<featureSlug>" (slug fitur unik per group, bukan global)
const EMPTY: string[] = [];
const store = createLocalStorageStore<string[]>(
  "karunia_favorites_v2",
  (raw) => (Array.isArray(raw) ? raw.filter((v) => typeof v === "string") : EMPTY),
  EMPTY,
);

export function featureKey(departmentSlug: string, slug: string): string {
  return `${departmentSlug}/${slug}`;
}

export function useFavorites() {
  const favorites = store.useValue();
  const hydrated = useHydrated();

  const toggle = useCallback((key: string) => {
    const current = store.getSnapshot();
    store.write(
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    );
  }, []);

  const isFavorite = useCallback(
    (key: string) => favorites.includes(key),
    [favorites],
  );

  return { favorites, toggle, isFavorite, hydrated };
}
