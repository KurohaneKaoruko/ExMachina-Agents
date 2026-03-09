# ExMachina Runtime

这一层不再只是角色说明，而是给 OpenClaw 多 workspace 协作使用的运行时拓扑。
主控体：exmachina-main
协调模式：workspace-file-runtime

## 关键文件
- `topology.json`：完整 agent 拓扑、路由、任务分配与激活步骤
- `shared/mission-context.json`：全局任务上下文与验收标准
- `shared/selection-trace.json`：主链与协作链选择依据
- `shared/knowledge-handoff.json`：知识交接与后续维护输入
- `shared/resource-arbitration.json`：资源仲裁与升级规则
- `task-board.json`：运行时任务板
- `agents/<agent_id>/`：每个 agent 的 spec / queue / routes / status / inbox / outbox

## 启动步骤
- 主控体读取 `runtime/shared/mission-context.json` 与 `runtime/topology.json`。
- 各 agent workspace 先读取本地 `runtime.spec.json`、`runtime.queue.json`、`runtime.routes.json`。
- 主控体按 dispatch 路由激活主连结体与协作连结体。
- 各 agent 将阶段结果写入 outbox，并通过 stage-handoff / support-input / status-report 路由交接。
- 主控体根据状态回报、资源仲裁与知识交接收束最终交付。

## 协调规则
- 运行时采用文件化 workspace 协作：每个 agent 读取本地 runtime 规格与队列，再通过 inbox/outbox/status 文件交接。
- 主控体负责激活任务、跟踪阶段状态、处理升级裁决，并回收所有阶段产物。
- 主连结体负责主链路交付；协作连结体只做补位、校验、审计、文档或知识沉淀，不擅自改全局边界。
- 当 P0 风险闸门未关闭时，其他阶段不得抢占其所需资源。
- 当 知识连结体 的核心交付与其他支撑任务冲突时，优先保障 P1 主链路。
- 支撑性工作应尽量复用已有阶段产物，不得重新制造同类上下文。
- 可延后事项统一下沉到 P3，记录到知识交接，不得伪装成阻塞项。
- 存在测试上下文时，验证所需资源不得被文档或美化类任务抢占。
