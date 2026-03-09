# File Map

## Core runtime files

- `exmachina/data/default_profile.json`: Primary profile index; stores selection rules and file references to link-body, conductor, and subagent definitions.
- `exmachina/data/link_bodies/`: Source-of-truth link-body definitions used by the profile loader.
- `exmachina/data/conductors/`: Source-of-truth conductor definitions used by the profile loader.
- `exmachina/data/subagents/`: Source-of-truth subagent prompt definitions used by the profile loader.
- `exmachina/models.py`: Structured output schema for plans and exported packs.
- `exmachina/planner.py`: Planning logic, selection trace, stages, contracts, knowledge handoff, and arbitration.
- `exmachina/exporter.py`: `mission.json`, `mission.md`, and `openclaw-pack/` generation.
- `exmachina/cli.py`: CLI entrypoints.

## Validation

- `tests/test_planner.py`: Planning behavior and schema expectations.
- `tests/test_cli.py`: Exported artifact expectations.
- `tests/test_repository.py`: Repository parsing behavior.

## Documentation

- `README.md`: Single-entry project overview and role catalog.
- `docs/ARCHITECTURE.md`: Detailed architecture diagrams and file flow.
- `openclaw-pack/`: Regenerated demo pack tracked in the repo.

## Skills

- `skills/exmachina-project-maintainer/`: Repo-local Codex skill for future maintenance.
