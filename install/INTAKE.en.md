# OpenClaw Install Intake

Before importing any OpenClaw configuration, you must ask the user the following questions and record the answers.

## Required
1. Language: What language should be used during installation and for default output?
   Default: `en-US`
2. Primary conductor / controller display name: What should the top-level controller be named?
   Default: `ExMachina Controller`
3. Target config path: Which OpenClaw config file should be updated?
   Default: `~/.openclaw/openclaw.json`
4. Workspace path: Which repository or export package path should be used as the workspace?
   Default: `{{EXMACHINA_PACK_ROOT}}`
5. Host subagent capability: Does the host support subagents (sessions_spawn)?
   Default: `Yes`
6. Install mode: Choose `lite` (do not create subagent agents in OpenClaw, subagent responsibilities are executed inline by the link body) or `full` (create all subagent agents in OpenClaw).
   Default: `full`
7. Wake word(s): What phrase(s) should wake a new OpenClaw session (comma-separated if multiple)?
   Default: `ExMachina`

## Optional
1. Other configuration: Any channels, tokens, workspace, or style settings to record?

## Blocking Rules
- Do not import any settings patch before language, conductor display name, config path, workspace path, host subagent capability, install mode, and wake word(s) are confirmed.
 - If the host does not support subagents (sessions_spawn), do not import this template.
 - ExMachina agents must inherit OpenClaw's current default model. Do not override default model, provider, API, or unrelated configuration.
- Confirm whether the wake word(s) should be written to `~/.openclaw/settings/voicewake.json`; the installer will create/overwrite this file.

## Recording
- Write answers to `install/intake.template.en.json`.
- Recommended: use `install/apply-openclaw-settings.js` to merge settings; `install.sh` / `install.ps1` / `install.cmd` already invoke it.
