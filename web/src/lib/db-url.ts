// Rakit connection string PostgreSQL dari variabel DB_* di .env.
// Dipakai oleh prisma.config.ts (CLI) dan src/lib/db.ts (runtime).
// User & password di-URL-encode, jadi karakter spesial (@ : / # ?) aman.

const REQUIRED = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"] as const;

export function getDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const missing = REQUIRED.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Variabel DB belum di-set di web/.env: ${missing.join(", ")}`);
  }

  const user = encodeURIComponent(env.DB_USER!);
  const password = encodeURIComponent(env.DB_PASSWORD!);
  const host = env.DB_HOST!;
  const port = env.DB_PORT || "5432";
  const name = encodeURIComponent(env.DB_NAME!);

  const params = new URLSearchParams({ schema: env.DB_SCHEMA || "public" });
  if (env.DB_SSL === "true") params.set("sslmode", "require");

  return `postgresql://${user}:${password}@${host}:${port}/${name}?${params}`;
}
