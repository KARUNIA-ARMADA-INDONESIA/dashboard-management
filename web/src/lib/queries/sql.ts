import "server-only";

import { Prisma } from "@/generated/prisma/client";

/**
 * Karyawan aktif di ms_employees (alias tabel harus `e`).
 * status_employee: '1' = aktif ('Aktif' muncul di data lama), '0' = non-aktif.
 */
export const ACTIVE_EMPLOYEE = Prisma.sql`e.deleted_at IS NULL AND e.status_employee IN ('1', 'Aktif')`;

/** Prisma error P2021 = tabel tidak ada (mis. migration belum dijalankan). */
export function isMissingTableError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021"
  );
}
