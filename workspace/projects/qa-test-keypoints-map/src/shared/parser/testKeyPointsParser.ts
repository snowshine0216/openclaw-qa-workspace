import { toString } from 'mdast-util-to-string';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';

import {
  REQUIRED_TABLE_COLUMNS,
  TEST_KEY_POINTS_HEADING,
  type ParseOffsets,
  type TestCaseRow,
  type TestKeyPointSection,
  type TestKeyPointsDocument,
} from '../model/testKeyPointTypes';
import { stableId } from '../util/hash';
import { normalizeCell, normalizeSectionTitle, slugify } from '../util/text';
import { documentSchema, validateRequiredColumns } from '../validation/testKeyPointSchema';

interface PositionPoint {
  offset?: number;
}

interface Position {
  start: PositionPoint;
  end: PositionPoint;
}

interface MdNode {
  type: string;
  depth?: number;
  children?: MdNode[];
  position?: Position;
}

interface TableCellNode extends MdNode {}

interface TableRowNode extends MdNode {
  children: TableCellNode[];
}

interface TableNode extends MdNode {
  type: 'table';
  children: TableRowNode[];
}

interface RootNode extends MdNode {
  children: MdNode[];
}

const KNOWN_COLUMNS = new Set([
  '#',
  'Priority',
  'Related Code Change',
  'Acceptance Criteria',
  'Test Key Points',
  'Expected Results',
]);

function parseMarkdown(markdown: string): RootNode {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown) as RootNode;
}

function findHeadingIndex(nodes: MdNode[], depth: number, headingText: string): number {
  return nodes.findIndex(
    (node) => node.type === 'heading' && node.depth === depth && toString(node).trim() === headingText,
  );
}

function findNextHeadingIndex(nodes: MdNode[], startIndex: number, depth: number): number {
  for (let index = startIndex + 1; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (node.type === 'heading' && node.depth === depth) {
      return index;
    }
  }
  return -1;
}

function fallbackOffsets(markdown: string): ParseOffsets {
  const heading = `## ${TEST_KEY_POINTS_HEADING}`;
  const sectionStart = markdown.indexOf(heading);
  if (sectionStart === -1) {
    throw new Error(`Section \"${heading}\" was not found.`);
  }

  const searchStart = sectionStart + heading.length;
  const nextHeadingOffset = markdown.slice(searchStart).search(/\n##\s+/);
  const sectionEnd =
    nextHeadingOffset === -1 ? markdown.length : searchStart + Math.max(1, nextHeadingOffset + 1);

  return { sectionStart, sectionEnd };
}

function resolveOffsets(markdown: string, nodes: MdNode[], sectionIndex: number): ParseOffsets {
  const sectionNode = nodes[sectionIndex];
  const nextSectionIndex = findNextHeadingIndex(nodes, sectionIndex, 2);
  const nextSectionNode = nextSectionIndex === -1 ? undefined : nodes[nextSectionIndex];

  const start = sectionNode.position?.start.offset;
  const end = nextSectionNode?.position?.start.offset ?? markdown.length;

  if (typeof start === 'number' && typeof end === 'number') {
    return { sectionStart: start, sectionEnd: end };
  }

  return fallbackOffsets(markdown);
}

function getCellValue(cell: TableCellNode | undefined): string {
  if (!cell) {
    return '';
  }
  return normalizeCell(toString(cell));
}

function buildRowId(section: TestKeyPointSection, row: Omit<TestCaseRow, 'id'>, seen: Map<string, number>): string {
  const seed = `${section.title}::${row.relatedCodeChange}::${row.testKeyPoints}`;
  const base = `case-${stableId(seed)}`;
  const seenCount = seen.get(base) ?? 0;
  seen.set(base, seenCount + 1);
  return seenCount === 0 ? base : `${base}-${seenCount + 1}`;
}

function parseTableRows(
  tableNode: TableNode,
  section: TestKeyPointSection,
  sectionOrdinal: number,
  seenIds: Map<string, number>,
): TestCaseRow[] {
  if (!tableNode.children || tableNode.children.length < 2) {
    throw new Error(`Section \"${section.title}\" has a malformed table.`);
  }

  const [headerRow, ...rows] = tableNode.children;
  const columns = headerRow.children.map((cell) => getCellValue(cell));
  section.tableColumns = columns;

  const missingColumns = REQUIRED_TABLE_COLUMNS.filter((column) => !columns.includes(column));
  if (missingColumns.length > 0) {
    throw new Error(
      `Section \"${section.title}\" is missing required columns: ${missingColumns.join(', ')}`,
    );
  }

  return rows.map((row, rowIndex) => {
    if (row.children.length !== columns.length) {
      throw new Error(
        `Section \"${section.title}\" row ${rowIndex + 1} has ${row.children.length} cells, expected ${columns.length}.`,
      );
    }

    const valuesByColumn = Object.fromEntries(
      columns.map((column, index) => [column, getCellValue(row.children[index])]),
    ) as Record<string, string>;

    const nextRow: Omit<TestCaseRow, 'id'> = {
      rowNumber: valuesByColumn['#'] || `${sectionOrdinal}.${rowIndex + 1}`,
      priority: valuesByColumn['Priority'] || 'P2',
      relatedCodeChange: valuesByColumn['Related Code Change'] || 'N/A',
      acceptanceCriteria: valuesByColumn['Acceptance Criteria'] || '',
      testKeyPoints: valuesByColumn['Test Key Points'] || '',
      expectedResults: valuesByColumn['Expected Results'] || '',
      extraColumns: {},
    };

    for (const column of columns) {
      if (!KNOWN_COLUMNS.has(column)) {
        nextRow.extraColumns[column] = valuesByColumn[column] || '';
      }
    }

    return {
      id: buildRowId(section, nextRow, seenIds),
      ...nextRow,
    };
  });
}

function extractPlanTitle(nodes: MdNode[]): string {
  const heading = nodes.find((node) => node.type === 'heading' && node.depth === 1);
  return heading ? toString(heading).trim() : 'Untitled QA Plan';
}

export function parseTestKeyPointsMarkdown(markdown: string, featureId: string): {
  document: TestKeyPointsDocument;
  offsets: ParseOffsets;
} {
  const root = parseMarkdown(markdown);
  const nodes = root.children || [];

  const sectionHeadingIndex = findHeadingIndex(nodes, 2, TEST_KEY_POINTS_HEADING);
  if (sectionHeadingIndex === -1) {
    throw new Error(`Could not find section \"## ${TEST_KEY_POINTS_HEADING}\".`);
  }

  const endHeadingIndex = findNextHeadingIndex(nodes, sectionHeadingIndex, 2);
  const scopedNodes =
    endHeadingIndex === -1
      ? nodes.slice(sectionHeadingIndex + 1)
      : nodes.slice(sectionHeadingIndex + 1, endHeadingIndex);

  const sections: TestKeyPointSection[] = [];
  const seenIds = new Map<string, number>();
  let activeSection: TestKeyPointSection | null = null;

  for (const node of scopedNodes) {
    if (node.type === 'heading' && node.depth === 3) {
      const normalizedTitle = normalizeSectionTitle(toString(node).trim());
      activeSection = {
        id: `section-${slugify(normalizedTitle)}`,
        title: normalizedTitle,
        tableColumns: [],
        cases: [],
      };
      sections.push(activeSection);
      continue;
    }

    if (node.type === 'table' && activeSection) {
      activeSection.cases = parseTableRows(
        node as TableNode,
        activeSection,
        sections.length,
        seenIds,
      );
    }
  }

  if (sections.length === 0) {
    throw new Error(`Section \"${TEST_KEY_POINTS_HEADING}\" contains no subsections.`);
  }

  for (const section of sections) {
    if (section.tableColumns.length === 0) {
      throw new Error(`Section \"${section.title}\" does not include a table.`);
    }
  }

  const parsedDocument: TestKeyPointsDocument = {
    featureId,
    planTitle: extractPlanTitle(nodes),
    sections,
  };

  documentSchema.parse(parsedDocument);
  const issues = validateRequiredColumns(sections);
  if (issues.length > 0) {
    const details = issues
      .map((issue) => `${issue.section}: [${issue.missingColumns.join(', ')}]`)
      .join('; ');
    throw new Error(`Missing required columns in one or more sections: ${details}`);
  }

  return {
    document: parsedDocument,
    offsets: resolveOffsets(markdown, nodes, sectionHeadingIndex),
  };
}
