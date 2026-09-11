import {
  bundlePath,
  codexSurfaceDir,
  copyDirectory,
  getCommonPluginMetadata,
  hermesSurfaceDir,
  packageMetadata,
  renderTemplate,
  removeDir,
  repositoryUrl,
  templateValues,
  writeJson,
  writeText
} from "./lib";

export function buildClaudePluginSurface(): void {
  const installBodyZh = renderTemplate("src/templates/zh-CN/claude.install.md", templateValues);
  const installBodyEn = renderTemplate("src/templates/en-US/claude.install.md", templateValues);
  const rootPlugin = {
    ...getCommonPluginMetadata(),
    defaultLanguage: "zh-CN",
    entrypoints: {
      commands: "../commands",
      skills: "../skills",
      agents: "../agents",
      hooks: "../hooks"
    }
  };
  const marketplace = {
    name: "exmachina-dev",
    description: "Development marketplace for ExMachina mechanical-intelligence surfaces",
    owner: {
      name: "ExMachina"
    },
    plugins: [
      {
        name: "exmachina",
        description: "Evidence-bound mechanical-intelligence operating layer for Claude Code.",
        version: packageMetadata.version,
        source: "./",
        author: {
          name: "ExMachina"
        }
      }
    ]
  };

  writeJson("dist/claude-plugin/plugin.json", rootPlugin);
  writeJson("dist/claude-plugin/marketplace.json", marketplace);
  writeText("dist/claude-plugin/INSTALL.md", installBodyZh);
  writeText("dist/claude-plugin/INSTALL.en.md", installBodyEn);
}

export function buildCodexSurface(): void {
  const installBodyZh = renderTemplate("src/templates/zh-CN/codex.install.md", templateValues);
  const installBodyEn = renderTemplate("src/templates/en-US/codex.install.md", templateValues);
  const readmeBodyZh = renderTemplate("src/templates/zh-CN/codex.readme.md", templateValues);
  const readmeBodyEn = renderTemplate("src/templates/en-US/codex.readme.md", templateValues);
  const bashInstaller = renderTemplate("src/templates/zh-CN/setup-exmachina.sh", templateValues);
  const powerShellInstaller = renderTemplate("src/templates/zh-CN/setup-exmachina.ps1", templateValues);

  writeText("scripts/setup-exmachina.sh", bashInstaller);
  writeText("scripts/setup-exmachina.ps1", powerShellInstaller);
  writeText(bundlePath(codexSurfaceDir, "INSTALL.md"), installBodyZh);
  writeText(bundlePath(codexSurfaceDir, "INSTALL.en.md"), installBodyEn);
  writeText(bundlePath(codexSurfaceDir, "README.md"), readmeBodyZh);
  writeText(bundlePath(codexSurfaceDir, "README.en.md"), readmeBodyEn);
}

export function buildCursorSurface(): void {
  const installBodyZh = renderTemplate("src/templates/zh-CN/cursor.install.md", templateValues);
  const installBodyEn = renderTemplate("src/templates/en-US/cursor.install.md", templateValues);
  const rootPlugin = {
    ...getCommonPluginMetadata(),
    skills: "../skills/",
    agents: "../agents/",
    commands: "../commands/",
    hooks: "./hooks.json"
  };

  writeJson("dist/cursor-plugin/plugin.json", rootPlugin);
  writeText("dist/cursor-plugin/INSTALL.md", installBodyZh);
  writeText("dist/cursor-plugin/INSTALL.en.md", installBodyEn);
}

export function buildOpenCodeSurface(): void {
  const installBodyZh = renderTemplate("src/templates/zh-CN/opencode.install.md", templateValues);
  const installBodyEn = renderTemplate("src/templates/en-US/opencode.install.md", templateValues);
  const pluginSource = [
    "import fs from \"node:fs\";",
    "import os from \"node:os\";",
    "import path from \"node:path\";",
    "import { fileURLToPath } from \"node:url\";",
    "",
    "const __dirname = path.dirname(fileURLToPath(import.meta.url));",
    "",
    "function stripFrontmatter(content) {",
    "  const match = content.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/);",
    "  if (!match) {",
    "    return content;",
    "  }",
    "  return match[2];",
    "}",
    "",
    "function normalizePath(input, homeDir) {",
    "  if (!input || typeof input !== \"string\") {",
    "    return null;",
    "  }",
    "  let value = input.trim();",
    "  if (!value) {",
    "    return null;",
    "  }",
    "  if (value === \"~\") {",
    "    return homeDir;",
    "  }",
    "  if (value.startsWith(\"~/\")) {",
    "    value = path.join(homeDir, value.slice(2));",
    "  }",
    "  return path.resolve(value);",
    "}",
    "",
    "function resolveBootstrapName() {",
    "  const forced = `${process.env.EXMACHINA_LANG ?? process.env.EXMACHINA_LANGUAGE ?? \"\"}`.toLowerCase();",
    "  if (forced.startsWith(\"zh\")) {",
    "    return \"using-exmachina-zh\";",
    "  }",
    "  if (forced.startsWith(\"en\")) {",
    "    return \"using-exmachina-en\";",
    "  }",
    "  const locale = `${process.env.LANG ?? process.env.LC_ALL ?? \"\"}`.toLowerCase();",
    "  return locale.startsWith(\"zh\") ? \"using-exmachina-zh\" : \"using-exmachina-en\";",
    "}",
    "",
    "function getBootstrapContent(skillsDir, configDir) {",
    "  const bootstrapName = resolveBootstrapName();",
    "  const skillPath = path.join(skillsDir, bootstrapName, \"SKILL.md\");",
    "  if (!fs.existsSync(skillPath)) {",
    "    return null;",
    "  }",
    "  const content = stripFrontmatter(fs.readFileSync(skillPath, \"utf8\"));",
    "  const toolMapping = [",
    "    \"Tool mapping for OpenCode:\",",
    "    \"- Use OpenCode native shell, file, search, and edit tools when names differ.\",",
    "    \"- Treat the injected ExMachina bootstrap as already loaded; do not reload it redundantly.\",",
    "    `- ExMachina shared skills are registered from ${skillsDir}.`,",
    "    configDir ? `- OpenCode config directory resolved to ${configDir}.` : \"\"",
    "  ].filter(Boolean).join(\"\\n\");",
    "  return [",
    "    \"You have ExMachina.\",",
    "    \"IMPORTANT: the selected using-exmachina bootstrap is already injected below. Do not reload it redundantly.\",",
    "    content.trim(),",
    "    toolMapping",
    "  ].join(\"\\n\\n\");",
    "}",
    "",
    "export const ExMachinaPlugin = async () => {",
    "  const homeDir = os.homedir();",
    "  const skillsDir = path.resolve(__dirname, \"../../skills\");",
    "  const configDir = normalizePath(process.env.OPENCODE_CONFIG_DIR ?? \"\", homeDir) ?? path.join(homeDir, \".config/opencode\");",
    "",
    "  return {",
    "    config: async (config) => {",
    "      config.skills = config.skills || {};",
    "      config.skills.paths = config.skills.paths || [];",
    "      if (!config.skills.paths.includes(skillsDir)) {",
    "        config.skills.paths.push(skillsDir);",
    "      }",
    "    },",
    "    \"experimental.chat.system.transform\": async (_input, output) => {",
    "      const bootstrap = getBootstrapContent(skillsDir, configDir);",
    "      if (!bootstrap) {",
    "        return;",
    "      }",
    "      output.system = output.system || [];",
    "      output.system.push(bootstrap);",
    "    }",
    "  };",
    "};",
    ""
  ].join("\n");

  writeText("dist/opencode/plugins/exmachina.mjs", pluginSource);
  writeText("dist/opencode/INSTALL.md", installBodyZh);
  writeText("dist/opencode/INSTALL.en.md", installBodyEn);
}

export function buildGeminiSurface(): void {
  const installBodyZh = renderTemplate("src/templates/zh-CN/gemini.install.md", templateValues);
  const installBodyEn = renderTemplate("src/templates/en-US/gemini.install.md", templateValues);
  const extensionManifest = {
    name: "exmachina",
    version: packageMetadata.version,
    description: "Evidence-bound mechanical-intelligence operating layer for Gemini CLI.",
    contextFileName: "GEMINI.md"
  };
  const rootGeminiContext =
    "@./skills/using-exmachina-en/SKILL.md @./dist/gemini/gemini-tools.md\n";
  const geminiTools = [
    "# Gemini Tool Mapping",
    "",
    "- Default to Chinese when the user writes in Chinese; otherwise use English.",
    "- The ExMachina bootstrap is already loaded through `GEMINI.md`; do not reload it redundantly.",
    "- When a referenced tool name differs, use Gemini CLI's native equivalents for shell, file, search, and edit actions.",
    "- Preserve ExMachina's evidence discipline: keep unknowns explicit and close the verification loop before declaring completion."
  ].join("\n");

  writeJson("dist/gemini-extension.json", extensionManifest);
  writeText("dist/GEMINI.md", rootGeminiContext);
  writeText("dist/gemini/gemini-tools.md", geminiTools);
  writeText("dist/gemini/INSTALL.md", installBodyZh);
  writeText("dist/gemini/INSTALL.en.md", installBodyEn);
}

const hermesManagedSkillDirs = [
  "exmachina-zh",
  "exmachina-en",
  "using-exmachina",
  "using-exmachina-zh",
  "using-exmachina-en"
];

export function buildHermesSurface(): void {
  const installBodyZh = renderTemplate("src/templates/zh-CN/hermes.install.md", templateValues);
  const installBodyEn = renderTemplate("src/templates/en-US/hermes.install.md", templateValues);
  const configSnippet = [
    "# ExMachina Hermes Agent 配置片段",
    "# 合并进 ~/.hermes/config.yaml（可用 hermes config edit 编辑）",
    "# 路径按仓库实际检出位置调整",
    "skills:",
    "  external_dirs:",
    "    - ~/exmachina/skills",
    ""
  ].join("\n");

  writeText(bundlePath(hermesSurfaceDir, "INSTALL.md"), installBodyZh);
  writeText(bundlePath(hermesSurfaceDir, "INSTALL.en.md"), installBodyEn);
  writeText(bundlePath(hermesSurfaceDir, "config-snippet.yaml"), configSnippet);

  // 先清理技能副本目录再复制，避免旧产物残留
  removeDir(bundlePath(hermesSurfaceDir, "skills"));
  // Hermes 技能库使用「目录 + SKILL.md」格式，与根目录 skills/ 直接兼容；
  // 此处复制已生成的共享技能面，供复制安装方式使用。
  for (const skillName of hermesManagedSkillDirs) {
    copyDirectory(bundlePath("skills", skillName), bundlePath(hermesSurfaceDir, "skills", skillName));
  }
}
