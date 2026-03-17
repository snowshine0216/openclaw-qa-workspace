#!/usr/bin/env node
/**
 * Resolve shared skill script path with fallback order and optional user-confirmation flow.
 */

import { accessSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { constants } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { findRepoRoot } from './findRepoRoot.mjs';

const DEFAULT_CONFIG_PATH = join(homedir(), '.openclaw', 'skill_paths.json');

function fileExists(path) {
  try {
    accessSync(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function loadConfig(configPath) {
  try {
    const raw = readFileSync(configPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveConfig(configPath, data) {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

/**
 * Get env override for a skill script. Checks common env var patterns.
 * @param {string} skillName
 * @param {string} scriptRelativePath
 * @param {Record<string, string>} [envOverrides] - Optional map of env var name -> value
 * @returns {string|null}
 */
function getEnvOverride(skillName, scriptRelativePath, envOverrides = {}) {
  const env = envOverrides || process.env;
  const candidates = [env[`${skillName.toUpperCase().replace(/-/g, '_')}_SCRIPT`]];

  if (skillName === 'jira-cli') {
    candidates.unshift(env.JIRA_CLI_SCRIPT);
  }
  if (skillName === 'feishu-notify') {
    candidates.unshift(env.FEISHU_NOTIFY_SCRIPT);
  }

  for (const v of candidates) {
    if (v && typeof v === 'string' && fileExists(v)) return v;
  }
  return null;
}

/**
 * Build fallback candidate paths in resolution order.
 */
function buildCandidates(skillName, scriptRelativePath, repoRoot, configPath) {
  const home = homedir();
  const codexHome = process.env.CODEX_HOME;
  const candidates = [];

  if (repoRoot) {
    candidates.push(join(repoRoot, '.agents', 'skills', skillName, scriptRelativePath));
  }
  if (codexHome) {
    candidates.push(join(codexHome, 'skills', skillName, scriptRelativePath));
  }
  if (home) {
    candidates.push(join(home, '.agents', 'skills', skillName, scriptRelativePath));
    candidates.push(join(home, '.openclaw', 'skills', skillName, scriptRelativePath));
  }

  const config = fileExists(configPath) ? loadConfig(configPath) : {};
  const configKey = `${skillName}/${scriptRelativePath}`;
  if (config[configKey]) {
    candidates.unshift(config[configKey]);
  }

  return candidates;
}

/**
 * Resolve shared skill script path.
 * @param {string} skillName - e.g. 'jira-cli', 'feishu-notify'
 * @param {string} scriptRelativePath - e.g. 'scripts/jira-run.sh'
 * @param {Object} [options]
 * @param {string} [options.repoRoot] - Repo root for repo-local lookup
 * @param {Record<string, string>} [options.envOverrides] - Env vars (default: process.env)
 * @param {boolean} [options.requireUserConfirm=false] - Return needUserConfirm when not found
 * @param {string} [options.configPath] - Path to skill_paths.json
 * @param {(p: string) => boolean} [options.fileExists] - Custom file existence check
 * @returns {Promise<string|{ found: false; needUserConfirm: true; skillName: string; scriptRelativePath: string; triedPaths: string[] }>}
 */
export async function resolveSharedSkill(skillName, scriptRelativePath, options = {}) {
  const {
    repoRoot: providedRepoRoot,
    envOverrides,
    requireUserConfirm = false,
    configPath = DEFAULT_CONFIG_PATH,
    fileExists: customFileExists = fileExists,
  } = options;

  const envPath = getEnvOverride(skillName, scriptRelativePath, envOverrides);
  if (envPath && customFileExists(envPath)) return envPath;

  const repoRoot = providedRepoRoot ?? (await findRepoRoot(process.cwd()));
  const candidates = buildCandidates(skillName, scriptRelativePath, repoRoot, configPath);

  for (const candidate of candidates) {
    if (customFileExists(candidate)) return candidate;
  }

  if (requireUserConfirm) {
    return {
      found: false,
      needUserConfirm: true,
      skillName,
      scriptRelativePath,
      triedPaths: candidates,
    };
  }

  return null;
}

/**
 * Persist user-confirmed path to config.
 * @param {string} skillName
 * @param {string} scriptRelativePath
 * @param {string} absolutePath - Validated absolute path
 * @param {string} [configPath]
 * @throws {Error} If path does not exist
 */
export function persistSkillPath(skillName, scriptRelativePath, absolutePath, configPath = DEFAULT_CONFIG_PATH) {
  const resolved = resolve(absolutePath);
  if (!fileExists(resolved)) {
    throw new Error(`Path does not exist: ${resolved}`);
  }
  const config = loadConfig(configPath);
  config[`${skillName}/${scriptRelativePath}`] = resolved;
  saveConfig(configPath, config);
}
