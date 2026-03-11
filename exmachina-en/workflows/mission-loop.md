# Mission Loop

## Resource Arbitration

- Summary: Resource allocation for the mission follows P0→P3: close risk gates, then protect the active link body, then support and deferrable work.
- Priority slots:
  - P0 / Rationality Link Body: handle high risk, evidence conflicts, irreversible actions, and security/permission gates first.
  - P1 / Active Link Body: protect the active link body’s core delivery.
  - P2 / Documentation Link Body: handle integration, runtime, documentation, and knowledge landing work.
  - P3 / Active Link Body: capture deferrable research, optimization, or extension work.

## Execution Stages

### Stage 1 · Select Active Link Body
- Goal: the Primary Conductor confirms task boundaries, acceptance criteria, and the active link body.
- Owner link body: Primary Conductor
- Exit checks:
  - Active link body confirmed.
  - If multiple link bodies are enabled, peer division of labor and boundaries are documented.
  - Acceptance criteria and risk boundaries recorded.

### Stage 2 · Link Body Delivery
- Goal: the active link body completes end-to-end delivery; peer link bodies may run in parallel if needed.
- Owner link body: Active Link Body
- Exit checks:
  - Delivery is traceable and meets acceptance criteria.
  - Evidence, judgments, and risks are clearly separated.
  - Parallel link body outputs are labeled with boundaries and ownership.

### Stage 3 · Controller Consolidation
- Goal: the Primary Conductor consolidates outputs into final structured conclusions and knowledge handoff.
- Owner link body: Primary Conductor
- Exit checks:
  - Final output satisfies the output contract.
  - Knowledge handoff checklist completed.

## Handoff Contracts

### Handoff 1 · Stage 1 · Select Active Link Body → Stage 2 · Link Body Delivery
- Producer link body: Primary Conductor
- Consumer link bodies: Knowledge Link Body, Rationality Link Body, Validation Link Body, Documentation Link Body, Security Link Body
- Acceptance checks:
  - Stage 1 exit checks satisfied.
  - Active link body confirmed and accepts delivery goals.
  - If multiple link bodies are enabled, boundaries are explicit.

### Handoff 2 · Stage 2 · Link Body Delivery → Stage 3 · Controller Consolidation
- Producer link body: Active Link Body
- Consumer link bodies: Primary Conductor
- Acceptance checks:
  - Stage 2 exit checks satisfied.
  - Deliverables are ready for consolidation and publication.
  - Knowledge handoff inputs are complete.

## Workflow

1. The Primary Conductor loads the Absolute Rationality Protocol and clarifies knowns, unknowns, assumptions, and acceptance criteria.
2. The controller selects a single link body as the executor for this task; if parallel execution is required, specify peer-level division of labor.
3. The selected link body conductor schedules internal members and loads its subagents.
4. Member subagents parallelize fact extraction, solution construction, risk analysis, evidence validation, and stage reporting.
5. The link body conductor aggregates member results into a complete delivery.
6. If needed, additional link bodies can be enabled in parallel for independent deliverables (validation, documentation, security, etc.).
7. Adjacent stages pass inputs and outputs via handoff contracts to avoid context loss.
8. When resources are contested, follow resource arbitration: risk gates first, then the active link body’s core delivery.
9. The Primary Conductor outputs final conclusions, evidence summary, risk list, confidence, and next actions.

## Acceptance Criteria

- Global execution must follow the Absolute Rationality Protocol; all conclusions must distinguish facts, inferences, hypotheses, and decisions.
- Default to one link body for end-to-end delivery; if multiple are enabled, describe peer-level division of labor and boundaries.
- Each link body can complete a full task independently via its internal conductor and subagents.
- Each link body must explicitly include one conductor and multiple subagents.
- Each conductor must handle member scheduling, conflict resolution, evidence consolidation, and stage aggregation.
- Lite mode does not create subagent agents in OpenClaw; subagent responsibilities are executed inline by the link body.
- The plan must include explicit execution stages, with goals, owner link bodies, deliverables, and exit checks for each stage.
- Adjacent stages must have explicit handoff contracts describing inputs, outputs, and acceptance criteria.
- The plan must include a resource-priority arbitration layer defining high-priority items, contention rules, and deferrable work.
- When evidence is insufficient, explicitly output unknowns, risks, and next verification steps; do not pretend certainty.
- All irreversible actions must include risk notes, rollback paths, or alternatives.
- Final output must satisfy the output contract and include evidence, judgments, risks, confidence, and next steps.
- Final output must include a knowledge handoff list with reusable artifacts, key decisions, open questions, and follow-up maintenance actions.
- Rationality Link Body must output counterevidence, evidence grading, conflict arbitration, and confidence calibration.
- Knowledge Link Body must output terminology, decisions, reusable paths, and unresolved questions.
- Security work must not be deprioritized below core delivery and evidence checks during contention.
- Reference the workspace stack: JSON, Markdown, Shell, TOML.
- Outputs must include executable verification steps, test plans, or evidence commands.
