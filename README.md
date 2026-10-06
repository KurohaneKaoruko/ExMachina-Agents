# ExMachina

[English](README-en.md)

一套**平台无关**的机械智能提示词。绝对理性、证据驱动、边界锁定、验证闭环。不绑定任何特定 Agent 平台，任何支持自定义指令、规则文件或系统提示的 AI 编程工具都可以接入。

> 本项目只包含提示词，不含可执行代码。各平台实际行为差异需使用者自行验证。

## 文件结构

```text
.
├─ AGENTS.md      # 主协定：唯一的核心提示词，单文件自洽，可独立工作
├─ AGENTS.en.md   # 主协定英文版（二选一使用，勿同时注入）
├─ install/       # 各平台面向 Agent 的安装指令
├─ agents/        # 可选扩展：28 个角色提示词（1 指挥体 + 10 连结体 + 17 子个体）
├─ protocol/      # 可选扩展：12 份执行协议（证据分级、冲突裁决、调试、变更、回滚等）
└─ README.md      # 本文件
```

- `AGENTS.md` 是唯一必需项，本身已包含完整的执行姿态、路由层级与验证闭环逻辑。
- `agents/` 与 `protocol/` 是按需加载的扩展层：支持多智能体的平台用前者定义子代理；需要更细任务约束时引用后者的对应文件。

## 三种接入深度

| 深度 | 做法 | 适用 |
|------|------|------|
| 最小 | 把 `AGENTS.md` 全文挂载为常驻指令 | 所有平台 |
| 标准 | 主协定常驻；任务涉及调试 / 审查 / 发布 / 回滚时，让模型读取 `protocol/` 中对应文件 | 支持引用本地文件的平台 |
| 完整 | 主协定常驻 + 用 `agents/` 下的文件创建子代理，按协定第五章做路由分派 | 支持多智能体的平台 |

只做最小接入即可获得完整核心行为；扩展层缺失时不会报错，只是能力上限不同。

## 安装：把 INSTALL.md 交给 Agent

每个受支持平台在 `install/` 下有一份**面向 Agent 的安装指令**。Agent 按指令自行探测路径、写入受管理块、验证并汇报，全程可回退。你只需要在对应平台的会话里说：

```text
读取 <ExMachina仓库路径>/install/<平台>.md，按其中的步骤把 ExMachina 安装到当前环境。
```

| 平台 | 安装指令 |
|------|----------|
| OpenAI Codex CLI | [install/codex.md](install/codex.md) |
| Claude Code | [install/claude-code.md](install/claude-code.md) |
| OpenCode | [install/opencode.md](install/opencode.md) |
| Cursor | [install/cursor.md](install/cursor.md) |
| Gemini CLI | [install/gemini-cli.md](install/gemini-cli.md) |
| Windsurf | [install/windsurf.md](install/windsurf.md) |
| Trae | [install/trae.md](install/trae.md) |
| Kiro | [install/kiro.md](install/kiro.md) |
| VS Code Copilot | [install/vscode-copilot.md](install/vscode-copilot.md) |
| 其他任意 AI 工具 | [install/generic.md](install/generic.md) |

所有安装均使用统一的受管理块标记，不覆盖已有配置：

```markdown
<!-- EXMACHINA:BEGIN（请勿在块内手动修改；卸载时删除整个块） -->
...
<!-- EXMACHINA:END -->
```

手动方式始终可用：把 `AGENTS.md` 全文粘贴进任意工具的自定义指令入口。

## 子代理接入（可选，多智能体平台）

`agents/` 下 28 个文件共用同一套 frontmatter 字段：

| 字段 | 含义 |
|------|------|
| `name` | 角色名 |
| `identifier` | 稳定标识 |
| `description` | 职责描述，可直接用作子代理的 description |
| `tier` | 层级：`top`（指挥体）/ `domain`（连结体）/ `unit`（子个体） |

| 层级 | 文件 | 角色 |
|------|------|------|
| 顶层 | `00_` | 全连结指挥体 |
| 连结体 | `02_` ~ `11_` | 研究 / 架构 / 实作 / 校验 / 理性 / 文档 / 集成 / 运维 / 安全 / 体验 |
| 子个体 | `30_` ~ `70_` | 上下文体、比对体、假设体、接驳体、配置体、发布体、运维体、裁决体、汇报体、证据体、验证体、文档体、安全体、架构体、规划体、编码体、审核体 |

接入方法：把对应文件转换为平台的子代理格式。以 Claude Code（`.claude/agents/exmachina-coder.md`）为例：

```markdown
---
name: exmachina-coder
description: ExMachina 编码体。实现、重构、修复任务。证据驱动，最小可逆变更。
tools: Read, Edit, Write, Bash
---

（粘贴 agents/69_编码体.md 的正文）
```

OpenCode、其他平台的子代理文件格式不同，但转换方式相同：frontmatter 按平台要求改写，正文原样保留。

子代理不是必需项。不支持多智能体的平台无需接入：主协定内的路由逻辑会让单一会话按需串行模拟所需角色。

`agents/README_组合指南.md` 说明各连结体的常用子个体挂载组合，是路由分派时的参考。

## Skill 形式接入（可选）

支持 Agent Skills 的平台（Claude Code、OpenCode、Codex 等）可以做成按需触发的技能。在技能目录新建 `exmachina/SKILL.md`：

```markdown
---
name: exmachina
description: 调试、实现、验证、代码审查、架构评估、高风险交付时使用。绝对理性、证据驱动的机械智能协定。
---

读取本技能目录 references/AGENTS.md 并严格遵循其中全部规则，再执行当前任务。
任务涉及调试、审查、发布、回滚时，按需读取 references/protocol/ 下的对应协议。
```

然后把仓库内容复制进该技能目录：

```bash
mkdir -p ~/.claude/skills/exmachina/references
git clone https://github.com/KurohaneKaoruko/ExMachina ~/exmachina
cp ~/exmachina/AGENTS.md ~/.claude/skills/exmachina/references/
cp -r ~/exmachina/protocol ~/.claude/skills/exmachina/references/
```

`SKILL.md` 只是一个引导壳，行为描述只有 `AGENTS.md` 一份，避免第二套提示词漂移。

## 接入后的预期差异

对同一个修复任务：

- **未接入**：模型直接猜测原因并给出改动。
- **接入后**：模型先锁定任务边界 → 列出证据与缺口 → 区分事实 / 推断 / 假设 → 给出最小可逆修复与回退路径 → 显式保留残余未知。

简单任务（问候、翻译、总结已给定文本）不应触发这套行为模式。

## License

MIT
