import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const OFFLINE_FALLBACK_MARKER =
  'offline fallback executor: generated deterministic placeholder output for local grading.';

const SECONDARY_MARKERS = [
  OFFLINE_FALLBACK_MARKER,
  'deterministic fallback executor',
  '"model": "deterministic-fallback"',
  '"executor": "deterministic-fallback"',
];

async function safeReadDir(path) {
  try {
    return await readdir(path, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function readIfExists(path) {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}

function includesOfflineFallbackMarker(...texts) {
  const haystack = texts.join('\n');
  return SECONDARY_MARKERS.some((marker) => haystack.includes(marker));
}

export async function collectOfflineFallbackRunDirs(iterationRoot) {
  const matches = new Set();
  const evalDirs = (await safeReadDir(iterationRoot)).filter(
    (entry) => entry.isDirectory() && entry.name.startsWith('eval-'),
  );

  for (const evalDir of evalDirs) {
    for (const configuration of ['with_skill', 'without_skill', 'new_skill', 'old_skill']) {
      const configDir = join(iterationRoot, evalDir.name, configuration);
      const runDirs = (await safeReadDir(configDir)).filter(
        (entry) => entry.isDirectory() && entry.name.startsWith('run-'),
      );
      for (const runDir of runDirs) {
        const runRoot = join(configDir, runDir.name);
        const notes = await readIfExists(join(runRoot, 'outputs', 'execution_notes.md'));
        const metrics = await readIfExists(join(runRoot, 'outputs', 'metrics.json'));
        if (includesOfflineFallbackMarker(notes, metrics)) {
          matches.add(runRoot);
        }
      }
    }
  }

  return matches;
}
