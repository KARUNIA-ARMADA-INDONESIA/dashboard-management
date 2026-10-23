// Semua halaman dashboard membaca database setiap request.
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-1 flex-col">{children}</main>;
}
