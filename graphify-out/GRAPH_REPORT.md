# Graph Report - dashboard-management  (2026-10-21)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 22 nodes · 35 edges · 4 communities
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f390dde8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3

## God Nodes (most connected - your core abstractions)
1. `cmd_note()` - 6 edges
2. `main()` - 5 edges
3. `cmd_add_url()` - 4 edges
4. `cmd_query()` - 4 edges
5. `cmd_status()` - 4 edges
6. `_knowledge_files()` - 3 edges
7. `_graphify()` - 3 edges
8. `load_env()` - 3 edges
9. `require_env()` - 3 edges
10. `tmp_path()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `main()` --indirect_call--> `cmd_note()`  [INFERRED]
  tools/knowledge.py → tools/knowledge.py  _Bridges community 0 → community 1_

## Import Cycles
- None detected.

## Communities (4 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.43
Nodes (6): cmd_note(), _knowledge_files(), _mark_dirty(), Path, Knowledge store CLI. Deterministic layer over knowledge/ + graphify. Layout:…, _slug()

### Community 1 - "Community 1"
Cohesion: 0.53
Nodes (6): Namespace, cmd_add_url(), cmd_query(), cmd_status(), _graphify(), main()

### Community 2 - "Community 2"
Cohesion: 0.40
Nodes (5): load_env(), Shared helpers for tools. Load env, resolve paths, standard I/O. Deterministic…, Load .env from project root. No-op if python-dotenv missing., Return env var or raise clear error naming the missing key., require_env()

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (3): Path, Path inside .tmp/. Creates .tmp/ if absent. Files here are disposable., tmp_path()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tmp_path()` connect `Community 3` to `Community 2`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `main()` (e.g. with `cmd_add_url()` and `cmd_note()`) actually correct?**
  _`main()` has 4 INFERRED edges - model-reasoned connections that need verification._