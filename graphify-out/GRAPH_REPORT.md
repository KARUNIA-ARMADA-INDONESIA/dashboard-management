# Graph Report - dashboard-management  (2026-10-21)

## Corpus Check
- 54 files · ~217,751 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 24 nodes · 36 edges · 4 communities (3 shown, 1 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7e6704b9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- knowledge.py
- main
- _shared.py
- windows-environment-setup.md

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

## Communities (4 total, 1 thin omitted)

### Community 0 - "knowledge.py"
Cohesion: 0.43
Nodes (6): cmd_note(), _knowledge_files(), _mark_dirty(), Path, Knowledge store CLI. Deterministic layer over knowledge/ + graphify. Layout:…, _slug()

### Community 1 - "main"
Cohesion: 0.53
Nodes (6): Namespace, cmd_add_url(), cmd_query(), cmd_status(), _graphify(), main()

### Community 2 - "_shared.py"
Cohesion: 0.25
Nodes (8): load_env(), Path, Shared helpers for tools. Load env, resolve paths, standard I/O. Deterministic…, Load .env from project root. No-op if python-dotenv missing., Return env var or raise clear error naming the missing key., Path inside .tmp/. Creates .tmp/ if absent. Files here are disposable., require_env(), tmp_path()

## Knowledge Gaps
- **1 isolated node(s):** `Windows environment setup`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 8 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 4 inferred relationships involving `main()` (e.g. with `cmd_add_url()` and `cmd_note()`) actually correct?**
  _`main()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Windows environment setup` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._