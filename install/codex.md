# ExMachina — OpenAI Codex CLI 安装指令

> 用法：在 Codex CLI 会话中对 Agent 说「读取 `<ExMachina仓库>/install/codex.md` 并执行安装」，Agent 即可自主完成。

以下是给 Agent 的执行指令。

## 目标

把本仓库的 `AGENTS.md` 安装为 Codex 的常驻指令。Codex 会合并读取全局 `~/.codex/AGENTS.md` 与项目根 `AGENTS.md`。

## 步骤

1. **定位源**：本仓库根目录 = 本文件所在目录的上一级。读取 `<仓库根>/AGENTS.md` 全文备用。
2. **确定目标**：询问用户装全局还是当前项目。
   - 全局：`~/.codex/AGENTS.md`（Windows 通常为 `C:\Users\<用户名>\.codex\AGENTS.md`）
   - 项目：`<当前项目>/AGENTS.md`
3. **前置检查**：
   - 目标文件不存在 → 直接创建，写入受管理块。
   - 目标文件存在且已含 `EXMACHINA:BEGIN` 标记 → 向用户确认：更新块内容或放弃。
   - 目标文件存在且无标记 → 保留原内容，在文件末尾追加受管理块。
4. **执行安装**：写入如下结构（`...` 处为 `AGENTS.md` 全文原样嵌入，不得改写）：

   ```markdown
   <!-- EXMACHINA:BEGIN（请勿在块内手动修改；卸载时删除整个块） -->
   ...
   <!-- EXMACHINA:END -->
   ```

5. **验证**：读回目标文件，确认开始/结束标记成对、块内内容与源 `AGENTS.md` 一致。
6. **汇报**：告知用户安装位置、追加还是新建、如何回退；提醒重启 Codex 会话后生效。

## 可选：Skill 方式

若用户 Codex 版本支持 skills（`~/.codex/skills/`），可改为把 `AGENTS.md` 与 `protocol/` 复制为一个技能目录，用一个只含引导语的 `SKILL.md` 按需触发。仅当用户明确要求时执行。

## 卸载

删除目标文件中的整个受管理块；若文件是安装时新建且删除块后为空，则删除整个文件。

## 偏差处理

若实际环境中路径不符或 Codex 行为与本指令冲突，以 Codex 当前官方文档为准，停止动作并向用户如实报告差异，不得静默猜测路径。
