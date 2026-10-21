---
title: Windows environment setup
created: 2026-10-21
tags: [setup, windows, graphify]
---

# Windows environment setup

Setup completed 2026-10-21 on Windows with Python 3.11.9, uv 0.11.7, graphifyy 0.9.58 (installed as a uv tool, not in .venv).

Steps that work: python -m venv .venv; .venv\Scripts\python.exe -m pip install -r requirements.txt; copy .env.example .env (secrets stay in .env, gitignored); graphify hook install (post-commit + post-checkout, merge driver already registered in .gitattributes).

No LLM API key and no Claude Code subagents in this environment, so the initial graph was built with 'graphify extract . --code-only' plus 'graphify cluster-only . --no-label'. This indexes only the 2 Python tools; markdown docs/notes are skipped. To include docs and to pick up new notes, run /graphify . --update in Claude Code or set an API key (GEMINI_API_KEY / OPENAI_API_KEY etc.) and run 'graphify extract .'.

Use .venv\Scripts\python.exe for tools so python-dotenv and requests are available.
