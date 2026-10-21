import { notFound } from "next/navigation";
import { getDepartment, getItem } from "@/lib/data";
import { AttendanceDashboard } from "@/components/dashboard/attendance-dashboard";
import { FeaturePlaceholder } from "@/components/dashboard/feature-placeholder";

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ department: string; feature: string }>;
}) {
  const { department: deptSlug, feature } = await params;
  const department = getDepartment(deptSlug);
  const item = getItem(feature);

  if (!department || !item || item.departmentSlug !== deptSlug) {
    notFound();
  }

  if (feature === "attendance-overtime") {
    return <AttendanceDashboard department={department} item={item} />;
  }

  return <FeaturePlaceholder department={department} item={item} />;
}
