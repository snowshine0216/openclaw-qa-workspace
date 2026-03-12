#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { accessSync, constants } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_COMMANDS = {
  jira: () => {
    const script = process.env.JIRA_CLI_SCRIPT;
    if (script) return { command: script, args: ['me'], shellScript: true };
    return { command: 'jira', args: ['me'], shellScript: false };
  },
  github: () => ({ command: process.env.GH_BIN || 'gh', args: ['auth', 'status'], shellScript: false }),
};

function normalizeRequestedSources(input) {
  return String(input || 'jira,github')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

function resolveDefaultOutputDir(runKey) {
  return resolve(process.cwd(), 'runs', runKey, 'context');
}

function runCheck(source) {
  const resolver = SOURCE_COMMANDS[source];
  if (!resolver) {
    return { source_family: source, approved_skill: 'unknown', status: 'blocked', blockers: 'unknown source' };
  }
  const { command, args, shellScript } = resolver();
  let result;
  if (shellScript || command.includes('/')) {
    try {
      accessSync(command, constants.F_OK);
    } catch {
      return { source_family: source, approved_skill: source === 'jira' ? 'jira-cli' : 'github', status: 'blocked', blockers: 'command not found' };
    }
    result = spawnSync('/bin/bash', [command, ...args], { encoding: 'utf8', env: process.env });
  } else {
    result = spawnSync(command, args, { encoding: 'utf8', env: process.env });
  }
  if (result.status !== 0) {
    return {
      source_family: source,
      approved_skill: source === 'jira' ? 'jira-cli' : 'github',
      status: 'blocked',
      blockers: (result.stderr || result.stdout || 'command failed').trim(),
    };
  }
  return {
    source_family: source,
    approved_skill: source === 'jira' ? 'jira-cli' : 'github',
    status: 'pass',
    blockers: '—',
  };
}

function renderMarkdown(runKey, entries, failures) {
  const rows = entries.map((e) => `| ${e.source_family} | ${e.approved_skill} | ${e.status} | ${e.blockers} |`).join('\n');
  const fail = failures.length ? `\n## Failures\n\n${failures.map((f) => `- ${f}`).join('\n')}\n` : '';
  return `# Runtime Setup — ${runKey}

## Setup entries

| source_family | approved_skill | status | blockers |
|---|---|---|---|
${rows}
${fail}`;
}

export async function buildRuntimeSetup(runKey, requestedSources, outputDir) {
  const entries = requestedSources.map(runCheck);
  const failures = entries.filter((e) => e.status === 'blocked').map((e) => `${e.source_family}: ${e.blockers}`);
  const payload = {
    ok: failures.length === 0,
    feature_id: runKey,
    setup_entries: entries,
    failures,
  };
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, `runtime_setup_${runKey}.json`), JSON.stringify(payload, null, 2) + '\n', 'utf8');
  await writeFile(join(outputDir, `runtime_setup_${runKey}.md`), renderMarkdown(runKey, entries, failures), 'utf8');
  return payload;
}

export async function runRuntimeSetupCli(argv = process.argv.slice(2)) {
  const [runKey, requestedSourcesArg, outputDirArg] = argv;
  if (!runKey) {
    console.error('Usage: check_runtime_env.mjs <run-key> <requested-sources> [output-dir]');
    process.exit(1);
  }
  const requestedSources = normalizeRequestedSources(requestedSourcesArg);
  const outputDir = outputDirArg || resolveDefaultOutputDir(runKey);
  const result = await buildRuntimeSetup(runKey, requestedSources, outputDir);
  if (!result.ok) {
    result.failures.forEach((f) => console.error(`RUNTIME_SETUP_FAILED: ${f}`));
    process.exit(1);
  }
  console.log(`RUNTIME_SETUP_OK: ${join(outputDir, `runtime_setup_${runKey}.json`)}`);
}

const current = fileURLToPath(import.meta.url);
const executed = process.argv[1] ? resolve(process.argv[1]) : '';
if (current === executed || executed.endsWith('/check_runtime_env.mjs') || executed.endsWith('\\check_runtime_env.mjs')) {
  await runRuntimeSetupCli();
}

