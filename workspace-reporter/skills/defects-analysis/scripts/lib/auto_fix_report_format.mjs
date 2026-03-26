#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function featureTitle(runDir) {
  return safeReadJson(join(runDir, 'context', 'feature_metadata.json'))?.feature_title ?? '';
}

function normalizeDraft(draft) {
  let next = draft.replace(/\r\n/g, '\n');
  if (!next.endsWith('\n')) {
    next = `${next}\n`;
  }
  return next;
}

function normalizeFeatureTitleCallout(draft, title) {
  if (!title) {
    return draft;
  }
  return draft.replace(
    /^Feature Title:\s*(.+)$/m,
    (_match, capturedTitle) => `**Feature Title:** ${capturedTitle || title}`,
  );
}

export function autoFixReportFormat(runDir, runKey) {
  const draftPath = join(runDir, `${runKey}_REPORT_DRAFT.md`);
  const original = readFileSync(draftPath, 'utf8');
  const normalized = normalizeDraft(original);
  const fixed = normalizeFeatureTitleCallout(normalized, featureTitle(runDir));
  if (fixed === original) {
    return 'unchanged';
  }
  writeFileSync(draftPath, fixed, 'utf8');
  return 'changed';
}

function main() {
  const [runDir, runKey] = process.argv.slice(2);
  if (!runDir || !runKey) {
    console.error('Usage: auto_fix_report_format.mjs <run-dir> <run-key>');
    process.exit(1);
  }
  process.stdout.write(`${autoFixReportFormat(runDir, runKey)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
