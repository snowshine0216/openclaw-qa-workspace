import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SKILL_ROOT } from './paths.mjs';

export function loadBenchmarkProfiles() {
  const p = join(SKILL_ROOT, 'evals', 'evals.json');
  if (!existsSync(p)) {
    throw new Error(`Missing evals manifest: ${p}`);
  }
  const raw = JSON.parse(readFileSync(p, 'utf8'));
  return raw.benchmark_profiles ?? [];
}

export function getProfileById(profileId) {
  const profiles = loadBenchmarkProfiles();
  const p = profiles.find((x) => x.id === profileId);
  if (!p) {
    const ids = profiles.map((x) => x.id).join(', ');
    throw new Error(`Unknown benchmark_profile "${profileId}". Known: ${ids}`);
  }
  if (p.gap_sources && !Array.isArray(p.gap_sources)) {
    throw new Error(`benchmark_profile "${profileId}" must define gap_sources as an array`);
  }
  return p;
}
