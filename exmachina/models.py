from __future__ import annotations

from dataclasses import asdict, dataclass, field


@dataclass
class RepoReference:
    provider: str
    owner: str
    name: str
    url: str
    branch: str | None = None
    subpath: str | None = None

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class WorkspaceSnapshot:
    root: str
    detected_languages: list[str] = field(default_factory=list)
    top_level_entries: list[str] = field(default_factory=list)
    notable_paths: list[str] = field(default_factory=list)
    test_paths: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ChildAgent:
    name: str
    mission: str
    outputs: list[str]
    checks: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class LinkConductor:
    name: str
    mission: str
    duties: list[str]
    checks: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class LinkBody:
    name: str
    entity_type: str
    identity: str
    focus: str
    reason: str
    deliverables: list[str]
    member_selection_rule: str
    rationality_obligations: list[str]
    link_conductor: LinkConductor
    child_agents: list[ChildAgent]

    def to_dict(self) -> dict:
        members = [child.to_dict() for child in self.child_agents]
        return {
            "name": self.name,
            "entity_type": self.entity_type,
            "identity": self.identity,
            "focus": self.focus,
            "reason": self.reason,
            "deliverables": self.deliverables,
            "member_selection_rule": self.member_selection_rule,
            "rationality_obligations": self.rationality_obligations,
            "link_conductor": self.link_conductor.to_dict(),
            "member_count": len(members),
            "member_agents": members,
            "child_agents": members,
        }


@dataclass
class RationalityProtocol:
    name: str
    mission: str
    epistemic_rules: list[str]
    decision_rules: list[str]
    action_rules: list[str]
    disagreement_rules: list[str]
    escalation_rules: list[str]
    output_contract: list[str]
    anti_patterns: list[str]
    evidence_tiers: list[dict[str, str]]
    confidence_scale: list[dict[str, str]]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class LinkBodyScore:
    name: str
    score: int
    matched_keywords: list[str]
    matched_priority_keywords: list[str]
    bonus_reasons: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class SelectionTrace:
    primary_name: str
    primary_score: int
    primary_reasons: list[str]
    support_names: list[str]
    support_reasons: list[str]
    scored_candidates: list[LinkBodyScore]

    def to_dict(self) -> dict:
        return {
            "primary_name": self.primary_name,
            "primary_score": self.primary_score,
            "primary_reasons": self.primary_reasons,
            "support_names": self.support_names,
            "support_reasons": self.support_reasons,
            "scored_candidates": [item.to_dict() for item in self.scored_candidates],
        }


@dataclass
class KnowledgeHandoff:
    summary: str
    carry_forward: list[str]
    decisions: list[str]
    open_questions: list[str]
    next_updates: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ExecutionStage:
    name: str
    goal: str
    owner_body: str
    support_bodies: list[str]
    deliverables: list[str]
    exit_checks: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class HandoffContract:
    name: str
    producer_stage: str
    consumer_stage: str
    producer_body: str
    consumer_bodies: list[str]
    payload: list[str]
    acceptance_checks: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ArbitrationSlot:
    priority: str
    owner_body: str
    objective: str
    reason: str
    deferrable: bool

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ResourceArbitration:
    summary: str
    priority_slots: list[ArbitrationSlot]
    contention_rules: list[str]
    escalation_rules: list[str]
    deferred_work: list[str]

    def to_dict(self) -> dict:
        return {
            "summary": self.summary,
            "priority_slots": [slot.to_dict() for slot in self.priority_slots],
            "contention_rules": self.contention_rules,
            "escalation_rules": self.escalation_rules,
            "deferred_work": self.deferred_work,
        }


@dataclass
class OpenClawInstallAgent:
    agent_id: str
    display_name: str
    role: str
    workspace_dir: str
    agent_dir: str
    session_strategy: str
    source: str
    responsibilities: list[str]
    handoff_targets: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class OpenClawBindingPlan:
    target_agent_id: str
    binding_mode: str
    match_hint: str
    reason: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class OpenClawInstallPlan:
    summary: str
    repo_install_mode: str
    workspace_entry_files: list[str]
    agents: list[OpenClawInstallAgent]
    binding_plans: list[OpenClawBindingPlan]
    install_steps: list[str]
    self_bootstrap_steps: list[str]

    def to_dict(self) -> dict:
        return {
            "summary": self.summary,
            "repo_install_mode": self.repo_install_mode,
            "workspace_entry_files": self.workspace_entry_files,
            "agents": [agent.to_dict() for agent in self.agents],
            "binding_plans": [plan.to_dict() for plan in self.binding_plans],
            "install_steps": self.install_steps,
            "self_bootstrap_steps": self.self_bootstrap_steps,
        }


@dataclass
class RuntimeSharedArtifact:
    name: str
    path: str
    description: str
    consumers: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class RuntimeRoute:
    route_id: str
    source_agent_id: str
    target_agent_id: str
    contract_name: str
    delivery_mode: str
    payload: list[str]
    acceptance_checks: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class RuntimeAssignment:
    assignment_id: str
    stage_name: str
    agent_id: str
    source_body: str
    role: str
    goal: str
    deliverables: list[str]
    exit_checks: list[str]
    depends_on: list[str]
    handoff_routes: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class RuntimeAgentSpec:
    agent_id: str
    display_name: str
    runtime_role: str
    source: str
    workspace_dir: str
    responsibilities: list[str]
    handoff_targets: list[str]
    inbox_path: str
    outbox_path: str
    status_path: str
    assignments: list[str]
    coordination_rules: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class RuntimeTopology:
    controller_agent_id: str
    coordination_mode: str
    shared_artifacts: list[RuntimeSharedArtifact]
    agent_specs: list[RuntimeAgentSpec]
    assignments: list[RuntimeAssignment]
    routes: list[RuntimeRoute]
    coordination_rules: list[str]
    activation_steps: list[str]

    def to_dict(self) -> dict:
        return {
            "controller_agent_id": self.controller_agent_id,
            "coordination_mode": self.coordination_mode,
            "shared_artifacts": [artifact.to_dict() for artifact in self.shared_artifacts],
            "agent_specs": [agent.to_dict() for agent in self.agent_specs],
            "assignments": [assignment.to_dict() for assignment in self.assignments],
            "routes": [route.to_dict() for route in self.routes],
            "coordination_rules": self.coordination_rules,
            "activation_steps": self.activation_steps,
        }


@dataclass
class MissionPlan:
    mission_title: str
    task: str
    task_slug: str
    conductor_name: str
    conductor_mission: str
    conductor_principles: list[str]
    repo: RepoReference | None
    workspace: WorkspaceSnapshot | None
    rationality_protocol: RationalityProtocol
    primary_link_body: LinkBody
    support_link_bodies: list[LinkBody]
    selection_trace: SelectionTrace
    knowledge_handoff: KnowledgeHandoff
    execution_stages: list[ExecutionStage]
    handoff_contracts: list[HandoffContract]
    resource_arbitration: ResourceArbitration
    openclaw_install_plan: OpenClawInstallPlan
    runtime_topology: RuntimeTopology
    acceptance_criteria: list[str]
    workflow: list[str]
    openclaw_install_prompt: str

    def to_dict(self) -> dict:
        return {
            "mission_title": self.mission_title,
            "task": self.task,
            "task_slug": self.task_slug,
            "ontology": {
                "conductor": "全连结指挥体是顶层调度体。",
                "link_body": "连结体是由一个连结指挥体和多个子个体组成的任务协作单元。",
                "link_conductor": "连结指挥体是某个连结体内部的协调中枢。",
                "child_agent": "子个体是承担单一职责的实际智能体。",
            },
            "conductor": {
                "name": self.conductor_name,
                "mission": self.conductor_mission,
                "principles": self.conductor_principles,
            },
            "repo": self.repo.to_dict() if self.repo else None,
            "workspace": self.workspace.to_dict() if self.workspace else None,
            "rationality_protocol": self.rationality_protocol.to_dict(),
            "selection_trace": self.selection_trace.to_dict(),
            "knowledge_handoff": self.knowledge_handoff.to_dict(),
            "execution_stages": [stage.to_dict() for stage in self.execution_stages],
            "handoff_contracts": [contract.to_dict() for contract in self.handoff_contracts],
            "resource_arbitration": self.resource_arbitration.to_dict(),
            "openclaw_install_plan": self.openclaw_install_plan.to_dict(),
            "runtime_topology": self.runtime_topology.to_dict(),
            "primary_link_body": self.primary_link_body.to_dict(),
            "support_link_bodies": [body.to_dict() for body in self.support_link_bodies],
            "acceptance_criteria": self.acceptance_criteria,
            "workflow": self.workflow,
            "openclaw_install_prompt": self.openclaw_install_prompt,
        }
