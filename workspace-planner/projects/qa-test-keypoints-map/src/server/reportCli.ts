import { QaPlanFileRepository, defaultWorkspaceRoot } from '../shared/io/fileRepository';

function usage(): string {
  return [
    'Usage:',
    '  npm run validate -- <feature-id>',
    '  npm run report -- <feature-id>',
    '',
    'Examples:',
    '  npm run validate -- BCIN-6709',
    '  npm run report -- BCIN-6709',
  ].join('\n');
}

async function main(): Promise<void> {
  const [mode, featureId] = process.argv.slice(2);

  if (!mode || !featureId || !['validate', 'report'].includes(mode)) {
    throw new Error(usage());
  }

  const workspaceRoot = process.env.WORKSPACE_ROOT || defaultWorkspaceRoot();
  const runsRoot = process.env.QA_PLAN_RUNS_ROOT ?? process.env.FQPO_RUNS_ROOT;
  if (!runsRoot) {
    throw new Error('Set QA_PLAN_RUNS_ROOT or FQPO_RUNS_ROOT to the qa-plan-orchestrator runs directory');
  }
  const repository = new QaPlanFileRepository(workspaceRoot, runsRoot);
  const loaded = await repository.load(featureId);

  if (mode === 'validate') {
    // eslint-disable-next-line no-console
    console.log(`OK: ${featureId} is valid for Test Key Points parsing.`);
    // eslint-disable-next-line no-console
    console.log(`Source: ${loaded.sourcePath}`);
    // eslint-disable-next-line no-console
    console.log(`Sections: ${loaded.document.sections.length}`);
    return;
  }

  const rows = loaded.document.sections.reduce((sum, section) => sum + section.cases.length, 0);
  const report = {
    featureId,
    sourcePath: loaded.sourcePath,
    generatedAt: new Date().toISOString(),
    sectionCount: loaded.document.sections.length,
    rowCount: rows,
    sections: loaded.document.sections.map((section) => ({
      id: section.id,
      title: section.title,
      rowCount: section.cases.length,
    })),
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(report, null, 2));
}

void main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(message);
  process.exitCode = 1;
});
