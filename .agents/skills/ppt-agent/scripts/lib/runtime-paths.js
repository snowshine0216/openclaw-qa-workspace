"use strict";

const path = require("path");
const { pathToFileURL } = require("url");

const REGISTRAR_LIB_DIR = path.resolve(__dirname, "..", "..", "..", "skill-path-registrar", "lib");

let registrarModulesPromise = null;

function buildRuntimePaths({ skillRoot, repoRoot }) {
  if (!skillRoot) {
    throw new Error("[ppt-agent] skillRoot is required");
  }
  if (!repoRoot) {
    throw new Error("[ppt-agent] repoRoot is required");
  }

  return {
    skillRoot: path.resolve(skillRoot),
    repoRoot: path.resolve(repoRoot),
    defaultRunsDir: path.join(path.resolve(skillRoot), "runs"),
    venvActivatePath: path.join(path.resolve(repoRoot), ".venv", "bin", "activate")
  };
}

function importRegistrarModule(moduleName) {
  return import(pathToFileURL(path.join(REGISTRAR_LIB_DIR, moduleName)).href);
}

function loadRegistrarModules() {
  if (!registrarModulesPromise) {
    registrarModulesPromise = Promise.all([
      importRegistrarModule("resolveSkillRoot.mjs"),
      importRegistrarModule("findRepoRoot.mjs")
    ]);
  }
  return registrarModulesPromise;
}

async function getRuntimePaths({ fromScriptPath } = {}) {
  const scriptPath = path.resolve(fromScriptPath || __filename);
  const [{ resolveSkillRoot }, { findRepoRoot }] = await loadRegistrarModules();
  const skill = await resolveSkillRoot({ fromScriptPath: scriptPath });

  if (!skill || !skill.skillRoot) {
    throw new Error(`[ppt-agent] Failed to resolve skill root for ${scriptPath}`);
  }

  const repoRoot = await findRepoRoot(path.dirname(scriptPath));
  if (!repoRoot) {
    throw new Error(`[ppt-agent] Failed to resolve repo root for ${scriptPath}`);
  }

  return buildRuntimePaths({
    skillRoot: skill.skillRoot,
    repoRoot
  });
}

module.exports = {
  buildRuntimePaths,
  getRuntimePaths
};
