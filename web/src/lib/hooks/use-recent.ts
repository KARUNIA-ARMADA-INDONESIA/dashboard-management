"use client";

import { createLocalStorageStore, useHydrated } from "@/lib/hooks/local-storage-store";

const MAX_ENTRIES = 10;

export type RecentVisit = { key: string; at: number };

const EMPTY: RecentVisit[] = [];
const store = createLocalStorageStore<RecentVisit[]>(
  "karunia_recent_v1",
  (raw) =>
    Array.isArray(raw)
      ? raw.filter(
          (v): v is RecentVisit =>
            typeof v?.key === "string" && typeof v?.at === "number",
        )
      : EMPTY,
  EMPTY,
);

/** Catat kunjungan fitur ("<groupSlug>/<featureSlug>"). */
export function recordVisit(key: string) {
  const next = [{ key, at: Date.now() }, ...store.getSnapshot().filter((v) => v.key !== key)];
  store.write(next.slice(0, MAX_ENTRIES));
}

export function useRecent() {
  const visits = store.useValue();
  const hydrated = useHydrated();
  return { visits, hydrated, clear: () => store.write(null) };
}

export function timeAgo(at: number, now = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - at) / 60_000));
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  return `${Math.round(hours / 24)} hari yang lalu`;
}
