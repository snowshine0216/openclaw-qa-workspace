#!/usr/bin/env node
/**
 * Phase 5: Publish decision - skip, update, or create.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfluenceMarkdown } from './mergeConfluenceMarkdown.mjs';
import { resolveSharedSkillScript } from './sharedSkillPaths.mjs';

const PUBLISH_MODES = new Set(['skip', 'update_existing', 'create_new']);
const SCRIPT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_ROOT = join(SCRIPT_DIR, '..');

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === 'string' && value.trim()) || null;
}

function parsePublishOutput(stdout = '') {
  return String(stdout)
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex <= 0) return acc;
      acc[line.slice(0, separatorIndex)] = line.slice(separatorIndex + 1);
      return acc;
    }, {});
}

async function runRuntimeCheck({ featureKey, contextDir, skillRoot, scriptDir, checkRuntimeEnv }) {
  if (checkRuntimeEnv) {
    return checkRuntimeEnv({ featureKey, contextDir, skillRoot, scriptDir });
  }

  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(
    'node',
    [join(scriptDir, 'check_runtime_env.mjs'), featureKey, 'confluence', contextDir],
    { encoding: 'utf8', cwd: skillRoot }
  );

  return {
    ok: result.status === 0,
    stderr: result.stderr,
    stdout: result.stdout,
  };
}

async function publishMergedMarkdown({
  publishToConfluence,
  resolveSharedSkillScript: resolveSharedSkillScriptDep,
  skillRoot,
  mergedPath,
  publishMode,
  resolvedPageId,
  publishSpace,
  publishTitle,
  featureKey,
  parentPageId,
}) {
  if (publishToConfluence) {
    return publishToConfluence({
      mergedPath,
      publishMode,
      resolvedPageId,
      publishSpace,
      publishTitle,
      featureKey,
      parentPageId,
    });
  }

  const confluenceScript = await (resolveSharedSkillScriptDep || resolveSharedSkillScript)({
    skillRoot,
    skillName: 'confluence',
    scriptRelativePath: 'scripts/run-confluence-publish.sh',
  });
  if (!confluenceScript || typeof confluenceScript !== 'string') {
    return {
      ok: false,
      stderr: 'Confluence publish helper could not be resolved via skill-path-registrar.',
      stdout: '',
    };
  }
  const { spawnSync } = await import('node:child_process');
  const publishArgs = ['--input', mergedPath];
  if (publishMode === 'update_existing' && resolvedPageId) {
    publishArgs.push('--page-id', resolvedPageId);
  } else if (publishMode === 'create_new' && parentPageId) {
    // Use create-child when a parent page ID is available
    publishArgs.push('--parent-id', parentPageId, '--title', publishTitle || `QA Summary — ${featureKey}`);
  } else if (publishMode === 'create_new' && publishSpace) {
    publishArgs.push('--space', publishSpace, '--title', publishTitle || `QA Summary — ${featureKey}`);
  }

  if (publishArgs.length <= 2) {
    return { ok: true };
  }

  const publishResult = spawnSync('bash', [confluenceScript, ...publishArgs], {
    encoding: 'utf8',
    cwd: skillRoot,
  });

  return {
    ok: publishResult.status === 0,
    stderr: publishResult.stderr,
    stdout: publishResult.stdout,
  };
}

async function readTask(taskPath) {
  try {
    const raw = await readFile(taskPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function normalizePublishMode(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return PUBLISH_MODES.has(normalized) ? normalized : null;
}

async function persistPublishChoice(runDir, publishMode) {
  await writeFile(
    join(runDir, 'context', 'publish_choice.json'),
    `${JSON.stringify({ publishMode }, null, 2)}\n`,
    'utf8'
  );
}

async function readPersistedTarget(runDir, task) {
  const base = task?.confluence_target || {};
  let fileTarget = {};
  try {
    const raw = await readFile(join(runDir, 'context', 'confluence_target.json'), 'utf8');
    fileTarget = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const merged = { ...fileTarget, ...base };
  if (!merged.parent_page_id) {
    merged.parent_page_id = task?.parent_page_id || fileTarget?.parent_page_id || null;
  }
  return merged;
}

async function resolveFeatureSummary(featureKey, runDir, fetchFeatureSummary) {
  if (fetchFeatureSummary) return fetchFeatureSummary(featureKey);
  try {
    const raw = await readFile(join(runDir, 'context', 'jira_feature_meta.json'), 'utf8');
    const meta = JSON.parse(raw);
    if (meta.summary) return meta.summary;
  } catch {
    /* not available */
  }

  try {
    const { spawnSync } = await import('node:child_process');
    const result = spawnSync('jira', ['issue', 'view', featureKey, '--output', 'json'], {
      encoding: 'utf8',
    });
    if (result.status === 0 && result.stdout) {
      const issue = JSON.parse(result.stdout);
      return issue.fields?.summary || issue.summary || null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function findConfluencePageIdByTitle({
  publishTitle,
  publishSpace,
  skillRoot,
  findConfluencePageId,
}) {
  if (!publishTitle) return null;
  if (findConfluencePageId) {
    return findConfluencePageId({ publishTitle, publishSpace, skillRoot });
  }

  const args = ['find', publishTitle];
  if (publishSpace) args.push('--space', publishSpace);

  const { spawnSync } = await import('node:child_process');
  const result = spawnSync('confluence', args, {
    encoding: 'utf8',
    cwd: skillRoot,
  });
  if (result.status !== 0) return null;

  const ids = [...new Set((result.stdout.match(/[0-9]{5,}/g) ?? []).filter(Boolean))];
  return ids.length === 1 ? ids[0] : null;
}

function resolveExecutionPaths() {
  return {
    scriptDir: SCRIPT_DIR,
    skillRoot: SKILL_ROOT,
  };
}

async function resolvePublishedTarget({
  publishMode,
  target,
  publishResult,
  resolvedPageId,
  publishSpace,
  publishTitle,
  skillRoot,
  findConfluencePageId,
}) {
  const publishOutput = parsePublishOutput(publishResult.stdout);
  const pageUrl = firstNonEmpty(
    target.pageUrl,
    publishResult.pageUrl,
    publishResult.page_url,
    publishOutput.page_url,
    publishOutput.pageUrl
  );
  let pageId = firstNonEmpty(
    target.pageId,
    publishResult.pageId,
    publishResult.page_id,
    publishOutput.page_id,
    publishOutput.pageId,
    resolvedPageId
  );

  if (!pageId && publishMode === 'create_new') {
    pageId = await findConfluencePageIdByTitle({
      publishTitle,
      publishSpace,
      skillRoot,
      findConfluencePageId,
    });
  }

  return {
    ...target,
    pageId,
    pageUrl,
    publishSpace,
    publishTitle,
  };
}

export async function runPhase5(featureKey, runDir, input = {}, deps = {}) {
  const taskPath = join(runDir, 'task.json');
  const task = await readTask(taskPath);
  const persistedTarget = await readPersistedTarget(runDir, task);
  const publishMode =
    normalizePublishMode(input.publish_mode) ||
    normalizePublishMode(process.env.PUBLISH_MODE) ||
    normalizePublishMode(task.publish_mode);

  await persistPublishChoice(runDir, publishMode);

  if (!publishMode) {
    console.error('BLOCKED: Choose publish mode: skip, update_existing, or create_new.');
    return 2;
  }

  if (publishMode === 'skip') {
    task.overall_status = 'approved';
    task.current_phase = 'phase5';
    task.publish_mode = publishMode;
    task.updated_at = new Date().toISOString();
    await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');
    console.log('PHASE5_DONE');
    return 0;
  }

  const contextDir = join(runDir, 'context');
  const { scriptDir, skillRoot } = resolveExecutionPaths();
  const checkResult = await runRuntimeCheck({
    featureKey,
    contextDir,
    skillRoot,
    scriptDir,
    checkRuntimeEnv: deps.checkRuntimeEnv,
  });

  if (!checkResult.ok) {
    console.error('BLOCKED: Confluence access validation failed.');
    return 2;
  }

  const pageId = input.confluence_page_id || process.env.CONFLUENCE_PAGE_ID || persistedTarget.pageId;
  const pageUrl = input.confluence_page_url || process.env.CONFLUENCE_PAGE_URL || persistedTarget.pageUrl;
  let publishSpace = input.publish_space || process.env.PUBLISH_SPACE || persistedTarget.publishSpace;
  const publishTitle = input.publish_title || process.env.PUBLISH_TITLE || persistedTarget.publishTitle;
  const parentPageId =
    input.parent_page_id ||
    process.env.PARENT_PAGE_ID ||
    persistedTarget.parent_page_id ||
    task?.parent_page_id ||
    null;

  if (publishMode === 'update_existing' && !pageId && !pageUrl) {
    console.error('BLOCKED: Provide Confluence link or exact page ID');
    return 2;
  }

  if (publishMode === 'create_new' && !publishSpace) {
    let defaultSpace = 'QA';
    try {
      const configRaw = await readFile(join(skillRoot, 'config', 'runtime-sources.json'), 'utf8');
      const config = JSON.parse(configRaw);
      defaultSpace = config.default_publish_space || defaultSpace;
    } catch {
      /* use default */
    }
    publishSpace = process.env.PUBLISH_SPACE || process.env.DEFAULT_PUBLISH_SPACE || defaultSpace;
  }

  let resolvedTitle = publishTitle;
  if (publishMode === 'create_new' && !resolvedTitle) {
    const featureSummary = await resolveFeatureSummary(featureKey, runDir, deps.fetchFeatureSummary);
    resolvedTitle = featureSummary ? `${featureKey} ${featureSummary}` : `QA Summary — ${featureKey}`;
  }

  const target = {
    pageId,
    pageUrl,
    publishSpace,
    publishTitle: resolvedTitle,
    parent_page_id: parentPageId,
  };
  await writeFile(
    join(runDir, 'context', 'confluence_target.json'),
    `${JSON.stringify(target, null, 2)}\n`,
    'utf8'
  );

  let merged = '';
  try {
    merged = await (deps.mergeMarkdown || mergeConfluenceMarkdown)({
      featureKey,
      runDir,
      publishMode,
      target,
    });
  } catch (error) {
    console.error(`BLOCKED: ${error.message}`);
    return 2;
  }

  const mergedPath = join(runDir, `${featureKey}_QA_SUMMARY_MERGED.md`);
  await writeFile(mergedPath, merged, 'utf8');

  const { extractPageIdFromUrl } = await import('./mergeConfluenceMarkdown.mjs');
  const resolvedPageId = pageId || (pageUrl ? extractPageIdFromUrl(pageUrl) : null);
  if (publishMode === 'update_existing' && !resolvedPageId) {
    console.error('BLOCKED: Confluence page URL must resolve to an exact page ID');
    return 2;
  }
  const publishResult = await publishMergedMarkdown({
    publishToConfluence: deps.publishToConfluence,
    resolveSharedSkillScript: deps.resolveSharedSkillScript,
    skillRoot,
    mergedPath,
    publishMode,
    resolvedPageId,
    publishSpace,
    publishTitle: resolvedTitle,
    featureKey,
    parentPageId,
  });

  if (!publishResult.ok) {
    console.error('BLOCKED: Confluence publish failed:', publishResult.stderr || publishResult.stdout);
    return 2;
  }

  const publishedTarget = await resolvePublishedTarget({
    publishMode,
    target,
    publishResult,
    resolvedPageId,
    publishSpace,
    publishTitle: resolvedTitle,
    skillRoot,
    findConfluencePageId: deps.findConfluencePageId,
  });
  if (
    publishMode === 'create_new' &&
    !publishedTarget.pageId &&
    !publishedTarget.pageUrl
  ) {
    console.error('BLOCKED: Confluence publish completed but no page identity could be resolved.');
    return 2;
  }
  await writeFile(
    join(runDir, 'context', 'confluence_target.json'),
    `${JSON.stringify(publishedTarget, null, 2)}\n`,
    'utf8'
  );

  task.overall_status = 'approved';
  task.current_phase = 'phase5';
  task.publish_mode = publishMode;
  task.confluence_target = publishedTarget;
  task.updated_at = new Date().toISOString();
  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

  console.log('PHASE5_DONE');
  return 0;
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  if (!featureKey || !runDir) {
    console.error('Usage: phase5.mjs <feature-key> <run-dir>');
    process.exit(1);
  }
  const input = {
    publish_mode: process.env.PUBLISH_MODE,
    confluence_page_id: process.env.CONFLUENCE_PAGE_ID,
    confluence_page_url: process.env.CONFLUENCE_PAGE_URL,
    publish_space: process.env.PUBLISH_SPACE,
    publish_title: process.env.PUBLISH_TITLE,
    parent_page_id: process.env.PARENT_PAGE_ID,
  };
  const code = await runPhase5(featureKey, runDir, input);
  process.exit(code);
}

if (process.argv[1]?.includes('phase5.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
