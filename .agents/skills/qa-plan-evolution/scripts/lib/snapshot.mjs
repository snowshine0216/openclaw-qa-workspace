import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const EXCLUDE_DIR = new Set(['runs', 'node_modules', '.git', 'dist', 'build']);

function collectSnapshotFiles(root, prefix = '') {
  if (!existsSync(root)) {
    return [];
  }

  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    if (EXCLUDE_DIR.has(entry.name)) {
      return [];
    }
    const nextPrefix = prefix ? join(prefix, entry.name) : entry.name;
    const fullPath = join(root, entry.name);
    return entry.isDirectory()
      ? collectSnapshotFiles(fullPath, nextPrefix)
      : [nextPrefix];
  });
}

export function copySnapshotDir(src, destDir) {
  if (!existsSync(src)) {
    throw new Error(`Snapshot source not found: ${src}`);
  }
  mkdirSync(destDir, { recursive: true });
  cpSync(src, destDir, {
    recursive: true,
    filter: (s) => !s.split(/[/\\]/).some((p) => EXCLUDE_DIR.has(p)),
  });
}

export function copyChampionSnapshot(repoRoot, targetRel, destDir) {
  const src = join(repoRoot, targetRel);
  copySnapshotDir(src, destDir);
}

export function diffSnapshotDirs(baseDir, candidateDir) {
  const allFiles = new Set([
    ...collectSnapshotFiles(baseDir),
    ...collectSnapshotFiles(candidateDir),
  ]);

  return [...allFiles].sort().filter((relativePath) => {
    const basePath = join(baseDir, relativePath);
    const candidatePath = join(candidateDir, relativePath);
    if (!existsSync(basePath) || !existsSync(candidatePath)) {
      return true;
    }
    return !readFileSync(basePath).equals(readFileSync(candidatePath));
  });
}
