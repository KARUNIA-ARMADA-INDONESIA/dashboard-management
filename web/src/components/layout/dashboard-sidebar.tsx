"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { departmentIconMap } from "@/lib/data";
import type { DashboardItem, Department } from "@/lib/types";

type Props = {
  department: Department;
  items: DashboardItem[];
};

function SidebarLinks({
  department,
  items,
}: {
  department: Department;
  items: DashboardItem[];
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const href = `/dashboard/${department.slug}/${item.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={item.slug}
            href={href}
            className={cn(
              "relative rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
              active
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary" />
            )}
            {item.title}
          </Link>
        );
      })}
    </>
  );
}

export function DashboardSidebar({ department, items }: Props) {
  const Icon = departmentIconMap[department.iconName];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex items-center gap-2.5 border-b px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold">{department.name}</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <Suspense
          fallback={items.map((item) => (
            <div
              key={item.slug}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground"
            >
              {item.title}
            </div>
          ))}
        >
          <SidebarLinks department={department} items={items} />
        </Suspense>
      </nav>

      <div className="border-t p-3">
        <Link
          href="/#departemen"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Departemen
        </Link>
      </div>
    </aside>
  );
}
