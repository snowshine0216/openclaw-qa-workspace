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

async function setupReleaseRunWithFeatureContent() {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-release-report-content-'));
  await mkdir(join(runDir, 'context', 'feature_summaries'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'release_summary_inputs.json'),
    JSON.stringify({
      release_version: '26.04',
      features: [
        {
          feature_key: 'BCIN-976',
          feature_title: 'Ability to export reports from edit mode',
          risk_level: 'HIGH',
          total_defects: 5,
          open_defects: 2,
          open_high_defects: 1,
          top_risk_areas: ['Export'],
          blocking_defects: [
            {
              key: 'BCIN-7751',
              summary: 'Export fails for limited privilege users',
              priority: 'High',
              status: 'Open',
            },
          ],
          open_defect_details: [
            {
              key: 'BCIN-7751',
              summary: 'Export fails for limited privilege users',
              priority: 'High',
              status: 'Open',
            },
            {
              key: 'BCIN-7760',
              summary: 'Cancel export spinner keeps loading on workstation',
              priority: 'Medium',
              status: 'In Progress',
            },
          ],
          release_packet_dir: 'runs/release_26.04/features/BCIN-976',
        },
        {
          feature_key: 'BCIN-7289',
          feature_title: 'Embed Library Report Editor',
          risk_level: 'MEDIUM',
          total_defects: 4,
          open_defects: 1,
          open_high_defects: 0,
          top_risk_areas: ['Save / Save-As Flows'],
          blocking_defects: [],
          open_defect_details: [
            {
              key: 'BCIN-7669',
              summary: 'Save fails on translated prompts',
              priority: 'Medium',
              status: 'Open',
            },
          ],
          release_packet_dir: 'runs/release_26.04/features/BCIN-7289',
        },
      ],
    }),
    'utf8',
  );
  await writeFile(
    join(runDir, 'context', 'feature_summaries', 'BCIN-976.json'),
    JSON.stringify({ feature_title: 'Ability to export reports from edit mode' }),
    'utf8',
  );
  await writeFile(
    join(runDir, 'context', 'feature_summaries', 'BCIN-7289.json'),
    JSON.stringify({ feature_title: 'Embed Library Report Editor' }),
    'utf8',
  );
  return runDir;
}

test('section 3 table contains feature_title text when title is available', async () => {
  const runDir = await setupReleaseRunWithFeatureContent();
  try {
    const outPath = generateReleaseReport(runDir, 'release_26.04');
    const report = await readFile(outPath, 'utf8');

    const section3Match = report.match(/## 3\. Defect Breakdown by Status([\s\S]*?)(?=\n---\n\n## 4\.)/);
    assert.ok(section3Match, 'Section 3 not found');
    assert.match(section3Match[1], /Ability to export reports from edit mode/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('blocking defect summary text appears in section 5', async () => {
  const runDir = await setupReleaseRunWithFeatureContent();
  try {
    const outPath = generateReleaseReport(runDir, 'release_26.04');
    const report = await readFile(outPath, 'utf8');

    const section5Match = report.match(/## 5\. Defect Analysis by Priority([\s\S]*?)(?=\n---\n\n## 6\.)/);
    assert.ok(section5Match, 'Section 5 not found');
    assert.match(section5Match[1], /Export fails for limited privilege users/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 12 contains actual defect data instead of only packet directory paths', async () => {
  const runDir = await setupReleaseRunWithFeatureContent();
  try {
    const outPath = generateReleaseReport(runDir, 'release_26.04');
    const report = await readFile(outPath, 'utf8');

    const section12Match = report.match(/## 12\. Appendix: Defect Reference List([\s\S]*)$/);
    assert.ok(section12Match, 'Section 12 not found');
    assert.match(section12Match[1], /BCIN-7751/);
    assert.match(section12Match[1], /Export fails for limited privilege users/);
    assert.doesNotMatch(section12Match[1], /^- .*runs\/release_26\.04\/features\//m);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});
