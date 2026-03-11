import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { rewriteTestKeyPointsSection } from '../markdown/sectionRewriter';
import type { ParsedTestKeyPointsFile, SaveResult, TestKeyPointsDocument } from '../model/testKeyPointTypes';
import { parseTestKeyPointsMarkdown } from '../parser/testKeyPointsParser';

function rowCount(document: TestKeyPointsDocument): number {
  return document.sections.reduce((sum, section) => sum + section.cases.length, 0);
}

function formatTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hour}${minute}${second}`;
}

function assertFeatureId(featureId: string): void {
  if (!/^[A-Za-z0-9._-]+$/.test(featureId)) {
    throw new Error(`Invalid feature id: ${featureId}`);
  }
}

function parseReadOnlyFeatureIds(rawValue: string | undefined): Set<string> {
  if (!rawValue) {
    return new Set();
  }

  return new Set(
    rawValue
      .split(',')
      .map((item) => item.trim().toUpperCase())
      .filter((item) => item.length > 0),
  );
}

export class QaPlanFileRepository {
  private readonly featurePlanRoot: string;
  private readonly readOnlyFeatureIds: Set<string>;

  constructor(
    private readonly workspaceRoot: string,
    runsRoot?: string,
  ) {
    const resolved =
      runsRoot ??
      process.env.QA_PLAN_RUNS_ROOT ??
      process.env.FQPO_RUNS_ROOT;
    if (!resolved) {
      throw new Error(
        'QA plan runs root must be set: pass runsRoot to constructor or set QA_PLAN_RUNS_ROOT or FQPO_RUNS_ROOT',
      );
    }
    this.featurePlanRoot = path.isAbsolute(resolved)
      ? resolved
      : path.resolve(this.workspaceRoot, resolved);
    this.readOnlyFeatureIds = parseReadOnlyFeatureIds(process.env.QA_KEYPOINTS_READ_ONLY_FEATURE_IDS);
  }

  private resolvePlanPath(featureId: string): string {
    assertFeatureId(featureId);
    const planPath = path.resolve(this.featurePlanRoot, featureId, 'qa_plan_final.md');
    const rootWithSep = `${this.featurePlanRoot}${path.sep}`;
    if (!planPath.startsWith(rootWithSep)) {
      throw new Error(`Resolved path escaped runs root: ${planPath}`);
    }
    return planPath;
  }

  async load(featureId: string): Promise<ParsedTestKeyPointsFile> {
    const sourcePath = this.resolvePlanPath(featureId);
    const markdown = await readFile(sourcePath, 'utf8');
    const { document, offsets } = parseTestKeyPointsMarkdown(markdown, featureId);

    return {
      sourcePath,
      markdown,
      offsets,
      document,
    };
  }

  async save(featureId: string, nextDocument: TestKeyPointsDocument): Promise<SaveResult> {
    if (this.readOnlyFeatureIds.has(featureId.toUpperCase())) {
      throw new Error(
        `Writes are blocked for feature ${featureId}. Remove it from QA_KEYPOINTS_READ_ONLY_FEATURE_IDS to enable writes.`,
      );
    }

    const current = await this.load(featureId);

    const nextMarkdown = rewriteTestKeyPointsSection(current.markdown, current.offsets, nextDocument);
    const changed = nextMarkdown !== current.markdown;
    const writtenAt = new Date().toISOString();

    if (!changed) {
      return {
        changed: false,
        sourcePath: current.sourcePath,
        writtenAt,
        rowCountBefore: rowCount(current.document),
        rowCountAfter: rowCount(nextDocument),
      };
    }

    const timestamp = formatTimestamp(new Date());
    const archiveDir = path.resolve(path.dirname(current.sourcePath), 'archive');
    await mkdir(archiveDir, { recursive: true });

    const backupPath = path.resolve(archiveDir, `qa_plan_final_${timestamp}.md`);
    await copyFile(current.sourcePath, backupPath);
    await writeFile(current.sourcePath, nextMarkdown, 'utf8');

    return {
      changed: true,
      backupPath,
      sourcePath: current.sourcePath,
      writtenAt,
      rowCountBefore: rowCount(current.document),
      rowCountAfter: rowCount(nextDocument),
    };
  }
}

export function defaultWorkspaceRoot(): string {
  return path.resolve(process.cwd(), '../../..');
}
