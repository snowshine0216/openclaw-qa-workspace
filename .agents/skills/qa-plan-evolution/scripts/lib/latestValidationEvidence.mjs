import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function listCandidateIterationDirs(runRoot) {
  const candidatesRoot = join(runRoot, 'candidates');
  if (!existsSync(candidatesRoot)) {
    return [];
  }

  return readdirSync(candidatesRoot)
    .filter((name) => /^iteration-\d+$/.test(name))
    .sort((left, right) => {
      const leftNum = Number.parseInt(left.replace('iteration-', ''), 10);
      const rightNum = Number.parseInt(right.replace('iteration-', ''), 10);
      return rightNum - leftNum;
    });
}

export function loadLatestValidationEvidence(runRoot) {
  for (const iterationDir of listCandidateIterationDirs(runRoot)) {
    const reportPath = join(runRoot, 'candidates', iterationDir, 'validation_report.json');
    if (!existsSync(reportPath)) {
      continue;
    }

    const report = JSON.parse(readFileSync(reportPath, 'utf8'));
    return {
      iteration: Number.parseInt(iterationDir.replace('iteration-', ''), 10),
      reportPath,
      report,
    };
  }

  return null;
}
