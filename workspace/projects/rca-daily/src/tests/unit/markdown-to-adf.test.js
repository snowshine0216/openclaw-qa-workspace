/**
 * Unit tests for markdownToADF - Markdown to ADF converter
 */

const { markdownToADF } = require('../../utils/markdown-to-adf');
const path = require('path');
const fs = require('fs');

describe('markdownToADF', () => {
  it('returns valid ADF doc structure', () => {
    const adf = markdownToADF('# Hello');
    expect(adf).toHaveProperty('version', 1);
    expect(adf).toHaveProperty('type', 'doc');
    expect(adf).toHaveProperty('content');
    expect(Array.isArray(adf.content)).toBe(true);
  });

  it('converts headings h1-h6 to ADF heading nodes', () => {
    const adf = markdownToADF('# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6');
    expect(adf.content).toHaveLength(6);
    adf.content.forEach((node, i) => {
      expect(node.type).toBe('heading');
      expect(node.attrs.level).toBe(i + 1);
    });
  });

  it('converts paragraphs to ADF paragraph nodes', () => {
    const adf = markdownToADF('Simple paragraph text.');
    expect(adf.content).toHaveLength(1);
    expect(adf.content[0].type).toBe('paragraph');
    expect(adf.content[0].content[0].text).toBe('Simple paragraph text.');
  });

  it('converts bold **text** to strong marks', () => {
    const adf = markdownToADF('**bold**');
    expect(adf.content[0].content[0].marks).toContainEqual({ type: 'strong' });
    expect(adf.content[0].content[0].text).toBe('bold');
  });

  it('converts italic *text* to em marks', () => {
    const adf = markdownToADF('*italic*');
    expect(adf.content[0].content[0].marks).toContainEqual({ type: 'em' });
    expect(adf.content[0].content[0].text).toBe('italic');
  });

  it('converts links [text](url) to link marks', () => {
    const adf = markdownToADF('[link](https://example.com)');
    expect(adf.content[0].content[0].marks).toContainEqual({
      type: 'link',
      attrs: { href: 'https://example.com' }
    });
    expect(adf.content[0].content[0].text).toBe('link');
  });

  it('converts inline code `text` to code marks', () => {
    const adf = markdownToADF('`code`');
    expect(adf.content[0].content[0].marks).toContainEqual({ type: 'code' });
    expect(adf.content[0].content[0].text).toBe('code');
  });

  it('converts code blocks with language', () => {
    const adf = markdownToADF('```js\nconst x = 1;\n```');
    const codeBlock = adf.content.find((n) => n.type === 'codeBlock');
    expect(codeBlock).toBeDefined();
    expect(codeBlock.attrs.language).toBe('js');
    expect(codeBlock.content[0].text).toBe('const x = 1;');
  });

  it('converts code blocks without language', () => {
    const adf = markdownToADF('```\nplain text\n```');
    const codeBlock = adf.content.find((n) => n.type === 'codeBlock');
    expect(codeBlock).toBeDefined();
    expect(codeBlock.attrs).toEqual({});
    expect(codeBlock.content[0].text).toBe('plain text');
  });

  it('converts bullet lists', () => {
    const adf = markdownToADF('- item one\n* item two');
    expect(adf.content).toHaveLength(2);
    adf.content.forEach((node) => {
      expect(node.type).toBe('bulletList');
      expect(node.content[0].type).toBe('listItem');
    });
  });

  it('converts numbered lists', () => {
    const adf = markdownToADF('1. first\n2. second');
    expect(adf.content).toHaveLength(2);
    adf.content.forEach((node) => {
      expect(node.type).toBe('orderedList');
      expect(node.content[0].type).toBe('listItem');
    });
  });

  it('converts horizontal rule ---', () => {
    const adf = markdownToADF('---');
    expect(adf.content).toHaveLength(1);
    expect(adf.content[0].type).toBe('rule');
  });

  it('converts tables with header and data rows', () => {
    const md = '| A | B |\n|----|---|\n| 1 | 2 |';
    const adf = markdownToADF(md);
    const table = adf.content.find((n) => n.type === 'table');
    expect(table).toBeDefined();
    expect(table.content).toHaveLength(2);
    expect(table.content[0].content[0].type).toBe('tableHeader');
    expect(table.content[1].content[0].type).toBe('tableCell');
  });

  it('handles empty input', () => {
    const adf = markdownToADF('');
    expect(adf.content).toHaveLength(0);
  });

  it('handles empty lines', () => {
    const adf = markdownToADF('\n\n\n');
    expect(adf.content).toHaveLength(0);
  });

  it('converts full sample RCA fixture', () => {
    const fixturePath = path.join(__dirname, '../fixtures/sample-rca.md');
    const markdown = fs.readFileSync(fixturePath, 'utf8');
    const adf = markdownToADF(markdown);
    expect(adf).toHaveProperty('version', 1);
    expect(adf).toHaveProperty('type', 'doc');
    expect(adf.content.length).toBeGreaterThan(0);
    const headings = adf.content.filter((n) => n.type === 'heading');
    expect(headings.length).toBeGreaterThanOrEqual(5);
  });
});
