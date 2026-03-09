# OpenClaw 安装指南

摘要：围绕任务「沉淀知识交接、术语索引、资源仲裁规则与 README 示例，形成 OpenClaw 协作层」生成可直接供 OpenClaw 装载的主控 + 主链 + 协作 agent 安装计划。

## 最简安装路径
1. 将当前仓库作为 OpenClaw workspace 打开，或直接把仓库链接交给 OpenClaw。
2. 读取仓库根目录 `BOOTSTRAP.md`。
3. 运行 `python -m exmachina validate-assets`，确认引用完整。
4. 读取 `install/openclaw.agents.plan.json`，按其中的 agents / binding_plans 创建多 agent。
5. 让 `exmachina-main` 作为默认入口重新读取 `openclaw-pack/BOOTSTRAP.md` 并进入执行。

## 生成内容
- `openclaw.agents.plan.json`：多 agent 安装与绑定计划
- `workspaces/<agent_id>/`：每个 agent 的 workspace 引导文件模板

## 安装步骤
- 将仓库作为 OpenClaw workspace 打开，先读取根目录 `BOOTSTRAP.md`。
- 运行 `python -m exmachina validate-assets`，确认资产引用完整。
- 读取 `openclaw-pack/install/INSTALL.md` 和 `openclaw-pack/install/openclaw.agents.plan.json`。
- 按安装计划创建主控 agent、主连结体 agent 和协作 agent。
- 让主控 agent 再次读取 `openclaw-pack/BOOTSTRAP.md` 并进入任务执行。

## 自举步骤
- 若 OpenClaw 直接打开仓库，请优先读取根目录 `BOOTSTRAP.md`。
- 若检测到尚未配置多 agent，请根据 `openclaw.agents.plan.json` 生成隔离 workspace。
- 安装后由 `exmachina-main` 作为默认入口接收用户任务。
