import { mkdtemp, mkdir, readFile, rm, symlink, writeFile, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { validateRuntimeIsolation } from './benchmarkSkillPaths.mjs';

export const DEFAULT_CODEX_BIN = process.env.CODEX_BIN || 'codex';
export const DEFAULT_CODEX_MODEL = process.env.CODEX_BENCHMARK_MODEL || '';

export async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

export async function writeJson(path, value) {
  await ensureDir(dirname(path));
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function createRunWorkspace(prefix) {
  return mkdtemp(join(tmpdir(), prefix));
}

export async function copyPath(sourcePath, destinationPath) {
  await cp(sourcePath, destinationPath, { recursive: true });
}

export async function linkOrCopy(sourcePath, destinationPath) {
  try {
    await symlink(sourcePath, destinationPath, 'dir');
  } catch {
    await copyPath(sourcePath, destinationPath);
  }
}

export async function materializeRequestWorkspace({
  request,
  requestPath,
  workspacePrefix,
  includeSkillSnapshot,
  extraFiles = [],
}) {
  const workspaceDir = await createRunWorkspace(workspacePrefix);

  if (request.canonical_skill_root || (request.forbidden_skill_roots || []).length > 0) {
    await validateRuntimeIsolation({
      canonicalSkillRoot: request.canonical_skill_root || resolve('/'),
      skillSnapshotPath: request.skill_snapshot_path || '',
      forbiddenSkillRoots: request.forbidden_skill_roots || [],
      workspaceDir,
    });
  }

  const inputsSourceDir = join(request.run.run_dir, 'inputs');
  const inputsTargetDir = join(workspaceDir, 'inputs');
  const outputsDir = join(workspaceDir, 'outputs');
  const localRequestPath = join(workspaceDir, 'benchmark_request.json');

  await ensureDir(outputsDir);
  await copyPath(inputsSourceDir, inputsTargetDir);
  await cp(requestPath, localRequestPath);

  if (includeSkillSnapshot && request.skill_snapshot_path) {
    await linkOrCopy(request.skill_snapshot_path, join(workspaceDir, 'skill_snapshot'));
  }

  for (const file of extraFiles) {
    await cp(file.source, join(workspaceDir, file.target));
  }

  return {
    workspaceDir,
    outputsDir,
    localRequestPath,
  };
}

export function buildCodexExecArgs({
  workdir,
  outputLastMessagePath,
  outputSchemaPath = '',
  model = DEFAULT_CODEX_MODEL,
}) {
  const args = [
    'exec',
    '-C',
    workdir,
    '--skip-git-repo-check',
    '--full-auto',
    '--json',
    '--output-last-message',
    outputLastMessagePath,
  ];

  if (model) {
    args.push('--model', model);
  }
  if (outputSchemaPath) {
    args.push('--output-schema', outputSchemaPath);
  }

  return args;
}

export async function runCodexExec({
  codexBin = DEFAULT_CODEX_BIN,
  workdir,
  prompt,
  outputLastMessagePath,
  outputSchemaPath = '',
  model = DEFAULT_CODEX_MODEL,
}) {
  const args = buildCodexExecArgs({
    workdir,
    outputLastMessagePath,
    outputSchemaPath,
    model,
  });

  const startedAt = Date.now();
  const result = await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(codexBin, args, {
      cwd: workdir,
      env: {
        ...process.env,
        OTEL_SDK_DISABLED: 'true',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', rejectPromise);
    child.on('exit', (code) => {
      resolvePromise({ code: code ?? 1, stdout, stderr });
    });
    child.stdin.end(prompt);
  });

  return {
    ...result,
    durationMs: Date.now() - startedAt,
  };
}

export function parseJsonLines(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function tokenCountFromUsage(usage) {
  if (!usage || typeof usage !== 'object') return 0;
  const direct = Number(usage.total_tokens || 0);
  if (direct > 0) return direct;
  const input = Number(usage.input_tokens || usage.prompt_tokens || 0);
  const output = Number(usage.output_tokens || usage.completion_tokens || 0);
  return input + output;
}

function extractUsageCandidate(event) {
  if (!event || typeof event !== 'object') return 0;
  const direct = tokenCountFromUsage(event.usage);
  if (direct > 0) return direct;
  const resultUsage = tokenCountFromUsage(event.result?.usage);
  if (resultUsage > 0) return resultUsage;
  const turnUsage = tokenCountFromUsage(event.turn?.usage);
  if (turnUsage > 0) return turnUsage;
  return 0;
}

export function extractTotalTokens(jsonlText) {
  return parseJsonLines(jsonlText).reduce((maxTokens, event) => {
    return Math.max(maxTokens, extractUsageCandidate(event));
  }, 0);
}

export async function writeRuntimeLogs({
  destinationDir,
  prompt,
  stdout,
  stderr,
  lastMessagePath,
  extraFiles = [],
}) {
  await ensureDir(destinationDir);
  await writeFile(join(destinationDir, 'codex_prompt.txt'), prompt, 'utf8');
  await writeFile(join(destinationDir, 'codex_stdout.jsonl'), stdout, 'utf8');
  await writeFile(join(destinationDir, 'codex_stderr.log'), stderr, 'utf8');

  const lastMessage = await readFile(lastMessagePath, 'utf8').catch(() => '');
  await writeFile(join(destinationDir, basename(lastMessagePath)), lastMessage, 'utf8');

  for (const file of extraFiles) {
    await cp(file.source, join(destinationDir, file.target));
  }
}

export async function finalizeOutputs({
  sourceOutputsDir,
  destinationOutputsDir,
  fallbackResultPath,
  lastMessagePath,
  metrics,
}) {
  await rm(destinationOutputsDir, { recursive: true, force: true });
  await cp(sourceOutputsDir, destinationOutputsDir, { recursive: true });

  const resultPath = join(destinationOutputsDir, 'result.md');
  try {
    await readFile(resultPath, 'utf8');
  } catch {
    const lastMessage = await readFile(lastMessagePath, 'utf8').catch(() => '');
    await writeFile(resultPath, lastMessage || fallbackResultPath, 'utf8');
  }

  await writeJson(join(destinationOutputsDir, 'metrics.json'), metrics);
}
