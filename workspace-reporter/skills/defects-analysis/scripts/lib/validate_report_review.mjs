import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function parseVerdict(content) {
  const verdictMatch = content.match(/##\s+Verdict\s*\n([\s\S]*?)(?:\n##|$)/i);
  if (!verdictMatch) return { verdict: null };

  const section = verdictMatch[1];
  if (/^\s*-\s*accept\s*$/im.test(section)) return { verdict: 'accept' };
  if (/^\s*-\s*return\s+phase5\s*$/im.test(section)) return { verdict: 'return phase5' };
  return { verdict: null };
}

export function updateTaskForRerun(task, newRound) {
  return { ...task, return_to_phase: 'phase5', phase5_round: newRound };
}

async function main() {
  const [runDir, runKey] = process.argv.slice(2);
  if (!runDir || !runKey) {
    process.stderr.write('Usage: validate_report_review.mjs <run-dir> <run-key>\n');
    process.exit(1);
  }

  const deltaPath = join(runDir, 'context', 'report_review_delta.md');
  let deltaContent;
  try {
    deltaContent = await readFile(deltaPath, 'utf8');
  } catch {
    process.stderr.write(`Missing report_review_delta.md at ${deltaPath}\n`);
    process.exit(1);
  }

  const { verdict } = parseVerdict(deltaContent);
  if (!verdict) {
    process.stderr.write(`Invalid or missing verdict in report_review_delta.md — expected "- accept" or "- return phase5"\n`);
    process.exit(1);
  }

  const taskPath = join(runDir, 'task.json');
  const task = JSON.parse(await readFile(taskPath, 'utf8'));

  if (verdict === 'accept') {
    const updated = { ...task, return_to_phase: null };
    await writeFile(taskPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
    process.stdout.write('REPORT_REVIEW_ACCEPTED\n');
    return;
  }

  // verdict === 'return phase5'
  const currentRound = task.phase5_round ?? 0;
  const newRound = currentRound + 1;
  const updated = updateTaskForRerun(task, newRound);
  await writeFile(taskPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  process.stdout.write(`REPORT_REVIEW_RETURN:${newRound}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
}
