# Graph Report - dashboard-management  (2026-10-23)

## Corpus Check
- 76 files · ~223,054 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 316 nodes · 598 edges · 17 communities (13 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d18ee797`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- knowledge.py
- package.json
- attendance-filters.ts
- windows-environment-setup.md
- dependencies
- db.ts
- devDependencies
- scripts
- page-loading.tsx
- types.ts
- navigation.ts
- attendance.ts
- dashboard/layout.tsx
- Progress Project KARUNIA Management Dashboard
- react
- db-development-schema-and-dashboard-data-rules.md
- prisma-7-setup-quirks.md

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 16 edges
2. `react` - 14 edges
3. `getAttendanceDashboard()` - 13 edges
4. `featureKey()` - 13 edges
5. `useFavorites()` - 12 edges
6. `getNavigation` - 12 edges
7. `scripts` - 11 edges
8. `DashboardItem` - 10 edges
9. `parseAttendanceFilters()` - 10 edges
10. `Progress Project KARUNIA Management Dashboard` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getNavigation`  [EXTRACTED]
  web/src/app/api/navigation/route.ts → web/src/lib/queries/navigation.ts
- `FeaturePage()` --calls--> `parseAttendanceFilters()`  [EXTRACTED]
  web/src/app/dashboard/[department]/[feature]/page.tsx → web/src/lib/attendance-filters.ts
- `GET()` --calls--> `parseAttendanceFilters()`  [EXTRACTED]
  web/src/app/api/attendance/export/route.ts → web/src/lib/attendance-filters.ts
- `getAttendanceDashboard()` --calls--> `daysBetween()`  [EXTRACTED]
  web/src/lib/queries/attendance.ts → web/src/lib/attendance-filters.ts
- `AttendanceDashboard()` --calls--> `getAttendanceDashboard()`  [EXTRACTED]
  web/src/components/dashboard/attendance-dashboard.tsx → web/src/lib/queries/attendance.ts

## Import Cycles
- None detected.

## Communities (17 total, 4 thin omitted)

### Community 0 - "knowledge.py"
Cohesion: 0.15
Nodes (20): Namespace, cmd_add_url(), cmd_note(), cmd_query(), cmd_status(), _graphify(), _knowledge_files(), main() (+12 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (26): @base-ui/react, class-variance-authority, cn, dotenv, eslint, eslint-config-next, next, pg (+18 more)

### Community 2 - "attendance-filters.ts"
Cohesion: 0.07
Nodes (39): apexcharts, react-apexcharts, AttendanceDashboard(), Props, AttendanceDonutChart(), Chart, Props, statusColor (+31 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, apexcharts, @base-ui/react, class-variance-authority, cn, dotenv, lucide-react, next (+9 more)

### Community 5 - "db.ts"
Cohesion: 0.25
Nodes (6): @prisma/adapter-pg, createClient(), globalForPrisma, prisma, getDatabaseUrl(), REQUIRED

### Community 6 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/turbopack, @types/node, @types/pg (+3 more)

### Community 7 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, db:baseline, db:deploy, db:generate, db:status, db:studio, dev (+3 more)

### Community 8 - "page-loading.tsx"
Cohesion: 0.21
Nodes (3): DashboardContentLoading(), DashboardShellLoading(), FullPageLoading()

### Community 9 - "types.ts"
Cohesion: 0.09
Nodes (39): lucide-react, DashboardHeader(), Props, categoryBadgeClass, categoryIcon, DashboardItemCard(), DepartmentModal(), Props (+31 more)

### Community 10 - "navigation.ts"
Cohesion: 0.15
Nodes (22): server-only, GET(), FeaturePage(), DepartmentLayout(), DepartmentOverviewPage(), dynamic, Home(), FeaturePlaceholder() (+14 more)

### Community 11 - "attendance.ts"
Cohesion: 0.14
Nodes (25): csvCell(), GET(), HEADER, addDays(), todayIso(), escapeLike(), filteredCte(), formatDuration() (+17 more)

### Community 13 - "Progress Project KARUNIA Management Dashboard"
Cohesion: 0.10
Nodes (20): 1. Global Search Command Palette (⌘K / Ctrl+K), 2. Filter Tab Departemen Berfungsi, 3. Favorite Persistence (localStorage), 4. Filter Dashboard Terhubung ke Data, 5. Export CSV Tabel, 6. Feature Placeholder Lebih Kaya, Finishing Tahap 1 (Minor Improvements), Fitur yang Diselesaikan pada Sesi Ini (+12 more)

### Community 14 - "react"
Cohesion: 0.18
Nodes (14): react, TrackRecentVisit(), createLocalStorageStore(), getSnapshot(), subscribe(), useValue(), noopSubscribe(), useHydrated() (+6 more)

## Knowledge Gaps
- **125 isolated node(s):** `Ringkasan`, `Teknologi yang Digunakan`, `Status Pekerjaan`, `1. Global Search Command Palette (⌘K / Ctrl+K)`, `2. Filter Tab Departemen Berfungsi` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 147 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `types.ts` to `page-loading.tsx`, `package.json`, `navigation.ts`, `attendance-filters.ts`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `package.json`, `attendance-filters.ts`, `navigation.ts`, `types.ts`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `Ringkasan`, `Teknologi yang Digunakan`, `Status Pekerjaan` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `attendance-filters.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07149758454106281 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._