import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/phase4.sh');

test('writes no_pr_links marker when no PRs are present', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'pr_links.json'), '[]\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  const marker = await readFile(join(runDir, 'context', 'no_pr_links.md'), 'utf8');
  assert.match(marker, /No PR links/);

  await rm(runDir, { recursive: true, force: true });
});

test('emits spawn manifest and consolidates outputs on --post', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase4-'));
  await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'pr_links.json'),
    '["https://github.com/org/repo/pull/12"]\n',
  );

  const first = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], { encoding: 'utf8' });
  assert.equal(first.status, 0);
  assert.match(first.stdout, /SPAWN_MANIFEST:/);

  await writeFile(
    join(runDir, 'context', 'prs', 'pr-1_impact.md'),
    '# PR 12 Fix Risk Analysis\n\nRisk: Medium\nDomains: api,ui\n',
  );

  const second = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir, '--post'], {
    encoding: 'utf8',
  });
  assert.equal(second.status, 0);

  const summary = JSON.parse(
    await readFile(join(runDir, 'context', 'pr_impact_summary.json'), 'utf8'),
  );
  assert.equal(summary.pr_count, 1);

  await rm(runDir, { recursive: true, force: true });
});

test('reuses cached PR analysis during smart_refresh', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase4-smart-refresh-'));
  await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'pr_links.json'),
    '["https://github.com/org/repo/pull/12"]\n',
  );
  await writeFile(
    join(runDir, 'context', 'prs', 'pr-1_impact.md'),
    '# PR 12 Fix Risk Analysis\n\nRisk: Medium\nDomains: api,ui\n',
  );
  await writeFile(
    join(runDir, 'task.json'),
    '{"selected_mode":"smart_refresh","current_phase":"phase3_triage"}\n',
  );
  await writeFile(join(runDir, 'run.json'), '{"pr_analysis_completed_at":"2026-03-10T12:00:00Z"}\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  assert.doesNotMatch(result.stdout, /SPAWN_MANIFEST:/);
  const summary = JSON.parse(
    await readFile(join(runDir, 'context', 'pr_impact_summary.json'), 'utf8'),
  );
  assert.equal(summary.pr_count, 1);

  await rm(runDir, { recursive: true, force: true });
});

test('extracts PR number from GitHub URL when markdown omits explicit PR # marker', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase4-pr-number-'));
  await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'pr_links.json'),
    '["https://github.com/org/repo/pull/12"]\n',
  );

  const first = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], { encoding: 'utf8' });
  assert.equal(first.status, 0);
  await writeFile(
    join(runDir, 'context', 'prs', 'pr-1_impact.md'),
    'Risk: High\nPR: https://github.com/org/repo/pull/12\nRepository: repo\n',
  );

  const second = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir, '--post'], { encoding: 'utf8' });
  assert.equal(second.status, 0);

  const summary = JSON.parse(
    await readFile(join(runDir, 'context', 'pr_impact_summary.json'), 'utf8'),
  );
  assert.equal(summary.top_risky_prs[0].number, 12);

  await rm(runDir, { recursive: true, force: true });
});
