import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  getBatchDefinition,
  writeBatchArtifacts,
} from '../benchmarks/qa-plan-v2/scripts/lib/batchRunnerV2.mjs';

test('getBatchDefinition returns batch 1 with blocking blind eval ids', () => {
  const batch = getBatchDefinition(1);

  assert.equal(batch.batch_number, 1);
  assert.deepEqual(batch.eval_ids, [1, 2, 3, 23]);
  assert.match(batch.goal, /blocking blind/i);
});

test('writeBatchArtifacts writes batch manifest and checklist with completion status', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-batch-'));
  const benchmarkRoot = join(tmp, 'benchmarks', 'qa-plan-v2');
  const iterationDir = join(benchmarkRoot, 'iteration-0');

  try {
    await mkdir(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'outputs'), { recursive: true });
    await mkdir(join(iterationDir, 'eval-1', 'with_skill', 'run-2', 'outputs'), { recursive: true });
    await mkdir(join(iterationDir, 'eval-1', 'without_skill', 'run-1', 'outputs'), { recursive: true });
    await mkdir(join(iterationDir, 'eval-2', 'with_skill', 'run-1', 'outputs'), { recursive: true });

    await writeFile(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'grading.json'), '{}', 'utf8');
    await writeFile(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'timing.json'), '{}', 'utf8');

    await writeFile(join(iterationDir, 'spawn_manifest.json'), JSON.stringify({
      tasks: [
        {
          eval_id: 1,
          case_id: 'P0-IDEMPOTENCY-001',
          feature_id: 'BCIN-976',
          evidence_mode: 'blind_pre_defect',
          blocking: true,
          with_skill_runs: [
            { run_number: 1, run_dir: join(iterationDir, 'eval-1', 'with_skill', 'run-1'), output_dir: join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'outputs') },
            { run_number: 2, run_dir: join(iterationDir, 'eval-1', 'with_skill', 'run-2'), output_dir: join(iterationDir, 'eval-1', 'with_skill', 'run-2', 'outputs') },
          ],
          without_skill_runs: [
            { run_number: 1, run_dir: join(iterationDir, 'eval-1', 'without_skill', 'run-1'), output_dir: join(iterationDir, 'eval-1', 'without_skill', 'run-1', 'outputs') },
          ],
        },
        {
          eval_id: 2,
          case_id: 'P1-SUPPORT-CONTEXT-001',
          feature_id: 'BCIN-7289',
          evidence_mode: 'blind_pre_defect',
          blocking: true,
          with_skill_runs: [
            { run_number: 1, run_dir: join(iterationDir, 'eval-2', 'with_skill', 'run-1'), output_dir: join(iterationDir, 'eval-2', 'with_skill', 'run-1', 'outputs') },
          ],
          without_skill_runs: [],
        },
      ],
    }, null, 2), 'utf8');

    const written = await writeBatchArtifacts({
      benchmarkRoot,
      iteration: 0,
      batchNumber: 1,
    });

    assert.equal(written.taskCount, 2);
    assert.equal(written.runCount, 4);
    assert.equal(written.completedRunCount, 1);

    const manifest = JSON.parse(await readFile(written.batchManifestPath, 'utf8'));
    assert.equal(manifest.batch.batch_number, 1);
    assert.equal(manifest.summary.completed_run_count, 1);
    assert.equal(manifest.summary.pending_run_count, 3);

    const checklist = await readFile(written.batchChecklistPath, 'utf8');
    assert.match(checklist, /P0-IDEMPOTENCY-001/);
    assert.match(checklist, /\*\*Completed runs:\*\* `1`/);
    assert.match(checklist, /\*\*Pending runs:\*\* `3`/);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
