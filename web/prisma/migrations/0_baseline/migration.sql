-- Baseline: mewakili skema legacy yang sudah ada sebelum dashboard memakai
-- Prisma Migrate (ms_employees, tr_absens, ms_group_department, dll.).
-- Sengaja kosong. Di setiap database (dev/production) jalankan SEKALI:
--   npm run db:baseline
-- agar migration ini ditandai "applied" tanpa dieksekusi.
SELECT 1;
