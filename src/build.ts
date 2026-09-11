import { cleanupLegacyArtifactSurface, buildRootFiles, buildHooks, buildEvals, buildExamplesAndBenchmark, buildMiscSurfaces } from "./dispatch/content";
import { buildSkills, buildCommands, buildAgents, buildPromptSurfaces } from "./dispatch/prompts";
import {
  buildClaudePluginSurface,
  buildCodexSurface,
  buildCursorSurface,
  buildOpenCodeSurface,
  buildGeminiSurface,
  buildHermesSurface
} from "./dispatch/platforms";
import { buildOpenClawSurface } from "./dispatch/openclaw";

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
