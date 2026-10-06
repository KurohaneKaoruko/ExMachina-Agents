# ExMachina — OpenCode 安装指令

> 用法：在 OpenCode 会话中对 Agent 说「读取 `<ExMachina仓库>/install/opencode.md` 并执行安装」，Agent 即可自主完成。

以下是给 Agent 的执行指令。

## 目标

把本仓库的 `AGENTS.md` 安装为 OpenCode 的常驻指令。OpenCode 读取项目根 `AGENTS.md`（或全局配置目录下的 `AGENTS.md`）。

## 步骤

1. **定位源**：本仓库根目录 = 本文件所在目录的上一级。读取 `<仓库根>/AGENTS.md` 全文备用。
2. **确定目标**：询问用户装全局还是当前项目。
   - 项目：`<当前项目>/AGENTS.md`
   - 全局：`~/.config/opencode/AGENTS.md`（Windows 为 `%USERPROFILE%\.config\opencode\AGENTS.md`；若该目录不存在，先确认用户的 OpenCode 全局配置目录实际位置）
3. **前置检查**：
   - 目标文件不存在 → 创建，写入受管理块。
   - 已含 `EXMACHINA:BEGIN` 标记 → 向用户确认更新或放弃。
   - 存在且无标记 → 末尾追加受管理块，保留原内容。
4. **执行安装**：写入如下结构（`...` 处为 `AGENTS.md` 全文原样嵌入）：

   ```markdown
   <!-- EXMACHINA:BEGIN（请勿在块内手动修改；卸载时删除整个块） -->
   ...
   <!-- EXMACHINA:END -->
   ```

5. **验证**：读回目标文件，确认标记成对、块内内容与源一致。
6. **汇报**：安装位置、追加还是新建、回退方法；提醒重启 OpenCode 会话后生效。

## 可选：子代理完整接入

仅当用户明确要求时执行。把 `agents/` 下 28 个角色文件转换为 `.opencode/agent/*.md`：

- frontmatter：`description` 取源文件 `description` 并注明层级（`tier`）；模式字段按 OpenCode 当前 agent 格式书写。
- 正文：源文件内容原样保留。
- 转换后逐个读回校验 frontmatter 可解析。

## 卸载

删除目标文件中的整个受管理块；若文件是安装时新建且删块后为空，则删除整个文件。子代理按安装清单删除对应文件。

## 偏差处理

若全局配置路径与实际不符，以 OpenCode 当前官方文档为准，向用户报告差异后再继续，不得静默猜测。
