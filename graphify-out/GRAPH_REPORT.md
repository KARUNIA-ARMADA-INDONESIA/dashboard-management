# Graph Report - dashboard-management  (2026-10-23)

## Corpus Check
- 76 files · ~223,320 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 319 nodes · 601 edges · 16 communities (12 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `91f70095`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- knowledge.py
- package.json
- attendance-dashboard.tsx
- windows-environment-setup.md
- dependencies
- db.ts
- scripts
- page-loading.tsx
- types.ts
- navigation.ts
- attendance.ts
- dashboard/layout.tsx
- Progress Project KARUNIA Management Dashboard
- use-recent.ts
- db_development schema and dashboard data rules
- prisma-7-setup-quirks.md

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 16 edges
2. `react` - 14 edges
3. `getAttendanceDashboard()` - 13 edges
4. `featureKey()` - 13 edges
5. `getNavigation` - 12 edges
6. `useFavorites()` - 12 edges
7. `scripts` - 11 edges
8. `DashboardItem` - 10 edges
9. `parseAttendanceFilters()` - 10 edges
10. `Department` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getNavigation`  [EXTRACTED]
  web/src/app/api/navigation/route.ts → web/src/lib/queries/navigation.ts
- `getAttendanceDashboard()` --calls--> `getLastUpdated`  [EXTRACTED]
  web/src/lib/queries/attendance.ts → web/src/lib/queries/navigation.ts
- `FeaturePage()` --calls--> `parseAttendanceFilters()`  [EXTRACTED]
  web/src/app/dashboard/[department]/[feature]/page.tsx → web/src/lib/attendance-filters.ts
- `AttendanceDashboard()` --calls--> `getAttendanceDashboard()`  [EXTRACTED]
  web/src/components/dashboard/attendance-dashboard.tsx → web/src/lib/queries/attendance.ts
- `TrackRecentVisit()` --calls--> `featureKey()`  [EXTRACTED]
  web/src/components/dashboard/track-recent-visit.tsx → web/src/lib/hooks/use-favorites.ts

## Import Cycles
- None detected.

## Communities (16 total, 4 thin omitted)

### Community 0 - "knowledge.py"
Cohesion: 0.15
Nodes (20): Namespace, cmd_add_url(), cmd_note(), cmd_query(), cmd_status(), _graphify(), _knowledge_files(), main() (+12 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (37): @base-ui/react, class-variance-authority, cn, dotenv, eslint, eslint-config-next, next, pg (+29 more)

### Community 2 - "attendance-dashboard.tsx"
Cohesion: 0.10
Nodes (24): apexcharts, react-apexcharts, AttendanceDashboard(), Props, AttendanceDonutChart(), Chart, Props, statusColor (+16 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, apexcharts, @base-ui/react, class-variance-authority, cn, dotenv, lucide-react, next (+9 more)

### Community 5 - "db.ts"
Cohesion: 0.21
Nodes (7): @prisma/adapter-pg, createClient(), DbClient, globalForPrisma, prisma, getDatabaseUrl(), REQUIRED

### Community 7 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, db:baseline, db:deploy, db:generate, db:status, db:studio, dev (+3 more)

### Community 8 - "page-loading.tsx"
Cohesion: 0.21
Nodes (3): DashboardContentLoading(), DashboardShellLoading(), FullPageLoading()

### Community 9 - "types.ts"
Cohesion: 0.09
Nodes (39): lucide-react, react, DashboardHeader(), Props, categoryBadgeClass, categoryIcon, DashboardItemCard(), DepartmentModal() (+31 more)

### Community 10 - "navigation.ts"
Cohesion: 0.13
Nodes (25): server-only, GET(), FeaturePage(), DepartmentLayout(), DepartmentOverviewPage(), dynamic, Home(), DepartmentSection() (+17 more)

### Community 11 - "attendance.ts"
Cohesion: 0.09
Nodes (40): csvCell(), GET(), HEADER, Props, SelectKey, addDays(), APP_TIMEZONE, APP_TIMEZONE_LABEL (+32 more)

### Community 13 - "Progress Project KARUNIA Management Dashboard"
Cohesion: 0.10
Nodes (20): 1. Global Search Command Palette (⌘K / Ctrl+K), 2. Filter Tab Departemen Berfungsi, 3. Favorite Persistence (localStorage), 4. Filter Dashboard Terhubung ke Data, 5. Export CSV Tabel, 6. Feature Placeholder Lebih Kaya, Finishing Tahap 1 (Minor Improvements), Fitur yang Diselesaikan pada Sesi Ini (+12 more)

### Community 14 - "use-recent.ts"
Cohesion: 0.20
Nodes (11): TrackRecentVisit(), createLocalStorageStore(), getSnapshot(), subscribe(), useValue(), noopSubscribe(), useHydrated(), EMPTY (+3 more)

## Knowledge Gaps
- **126 isolated node(s):** `Update 2026-10-23: 40001 conflict with recovery`, `DbClient`, `globalForPrisma`, `GroupRow`, `Range` (+121 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 149 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `types.ts` to `package.json`, `attendance-dashboard.tsx`, `page-loading.tsx`, `navigation.ts`, `attendance.ts`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `react` connect `types.ts` to `package.json`, `attendance-dashboard.tsx`, `navigation.ts`, `attendance.ts`, `use-recent.ts`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `Update 2026-10-23: 40001 conflict with recovery`, `DbClient`, `globalForPrisma` to the rest of the system?**
  _126 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `attendance-dashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._