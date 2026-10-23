---
title: db_development schema and dashboard data rules
created: 2026-10-22
---

# db_development schema and dashboard data rules

Server dev (via SSH tunnel localhost:5433, db_development; host di web/.env) adalah HOT STANDBY read replica (pg_is_in_recovery=true): semua write gagal 25006. Migration dijalankan user manual di primary pakai web/prisma/scripts/*.sql. DB punya ~1586 tabel legacy: JANGAN prisma migrate dev / db push / db pull. Prisma Migrate butuh baseline (P3005): npm run db:baseline (resolve --applied 0_baseline) sekali per DB lalu npm run db:deploy. Relasi: ms_employees.department_id -> ms_departments.department_group_id -> ms_group_department (kartu beranda = group). Tidak ada FK constraint dari ms_employees; relasi lewat kolom *_id. Karyawan aktif: deleted_at IS NULL AND status_employee IN ('1','Aktif'). Alpa = aktif + must_absent='1' tanpa tr_absens. Status: CT/CR/CP=Cuti, S=Sakit, OFF/LIBUR_HO=Libur, PD=Hadir, lainnya Hadir/Terlambat (date_trunc minute(jam_masuk) > jadwal ms_working_hours paling spesifik, fallback 07:00/19:00). Lembur: reguler is_realisasi=2 & lower(tipe)='reguler' & ((status_ot=2 & jenis_spl null) | (status_ot=3 & jenis_spl='Wajib')); SPL tipe='SPL' & status_ot=3; sum(total_jam), join ke tr_absens per tgl+employee_id. Timestamp tr_absens = waktu lokal WITA (Asia/Makassar), server DB timezone UTC. Kode: web/src/lib/queries/attendance.ts.


## Update 2026-10-23: 40001 conflict with recovery
Query di replica bisa dibatalkan dengan SQLSTATE 40001 "canceling statement due to conflict with recovery" saat replica memutar ulang WAL (mis. VACUUM di primary). Prisma melempar P2010, kode asli di meta.driverAdapterError.cause.originalCode dan di message. Fix app: web/src/lib/db.ts membungkus client dengan $extends query.$allOperations (mencakup $queryRaw) -> retry 3x backoff 100/200/400ms untuk 40001/40P01. Fix permanen sisi server (DBA): hot_standby_feedback = on di replica, atau naikkan max_standby_streaming_delay.
