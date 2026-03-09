# Issue: OpenClaw Skill 深度集成缺失

## 问题描述

当前 ExMachina 的 `skill_catalog` 只是记录了 skill 路径，但并未真正与 OpenClaw 的 skill 系统深度集成。

### 现状
- `default_profile.json` 中有 `skill_catalog` 配置
- `recommended_skill` 字段存在于每个 LinkBody 中
- 但没有实际的 skill 安装、绑定、激活逻辑

### 期望能力
1. **自动安装 Skill**: 根据 `skill_catalog` 自动调用 `clawdhub` 安装依赖
2. **Skill 动态绑定**: 根据任务上下文动态选择启用哪些 skill
3. **Skill 状态感知**: 在运行时检查 skill 是否已安装、版本是否匹配
4. **Skill 生命周期**: 安装/更新/卸载与项目生命周期绑定

### 价值
- 减少手动配置
- 确保运行时 skill 可用性
- 与 OpenClaw 生态深度整合

## 建议方案

在 `exmachina/` 中新增 `skill_manager.py`:
- `ensure_skills_installed()` - 确保所有依赖 skill 已安装
- `bind_skills_to_task()` - 根据任务上下文绑定相关 skill
- `check_skill_compatibility()` - 检查版本兼容性

---
