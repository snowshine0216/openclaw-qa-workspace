import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  getAvailableFeatureFamilies,
  getFamilyDefinition,
  parseFamilyArgs,
  writeFamilyArtifacts,
} from '../benchmarks/qa-plan-v2/scripts/lib/familyRunnerV2.mjs';

test('getAvailableFeatureFamilies returns sorted unique family names', () => {
  const families = getAvailableFeatureFamilies({
    tasks: [
      { feature_family: 'report-editor' },
      { feature_family: 'docs' },
      { feature_family: 'report-editor' },
    ],
  });

  assert.deepEqual(families, ['docs', 'report-editor']);
});

test('getFamilyDefinition rejects unsupported families with available names', () => {
  assert.throws(
    () => getFamilyDefinition({ tasks: [{ feature_family: 'report-editor' }] }, 'docs'),
    /Unsupported feature family: docs/,
  );
});

test('writeFamilyArtifacts writes report-editor manifest and checklist with completion status', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-family-'));
  const benchmarkRoot = join(tmp, 'benchmarks', 'qa-plan-v2');
  const iterationDir = join(benchmarkRoot, 'iteration-0');

  try {
    await mkdir(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'outputs'), { recursive: true });
    await mkdir(join(iterationDir, 'eval-1', 'without_skill', 'run-1', 'outputs'), { recursive: true });
    await mkdir(join(iterationDir, 'eval-2', 'with_skill', 'run-1', 'outputs'), { recursive: true });

    await writeFile(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'grading.json'), '{}', 'utf8');
    await writeFile(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'timing.json'), '{}', 'utf8');

    await writeFile(join(iterationDir, 'spawn_manifest.json'), JSON.stringify({
      tasks: [
        {
          eval_id: 1,
          case_id: 'REPORT-1',
          feature_id: 'BCIN-1',
          feature_family: 'report-editor',
          blocking: true,
          with_skill_runs: [
            { run_number: 1, run_dir: 'eval-1/with_skill/run-1', output_dir: 'eval-1/with_skill/run-1/outputs' },
          ],
          without_skill_runs: [
            { run_number: 1, run_dir: 'eval-1/without_skill/run-1', output_dir: 'eval-1/without_skill/run-1/outputs' },
          ],
        },
        {
          eval_id: 2,
          case_id: 'DOC-1',
          feature_id: 'DOCS',
          feature_family: 'docs',
          blocking: false,
          with_skill_runs: [
            { run_number: 1, run_dir: 'eval-2/with_skill/run-1', output_dir: 'eval-2/with_skill/run-1/outputs' },
          ],
          without_skill_runs: [],
        },
      ],
    }, null, 2), 'utf8');

    const written = await writeFamilyArtifacts({
      benchmarkRoot,
      iteration: 0,
      familyName: 'report-editor',
    });

    assert.equal(written.familyDefinition.feature_family, 'report-editor');
    assert.equal(written.taskCount, 1);
    assert.equal(written.runCount, 2);
    assert.equal(written.completedRunCount, 1);

    const manifest = JSON.parse(await readFile(written.familyManifestPath, 'utf8'));
    assert.equal(manifest.family.feature_family, 'report-editor');
    assert.equal(manifest.summary.completed_run_count, 1);
    assert.equal(manifest.tasks[0].case_id, 'REPORT-1');
    assert.equal(manifest.tasks[0].with_skill_runs[0].run_dir, 'eval-1/with_skill/run-1');

    const checklist = await readFile(written.familyChecklistPath, 'utf8');
    assert.match(checklist, /QA Plan Benchmark Family report-editor Checklist/);
    assert.match(checklist, /\*\*Completed runs:\*\* `1`/);
    assert.doesNotMatch(checklist, /DOC-1/);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('parseFamilyArgs requires family name', () => {
  assert.throws(
    () => parseFamilyArgs(['node', 'run_family.mjs']),
    /Missing required --family/,
  );
});
