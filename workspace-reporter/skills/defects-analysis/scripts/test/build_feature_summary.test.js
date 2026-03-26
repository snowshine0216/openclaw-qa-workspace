import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { buildFeatureSummaryData } from '../lib/build_feature_summary.mjs';

test('buildFeatureSummaryData derives top risk areas from defect text when area is generic', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-build-summary-'));
  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(
      join(runDir, 'context', 'feature_metadata.json'),
      JSON.stringify({
        feature_key: 'AHSC-1972',
        feature_title: 'Auto Dash Reliability',
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'defect_index.json'),
      JSON.stringify({
        defects: [
          {
            key: 'ACSC-4918',
            summary: 'Information window layout breaks after adding visualization',
            status: 'To Do',
            priority: 'High',
            area: 'General',
          },
          {
            key: 'AHSC-2132',
            summary: 'Rich text box appears in raw Markdown format',
            status: 'Open',
            priority: 'High',
            area: 'General',
          },
          {
            key: 'AHSC-2137',
            summary: 'Asking Auto to change selector to multiple selection is not supported',
            status: 'Open',
            priority: 'High',
            area: 'General',
          },
        ],
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'pr_impact_summary.json'),
      JSON.stringify({
        pr_count: 1,
        repos_changed: ['container-ai-engine-chat-service'],
        top_risky_prs: [
          {
            repository: 'container-ai-engine-chat-service',
            number: 4094,
            risk_level: 'HIGH',
            summary: 'Touches action execution path',
          },
        ],
      }),
      'utf8',
    );

    const { summary } = buildFeatureSummaryData(runDir, 'AHSC-1972');
    assert.notDeepEqual(summary.top_risk_areas, ['General']);
    assert.ok(summary.top_risk_areas.includes('Information Window'));
    assert.ok(summary.top_risk_areas.includes('Rich Text & Narrative Content'));
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

