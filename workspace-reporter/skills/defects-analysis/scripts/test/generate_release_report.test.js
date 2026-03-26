import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { generateReleaseReport } from '../lib/generate_release_report.mjs';

test('generateReleaseReport builds aggregate risk ranking and feature packet links from feature summaries', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-release-report-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(
      join(runDir, 'context', 'release_summary_inputs.json'),
      JSON.stringify({
        release_version: '26.04',
        features: [
          {
            feature_key: 'BCIN-7289',
            feature_title: 'Embed Library Report Editor',
            risk_level: 'HIGH',
            total_defects: 26,
            open_defects: 13,
            open_high_defects: 5,
            top_risk_areas: ['Save / Save-As Flows', 'Prompt Handling'],
            blocking_defects: ['BCIN-7669'],
            release_packet_dir: 'runs/release_26.04/features/BCIN-7289',
          },
          {
            feature_key: 'BCIN-976',
            feature_title: 'Library report foundation',
            risk_level: 'MEDIUM',
            total_defects: 8,
            open_defects: 3,
            open_high_defects: 0,
            top_risk_areas: ['Formatting'],
            blocking_defects: [],
            release_packet_dir: 'runs/release_26.04/features/BCIN-976',
          },
        ],
      }),
      'utf8',
    );

    const outPath = generateReleaseReport(runDir, 'release_26.04');
    const report = await readFile(outPath, 'utf8');

    assert.match(report, /Release Defect Analysis Report/);
    assert.match(report, /BCIN-7289/);
    assert.match(report, /BCIN-976/);
    assert.match(report, /Blocking Features/);
    assert.match(report, /Save \/ Save-As Flows/);
    assert.match(report, /runs\/release_26.04\/features\/BCIN-7289/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});
