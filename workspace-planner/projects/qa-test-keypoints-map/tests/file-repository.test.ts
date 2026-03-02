import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { QaPlanFileRepository } from '../src/shared/io/fileRepository';

const VALID_FIXTURE = path.resolve(process.cwd(), 'tests/fixtures/valid-dense-plan.md');

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('QaPlanFileRepository', () => {
  it('creates backup only when content changes and rewrites section safely', async () => {
    const workspaceRoot = path.join(os.tmpdir(), `qa-keypoints-${Date.now()}`);
    await mkdir(workspaceRoot, { recursive: true });

    const featureDir = path.resolve(
      workspaceRoot,
      'workspace-planner/projects/feature-plan/BCIN-TEST-IO',
    );
    await mkdir(featureDir, { recursive: true });

    const sourcePath = path.resolve(featureDir, 'qa_plan_final.md');
    const fixture = await readFile(VALID_FIXTURE, 'utf8');
    await writeFile(sourcePath, fixture, 'utf8');

    const repository = new QaPlanFileRepository(workspaceRoot);
    const loaded = await repository.load('BCIN-TEST-IO');

    const nextDocument = clone(loaded.document);
    const targetCase = nextDocument.sections[0]?.cases[0];
    if (!targetCase) {
      throw new Error('Expected first case in fixture');
    }
    targetCase.expectedResults = 'Pause mode restored with clean state';

    const firstSave = await repository.save('BCIN-TEST-IO', nextDocument);
    expect(firstSave.changed).toBe(true);
    expect(firstSave.backupPath).toBeTruthy();

    if (!firstSave.backupPath) {
      throw new Error('Backup path missing for changed write.');
    }

    await access(firstSave.backupPath);

    const updatedMarkdown = await readFile(sourcePath, 'utf8');
    expect(updatedMarkdown).toContain('Pause mode restored with clean state');
    expect(updatedMarkdown).toContain('## ⚠️ Risk & Mitigation');

    const secondSave = await repository.save('BCIN-TEST-IO', nextDocument);
    expect(secondSave.changed).toBe(false);
    expect(secondSave.backupPath).toBeUndefined();
  });
});
