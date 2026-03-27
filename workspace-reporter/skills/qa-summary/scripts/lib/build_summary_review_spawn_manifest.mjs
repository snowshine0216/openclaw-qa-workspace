#!/usr/bin/env node
/**
 * Phase 4: Build spawn manifest for LLM-driven QA Summary review and structural refactor.
 *
 * The subagent reviews the draft against the review rubric. When issues are found
 * it applies structural fixes in-place and re-reviews before writing the verdict.
 *
 * CLI: build_summary_review_spawn_manifest.mjs <run-dir> <feature-key>
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function buildSubagentPrompt({
  runDir,
  featureKey,
  rubricPaths,
  reviewNotesPath,
  approvalFeedbackPath,
  round,
}) {
  const priorReviewBlock =
    round > 1 && reviewNotesPath
      ? `\n## Prior Review Notes (Round ${round - 1})\n\nRead the prior review notes at: \`${reviewNotesPath}\`\nFocus on the failing criteria from the prior round.\n`
      : '';

  const approvalFeedbackBlock = approvalFeedbackPath
    ? `\n## Approval Feedback\n\nThe user requested revisions. Read the feedback at: \`${runDir}/${approvalFeedbackPath}\`\nAddress every required fix listed before reviewing.\n`
    : '';

  return `# QA Summary Review + Structural Refactor Task (Round ${round})

## Role
You are a QA lead reviewing a draft QA Summary for completeness, structure, and accuracy. When you find structural issues (missing sections, wrong format), apply the minimal fix directly to the draft file before writing your verdict.
${priorReviewBlock}${approvalFeedbackBlock}
## Required References (read before reviewing)

1. Formatting rules: \`${rubricPaths.formattingRef}\`
2. Review criteria: \`${rubricPaths.reviewRubric}\`

## Files to Review

- Draft: \`${runDir}/drafts/${featureKey}_QA_SUMMARY_DRAFT.md\`

## Required Output Files

Write exactly these four files:

1. \`${runDir}/${featureKey}_QA_SUMMARY_REVIEW.md\` — review findings (full criterion assessment)
2. \`${runDir}/context/phase4_review_notes.md\` — per-criterion verdict table (C1–C10)
3. \`${runDir}/context/phase4_review_delta.md\` — blocking findings and terminal verdict
4. \`${runDir}/context/review_result.json\` — machine-readable result (schema below)

## Structural Fix Rules

You may only apply these deterministic structural fixes to the draft:

- Add a missing section heading with a PENDING placeholder body
- Add a missing required table with a PENDING row
- Add a missing bullet list with a single PENDING bullet

**Do not** rewrite prose, change data, or add analytical content. Structural fixes only.

When a fix requires analytical judgment (e.g. "Section 3 is vague"), mark as fail and let the verdict be \`return phase4\` — do not attempt to rewrite analytical content.

## Review Workflow

1. Read the draft and both reference files.
2. Evaluate all 10 criteria from the review rubric.
3. For any failing criterion that is a **structural** issue (missing section, missing table, missing bullet): apply the fix to \`${runDir}/drafts/${featureKey}_QA_SUMMARY_DRAFT.md\` and mark as fixed in your notes.
4. For any failing criterion that is **analytical** (wrong counts, vague prose, missing data): do NOT fix — record as fail.
5. Write all four output files with your findings.

## review_result.json Schema

\`\`\`json
{
  "verdict": "pass" | "fail",
  "requiresRefactor": false,
  "reviewOutputPath": "${featureKey}_QA_SUMMARY_REVIEW.md",
  "updatedDraftPath": "drafts/${featureKey}_QA_SUMMARY_DRAFT.md"
}
\`\`\`

- \`verdict\` is \`"pass"\` when all criteria pass (after any structural fixes applied).
- \`requiresRefactor\` is always \`false\` — refactoring is done inline by this agent.

## Verdict in phase4_review_delta.md

Write:
- \`- accept\` if all criteria pass after structural fixes
- \`- return phase4\` if any analytical criterion fails

The verdict must be the **only** bullet in the \`## Verdict\` section.
`;
}

export function buildManifest(prompt) {
  return {
    version: 1,
    source_kind: 'qa-summary-review',
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
      'Usage: build_summary_review_spawn_manifest.mjs <run-dir> <feature-key>\n'
    );
    process.exit(1);
  }

  const taskRaw = await readFile(join(runDir, 'task.json'), 'utf8');
  const task = JSON.parse(taskRaw);
  const round = (task.phase4_round ?? 0) + 1;

  const rubricPaths = {
    formattingRef: join(SKILL_ROOT, 'references', 'summary-formatting.md'),
    reviewRubric: join(SKILL_ROOT, 'references', 'summary-review-rubric.md'),
  };

  const reviewNotesPath =
    round > 1 ? join(runDir, 'context', 'phase4_review_notes.md') : null;

  let approvalFeedbackPath = null;
  try {
    await readFile(join(runDir, 'context', 'approval_feedback.json'), 'utf8');
    approvalFeedbackPath = 'context/approval_feedback.json';
  } catch {
    /* no approval feedback */
  }

  const prompt = buildSubagentPrompt({
    runDir,
    featureKey,
    rubricPaths,
    reviewNotesPath,
    approvalFeedbackPath,
    round,
  });
  const manifest = buildManifest(prompt);

  const manifestPath = join(runDir, 'phase4_spawn_manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  process.stdout.write(`SPAWN_MANIFEST: ${manifestPath}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
}
