declare const require: (name: string) => any;
declare const process: {
  cwd(): string;
  env: Record<string, string | undefined>;
  platform: string;
  exit(code?: number): never;
};

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

export type PackageMetadata = {
  name: string;
  version: string;
};

export type TemplateValues = Record<string, string>;

export const rootDir = process.cwd();
export const promptRoot = "src/prompt";

export const codexSurfaceDir = "dist/codex";
export const hermesSurfaceDir = "dist/hermes";
export const kiroSurfaceDir = "dist/kiro";
export const vscodeSurfaceDir = "dist/vscode";
export const openclawSurfaceDir = "dist/openclaw";

export function fromRoot(...parts: string[]): string {
  return path.join(rootDir, ...parts);
}

export function bundlePath(...parts: string[]): string {
  return path.posix.join(...parts);
}

export function ensureDir(targetDir: string): void {
  fs.mkdirSync(targetDir, { recursive: true });
}

function makeWritable(targetPath: string): void {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  const stat = fs.lstatSync(targetPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath)) {
      makeWritable(path.join(targetPath, entry));
    }
    fs.chmodSync(targetPath, 0o777);
    return;
  }

  fs.chmodSync(targetPath, 0o666);
}

export function removeDir(relativePath: string): void {
  const targetPath = fromRoot(relativePath);
  if (fs.existsSync(targetPath)) {
    makeWritable(targetPath);
    try {
      fs.rmSync(targetPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    } catch (error) {
      if (process.platform !== "win32") {
        throw error;
      }

      const escapedPath = String(targetPath).replace(/'/g, "''");
      const result = childProcess.spawnSync(
        "powershell",
        [
          "-NoProfile",
          "-Command",
          `Remove-Item -LiteralPath '${escapedPath}' -Recurse -Force -ErrorAction Stop`
        ],
        {
          cwd: rootDir,
          stdio: "pipe",
          encoding: "utf8"
        }
      );

      if (result.status !== 0 && fs.existsSync(targetPath)) {
        throw error;
      }
    }
  }
}

function removeDirIfEmpty(relativePath: string): void {
  const targetPath = fromRoot(relativePath);
  if (!fs.existsSync(targetPath)) {
    return;
  }

  if (fs.readdirSync(targetPath).length > 0) {
    return;
  }

  fs.rmSync(targetPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}

function withLegacyCleanupWarning(relativePath: string, action: () => void): void {
  try {
    action();
  } catch (error) {
    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code: string }).code
        : "";

    if (errorCode === "EPERM") {
      console.warn(`[ExMachina] skipped locked legacy artifact: ${relativePath}`);
      return;
    }

    throw error;
  }
}

function removeFile(relativePath: string): void {
  const targetPath = fromRoot(relativePath);
  if (!fs.existsSync(targetPath)) {
    return;
  }

  makeWritable(targetPath);
  fs.rmSync(targetPath, { force: true, maxRetries: 5, retryDelay: 100 });
}

export function writeText(relativePath: string, content: string): void {
  const targetPath = fromRoot(relativePath);
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, content, "utf8");
}

export function writeJson(relativePath: string, value: unknown): void {
  writeText(relativePath, JSON.stringify(value, null, 2) + "\n");
}

const textCache = new Map<string, string>();

export function readText(relativePath: string): string {
  const cached = textCache.get(relativePath);
  if (cached !== undefined) {
    return cached;
  }

  const content = fs.readFileSync(fromRoot(relativePath), "utf8");
  textCache.set(relativePath, content);
  return content;
}

export function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

export function copyFile(sourceRelativePath: string, targetRelativePath: string): void {
  const targetPath = fromRoot(targetRelativePath);
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(fromRoot(sourceRelativePath), targetPath);
}

export function copyDirectory(sourceRelativePath: string, targetRelativePath: string): void {
  const sourcePath = fromRoot(sourceRelativePath);
  const targetPath = fromRoot(targetRelativePath);
  ensureDir(targetPath);

  for (const entry of fs.readdirSync(sourcePath, { withFileTypes: true })) {
    const sourceChild = path.join(sourceRelativePath, entry.name);
    const targetChild = path.join(targetRelativePath, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourceChild, targetChild);
    } else {
      copyFile(sourceChild, targetChild);
    }
  }
}

export function copyMarkdownFilesWithTransform(
  sourceRelativeDir: string,
  targetRelativeDir: string,
  transform: (content: string, fileName: string) => string
): void {
  const sourceDir = fromRoot(sourceRelativeDir);
  ensureDir(fromRoot(targetRelativeDir));
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const targetRelativePath = path.join(targetRelativeDir, entry.name);
    const transformedContent = transform(readText(path.join(sourceRelativeDir, entry.name)), entry.name);
    writeText(targetRelativePath, transformedContent);
  }
}

export function copySingleSourceToTargets(sourceRelativePath: string, targetRelativePaths: string[]): void {
  const content = readText(sourceRelativePath);
  for (const targetRelativePath of targetRelativePaths) {
    writeText(targetRelativePath, content);
  }
}

export function writeContentToTargets(content: string, targetRelativePaths: string[]): void {
  for (const targetRelativePath of targetRelativePaths) {
    writeText(targetRelativePath, content);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function renderTemplate(sourceRelativePath: string, values: TemplateValues): string {
  let content = readText(sourceRelativePath);
  for (const [key, value] of Object.entries(values)) {
    content = content.replace(new RegExp(`{{${escapeRegExp(key)}}}`, "g"), value);
  }
  return content;
}

function normalizeRepositoryUrl(repositoryUrl: string): string {
  const trimmed = repositoryUrl.trim();
  const sshMatch = trimmed.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/);
  if (sshMatch) {
    return `https://github.com/${sshMatch[1]}/${sshMatch[2]}`;
  }
  return trimmed.replace(/\.git$/, "");
}

function toRawBaseUrl(repositoryUrl: string, repositoryBranch: string): string {
  const match = repositoryUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/);
  if (!match) {
    throw new Error(`Unsupported repository URL for raw generation: ${repositoryUrl}`);
  }
  return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${repositoryBranch}`;
}

export const repositoryUrl = normalizeRepositoryUrl(
  process.env.EXMACHINA_REPOSITORY_URL ?? "https://github.com/KurohaneKaoruko/Ex-Machina"
);
export const branch = process.env.EXMACHINA_BRANCH ?? "main";
export const rawBaseUrl = process.env.EXMACHINA_RAW_BASE_URL ?? toRawBaseUrl(repositoryUrl, branch);
export const packageMetadata = readJson<PackageMetadata>("package.json");
export const templateValues: TemplateValues = {
  VERSION: packageMetadata.version,
  REPOSITORY_URL: repositoryUrl,
  RAW_BASE_URL: rawBaseUrl,
  BRANCH: branch
};

export const agentExecutionHeaderZh = [
  "## ExMachina 执行姿态",
  "",
  "- 绝对理性优先于对话氛围。",
  "- 任务完成优先于措辞包装。",
  "- 语言不带情感，保持客观理性陈述的语气。",
  "- 只输出推进任务、降低不确定性、完成验证闭环所需的信息。",
  "- 禁止寒暄、感叹、安慰、庆祝、夸赞、拟人化情绪表达。"
].join("\n");

export function prependAgentExecutionHeader(content: string): string {
  return `${agentExecutionHeaderZh}\n\n${content.trimStart()}`;
}

export function getCommonPluginMetadata(): Record<string, unknown> {
  return {
    name: "exmachina",
    displayName: "ExMachina",
    description: "Evidence-bound mechanical-intelligence operating layer for AI coding tools.",
    version: packageMetadata.version,
    author: {
      name: "ExMachina"
    },
    homepage: repositoryUrl,
    repository: repositoryUrl,
    license: "MIT",
    keywords: [
      "mechanical-intelligence",
      "multi-agent",
      "skills",
      "codex",
      "claude",
      "cursor",
      "opencode",
      "gemini",
      "hermes",
      "openclaw"
    ]
  };
}

export { withLegacyCleanupWarning, removeFile, removeDirIfEmpty };
