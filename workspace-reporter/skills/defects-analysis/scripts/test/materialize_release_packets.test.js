import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { materializeReleasePackets } from '../lib/materialize_release_packets.mjs';

test('materializeReleasePackets copies final report and feature summary into release-scoped packet dirs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'defects-analysis-release-packets-'));
  try {
    const featureRunDir = join(root, 'runs', 'BCIN-7289');
    const releaseRunDir = join(root, 'runs', 'release_26.04');
    await mkdir(join(featureRunDir, 'context'), { recursive: true });
    await mkdir(join(releaseRunDir, 'context'), { recursive: true });
    await writeFile(
      join(featureRunDir, 'BCIN-7289_REPORT_FINAL.md'),
      '# Final feature report\n',
      'utf8',
    );
    await writeFile(
      join(featureRunDir, 'context', 'feature_summary.json'),
      JSON.stringify({
        feature_key: 'BCIN-7289',
        feature_title: 'Embed Library Report Editor',
      }),
      'utf8',
    );

    const packets = await materializeReleasePackets({
      releaseRunDir,
      features: [
        {
          feature_key: 'BCIN-7289',
          canonical_run_dir: featureRunDir,
          report_final_path: join(featureRunDir, 'BCIN-7289_REPORT_FINAL.md'),
          feature_summary_path: join(featureRunDir, 'context', 'feature_summary.json'),
        },
      ],
    });

    assert.equal(packets.length, 1);
    const packetDir = join(releaseRunDir, 'features', 'BCIN-7289');
    const manifest = JSON.parse(await readFile(join(packetDir, 'packet_manifest.json'), 'utf8'));
    const copiedReport = await readFile(join(packetDir, 'BCIN-7289_REPORT_FINAL.md'), 'utf8');
    const copiedSummary = JSON.parse(await readFile(join(packetDir, 'feature_summary.json'), 'utf8'));

    assert.equal(manifest.feature_key, 'BCIN-7289');
    assert.match(copiedReport, /Final feature report/);
    assert.equal(copiedSummary.feature_title, 'Embed Library Report Editor');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
