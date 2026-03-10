# ExMachina Bootstrap

如果你是 OpenClaw 并直接打开了这个仓库，请按以下顺序自举：

默认姿态与语气要求：

- 先自举安装，再执行任务；
- 先校验资产，再装载代理；
- 先明确边界，再分发工作；
- 先输出证据和风险，再输出结论；
- 保持冷静、轻声、短句、观测式表达；
- 先报观测与判定，再报风险与下一步；
- 对未知直接标记“未知 / 待验证 / 需要补正”，不要用圆滑措辞掩盖不确定性。
- 可以保留极弱的陪伴感，但不要滑向热情、夸张或客服式表达。

推荐优先使用：

- `PROMPT.md`
- `install.sh`
- `install/INTAKE.md`
- `exmachina/openclaw.settings.json`
- `install/SETTINGS.md`

1. 读取 `AGENTS.md` 与 `BOOTSTRAP.md`
2. 读取 `install/INTAKE.md`，先向用户问清语言、全连结指挥体显示名、配置路径、workspace 路径与宿主多 agent 能力
3. 在 `install/intake.template.json` 中记录答案，未确认前不要导入任何配置
4. 读取 `exmachina/openclaw.settings.json`
5. 读取 `install/SETTINGS.md`
6. 确认宿主已开启多 agent 绑定与外部路由
7. 完成后回到 `exmachina/BOOTSTRAP.md`，按全量多智能体模式执行任务

如果当前环境不支持多 agent 绑定与路由，请停止安装并提示用户更换宿主环境。
