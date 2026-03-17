#!/usr/bin/env node
/**
 * Phase 6: Finalize and Feishu notification.
 */

import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

function nowIso() {
  return new Date().toISOString();
}

async function readJson(path, fallback = {}) {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function resolvePageReference(target = {}) {
  if (target.page_url) return target.page_url;
  if (target.pageUrl) return target.pageUrl;
  if (target.page_id) return `page-id:${target.page_id}`;
  if (target.pageId) return `page-id:${target.pageId}`;
  return null;
}

function buildNotificationPending({ chatId, featureKey, finalPath, pageUrl, lastError }) {
  return {
    channel: 'feishu',
    chat_id: chatId,
    feature_key: featureKey,
    final_path: finalPath,
    page_url: pageUrl || 'none',
    payload_file: '',
    last_error: lastError || 'send failed',
    recorded_at: nowIso(),
  };
}

function normalizeOptionalBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n'].includes(normalized)) return false;
  return null;
}

function resolveNotificationConfig(task) {
  const taskTarget =
    typeof task?.notification_target === 'string' ? task.notification_target.trim() : '';
  const envTarget = process.env.FEISHU_CHAT_ID || '';
  return {
    chatId: taskTarget || envTarget,
    skipNotification: normalizeOptionalBoolean(task?.skip_notification) === true,
  };
}

async function readConfluenceTarget(runDir, task) {
  if (task?.publish_mode === 'skip') {
    return {};
  }
  const fileTarget = await readJson(join(runDir, 'context', 'confluence_target.json'));
  return {
    ...fileTarget,
    ...(task?.confluence_target || {}),
  };
}

async function sendFeishuNotification({ chatId, finalPath, pageUrl, runDir, notifyFeishu }) {
  if (!chatId && !notifyFeishu) {
    return { ok: true, skipped: true };
  }

  if (notifyFeishu) {
    return notifyFeishu({ chatId, finalPath, pageUrl, runDir });
  }

  const { spawnSync } = await import('node:child_process');
  const scriptPath = new URL('../notify_feishu.sh', import.meta.url);
  const result = spawnSync(
    'bash',
    [scriptPath.pathname, chatId, finalPath, pageUrl || 'none', runDir],
    { encoding: 'utf8' }
  );

  return {
    ok: result.status === 0,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

export async function runPhase6(featureKey, runDir, deps = {}) {
  const draftPath = join(runDir, 'drafts', `${featureKey}_QA_SUMMARY_DRAFT.md`);
  const finalPath = join(runDir, `${featureKey}_QA_SUMMARY_FINAL.md`);
  const taskPath = join(runDir, 'task.json');
  const task = await readJson(taskPath);
  const { chatId, skipNotification } = resolveNotificationConfig(task);

  await copyFile(draftPath, finalPath);

  const confluenceTarget = await readConfluenceTarget(runDir, task);
  const pageReference = resolvePageReference(confluenceTarget);

  const finalAbsPath = join(runDir, `${featureKey}_QA_SUMMARY_FINAL.md`);
  console.log(`FEISHU_NOTIFY: chat_id=${chatId} feature=${featureKey} final=${finalAbsPath} page=${pageReference || 'none'}`);

  const notifyResult = skipNotification
    ? { ok: true, skipped: true }
    : await sendFeishuNotification({
        chatId,
        finalPath: finalAbsPath,
        pageUrl: pageReference || 'none',
        runDir,
        notifyFeishu: deps.notifyFeishu,
      });

  task.overall_status = 'completed';
  task.current_phase = 'phase6';
  task.notification_status = notifyResult.ok
    ? notifyResult.skipped ? 'skipped' : 'sent'
    : 'pending';
  task.updated_at = nowIso();
  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

  const runPath = join(runDir, 'run.json');
  const run = await readJson(runPath);
  if (notifyResult.ok) {
    run.notification_pending = null;
  } else {
    run.notification_pending = buildNotificationPending({
      chatId,
      featureKey,
      finalPath: finalAbsPath,
      pageUrl: pageReference,
      lastError: notifyResult.stderr || notifyResult.stdout,
    });
  }
  run.confluence_published_at = pageReference ? nowIso() : null;
  run.updated_at = nowIso();
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  console.log('PHASE6_DONE');
  return 0;
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  if (!featureKey || !runDir) {
    console.error('Usage: phase6.mjs <feature-key> <run-dir>');
    process.exit(1);
  }
  const code = await runPhase6(featureKey, runDir);
  process.exit(code);
}

if (process.argv[1]?.includes('phase6.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
