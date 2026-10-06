# ExMachina — Claude Code 安装指令

> 用法：在 Claude Code 会话中对 Agent 说「读取 `<ExMachina仓库>/install/claude-code.md` 并执行安装」，Agent 即可自主完成。

以下是给 Agent 的执行指令。

## 目标

把本仓库的 `AGENTS.md` 接入 Claude Code 的常驻记忆。Claude Code 读取项目根 `CLAUDE.md` 或全局 `~/.claude/CLAUDE.md`，并支持 `@路径` import 语法。

## 方式 A：import 引用（推荐，更新方便）

1. **定位源**：本仓库根目录 = 本文件所在目录的上一级，取其绝对路径 `<仓库绝对路径>`。
2. **确定目标**：询问用户装全局还是当前项目。
   - 全局：`~/.claude/CLAUDE.md`
   - 项目：`<当前项目>/CLAUDE.md`
3. **前置检查**：
   - 目标文件不存在 → 创建，写入受管理块。
   - 已含 `EXMACHINA:BEGIN` 标记 → 向用户确认更新或放弃。
   - 存在且无标记 → 末尾追加受管理块，保留原内容。
4. **执行安装**：写入：

   ```markdown
   <!-- EXMACHINA:BEGIN（请勿在块内手动修改；卸载时删除整个块） -->
   @<仓库绝对路径>/AGENTS.md
   <!-- EXMACHINA:END -->
   ```

5. **验证**：读回目标文件确认标记成对、import 路径指向的文件真实存在。

## 方式 B：全文嵌入

当仓库未来可能被移动或删除时使用：把 `<仓库根>/AGENTS.md` 全文原样嵌入受管理块内（同上方块结构），其余步骤相同。

## 可选：子代理完整接入

仅当用户明确要求时执行。把 `agents/` 下 28 个角色文件转换为 `.claude/agents/*.md` 或 `~/.claude/agents/*.md`：

- frontmatter：`name` 取源文件 `identifier` 字段；`description` 取源文件 `description` 并注明层级（`tier`）；`tools` 按角色职能选择，编码/验证类给 `Read, Edit, Write, Bash`，分析类只给 `Read, Grep, Glob`。
- 正文：源文件内容原样保留。
- 转换后逐个读回校验 frontmatter 可解析。

## 卸载

- 方式 A/B：删除目标文件中的整个受管理块。
- 子代理：删除安装时创建的 `.claude/agents/` 下对应文件，只删安装清单内确认过的文件。

## 偏差处理

若 `@` import 在用户版本中不生效（表现为会话内找不到协定内容），回退到方式 B 全文嵌入，并向用户说明原因。
