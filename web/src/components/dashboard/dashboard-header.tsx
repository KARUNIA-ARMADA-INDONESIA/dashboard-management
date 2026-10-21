"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Clock,
  Download,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashboardItem, Department } from "@/lib/types";

type Props = {
  department: Department;
  item: DashboardItem;
  lastUpdated: string;
};

export function DashboardHeader({ department, item, lastUpdated }: Props) {
  const [favorite, setFavorite] = useState(item.favorite);

  return (
    <div className="space-y-3">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/dashboard/${department.slug}`}
          className="hover:text-foreground"
        >
          {department.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{item.title}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setFavorite((f) => !f)}
          >
            <Star
              className={
                favorite
                  ? "h-4 w-4 fill-amber-400 text-amber-400"
                  : "h-4 w-4"
              }
            />
            {favorite ? "Favorit" : "Tambah ke Favorit"}
          </Button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Terakhir Diperbarui</span>
            <span className="font-medium text-foreground">{lastUpdated}</span>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
