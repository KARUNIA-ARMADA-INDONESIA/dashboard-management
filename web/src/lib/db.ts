import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseUrl } from "@/lib/db-url";

/**
 * Database dev adalah hot standby (read replica). Saat replica memutar ulang
 * WAL dari primary (mis. hasil VACUUM), query yang sedang jalan bisa dibatalkan:
 *   40001 "canceling statement due to conflict with recovery"
 *   40P01 deadlock (jarang)
 * Error ini sementara — query yang sama biasanya sukses saat diulang.
 */
const RETRYABLE_SQLSTATE = /\b(40001|40P01)\b/;
const MAX_RETRIES = 3;

function isTransientConflict(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const meta = (error as { meta?: { code?: unknown } }).meta;
  return (
    RETRYABLE_SQLSTATE.test(String(meta?.code ?? "")) ||
    RETRYABLE_SQLSTATE.test(error.message)
  );
}

function createClient() {
  const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });
  const base = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  // Retry otomatis (backoff 100ms, 200ms, 400ms) untuk konflik replica di atas.
  return base.$extends({
    query: {
      async $allOperations({ args, query }) {
        for (let attempt = 0; ; attempt++) {
          try {
            return await query(args);
          } catch (error) {
            if (attempt >= MAX_RETRIES || !isTransientConflict(error)) throw error;
            await new Promise((r) => setTimeout(r, 100 * 2 ** attempt));
          }
        }
      },
    },
  });
}

type DbClient = ReturnType<typeof createClient>;

// Satu instance per proses. Saat dev, HMR me-reload modul,
// jadi instance disimpan di globalThis agar koneksi pool tidak bocor.
const globalForPrisma = globalThis as unknown as { prisma?: DbClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
