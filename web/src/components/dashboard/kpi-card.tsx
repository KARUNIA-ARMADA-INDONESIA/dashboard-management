import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { kpiIconMap } from "@/lib/icons";
import type { Kpi } from "@/lib/types";

const toneClass: Record<Kpi["tone"], string> = {
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-violet-100 text-violet-700",
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpiIconMap[kpi.iconName];
  const DirectionIcon =
    kpi.direction === "up"
      ? ArrowUpRight
      : kpi.direction === "down"
        ? ArrowDownRight
        : ArrowRight;

  return (
    <div className="rounded-xl border bg-card p-4">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          toneClass[kpi.tone],
        )}
      >
        {Icon && <Icon className="h-5 w-5" />}
      </span>
      <p className="mt-3 text-xs text-muted-foreground">{kpi.label}</p>
      <p className="text-2xl font-bold">{kpi.value}</p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 text-xs font-medium",
          kpi.direction === "up" && "text-emerald-600",
          kpi.direction === "down" && "text-red-600",
          kpi.direction === "flat" && "text-muted-foreground",
        )}
      >
        <DirectionIcon className="h-3.5 w-3.5" />
        {kpi.change}
      </p>
    </div>
  );
}
