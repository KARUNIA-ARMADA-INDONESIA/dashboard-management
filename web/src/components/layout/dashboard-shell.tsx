"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { getDepartment, getItemsByDepartment } from "@/lib/data";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

function ShellInner({ children }: { children: React.ReactNode }) {
  const params = useParams<{ department?: string }>();
  const department = params.department
    ? getDepartment(params.department)
    : undefined;

  if (!department) {
    return <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>;
  }

  return (
    <div className="flex flex-1">
      <DashboardSidebar
        department={department}
        items={getItemsByDepartment(department.slug)}
      />
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6">{children}</main>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<main className="flex-1 px-4 py-6 sm:px-6">{children}</main>}>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
