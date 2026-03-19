import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/phase3.sh');

test('normalizes defects and extracts unique pr links', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase3-'));
  await mkdir(join(runDir, 'context', 'jira_issues'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BUG-1',
          fields: {
            summary: 'Panel hides unexpectedly',
            description: 'Fix in https://github.com/org/repo/pull/12',
            status: { name: 'Resolved' },
            priority: { name: 'High' },
            assignee: { displayName: 'Ada' },
            resolutiondate: '2026-03-10T12:00:00.000+0000',
            comment: {
              comments: [{ body: 'Duplicate mention https://github.com/org/repo/pull/12' }],
            },
          },
        },
      ],
    }),
  );

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  const index = JSON.parse(await readFile(join(runDir, 'context', 'defect_index.json'), 'utf8'));
  const links = JSON.parse(await readFile(join(runDir, 'context', 'pr_links.json'), 'utf8'));
  assert.equal(index.defects.length, 1);
  assert.deepEqual(links, ['https://github.com/org/repo/pull/12']);

  await rm(runDir, { recursive: true, force: true });
});
