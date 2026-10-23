# Graph Report - dashboard-management  (2026-10-23)

## Corpus Check
- 76 files · ~223,054 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 292 nodes · 578 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc3b0ebf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- knowledge.py
- package.json
- types.ts
- windows-environment-setup.md
- dependencies
- db.ts
- devDependencies
- scripts
- page-loading.tsx
- home-shortcuts.tsx
- navigation.ts
- attendance.ts
- dashboard/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 16 edges
2. `react` - 14 edges
3. `featureKey()` - 13 edges
4. `getAttendanceDashboard()` - 13 edges
5. `useFavorites()` - 12 edges
6. `getNavigation` - 12 edges
7. `scripts` - 11 edges
8. `parseAttendanceFilters()` - 10 edges
9. `DashboardItem` - 10 edges
10. `Department` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `parseAttendanceFilters()`  [EXTRACTED]
  web/src/app/api/attendance/export/route.ts → web/src/lib/attendance-filters.ts
- `GET()` --calls--> `getNavigation`  [EXTRACTED]
  web/src/app/api/navigation/route.ts → web/src/lib/queries/navigation.ts
- `FeaturePage()` --calls--> `parseAttendanceFilters()`  [EXTRACTED]
  web/src/app/dashboard/[department]/[feature]/page.tsx → web/src/lib/attendance-filters.ts
- `AttendanceDashboard()` --calls--> `getAttendanceDashboard()`  [EXTRACTED]
  web/src/components/dashboard/attendance-dashboard.tsx → web/src/lib/queries/attendance.ts
- `CommandPalette()` --indirect_call--> `isFeatureAvailable()`  [INFERRED]
  web/src/components/layout/command-palette.tsx → web/src/lib/types.ts

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "knowledge.py"
Cohesion: 0.15
Nodes (20): Namespace, cmd_add_url(), cmd_note(), cmd_query(), cmd_status(), _graphify(), _knowledge_files(), main() (+12 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (29): @base-ui/react, class-variance-authority, cn, dotenv, eslint, eslint-config-next, next, pg (+21 more)

### Community 2 - "types.ts"
Cohesion: 0.07
Nodes (44): apexcharts, AttendanceDashboard(), Props, AttendanceDonutChart(), Props, statusColor, AttendanceTable(), columns (+36 more)

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

### Community 9 - "home-shortcuts.tsx"
Cohesion: 0.08
Nodes (43): lucide-react, react, DashboardHeader(), Props, categoryBadgeClass, categoryIcon, DashboardItemCard(), DepartmentModal() (+35 more)

### Community 10 - "navigation.ts"
Cohesion: 0.14
Nodes (23): server-only, GET(), FeaturePage(), DepartmentLayout(), DepartmentOverviewPage(), dynamic, Home(), DepartmentSection() (+15 more)

### Community 11 - "attendance.ts"
Cohesion: 0.14
Nodes (26): csvCell(), GET(), HEADER, addDays(), daysBetween(), todayIso(), escapeLike(), filteredCte() (+18 more)

## Knowledge Gaps
- **108 isolated node(s):** `HEADER`, `dynamic`, `dynamic`, `Props`, `statusColor` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 127 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `home-shortcuts.tsx` to `page-loading.tsx`, `package.json`, `navigation.ts`, `types.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `react` connect `home-shortcuts.tsx` to `package.json`, `types.ts`, `navigation.ts`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **What connects `HEADER`, `dynamic`, `dynamic` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06638714185883997 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._