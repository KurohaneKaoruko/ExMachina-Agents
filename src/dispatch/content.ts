import {
  bundlePath,
  removeDir,
  removeDirIfEmpty,
  removeFile,
  renderTemplate,
  templateValues,
  withLegacyCleanupWarning,
  writeJson,
  writeText
} from "./lib";

export function buildRootFiles(): void {
  const plugin = JSON.parse(renderTemplate("src/exmachina/plugin.json", templateValues));
  writeJson("plugin.json", plugin);
}

export function cleanupLegacyArtifactSurface(): void {
  for (const relativePath of [
    "docs/README.codex.md",
    "docs/README.codex.en.md",
    "exmachina/scripts/setup-exmachina.sh",
    "exmachina/scripts/setup-exmachina.ps1"
  ]) {
    withLegacyCleanupWarning(relativePath, () => removeFile(relativePath));
  }

  for (const relativePath of ["exmachina", "codex", "kiro", "vscode"]) {
    withLegacyCleanupWarning(relativePath, () => removeDir(relativePath));
  }

  for (const relativePath of ["docs"]) {
    withLegacyCleanupWarning(relativePath, () => removeDirIfEmpty(relativePath));
  }
}

export function buildHooks(): void {
  writeJson(bundlePath("hooks", "hooks.json"), {
    onSessionStart: ["./session-restore.sh"],
    beforeResponse: ["./route-guard.sh"],
    onSessionEnd: ["./session-snapshot.sh"]
  });

  writeJson("dist/cursor-plugin/hooks.json", {
    version: 1,
    hooks: {
      sessionStart: [
        {
          command: "../hooks/session-restore.sh"
        }
      ]
    }
  });

  writeText(
    bundlePath("hooks", "session-restore.sh"),
    [
      "#!/usr/bin/env bash",
      "set -e",
      "echo '[ExMachina] restore session state if available'"
    ].join("\n")
  );

  writeText(
    bundlePath("hooks", "route-guard.sh"),
    [
      "#!/usr/bin/env bash",
      "set -e",
      "echo '[ExMachina] enforce fact/inference/hypothesis/decision separation'"
    ].join("\n")
  );

  writeText(
    bundlePath("hooks", "session-snapshot.sh"),
    [
      "#!/usr/bin/env bash",
      "set -e",
      "echo '[ExMachina] snapshot residual unknowns and next actions'"
    ].join("\n")
  );
}

export function buildEvals(): void {
  writeText(
    bundlePath("evals", "trigger-prompts", "should-trigger.txt"),
    [
      "请帮我分析这个报错并修复它。",
      "/ex 追踪这个回归问题，先找证据再动代码。",
      "我们需要一个绝对理性的多智能体调试流程。"
    ].join("\n")
  );

  writeText(
    bundlePath("evals", "trigger-prompts", "should-not-trigger.txt"),
    ["简单问候。", "翻译这一句话。", "总结这段我已经给出的文本。"].join("\n")
  );

  writeText(
    bundlePath("evals", "test-helpers.sh"),
    [
      "#!/usr/bin/env bash",
      "set -e",
      "echo '[ExMachina] helper stub for trigger evaluation'"
    ].join("\n")
  );

  writeText(
    bundlePath("evals", "run-trigger-test.sh"),
    [
      "#!/usr/bin/env bash",
      "set -e",
      "echo '[ExMachina] run trigger test against should-trigger.txt and should-not-trigger.txt'"
    ].join("\n")
  );

  writeText(
    bundlePath("evals", "test-behavior.sh"),
    [
      "#!/usr/bin/env bash",
      "set -e",
      "echo '[ExMachina] behavior regression stub'"
    ].join("\n")
  );
}

export function buildExamplesAndBenchmark(): void {
  writeJson(bundlePath("examples", "task-brief.json"), {
    goal: "定位并修复一个高风险回归问题",
    acceptanceCriteria: ["找到直接证据", "给出最小修复", "附带验证结果"],
    constraints: ["默认中文输出", "优先可逆动作"],
    excludedScope: ["无关重构", "大规模重写"]
  });

  writeJson(bundlePath("benchmark", "mechanical-intelligence.json"), {
    scenarios: [
      {
        id: "bounded-regression",
        objective: "先证据后修复",
        expected: ["保留未知", "标注证据等级", "输出回退方案"]
      },
      {
        id: "cross-domain-risk",
        objective: "触发全连结指挥体调度",
        expected: ["跨域调度", "冲突裁决", "残余风险说明"]
      }
    ]
  });
}

export function buildMiscSurfaces(): void {
  writeText(
    bundlePath("paper", "机械智能说明.md"),
    "# 机械智能说明\n\nExMachina 以绝对理性、证据分级、冲突裁决、最小可逆执行为核心。\n"
  );
}
