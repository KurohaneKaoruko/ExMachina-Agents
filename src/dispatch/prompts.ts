import {
  bundlePath,
  codexSurfaceDir,
  copyDirectory,
  copyMarkdownFilesWithTransform,
  copySingleSourceToTargets,
  kiroSurfaceDir,
  prependAgentExecutionHeader,
  promptRoot,
  readText,
  removeDir,
  renderTemplate,
  templateValues,
  vscodeSurfaceDir,
  writeContentToTargets,
  writeText
} from "./lib";

export function buildSkills(): void {
  const zhSkill = renderTemplate("src/templates/zh-CN/exmachina.skill.md", templateValues);
  const enSkill = renderTemplate("src/templates/en-US/exmachina.skill.md", templateValues);
  const usingZhSkill = renderTemplate("src/templates/zh-CN/using-exmachina.skill.md", templateValues);
  const usingEnSkill = renderTemplate("src/templates/en-US/using-exmachina.skill.md", templateValues);

  writeContentToTargets(zhSkill, [
    bundlePath("skills", "exmachina-zh", "SKILL.md"),
    bundlePath(codexSurfaceDir, "exmachina", "SKILL.md"),
    bundlePath(kiroSurfaceDir, "skills", "exmachina", "SKILL.md"),
    bundlePath(vscodeSurfaceDir, "prompts", "exmachina.prompt.md"),
    bundlePath(vscodeSurfaceDir, "instructions", "exmachina.instructions.md"),
    bundlePath(kiroSurfaceDir, "steering", "exmachina.md")
  ]);

  writeContentToTargets(enSkill, [
    bundlePath("skills", "exmachina-en", "SKILL.md"),
    bundlePath(codexSurfaceDir, "exmachina-en", "SKILL.md"),
    bundlePath(kiroSurfaceDir, "skills", "exmachina-en", "SKILL.md"),
    bundlePath(vscodeSurfaceDir, "prompts", "exmachina.en.prompt.md"),
    bundlePath(vscodeSurfaceDir, "instructions", "exmachina.en.instructions.md"),
    bundlePath(kiroSurfaceDir, "steering", "exmachina.en.md")
  ]);

  writeContentToTargets(usingZhSkill, [
    bundlePath("skills", "using-exmachina", "SKILL.md"),
    bundlePath("skills", "using-exmachina-zh", "SKILL.md")
  ]);

  writeContentToTargets(usingEnSkill, [
    bundlePath("skills", "using-exmachina-en", "SKILL.md")
  ]);

  for (const targetRoot of [
    bundlePath("skills", "exmachina-zh", "references"),
    bundlePath(codexSurfaceDir, "exmachina", "references"),
    bundlePath(kiroSurfaceDir, "skills", "exmachina", "references")
  ]) {
    // 先清理再生目录，避免源文件删除后旧产物残留累积
    removeDir(targetRoot);
    copyDirectory(`${promptRoot}/protocol`, `${targetRoot}/protocol`);
    copyMarkdownFilesWithTransform(`${promptRoot}/agents`, `${targetRoot}/agents`, (content) =>
      prependAgentExecutionHeader(content)
    );
  }

  for (const targetRoot of [
    bundlePath("skills", "exmachina-en", "references"),
    bundlePath(codexSurfaceDir, "exmachina-en", "references"),
    bundlePath(kiroSurfaceDir, "skills", "exmachina-en", "references")
  ]) {
    removeDir(targetRoot);
  }
}

export function buildCommands(): void {
  const zhCommand = renderTemplate("src/templates/zh-CN/ex.command.md", templateValues);
  const enCommand = renderTemplate("src/templates/en-US/ex.command.md", templateValues);

  writeContentToTargets(zhCommand, [
    bundlePath("commands", "ex.md"),
    bundlePath("commands", "excodex.md"),
    bundlePath("commands", "exclaude.md")
  ]);

  writeContentToTargets(enCommand, [
    bundlePath("commands", "ex.en.md"),
    bundlePath("commands", "excodex.en.md"),
    bundlePath("commands", "exclaude.en.md")
  ]);
}

export function buildAgents(): void {
  // 先清理再生目录，避免源文件删除后旧产物残留累积
  removeDir(bundlePath("agents"));
  copyMarkdownFilesWithTransform(`${promptRoot}/agents`, bundlePath("agents"), (content) =>
    prependAgentExecutionHeader(content)
  );
}

export function buildPromptSurfaces(): void {
  const agentsBodyEn = renderTemplate("src/templates/en-US/agents.md", templateValues);
  copySingleSourceToTargets("src/prompt/AGENTS.md", [
    "AGENTS.md",
    bundlePath(codexSurfaceDir, "AGENTS.md")
  ]);
  writeText("AGENTS.en.md", agentsBodyEn);
  writeText(bundlePath(codexSurfaceDir, "AGENTS.en.md"), agentsBodyEn);

  const zhRulesBody = readText("src/prompt/RULES.md");
  const enRulesBody = renderTemplate("src/templates/en-US/rules.md", templateValues);

  const cursorRuleBodyZh = [
    "---",
    "description: ExMachina 机械智能规则",
    "globs:",
    "alwaysApply: true",
    "---",
    "",
    zhRulesBody
  ].join("\n");
  const cursorRuleBodyEn = [
    "---",
    "description: ExMachina mechanical-intelligence rules",
    "globs:",
    "alwaysApply: true",
    "---",
    "",
    enRulesBody
  ].join("\n");
  writeText("dist/cursor/rules/exmachina.mdc", cursorRuleBodyZh);
  writeText("dist/cursor/rules/exmachina-en.mdc", cursorRuleBodyEn);

  writeText(bundlePath(kiroSurfaceDir, "steering", "exmachina.md"), zhRulesBody);
  writeText(bundlePath(kiroSurfaceDir, "steering", "exmachina.en.md"), enRulesBody);
}
