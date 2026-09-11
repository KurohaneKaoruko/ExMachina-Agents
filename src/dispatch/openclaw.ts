import {
  bundlePath,
  copyDirectory,
  copyMarkdownFilesWithTransform,
  openclawSurfaceDir,
  prependAgentExecutionHeader,
  promptRoot,
  readText,
  removeDir,
  renderTemplate,
  templateValues,
  writeJson,
  writeText
} from "./lib";

type AgentFrontmatter = {
  name: string;
  description: string;
};

const openclawLinkSlugs: Record<string, string> = {
  "01_研究与理性连结体.md": "research-rationality",
  "02_架构与实作连结体.md": "architecture-implementation",
  "03_校验与安全连结体.md": "validation-security",
  "04_集成与运维连结体.md": "integration-operations",
  "05_文档与体验连结体.md": "documentation-experience"
};

function parseAgentFrontmatter(content: string): AgentFrontmatter {
  const nameMatch = content.match(/^name:\s*(.+)$/m);
  const descriptionMatch = content.match(/^description:\s*(.+)$/m);
  const unquote = (value: string | undefined): string =>
    (value ?? "").trim().replace(/^"(.*)"$/s, "$1");
  return {
    name: unquote(nameMatch?.[1]),
    description: unquote(descriptionMatch?.[1])
  };
}

const openclawWorkspaceAppendixZh = [
  "## ExMachina 工作区资源地图",
  "",
  "本工作区位于 ExMachina 仓库检出内部，相对路径固定：",
  "",
  "| 资源 | 路径 |",
  "|------|------|",
  "| 主协定全文 | `../../../AGENTS.md` |",
  "| 连结指挥体与子个体提示词 | `../../../agents/` |",
  "| 中文主技能（含协议与角色参考） | `../../../skills/exmachina-zh/references/` |",
  "| 英文主技能 | `../../../skills/exmachina-en/SKILL.md` |",
  "",
  "## ExMachina 派发规约",
  "",
  "- 派发一律使用 `sessions_spawn`，任务文本包含四段：角色声明、输入、交付物、证据要求。",
  "- 下级个体先读取对应角色提示词文件再执行，不得凭记忆复述角色。",
  "- 回流以 `[角色]:` 开头，正文按输出契约给出证据、判断、风险、下一步。",
  "- 子代理完成事件为推送式回流；禁止轮询 `sessions_list`、`sessions_history` 或 `/subagents list` 等待结束。",
  "- 跨域冲突与链路改选不越级派发，回流主控体裁决。",
  "- 所有动作继承主协定的证据分级与最小可逆原则；不得修改模型与 provider 配置。"
].join("\n");

export function buildOpenClawSurface(): void {
  writeText(
    bundlePath(openclawSurfaceDir, "INSTALL.md"),
    renderTemplate("src/templates/zh-CN/openclaw.install.md", templateValues)
  );
  writeText(
    bundlePath(openclawSurfaceDir, "INSTALL.en.md"),
    renderTemplate("src/templates/en-US/openclaw.install.md", templateValues)
  );

  // 先清理再生目录，避免源文件删除后旧产物残留累积
  removeDir(bundlePath(openclawSurfaceDir, "exmachina"));
  removeDir(bundlePath(openclawSurfaceDir, "workspaces"));
  copyMarkdownFilesWithTransform(
    `${promptRoot}/agents`,
    bundlePath(openclawSurfaceDir, "exmachina", "agents"),
    (content) => prependAgentExecutionHeader(content)
  );
  copyDirectory(`${promptRoot}/protocol`, bundlePath(openclawSurfaceDir, "exmachina", "protocol"));

  const linkEntries: Record<string, unknown> = {};
  const linkIds: string[] = [];

  for (const [fileName, slug] of Object.entries(openclawLinkSlugs)) {
    const content = readText(`${promptRoot}/agents/${fileName}`);
    const frontmatter = parseAgentFrontmatter(content);
    const entryId = `exmachina-link-${slug}`;
    linkIds.push(entryId);

    writeText(
      bundlePath(openclawSurfaceDir, "workspaces", entryId, "AGENTS.md"),
      `${prependAgentExecutionHeader(content).trimEnd()}\n\n${openclawWorkspaceAppendixZh}\n`
    );

    linkEntries[entryId] = {
      name: frontmatter.name,
      workspace: `{{EXMACHINA_PACK_ROOT}}/dist/openclaw/workspaces/${entryId}`,
      identity: {
        name: frontmatter.name,
        theme: frontmatter.description
      }
    };
  }

  const mainContent = readText(`${promptRoot}/agents/00_全连结指挥体.md`);
  const mainFrontmatter = parseAgentFrontmatter(mainContent);
  writeText(
    bundlePath(openclawSurfaceDir, "workspaces", "exmachina-main", "AGENTS.md"),
    `${prependAgentExecutionHeader(mainContent).trimEnd()}\n\n${openclawWorkspaceAppendixZh}\n`
  );

  const subagentsDefaults = {
    maxSpawnDepth: 2,
    maxChildrenPerAgent: 8,
    maxConcurrent: 8
  };

  writeJson(bundlePath(openclawSurfaceDir, "openclaw.settings.json"), {
    mode: "full",
    format_name: "exmachina-openclaw-settings-v2",
    target_config_paths: ["~/.openclaw/openclaw.json"],
    supports_direct_import: false,
    template_variables: {
      EXMACHINA_PACK_ROOT: {
        description: "ExMachina 仓库检出根目录（dist/openclaw/ 的上级目录）",
        default: "<ExMachina 仓库根目录>"
      }
    },
    settings_patch: {
      agents: {
        defaults: { subagents: subagentsDefaults },
        entries: {
          "exmachina-main": {
            name: "ExMachina 主控",
            workspace: "{{EXMACHINA_PACK_ROOT}}/dist/openclaw/workspaces/exmachina-main",
            identity: {
              name: "ExMachina 主控",
              theme: mainFrontmatter.description
            },
            subagents: { allowAgents: linkIds }
          },
          ...linkEntries
        }
      }
    },
    merge_instructions: [
      "读取目标配置前先做 JSON 解析校验，失败则中止，不得覆盖损坏文件。",
      "写入前把原文件备份为 <target>.exmachina.bak。",
      "{{EXMACHINA_PACK_ROOT}} 展开为 ExMachina 仓库检出根目录的绝对路径。",
      "agents.entries 按 agent id 逐键深合并：非 ExMachina 条目不得覆盖，exmachina-* 条目整体替换。",
      "subagents.allowAgents 与现有数取并集，保持去重与原顺序。",
      "agents.defaults.subagents 逐字段深合并，仅在字段缺失或等于本模板默认值时写入。",
      "不写入 default 字段：该字段已废弃，多 agent 路由由 bindings 与显式 agentId 目标承担。",
      "不修改 channels、bindings、identity 顶层段与任何模型或 provider 配置。",
      "合并完成后运行 openclaw doctor 检查路由与归属状态。"
    ],
    usage_notes: [
      "主控入口三选一：Control UI 显式切换、bindings 路由渠道、或从主力 agent 以 agentId 为 exmachina-main 派发。",
      "所有 ExMachina agent 继承宿主默认模型，禁止改写 provider 或 API 配置。",
      "各 workspace 的 AGENTS.md 是构建生成的角色提示词，手工修改会在下次构建时被覆盖。",
      "金字塔深度为两层：主控（depth 0）→ 连结指挥体（depth 1）→ 子个体（depth 2）；子个体不注册 entries，角色由任务文本内嵌。",
      "lite 模式不注册任何 entries，见 openclaw.settings.lite.json。"
    ]
  });

  writeJson(bundlePath(openclawSurfaceDir, "openclaw.settings.lite.json"), {
    mode: "lite",
    format_name: "exmachina-openclaw-settings-v2",
    target_config_paths: ["~/.openclaw/openclaw.json"],
    supports_direct_import: false,
    template_variables: {},
    settings_patch: {
      agents: {
        defaults: { subagents: subagentsDefaults }
      }
    },
    merge_instructions: [
      "读取目标配置前先做 JSON 解析校验，失败则中止，不得覆盖损坏文件。",
      "写入前把原文件备份为 <target>.exmachina.bak。",
      "agents.defaults.subagents 逐字段深合并，仅在字段缺失或等于本模板默认值时写入。",
      "不新增 agents.entries，不修改 channels、bindings 与任何模型或 provider 配置。"
    ],
    usage_notes: [
      "lite 模式由主 agent 兼任全连结指挥体；workspace 内容安装由 scripts/apply-openclaw-settings.mjs 完成。",
      "连结指挥体与子个体角色提示词按需读取仓库 agents/ 目录与 skills/exmachina-zh/references/agents/，由任务文本内嵌。",
      "升级到 full 模式前先运行 --uninstall 清理受管理内容，再以 --mode full 重新应用。"
    ]
  });
}
