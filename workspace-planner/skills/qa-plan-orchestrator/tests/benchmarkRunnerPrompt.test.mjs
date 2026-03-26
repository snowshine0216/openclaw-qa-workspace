import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { buildBenchmarkRunnerPrompt } from '../benchmarks/qa-plan-v2/scripts/lib/benchmarkRunnerPrompt.mjs';
import { runBenchmarkRunnerCli } from '../benchmarks/qa-plan-v2/scripts/benchmark-runner-llm.mjs';

test('buildBenchmarkRunnerPrompt embeds skill snapshot and fixture evidence content', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'benchmark-runner-prompt-'));

  try {
    const snapshotRoot = join(rootDir, 'skill_snapshot');
    const fixtureRoot = join(rootDir, 'fixture-source');
    const fixtureMaterialsRoot = join(rootDir, 'fixture-materials');

    await mkdir(join(snapshotRoot, 'references'), { recursive: true });
    await mkdir(fixtureRoot, { recursive: true });
    await mkdir(fixtureMaterialsRoot, { recursive: true });

    await writeFile(join(snapshotRoot, 'SKILL.md'), 'REPORT_STATE\nphase5a\n', 'utf8');
    await writeFile(join(snapshotRoot, 'reference.md'), 'phase model reference\n', 'utf8');
    await writeFile(join(snapshotRoot, 'references', 'review-rubric-phase5a.md'), 'Coverage Preservation Audit\n', 'utf8');
    await writeFile(join(fixtureRoot, 'jira_issue_BCIN-1.md'), '# Jira\nSave-as overwrite regression\n', 'utf8');
    await writeFile(join(fixtureMaterialsRoot, 'BCIN-1.issue.raw.json'), '{"issue":"BCIN-1","summary":"overwrite crash"}\n', 'utf8');

    const prompt = await buildBenchmarkRunnerPrompt({
      case_id: 'CASE-1',
      feature_id: 'BCIN-1',
      feature_family: 'report-editor',
      primary_phase: 'phase5a',
      evidence_mode: 'blind_pre_defect',
      prompt: 'Audit coverage for save-as overwrite.',
      expectations: ['Includes overwrite-confirmation coverage'],
      canonical_skill_root: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
      skill_snapshot_path: snapshotRoot,
      fixtures: [
        {
          fixture_id: 'BCIN-1-blind-bundle',
          local_path: fixtureRoot,
          materials: [{ local_path: join(fixtureMaterialsRoot, 'BCIN-1.issue.raw.json') }],
        },
      ],
      run: {
        configuration_dir: 'with_skill',
        uses_skill_snapshot: true,
      },
    });

    assert.match(prompt, /=== SKILL SNAPSHOT EVIDENCE ===/);
    assert.match(prompt, /Canonical skill root: \/tmp\/repo\/workspace-planner\/skills\/qa-plan-orchestrator/);
    assert.match(prompt, /Skill snapshot path:/);
    assert.match(prompt, /Treat the canonical skill root as the only active qa-plan-orchestrator package/);
    assert.match(prompt, /Treat any skill snapshot or benchmark-local SKILL\.md as frozen reference evidence/);
    assert.match(prompt, /skill_snapshot\/SKILL\.md/);
    assert.match(prompt, /REPORT_STATE/);
    assert.match(prompt, /review-rubric-phase5a\.md/);
    assert.match(prompt, /Coverage Preservation Audit/);
    assert.match(prompt, /=== FIXTURE EVIDENCE ===/);
    assert.match(prompt, /fixture:BCIN-1-blind-bundle\/jira_issue_BCIN-1\.md/);
    assert.match(prompt, /Save-as overwrite regression/);
    assert.match(prompt, /fixture:BCIN-1-blind-bundle\/BCIN-1\.issue\.raw\.json/);
    assert.match(prompt, /overwrite crash/);
    assert.doesNotMatch(prompt, /blocked by missing SKILL\.md/i);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test('buildBenchmarkRunnerPrompt excludes skill snapshot corpus for baseline runs', async () => {
  const prompt = await buildBenchmarkRunnerPrompt({
    case_id: 'CASE-2',
    feature_id: 'BCIN-2',
    feature_family: 'report-editor',
    primary_phase: 'phase1',
    evidence_mode: 'blind_pre_defect',
    prompt: 'Baseline prompt.',
    expectations: ['Stays baseline only'],
    canonical_skill_root: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
    skill_snapshot_path: '/tmp/should-not-be-used',
    fixtures: [],
    run: {
      configuration_dir: 'without_skill',
      uses_skill_snapshot: false,
    },
  });

  assert.match(prompt, /Do not use any qa-plan-orchestrator skill files/);
  assert.doesNotMatch(prompt, /=== SKILL SNAPSHOT EVIDENCE ===/);
});

test('runBenchmarkRunnerCli sends embedded evidence in the provider payload', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'benchmark-runner-cli-'));
  const originalFetch = global.fetch;
  const originalApiKey = process.env.OPENAI_API_KEY;
  let capturedBody = null;

  try {
    const snapshotRoot = join(rootDir, 'skill_snapshot');
    const fixtureRoot = join(rootDir, 'fixture-source');
    const outputDir = join(rootDir, 'outputs');
    const requestPath = join(rootDir, 'execution_request.json');

    await mkdir(join(snapshotRoot, 'references'), { recursive: true });
    await mkdir(fixtureRoot, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    await writeFile(join(snapshotRoot, 'SKILL.md'), 'REPORT_STATE\nphase4a\n', 'utf8');
    await writeFile(join(snapshotRoot, 'references', 'phase4a-contract.md'), 'observable verification leaf\n', 'utf8');
    await writeFile(join(fixtureRoot, 'jira_issue_BCIN-2.md'), '# Jira\nDouble-click title bug\n', 'utf8');
    await writeFile(
      requestPath,
      JSON.stringify({
        case_id: 'CASE-CLI-1',
        feature_id: 'BCIN-2',
        feature_family: 'report-editor',
        primary_phase: 'phase4a',
        evidence_mode: 'blind_pre_defect',
        prompt: 'Draft the benchmark output.',
        expectations: ['Preserves the double-click title outcome'],
        canonical_skill_root: '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
        skill_snapshot_path: snapshotRoot,
        fixtures: [{ fixture_id: 'BCIN-2-bundle', local_path: fixtureRoot, materials: [] }],
        run: {
          configuration_dir: 'with_skill',
          uses_skill_snapshot: true,
          output_dir: outputDir,
          metrics_path: join(outputDir, 'metrics.json'),
        },
      }, null, 2),
      'utf8',
    );

    process.env.OPENAI_API_KEY = 'test-key';
    global.fetch = async (_url, options) => {
      capturedBody = JSON.parse(options.body);
      return {
        ok: true,
        async text() {
          return JSON.stringify({
            choices: [{ message: { content: '# Result\n\nEvidence-backed output.\n' } }],
            usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
          });
        },
      };
    };

    await runBenchmarkRunnerCli(['node', 'benchmark-runner-llm.mjs', '--request', requestPath]);

    const userMessage = capturedBody.messages.find((message) => message.role === 'user');
    assert.ok(userMessage);
    assert.match(userMessage.content, /Canonical skill root: \/tmp\/repo\/workspace-planner\/skills\/qa-plan-orchestrator/);
    assert.match(userMessage.content, /Use the skill snapshot evidence below as a frozen export/);
    assert.match(userMessage.content, /REPORT_STATE/);
    assert.match(userMessage.content, /observable verification leaf/);
    assert.match(userMessage.content, /Double-click title bug/);
  } finally {
    if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalApiKey;
    global.fetch = originalFetch;
    await rm(rootDir, { recursive: true, force: true });
  }
});

test('runBenchmarkRunnerCli preserves model-provided execution notes from structured output', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'benchmark-runner-structured-'));
  const originalFetch = global.fetch;
  const originalApiKey = process.env.OPENAI_API_KEY;

  try {
    const outputDir = join(rootDir, 'outputs');
    const requestPath = join(rootDir, 'execution_request.json');
    await mkdir(outputDir, { recursive: true });

    await writeFile(
      requestPath,
      JSON.stringify({
        case_id: 'CASE-STRUCTURED-1',
        feature_id: 'BCIN-3',
        feature_family: 'report-editor',
        primary_phase: 'phase5a',
        evidence_mode: 'blind_pre_defect',
        prompt: 'Structured response path.',
        expectations: ['Preserves execution notes'],
        fixtures: [],
        run: {
          configuration_dir: 'with_skill',
          uses_skill_snapshot: true,
          output_dir: outputDir,
          metrics_path: join(outputDir, 'metrics.json'),
        },
      }, null, 2),
      'utf8',
    );

    process.env.OPENAI_API_KEY = 'test-key';
    global.fetch = async () => ({
      ok: true,
      async text() {
        return JSON.stringify({
          choices: [{
            message: {
              content: JSON.stringify({
                result_md: '# Result\n\nStructured deliverable.\n',
                execution_notes_md: '# Execution Notes\n\n- evidence used: Jira bundle\n- files produced: result.md\n- blockers: none\n',
              }),
            },
          }],
          usage: { prompt_tokens: 9, completion_tokens: 6, total_tokens: 15 },
        });
      },
    });

    await runBenchmarkRunnerCli(['node', 'benchmark-runner-llm.mjs', '--request', requestPath]);

    const notes = await readFile(join(outputDir, 'execution_notes.md'), 'utf8');
    const result = await readFile(join(outputDir, 'result.md'), 'utf8');
    assert.match(result, /Structured deliverable/);
    assert.match(notes, /evidence used: Jira bundle/);
    assert.match(notes, /files produced: result\.md/);
    assert.match(notes, /blockers: none/);
    assert.match(notes, /## Runtime Metadata/);
    assert.match(notes, /configuration: with_skill/);
  } finally {
    if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalApiKey;
    global.fetch = originalFetch;
    await rm(rootDir, { recursive: true, force: true });
  }
});

test('runBenchmarkRunnerCli preserves freeform execution summary as fallback notes', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'benchmark-runner-freeform-'));
  const originalFetch = global.fetch;
  const originalApiKey = process.env.OPENAI_API_KEY;

  try {
    const outputDir = join(rootDir, 'outputs');
    const requestPath = join(rootDir, 'execution_request.json');
    await mkdir(outputDir, { recursive: true });

    await writeFile(
      requestPath,
      JSON.stringify({
        case_id: 'CASE-FREEFORM-1',
        feature_id: 'BCIN-4',
        feature_family: 'report-editor',
        primary_phase: 'phase5b',
        evidence_mode: 'blind_pre_defect',
        prompt: 'Fallback response path.',
        expectations: ['Falls back cleanly'],
        fixtures: [],
        run: {
          configuration_dir: 'without_skill',
          uses_skill_snapshot: false,
          output_dir: outputDir,
          metrics_path: join(outputDir, 'metrics.json'),
        },
      }, null, 2),
      'utf8',
    );

    process.env.OPENAI_API_KEY = 'test-key';
    global.fetch = async () => ({
      ok: true,
      async text() {
        return JSON.stringify({
          choices: [{
            message: {
              content: '```markdown\n# Result\n\nFreeform deliverable.\n```\nEvidence used: fixture corpus\nFiles produced: result.md\nBlockers: none',
            },
          }],
          usage: { prompt_tokens: 8, completion_tokens: 4, total_tokens: 12 },
        });
      },
    });

    await runBenchmarkRunnerCli(['node', 'benchmark-runner-llm.mjs', '--request', requestPath]);

    const notes = await readFile(join(outputDir, 'execution_notes.md'), 'utf8');
    const result = await readFile(join(outputDir, 'result.md'), 'utf8');
    assert.match(result, /Freeform deliverable/);
    assert.match(notes, /Evidence used: fixture corpus/);
    assert.match(notes, /Files produced: result\.md/);
    assert.match(notes, /Blockers: none/);
    assert.match(notes, /configuration: without_skill/);
  } finally {
    if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalApiKey;
    global.fetch = originalFetch;
    await rm(rootDir, { recursive: true, force: true });
  }
});
