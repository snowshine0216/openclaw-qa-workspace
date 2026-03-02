import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { rewriteTestKeyPointsSection } from '../markdown/sectionRewriter';
import { parseTestKeyPointsMarkdown } from '../parser/testKeyPointsParser';
function rowCount(document) {
    return document.sections.reduce((sum, section) => sum + section.cases.length, 0);
}
function formatTimestamp(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hour}${minute}${second}`;
}
function assertFeatureId(featureId) {
    if (!/^[A-Za-z0-9._-]+$/.test(featureId)) {
        throw new Error(`Invalid feature id: ${featureId}`);
    }
}
export class QaPlanFileRepository {
    workspaceRoot;
    featurePlanRoot;
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.featurePlanRoot = path.resolve(this.workspaceRoot, 'workspace-planner/projects/feature-plan');
    }
    resolvePlanPath(featureId) {
        assertFeatureId(featureId);
        const planPath = path.resolve(this.featurePlanRoot, featureId, 'qa_plan_final.md');
        const rootWithSep = `${this.featurePlanRoot}${path.sep}`;
        if (!planPath.startsWith(rootWithSep)) {
            throw new Error(`Resolved path escaped feature-plan root: ${planPath}`);
        }
        return planPath;
    }
    async load(featureId) {
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
    async save(featureId, nextDocument) {
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
export function defaultWorkspaceRoot() {
    return path.resolve(process.cwd(), '../../..');
}
//# sourceMappingURL=fileRepository.js.map