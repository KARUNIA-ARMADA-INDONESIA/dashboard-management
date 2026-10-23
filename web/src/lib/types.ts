export type DashboardCategory = "Dashboard" | "Monitoring" | "Laporan";

/** Kartu di beranda = satu group departemen (ms_group_department). */
export type Department = {
  id: number;
  slug: string;
  name: string;
  description: string;
  /** Nama departemen (ms_departments) yang tergabung di group ini */
  departmentNames: string[];
  employeeCount: number;
  dashboardCount: number;
  reportCount: number;
  /** Jumlah fitur yang sudah diimplementasi (componentKey != null) */
  availableCount: number;
  /** Icon name key — resolve via `departmentIconMap` in icons.ts, NOT a LucideIcon component */
  iconName: string;
};

/** Fitur dashboard (ms_dashboard_features). Slug unik per group. */
export type DashboardItem = {
  id: number;
  slug: string;
  title: string;
  category: DashboardCategory;
  description: string;
  departmentSlug: string;
  /** Komponen yang merender fitur ini; null = belum tersedia (abu-abu, tidak bisa dibuka) */
  componentKey: string | null;
};

export function isFeatureAvailable(item: Pick<DashboardItem, "componentKey">): boolean {
  return item.componentKey !== null;
}

export type NavigationData = {
  departments: Department[];
  items: DashboardItem[];
};

export type OverviewStats = {
  totalGroups: number;
  totalDashboards: number;
  totalReports: number;
  lastUpdatedDate: string;
  lastUpdatedTime: string;
};

export type AttendanceStatus =
  | "Hadir"
  | "Terlambat"
  | "Cuti"
  | "Sakit"
  | "Libur"
  | "Tidak Hadir";

export type AttendanceRecord = {
  key: string;
  date: string;
  nik: string;
  name: string;
  department: string;
  area: string;
  location: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  duration: string;
  overtime: string;
};

export type KpiTone = "green" | "amber" | "red" | "purple";

export type Kpi = {
  key: string;
  label: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
  tone: KpiTone;
  iconName: string;
};

export type SelectOption = { value: string; label: string };

export type AttendanceFilterOptions = {
  areas: SelectOption[];
  locations: (SelectOption & { areaId: string })[];
  groups: SelectOption[];
  departments: (SelectOption & { groupId: string })[];
  shifts: SelectOption[];
  employeeTypes: SelectOption[];
};

export type AttendanceTrend = {
  labels: string[];
  hadir: number[];
  terlambat: number[];
  tidakHadir: number[];
};

export type AttendanceDistributionSegment = {
  label: AttendanceStatus;
  value: number;
  percent: string;
};

export type AttendanceDashboardData = {
  kpis: Kpi[];
  trend: AttendanceTrend;
  distribution: { total: number; segments: AttendanceDistributionSegment[] };
  rows: AttendanceRecord[];
  totalRows: number;
  options: AttendanceFilterOptions;
  lastUpdated: string;
};
