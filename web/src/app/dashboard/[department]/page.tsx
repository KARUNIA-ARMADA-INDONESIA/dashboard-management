import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getDepartment, getItemsByDepartment } from "@/lib/data";
import { DashboardItemCard } from "@/components/dashboard/dashboard-item-card";

export default async function DepartmentOverviewPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department: slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) notFound();
  const items = getItemsByDepartment(slug);

  return (
    <div className="space-y-4">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{dept.name}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold">{dept.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{dept.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <DashboardItemCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
