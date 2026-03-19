import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase6 } from '../lib/phase6.mjs';

test('copies reviewed draft to final artifact path', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Final Draft');
  await writeFile(join(runDir, 'task.json'), '{}');
  await writeFile(join(runDir, 'run.json'), '{}');
  const code = await runPhase6('BCIN-7289', runDir);
  assert.equal(code, 0);
  const { existsSync } = await import('node:fs');
  assert.ok(existsSync(join(runDir, 'BCIN-7289_QA_SUMMARY_FINAL.md')));
  const final = await readFile(join(runDir, 'BCIN-7289_QA_SUMMARY_FINAL.md'), 'utf8');
  assert.equal(final.trim(), '# Final Draft');
});

test('emits FEISHU_NOTIFY marker with final path and page placeholder', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(join(runDir, 'task.json'), '{}');
  await writeFile(join(runDir, 'run.json'), '{}');
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(
    'node',
    [
      join(import.meta.dirname, '..', 'lib', 'phase6.mjs'),
      'BCIN-7289',
      runDir,
    ],
    { encoding: 'utf8', env: { ...process.env, FEISHU_CHAT_ID: 'test-chat' } }
  );
  assert.match(result.stdout, /FEISHU_NOTIFY:/);
  assert.match(result.stdout, /BCIN-7289_QA_SUMMARY_FINAL/);
});

test('records notification_pending when Feishu delivery fails', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(join(runDir, 'task.json'), '{}');
  await writeFile(join(runDir, 'run.json'), '{}');

  const code = await runPhase6('BCIN-7289', runDir, {
    notifyFeishu: async () => ({ ok: false, stderr: 'send failed' }),
  });

  assert.equal(code, 0);
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(run.notification_pending.channel, 'feishu');
  assert.equal(run.notification_pending.feature_key, 'BCIN-7289');
});

test('clears notification_pending after successful Feishu delivery', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(join(runDir, 'task.json'), '{}');
  await writeFile(
    join(runDir, 'run.json'),
    JSON.stringify({
      notification_pending: { channel: 'feishu', feature_key: 'BCIN-7289' },
    })
  );

  const code = await runPhase6('BCIN-7289', runDir, {
    notifyFeishu: async () => ({ ok: true }),
  });

  assert.equal(code, 0);
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(run.notification_pending, null);
});

test('skips notification delivery when the run requested skip_notification', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ skip_notification: true, notification_target: 'task-chat' })
  );
  await writeFile(join(runDir, 'run.json'), '{}');

  let called = false;
  const code = await runPhase6('BCIN-7289', runDir, {
    notifyFeishu: async () => {
      called = true;
      return { ok: true };
    },
  });

  assert.equal(code, 0);
  assert.equal(called, false);
});

test('uses per-run notification_target instead of only FEISHU_CHAT_ID', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ notification_target: 'task-chat', skip_notification: false })
  );
  await writeFile(join(runDir, 'run.json'), '{}');

  let deliveredChatId = null;
  const originalChatId = process.env.FEISHU_CHAT_ID;
  process.env.FEISHU_CHAT_ID = 'env-chat';
  try {
    const code = await runPhase6('BCIN-7289', runDir, {
      notifyFeishu: async ({ chatId }) => {
        deliveredChatId = chatId;
        return { ok: true };
      },
    });

    assert.equal(code, 0);
    assert.equal(deliveredChatId, 'task-chat');
  } finally {
    if (originalChatId === undefined) {
      delete process.env.FEISHU_CHAT_ID;
    } else {
      process.env.FEISHU_CHAT_ID = originalChatId;
    }
  }
});

test('refreshes notification_pending metadata on repeated notification failures', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ notification_target: 'updated-chat' })
  );
  await writeFile(
    join(runDir, 'run.json'),
    JSON.stringify({
      notification_pending: {
        channel: 'feishu',
        chat_id: 'stale-chat',
        feature_key: 'BCIN-7289',
        final_path: '/tmp/old-final.md',
        page_url: 'none',
        payload_file: '',
        last_error: 'stale error',
        recorded_at: '2026-01-01T00:00:00.000Z',
      },
    })
  );

  const code = await runPhase6('BCIN-7289', runDir, {
    notifyFeishu: async () => ({ ok: false, stderr: 'still failing' }),
  });

  assert.equal(code, 0);
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(run.notification_pending.chat_id, 'updated-chat');
  assert.match(run.notification_pending.final_path, /BCIN-7289_QA_SUMMARY_FINAL\.md$/);
  assert.equal(run.notification_pending.last_error, 'still failing');
});

test('preserves page-id publishes in phase6 metadata when no pageUrl is present', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(
    join(runDir, 'context', 'confluence_target.json'),
    JSON.stringify({ pageId: '12345' })
  );
  await writeFile(join(runDir, 'task.json'), '{}');
  await writeFile(join(runDir, 'run.json'), '{}');

  let deliveredPageUrl = null;
  const code = await runPhase6('BCIN-7289', runDir, {
    notifyFeishu: async ({ pageUrl }) => {
      deliveredPageUrl = pageUrl;
      return { ok: true };
    },
  });

  assert.equal(code, 0);
  assert.equal(deliveredPageUrl, 'page-id:12345');

  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.ok(run.confluence_published_at);
});

test('finalizes create_new publishes from task metadata when context target lacks page identity', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(
    join(runDir, 'context', 'confluence_target.json'),
    JSON.stringify({ publishSpace: 'ENG', publishTitle: 'QA Summary Title' })
  );
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      confluence_target: {
        pageId: '67890',
        publishSpace: 'ENG',
        publishTitle: 'QA Summary Title',
      },
    })
  );
  await writeFile(join(runDir, 'run.json'), '{}');

  let deliveredPageUrl = null;
  const code = await runPhase6('BCIN-7289', runDir, {
    notifyFeishu: async ({ pageUrl }) => {
      deliveredPageUrl = pageUrl;
      return { ok: true };
    },
  });

  assert.equal(code, 0);
  assert.equal(deliveredPageUrl, 'page-id:67890');

  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.ok(run.confluence_published_at);
});

test('ignores stale Confluence targets when the current run skipped publish', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase6-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), '# Draft');
  await writeFile(
    join(runDir, 'context', 'confluence_target.json'),
    JSON.stringify({ pageId: '12345', pageUrl: 'https://example/wiki/pages/12345' })
  );
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      publish_mode: 'skip',
      confluence_target: {
        pageId: '12345',
        pageUrl: 'https://example/wiki/pages/12345',
      },
    })
  );
  await writeFile(
    join(runDir, 'run.json'),
    JSON.stringify({ confluence_published_at: '2026-01-01T00:00:00.000Z' })
  );

  let deliveredPageUrl = null;
  const code = await runPhase6('BCIN-7289', runDir, {
    notifyFeishu: async ({ pageUrl }) => {
      deliveredPageUrl = pageUrl;
      return { ok: true };
    },
  });

  assert.equal(code, 0);
  assert.equal(deliveredPageUrl, 'none');

  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(run.confluence_published_at, null);
});
