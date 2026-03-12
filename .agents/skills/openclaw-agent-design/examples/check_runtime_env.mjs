#!/usr/bin/env node
/**
 * Standalone runtime environment check for jira, confluence, github.
 * No dependencies on qa-plan-orchestrator. Copy into your skill's scripts/.
 *
 * Usage: node check_runtime_env.mjs <run-key> <requested-sources> [output-dir]
 * Example: node check_runtime_env.mjs BCIN-1234 jira,confluence,github ./runs/BCIN-1234/context
 *
 * Output: runtime_setup_<run-key>.json, runtime_setup_<run-key>.md in output-dir
 * Exit: 0 if all required sources pass; 1 if any blocked
 */

import { spawnSync } from 'node:child_process';
import { accessSync, constants } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_COMMANDS = {
  jira: {
    approvedSkill: 'jira-cli',
    resolveCommand: (repoRoot) => {
      const envPath = process.env.JIRA_CLI_SCRIPT;
      if (envPath) return { command: envPath, args: ['me'] };
      const candidates = [];
      if (repoRoot) {
        candidates.push(join(repoRoot, '.agents/skills/jira-cli/scripts/jira-run.sh'));
      }
      const home = homedir();
      if (home) {
        candidates.push(join(home, '.agents/skills/jira-cli/scripts/jira-run.sh'));
        candidates.push(join(home, '.openclaw/skills/jira-cli/scripts/jira-run.sh'));
      }
      for (const candidate of candidates) {
        try {
          accessSync(candidate, constants.F_OK);
          return { command: candidate, args: ['me'] };
        } catch {
          /* continue */
        }
      }
      return null;
    },
  },
  confluence: {
    approvedSkill: 'confluence',
    resolveCommand: () => {
      const envPath = process.env.CONFLUENCE_BIN;
      if (envPath) return { command: envPath, args: ['spaces'] };
      return { command: 'confluence', args: ['spaces'] };
    },
  },
  github: {
    approvedSkill: 'github',
    resolveCommand: () => {
      const envPath = process.env.GH_BIN;
      if (envPath) return { command: envPath, args: ['auth', 'status'] };
      return { command: 'gh', args: ['auth', 'status'] };
    },
  },
};

function normalizeRequestedSourceFamilies(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v || '').trim().toLowerCase()).filter(Boolean);
  }
  return String(value || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

function resolveDefaultRunDir(runKey, cwd) {
  return join(resolve(cwd || process.cwd()), 'runs', runKey, 'context');
}

async function findRepoRoot(startDir) {
  let current = resolve(startDir);
  while (current !== dirname(current)) {
    for (const marker of ['.agents', 'AGENTS.md']) {
      try {
        await access(join(current, marker), constants.F_OK);
        return current;
      } catch {
        /* continue */
      }
    }
    current = dirname(current);
  }
  return null;
}

function runCommand(command, args) {
  const useBashWrapper = command.includes('/');
  if (useBashWrapper) {
    return spawnSync('/bin/bash', [command, ...args], {
      encoding: 'utf8',
      env: process.env,
    });
  }
  return spawnSync(command, args, {
    encoding: 'utf8',
    env: process.env,
  });
}

function checkSourceFamily(sourceFamily, repoRoot) {
  const contract = SOURCE_COMMANDS[sourceFamily];
  if (!contract) {
    return {
      source_family: sourceFamily,
      approved_skill: 'unknown',
      status: 'blocked',
      blockers: 'unknown source family',
    };
  }
  const resolved = contract.resolveCommand(repoRoot);
  if (!resolved) {
    return {
      source_family: sourceFamily,
      approved_skill: contract.approvedSkill,
      status: 'blocked',
      blockers: 'script not found',
    };
  }
  const result = runCommand(resolved.command, resolved.args);
  if (result.status !== 0) {
    const msg = (result.stderr || result.stdout || 'command failed').trim();
    return {
      source_family: sourceFamily,
      approved_skill: contract.approvedSkill,
      status: 'blocked',
      blockers: msg,
    };
  }
  return {
    source_family: sourceFamily,
    approved_skill: contract.approvedSkill,
    status: 'pass',
    blockers: '—',
  };
}

function buildRuntimeSetupMarkdown(runKey, requestedSources, setupEntries, failures) {
  const rows = setupEntries
    .map((e) => `| ${e.source_family} | ${e.approved_skill} | ${e.status} | ${e.blockers} |`)
    .join('\n');
  const failureSection =
    failures.length > 0
      ? `\n## Failures\n\n${failures.map((f) => `- ${f}`).join('\n')}\n`
      : '';
  return `# Runtime Setup — ${runKey}

## Requested sources
${requestedSources.join(', ')}

## Setup entries

| source_family | approved_skill | status | blockers |
|---|---|---|---|
${rows}
${failureSection}`;
}

export async function buildRuntimeSetup(runKey, requestedSources, outputDir, options = {}) {
  const cwd = options.cwd || process.cwd();
  const repoRoot = await findRepoRoot(cwd);
  await mkdir(outputDir, { recursive: true });

  const setupEntries = requestedSources.map((sf) =>
    checkSourceFamily(sf, repoRoot)
  );
  const failures = setupEntries
    .filter((e) => e.status === 'blocked')
    .map((e) => `${e.source_family}: ${e.blockers}`);
  const ok = failures.length === 0;

  const output = {
    ok,
    feature_id: runKey,
    setup_entries: setupEntries,
    failures,
  };

  await writeFile(
    join(outputDir, `runtime_setup_${runKey}.json`),
    `${JSON.stringify(output, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    join(outputDir, `runtime_setup_${runKey}.md`),
    buildRuntimeSetupMarkdown(runKey, requestedSources, setupEntries, failures),
    'utf8'
  );
  return output;
}

export async function runRuntimeSetupCli(argv = process.argv.slice(2)) {
  const [runKey, requestedSourcesArg, outputDirArg] = argv;
  if (!runKey) {
    console.error('Usage: check_runtime_env.mjs <run-key> <requested-sources> [output-dir]');
    process.exit(1);
  }
  const requestedSources = normalizeRequestedSourceFamilies(
    requestedSourcesArg || 'jira'
  );
  const outputDir =
    outputDirArg || resolveDefaultRunDir(runKey, process.cwd());
  const result = await buildRuntimeSetup(runKey, requestedSources, outputDir);

  if (!result.ok) {
    for (const f of result.failures) {
      console.error(`RUNTIME_SETUP_FAILED: ${f}`);
    }
    process.exit(1);
  }
  console.log(`RUNTIME_SETUP_OK: ${join(outputDir, `runtime_setup_${runKey}.json`)}`);
}

const currentPath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (
  executedPath &&
  (currentPath === executedPath ||
    executedPath.endsWith('/check_runtime_env.mjs') ||
    executedPath.endsWith('\\check_runtime_env.mjs'))
) {
  await runRuntimeSetupCli();
}
