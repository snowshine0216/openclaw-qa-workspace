#!/usr/bin/env node
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function manifestPayload(feature) {
  const finalName = basename(feature.report_final_path);
  return {
    feature_key: feature.feature_key,
    source_run_dir: feature.canonical_run_dir,
    copied_files: [finalName, 'feature_summary.json'],
    materialized_at: new Date().toISOString(),
  };
}

export async function materializeReleasePackets({ releaseRunDir, features }) {
  const packets = [];
  for (const feature of features) {
    const packetDir = feature.release_packet_dir ?? join(releaseRunDir, 'features', feature.feature_key);
    await mkdir(packetDir, { recursive: true });
    await copyFile(feature.report_final_path, join(packetDir, basename(feature.report_final_path)));
    await copyFile(feature.feature_summary_path, join(packetDir, 'feature_summary.json'));
    const manifest = manifestPayload(feature);
    await writeFile(join(packetDir, 'packet_manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    packets.push({
      ...feature,
      release_packet_dir: packetDir,
      packet_manifest_path: join(packetDir, 'packet_manifest.json'),
    });
  }
  return packets;
}

async function main() {
  const [releaseRunDir, featuresJson] = process.argv.slice(2);
  if (!releaseRunDir || !featuresJson) {
    console.error('Usage: materialize_release_packets.mjs <release-run-dir> <features-json>');
    process.exit(1);
  }
  const packets = await materializeReleasePackets({
    releaseRunDir,
    features: JSON.parse(featuresJson),
  });
  process.stdout.write(`${JSON.stringify(packets, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
