# QUICKSTART

当前模式：full

## 最短路径
1. 先问清 `install/INTAKE.md` 中的全部问题（语言、主控体显示名、配置路径、workspace 路径、宿主多 agent 能力）。
2. 合并 `openclaw.settings.json` 中的 ExMachina agents。
3. 配置多 agent 绑定/路由（宿主要求的 channels、bindings、accounts 等）。
4. 由 `exmachina-main` 读取 `runtime/` 并按任务板调度其他 agents。

## 关键文件
- `openclaw.settings.json`：多智能体设置模板。
- `install/INTAKE.md`：安装问询。
- `runtime/topology.json`：多智能体拓扑与路由摘要。
- `runtime/task-board.json`：阶段任务板。
- `runtime/agents/`：每个 agent 的规格、队列与状态。
- `BOOTSTRAP.md`：安装与执行入口。

## 运行约束
- 多智能体汇报必须使用 `[xx体]:xxx` 格式。
- 宿主不支持多 agent 时，禁止导入本包。

