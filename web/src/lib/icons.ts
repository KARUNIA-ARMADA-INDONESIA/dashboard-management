import {
  Building2,
  CheckCircle2,
  Clock,
  Cog,
  Factory,
  GraduationCap,
  HardHat,
  Landmark,
  MonitorSmartphone,
  Package,
  Timer,
  Users,
  Wrench,
  XCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon lookup map — used by Client Components to resolve icon components from iconName strings.
 * Icons must NOT be stored directly in data objects because LucideIcon (a function)
 * cannot be serialized when passed from Server Components to Client Components.
 */
export const departmentIconMap: Record<string, LucideIcon> = {
  Building2,
  Cog,
  Factory,
  GraduationCap,
  HardHat,
  Landmark,
  MonitorSmartphone,
  Package,
  Users,
  Wrench,
};

/** Ikon per nama group (ms_group_department.name, lowercase). Dicocokkan lewat nama karena id bisa beda antar environment. */
const groupIconByName: Record<string, string> = {
  "site management": "Building2",
  engineer: "Wrench",
  operation: "Factory",
  plant: "Cog",
  hse: "HardHat",
  scm: "Package",
  hc: "Users",
  it: "MonitorSmartphone",
  "l&d": "GraduationCap",
  ga: "Landmark",
};

export function groupIconName(groupName: string): string {
  return groupIconByName[groupName.trim().toLowerCase()] ?? "Building2";
}

export const kpiIconMap: Record<string, LucideIcon> = {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Timer,
};
