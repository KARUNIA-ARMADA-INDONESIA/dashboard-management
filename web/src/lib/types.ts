export type DashboardCategory = "Dashboard" | "Monitoring" | "Laporan";

export type Department = {
  slug: string;
  name: string;
  description: string;
  dashboardCount: number;
  reportCount: number;
  /** Icon name key — resolve via `departmentIconMap` in data.ts, NOT a LucideIcon component */
  iconName: string;
};

export type DashboardItem = {
  slug: string;
  title: string;
  category: DashboardCategory;
  description: string;
  departmentSlug: string;
  favorite: boolean;
};

export type ActivityEvent = {
  id: number;
  type: "success" | "warning" | "error";
  label: string;
  time: string;
};

export type FavoriteEntry = {
  slug: string;
  departmentSlug: string;
};

export type RecentEntry = FavoriteEntry & {
  time: string;
};

export type AttendanceStatus = "Hadir" | "Terlambat" | "Tidak Hadir";

export type AttendanceRecord = {
  id: number;
  nik: string;
  name: string;
  department: string;
  area: string;
  location: string;
  shift: number;
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
  direction: "up" | "down";
  tone: KpiTone;
  iconName: string;
};
