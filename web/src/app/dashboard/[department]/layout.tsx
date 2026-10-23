import { notFound } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { getDepartment, getItemsByDepartment } from "@/lib/queries/navigation";

export default async function DepartmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ department: string }>;
}) {
  const { department: slug } = await params;
  const [department, items] = await Promise.all([
    getDepartment(slug),
    getItemsByDepartment(slug),
  ]);
  if (!department) notFound();

  return (
    <div className="flex flex-1">
      <DashboardSidebar department={department} items={items} />
      <div className="min-w-0 flex-1 px-4 py-5 sm:px-6">{children}</div>
    </div>
  );
}
