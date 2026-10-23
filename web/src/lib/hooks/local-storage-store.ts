"use client";

import { useSyncExternalStore } from "react";

/**
 * Store kecil di atas localStorage untuk useSyncExternalStore:
 * snapshot di-cache per nilai mentah (referensi stabil), sinkron antar
 * komponen (notify) dan antar tab (event "storage").
 */
export function createLocalStorageStore<T>(
  key: string,
  parse: (raw: unknown) => T,
  empty: T,
) {
  const listeners = new Set<() => void>();
  let cache: { raw: string | null; value: T } = { raw: null, value: empty };

  function getSnapshot(): T {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      return empty;
    }
    if (raw !== cache.raw) {
      let value = empty;
      try {
        value = raw ? parse(JSON.parse(raw)) : empty;
      } catch {
        // nilai rusak → anggap kosong
      }
      cache = { raw, value };
    }
    return cache.value;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function write(value: T | null) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage errors
    }
    listeners.forEach((l) => l());
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, getSnapshot, () => empty);
  }

  return { getSnapshot, write, useValue };
}

const noopSubscribe = () => () => {};

/** false saat SSR / hydration, true setelah di client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
