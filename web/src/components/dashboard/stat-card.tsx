import {
  Building2,
  Clock3,
  FileBarChart,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

// Local icon map — stat cards are used only on the main page (Server Component),
// so we resolve icons by name here to avoid passing LucideIcon functions as props.
const statIconMap: Record<string, LucideIcon> = {
  Building2,
  Clock3,
  FileBarChart,
  LayoutDashboard,
};

type Props = {
  iconName: string;
  label: string;
  value: string;
  note?: string;
};

export function StatCard({ iconName, label, value, note }: Props) {
  const Icon = statIconMap[iconName];
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {Icon && <Icon className="h-5 w-5" />}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-xl font-bold">{value}</p>
        {note && <p className="text-[11px] text-muted-foreground">{note}</p>}
      </div>
    </div>
  );
}
