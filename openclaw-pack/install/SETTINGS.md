# OpenClaw 设置导入指南

摘要：围绕任务「沉淀知识交接、术语索引、资源仲裁规则与 README 示例，形成 OpenClaw 协作层」生成的 OpenClaw 设置导入模板。
模式：lite
是否支持直接导入：是

## 目标配置路径
- `~/.openclaw/openclaw.json`
- `~/.clawdbot/clawdbot.json`

## 合并步骤
- 将 `openclaw.settings.json` 中的 `settings_patch.agents` 合并进 OpenClaw 主配置。
- 把 `workspace` 指向当前仓库或导出包所在路径。
- 填入 `{{OPENCLAW_PRIMARY_MODEL}}` 后即可通过单个主控 agent 使用 Lite 模式。

## 使用说明
- Lite 模式默认不要求 channels/accounts/bindings。
- 如果 OpenClaw 宿主支持 WebUI 或默认入口，只需要一个主控 agent 即可。

## 产物
- `openclaw.settings.json`：OpenClaw 设置模板主文件
- `install/install_openclaw_settings.py`：把 settings patch 合并进现有 OpenClaw 配置的帮助脚本
