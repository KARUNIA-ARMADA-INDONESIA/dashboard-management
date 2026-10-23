import { prisma } from "@/lib/db";

// GET /api/health/db — cek koneksi ke PostgreSQL.
export async function GET() {
  const started = Date.now();
  try {
    const [row] = await prisma.$queryRaw<
      { db: string; version: string }[]
    >`SELECT current_database() AS db, version() AS version`;
    return Response.json({
      ok: true,
      database: row.db,
      version: row.version,
      latencyMs: Date.now() - started,
    });
  } catch (error) {
    console.error("[health/db]", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 503 },
    );
  }
}
