import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const SECTION_HEADINGS = [
  '## 1. Report Header',
  '## 2. Executive Summary',
  '## 3. Defect Breakdown by Status',
  '## 4. Risk Analysis by Functional Area',
  '## 5. Defect Analysis by Priority',
  '## 6. Code Change Analysis',
  '## 7. Residual Risk Assessment',
  '## 8. Recommended QA Focus Areas',
  '## 9. Test Environment Recommendations',
  '## 10. Verification Checklist for Release',
  '## 11. Conclusion',
  '## 12. Appendix: Defect Reference List',
];

export function buildRawDefectFacts(jiraRaw, jiraBaseUrl) {
  return (jiraRaw.issues || []).map((issue) => ({
    key: issue.key,
    url: `${jiraBaseUrl}/browse/${issue.key}`,
    title: issue.fields?.summary ?? '',
    priority: issue.fields?.priority?.name ?? 'Unknown',
    status: issue.fields?.status?.name ?? 'Unknown',
    summary: issue.fields?.summary ?? '',
  }));
}

export function buildRawPrFacts(prImpactSummary) {
  return (prImpactSummary?.top_risky_prs || []).map((pr) => ({
    number: pr.number,
    url: pr.url ?? '',
    title: pr.title ?? '',
    repo: pr.repository ?? '',
    risk_level: pr.risk_level ?? 'MEDIUM',
    summary: pr.summary ?? '',
  }));
}

export function buildSubagentPrompt(facts, rubricPaths, reviewNotesPath, round) {
  const { defects, prs, routeKind, runKey, runDir } = facts;
  const isRelease = routeKind === 'reporter_scope_release';

  const defectTable = [
    '| Key | URL | Title | Priority | Status |',
    '|-----|-----|-------|----------|--------|',
    ...defects.map((d) => `| ${d.key} | ${d.url} | ${d.title} | ${d.priority} | ${d.status} |`),
  ].join('\n');

  const prTable =
    prs.length > 0
      ? [
          '| # | URL | Title | Repo | Risk Level | Summary |',
          '|---|-----|-------|------|------------|---------|',
          ...prs.map((p) => `| ${p.number} | ${p.url} | ${p.title} | ${p.repo} | ${p.risk_level} | ${p.summary} |`),
        ].join('\n')
      : '_No PRs provided._';

  const priorReviewBlock =
    round > 1 && reviewNotesPath
      ? `\n## Prior Review Notes (Round ${round - 1})\n\nRead the prior review notes at: \`${reviewNotesPath}\`\nAddress every failing criterion before writing the new draft.\n`
      : '';

  const reportType = isRelease ? 'release' : 'feature';
  const sectionList = SECTION_HEADINGS.map((h) => `- \`${h}\``).join('\n');

  return `# Report Generation + Self-Review Task (Round ${round})

## Role
You are a QA risk analyst generating a ${reportType} defect analysis report. You must also self-review the report you produce.

## Required References (read before writing)

1. Report generation rules: \`${rubricPaths.generationRubric}\`
2. Review criteria: \`${rubricPaths.reviewRubric}\`
${priorReviewBlock}
## Run Context

- Run key: \`${runKey}\`
- Run directory: \`${runDir}\`
- Report type: ${reportType}

## Raw Facts (use only this data — do not fabricate)

### Defects
${defectTable}

### Pull Requests
${prTable}

## Required Output Files

Write exactly these three files:

1. \`${runDir}/${runKey}_REPORT_DRAFT.md\` — the complete report
2. \`${runDir}/context/report_review_notes.md\` — per-criterion self-review (see review rubric)
3. \`${runDir}/context/report_review_delta.md\` — blocking findings + terminal verdict

## Report Structure

The report must contain all 12 sections with exact headings:
${sectionList}

Follow the generation rubric for what each section must contain.

## Self-Review Instructions

After writing the draft:
1. Read \`${rubricPaths.reviewRubric}\` and evaluate each criterion against the draft
2. Write \`${runDir}/context/report_review_notes.md\` with per-criterion verdicts (pass/fail)
3. Write \`${runDir}/context/report_review_delta.md\` with blocking findings and one terminal verdict:
   - \`- accept\` if all criteria pass
   - \`- return phase5\` if any criterion fails

Do not mark as \`accept\` if any criterion fails. Be strict.
`;
}

export function buildManifest(prompt) {
  return {
    version: 1,
    source_kind: 'defects-analysis-report',
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

async function loadJiraBaseUrl(repoRoot) {
  if (process.env.JIRA_SERVER) return process.env.JIRA_SERVER.replace(/\/$/, '');
  const envPath = join(repoRoot, 'workspace-reporter', '.env');
  try {
    const text = await readFile(envPath, 'utf8');
    const match = text.match(/^JIRA_SERVER=(.+)$/m);
    if (match) return match[1].replace(/["']/g, '').replace(/\/$/, '');
  } catch {
    // not found
  }
  return 'https://jira.example.com';
}

async function main() {
  const [runDir, runKey] = process.argv.slice(2);
  if (!runDir || !runKey) {
    process.stderr.write('Usage: build_report_spawn_manifest.mjs <run-dir> <run-key>\n');
    process.exit(1);
  }

  const taskRaw = await readFile(join(runDir, 'task.json'), 'utf8');
  const task = JSON.parse(taskRaw);
  const routeKind = task.route_kind ?? '';
  const round = (task.phase5_round ?? 0) + 1;

  const repoRoot = join(SKILL_ROOT, '..', '..', '..');
  const jiraBaseUrl = await loadJiraBaseUrl(repoRoot);

  const jiraRaw = await (async () => {
    const indexPath = join(runDir, 'context', 'defect_index.json');
    try {
      return JSON.parse(await readFile(indexPath, 'utf8'));
    } catch {
      return JSON.parse(await readFile(join(runDir, 'context', 'jira_raw.json'), 'utf8'));
    }
  })();

  const prImpactSummary = await (async () => {
    try {
      return JSON.parse(await readFile(join(runDir, 'context', 'pr_impact_summary.json'), 'utf8'));
    } catch {
      return {};
    }
  })();

  const defects = buildRawDefectFacts(jiraRaw, jiraBaseUrl);
  const prs = buildRawPrFacts(prImpactSummary);

  const rubricPaths = {
    generationRubric: join(SKILL_ROOT, 'references', 'report-generation-rubric.md'),
    reviewRubric: join(SKILL_ROOT, 'references', 'report-review-rubric.md'),
  };

  const reviewNotesPath =
    round > 1 ? join(runDir, 'context', 'report_review_notes.md') : null;

  const prompt = buildSubagentPrompt(
    { defects, prs, routeKind, runKey, runDir },
    rubricPaths,
    reviewNotesPath,
    round,
  );
  const manifest = buildManifest(prompt);

  const manifestPath = join(runDir, 'phase5_spawn_manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  process.stdout.write(`SPAWN_MANIFEST: ${manifestPath}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
}
