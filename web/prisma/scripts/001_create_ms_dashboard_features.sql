-- ==============================================================
-- KARUNIA Management Dashboard — 001 create ms_dashboard_features
-- Jalankan manual di server PostgreSQL PRIMARY (bukan replica), mis.:
--   psql -h <host> -p <port> -U postgres -d db_development -f 001_create_ms_dashboard_features.sql
-- Aman dijalankan ulang (IF NOT EXISTS / ON CONFLICT DO NOTHING).
-- Isi identik dengan prisma/migrations/20261022000000_create_ms_dashboard_features.
-- ==============================================================

BEGIN;

-- Daftar fitur dashboard per group departemen (ms_group_department).
-- Ditulis manual (bukan `prisma migrate dev`) karena database dipakai bersama
-- aplikasi lain. Apply dengan `npm run db:deploy`.

CREATE TABLE IF NOT EXISTS "ms_dashboard_features" (
    "id"                  SERIAL        PRIMARY KEY,
    "group_department_id" SMALLINT      NOT NULL,
    "slug"                VARCHAR(100)  NOT NULL,
    "title"               VARCHAR(150)  NOT NULL,
    "category"            VARCHAR(20)   NOT NULL,
    "description"         TEXT,
    "component_key"       VARCHAR(50),
    "order_number"        SMALLINT      NOT NULL DEFAULT 0,
    "active"              BOOLEAN       NOT NULL DEFAULT true,
    "created_at"          TIMESTAMP(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"          TIMESTAMP(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at"          TIMESTAMP(6),

    CONSTRAINT "ms_dashboard_features_category_check"
        CHECK ("category" IN ('Dashboard', 'Monitoring', 'Laporan')),
    CONSTRAINT "ms_dashboard_features_group_department_id_fkey"
        FOREIGN KEY ("group_department_id") REFERENCES "ms_group_department"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ms_dashboard_features_group_department_id_slug_key"
    ON "ms_dashboard_features"("group_department_id", "slug");

-- Data awal. Group dicari lewat nama (bukan id) agar aman di environment
-- yang id-nya berbeda; group yang tidak ada dilewati.
INSERT INTO "ms_dashboard_features"
    ("group_department_id", "slug", "title", "category", "description", "component_key", "order_number")
SELECT g."id", v.slug, v.title, v.category, v.description, v.component_key, v.order_number
FROM (VALUES
    ('HC',    'employee-overview',           'Employee Overview',                'Dashboard',  'Ringkasan data karyawan, pertumbuhan, dan komposisi organisasi.', NULL, 1),
    ('HC',    'manpower-monitoring',         'Manpower Monitoring',              'Monitoring', 'Monitoring jumlah karyawan aktif, kontrak, dan pergerakan.', NULL, 2),
    ('HC',    'attendance-overtime',         'Attendance & Overtime Monitoring', 'Monitoring', 'Monitoring kehadiran, keterlambatan, dan overtime karyawan.', 'attendance-overtime', 3),
    ('HC',    'leave-absence-report',        'Leave & Absence Report',           'Laporan',    'Laporan cuti, izin, dan ketidakhadiran karyawan.', NULL, 4),
    ('HC',    'recruitment-tracking',        'Recruitment Tracking',             'Monitoring', 'Monitoring proses rekrutmen dan status kandidat.', NULL, 5),
    ('HC',    'employee-movement',           'Employee Movement',                'Laporan',    'Laporan mutasi, promosi, dan perpindahan karyawan.', NULL, 6),
    ('HSE',   'kpi-safety',                  'KPI Safety',                       'Dashboard',  'Ringkasan indikator keselamatan kerja dan lingkungan.', NULL, 1),
    ('HSE',   'safety-observation',          'Safety Observation',               'Monitoring', 'Monitoring observasi keselamatan di lapangan.', NULL, 2),
    ('HSE',   'incident-report',             'Incident Report',                  'Laporan',    'Laporan insiden, near miss, dan tindak lanjut.', NULL, 3),
    ('GA',    'facility-maintenance',        'Facility Maintenance',             'Dashboard',  'Ringkasan perawatan sarana dan prasarana.', NULL, 1),
    ('GA',    'asset-tracking',              'Asset Tracking',                   'Monitoring', 'Monitoring lokasi dan kondisi aset perusahaan.', NULL, 2),
    ('GA',    'vehicle-management',          'Vehicle Management',               'Laporan',    'Laporan pemakaian dan perawatan kendaraan.', NULL, 3),
    ('Operation', 'daily-production-monitoring', 'Daily Production Monitoring',  'Dashboard',  'Monitoring produksi harian dan capaian target.', NULL, 1),
    ('Operation', 'operational-performance', 'Operational Performance',          'Dashboard',  'Kinerja operasional keseluruhan unit produksi.', NULL, 2),
    ('Operation', 'fleet-monitoring',        'Fleet Monitoring',                 'Monitoring', 'Monitoring posisi dan utilisasi armada.', NULL, 3),
    ('Engineer', 'reliability-overview',     'Reliability Overview',             'Dashboard',  'Ringkasan keandalan dan downtime peralatan.', NULL, 1),
    ('Engineer', 'maintenance-monitoring',   'Maintenance Monitoring',           'Monitoring', 'Monitoring jadwal dan progres perawatan.', NULL, 2),
    ('Engineer', 'project-progress',         'Project Progress',                 'Laporan',    'Laporan progres proyek teknik.', NULL, 3),
    ('SCM',   'inventory-monitoring',        'Inventory Monitoring',             'Dashboard',  'Monitoring stok material dan pergerakan inventory.', NULL, 1),
    ('SCM',   'procurement-tracking',        'Procurement Tracking',             'Monitoring', 'Monitoring status pengadaan dan purchase order.', NULL, 2),
    ('SCM',   'vendor-performance',          'Vendor Performance',               'Laporan',    'Laporan performa vendor dan supplier.', NULL, 3),
    ('Plant', 'plant-performance',           'Plant Performance',                'Dashboard',  'Kinerja dan efisiensi plant produksi.', NULL, 1),
    ('Plant', 'utility-monitoring',          'Utility Monitoring',               'Monitoring', 'Monitoring utilitas, listrik, dan air.', NULL, 2),
    ('Plant', 'production-facility',         'Production Facility',              'Laporan',    'Laporan kondisi fasilitas produksi.', NULL, 3),
    ('IT',    'system-health',               'System Health',                    'Dashboard',  'Ringkasan kesehatan sistem dan layanan IT.', NULL, 1),
    ('IT',    'infrastructure-monitoring',   'Infrastructure Monitoring',        'Monitoring', 'Monitoring infrastruktur server, jaringan, dan keamanan.', NULL, 2),
    ('IT',    'digital-transformation',      'Digital Transformation',           'Laporan',    'Laporan progres transformasi digital.', NULL, 3)
) AS v(group_name, slug, title, category, description, component_key, order_number)
JOIN "ms_group_department" g ON g."name" = v.group_name AND g."deleted_at" IS NULL
ON CONFLICT ("group_department_id", "slug") DO NOTHING;

COMMIT;
