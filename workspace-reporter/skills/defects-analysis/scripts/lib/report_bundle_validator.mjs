#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function assertReadable(path) {
  await access(path, constants.R_OK);
}

export async function validateReportBundle(runKey, runDir) {
  const required = [
    `${runKey}_REPORT_DRAFT.md`,
    `${runKey}_REPORT_FINAL.md`,
    'task.json',
    'run.json',
    'context/route_decision.json',
    `context/runtime_setup_${runKey}.json`,
    'context/report_review_delta.md',
    'context/report_review_notes.md',
  ];

  const missing = [];
  for (const file of required) {
    const fullPath = join(runDir, file);
    try {
      await assertReadable(fullPath);
    } catch {
      missing.push(file);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required artifacts: ${missing.join(', ')}`);
  }

  const reviewDelta = await readFile(join(runDir, 'context', 'report_review_delta.md'), 'utf8');
  if (!/^\s*-\s*accept\s*$/im.test(reviewDelta)) {
    throw new Error('Review delta does not contain an accept verdict');
  }

  return {
    valid: true,
    required,
    review_status: 'accept',
  };
}

async function main() {
  const [runKey, runDir] = process.argv.slice(2);
  if (!runKey || !runDir) {
    console.error('Usage: report_bundle_validator.mjs <run-key> <run-dir>');
    process.exit(1);
  }
  const result = await validateReportBundle(runKey, runDir);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
