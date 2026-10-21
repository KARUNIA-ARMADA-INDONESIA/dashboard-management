"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, Search, X } from "lucide-react";
import { departments, dashboardItems } from "@/lib/data";
import { cn } from "@/lib/utils";

type SearchResult = {
  type: "department" | "item";
  slug: string;
  title: string;
  subtitle: string;
  href: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show recent / popular items when empty
      return dashboardItems
        .filter((i) => i.favorite)
        .slice(0, 6)
        .map((item) => ({
          type: "item" as const,
          slug: item.slug,
          title: item.title,
          subtitle: `${item.category} · ${item.departmentSlug.replace(/-/g, " ")}`,
          href: `/dashboard/${item.departmentSlug}/${item.slug}`,
        }));
    }

    const deptResults: SearchResult[] = departments
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q),
      )
      .slice(0, 3)
      .map((d) => ({
        type: "department",
        slug: d.slug,
        title: d.name,
        subtitle: d.description,
        href: `/dashboard/${d.slug}`,
      }));

    const itemResults: SearchResult[] = dashboardItems
      .filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      )
      .slice(0, 8)
      .map((item) => ({
        type: "item",
        slug: item.slug,
        title: item.title,
        subtitle: `${item.category} · ${item.departmentSlug.replace(/-/g, " ")}`,
        href: `/dashboard/${item.departmentSlug}/${item.slug}`,
      }));

    return [...deptResults, ...itemResults].slice(0, 10);
  }, [query]);

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Global"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border bg-background shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            id="command-palette-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Cari departemen, dashboard, atau laporan..."
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {query === "" && (
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  Dashboard Favorit
                </p>
              )}
              <ul>
                {results.map((r) => (
                  <li key={r.href}>
                    <button
                      type="button"
                      onClick={() => navigate(r.href)}
                      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                          r.type === "department"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {r.title}
                        </p>
                        <p className="truncate text-xs capitalize text-muted-foreground">
                          {r.subtitle}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t px-4 py-2 text-[11px] text-muted-foreground">
          <span>
            <kbd className="rounded border bg-muted px-1">↑↓</kbd> navigasi
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1">Enter</kbd> buka
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1">Esc</kbd> tutup
          </span>
        </div>
      </div>
    </div>
  );
}
