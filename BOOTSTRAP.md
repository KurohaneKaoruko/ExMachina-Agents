# ExMachina Bootstrap

如果 OpenClaw 直接打开了这个仓库，请按以下顺序自举：

1. 读取 `AGENTS.md`、`SOUL.md`、`TOOLS.md`
2. 运行 `python -m exmachina validate-assets`
3. 读取 `openclaw-pack/install/INSTALL.md`
4. 读取 `openclaw-pack/install/openclaw.agents.plan.json`
5. 先装配 `exmachina-main`，再装配 `exmachina-primary` 和协作 agent
6. 完成后回到 `openclaw-pack/BOOTSTRAP.md`，按多智能体结构执行任务

如果当前环境还没有多 agent 配置能力，至少要先把本仓库作为主控 workspace 运行，再根据安装计划逐步补齐协作 agent。

