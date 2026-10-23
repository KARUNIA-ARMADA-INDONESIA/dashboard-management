import { Loader2 } from "lucide-react";

/** Progress bar tipis di atas layar — tampil selama segmen route dimuat. */
export function NavProgressBar() {
  return (
    <div
      role="progressbar"
      aria-label="Memuat halaman"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-primary/15"
    >
      <div className="nav-progress-bar h-full w-1/2 bg-primary" />
    </div>
  );
}

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

/** Skeleton area konten dashboard (sidebar tetap tampil dari layout). */
export function DashboardContentLoading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <NavProgressBar />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Memuat data...
      </div>
      <Block className="h-8 w-72" />
      <Block className="h-4 w-96 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Block key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Block className="h-72" />
        <Block className="h-72" />
      </div>
      <Block className="h-64" />
    </div>
  );
}

/** Skeleton halaman penuh (beranda / pindah ke area dashboard). */
export function FullPageLoading() {
  return (
    <main
      className="mx-auto w-full max-w-[1400px] flex-1 space-y-4 px-4 py-6 sm:px-6"
      aria-busy="true"
    >
      <NavProgressBar />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Memuat...
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Block className="h-36" />
        <Block className="h-36" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Block key={i} className="h-20" />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Block key={i} className="h-40" />
        ))}
      </div>
    </main>
  );
}

/** Skeleton sidebar + konten — saat masuk ke area dashboard group. */
export function DashboardShellLoading() {
  return (
    <div className="flex flex-1" aria-busy="true">
      <aside className="hidden w-64 shrink-0 flex-col gap-2 border-r bg-card p-4 md:flex">
        <Block className="h-9 w-40" />
        <div className="mt-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Block key={i} className="h-8" />
          ))}
        </div>
      </aside>
      <div className="min-w-0 flex-1 px-4 py-5 sm:px-6">
        <DashboardContentLoading />
      </div>
    </div>
  );
}
