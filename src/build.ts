import { cleanupLegacyArtifactSurface, buildRootFiles, buildHooks, buildEvals, buildExamplesAndBenchmark, buildMiscSurfaces } from "./build/content";
import { buildSkills, buildCommands, buildAgents, buildPromptSurfaces } from "./build/prompts";
import {
  buildClaudePluginSurface,
  buildCodexSurface,
  buildCursorSurface,
  buildOpenCodeSurface,
  buildGeminiSurface,
  buildHermesSurface
} from "./build/platforms";
import { buildOpenClawSurface } from "./build/openclaw";

declare const process: {
  exit(code?: number): never;
};

function main(): void {
  cleanupLegacyArtifactSurface();
  buildRootFiles();
  buildSkills();
  buildCommands();
  buildAgents();
  buildPromptSurfaces();
  buildClaudePluginSurface();
  buildCodexSurface();
  buildHooks();
  buildCursorSurface();
  buildOpenCodeSurface();
  buildGeminiSurface();
  buildHermesSurface();
  buildOpenClawSurface();
  buildEvals();
  buildExamplesAndBenchmark();
  buildMiscSurfaces();
  console.log("ExMachina bundle generated.");
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
