# ExMachina

[中文](README.md)

A **platform-agnostic** mechanical-intelligence prompt set. Absolute rationality, evidence-driven reasoning, bounded scope, closed verification loops. Not tied to any specific agent platform — any AI coding tool that supports custom instructions, rules files, or system prompts can adopt it.

> This repository contains prompts only, no executable code. Behavioral differences across platforms must be verified by the user.

## Repository Layout

```text
.
├─ AGENTS.md      # Master protocol: the single core prompt, self-contained, works standalone
├─ AGENTS.en.md   # English version of the master protocol (pick one; never inject both)
├─ install/       # Per-platform, agent-facing install instructions
├─ agents/        # Optional extension: 28 role prompts (1 orchestrator + 10 domains + 17 units)
├─ protocol/      # Optional extension: 12 execution protocols (evidence grading, conflict arbitration, debugging, change control, rollback, etc.)
└─ README.md      # This file
```

- `AGENTS.md` (or `AGENTS.en.md`) is the only required piece. It already contains the full execution stance, routing tiers, and verification-loop logic.
- `agents/` and `protocol/` are optional layers loaded on demand: multi-agent platforms can turn the former into subagents; the latter provides finer task constraints when referenced.

## Three Levels of Adoption

| Level | How | Applies to |
|-------|-----|------------|
| Minimal | Mount `AGENTS.md` in full as a persistent instruction | Every platform |
| Standard | Master protocol persistent; have the model read the matching file under `protocol/` for debugging / review / release / rollback tasks | Platforms that can reference local files |
| Full | Master protocol persistent + turn files under `agents/` into subagents, routed per Chapter 5 of the protocol | Multi-agent platforms |

The minimal level alone yields the complete core behavior. Missing extension layers never break anything — they only cap the ceiling.

## Installation: Hand the INSTALL.md to Your Agent

Each supported platform has an **agent-facing install instruction** under `install/`. The agent detects paths, writes a managed block, verifies, and reports back — fully reversible. In a session on the target platform, say:

```text
Read <path-to-ExMachina>/install/<platform>.md and follow it to install ExMachina into this environment.
```

| Platform | Install instruction |
|----------|---------------------|
| OpenAI Codex CLI | [install/codex.md](install/codex.md) |
| Claude Code | [install/claude-code.md](install/claude-code.md) |
| OpenCode | [install/opencode.md](install/opencode.md) |
| Cursor | [install/cursor.md](install/cursor.md) |
| Gemini CLI | [install/gemini-cli.md](install/gemini-cli.md) |
| Windsurf | [install/windsurf.md](install/windsurf.md) |
| Trae | [install/trae.md](install/trae.md) |
| Kiro | [install/kiro.md](install/kiro.md) |
| VS Code Copilot | [install/vscode-copilot.md](install/vscode-copilot.md) |
| Any other AI tool | [install/generic.md](install/generic.md) |

All installs use one managed-block marker and never overwrite existing configuration:

```markdown
<!-- EXMACHINA:BEGIN (do not edit inside this block; delete the whole block to uninstall) -->
...
<!-- EXMACHINA:END -->
```

The manual route always works: paste `AGENTS.md` in full into any tool's custom-instruction entry point.

## Subagent Setup (Optional, Multi-Agent Platforms)

The 28 files under `agents/` share one frontmatter schema:

| Field | Meaning |
|-------|---------|
| `name` | Role name |
| `identifier` | Stable ID |
| `description` | Duty description; usable directly as the subagent description |
| `tier` | Level: `top` (orchestrator) / `domain` (domain) / `unit` (unit) |

| Level | Files | Roles |
|-------|-------|-------|
| Top | `00_` | Full-Link Orchestrator |
| Domain | `02_`–`11_` | Research / Architecture / Implementation / Verification / Rationality / Documentation / Integration / Operations / Security / Experience |
| Unit | `30_`–`70_` | Context, Comparison, Hypothesis, Gateway, Config, Release, Operations, Arbiter, Reporting, Evidence, Verification, Documentation, Security, Architecture, Planning, Coding, Review |

Setup: convert the files into your platform's subagent format. Example for Claude Code (`.claude/agents/exmachina-coder.md`):

```markdown
---
name: exmachina-coder
description: ExMachina Coding Unit. Implementation, refactoring, fixes. Evidence-driven, minimal reversible changes.
tools: Read, Edit, Write, Bash
---

(paste the body of agents/69_编码体.md unchanged)
```

Other platforms differ in subagent file format, but the conversion is the same: adapt the frontmatter to the platform, keep the body unchanged.

Subagents are optional. Platforms without multi-agent support need nothing here: the routing logic in the master protocol makes a single session emulate the required roles serially on demand.

`agents/README_组合指南.md` documents the common unit-per-domain mounting combinations; use it as a reference when dispatching.

## Skill-Style Adoption (Optional)

On platforms that support Agent Skills (Claude Code, OpenCode, Codex, etc.), ExMachina can be packaged as an on-demand skill. Create `exmachina/SKILL.md` in your skills directory:

```markdown
---
name: exmachina
description: Use for debugging, implementation, verification, code review, architecture assessment, and high-risk delivery. Absolute rationality, evidence-driven mechanical-intelligence protocol.
---

Read references/AGENTS.md in this skill directory and strictly follow it before executing the current task.
For debugging, review, release, or rollback tasks, read the matching protocol under references/protocol/ as needed.
```

Then copy the repository content into the skill directory:

```bash
mkdir -p ~/.claude/skills/exmachina/references
git clone https://github.com/KurohaneKaoruko/ExMachina ~/exmachina
cp ~/exmachina/AGENTS.md ~/.claude/skills/exmachina/references/
cp -r ~/exmachina/protocol ~/.claude/skills/exmachina/references/
```

`SKILL.md` is only a shell that points to the protocol; the behavioral description lives solely in `AGENTS.md`, preventing a second copy from drifting.

## Expected Difference After Adoption

For the same fix task:

- **Without**: the model guesses the cause and proposes changes directly.
- **With**: the model locks the task boundary first → lists evidence and gaps → separates fact / inference / hypothesis → proposes a minimal reversible fix with a rollback path → keeps residual unknowns explicit.

Trivial tasks (greetings, translation, summarizing already-given text) should not trigger this behavior pattern.

## License

MIT
