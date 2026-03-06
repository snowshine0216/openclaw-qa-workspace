#!/usr/bin/env node

/**
 * Markdown to ADF (Atlassian Document Format) Converter
 * Converts RCA markdown files to ADF for Jira Latest Status updates
 */

const fs = require('fs');

// Parser helper functions
const parseInlineContent = (text) => {
  const content = [];
  let currentText = '';
  let i = 0;

  const flushText = () => {
    if (currentText) {
        content.push({ type: 'text', text: currentText });
        currentText = '';
    }
  };

  while (i < text.length) {
    // Bold **text**
    if (text.substr(i, 2) === '**') {
      flushText();
      const endIdx = text.indexOf('**', i + 2);
      if (endIdx !== -1) {
        content.push({
          type: 'text',
          text: text.substring(i + 2, endIdx),
          marks: [{ type: 'strong' }]
        });
        i = endIdx + 2;
        continue;
      }
    }

    // Italic *text* or _text_
    if (text[i] === '*' || text[i] === '_') {
      const marker = text[i];
      flushText();
      const endIdx = text.indexOf(marker, i + 1);
      if (endIdx !== -1 && text[endIdx - 1] !== '\\') {
        content.push({
          type: 'text',
          text: text.substring(i + 1, endIdx),
          marks: [{ type: 'em' }]
        });
        i = endIdx + 1;
        continue;
      }
    }

    // Links [text](url)
    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i);
      if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
        const closeParen = text.indexOf(')', closeBracket);
        if (closeParen !== -1) {
          flushText();
          const linkText = text.substring(i + 1, closeBracket);
          const linkUrl = text.substring(closeBracket + 2, closeParen);
          content.push({
            type: 'text',
            text: linkText,
            marks: [{ type: 'link', attrs: { href: linkUrl } }]
          });
          i = closeParen + 1;
          continue;
        }
      }
    }

    // Inline code `text`
    if (text[i] === '`') {
      flushText();
      const endIdx = text.indexOf('`', i + 1);
      if (endIdx !== -1) {
        content.push({
          type: 'text',
          text: text.substring(i + 1, endIdx),
          marks: [{ type: 'code' }]
        });
        i = endIdx + 1;
        continue;
      }
    }

    currentText += text[i];
    i++;
  }

  flushText();
  return content.length > 0 ? content : [{ type: 'text', text: text }];
};

const parseTable = (lines) => {
  const rows = lines.map(line => 
    line.split('|').slice(1, -1).map(cell => cell.trim())
  );
  
  // Skip separator line (second line with dashes)
  const headerRow = rows[0];
  const dataRows = rows.slice(2);

  const tableRows = [];

  // Header row
  tableRows.push({
    type: 'tableRow',
    content: headerRow.map(cell => ({
        type: 'tableHeader',
        content: [{
            type: 'paragraph',
            content: parseInlineContent(cell)
        }]
    }))
  });

  // Data rows
  dataRows.forEach(row => {
    tableRows.push({
        type: 'tableRow',
        content: row.map(cell => ({
            type: 'tableCell',
            content: [{
                type: 'paragraph',
                content: parseInlineContent(cell)
            }]
        }))
    });
  });

  return {
    type: 'table',
    content: tableRows
  };
};

// Main converter functions
const markdownToADF = (markdown) => {
  const lines = markdown.split('\n');
  const content = [];
  let currentParagraph = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  let codeLanguage = '';

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('\n');
      if (text.trim()) {
        content.push({
          type: 'paragraph',
          content: parseInlineContent(text)
        });
      }
      currentParagraph = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockLines.length > 0) {
      content.push({
        type: 'codeBlock',
        attrs: codeLanguage ? { language: codeLanguage } : {},
        content: [{
          type: 'text',
          text: codeBlockLines.join('\n')
        }]
      });
      codeBlockLines = [];
      codeLanguage = '';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block handling
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph();
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      } else {
        inCodeBlock = false;
        flushCodeBlock();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      flushParagraph();
      content.push({ type: 'rule' });
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      content.push({
        type: 'heading',
        attrs: { level: Math.min(level, 6) },
        content: parseInlineContent(headingMatch[2])
      });
      continue;
    }

    // Bullet lists
    if (line.match(/^[\s]*[-*+]\s+/)) {
      flushParagraph();
      const text = line.replace(/^[\s]*[-*+]\s+/, '');
      content.push({
        type: 'bulletList',
        content: [{
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: parseInlineContent(text)
          }]
        }]
      });
      continue;
    }

    // Numbered lists
    if (line.match(/^[\s]*\d+\.\s+/)) {
      flushParagraph();
      const text = line.replace(/^[\s]*\d+\.\s+/, '');
      content.push({
        type: 'orderedList',
        content: [{
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: parseInlineContent(text)
          }]
        }]
      });
      continue;
    }

    // Tables
    if (line.startsWith('|')) {
      flushParagraph();
      const tableLines = [line];
      while (i + 1 < lines.length && lines[i + 1].startsWith('|')) {
        i++;
        tableLines.push(lines[i]);
      }
      content.push(parseTable(tableLines));
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // Regular paragraph text
    currentParagraph.push(line);
  }

  flushParagraph();
  flushCodeBlock();

  return {
    version: 1,
    type: 'doc',
    content: content
  };
};

// Side effect functions
const writeOutput = (outputFile, inputFile, adf) => {
    if (outputFile === '-') {
        console.log(JSON.stringify(adf, null, 2));
    } else {
        fs.writeFileSync(outputFile, JSON.stringify(adf, null, 2));
        console.log(`✅ Converted: ${inputFile} → ${outputFile}`);
    }
};

const runCLI = (args) => {
    if (args.length === 0) {
        console.error('Usage: markdown-to-adf.js <input.md> [output.json]');
        process.exit(1);
    }
    
    const inputFile = args[0];
    const outputFile = args[1] || inputFile.replace(/\.md$/, '.adf.json');
    
    try {
        const markdown = fs.readFileSync(inputFile, 'utf8');
        const adf = markdownToADF(markdown);
        writeOutput(outputFile, inputFile, adf);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

// Main execution
if (require.main === module) {
  runCLI(process.argv.slice(2));
}

module.exports = { markdownToADF };
