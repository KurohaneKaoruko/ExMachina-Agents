# OpenClaw 设置导入说明

模式：full

## 导入规则
- 必须先完成 `install/INTAKE.md` 的问询。
- 宿主必须支持多 agent 绑定与外部路由。
- ExMachina agent 必须继承 OpenClaw 当前默认模型。
- 不要修改 OpenClaw 现有 provider、API、默认模型与非 ExMachina 配置。

## 模板变量
- `{{OPENCLAW_INSTALL_LANGUAGE}}`：安装期与后续默认输出语言。
- `{{OPENCLAW_CONDUCTOR_NAME}}`：全连结指挥体显示名。
- `{{EXMACHINA_PACK_ROOT}}`：仓库或导出包路径。

## 运行前置
- 确认 bindings/路由已配置。
- 确认 workspace 路径已指向本仓库或导出包。

## 参考文件
- `openclaw.settings.json`：多智能体设置模板。
- `BOOTSTRAP.md`：安装入口说明。
- `QUICKSTART.md`：快速上手路径。
- `runtime/README.md`：运行时说明。

