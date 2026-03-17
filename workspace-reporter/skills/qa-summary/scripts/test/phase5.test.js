import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase5 } from '../lib/phase5.mjs';

test('skips Confluence mutation when publish mode is skip', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      planner_plan_resolved_path: null,
    })
  );
  const code = await runPhase5('BCIN-7289', runDir, { publish_mode: 'skip' });
  assert.equal(code, 0);
  const choice = JSON.parse(
    await readFile(join(runDir, 'context', 'publish_choice.json'), 'utf8')
  );
  assert.equal(choice.publishMode, 'skip');
});

test('reuses publish_mode persisted in task.json before defaulting to skip', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: 'update_existing',
    })
  );

  const code = await runPhase5('BCIN-7289', runDir, {});

  assert.equal(code, 2);
  const choice = JSON.parse(
    await readFile(join(runDir, 'context', 'publish_choice.json'), 'utf8')
  );
  assert.equal(choice.publishMode, 'update_existing');
});

test('blocks when no publish mode has been confirmed yet', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: null,
    })
  );

  const code = await runPhase5('BCIN-7289', runDir, {});

  assert.equal(code, 2);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.overall_status, 'approved');
});

test('reuses persisted update_existing target details on resume', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: 'update_existing',
      confluence_target: {
        pageId: '12345',
        pageUrl: 'https://example.atlassian.net/wiki/spaces/QA/pages/12345/Test',
      },
    })
  );

  let publishCall = null;
  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {},
    {
      checkRuntimeEnv: async () => ({ ok: true }),
      mergeMarkdown: async () => '# merged',
      publishToConfluence: async (args) => {
        publishCall = args;
        return { ok: true, stdout: 'page_id=67880\naction=create\n' };
      },
    }
  );

  assert.equal(code, 0);
  assert.equal(publishCall?.resolvedPageId, '12345');
});

test('reuses persisted create_new destination from confluence_target artifact', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: 'create_new',
    })
  );
  await writeFile(
    join(runDir, 'context', 'confluence_target.json'),
    JSON.stringify({
      publishSpace: 'ENG',
      publishTitle: 'QA Summary Title',
    })
  );

  let publishCall = null;
  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {},
    {
      checkRuntimeEnv: async () => ({ ok: true }),
      mergeMarkdown: async () => '# merged',
      publishToConfluence: async (args) => {
        publishCall = args;
        return { ok: true, stdout: 'page_id=67880\naction=create\n' };
      },
    }
  );

  assert.equal(code, 0);
  assert.equal(publishCall?.publishSpace, 'ENG');
  assert.equal(publishCall?.publishTitle, 'QA Summary Title');
});

test('resolves Phase 5 helper paths from the skill location when run_dir is external', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-external-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: 'create_new',
    })
  );

  let runtimeArgs = null;
  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {
      publish_mode: 'create_new',
      publish_space: 'ENG',
      publish_title: 'QA Summary Title',
    },
    {
      checkRuntimeEnv: async (args) => {
        runtimeArgs = args;
        return { ok: true };
      },
      mergeMarkdown: async () => '# merged',
      publishToConfluence: async () => ({
        ok: true,
        stdout: 'page_id=67890\naction=create\n',
      }),
    }
  );

  assert.equal(code, 0);
  assert.equal(runtimeArgs?.scriptDir, join(import.meta.dirname, '..'));
  assert.equal(runtimeArgs?.skillRoot, join(import.meta.dirname, '..', '..'));
  assert.equal(runtimeArgs?.repoRoot, undefined);
});

test('blocks when the Confluence publish helper cannot be resolved', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-missing-helper-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: 'create_new',
    })
  );

  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {
      publish_mode: 'create_new',
      publish_space: 'ENG',
      publish_title: 'QA Summary Title',
    },
    {
      checkRuntimeEnv: async () => ({ ok: true }),
      mergeMarkdown: async () => '# merged',
      resolveSharedSkillScript: async () => null,
    }
  );

  assert.equal(code, 2);
});

test('persists created page identity for create_new publishes before phase6 finalization', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: 'create_new',
    })
  );

  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {
      publish_mode: 'create_new',
      publish_space: 'ENG',
      publish_title: 'QA Summary Title',
    },
    {
      checkRuntimeEnv: async () => ({ ok: true }),
      mergeMarkdown: async () => '# merged',
      publishToConfluence: async () => ({
        ok: true,
        stdout: 'page_id=67890\naction=create\n',
      }),
    }
  );

  assert.equal(code, 0);

  const target = JSON.parse(
    await readFile(join(runDir, 'context', 'confluence_target.json'), 'utf8')
  );
  assert.equal(target.pageId, '67890');

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.confluence_target.pageId, '67890');
});

test('looks up created page id by title when create_new publish output omits it', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: 'create_new',
    })
  );

  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {
      publish_mode: 'create_new',
      publish_space: 'ENG',
      publish_title: 'QA Summary Title',
    },
    {
      checkRuntimeEnv: async () => ({ ok: true }),
      mergeMarkdown: async () => '# merged',
      publishToConfluence: async () => ({
        ok: true,
        stdout: 'page_id=\naction=create\n',
      }),
      findConfluencePageId: async ({ publishSpace, publishTitle }) => {
        assert.equal(publishSpace, 'ENG');
        assert.equal(publishTitle, 'QA Summary Title');
        return '67891';
      },
    }
  );

  assert.equal(code, 0);

  const target = JSON.parse(
    await readFile(join(runDir, 'context', 'confluence_target.json'), 'utf8')
  );
  assert.equal(target.pageId, '67891');
});

test('blocks create_new when publish succeeds but no page identity can be resolved', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'approved',
      publish_mode: 'create_new',
    })
  );

  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {
      publish_mode: 'create_new',
      publish_space: 'ENG',
      publish_title: 'QA Summary Title',
    },
    {
      checkRuntimeEnv: async () => ({ ok: true }),
      mergeMarkdown: async () => '# merged',
      publishToConfluence: async () => ({
        ok: true,
        stdout: 'page_id=\naction=create\n',
      }),
      findConfluencePageId: async () => null,
    }
  );

  assert.equal(code, 2);
});

test('blocks update_existing when page URL cannot be resolved to a Confluence page id', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ overall_status: 'approved' })
  );

  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {
      publish_mode: 'update_existing',
      confluence_page_url: 'https://example.com/not-a-confluence-page',
    },
    {
      checkRuntimeEnv: async () => ({ ok: true }),
      mergeMarkdown: async () => '# merged',
      publishToConfluence: async () => {
        assert.fail('publishToConfluence should not be called');
      },
    }
  );

  assert.equal(code, 2);
});

test('blocks update_existing when page identity is missing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ overall_status: 'approved' })
  );
  const code = await runPhase5('BCIN-7289', runDir, {
    publish_mode: 'update_existing',
    confluence_page_id: null,
    confluence_page_url: null,
  });
  assert.equal(code, 2);
});

test('blocks update_existing when merged markdown cannot safely preserve current page', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase5-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ overall_status: 'approved', planner_plan_resolved_path: null })
  );

  const code = await runPhase5(
    'BCIN-7289',
    runDir,
    {
      publish_mode: 'update_existing',
      confluence_page_id: '123',
    },
    {
      checkRuntimeEnv: async () => ({ ok: true }),
      mergeMarkdown: async () => {
        throw new Error('Unable to read existing Confluence page content for page 123');
      },
      publishToConfluence: async () => ({ ok: true }),
    }
  );

  assert.equal(code, 2);
});
