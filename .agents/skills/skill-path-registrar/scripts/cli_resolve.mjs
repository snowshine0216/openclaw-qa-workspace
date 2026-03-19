#!/usr/bin/env node
/**
 * CLI for resolving shared skill script paths. Used by bash scripts.
 *
 * Usage: node cli_resolve.mjs <skill-name> <script-relative-path> [--require-confirm]
 * Example: node cli_resolve.mjs jira-cli scripts/jira-run.sh
 *
 * Output: absolute path on success, or JSON with needUserConfirm on failure when --require-confirm.
 * Exit: 0 with path, 1 when not found (or needUserConfirm when --require-confirm).
 */

import { resolveSharedSkill } from '../lib/resolveSharedSkill.mjs';
import { findRepoRoot } from '../lib/findRepoRoot.mjs';

async function main() {
  const args = process.argv.slice(2);
  const requireConfirm = args.includes('--require-confirm');
  const filtered = args.filter((a) => a !== '--require-confirm');
  const [skillName, scriptRelativePath] = filtered;

  if (!skillName || !scriptRelativePath) {
    console.error('Usage: node cli_resolve.mjs <skill-name> <script-relative-path> [--require-confirm]');
    process.exit(2);
  }

  const repoRoot = process.env.REPO_ROOT || (await findRepoRoot(process.cwd()));
  const result = await resolveSharedSkill(skillName, scriptRelativePath, {
    repoRoot,
    requireUserConfirm: requireConfirm,
  });

  if (typeof result === 'string') {
    console.log(result);
    process.exit(0);
  }

  if (result && result.needUserConfirm) {
    if (requireConfirm) {
      console.log(JSON.stringify(result));
      process.exit(1);
    }
  }

  process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(2);
});
