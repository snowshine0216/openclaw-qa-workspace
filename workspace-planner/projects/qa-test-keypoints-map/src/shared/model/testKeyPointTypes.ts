export const TEST_KEY_POINTS_HEADING = '🧪 Test Key Points';

export const REQUIRED_TABLE_COLUMNS = [
  'Priority',
  'Related Code Change',
  'Test Key Points',
  'Expected Results',
] as const;

export type RequiredTableColumn = (typeof REQUIRED_TABLE_COLUMNS)[number];

export interface TestCaseRow {
  id: string;
  rowNumber: string;
  priority: string;
  relatedCodeChange: string;
  acceptanceCriteria: string;
  testKeyPoints: string;
  expectedResults: string;
  extraColumns: Record<string, string>;
}

export interface TestKeyPointSection {
  id: string;
  title: string;
  tableColumns: string[];
  cases: TestCaseRow[];
}

export interface TestKeyPointsDocument {
  featureId: string;
  planTitle: string;
  sections: TestKeyPointSection[];
}

export interface ParseOffsets {
  sectionStart: number;
  sectionEnd: number;
}

export interface ParsedTestKeyPointsFile {
  sourcePath: string;
  markdown: string;
  offsets: ParseOffsets;
  document: TestKeyPointsDocument;
}

export interface SaveResult {
  changed: boolean;
  backupPath?: string;
  sourcePath: string;
  writtenAt: string;
  rowCountBefore: number;
  rowCountAfter: number;
}
