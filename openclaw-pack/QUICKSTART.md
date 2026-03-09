# ExMachina Quickstart

这份文档只保留首次接入所需的最短路径。
当前模式：lite
当前任务：沉淀知识交接、术语索引、资源仲裁规则与 README 示例，形成 OpenClaw 协作层
主连结体：知识连结体
协作连结体：理性连结体、校验连结体、文档连结体、安全连结体

## Lite 最短路径
1. 先读 `openclaw.settings.json` 与 `install/SETTINGS.md`，把 ExMachina 设置导入 OpenClaw。
2. 再读 `manifest.json` 与 `BOOTSTRAP.md`，确认当前任务、主连结体和协作链。
3. 读 `protocols/` 与 `conductor/00_全连结指挥体.md`，先加载协议，再进入角色规则。
4. 读 `runtime/task-board.json`，由 `exmachina-main` 在单会话内按顺序推进任务。
5. 需要补位时再读协作连结体文档，但默认不创建额外 agent。

## Lite 关键文件
- `manifest.json`：主链路选择依据、知识交接、阶段分工
- `runtime/task-board.json`：单会话推进任务的主入口
- `runtime/README.md`：运行时任务板与状态文件说明

## 自检命令
```bash
python -m exmachina validate-assets
python -m exmachina doctor
```
