# ExMachina — Gemini CLI 安装指令

> 用法：在 Gemini CLI 会话中对 Agent 说「读取 `<ExMachina仓库>/install/gemini-cli.md` 并执行安装」，Agent 即可自主完成。

以下是给 Agent 的执行指令。

## 目标

把本仓库的 `AGENTS.md` 接入 Gemini CLI 的常驻上下文。Gemini CLI 读取全局 `~/.gemini/GEMINI.md` 与项目根 `GEMINI.md`，支持 `@路径` import 语法。

## 方式 A：import 引用（推荐，更新方便）

1. **定位源**：本仓库根目录 = 本文件所在目录的上一级，取其绝对路径 `<仓库绝对路径>`。
2. **确定目标**：询问用户装全局还是当前项目。
   - 全局：`~/.gemini/GEMINI.md`
   - 项目：`<当前项目>/GEMINI.md`
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

当仓库未来可能被移动或删除时使用：把 `AGENTS.md` 全文原样嵌入受管理块内，其余步骤相同。

## 卸载

删除目标文件中的整个受管理块；若文件是安装时新建且删块后为空，则删除整个文件。

## 偏差处理

若 import 语法在用户版本中不生效，回退到方式 B，并向用户说明原因。路径与机制以 Gemini CLI 当前官方文档为准。
