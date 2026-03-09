# Change Checklist

Use this checklist whenever you evolve ExMachina.

## If you add or change a link body

- Update `exmachina/data/default_profile.json`.
- Ensure conductor file, child-agent file references, keywords, and rationality obligations are present.
- Keep `exmachina/data/link_bodies/`, `exmachina/data/conductors/`, and `exmachina/data/subagents/` in sync with the profile references.
- Update README role catalog.
- Add or update planner tests.

## If you add or change exported structure

- Update `exmachina/models.py`.
- Update `exmachina/planner.py`.
- Update `exmachina/exporter.py`.
- Update CLI/export tests.

## If you change generated pack content

- Regenerate `openclaw-pack/`.
- Check `openclaw-pack/manifest.json`, `openclaw-pack/README.md`, and `openclaw-pack/workflows/mission-loop.md`.

## Before finishing

- Verify README matches the current architecture.
- Run `python -m exmachina validate-assets`.
- Run the full unittest command.
