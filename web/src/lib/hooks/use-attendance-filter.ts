"use client";

import { useCallback, useState } from "react";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { attendanceRecords } from "@/lib/data";

export type AttendanceFilters = {
  area: string;
  location: string;
  department: string;
  status: string;
  shift: string;
  employeeType: string;
  dateRange: string;
  searchQuery: string;
};

const defaultFilters: AttendanceFilters = {
  area: "",
  location: "",
  department: "",
  status: "",
  shift: "",
  employeeType: "",
  dateRange: "",
  searchQuery: "",
};

function applyFilters(
  records: AttendanceRecord[],
  filters: AttendanceFilters,
): AttendanceRecord[] {
  return records.filter((r) => {
    if (filters.area && r.area !== filters.area) return false;
    if (filters.location && r.location !== filters.location) return false;
    if (filters.department && r.department !== filters.department) return false;
    if (filters.status && r.status !== (filters.status as AttendanceStatus))
      return false;
    if (filters.shift && String(r.shift) !== filters.shift) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (
        !r.nik.includes(q) &&
        !r.name.toLowerCase().includes(q) &&
        !r.department.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function useAttendanceFilter() {
  const [filters, setFilters] = useState<AttendanceFilters>(defaultFilters);
  const [pendingFilters, setPendingFilters] =
    useState<AttendanceFilters>(defaultFilters);

  const setPending = useCallback(
    (key: keyof AttendanceFilters, value: string) => {
      setPendingFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const apply = useCallback(() => {
    setFilters(pendingFilters);
  }, [pendingFilters]);

  const reset = useCallback(() => {
    setFilters(defaultFilters);
    setPendingFilters(defaultFilters);
  }, []);

  const filteredRecords = applyFilters(attendanceRecords, filters);

  return { pendingFilters, setPending, apply, reset, filteredRecords, filters };
}
