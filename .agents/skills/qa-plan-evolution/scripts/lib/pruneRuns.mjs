import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SKILL_ROOT } from './paths.mjs';

function parsePositiveInt(raw, fallback) {
  const parsed = Number.parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function parseNonNegativeInt(raw, fallback) {
  const parsed = Number.parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

function normalizeProtectSet(protectRunKeys = []) {
  return new Set(
    (Array.isArray(protectRunKeys) ? protectRunKeys : [protectRunKeys])
      .filter(Boolean)
      .map((key) => String(key)),
  );
}

function listRunDirs(runsRoot) {
  if (!existsSync(runsRoot)) {
    return [];
  }
  return readdirSync(runsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const fullPath = join(runsRoot, entry.name);
      return {
        runKey: entry.name,
        fullPath,
        mtimeMs: statSync(fullPath).mtimeMs,
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs || a.runKey.localeCompare(b.runKey));
}

export function pruneRunDirs({
  runsRoot = join(SKILL_ROOT, 'runs'),
  keepCount = 3,
  dryRun = false,
  protectRunKeys = [],
  minAgeMs = 60 * 60 * 1000,
} = {}) {
  const resolvedRunsRoot = resolve(runsRoot);
  const normalizedKeepCount = parsePositiveInt(keepCount, 3);
  const normalizedMinAgeMs = Math.max(0, Number(minAgeMs) || 0);
  const protectedKeys = normalizeProtectSet(protectRunKeys);
  const runDirs = listRunDirs(resolvedRunsRoot);
  const selected = new Set(runDirs.slice(0, normalizedKeepCount).map((entry) => entry.runKey));
  const now = Date.now();

  const result = {
    runs_root: resolvedRunsRoot,
    keep_count: normalizedKeepCount,
    min_age_ms: normalizedMinAgeMs,
    dry_run: Boolean(dryRun),
    total_runs: runDirs.length,
    kept: [],
    removed: [],
    skipped: [],
    errors: [],
  };

  for (const entry of runDirs) {
    const keepReason = selected.has(entry.runKey)
      ? 'within_keep_count'
      : protectedKeys.has(entry.runKey)
        ? 'protected'
        : now - entry.mtimeMs < normalizedMinAgeMs
          ? 'too_recent'
        : null;

    if (keepReason) {
      result.kept.push(entry.runKey);
      result.skipped.push({
        run_key: entry.runKey,
        reason: keepReason,
      });
      continue;
    }

    if (result.dry_run) {
      result.removed.push(entry.runKey);
      continue;
    }

    try {
      rmSync(entry.fullPath, { recursive: true, force: true });
      result.removed.push(entry.runKey);
    } catch (error) {
      result.errors.push({
        run_key: entry.runKey,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return result;
}

function parseCliArgs(argv) {
  const args = {
    keep_count: 3,
    min_age_seconds: 3600,
    dry_run: false,
    runs_root: join(SKILL_ROOT, 'runs'),
    protect_run_keys: [],
  };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--keep' || token === '--keep-count') {
      args.keep_count = parsePositiveInt(argv[index + 1], 3);
      index += 1;
      continue;
    }
    if (token === '--runs-root') {
      args.runs_root = resolve(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === '--protect-run-key') {
      const value = argv[index + 1];
      if (value) {
        args.protect_run_keys.push(value);
      }
      index += 1;
      continue;
    }
    if (token === '--min-age-seconds') {
      args.min_age_seconds = parseNonNegativeInt(argv[index + 1], 3600);
      index += 1;
      continue;
    }
    if (token === '--dry-run') {
      args.dry_run = true;
    }
  }
  return args;
}

function isDirectExecution() {
  return resolve(process.argv[1] || '') === fileURLToPath(import.meta.url);
}

if (isDirectExecution()) {
  const args = parseCliArgs(process.argv.slice(2));
  const report = pruneRunDirs({
    runsRoot: args.runs_root,
    keepCount: args.keep_count,
    minAgeMs: args.min_age_seconds * 1000,
    dryRun: args.dry_run,
    protectRunKeys: args.protect_run_keys,
  });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.errors.length > 0) {
    process.exitCode = 1;
  }
}
