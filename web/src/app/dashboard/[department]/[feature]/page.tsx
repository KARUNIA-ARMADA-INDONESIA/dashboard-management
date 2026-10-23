import { notFound, redirect } from "next/navigation";
import { getDepartment, getItem, getLastUpdated } from "@/lib/queries/navigation";
import { parseAttendanceFilters } from "@/lib/attendance-filters";
import { AttendanceDashboard } from "@/components/dashboard/attendance-dashboard";
import { FeaturePlaceholder } from "@/components/dashboard/feature-placeholder";
import { TrackRecentVisit } from "@/components/dashboard/track-recent-visit";

export default async function FeaturePage({
  params,
  searchParams,
}: {
  params: Promise<{ department: string; feature: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { department: deptSlug, feature } = await params;
  const [department, item] = await Promise.all([
    getDepartment(deptSlug),
    getItem(deptSlug, feature),
  ]);
  if (!department || !item) notFound();
  // Fitur belum tersedia tidak bisa dibuka; kembalikan ke daftar fitur group.
  if (!item.componentKey) redirect(`/dashboard/${deptSlug}`);

  const track = <TrackRecentVisit departmentSlug={deptSlug} slug={item.slug} />;

  if (item.componentKey === "attendance-overtime") {
    const filters = parseAttendanceFilters(await searchParams);
    return (
      <>
        {track}
        <AttendanceDashboard department={department} item={item} filters={filters} />
      </>
    );
  }

  // componentKey ada tapi belum dipetakan ke komponen
  const updated = await getLastUpdated();
  return (
    <>
      {track}
      <FeaturePlaceholder department={department} item={item} lastUpdated={updated.label} />
    </>
  );
}
