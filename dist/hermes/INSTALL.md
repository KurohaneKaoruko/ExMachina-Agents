# ExMachina for Hermes Agent

ExMachina 提供面向 Hermes Agent（Nous Research）的安装面，把机械智能协定与技能体系接入 `~/.hermes/` 技能库。

原始安装文档地址：

- `https://raw.githubusercontent.com/KurohaneKaoruko/Ex-Machina/main/dist/hermes/INSTALL.md`

## 接入原理

Hermes Agent 的接入点与其他平台不同：

- 技能库以「目录 + `SKILL.md`」为单位，默认位于 `~/.hermes/skills/`，也可通过 `config.yaml` 的 `skills.external_dirs` 扫描外部目录
- `~/.hermes/SOUL.md` 是系统提示词的第一槽位，可承载全局身份与行为约束
- Hermes 是单主会话 agent：ExMachina 的多智能体协作在此以「单会话链路模拟」方式运行——由技能提示词按需读取 `references/agents/` 与 `references/protocol/` 中的角色与协议内容，在同一会话内按连结体路由推进

ExMachina 仓库根目录的 `skills/` 本身就是 Hermes 兼容的技能目录，因此接入只需二选一：

| 方式 | 机制 | 适用场景 |
|------|------|----------|
| external_dirs（推荐） | `config.yaml` 指向仓库 `skills/` | 仓库常驻本机，`git pull` 即可更新 |
| 复制安装 | 把技能目录复制进 `~/.hermes/skills/` | 仓库不常驻，或希望技能随 Hermes 目录整体迁移 |

两种方式不要同时使用，避免技能重复注册。

## 前置条件

- Hermes Agent 已安装并可用（`hermes --version` 可执行）
- 模型上下文满足 Hermes 的最低要求（≥ 64K）
- 已完成 `hermes setup`，至少配置一个模型 provider

## 快速接入（external_dirs）

```bash
git clone https://github.com/KurohaneKaoruko/Ex-Machina ~/exmachina
```

把以下内容合并进 `~/.hermes/config.yaml`（参考 `dist/hermes/config-snippet.yaml`）：

```yaml
skills:
  external_dirs:
    - ~/exmachina/skills
```

Windows 用户把路径改为实际检出位置，例如 `D:/exmachina/skills`。

## 快速接入（复制安装）

macOS / Linux / WSL2：

```bash
git clone https://github.com/KurohaneKaoruko/Ex-Machina ~/exmachina
mkdir -p ~/.hermes/skills
cp -r ~/exmachina/skills/exmachina-zh ~/exmachina/skills/exmachina-en \
      ~/exmachina/skills/using-exmachina ~/exmachina/skills/using-exmachina-zh \
      ~/exmachina/skills/using-exmachina-en ~/.hermes/skills/
```

Windows PowerShell：

```powershell
git clone https://github.com/KurohaneKaoruko/Ex-Machina "$HOME/exmachina"
New-Item -ItemType Directory -Force "$HOME/.hermes/skills" | Out-Null
Copy-Item -Recurse -Force `
  "$HOME/exmachina/skills/exmachina-zh",
  "$HOME/exmachina/skills/exmachina-en",
  "$HOME/exmachina/skills/using-exmachina",
  "$HOME/exmachina/skills/using-exmachina-zh",
  "$HOME/exmachina/skills/using-exmachina-en" `
  "$HOME/.hermes/skills/"
```

也可以不碰仓库，直接复制本安装面自带的副本：`dist/hermes/skills/` 下已包含同样的五个技能目录。

## （可选）注入全局身份约束

若希望 ExMachina 的执行姿态在所有会话生效，把仓库根 `AGENTS.md` 全文以受管理块形式追加进 `~/.hermes/SOUL.md`，并保留显式边界标记：

```markdown
# >>> ExMachina managed block >>>
（此处粘贴仓库根 AGENTS.md 全文）
# <<< ExMachina managed block <<<
```

不需要时删除该块即可还原，不影响 Hermes 自身内容。

## 验证安装

```bash
hermes skills list
```

确认输出包含 `exmachina-zh`（或 `using-exmachina-zh`）。然后在会话中用 `/skills` 复核技能已加载，并发起一个验收任务：

> 分析这个报错并给出修复路径，先证据后修复。

如果接入生效，agent 会先锁定任务边界、标注证据等级，再推进修复，而不是直接猜测原因。

## 更新与卸载

```bash
cd ~/exmachina && git pull --ff-only   # external_dirs 方式：拉取后即刻生效
```

复制安装方式需要重新执行复制命令覆盖旧技能。卸载：

- 删除 `~/.hermes/skills/` 下的 `exmachina-zh`、`exmachina-en`、`using-exmachina`、`using-exmachina-zh`、`using-exmachina-en`
- 移除 `config.yaml` 中对应的 `external_dirs` 条目
- 如注入过 SOUL.md 受管理块，一并移除

## 故障排查

- `hermes skills list` 看不到技能：确认 `external_dirs` 缩进正确（`skills:` 与 `external_dirs:` 两层），且目录下存在 `SKILL.md`；运行 `hermes config check` 复查配置。
- 复制安装后技能内容过期：重新复制覆盖，或切换到 external_dirs 方式。
- 上下文不足导致技能行为异常：更换满足 Hermes 最低上下文要求的模型。

## 相关入口

- 仓库主页：`https://github.com/KurohaneKaoruko/Ex-Machina`
- 配置片段：`dist/hermes/config-snippet.yaml`
- 仓库根 `AGENTS.md`：主协定全文
- 打包产物入口：`plugin.json`
