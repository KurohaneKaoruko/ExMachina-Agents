"""
ExMachina Dynamic Workflow Planner - 动态工作流生成器

提供动态工作流生成能力：
- 根据任务输入动态生成执行阶段
- 条件分支和并行任务识别
- 阶段自适应调整
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any


@dataclass
class TaskContext:
    """任务上下文"""
    task: str
    keywords: list[str] = field(default_factory=list)
    has_workspace: bool = False
    has_repo: bool = False
    has_tests: bool = False
    estimated_complexity: str = "medium"  # low, medium, high
    risk_level: str = "medium"  # low, medium, high


@dataclass
class ExecutionStage:
    """动态执行阶段"""
    name: str
    description: str
    parallel_with: list[str] = field(default_factory=list)
    conditional: bool = False
    condition: str = ""
    retry_on_fail: bool = False
    max_retries: int = 1


class DynamicWorkflowPlanner:
    """动态工作流规划器"""
    
    # 阶段模板库
    STAGE_TEMPLATES = {
        # 基础阶段
        "analyze": {
            "name": "任务分析",
            "description": "分析任务需求、约束和边界",
            "always": True
        },
        "plan": {
            "name": "规划方案", 
            "description": "制定具体执行方案",
            "always": True
        },
        "execute": {
            "name": "执行实施",
            "description": "按方案执行任务",
            "always": True
        },
        "validate": {
            "name": "验证确认",
            "description": "验证执行结果是否符合预期",
            "conditional": True
        },
        "document": {
            "name": "文档输出",
            "description": "生成文档和说明",
            "keywords": ["文档", "readme", "说明", "教程"]
        },
        "test": {
            "name": "测试验证",
            "keywords": ["测试", "test", "验证", "校验"],
            "requires": "tests"
        },
        "deploy": {
            "name": "部署上线",
            "keywords": ["部署", "发布", "上线", "deploy"]
        },
        "review": {
            "name": "代码审查",
            "keywords": ["review", "审查", "pr", "merge"]
        },
        "security_check": {
            "name": "安全检查",
            "keywords": ["安全", "漏洞", "审计", "security"]
        },
        "optimize": {
            "name": "性能优化",
            "keywords": ["优化", "性能", "performance", "优化"]
        },
        "handoff": {
            "name": "知识交接",
            "description": "沉淀任务成果和经验",
            "always": True
        }
    }
    
    # 并行可执行阶段
    PARALLEL_COMPATIBLE = {
        ("analyze", "analyze"),  # 自身
        ("document", "document"),
        ("test", "validate"),
        ("security_check", "optimize"),
    }
    
    def __init__(self, profile: dict[str, Any] | None = None):
        self.profile = profile or {}
        
    def analyze_task(self, task: str, workspace: Any = None, repo: Any = None) -> TaskContext:
        """分析任务上下文"""
        keywords = self._extract_keywords(task)
        
        has_workspace = workspace is not None
        has_repo = repo is not None
        has_tests = has_workspace and self._check_tests_exist(workspace)
        
        # 评估复杂度
        complexity = self._assess_complexity(task, keywords)
        
        # 评估风险
        risk = self._assess_risk(task, keywords)
        
        return TaskContext(
            task=task,
            keywords=keywords,
            has_workspace=has_workspace,
            has_repo=has_repo,
            has_tests=has_tests,
            estimated_complexity=complexity,
            risk_level=risk
        )
    
    def _extract_keywords(self, task: str) -> list[str]:
        """提取任务关键词"""
        # 常见关键词模式
        keyword_patterns = [
            r"测试|test|验证|校验",
            r"文档|readme|说明|教程|手册",
            r"部署|发布|上线|deploy|release",
            r"调研|分析|研究|调研",
            r"架构|设计|重构",
            r"实现|开发|编码|写代码",
            r"安全|审计|漏洞|权限",
            r"优化|性能|效率",
            r"修复|bug|fix|问题",
            r"审查|review|pr|merge"
        ]
        
        keywords = []
        for pattern in keyword_patterns:
            if re.search(pattern, task, re.IGNORECASE):
                keywords.append(pattern.replace("|", ","))
                
        return keywords
    
    def _check_tests_exist(self, workspace: Any) -> bool:
        """检查是否存在测试"""
        if workspace and hasattr(workspace, "test_paths"):
            return len(workspace.test_paths) > 0
        return False
    
    def _assess_complexity(self, task: str, keywords: list[str]) -> str:
        """评估任务复杂度"""
        score = 0
        
        # 长度因素
        if len(task) > 500:
            score += 2
        elif len(task) > 200:
            score += 1
            
        # 多关键词
        if len(keywords) > 3:
            score += 2
        elif len(keywords) > 1:
            score += 1
            
        # 高风险关键词
        high_risk = ["重构", "迁移", "安全", "部署", "架构"]
        if any(kw in high_risk for kw in keywords):
            score += 1
            
        if score >= 4:
            return "high"
        elif score >= 2:
            return "medium"
        return "low"
    
    def _assess_risk(self, task: str, keywords: list[str]) -> str:
        """评估任务风险"""
        high_risk_keywords = [
            "删除", "drop", "rm", "迁移", "migrate",
            "重构", "refactor", "安全", "权限",
            "部署", "生产", "线上的"
        ]
        
        if any(kw in high_risk_keywords for kw in keywords):
            return "high"
            
        return "medium"
    
    def generate_workflow(self, context: TaskContext) -> list[ExecutionStage]:
        """生成动态工作流"""
        stages = []
        
        # 始终包含的阶段
        stages.append(self._create_stage("analyze", context))
        stages.append(self._create_stage("plan", context))
        
        # 根据上下文动态添加阶段
        if context.has_tests or "test" in context.keywords:
            stages.append(self._create_stage("test", context))
            stages.append(self._create_stage("validate", context))
            
        if "document" in context.keywords:
            stages.append(self._create_stage("document", context))
            
        if "deploy" in context.keywords:
            stages.append(self._create_stage("deploy", context))
            
        if "review" in context.keywords:
            stages.append(self._create_stage("review", context))
            
        if "security" in context.keywords:
            stages.append(self._create_stage("security_check", context))
            
        if "optimize" in context.keywords:
            stages.append(self._create_stage("optimize", context))
            
        # 高复杂度任务增加验证
        if context.estimated_complexity == "high":
            # 添加额外的验证阶段
            validate_stage = self._create_stage("validate", context)
            validate_stage.retry_on_fail = True
            validate_stage.max_retries = 2
            stages.append(validate_stage)
            
        # 高风险任务增加审查
        if context.risk_level == "high":
            review_stage = self._create_stage("review", context)
            review_stage.conditional = True
            review_stage.condition = "执行结果存在风险"
            stages.append(review_stage)
            
        # 始终包含交接阶段
        stages.append(self._create_stage("handoff", context))
        
        # 规划并行执行
        stages = self._plan_parallel_execution(stages)
        
        return stages
    
    def _create_stage(self, template_key: str, context: TaskContext) -> ExecutionStage:
        """从模板创建阶段"""
        template = self.STAGE_TEMPLATES.get(template_key, {})
        
        return ExecutionStage(
            name=template.get("name", template_key),
            description=template.get("description", ""),
            conditional=template.get("conditional", False),
            retry_on_fail=context.risk_level == "high",
            max_retries=2 if context.risk_level == "high" else 1
        )
    
    def _plan_parallel_execution(self, stages: list[ExecutionStage]) -> list[ExecutionStage]:
        """规划可并行执行的阶段"""
        for i, stage1 in enumerate(stages):
            for stage2 in stages[i+1:]:
                if (stage1.name, stage2.name) in self.PARALLEL_COMPATIBLE:
                    stage1.parallel_with.append(stage2.name)
                    
        return stages
    
    def export_workflow_json(self, stages: list[ExecutionStage]) -> dict[str, Any]:
        """导出为 OpenClaw 可用的 JSON 格式"""
        return {
            "version": "1.0",
            "stages": [
                {
                    "name": s.name,
                    "description": s.description,
                    "parallel_with": s.parallel_with,
                    "conditional": s.conditional,
                    "condition": s.condition,
                    "retry_on_fail": s.retry_on_fail,
                    "max_retries": s.max_retries
                }
                for s in stages
            ]
        }


def create_dynamic_workflow(
    task: str,
    profile: dict[str, Any] | None = None,
    workspace: Any = None,
    repo: Any = None
) -> dict[str, Any]:
    """创建动态工作流的便捷函数"""
    planner = DynamicWorkflowPlanner(profile)
    context = planner.analyze_task(task, workspace, repo)
    stages = planner.generate_workflow(context)
    return planner.export_workflow_json(stages)
