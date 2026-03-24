/**
 * Shell-compatible .env loader for benchmark scripts.
 *
 * Node's --env-file has known parsing quirks that can produce different values than
 * shell `source .env` (e.g. API keys). Use this loader so benchmarks behave the same
 * whether run via npm or shell.
 *
 * @param {string} skillRoot - Path to qa-plan-orchestrator (parent of .env)
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadEnv(skillRoot) {
  const path = resolve(skillRoot, '.env');
  if (!existsSync(path)) return;
  const raw = readFileSync(path, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1);
    // Shell-style: trim outer quotes, unescape inner
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
    } else {
      val = val.trim();
    }
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}
