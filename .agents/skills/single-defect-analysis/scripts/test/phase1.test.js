import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('uses JIRA_ISSUE_JSON_OVERRIDE and writes normalized artifacts', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-phase1-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const issuePath = join(runDir, 'issue-source.json');
  await writeFile(
    issuePath,
    JSON.stringify({
      key: 'BCIN-1',
      fields: {
        summary: 'Fix defect',
        status: { name: 'Done' },
        priority: { name: 'High' },
        description: 'https://github.com/acme/repo/pull/12',
      },
    })
  );
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/phase1.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_ISSUE_JSON_OVERRIDE: issuePath },
  });
  assert.equal(r.status, 0);
  const summary = JSON.parse(await readFile(join(runDir, 'context', 'issue_summary.json'), 'utf8'));
  assert.equal(summary.issue_key, 'BCIN-1');
  await rm(runDir, { recursive: true, force: true });
});

test('extracts only PR URLs when embedded in prose', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-phase1-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const issuePath = join(runDir, 'issue-source.json');
  await writeFile(
    issuePath,
    JSON.stringify({
      key: 'BCIN-1',
      fields: {
        summary: 'Fix defect',
        status: { name: 'Done' },
        priority: { name: 'High' },
        description: 'See PR https://github.com/org/repo/pull/42 for details.',
      },
    })
  );
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/phase1.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_ISSUE_JSON_OVERRIDE: issuePath },
  });
  assert.equal(r.status, 0);
  const prLinks = JSON.parse(await readFile(join(runDir, 'context', 'pr_links.json'), 'utf8'));
  assert.deepEqual(prLinks, ['https://github.com/org/repo/pull/42']);
  await rm(runDir, { recursive: true, force: true });
});

