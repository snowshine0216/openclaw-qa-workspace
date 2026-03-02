import {
  REQUIRED_TABLE_COLUMNS,
  TEST_KEY_POINTS_HEADING,
  type ParseOffsets,
  type TestCaseRow,
  type TestKeyPointSection,
  type TestKeyPointsDocument,
} from '../model/testKeyPointTypes';
import { escapeTableCell } from '../util/text';

const CANONICAL_COLUMNS = [
  '#',
  'Priority',
  'Related Code Change',
  'Acceptance Criteria',
  'Test Key Points',
  'Expected Results',
];

function ensureSectionColumns(section: TestKeyPointSection): string[] {
  const columns = section.tableColumns.length > 0 ? [...section.tableColumns] : [...CANONICAL_COLUMNS];

  for (const required of REQUIRED_TABLE_COLUMNS) {
    if (!columns.includes(required)) {
      columns.push(required);
    }
  }

  if (!columns.includes('#')) {
    columns.unshift('#');
  }

  return columns;
}

function caseValueForColumn(row: TestCaseRow, column: string, rowNumber: string): string {
  if (column === '#') return rowNumber;
  if (column === 'Priority') return row.priority;
  if (column === 'Related Code Change') return row.relatedCodeChange;
  if (column === 'Acceptance Criteria') return row.acceptanceCriteria;
  if (column === 'Test Key Points') return row.testKeyPoints;
  if (column === 'Expected Results') return row.expectedResults;
  return row.extraColumns[column] || '';
}

function renderRow(columns: string[], row: TestCaseRow, rowNumber: string): string {
  const values = columns.map((column) => escapeTableCell(caseValueForColumn(row, column, rowNumber)));
  return `| ${values.join(' | ')} |`;
}

function renderTable(section: TestKeyPointSection, sectionIndex: number): string[] {
  const columns = ensureSectionColumns(section);
  const header = `| ${columns.join(' | ')} |`;
  const delimiter = `| ${columns.map(() => '---').join(' | ')} |`;

  const rows = section.cases.map((row, rowIndex) => {
    const rowNumber = `${sectionIndex + 1}.${rowIndex + 1}`;
    return renderRow(columns, row, rowNumber);
  });

  return [header, delimiter, ...rows];
}

export function renderTestKeyPointsSection(document: TestKeyPointsDocument): string {
  const lines: string[] = [`## ${TEST_KEY_POINTS_HEADING}`, ''];

  document.sections.forEach((section, sectionIndex) => {
    lines.push(`### ${sectionIndex + 1}. ${section.title}`);
    lines.push('');
    lines.push(...renderTable(section, sectionIndex));
    lines.push('');
  });

  return `${lines.join('\n').trimEnd()}\n`;
}

export function rewriteTestKeyPointsSection(
  sourceMarkdown: string,
  offsets: ParseOffsets,
  nextDocument: TestKeyPointsDocument,
): string {
  const nextSection = renderTestKeyPointsSection(nextDocument);
  const before = sourceMarkdown.slice(0, offsets.sectionStart);
  const after = sourceMarkdown.slice(offsets.sectionEnd);
  const join = before.endsWith('\n') || nextSection.endsWith('\n') ? '' : '\n';
  return `${before}${nextSection}${join}${after}`;
}
