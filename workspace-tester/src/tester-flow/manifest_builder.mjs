#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function toPosix(inputPath) {
  return inputPath.split(path.sep).join('/');
}

function walkMarkdownFiles(baseDir) {
  if (!fs.existsSync(baseDir)) {
    return [];
  }
  const output = [];
  const stack = [baseDir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && fullPath.endsWith('.md')) {
        output.push(fullPath);
      }
    }
  }
  return output.sort();
}

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function inferScenarioId(relativeSpecPath) {
  return relativeSpecPath
    .replace(/\.md$/i, '')
    .split(/[\\/]+/)
    .filter(Boolean)
    .join('--')
    .toLowerCase();
}

export function buildSpecManifest({
  workItemKey,
  intakeDir,
  targetRoot,
  workspaceRoot,
}) {
  const files = walkMarkdownFiles(intakeDir);
  const specs = files.map((sourcePath) => {
    const stat = fs.statSync(sourcePath);
    const relativeFromIntake = toPosix(path.relative(intakeDir, sourcePath));
    const scenarioId = inferScenarioId(relativeFromIntake);
    const relativeNoExt = relativeFromIntake.replace(/\.md$/i, '');
    const targetSpecAbsPath = path.join(targetRoot, `${relativeNoExt}.spec.ts`);

    return {
      source_path: toPosix(path.relative(workspaceRoot, sourcePath)),
      source_abs_path: toPosix(sourcePath),
      hash: hashFile(sourcePath),
      modified_utc: stat.mtime.toISOString(),
      scenario_id: scenarioId,
      target_spec_path: toPosix(path.relative(workspaceRoot, targetSpecAbsPath)),
      target_abs_path: toPosix(targetSpecAbsPath),
    };
  });

  return {
    work_item_key: workItemKey,
    generated_at: new Date().toISOString(),
    spec_count: specs.length,
    specs,
  };
}
