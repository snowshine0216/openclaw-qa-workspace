import { z } from 'zod';
import { REQUIRED_TABLE_COLUMNS } from '../model/testKeyPointTypes';
export const testCaseRowSchema = z.object({
    id: z.string().min(1),
    rowNumber: z.string().min(1),
    priority: z.string().min(1),
    relatedCodeChange: z.string().min(1),
    acceptanceCriteria: z.string(),
    testKeyPoints: z.string().min(1),
    expectedResults: z.string().min(1),
    extraColumns: z.record(z.string()),
});
export const sectionSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    tableColumns: z.array(z.string().min(1)),
    cases: z.array(testCaseRowSchema),
});
export const documentSchema = z.object({
    featureId: z.string().regex(/^[A-Za-z0-9._-]+$/),
    planTitle: z.string(),
    sections: z.array(sectionSchema).min(1),
});
export function validateRequiredColumns(sections) {
    const issues = [];
    for (const section of sections) {
        const missingColumns = REQUIRED_TABLE_COLUMNS.filter((column) => !section.tableColumns.includes(column));
        if (missingColumns.length > 0) {
            issues.push({ section: section.title, missingColumns });
        }
    }
    return issues;
}
//# sourceMappingURL=testKeyPointSchema.js.map