import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { validateReportBundle } from '../lib/report_bundle_validator.mjs';

async function makeValidBundle(runDir) {
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'BCIN-5809_REPORT_DRAFT.md'), '# Draft\n');
  await writeFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), '# Final\n');
  await writeFile(join(runDir, 'task.json'), '{}');
  await writeFile(join(runDir, 'run.json'), '{}');
  await writeFile(join(runDir, 'context', 'route_decision.json'), '{}');
  await writeFile(join(runDir, 'context', 'runtime_setup_BCIN-5809.json'), '{}');
  await writeFile(join(runDir, 'context', 'report_review_delta.md'), '## Verdict\n\n- accept\n');
  await writeFile(join(runDir, 'context', 'report_review_notes.md'), '## Report Review Notes\n\n### C1\n**Verdict**: pass\n');
}

test('accepts complete report bundles with accept verdict', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-bundle-'));
  await makeValidBundle(runDir);

  const result = await validateReportBundle('BCIN-5809', runDir);
  assert.equal(result.valid, true);
  assert.equal(result.review_status, 'accept');

  await rm(runDir, { recursive: true, force: true });
});

test('rejects incomplete report bundles', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-bundle-'));
  await writeFile(join(runDir, 'BCIN-5809_REPORT_DRAFT.md'), '# Draft\n');

  await assert.rejects(() => validateReportBundle('BCIN-5809', runDir), /Missing required artifacts/);

  await rm(runDir, { recursive: true, force: true });
});

test('rejects bundle when review delta does not have accept verdict', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-bundle-fail-'));
  await makeValidBundle(runDir);
  // Overwrite delta with non-accept verdict
  await writeFile(
    join(runDir, 'context', 'report_review_delta.md'),
    '## Verdict\n\n- return phase5\n',
  );

  await assert.rejects(
    () => validateReportBundle('BCIN-5809', runDir),
    /Review delta does not contain an accept verdict/,
  );

  await rm(runDir, { recursive: true, force: true });
});
