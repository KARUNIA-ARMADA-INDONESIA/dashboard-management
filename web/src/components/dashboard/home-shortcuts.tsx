"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Star } from "lucide-react";
import { featureKey, useFavorites } from "@/lib/hooks/use-favorites";
import { timeAgo, useRecent } from "@/lib/hooks/use-recent";
import { isFeatureAvailable, type DashboardItem, type Department } from "@/lib/types";

type Props = {
  departments: Department[];
  items: DashboardItem[];
};

/** Panel "Favorit" & "Terakhir Dibuka" — data per browser (localStorage). */
export function HomeShortcuts({ departments, items }: Props) {
  const { favorites, hydrated: favHydrated } = useFavorites();
  const { visits, hydrated: recentHydrated } = useRecent();

  const lookup = useMemo(() => {
    const deptBySlug = new Map(departments.map((d) => [d.slug, d]));
    const map = new Map<string, { item: DashboardItem; dept: Department }>();
    for (const item of items) {
      if (!isFeatureAvailable(item)) continue;
      const dept = deptBySlug.get(item.departmentSlug);
      if (dept) map.set(featureKey(item.departmentSlug, item.slug), { item, dept });
    }
    return map;
  }, [departments, items]);

  const favoriteRows = favorites
    .map((key) => lookup.get(key))
    .filter((v) => v !== undefined)
    .slice(0, 5);
  const recentRows = visits
    .map((v) => {
      const entry = lookup.get(v.key);
      return entry ? { ...entry, at: v.at } : undefined;
    })
    .filter((v) => v !== undefined)
    .slice(0, 5);

  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-2">
      <Panel id="favorit" title="Dashboard Favorit Saya">
        {favHydrated && favoriteRows.length === 0 ? (
          <Empty>Belum ada favorit. Klik ikon bintang pada dashboard.</Empty>
        ) : (
          <ul className="divide-y">
            {favoriteRows.map(({ item, dept }) => (
              <li key={item.id}>
                <Link
                  href={`/dashboard/${dept.slug}/${item.slug}`}
                  className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{dept.name}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel id="terakhir" title="Terakhir Dibuka">
        {recentHydrated && recentRows.length === 0 ? (
          <Empty>Belum ada dashboard yang dibuka.</Empty>
        ) : (
          <ul className="divide-y">
            {recentRows.map(({ item, dept, at }) => (
              <li key={item.id}>
                <Link
                  href={`/dashboard/${dept.slug}/${item.slug}`}
                  className="block px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">{dept.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(at)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </section>
  );
}

function Panel({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-xl border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-8 text-center text-sm text-muted-foreground">{children}</p>;
}
