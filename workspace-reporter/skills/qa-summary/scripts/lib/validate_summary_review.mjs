#!/usr/bin/env node
/**
 * Validate the LLM self-review verdict for Phase 3 (draft generation) and Phase 4 (review).
 *
 * CLI: validate_summary_review.mjs <run-dir> <phase>
 *   <phase> is "phase3" or "phase4"
 *
 * Reads context/phase3_review_delta.md or context/phase4_review_delta.md.
 * Prints REVIEW_ACCEPTED or REVIEW_RETURN:<round> and updates task.json.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function parseVerdict(content, phase) {
  const verdictMatch = content.match(/##\s+Verdict\s*\n([\s\S]*?)(?:\n##|$)/i);
  if (!verdictMatch) return { verdict: null };

  const section = verdictMatch[1];
  if (/^\s*-\s*accept\s*$/im.test(section)) return { verdict: 'accept' };
  if (new RegExp(`^\\s*-\\s*return\\s+${phase}\\s*$`, 'im').test(section)) {
    return { verdict: `return ${phase}` };
  }
  return { verdict: null };
}

export function updateTaskForRerun(task, phase, newRound) {
  const roundKey = `${phase}_round`;
  return { ...task, return_to_phase: phase, [roundKey]: newRound };
}

async function main() {
  const [runDir, phase] = process.argv.slice(2);
  if (!runDir || !phase) {
    process.stderr.write('Usage: validate_summary_review.mjs <run-dir> <phase>\n');
    process.exit(1);
  }
  if (phase !== 'phase3' && phase !== 'phase4') {
    process.stderr.write('phase must be "phase3" or "phase4"\n');
    process.exit(1);
  }

  const deltaPath = join(runDir, 'context', `${phase}_review_delta.md`);
  let deltaContent;
  try {
    deltaContent = await readFile(deltaPath, 'utf8');
  } catch {
    process.stderr.write(`Missing ${phase}_review_delta.md at ${deltaPath}\n`);
    process.exit(1);
  }

  const { verdict } = parseVerdict(deltaContent, phase);
  if (!verdict) {
    process.stderr.write(
      `Invalid or missing verdict in ${phase}_review_delta.md — expected "- accept" or "- return ${phase}"\n`
    );
    process.exit(1);
  }

  const taskPath = join(runDir, 'task.json');
  const task = JSON.parse(await readFile(taskPath, 'utf8'));

  if (verdict === 'accept') {
    const updated = { ...task, return_to_phase: null };
    await writeFile(taskPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
    process.stdout.write('REVIEW_ACCEPTED\n');
    return;
  }

  const roundKey = `${phase}_round`;
  const currentRound = task[roundKey] ?? 0;
  const newRound = currentRound + 1;
  const updated = updateTaskForRerun(task, phase, newRound);
  await writeFile(taskPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  process.stdout.write(`REVIEW_RETURN:${newRound}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
}
