# ExMachina — Kiro 安装指令

> 用法：在 Kiro 会话中对 Agent 说「读取 `<ExMachina仓库>/install/kiro.md` 并执行安装」，Agent 即可自主完成。

以下是给 Agent 的执行指令。

## 目标

把本仓库的 `AGENTS.md` 安装为 Kiro 的常驻 steering 文件。

## 步骤

1. **定位源**：本仓库根目录 = 本文件所在目录的上一级。读取 `<仓库根>/AGENTS.md` 全文备用。
2. **确定目标**：`<当前项目>/.kiro/steering/exmachina.md`。
3. **前置检查**：
   - 目标文件不存在 → 创建目录与文件。
   - 已存在 → 该文件名是 ExMachina 专用名，向用户确认覆盖或放弃。
4. **执行安装**：写入：

   ```markdown
   ---
   inclusion: always
   ---

   （此处为 <仓库根>/AGENTS.md 全文原样嵌入，不得改写）
   ```

5. **验证**：读回文件，确认 frontmatter 可解析（`inclusion: always`）、正文与源 `AGENTS.md` 一致。
6. **汇报**：文件位置、回退方法；提醒 Kiro 新会话生效。

## 说明

`inclusion: always` 表示每次会话常驻注入。若用户希望按需加载，Kiro steering 另有 `fileMatch` / 手动引入模式，按用户当前版本文档调整，正文不变。

## 卸载

删除 `.kiro/steering/exmachina.md`。

## 偏差处理

若 steering 机制或 frontmatter 字段与实际不符，以 Kiro 当前官方文档为准，报告差异后再继续。
