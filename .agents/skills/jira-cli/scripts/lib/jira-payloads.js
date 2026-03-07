#!/usr/bin/env node

const fs = require('node:fs');

const textNode = (text, marks) => {
  const node = { type: 'text', text };
  if (marks && marks.length > 0) {
    node.marks = marks;
  }
  return node;
};

const readJsonFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const flushTextNode = (content, current) => {
  if (!current.value) {
    return;
  }
  content.push(textNode(current.value));
  current.value = '';
};

const parseInlineContent = (text) => {
  const content = [];
  const current = { value: '' };
  let index = 0;

  while (index < text.length) {
    const bold = text.slice(index, index + 2) === '**';
    if (bold) {
      const end = text.indexOf('**', index + 2);
      if (end !== -1) {
        flushTextNode(content, current);
        content.push(textNode(text.slice(index + 2, end), [{ type: 'strong' }]));
        index = end + 2;
        continue;
      }
    }

    const italic = text[index] === '*' || text[index] === '_';
    if (italic) {
      const marker = text[index];
      const end = text.indexOf(marker, index + 1);
      if (end !== -1 && text[end - 1] !== '\\') {
        flushTextNode(content, current);
        content.push(textNode(text.slice(index + 1, end), [{ type: 'em' }]));
        index = end + 1;
        continue;
      }
    }

    if (text[index] === '[') {
      const closeBracket = text.indexOf(']', index);
      const closeParen = text.indexOf(')', closeBracket + 2);
      const isLink = closeBracket !== -1 && text[closeBracket + 1] === '(' && closeParen !== -1;
      if (isLink) {
        flushTextNode(content, current);
        content.push(textNode(text.slice(index + 1, closeBracket), [
          { type: 'link', attrs: { href: text.slice(closeBracket + 2, closeParen) } },
        ]));
        index = closeParen + 1;
        continue;
      }
    }

    if (text[index] === '`') {
      const end = text.indexOf('`', index + 1);
      if (end !== -1) {
        flushTextNode(content, current);
        content.push(textNode(text.slice(index + 1, end), [{ type: 'code' }]));
        index = end + 1;
        continue;
      }
    }

    current.value += text[index];
    index += 1;
  }

  flushTextNode(content, current);
  return content.length > 0 ? content : [textNode(text)];
};

const paragraphNode = (text) => ({
  type: 'paragraph',
  content: parseInlineContent(text),
});

const tableNode = (lines) => {
  const rows = lines.map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
  const headerRow = rows[0];
  const dataRows = rows.slice(2);

  return {
    type: 'table',
    content: [
      {
        type: 'tableRow',
        content: headerRow.map((cell) => ({
          type: 'tableHeader',
          content: [paragraphNode(cell)],
        })),
      },
      ...dataRows.map((row) => ({
        type: 'tableRow',
        content: row.map((cell) => ({
          type: 'tableCell',
          content: [paragraphNode(cell)],
        })),
      })),
    ],
  };
};

const flushParagraph = (content, paragraphLines) => {
  if (paragraphLines.length === 0) {
    return;
  }
  const text = paragraphLines.join('\n').trim();
  if (text) {
    content.push(paragraphNode(text));
  }
  paragraphLines.length = 0;
};

const flushCodeBlock = (content, codeLines, language) => {
  if (codeLines.length === 0) {
    return '';
  }
  content.push({
    type: 'codeBlock',
    attrs: language ? { language } : {},
    content: [textNode(codeLines.join('\n'))],
  });
  codeLines.length = 0;
  return '';
};

const markdownToADF = (markdown) => {
  const lines = markdown.split('\n');
  const content = [];
  const paragraphLines = [];
  const codeLines = [];
  let inCodeBlock = false;
  let codeLanguage = '';

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        codeLanguage = flushCodeBlock(content, codeLines, codeLanguage);
      } else {
        flushParagraph(content, paragraphLines);
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === '---') {
      flushParagraph(content, paragraphLines);
      content.push({ type: 'rule' });
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph(content, paragraphLines);
      content.push({
        type: 'heading',
        attrs: { level: Math.min(headingMatch[1].length, 6) },
        content: parseInlineContent(headingMatch[2]),
      });
      continue;
    }

    if (/^[\s]*[-*+]\s+/.test(line)) {
      flushParagraph(content, paragraphLines);
      content.push({
        type: 'bulletList',
        content: [{
          type: 'listItem',
          content: [paragraphNode(line.replace(/^[\s]*[-*+]\s+/, ''))],
        }],
      });
      continue;
    }

    if (/^[\s]*\d+\.\s+/.test(line)) {
      flushParagraph(content, paragraphLines);
      content.push({
        type: 'orderedList',
        attrs: { order: 1 },
        content: [{
          type: 'listItem',
          content: [paragraphNode(line.replace(/^[\s]*\d+\.\s+/, ''))],
        }],
      });
      continue;
    }

    const isTable = line.includes('|')
      && index + 1 < lines.length
      && /^\|?\s*[:-]+[-| :]*\|?$/.test(lines[index + 1]);
    if (isTable) {
      flushParagraph(content, paragraphLines);
      const tableLines = [line, lines[index + 1]];
      let cursor = index + 2;
      while (cursor < lines.length && lines[cursor].includes('|')) {
        tableLines.push(lines[cursor]);
        cursor += 1;
      }
      content.push(tableNode(tableLines));
      index = cursor - 1;
      continue;
    }

    if (!line.trim()) {
      flushParagraph(content, paragraphLines);
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph(content, paragraphLines);
  flushCodeBlock(content, codeLines, codeLanguage);

  return { version: 1, type: 'doc', content };
};

const normalizeMentions = (mentions = []) => mentions.map((mention) => ({
  id: mention.id,
  text: mention.text || mention.displayName || `@${mention.id}`,
}));

const buildCommentContent = ({ text, mentions }) => {
  if (mentions.length === 0) {
    return [textNode(text)];
  }

  const content = [];
  mentions.forEach((mention) => {
    content.push({
      type: 'mention',
      attrs: { id: mention.id, text: mention.text },
    });
    content.push(textNode(' '));
  });
  content[content.length - 1] = textNode(` ${text}`);
  return content;
};

const buildCommentPayload = ({ text, mentions = [] }) => {
  const normalizedMentions = normalizeMentions(mentions);
  return {
    body: {
      version: 1,
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: buildCommentContent({ text, mentions: normalizedMentions }),
      }],
    },
  };
};

const writeJson = (outputPath, payload) => {
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  if (!outputPath || outputPath === '-') {
    process.stdout.write(json);
    return;
  }
  fs.writeFileSync(outputPath, json);
};

const usage = () => {
  console.error('Usage: jira-payloads.js <markdown-to-adf|build-comment> ...');
  process.exit(1);
};

const requireValue = (value, message) => {
  if (!value) {
    console.error(message);
    process.exit(1);
  }
};

const runMarkdownToAdf = ([inputPath, outputPath = '-']) => {
  requireValue(inputPath, 'markdown-to-adf requires <input.md>');
  writeJson(outputPath, markdownToADF(fs.readFileSync(inputPath, 'utf8')));
};

const runBuildComment = (args) => {
  let text = '';
  let mentionsFile = '';
  let outputPath = '-';

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--text') {
      text = args[index + 1] || '';
      index += 1;
    } else if (arg === '--mentions-file') {
      mentionsFile = args[index + 1] || '';
      index += 1;
    } else if (arg === '--output') {
      outputPath = args[index + 1] || '-';
      index += 1;
    } else {
      usage();
    }
  }

  requireValue(text, 'build-comment requires --text');
  const mentions = mentionsFile ? readJsonFile(mentionsFile) : [];
  writeJson(outputPath, buildCommentPayload({ text, mentions }));
};

if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'markdown-to-adf') {
    runMarkdownToAdf(args);
  } else if (command === 'build-comment') {
    runBuildComment(args);
  } else {
    usage();
  }
}

module.exports = {
  buildCommentPayload,
  markdownToADF,
};
