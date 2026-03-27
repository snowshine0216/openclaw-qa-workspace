#!/usr/bin/env node
/**
 * Phase 2: Build spawn manifest for LLM-driven defect summary generation.
 *
 * Reads raw defect artifacts from the defects-analysis run directory and
 * instructs the subagent to write context/defect_summary.json (or
 * context/no_defects.json when no defects exist).
 *
 * CLI: build_defect_summary_spawn_manifest.mjs <run-dir> <defects-run-dir>
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function buildSubagentPrompt({ runDir, defectsRunDir, schemaRefPath }) {
  return `# Defect Summary Generation Task

## Role
You are a QA data analyst. Your task is to read raw defect-analysis artifacts and produce a normalized \`defect_summary.json\` (or \`no_defects.json\` when no defects exist) for use in QA Summary generation.

## Schema Reference (read before writing)

Read the schema and rules at: \`${schemaRefPath}\`

Focus on the \`defect_summary.json\` and \`no_defects.json\` schema sections, the \`prs\` array rules, and the \`sourceKind\`/\`extractionSource\` field rules.

## Raw Source Artifacts

Read from the defects-analysis run directory: \`${defectsRunDir}\`

Priority order for defect data:
1. \`${defectsRunDir}/context/defect_index.json\` (if present)
2. \`${defectsRunDir}/context/jira_raw.json\` (fallback)

For PR data, read:
- \`${defectsRunDir}/context/pr_impact_summary.json\` (feature-level PRs, optional)
- Any \`${defectsRunDir}/context/prs/\` subdirectory files (optional)
- Defect issue comment fields for defect-fix PR URLs

## Required Output

Write exactly one of:

- \`${runDir}/context/defect_summary.json\` — when any defects exist (totalDefects > 0)
- \`${runDir}/context/no_defects.json\` — when zero defects exist

The output must match the schema defined in the reference file exactly. Key rules:

- \`prs\` must include both \`defect_fix\` PRs (extracted from defect comments) and \`feature_change\` PRs (from pr_impact_summary.json or planner context).
- \`riskLevel\` values must be differentiated — do not uniformly assign \`MEDIUM\`.
- \`linkedDefectKeys\` on each PR must name the actual defect keys that PR fixes.
- Defect \`priority\` must be normalized: map Jira \`Critical\` → \`P0\`, \`High\` → \`P1\`, \`Medium\` → \`P2\`, \`Low\` → \`P3\`. If already in Px format, keep as-is.
- \`status\` must be the Jira status name as-is (e.g. "Open", "In Progress", "Resolved").
- \`resolution\` is the Jira resolution field or \`null\` when unresolved.

## Hard Constraints

- Do not fabricate defect keys, PR numbers, or counts not present in the source artifacts.
- Do not write both files — write only the appropriate one based on defect count.
- The output file must be valid JSON parseable by \`JSON.parse\`.
`;
}

export function buildManifest(prompt) {
  return {
    version: 1,
    source_kind: 'qa-summary-defect-summary',
    count: 1,
    requests: [
      {
        openclaw: {
          args: {
            task: prompt,
            mode: 'run',
            runtime: 'subagent',
          },
        },
      },
    ],
  };
}

async function main() {
  const [runDir, defectsRunDir] = process.argv.slice(2);
  if (!runDir || !defectsRunDir) {
    process.stderr.write(
      'Usage: build_defect_summary_spawn_manifest.mjs <run-dir> <defects-run-dir>\n'
    );
    process.exit(1);
  }

  const schemaRefPath = join(SKILL_ROOT, 'references', 'planner-and-defects.md');

  const prompt = buildSubagentPrompt({ runDir, defectsRunDir, schemaRefPath });
  const manifest = buildManifest(prompt);

  const manifestPath = join(runDir, 'phase2_defect_summary_manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  process.stdout.write(`SPAWN_MANIFEST: ${manifestPath}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
}
