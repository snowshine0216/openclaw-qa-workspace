#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const MODE_VALUES = new Set(['planner_first', 'direct', 'provided_plan']);
const DIRECT_EXTS = new Set(['.md', '.json', '.txt']);

function toPosix(inputPath) {
  return inputPath.split(path.sep).join('/');
}

function hasGlob(input) {
  return /[*?[\]]/.test(input);
}

function escapeRegex(input) {
  return input.replace(/[.+^${}()|\\]/g, '\\$&');
}

function globToRegex(pattern) {
  let regex = '';
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    const next = pattern[i + 1];
    if (char === '*' && next === '*') {
      regex += '.*';
      i += 1;
      continue;
    }
    if (char === '*') {
      regex += '[^/]*';
      continue;
    }
    if (char === '?') {
      regex += '[^/]';
      continue;
    }
    regex += escapeRegex(char);
  }
  return new RegExp(`^${regex}$`);
}

function walkFiles(baseDir) {
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
      } else if (entry.isFile()) {
        output.push(fullPath);
      }
    }
  }
  return output;
}

function normalizeInputPath(inputPath, rootDir) {
  if (path.isAbsolute(inputPath)) {
    return path.normalize(inputPath);
  }
  return path.normalize(path.resolve(rootDir, inputPath));
}

function directoryForGlob(globPath) {
  const parts = toPosix(globPath).split('/');
  const kept = [];
  for (const part of parts) {
    if (part.includes('*') || part.includes('?') || part.includes('[')) {
      break;
    }
    kept.push(part);
  }
  if (kept.length === 0) {
    return '/';
  }
  return kept.join('/');
}

function expandOne(inputPath, rootDir) {
  const absPath = normalizeInputPath(inputPath, rootDir);

  if (!hasGlob(absPath)) {
    if (!fs.existsSync(absPath)) {
      throw new Error(`Input path does not exist: ${toPosix(absPath)}`);
    }
    const stat = fs.statSync(absPath);
    if (stat.isDirectory()) {
      return walkFiles(absPath);
    }
    if (!stat.isFile()) {
      throw new Error(`Input path must be a file or directory: ${toPosix(absPath)}`);
    }
    return [absPath];
  }

  const globPath = toPosix(absPath);
  const baseCandidate = directoryForGlob(globPath);
  const baseDir = fs.existsSync(baseCandidate) && fs.statSync(baseCandidate).isDirectory()
    ? baseCandidate
    : path.parse(baseCandidate).root;
  const regex = globToRegex(globPath);
  const matches = walkFiles(baseDir).filter((filePath) => regex.test(toPosix(filePath)));
  return matches;
}

function extractPlanFilesFromSources(expandedFiles, mode) {
  if (mode === 'planner_first') {
    return expandedFiles.filter((filePath) => filePath.endsWith('.md'));
  }
  if (mode === 'provided_plan') {
    for (const filePath of expandedFiles) {
      if (!filePath.endsWith('.md')) {
        throw new Error(`provided_plan only accepts .md files: ${toPosix(filePath)}`);
      }
    }
    return expandedFiles;
  }
  if (mode === 'direct') {
    for (const filePath of expandedFiles) {
      const ext = path.extname(filePath).toLowerCase();
      if (!DIRECT_EXTS.has(ext)) {
        throw new Error(`direct mode only accepts .md/.json/.txt inputs: ${toPosix(filePath)}`);
      }
    }
    return expandedFiles;
  }
  throw new Error(`Unsupported execution mode: ${mode}`);
}

export function normalizeExecutionMode(mode) {
  if (!MODE_VALUES.has(mode)) {
    throw new Error(`Invalid execution_mode: ${mode}`);
  }
  return mode;
}

export function hasCriticalSeed(markdownText) {
  return /^\*\*Seed:\*\*\s*\S.+$/m.test(markdownText);
}

export function validateCriticalSeeds(filePaths, mode) {
  if (mode === 'direct') {
    return [];
  }
  const missing = [];
  for (const filePath of filePaths) {
    const text = fs.readFileSync(filePath, 'utf8');
    if (!hasCriticalSeed(text)) {
      missing.push(filePath);
    }
  }
  return missing;
}

export function resolveModeInputs({
  mode,
  rootDir,
  plannerSpecsDir,
  providedPlanPaths,
  requirementPaths,
}) {
  normalizeExecutionMode(mode);

  let rawInputs = [];
  if (mode === 'planner_first') {
    if (!plannerSpecsDir) {
      throw new Error('planner_first requires planner_specs_dir or default planner source path');
    }
    rawInputs = [plannerSpecsDir];
  } else if (mode === 'provided_plan') {
    if (!Array.isArray(providedPlanPaths) || providedPlanPaths.length === 0) {
      throw new Error('provided_plan requires one or more --provided-plan paths');
    }
    rawInputs = providedPlanPaths;
  } else if (mode === 'direct') {
    if (!Array.isArray(requirementPaths) || requirementPaths.length === 0) {
      throw new Error('direct mode requires one or more --requirements paths');
    }
    rawInputs = requirementPaths;
  }

  const expanded = [];
  for (const inputPath of rawInputs) {
    const files = expandOne(inputPath, rootDir);
    if (files.length === 0) {
      throw new Error(`No files matched input path: ${inputPath}`);
    }
    expanded.push(...files);
  }

  const planFiles = extractPlanFilesFromSources(expanded, mode);
  const uniqueSorted = Array.from(new Set(planFiles.map((filePath) => path.resolve(filePath)))).sort();

  for (const filePath of uniqueSorted) {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      throw new Error(`Resolved path must be a file: ${toPosix(filePath)}`);
    }
  }

  const missingSeeds = validateCriticalSeeds(uniqueSorted, mode);
  if (missingSeeds.length > 0) {
    const details = missingSeeds.map((item) => toPosix(item)).join(', ');
    throw new Error(`Missing critical seed reference (**Seed:**) in: ${details}`);
  }

  const sourceRoots = Array.from(
    new Set(uniqueSorted.map((filePath) => path.dirname(filePath)))
  ).sort();

  return {
    files: uniqueSorted,
    source_roots: sourceRoots,
  };
}

export function synthesizeSeed({ workItemKey, scenarioId }) {
  return `**Seed:** synthesized://direct/${workItemKey}/${scenarioId}`;
}
