---
title: Prisma 7 setup quirks
created: 2026-10-22
---

# Prisma 7 setup quirks

Prisma 7 (stable 7.10.1; 8.x masih RC — jangan campur CLI 8 dengan client 7). URL DB tidak lagi di schema.prisma: taruh di prisma.config.ts; URL dirakit dari DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME/DB_SCHEMA/DB_SSL oleh web/src/lib/db-url.ts (getDatabaseUrl, encode user+password) dan import 'dotenv/config' (CLI tidak auto-load .env). Generator 'prisma-client' wajib punya output (dipakai web/src/generated/prisma, gitignored, dibuat ulang via postinstall). Runtime wajib driver adapter: new PrismaClient({ adapter: new PrismaPg({ connectionString }) }). Client singleton di web/src/lib/db.ts dengan import 'server-only'. Health check: GET /api/health/db.
