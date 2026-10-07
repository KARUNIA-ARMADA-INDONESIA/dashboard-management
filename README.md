# WAT Project

Workflows, Agents, Tools. Probabilistic AI reasons; deterministic code executes.

## Layout
```
.tmp/           # Disposable intermediates (gitignored)
tools/          # Python execution scripts
workflows/      # Markdown SOPs
knowledge/      # Persistent knowledge: sources/ (raw) + notes/ (learnings)
graphify-out/   # Knowledge graph built by graphify (commit per project)
.env            # Secrets (gitignored) — copy from .env.example
```

## Setup
```
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env         # then fill values

# Knowledge graph (once per machine / per project)
uv tool install graphifyy      # once per machine
graphify hook install          # per clone: auto-rebuild code graph on commit
# then in Claude Code: /graphify .   (first build)
```

## How it works
- **Workflows** (`workflows/*.md`) define objective, inputs, tools, outputs, edge cases.
- **Agent** reads workflow, sequences tools, handles failures.
- **Tools** (`tools/*.py`) do the deterministic work. Import helpers from `tools/_shared.py`.
- **Knowledge** (`knowledge/`) holds sources + learnings, indexed into `graphify-out/`. SOP: `workflows/knowledge_base.md`. CLI: `tools/knowledge.py`.

New workflow: copy `workflows/_template.md`. New tool: import `_shared`, read secrets via `require_env`.
