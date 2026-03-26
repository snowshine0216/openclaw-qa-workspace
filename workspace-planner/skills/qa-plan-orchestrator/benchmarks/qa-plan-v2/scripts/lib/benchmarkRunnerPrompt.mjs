import { readdir, readFile, stat } from 'node:fs/promises';
import { basename, extname, join, relative } from 'node:path';

const TEXT_EVIDENCE_EXTENSIONS = new Set([
  '.json',
  '.js',
  '.jsx',
  '.md',
  '.mjs',
  '.sh',
  '.text',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
]);

const MAX_EVIDENCE_FILES = 40;
const MAX_TOTAL_EVIDENCE_CHARS = 80000;
const MAX_FILE_EVIDENCE_CHARS = 12000;

const SNAPSHOT_CORE_FILES = ['SKILL.md', 'reference.md', 'README.md'];
const SNAPSHOT_PHASE_FILES = {
  phase4a: ['references/phase4a-contract.md'],
  phase4b: ['references/phase4b-contract.md'],
  phase5a: ['references/review-rubric-phase5a.md'],
  phase5b: ['references/review-rubric-phase5b.md'],
  phase6: ['references/review-rubric-phase6.md'],
  phase7: ['scripts/lib/finalPlanSummary.mjs'],
};

function normalizeText(value) {
  return String(value || '').trim();
}

function buildPromptHeader(request) {
  const fixtureRoots = (request.fixtures || [])
    .flatMap((fixture) => extractFixtureRoots(fixture))
    .filter(Boolean);

  return [
    `Benchmark case: ${request.case_id}`,
    `Feature: ${request.feature_id}`,
    `Feature family: ${request.feature_family}`,
    `Primary phase under test: ${request.primary_phase}`,
    `Evidence mode: ${request.evidence_mode}`,
    `Configuration: ${request.run.configuration_dir}`,
    `Canonical skill root: ${request.canonical_skill_root || '(not provided)'}`,
    `Skill snapshot path: ${request.skill_snapshot_path || '(none)'}`,
    `Allowed fixture roots: ${fixtureRoots.length ? fixtureRoots.join(', ') : '(none)'}`,
    '',
    'Rules:',
    '- Use only the benchmark evidence listed below.',
    '- Treat the canonical skill root as the only active qa-plan-orchestrator package for this run.',
    '- Treat any skill snapshot or benchmark-local SKILL.md as frozen reference evidence, never as the active entrypoint.',
    '- Never infer the active skill from files under benchmarks/, inputs/, or snapshot directories.',
    '- Save the main deliverable to ./outputs/result.md.',
    '- Save ./outputs/execution_notes.md with: evidence used, files produced, blockers.',
    '',
    `Benchmark prompt:\n${request.prompt}`,
    '',
    'Expectations:',
    ...(request.expectations || []).map((expectation) => `- ${expectation}`),
    '',
  ];
}

function usesSkillSnapshot(request) {
  return request?.run?.uses_skill_snapshot === true
    || ['with_skill', 'new_skill', 'old_skill'].includes(request?.run?.configuration_dir);
}

function isTextEvidenceFile(path) {
  return TEXT_EVIDENCE_EXTENSIONS.has(extname(path).toLowerCase());
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function collectTextFiles(rootPath, results = []) {
  const rootStats = await stat(rootPath).catch(() => null);
  if (!rootStats) return results;
  if (rootStats.isFile()) {
    if (isTextEvidenceFile(rootPath)) {
      results.push(rootPath);
    }
    return results;
  }

  const entries = await readdir(rootPath, { withFileTypes: true }).catch(() => []);
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const fullPath = join(rootPath, entry.name);
    if (entry.isDirectory()) {
      await collectTextFiles(fullPath, results);
      continue;
    }
    if (entry.isFile() && isTextEvidenceFile(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function buildEvidenceBlock(label, content, wasTruncated) {
  const truncationNote = wasTruncated ? '\n[truncated]\n' : '\n';
  return `--- ${label} ---\n${content}${truncationNote}`;
}

async function readEvidenceDescriptor(descriptor, remainingChars) {
  if (remainingChars <= 0) return null;

  const rawContent = await readFile(descriptor.path, 'utf8').catch(() => '');
  const trimmedContent = rawContent.trim();
  if (!trimmedContent) return null;

  let content = trimmedContent;
  let wasTruncated = false;
  if (content.length > MAX_FILE_EVIDENCE_CHARS) {
    content = content.slice(0, MAX_FILE_EVIDENCE_CHARS);
    wasTruncated = true;
  }
  if (content.length > remainingChars) {
    content = content.slice(0, remainingChars);
    wasTruncated = true;
  }
  if (!content.trim()) return null;

  return {
    text: buildEvidenceBlock(descriptor.label, content.trimEnd(), wasTruncated),
    consumedChars: content.length,
  };
}

async function formatEvidenceSection(title, descriptors) {
  const sections = [];
  let remainingChars = MAX_TOTAL_EVIDENCE_CHARS;

  for (const descriptor of descriptors.slice(0, MAX_EVIDENCE_FILES)) {
    const entry = await readEvidenceDescriptor(descriptor, remainingChars);
    if (!entry) continue;
    sections.push(entry.text);
    remainingChars -= entry.consumedChars;
    if (remainingChars <= 0) break;
  }

  if (sections.length === 0) {
    return '';
  }

  return `${title}\n${sections.join('\n')}`;
}

function buildSnapshotGuidance(request) {
  if (usesSkillSnapshot(request)) {
    return [
      'The canonical skill root named above is authoritative for this benchmark run.',
      'Use the skill snapshot evidence below as a frozen export of that canonical skill for reference and comparison only.',
      'If snapshot evidence is present, do not claim SKILL.md or the listed references are missing.',
    ];
  }

  return [
    'Do not use any qa-plan-orchestrator skill files.',
    'Produce the baseline output from the benchmark prompt and fixture evidence only.',
  ];
}

async function buildSnapshotEvidenceDescriptors(request) {
  if (!usesSkillSnapshot(request) || !request?.skill_snapshot_path) {
    return [];
  }

  const snapshotRoot = request.skill_snapshot_path;
  const phaseFiles = SNAPSHOT_PHASE_FILES[request.primary_phase] || [];
  const candidateFiles = [...new Set([...SNAPSHOT_CORE_FILES, ...phaseFiles])];
  const descriptors = [];

  for (const relativePath of candidateFiles) {
    const fullPath = join(snapshotRoot, relativePath);
    if (!await pathExists(fullPath)) continue;
    descriptors.push({
      label: `skill_snapshot/${relativePath}`,
      path: fullPath,
    });
  }

  return descriptors;
}

function extractFixtureRoots(fixture) {
  return [
    fixture?.local_path,
    ...(Array.isArray(fixture?.materials)
      ? fixture.materials.map((material) => material?.local_path)
      : []),
  ].filter(Boolean);
}

function buildFixtureDescriptor(fixtureId, root, file) {
  const relativePath = relative(root, file);
  const normalizedRelativePath = relativePath.startsWith('..')
    ? basename(file)
    : (relativePath || basename(file));

  return {
    label: `fixture:${fixtureId}/${normalizedRelativePath}`,
    path: file,
  };
}

async function buildFixtureEvidenceDescriptors(fixtures = []) {
  const descriptors = [];
  const seenPaths = new Set();

  for (const fixture of fixtures) {
    const fixtureId = normalizeText(fixture?.fixture_id) || 'fixture';
    const roots = extractFixtureRoots(fixture);

    for (const root of roots) {
      const files = await collectTextFiles(root);
      for (const file of files) {
        if (seenPaths.has(file)) continue;
        seenPaths.add(file);
        descriptors.push(buildFixtureDescriptor(fixtureId, root, file));
      }
    }
  }

  return descriptors;
}

export async function buildBenchmarkRunnerPrompt(request) {
  const lines = [...buildPromptHeader(request), ...buildSnapshotGuidance(request)];

  const snapshotEvidence = await formatEvidenceSection(
    '=== SKILL SNAPSHOT EVIDENCE ===',
    await buildSnapshotEvidenceDescriptors(request),
  );
  const fixtureEvidence = await formatEvidenceSection(
    '=== FIXTURE EVIDENCE ===',
    await buildFixtureEvidenceDescriptors(request.fixtures || []),
  );

  if (snapshotEvidence) {
    lines.push('', snapshotEvidence);
  }
  if (fixtureEvidence) {
    lines.push('', fixtureEvidence);
  }

  lines.push('', 'Write result.md first, then a short execution summary.');
  return lines.join('\n');
}
