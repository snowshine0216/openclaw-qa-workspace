import { readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileExists } from './workflowState.mjs';

const PHASE_COLUMNS = ['Phase 4a', 'Phase 4b', 'Phase 5a', 'Phase 5b', 'Phase 6'];

export async function writeArtifactLookup(featureId, runDir) {
  const contextDir = join(runDir, 'context');
  const lookupPath = join(contextDir, `artifact_lookup_${featureId}.md`);
  const existing = await readExistingLookup(lookupPath);
  const rows = await buildRows(contextDir, featureId, existing);
  if (rows.length === 0) {
    throw new Error('Artifact lookup requires at least one context artifact.');
  }

  await writeFile(lookupPath, renderLookup(featureId, rows), 'utf8');
  return lookupPath;
}

async function buildRows(contextDir, featureId, existing) {
  const filenames = (await safeReadDir(contextDir))
    .filter((name) => name.endsWith('.md'))
    .filter((name) => !name.startsWith(`artifact_lookup_${featureId}`))
    .filter((name) => !name.startsWith(`runtime_setup_${featureId}`))
    .sort();

  return filenames.map((filename, index) => {
    const filePath = `context/${filename}`;
    const preserved = existing.get(filePath) || {};
    const artifactKey = preserved.artifactKey || detectArtifactKey(filename);
    return {
      index: index + 1,
      artifactKey,
      filePath,
      sourcePhase: inferSourcePhase(filename),
      phase4a: preserved.phase4a || '❌',
      phase4b: preserved.phase4b || '❌',
      phase5a: preserved.phase5a || preserved.phase5 || '❌',
      phase5b: preserved.phase5b || '❌',
      phase6: preserved.phase6 || '❌',
    };
  });
}

function renderLookup(featureId, rows) {
  const tableRows = rows.map((row) => {
    return `| ${row.index} | \`${row.artifactKey}\` | \`${row.filePath}\` | ${row.sourcePhase} | ${row.phase4a} | ${row.phase4b} | ${row.phase5a} | ${row.phase5b} | ${row.phase6} |`;
  }).join('\n');

  return `# Artifact Lookup — ${featureId}

| # | Artifact Key | File Path | Source Phase | Phase 4a | Phase 4b | Phase 5a | Phase 5b | Phase 6 |
|---|---|---|---|---|---|---|---|---|
${tableRows}
`;
}

function detectArtifactKey(filename) {
  const stem = basename(filename, '.md');
  const rules = [
    [/^jira_/, 'jira_context'],
    [/^confluence_/, 'confluence_context'],
    [/^github_/, 'github_context'],
    [/^figma_/, 'figma_context'],
    [/^coverage_ledger_/, 'coverage_ledger'],
    [/^review_notes_/, 'review_notes'],
    [/^review_delta_/, 'review_delta'],
    [/^checkpoint_audit_/, 'checkpoint_audit'],
    [/^checkpoint_delta_/, 'checkpoint_delta'],
    [/^quality_delta_/, 'quality_delta'],
    [/^research_phase4a_/, 'research_phase4a'],
    [/^research_phase4b_/, 'research_phase4b'],
    [/^research_phase5a_/, 'research_phase5a'],
    [/^research_phase5b_/, 'research_phase5b'],
    [/^research_phase6_/, 'research_phase6'],
  ];

  for (const [pattern, key] of rules) {
    if (pattern.test(stem)) return key;
  }

  return stem.replace(/_[A-Z]+-\d+$/, '').replace(/_/g, '_');
}

function inferSourcePhase(filename) {
  if (filename.startsWith('coverage_ledger_')) return 'Phase 3';
  if (filename.startsWith('review_')) return 'Phase 5a';
  if (filename.startsWith('checkpoint_')) return 'Phase 5b';
  if (filename.startsWith('quality_')) return 'Phase 6';
  if (filename.startsWith('research_phase4a_')) return 'Phase 4a';
  if (filename.startsWith('research_phase4b_')) return 'Phase 4b';
  if (filename.startsWith('research_phase5a_')) return 'Phase 5a';
  if (filename.startsWith('research_phase5b_')) return 'Phase 5b';
  if (filename.startsWith('research_phase6_')) return 'Phase 6';
  return 'Phase 1';
}

async function readExistingLookup(lookupPath) {
  const map = new Map();
  if (!(await fileExists(lookupPath))) return map;
  const content = await readFile(lookupPath, 'utf8');
  const lines = content.split('\n').filter((line) => /^\|\s*\d+\s*\|/.test(line));
  for (const line of lines) {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    const isSplitPhaseLookup = cells.length >= 9;
    map.set(stripCode(cells[2]), {
      artifactKey: stripCode(cells[1]),
      phase4a: cells[4],
      phase4b: cells[5],
      phase5a: cells[6],
      phase5b: isSplitPhaseLookup ? (cells[7] || '❌') : '❌',
      phase5: cells[6],
      phase6: isSplitPhaseLookup ? (cells[8] || '❌') : (cells[7] || '❌'),
    });
  }
  return map;
}

function stripCode(value) {
  return String(value || '').replace(/^`|`$/g, '');
}

async function safeReadDir(dir) {
  try {
    return await readdir(dir);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}
