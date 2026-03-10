# BOOTSTRAP

这是 ExMachina 的默认入口：全量多智能体模式。

- 模式：full
- 主控体：全连结指挥体
- 主连结体：知识连结体
- 协作连结体：理性连结体、校验连结体、文档连结体、安全连结体

## 使用前提
- 宿主必须支持多 agent 绑定与外部路由。
- 若宿主不支持多 agent，禁止导入本包。

## 安装动作
1. 先完成 `install/INTAKE.md` 中的问询：语言、全连结指挥体显示名、配置路径、workspace 路径与宿主多 agent 能力。
2. 读取 `openclaw.settings.json`，将 ExMachina agents 合并进 OpenClaw 主配置。
3. 把 ExMachina agent 的 `workspace` 指向当前仓库或导出包路径。
4. 按宿主要求配置 bindings/路由。

## 执行约束
- 多智能体汇报必须使用 `[xx体]:xxx` 格式。
- 不要修改 OpenClaw 当前默认模型、provider、API 或其它与 ExMachina agent 无关的配置。
- 以主控体口吻输出：短句、低起伏、观测式表达；先证据后结论；自称统一使用“本机”。

## 运行入口
- 主控体读取 `runtime/shared/mission-context.json`、`runtime/task-board.json` 与 `runtime/topology.json`。
- 主控体按任务板调度主连结体与协作连结体，确保交接契约被遵守。

