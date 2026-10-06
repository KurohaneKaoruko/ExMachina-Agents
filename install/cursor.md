# ExMachina — Cursor 安装指令

> 用法：在 Cursor 会话中对 Agent 说「读取 `<ExMachina仓库>/install/cursor.md` 并执行安装」，Agent 即可自主完成。

以下是给 Agent 的执行指令。

## 目标

把本仓库的 `AGENTS.md` 安装为 Cursor 的常驻规则。使用项目级规则文件 `.cursor/rules/exmachina.mdc`，设为总是应用。

## 步骤

1. **定位源**：本仓库根目录 = 本文件所在目录的上一级。读取 `<仓库根>/AGENTS.md` 全文备用。
2. **前置检查**：
   - `.cursor/rules/exmachina.mdc` 不存在 → 直接创建。
   - 已存在 → 向用户确认覆盖或放弃（该文件名是 ExMachina 专用名，通常只会由本安装流程创建）。
3. **执行安装**：创建 `.cursor/rules/exmachina.mdc`，内容结构：

   ```markdown
   ---
   description: ExMachina 机械智能协定
   globs:
   alwaysApply: true
   ---

   （此处为 <仓库根>/AGENTS.md 全文原样嵌入，不得改写）
   ```

4. **验证**：读回文件，确认 frontmatter 可解析（三个字段齐全）、正文与源 `AGENTS.md` 一致。
5. **汇报**：文件位置、如何回退；提醒在 Cursor 设置 → Rules 中可见该规则，新会话生效。

## 说明

- Cursor 新版本也直接读取项目根 `AGENTS.md`。若用户偏好该方式，把 `<仓库根>/AGENTS.md` 全文复制到项目根 `AGENTS.md`（已有则用受管理块追加），其余流程相同。两种方式二选一，不要同时装。
- `alwaysApply: true` 表示常驻注入每条请求；若用户希望按需触发，可改 `description` 写触发场景、`alwaysApply: false`，并自行决定 `globs`。

## 卸载

删除 `.cursor/rules/exmachina.mdc`（或恢复被追加的项目根 `AGENTS.md` 受管理块）。

## 偏差处理

若用户 Cursor 版本的规则目录或 frontmatter 字段不同，以 Cursor 当前官方文档为准，报告差异后再继续。
