import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { validateReportBundle } from '../lib/report_bundle_validator.mjs';

test('accepts complete report bundles', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-bundle-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'BCIN-5809_REPORT_DRAFT.md'), '# Draft\n');
  await writeFile(join(runDir, 'BCIN-5809_REVIEW_SUMMARY.md'), '## Review Result: pass\n');
  await writeFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), '# Final\n');
  await writeFile(join(runDir, 'task.json'), '{}');
  await writeFile(join(runDir, 'run.json'), '{}');
  await writeFile(join(runDir, 'context', 'route_decision.json'), '{}');
  await writeFile(join(runDir, 'context', 'runtime_setup_BCIN-5809.json'), '{}');

  const result = await validateReportBundle('BCIN-5809', runDir);
  assert.equal(result.valid, true);

  await rm(runDir, { recursive: true, force: true });
});

test('rejects incomplete report bundles', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-bundle-'));
  await writeFile(join(runDir, 'BCIN-5809_REPORT_DRAFT.md'), '# Draft\n');

  await assert.rejects(() => validateReportBundle('BCIN-5809', runDir), /Missing required artifacts/);

  await rm(runDir, { recursive: true, force: true });
});
