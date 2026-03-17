#!/usr/bin/env node
/**
 * Find repository root by walking up from startDir until .agents or AGENTS.md is found.
 */

import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const REPO_MARKERS = ['.agents', 'AGENTS.md'];

/**
 * Find repository root by walking up from startDir.
 * @param {string} startDir - Directory to start from (default: process.cwd())
 * @returns {Promise<string|null>} Absolute path to repo root, or null if not found
 */
export async function findRepoRoot(startDir = process.cwd()) {
  let current = resolve(startDir);

  while (current) {
    for (const marker of REPO_MARKERS) {
      try {
        await access(join(current, marker), constants.F_OK);
        return current;
      } catch {
        /* continue */
      }
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}

import { accessSync as fsAccessSync } from 'node:fs';

/**
 * Synchronous version using accessSync.
 * @param {string} startDir - Directory to start from
 * @param {{ accessSync?: (p: string, mode?: number) => void }} [opts] - Optional accessSync
 * @returns {string|null} Absolute path to repo root, or null if not found
 */
export function findRepoRootSync(startDir = process.cwd(), opts = {}) {
  const syncFn = opts.accessSync ?? fsAccessSync;
  let current = resolve(startDir);

  while (current) {
    for (const marker of REPO_MARKERS) {
      try {
        syncFn(join(current, marker), constants.F_OK);
        return current;
      } catch {
        /* continue */
      }
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}
