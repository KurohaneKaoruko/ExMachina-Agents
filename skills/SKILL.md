---
name: exmachina-project-maintainer
description: Use when extending or maintaining the ExMachina repository: adding or adjusting link bodies and subagents, evolving planner/exporter/model schemas, regenerating openclaw-pack, or syncing README and architecture docs with the code.
---

# ExMachina Project Maintainer

Use this skill when the task is about evolving this repository's OpenClaw multi-agent architecture.

## Workflow

1. Read `references/file-map.md` to locate the change surface.
2. If the task changes agent topology, start from `exmachina/data/default_profile.json`.
3. If the task changes exported structure, keep `exmachina/models.py`, `exmachina/planner.py`, and `exmachina/exporter.py` in sync.
4. If the task changes user-facing structure, update `README.md` and `docs/ARCHITECTURE.md`.
5. Regenerate the demo pack with `scripts/regenerate_demo_pack.py` after structural/export changes.
6. Run `python -m unittest discover -s tests -p 'test_*.py'` before finishing.

## Rules

- Do not add a new link body without defining its conductor, child agents, selection signals, and README documentation.
- Do not add exported fields in only one place; schema, planner output, exporter output, and tests must move together.
- Keep the demo pack representative of the current architecture, not a stale snapshot.

## References

- `references/file-map.md` for the repository map and ownership boundaries.
- `references/change-checklist.md` for the standard evolution checklist.

