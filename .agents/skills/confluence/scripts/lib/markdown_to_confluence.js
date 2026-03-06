#!/usr/bin/env node

const fs = require('node:fs');

function normalizeMarkdown(markdown) {
  return markdown.replace(/\r\n?/g, '\n');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapCode(code) {
  return `<code>${escapeHtml(code)}</code>`;
}

function protectCodeSpans(text) {
  const tokens = [];
  const value = text.replace(/`([^`]+)`/g, (_, code) => {
    const token = `@@CODE${tokens.length}@@`;
    tokens.push(wrapCode(code));
    return token;
  });
  return { tokens, value };
}

function restoreCodeSpans(text, tokens) {
  return text.replace(/@@CODE(\d+)@@/g, (_, index) => tokens[Number(index)]);
}

function replaceEmoji(text) {
  const mappings = [
    ['✅', '<ac:emoticon ac:name="tick" />'],
    ['❌', '<ac:emoticon ac:name="cross" />'],
    ['⚠️', '<ac:emoticon ac:name="warning" />'],
    ['🔴', '<ac:emoticon ac:name="red_flag" />'],
    ['🟠', '<ac:emoticon ac:name="yellow_flag" />'],
    ['🟡', '<ac:emoticon ac:name="yellow_flag" />'],
  ];

  return mappings.reduce((value, [emoji, replacement]) => {
    return value.split(emoji).join(replacement);
  }, text);
}

function applyInline(text) {
  const { tokens, value } = protectCodeSpans(text);
  const escaped = escapeHtml(value);
  let formatted = escaped;

  formatted = formatted.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    return `<a href="${url}">${label}</a>`;
  });
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');

  return replaceEmoji(restoreCodeSpans(formatted, tokens));
}

function isBlank(line) {
  return line.trim() === '';
}

function isCodeFence(line) {
  return /^```/.test(line.trim());
}

function isHeading(line) {
  return /^#{1,6}\s+/.test(line);
}

function isRule(line) {
  return /^([-*])\1{2,}\s*$/.test(line.trim());
}

function isBlockquote(line) {
  return /^>\s?/.test(line);
}

function parseListItem(line) {
  const match = line.match(/^\s*([-*]|\d+\.)\s+(.+)$/);
  if (!match) {
    return null;
  }
  return { ordered: /\d+\./.test(match[1]), text: match[2].trim() };
}

function isTableStart(lines, index) {
  const current = lines[index] || '';
  const next = lines[index + 1] || '';
  return /^\|.*\|\s*$/.test(current.trim()) && /^\|[\s:|-]+\|\s*$/.test(next.trim());
}

function splitTableRow(row) {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => applyInline(cell.trim()));
}

function renderTable(header, rows) {
  const headRow = `<tr>${header.map((cell) => `<th>${cell}</th>`).join('')}</tr>`;
  const bodyRows = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('\n');

  return ['<table><tbody>', headRow, bodyRows, '</tbody></table>']
    .filter(Boolean)
    .join('\n');
}

function readTable(lines, start) {
  const header = splitTableRow(lines[start]);
  const rows = [];
  let index = start + 2;

  while (index < lines.length && /^\|.*\|\s*$/.test(lines[index].trim())) {
    rows.push(splitTableRow(lines[index]));
    index += 1;
  }

  return { html: renderTable(header, rows), nextIndex: index };
}

function encodeCdata(value) {
  return value.replace(/]]>/g, ']]]]><![CDATA[>');
}

function readCodeBlock(lines, start) {
  const fence = lines[start].trim();
  const language = fence.slice(3).trim() || 'text';
  const chunks = [];
  let index = start + 1;

  while (index < lines.length && !isCodeFence(lines[index])) {
    chunks.push(lines[index]);
    index += 1;
  }

  return {
    html: [
      '<ac:structured-macro ac:name="code" ac:schema-version="1">',
      `  <ac:parameter ac:name="language">${escapeHtml(language)}</ac:parameter>`,
      `  <ac:plain-text-body><![CDATA[${encodeCdata(chunks.join('\n').trim())}]]></ac:plain-text-body>`,
      '</ac:structured-macro>',
    ].join('\n'),
    nextIndex: index < lines.length ? index + 1 : index,
  };
}

function readList(lines, start) {
  const firstItem = parseListItem(lines[start]);
  const tag = firstItem.ordered ? 'ol' : 'ul';
  const items = [];
  let index = start;

  while (index < lines.length) {
    const item = parseListItem(lines[index]);
    if (!item || item.ordered !== firstItem.ordered) {
      break;
    }
    items.push(`  <li>${applyInline(item.text)}</li>`);
    index += 1;
  }

  return { html: [`<${tag}>`, ...items, `</${tag}>`].join('\n'), nextIndex: index };
}

function readBlockquote(lines, start) {
  const chunks = [];
  let index = start;

  while (index < lines.length && isBlockquote(lines[index])) {
    chunks.push(lines[index].replace(/^>\s?/, '').trim());
    index += 1;
  }

  return {
    html: `<blockquote><p>${applyInline(chunks.join(' '))}</p></blockquote>`,
    nextIndex: index,
  };
}

function startsBlock(lines, index) {
  const line = lines[index] || '';
  return (
    isBlank(line) ||
    isCodeFence(line) ||
    isHeading(line) ||
    isRule(line) ||
    isBlockquote(line) ||
    Boolean(parseListItem(line)) ||
    isTableStart(lines, index)
  );
}

function readParagraph(lines, start) {
  const chunks = [];
  let index = start;

  while (index < lines.length && !startsBlock(lines, index)) {
    chunks.push(lines[index].trim());
    index += 1;
  }

  return { html: `<p>${applyInline(chunks.join(' '))}</p>`, nextIndex: index };
}

function renderHeading(line) {
  const [, hashes, text] = line.match(/^(#{1,6})\s+(.+)$/);
  const level = hashes.length;
  return `<h${level}>${applyInline(text.trim())}</h${level}>`;
}

function convertMarkdownToConfluence(markdown) {
  const lines = normalizeMarkdown(markdown).split('\n');
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    if (isBlank(lines[index])) {
      index += 1;
      continue;
    }
    if (isCodeFence(lines[index])) {
      const block = readCodeBlock(lines, index);
      blocks.push(block.html);
      index = block.nextIndex;
      continue;
    }
    if (isTableStart(lines, index)) {
      const block = readTable(lines, index);
      blocks.push(block.html);
      index = block.nextIndex;
      continue;
    }
    if (isHeading(lines[index])) {
      blocks.push(renderHeading(lines[index]));
      index += 1;
      continue;
    }
    if (isRule(lines[index])) {
      blocks.push('<hr />');
      index += 1;
      continue;
    }
    if (isBlockquote(lines[index])) {
      const block = readBlockquote(lines, index);
      blocks.push(block.html);
      index = block.nextIndex;
      continue;
    }
    if (parseListItem(lines[index])) {
      const block = readList(lines, index);
      blocks.push(block.html);
      index = block.nextIndex;
      continue;
    }

    const block = readParagraph(lines, index);
    blocks.push(block.html);
    index = block.nextIndex;
  }

  return `${blocks.join('\n')}`.trim();
}

function main(args) {
  if (args.length !== 2) {
    console.error('Usage: markdown_to_confluence.js <input.md> <output.html>');
    process.exit(1);
  }

  const [inputFile, outputFile] = args;
  const markdown = fs.readFileSync(inputFile, 'utf8');
  const html = convertMarkdownToConfluence(markdown);
  fs.writeFileSync(outputFile, `${html}\n`, 'utf8');
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = {
  applyInline,
  convertMarkdownToConfluence,
};
