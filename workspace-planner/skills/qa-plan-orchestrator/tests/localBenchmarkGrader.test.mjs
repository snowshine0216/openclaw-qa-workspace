import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  buildLocalBenchmarkGrading,
  buildLocalGradingCorpus,
  gradeExpectation,
} from '../benchmarks/qa-plan-v2/scripts/lib/localBenchmarkGrader.mjs';

test('gradeExpectation passes canonical focus expectation on strong token overlap', () => {
  const result = gradeExpectation(
    '[phase_contract][advisory] Case focus is explicitly covered: canonical top-layer grouping without collapsing scenarios',
    { primary_phase: 'phase4b' },
    { files: [], combined: 'canonical top layer grouping without collapsing scenarios phase4b' },
  );

  assert.equal(result.passed, true);
});

test('buildLocalBenchmarkGrading scores focus and phase expectations from outputs corpus', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'local-benchmark-grader-'));
  const outputsDir = join(tmp, 'outputs');

  try {
    await mkdir(outputsDir, { recursive: true });
    await writeFile(join(outputsDir, 'result.md'), [
      '# phase4a scenario draft',
      'The draft explicitly covers prompt handling, template save, report builder loading, and visible report title outcomes.',
    ].join('\n'), 'utf8');

    const corpus = await buildLocalGradingCorpus(outputsDir);
    const grading = buildLocalBenchmarkGrading({
      primary_phase: 'phase4a',
      expectations: [
        '[phase_contract][advisory] Case focus is explicitly covered: blind scenario drafting captures prompt handling, template save, report builder loading, and visible report title outcomes',
        '[phase_contract][advisory] Output aligns with primary phase phase4a',
      ],
    }, corpus);

    assert.equal(grading.summary.total, 2);
    assert.equal(grading.summary.passed, 2);
    assert.equal(grading.summary.pass_rate, 1);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
