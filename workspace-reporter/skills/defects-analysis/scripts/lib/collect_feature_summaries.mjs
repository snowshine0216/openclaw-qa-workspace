#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function releaseVersionFromDir(releaseRunDir) {
  return basename(releaseRunDir).replace(/^release_/, '');
}

export function collectFeatureSummaries({ releaseRunDir, features }) {
  const collected = features.map((feature) => {
    const featureSummary =
      safeReadJson(feature.feature_summary_path ?? join(feature.canonical_run_dir, 'context', 'feature_summary.json')) ?? {};
    return {
      ...featureSummary,
      feature_key: feature.feature_key,
      feature_title: featureSummary.feature_title ?? feature.feature_key,
      report_final_path:
        feature.report_final_path ??
        featureSummary.report_final_path ??
        join(feature.canonical_run_dir, `${feature.feature_key}_REPORT_FINAL.md`),
      feature_summary_path:
        feature.feature_summary_path ?? join(feature.canonical_run_dir, 'context', 'feature_summary.json'),
      canonical_run_dir: feature.canonical_run_dir,
      selected_action: feature.selected_action ?? feature.default_action,
      release_packet_dir: feature.release_packet_dir,
    };
  });

  const payload = {
    release_version: releaseVersionFromDir(releaseRunDir),
    features: collected,
  };

  writeFileSync(
    join(releaseRunDir, 'context', 'release_summary_inputs.json'),
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8',
  );
  return payload;
}

function main() {
  const [releaseRunDir, featuresJson] = process.argv.slice(2);
  if (!releaseRunDir || !featuresJson) {
    console.error('Usage: collect_feature_summaries.mjs <release-run-dir> <features-json>');
    process.exit(1);
  }
  const payload = collectFeatureSummaries({
    releaseRunDir,
    features: JSON.parse(featuresJson),
  });
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
