# ExMachina for Hermes Agent

ExMachina ships a dedicated install surface for Hermes Agent (Nous Research), wiring the mechanical-intelligence protocols and skill system into the `~/.hermes/` skill library.

Raw install doc:

- `https://raw.githubusercontent.com/KurohaneKaoruko/Ex-Machina/main/dist/hermes/INSTALL.en.md`

## How integration works

Hermes Agent differs from the other supported platforms:

- Skills are "directory + `SKILL.md`" units, located under `~/.hermes/skills/` by default, and can also be discovered through `skills.external_dirs` in `config.yaml`
- `~/.hermes/SOUL.md` is the first slot of the system prompt and can carry global identity and behavior constraints
- Hermes is a single primary session agent: ExMachina's multi-agent cooperation runs as single-session chain simulation — the skill prompts load role and protocol content from `references/agents/` and `references/protocol/` on demand and route work within one session

The repository's root `skills/` directory is already Hermes-compatible, so integration is one of two options:

| Option | Mechanism | Best for |
|--------|-----------|----------|
| external_dirs (recommended) | point `config.yaml` at the repo `skills/` | repo checked out locally; `git pull` updates instantly |
| Copy install | copy skill directories into `~/.hermes/skills/` | repo not kept around, or skills must travel with the Hermes home |

Do not use both at the same time to avoid duplicate skill registration.

## Prerequisites

- Hermes Agent installed and runnable (`hermes --version` works)
- A model that meets Hermes's minimum context requirement (>= 64K)
- `hermes setup` completed with at least one model provider configured

## Quick start (external_dirs)

```bash
git clone https://github.com/KurohaneKaoruko/Ex-Machina ~/exmachina
```

Merge the following into `~/.hermes/config.yaml` (see `dist/hermes/config-snippet.yaml`):

```yaml
skills:
  external_dirs:
    - ~/exmachina/skills
```

Adjust the path to your actual checkout location on Windows, e.g. `D:/exmachina/skills`.

## Quick start (copy install)

macOS / Linux / WSL2:

```bash
git clone https://github.com/KurohaneKaoruko/Ex-Machina ~/exmachina
mkdir -p ~/.hermes/skills
cp -r ~/exmachina/skills/exmachina-zh ~/exmachina/skills/exmachina-en \
      ~/exmachina/skills/using-exmachina ~/exmachina/skills/using-exmachina-zh \
      ~/exmachina/skills/using-exmachina-en ~/.hermes/skills/
```

Windows PowerShell:

```powershell
git clone https://github.com/KurohaneKaoruko/Ex-Machina "$HOME/exmachina"
New-Item -ItemType Directory -Force "$HOME/.hermes/skills" | Out-Null
Copy-Item -Recurse -Force `
  "$HOME/exmachina/skills/exmachina-zh",
  "$HOME/exmachina/skills/exmachina-en",
  "$HOME/exmachina/skills/using-exmachina",
  "$HOME/exmachina/skills/using-exmachina-zh",
  "$HOME/exmachina/skills/using-exmachina-en" `
  "$HOME/.hermes/skills/"
```

Alternatively, copy the pre-built copies bundled with this surface: `dist/hermes/skills/` contains the same five skill directories.

## (Optional) Inject global guidance

To apply ExMachina's execution stance to every session, append the repository-root `AGENTS.md` as a managed block in `~/.hermes/SOUL.md` with explicit boundary markers:

```markdown
# >>> ExMachina managed block >>>
(paste the repository-root AGENTS.md here)
# <<< ExMachina managed block <<<
```

Remove the block to restore the original file content.

## Verify the install

```bash
hermes skills list
```

Confirm the output includes `exmachina-zh` (or `using-exmachina-zh`). Then run `/skills` in a session and issue an acceptance task:

> Analyze this error and give me a fix path, evidence first.

If integration works, the agent locks the task boundary and grades evidence before touching code, instead of guessing causes.

## Update and uninstall

```bash
cd ~/exmachina && git pull --ff-only   # external_dirs mode: effective immediately
```

For copy installs, re-run the copy commands to refresh. To uninstall:

- Remove `exmachina-zh`, `exmachina-en`, `using-exmachina`, `using-exmachina-zh`, `using-exmachina-en` from `~/.hermes/skills/`
- Remove the matching `external_dirs` entry from `config.yaml`
- Remove the SOUL.md managed block if you injected one

## Troubleshooting

- Skill not listed by `hermes skills list`: check the `external_dirs` YAML indentation (two levels under `skills:`), confirm `SKILL.md` exists in each directory, and run `hermes config check`.
- Stale skill content after a copy install: re-copy, or switch to the external_dirs mode.
- Abnormal skill behavior from insufficient context: switch to a model that satisfies Hermes's minimum context requirement.

## Related entry points

- Repository home: `https://github.com/KurohaneKaoruko/Ex-Machina`
- Config snippet: `dist/hermes/config-snippet.yaml`
- Repository-root `AGENTS.md`: the full operating protocol
- Package entry: `plugin.json`
