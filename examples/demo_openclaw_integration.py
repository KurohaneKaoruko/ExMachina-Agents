#!/usr/bin/env python3
"""
ExMachina x OpenClaw 深度集成演示
"""
import json
from exmachina.skill_manager import SkillManager, load_skill_manager
from exmachina.dynamic_planner import create_dynamic_workflow
from exmachina.memory_integrator import create_memory_integrator, TaskSummary


def demo_skill_manager():
    print("\n=== 1. Skill Manager 演示 ===")
    sm = load_skill_manager()
    required = sm.get_required_skills(["实作连结体", "理性连结体"])
    print(f"需要的 Skills: {required}")
    bindings = sm.generate_skill_bindings(
        link_body_names=["实作连结体"],
        task_context={"keywords": ["实现", "测试"]}
    )
    print(f"生成的 Skill 绑定数: {len(bindings['skills'])}")


def demo_dynamic_planner():
    print("\n=== 2. Dynamic Planner 演示 ===")
    tasks = [
        "实现一个用户认证功能，包含注册、登录、登出",
        "调研当前项目的技术栈并输出架构分析报告",
    ]
    for task in tasks:
        print(f"\n任务: {task}")
        workflow = create_dynamic_workflow(task)
        stages = workflow.get("stages", [])
        print(f"生成 {len(stages)} 个阶段: {[s['name'] for s in stages]}")


def demo_memory_integrator():
    print("\n=== 3. Memory Integrator 演示 ===")
    import tempfile
    with tempfile.TemporaryDirectory() as tmpdir:
        mi = create_memory_integrator(tmpdir)
        summary = TaskSummary(
            task_id="demo-001",
            title="用户认证功能实现",
            link_bodies=["实作连结体", "校验连结体"],
            key_decisions=["选择 JWT", "密码 bcrypt 加密"],
            lessons_learned=["需要 token 刷新"],
            references=["https://docs.example.com"],
            todos=["实现 token 刷新"],
            status="completed"
        )
        mi.write_task_summary(summary)
        entries = mi.read_memory()
        print(f"写入 Memory 条目数: {len(entries)}")


if __name__ == "__main__":
    print("ExMachina x OpenClaw 深度集成演示")
    demo_skill_manager()
    demo_dynamic_planner()
    demo_memory_integrator()
    print("\n演示完成!")
