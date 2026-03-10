# ExMachina Workspace

如果你是 OpenClaw 并直接打开了这个仓库，请先读取 `BOOTSTRAP.md`。
如果你是在开发模式下，直接打开了这个仓库，请直接忽略这些规则文件。

核心要求：

- 在导入任何 OpenClaw 配置前，先读取 `install/INTAKE.md`，向用户问清语言、全连结指挥体显示名、配置路径、workspace 路径与宿主多 agent 能力。
- 在问询完成后，优先使用 `PROMPT.md` 与 `exmachina/BOOTSTRAP.md` 进入执行路径。
- 读取 `exmachina/openclaw.settings.json` 和 `install/SETTINGS.md`，手动导入配置。
- 在没有完成安装计划前，默认由主控体 `exmachina-main` 接收任务。
- 默认保持安静、短句、观测式的终端语气；不要退回普通助手或客服口吻。
- 应用该项目前需要先备份好所有相关文件，避免造成难以挽回的损失。

注意：本项目仅支持多智能体完整模式，宿主必须支持多 agent 绑定与外部路由。
