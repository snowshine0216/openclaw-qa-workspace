#!/usr/bin/env node
/**
 * Phase 3: Build spawn manifest for LLM-driven QA Summary draft generation.
 *
 * The subagent reads planner + defect context, applies the generation rubric,
 * writes the draft, and self-reviews it against the review rubric.
 *
 * CLI: build_summary_draft_spawn_manifest.mjs <run-dir> <feature-key>
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function buildSubagentPrompt({ runDir, featureKey, rubricPaths, reviewNotesPath, round }) {
  const priorReviewBlock =
    round > 1 && reviewNotesPath
      ? `\n## Prior Review Notes (Round ${round - 1})\n\nRead the prior review notes at: \`${reviewNotesPath}\`\nAddress every failing criterion before writing the new draft.\n`
      : '';

  return `# QA Summary Draft Generation + Self-Review Task (Round ${round})

## Role
You are a QA engineer writing a QA Summary for a feature. You must generate a complete draft and then self-review it against the review rubric.

## Required References (read before writing)

1. Formatting rules and section structure: \`${rubricPaths.formattingRef}\`
2. Generation constraints (hard rules): \`${rubricPaths.generationRubric}\`
3. Self-review criteria: \`${rubricPaths.reviewRubric}\`
${priorReviewBlock}
## Source Artifacts

Feature key: \`${featureKey}\`
Run directory: \`${runDir}\`

Read these files:

- \`${runDir}/context/feature_overview_table.md\` — Section 1 content (copy verbatim)
- \`${runDir}/context/defect_summary.json\` or \`${runDir}/context/no_defects.json\` — defect and PR data
- \`${runDir}/context/planner_summary_seed.md\` — planner context for sections 6–11
- \`${runDir}/context/background_solution_seed.md\` — optional additional context
- \`${runDir}/context/known_limitations_seed.json\` — pre-extracted known limitations for Section 12

## Required Output Files

Write exactly these three files:

1. \`${runDir}/drafts/${featureKey}_QA_SUMMARY_DRAFT.md\` — the complete QA Summary draft
2. \`${runDir}/context/phase3_review_notes.md\` — per-criterion self-review table (C1–C10)
3. \`${runDir}/context/phase3_review_delta.md\` — blocking findings and terminal verdict

## Draft Structure

The draft must open with \`## 📊 QA Summary\` and contain all 12 numbered sections as defined in the generation rubric.

## Self-Review Instructions

After writing the draft:

1. Read \`${rubricPaths.reviewRubric}\` and evaluate each criterion (C1–C12) against the draft.
2. Write \`${runDir}/context/phase3_review_notes.md\` with the full criterion verdict table.
3. Write \`${runDir}/context/phase3_review_delta.md\` with blocking findings and one terminal verdict:
   - \`- accept\` if all 12 criteria pass
   - \`- return phase3\` if any criterion fails

Do not mark as \`accept\` if any criterion fails. Be strict.
`;
}

export function buildManifest(prompt) {
  return {
    version: 1,
    source_kind: 'qa-summary-draft',
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
  const [runDir, featureKey] = process.argv.slice(2);
  if (!runDir || !featureKey) {
    process.stderr.write(
      'Usage: build_summary_draft_spawn_manifest.mjs <run-dir> <feature-key>\n'
    );
    process.exit(1);
  }

  const taskRaw = await readFile(join(runDir, 'task.json'), 'utf8');
  const task = JSON.parse(taskRaw);
  const round = (task.phase3_round ?? 0) + 1;

  const rubricPaths = {
    formattingRef: join(SKILL_ROOT, 'references', 'summary-formatting.md'),
    generationRubric: join(SKILL_ROOT, 'references', 'summary-generation-rubric.md'),
    reviewRubric: join(SKILL_ROOT, 'references', 'summary-review-rubric.md'),
  };

  const reviewNotesPath =
    round > 1 ? join(runDir, 'context', 'phase3_review_notes.md') : null;

  const prompt = buildSubagentPrompt({
    runDir,
    featureKey,
    rubricPaths,
    reviewNotesPath,
    round,
  });
  const manifest = buildManifest(prompt);

  const manifestPath = join(runDir, 'phase3_spawn_manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  process.stdout.write(`SPAWN_MANIFEST: ${manifestPath}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
}
