# ExMachina Architecture

## Core Structure

```mermaid
flowchart TD
    U[Task Input / Workspace] --> OC[OpenClaw]
    OC --> P[PROMPT.en.md]
    P --> PACK[exmachina-en/]
    PACK --> BOOT[BOOTSTRAP.md]
    PACK --> MANI[manifest.json]
    PACK --> PROTO[protocols/]
    PACK --> COND[agents/]
    PACK --> BODIES[agents/]
    PACK --> BODYC[agents/]
    PACK --> SUBS[agents/]
    PACK --> RUNTIME[runtime/]
    RUNTIME --> TOP[topology.json]
    RUNTIME --> TASK[task-board.json]
    RUNTIME --> AGENTS[agents/*]
```

## Runtime Collaboration Diagram (lite / full)

```mermaid
flowchart LR
    M[Controller exmachina-main] --> L1[Link Body exmachina-link-knowledge]
    M --> L2[Link Body exmachina-link-rationality]
    M --> L3[Link Body exmachina-link-validation]
    M --> L4[Link Body exmachina-link-documentation]
    M --> L5[Link Body exmachina-link-security]

    L1 --> M
    L2 --> M
    L3 --> M
    L4 --> M
    L5 --> M

    M --> TASK[task-board.json]
    TASK --> L1
    TASK --> L2
    TASK --> L3
    TASK --> L4
    TASK --> L5
```

Note: lite mode uses the same link-body topology but does not create subagent agents in OpenClaw. Full mode additionally creates subagent agents. The controller defaults to one active link body and may enable peers in parallel with clear division of labor.

## Maintenance Principles

- `exmachina-en/` is the single source of truth for prompts and runtime.
- `PROMPT.en.md` must stay consistent with `exmachina-en/` content.
- Topology, task board, and agent status in `runtime/` must remain consistent.
- Multi-agent reporting must use the `[xx-body]:xxx` format.
- Both lite and full modes are supported. Lite does not create subagent agents in OpenClaw; full creates all subagent agents.

