#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../../../..');

function normalizeSources(rawSources) {
  return rawSources.map((entry) => entry.trim()).filter(Boolean);
}

function resolveJiraCommand(env) {
  if (env.JIRA_CLI_SCRIPT) {
    return { command: env.JIRA_CLI_SCRIPT, args: ['me'], shellScript: true };
  }
  const repoScript = resolve(REPO_ROOT, '.agents/skills/jira-cli/scripts/jira-run.sh');
  return { command: repoScript, args: ['me'], shellScript: true };
}

function getTestEnvOk(env) {
  const v = env.TEST_RUNTIME_SETUP_OK ?? env.TEST_RUNTIME_ENV_OK;
  return v === '1' || v === 'true' ? 'ok' : v === '0' || v === 'false' ? 'blocked' : null;
}

function checkGithub(env) {
  const testOk = getTestEnvOk(env);
  if (testOk === 'ok') {
    return { source: 'github', status: 'ok', command: 'test-fixture', message: 'GitHub auth mocked as available' };
  }
  if (testOk === 'blocked') {
    return { source: 'github', status: 'blocked', command: 'test-fixture', message: 'GitHub auth mocked as unavailable' };
  }
  const result = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8', env });
  return {
    source: 'github',
    status: result.status === 0 ? 'ok' : 'blocked',
    command: 'gh auth status',
    message: result.status === 0 ? 'GitHub auth available' : (result.stderr || 'GitHub auth unavailable').trim(),
  };
}

function checkJira(env) {
  const testOk = getTestEnvOk(env);
  if (testOk === 'ok') {
    return { source: 'jira', status: 'ok', command: 'test-fixture', message: 'Jira auth mocked as available' };
  }
  if (testOk === 'blocked') {
    return { source: 'jira', status: 'blocked', command: 'test-fixture', message: 'Jira auth mocked as unavailable' };
  }
  const jiraCommand = resolveJiraCommand(env);
  const jiraResult = spawnSync('/bin/bash', [jiraCommand.command, ...jiraCommand.args], {
    encoding: 'utf8',
    env,
  });
  return {
    source: 'jira',
    status: jiraResult.status === 0 ? 'ok' : 'blocked',
    command: `${jiraCommand.command} ${jiraCommand.args.join(' ')}`,
    message: jiraResult.status === 0 ? 'Jira auth available' : (jiraResult.stderr || jiraResult.stdout || 'Jira auth unavailable').trim(),
  };
}

function buildEntry(source, env) {
  if (source === 'jira') {
    return checkJira(env);
  }
  if (source === 'github') {
    return checkGithub(env);
  }
  return {
    source,
    status: 'ok',
    command: 'noop',
    message: `${source} does not require runtime validation`,
  };
}

function renderMarkdown(runKey, setupEntries) {
  const lines = [
    '# Runtime Setup',
    '',
    `Run Key: ${runKey}`,
    '',
    '| Source | Status | Command | Message |',
    '|---|---|---|---|',
  ];
  for (const entry of setupEntries) {
    lines.push(`| ${entry.source} | ${entry.status} | ${entry.command} | ${entry.message} |`);
  }
  return `${lines.join('\n')}\n`;
}

export async function buildRuntimeSetup(runKey, sources, outDir, options = {}) {
  const env = options.env ?? process.env;
  const sourceList = normalizeSources(sources);
  const setupEntries = sourceList.map((source) => buildEntry(source, env));
  const blocked = setupEntries.some((entry) => entry.status === 'blocked');
  const payload = {
    run_key: runKey,
    blocked,
    setup_entries: setupEntries,
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, `runtime_setup_${runKey}.json`), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await writeFile(join(outDir, `runtime_setup_${runKey}.md`), renderMarkdown(runKey, setupEntries), 'utf8');

  return payload;
}

async function main() {
  const [runKey, rawSources, outDir] = process.argv.slice(2);
  if (!runKey || !rawSources || !outDir) {
    console.error('Usage: check_runtime_env.mjs <run-key> jira,github <out-dir>');
    process.exit(1);
  }
  const payload = await buildRuntimeSetup(runKey, rawSources.split(','), outDir);
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.exit(payload.blocked ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
