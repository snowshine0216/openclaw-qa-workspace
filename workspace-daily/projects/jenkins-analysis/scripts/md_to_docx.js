#!/usr/bin/env node
/**
 * Markdown to DOCX Converter
 * Requires: npm install marked docx
 */

const fs = require('fs');
const { marked } = require('marked');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

const [,, inputMd, outputDocx] = process.argv;

if (!inputMd || !outputDocx) {
  console.error('Usage: node md_to_docx.js <input.md> <output.docx>');
  process.exit(1);
}

// Read markdown
const markdown = fs.readFileSync(inputMd, 'utf8');

// Parse markdown tokens
const tokens = marked.lexer(markdown);

const children = [];

function processTokens(tokens) {
  for (const token of tokens) {
    switch (token.type) {
      case 'heading':
        children.push(
          new Paragraph({
            text: token.text,
            heading: token.depth === 1 ? HeadingLevel.HEADING_1 :
                    token.depth === 2 ? HeadingLevel.HEADING_2 :
                    HeadingLevel.HEADING_3,
          })
        );
        break;
      
      case 'paragraph':
        children.push(
          new Paragraph({
            children: [new TextRun(token.text)],
          })
        );
        break;
      
      case 'list':
        token.items.forEach(item => {
          children.push(
            new Paragraph({
              text: `• ${item.text}`,
              bullet: { level: 0 },
            })
          );
        });
        break;
      
      case 'code':
        children.push(
          new Paragraph({
            children: [new TextRun({
              text: token.text,
              font: 'Courier New',
              size: 20,
            })],
          })
        );
        break;
      
      case 'table':
        // Simple table representation (convert to text)
        const tableHeader = token.header.map(cell => cell.text).join(' | ');
        children.push(new Paragraph({ text: tableHeader, bold: true }));
        
        token.rows.forEach(row => {
          const rowText = row.map(cell => cell.text).join(' | ');
          children.push(new Paragraph({ text: rowText }));
        });
        break;
      
      case 'hr':
        children.push(new Paragraph({ text: '---' }));
        break;
      
      case 'space':
        children.push(new Paragraph({ text: '' }));
        break;
      
      default:
        // Fallback for other token types
        if (token.text) {
          children.push(new Paragraph({ text: token.text }));
        }
    }
  }
}

processTokens(tokens);

// Create document
const doc = new Document({
  sections: [{
    properties: {},
    children: children,
  }],
});

// Write to file
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputDocx, buffer);
  console.log(`✓ DOCX created: ${outputDocx}`);
}).catch(error => {
  console.error(`✗ Error creating DOCX: ${error.message}`);
  process.exit(1);
});
