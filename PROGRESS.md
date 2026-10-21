# Progress Project KARUNIA Management Dashboard

## Ringkasan

Project dashboard Next.js berada di folder [`web/`](./web/), dibangun menggunakan Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Lucide Icons, dan ApexCharts.

Flow UI telah selesai diimplementasikan berdasarkan 3 referensi gambar:
1. **Main Page / Beranda**: Hero section, statistik metrik, filter tab departemen (berfungsi), grid 4-kolom kartu departemen.
2. **Modal Departemen**: Dialog interaktif dengan real-time search, filter kategori, toggle star favorite (persistent ke localStorage), dan CTA "Buka Dashboard".
3. **Dashboard Detail & Fitur**: Layout sidebar dinamis, filter bar (terhubung ke data), KPI cards, 2 ApexCharts, dan data table dengan search + export CSV.

---

## Teknologi yang Digunakan

- **Framework**: Next.js 16.4.2 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React
- **UI Components**: shadcn/ui (Base UI primitives)
- **Data Visualization**: ApexCharts (react-apexcharts)
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Package Manager**: npm

---

## Status Pekerjaan

| Area / Modul | Status | Keterangan |
|---|:---:|---|
| Analisis 3 Gambar Referensi | ✅ Selesai | Main page, modal per departemen, dashboard detail |
| Setup Next.js App Router + TypeScript | ✅ Selesai | Struktur folder di `web/` |
| Tailwind CSS v4 & Styling Global | ✅ Selesai | Theme color, CSS variable, typography |
| Setup shadcn/ui Component Library | ✅ Selesai | Dialog, Avatar, Badge, Dropdown, Table, Input, Card |
| Visualisasi Data (ApexCharts) | ✅ Selesai | Chart Tren Kehadiran (Area/Line) & Distribusi (Donut) |
| Layout Utama & Top Navbar | ✅ Selesai | Logo, nav link, profil dropdown |
| **Global Search Command Palette (⌘K)** | ✅ Selesai | Modal pencarian semua departemen & dashboard |
| Halaman Beranda (Main Page) | ✅ Selesai | Stat banner, grid 4-kolom kartu departemen |
| **Filter Tab Departemen (Berfungsi)** | ✅ Selesai | Tab filter benar-benar memfilter kartu departemen |
| Modal Dashboard Departemen | ✅ Selesai | Real-time search, filter badge |
| **Favorite Persistence (localStorage)** | ✅ Selesai | Star toggle disimpan ke localStorage |
| Dynamic Routing Dashboard | ✅ Selesai | `/dashboard/[department]` & `/dashboard/[department]/[feature]` |
| Sidebar Dashboard Dinamis | ✅ Selesai | Navigasi kembali, list fitur per departemen, link aktif |
| Detail Dashboard Attendance & Overtime | ✅ Selesai | KPI Cards, 2 ApexCharts, Data Table |
| **Filter Dashboard Terhubung ke Data** | ✅ Selesai | FilterBar → useAttendanceFilter → AttendanceTable |
| **Export CSV Tabel Kehadiran** | ✅ Selesai | Tombol Export CSV yang mengunduh data terfilter |
| **Feature Placeholder Lebih Kaya** | ✅ Selesai | Banner "Dalam Pengembangan" + skeleton preview |
| Mock Data Komprehensif | ✅ Selesai | 9 departemen, 30+ fitur dashboard, log kehadiran |
| Perbaikan Error Build & TypeScript | ✅ Selesai | `asChild`, Suspense boundary Next.js 16 |
| Production Build (`npm run build`) | ✅ Berhasil | Semua route dikompilasi tanpa error |
| Setup Database & ORM | 🔵 Siap (Tahap 2) | Prisma schema, `.env`, PostgreSQL |
| API Route Backend | ⏳ Belum Dibuat | Masih menggunakan mock data lokal |
| Autentikasi | ⏸ Ditunda | Belum diperlukan di fase ini |

---

## Fitur yang Diselesaikan pada Sesi Ini

### 1. Global Search Command Palette (⌘K / Ctrl+K)
- [`command-palette.tsx`](./web/src/components/layout/command-palette.tsx) — modal pencarian full-screen dengan backdrop blur
- Pencarian real-time di semua departemen dan dashboard items
- Navigasi langsung dengan klik hasil pencarian
- Keyboard shortcut global ⌘K/Ctrl+K di TopNavbar
- Tombol Escape untuk menutup

### 2. Filter Tab Departemen Berfungsi
- [`department-section.tsx`](./web/src/components/dashboard/department-section.tsx) — filter tab kini memfilter kartu via `useMemo`
- Tab "Dashboard", "Monitoring", "Laporan" memfilter departemen yang memiliki item dengan kategori tersebut
- Empty state jika tidak ada departemen yang cocok

### 3. Favorite Persistence (localStorage)
- [`use-favorites.ts`](./web/src/lib/hooks/use-favorites.ts) — custom hook dengan hydration-safe pattern
- [`dashboard-item-card.tsx`](./web/src/components/dashboard/dashboard-item-card.tsx) — bintang favorit menggunakan hook, toggle disimpan ke `localStorage`
- Sinkronisasi otomatis antara tab/session browser

### 4. Filter Dashboard Terhubung ke Data
- [`use-attendance-filter.ts`](./web/src/lib/hooks/use-attendance-filter.ts) — hook dengan pending vs applied filter pattern
- [`filter-bar.tsx`](./web/src/components/dashboard/filter-bar.tsx) — controlled component menerima state dari parent
- [`attendance-dashboard.tsx`](./web/src/components/dashboard/attendance-dashboard.tsx) — orkestrasi: hook → FilterBar + AttendanceTable
- [`attendance-table.tsx`](./web/src/components/dashboard/attendance-table.tsx) — menerima `records` prop + export CSV

### 5. Export CSV Tabel
- Tombol "Export CSV" di header tabel mengunduh data yang sudah terfilter sebagai file `.csv`

### 6. Feature Placeholder Lebih Kaya
- [`feature-placeholder.tsx`](./web/src/components/dashboard/feature-placeholder.tsx) — banner "Dalam Pengembangan" per kategori (Dashboard/Monitoring/Laporan) + skeleton shimmer preview layout

---

## Pekerjaan yang Belum Dikerjakan

### Finishing Tahap 1 (Minor Improvements)
- Validasi visual langsung di browser (browser automation tidak tersedia)
- Animasi transisi antar halaman
- Dark mode toggle
- Responsive mobile drawer sidebar

### Tahap 2 — Database & Backend Integration
- **Model Prisma Final** — melengkapi [`prisma/schema.prisma`](./web/prisma/schema.prisma) untuk tabel:
  - `departments`, `dashboard_items`, `attendance_records`, `activity_logs`
- **Database Migration** — `npx prisma migrate dev` (membutuhkan PostgreSQL aktif)
- **API Route Handlers** — di `web/src/app/api/...`:
  - `GET /api/departments`
  - `GET /api/departments/[slug]/items`
  - `GET /api/attendance`
- **Integrasi Data Nyata** — mengganti mock data di [`data.ts`](./web/src/lib/data.ts) dengan Prisma queries

---

## Persentase Progres

| Bidang | Progres | Catatan |
|---|:---:|---|
| Analisis Kebutuhan & Desain | **100%** | Memenuhi 3 gambar acuan |
| Setup Lingkungan & Arsitektur | **100%** | Next.js, TypeScript, Tailwind v4, Prisma |
| UI & Layout (Tahap 1) | **100%** | Semua halaman, filter, search, favorite, export |
| Validasi Build TypeScript | **100%** | `npm run build` lulus tanpa error |
| Interaktivitas Filter & State | **95%** | Semua filter berfungsi, hanya animasi yg belum |
| Backend API Routes (Tahap 2) | **10%** | Struktur folder siap, rute API belum dibuat |
| Skema Database & Migrasi (Tahap 2) | **20%** | Config & schema awal siap, migrasi belum |
| Autentikasi | **0%** | Tidak masuk scope tahap ini |

### Rangkuman Total

- **Tahap 1 (UI, Layouting, Navigasi, Interaktivitas):** **~100%** ✅
- **Keseluruhan Project (Termasuk Backend Tahap 2):** **~75%**

---

## Struktur File Penting

```
web/src/
├── app/
│   ├── layout.tsx                         ← Root layout + TopNavbar
│   ├── page.tsx                           ← Halaman Beranda
│   └── dashboard/
│       ├── layout.tsx                     ← Dashboard layout (force-dynamic)
│       ├── [department]/page.tsx          ← Overview per departemen
│       └── [department]/[feature]/page.tsx ← Halaman fitur detail
│
├── components/
│   ├── layout/
│   │   ├── top-navbar.tsx                 ← Navbar + ⌘K shortcut
│   │   ├── command-palette.tsx            ← Global search modal
│   │   ├── dashboard-shell.tsx            ← Shell layout dashboard
│   │   └── dashboard-sidebar.tsx         ← Sidebar dinamis
│   └── dashboard/
│       ├── department-section.tsx         ← Grid kartu departemen + filter tab
│       ├── department-modal.tsx           ← Modal daftar fitur
│       ├── dashboard-item-card.tsx        ← Kartu fitur + star favorite
│       ├── filter-bar.tsx                 ← Filter form (controlled)
│       ├── attendance-dashboard.tsx       ← Orkestrasi dashboard kehadiran
│       ├── attendance-table.tsx           ← Tabel + search + export CSV
│       ├── attendance-trend-chart.tsx     ← Chart tren (ApexCharts)
│       ├── attendance-donut-chart.tsx     ← Chart distribusi (ApexCharts)
│       ├── kpi-card.tsx                   ← KPI metric card
│       ├── feature-placeholder.tsx        ← Placeholder rich UI
│       └── stat-card.tsx                  ← Stat card beranda
│
└── lib/
    ├── data.ts                            ← Mock data lengkap
    ├── types.ts                           ← Type definitions
    ├── utils.ts                           ← Utilities (cn)
    └── hooks/
        ├── use-favorites.ts               ← Favorite persistence (localStorage)
        └── use-attendance-filter.ts       ← Filter state management
```

## Rekomendasi Langkah Selanjutnya (Next Steps)

### Segera (Finishing Tahap 1)
1. Lakukan validasi visual di browser lokal: buka `http://localhost:3000`
2. Test semua fitur: filter tab, modal, star favorite, filter dashboard, export CSV, ⌘K

### Tahap 2 — Integrasi Database
1. Pastikan PostgreSQL lokal berjalan
2. Isi file [`.env`](./web/.env) dengan connection string yang benar
3. Lengkapi model di [`prisma/schema.prisma`](./web/prisma/schema.prisma)
4. Jalankan:
   ```bash
   cd web
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Buat API Route Handlers di `web/src/app/api/`
6. Ganti import `from "@/lib/data"` dengan fetch ke API routes
