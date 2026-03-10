import { spawnSync } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import {
  normalizeRequestedSourceFamilies,
} from './workflowState.mjs';
import { evaluateRuntimeSetup } from './contextRules.mjs';

const SOURCE_COMMANDS = {
  jira: {
    approvedSkill: 'jira-cli',
    resolveCommand: ({ repoRoot }) => {
      const envPath = process.env.JIRA_CLI_SCRIPT;
      if (envPath) return { command: envPath, args: ['me'] };
      if (!repoRoot) return null;
      return { command: join(repoRoot, '.agents/skills/jira-cli/scripts/jira-run.sh'), args: ['me'] };
    },
  },
  confluence: {
    approvedSkill: 'confluence',
    resolveCommand: () => {
      const envPath = process.env.CONFLUENCE_BIN;
      if (envPath) return { command: envPath, args: ['spaces'] };
      return { command: 'confluence', args: ['spaces'] };
    },
  },
  github: {
    approvedSkill: 'github',
    resolveCommand: () => {
      const envPath = process.env.GH_BIN;
      if (envPath) return { command: envPath, args: ['auth', 'status'] };
      return { command: 'gh', args: ['auth', 'status'] };
    },
  },
  figma: {
    approvedSkill: 'browser',
    resolveCommand: () => null,
  },
};

export async function buildRuntimeSetup(featureId, requestedSources, outputDir, options = {}) {
  const repoRoot = await findRepoRoot(options.cwd || process.cwd());
  await mkdir(outputDir, { recursive: true });
  const setupEntries = [];
  const supportingSources = new Set(
    normalizeRequestedSourceFamilies(process.env.FQPO_SUPPORTING_SOURCES || '')
  );

  requestedSources.forEach((sourceFamily, index) => {
    const classifications = supportingSources.has(sourceFamily)
      ? ['primary', 'supporting']
      : ['primary'];
    if (index === 0 && classifications.length === 0) {
      classifications.push('primary');
    }
    setupEntries.push(checkSourceFamily(sourceFamily, repoRoot, classifications));
  });

  const evaluation = evaluateRuntimeSetup({
    requestedSourceFamilies: requestedSources,
    setupEntries,
  });

  const output = {
    ok: evaluation.ok,
    feature_id: featureId,
    setup_entries: setupEntries,
    has_supporting_artifacts: evaluation.hasSupportingArtifacts,
    failures: evaluation.failures,
  };

  await writeFile(
    join(outputDir, `runtime_setup_${featureId}.json`),
    `${JSON.stringify(output, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    join(outputDir, `runtime_setup_${featureId}.md`),
    buildRuntimeSetupMarkdown(
      featureId,
      requestedSources,
      setupEntries,
      output.has_supporting_artifacts,
      output.failures
    ),
    'utf8'
  );

  return output;
}

export async function runRuntimeSetupCli(argv = process.argv.slice(2)) {
  const [featureId, requestedSourcesArg, outputDirArg] = argv;
  if (!featureId) {
    console.error('Usage: check_runtime_env.sh <feature-id> <requested-sources> [output-dir]');
    process.exit(1);
  }

  const requestedSources = normalizeRequestedSourceFamilies(requestedSourcesArg || 'jira');
  const outputDir = outputDirArg || resolve(`projects/feature-plan/${featureId}/context`);
  const result = await buildRuntimeSetup(featureId, requestedSources, outputDir);

  if (!result.ok) {
    for (const failure of result.failures) {
      console.error(`RUNTIME_SETUP_FAILED: ${failure}`);
    }
    process.exit(1);
  }

  console.log(`RUNTIME_SETUP_OK: ${join(outputDir, `runtime_setup_${featureId}.json`)}`);
}

function checkSourceFamily(sourceFamily, repoRoot, classifications) {
  const contract = SOURCE_COMMANDS[sourceFamily];
  if (!contract) {
    return blockedEntry(sourceFamily, 'unknown source family', classifications);
  }

  const resolved = contract.resolveCommand({ repoRoot });
  if (!resolved) {
    return {
      source_family: sourceFamily,
      approved_skill: contract.approvedSkill,
      availability_validation: 'manual browser exploration',
      auth_validation: 'manual browser exploration',
      status: 'pass',
      route_approved: true,
      blockers: '—',
      reference_classifications: classifications,
    };
  }

  const result = runCommand(resolved.command, resolved.args);

  if (result.status !== 0) {
    const message = (result.stderr || result.stdout || 'command failed').trim();
    return blockedEntry(sourceFamily, message, classifications, contract.approvedSkill, resolved);
  }

  return {
    source_family: sourceFamily,
    approved_skill: contract.approvedSkill,
    availability_validation: `${resolved.command} ${resolved.args.join(' ')}`.trim(),
    auth_validation: `${resolved.command} returned success`,
    status: 'pass',
    route_approved: true,
    blockers: '—',
    reference_classifications: classifications,
  };
}

function blockedEntry(sourceFamily, blockers, classifications, approvedSkill = SOURCE_COMMANDS[sourceFamily]?.approvedSkill || 'unknown', resolved = null) {
  return {
    source_family: sourceFamily,
    approved_skill: approvedSkill,
    availability_validation: resolved ? `${resolved.command} ${resolved.args.join(' ')}`.trim() : 'not resolved',
    auth_validation: 'failed',
    status: 'blocked',
    route_approved: false,
    blockers,
    reference_classifications: classifications,
  };
}

function runCommand(command, args) {
  const useBashWrapper = command.includes('/');
  if (useBashWrapper) {
    return spawnSync('/bin/bash', [command, ...args], {
      encoding: 'utf8',
      env: process.env,
    });
  }

  return spawnSync(command, args, {
    encoding: 'utf8',
    env: process.env,
  });
}

function buildRuntimeSetupMarkdown(featureId, requestedSources, setupEntries, hasSupportingArtifacts, failures) {
  const rows = setupEntries.map((entry) => {
    const blockers = entry.blockers || '—';
    return `| ${entry.source_family} | ${entry.approved_skill} | ${entry.availability_validation} | ${entry.auth_validation} | ${entry.status} | ${entry.route_approved} | ${blockers} |`;
  }).join('\n');

  const failureSection = failures.length > 0
    ? `\n## Failures\n\n${failures.map((failure) => `- ${failure}`).join('\n')}\n`
    : '';

  return `# Runtime Setup — ${featureId}

## Requested source families
${requestedSources.join(', ')}

## Setup entries

| source_family | approved_skill | availability_validation | auth_validation | status | route_approved | blockers |
|---|---|---|---|---|---|---|
${rows}

## has_supporting_artifacts
${hasSupportingArtifacts}
${failureSection}`;
}

async function findRepoRoot(startDir) {
  let current = resolve(startDir);
  while (current !== dirname(current)) {
    if (await hasRepoMarkers(current)) return current;
    current = dirname(current);
  }
  return null;
}

async function hasRepoMarkers(dir) {
  const markers = ['.agents', 'AGENTS.md'];
  for (const marker of markers) {
    try {
      await access(join(dir, marker), constants.F_OK);
      return true;
    } catch {
      // ignored
    }
  }
  return false;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runRuntimeSetupCli();
}
