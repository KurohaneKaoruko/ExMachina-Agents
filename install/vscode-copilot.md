# ExMachina — VS Code Copilot 安装指令

> 用法：在 VS Code Copilot 会话中对 Agent 说「读取 `<ExMachina仓库>/install/vscode-copilot.md` 并执行安装」，Agent 即可自主完成。

以下是给 Agent 的执行指令。

## 目标

把本仓库的 `AGENTS.md` 安装为 VS Code Copilot 的常驻自定义指令。

## 步骤

1. **定位源**：本仓库根目录 = 本文件所在目录的上一级。读取 `<仓库根>/AGENTS.md` 全文备用。
2. **确定目标**：`<当前项目>/.github/copilot-instructions.md`。
3. **前置检查**：
   - 目标文件不存在 → 创建目录与文件，写入受管理块。
   - 已含 `EXMACHINA:BEGIN` 标记 → 向用户确认更新或放弃。
   - 存在且无标记 → 末尾追加受管理块，保留原内容。
4. **执行安装**：写入如下结构（`...` 处为 `AGENTS.md` 全文原样嵌入）：

   ```markdown
   <!-- EXMACHINA:BEGIN（请勿在块内手动修改；卸载时删除整个块） -->
   ...
   <!-- EXMACHINA:END -->
   ```

5. **验证**：读回目标文件，确认标记成对、块内内容与源一致。
6. **汇报**：安装位置、回退方法；提醒新会话生效。

## 可选：instructions 文件方式

若用户希望按文件路径条件生效而非常驻，可改用 `.github/instructions/exmachina.instructions.md`，frontmatter 写 `applyTo: "**"`（应用到全部文件）或按用户指定的 glob。正文同样嵌入 `AGENTS.md` 全文。两种方式二选一，不要同时装。

## 卸载

删除目标文件中的整个受管理块；若文件是安装时新建且删块后为空，则删除整个文件。

## 偏差处理

若 `copilot-instructions.md` 在用户版本中不受支持或路径不同，以 VS Code 当前官方文档为准，报告差异后再继续。
