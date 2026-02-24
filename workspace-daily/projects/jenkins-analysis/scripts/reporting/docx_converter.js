#!/usr/bin/env node
/**
 * Enhanced Markdown to DOCX Converter with beautiful table formatting
 * Requires: npm install marked docx
 */

const fs = require('fs');
const { marked } = require('marked');
const { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table,
  TableCell,
  TableRow,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
  ExternalHyperlink
} = require('docx');

// Parse a single "[display](url)" — used for table cells
const parseMarkdownLink = (raw) => {
  const m = raw.match(/\[(.+?)\]\((.+?)\)/);
  return m ? { text: m[1], url: m[2], isLink: true }
           : { text: raw, url: null, isLink: false };
};

/**
 * Split inline text that may contain markdown links and **bold** markers
 * into an array of docx TextRun / ExternalHyperlink elements.
 * Supports interleaved links and bold spans.
 */
const parseInlineContent = (raw, baseStyle = {}) => {
  const elements = [];
  // Regex: match [text](url) or **bold** segments
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let m;

  const addPlain = (text) => {
    if (!text) return;
    elements.push(new TextRun({ text, ...baseStyle }));
  };

  while ((m = pattern.exec(raw)) !== null) {
    // Text before this match
    addPlain(raw.substring(lastIndex, m.index));

    if (m[1] !== undefined && m[2] !== undefined) {
      // It's a link [text](url)
      elements.push(
        new ExternalHyperlink({
          link: m[2],
          children: [
            new TextRun({
              text: m[1],
              color: "0563C1",
              underline: { type: "single", color: "0563C1" },
              ...baseStyle,
            })
          ]
        })
      );
    } else if (m[3] !== undefined) {
      // It's **bold**
      elements.push(new TextRun({ text: m[3], bold: true, ...baseStyle }));
    }
    lastIndex = m.index + m[0].length;
  }

  // Trailing plain text
  addPlain(raw.substring(lastIndex));

  // Fallback so Paragraph never has empty children
  if (elements.length === 0) elements.push(new TextRun({ text: raw, ...baseStyle }));
  return elements;
};

const main = async () => {
  const [,, inputMd, outputDocx] = process.argv;

  if (!inputMd || !outputDocx) {
    console.error('Usage: node docx_converter.js <input.md> <output.docx>');
    process.exit(1);
  }

  // Read markdown
  const markdown = fs.readFileSync(inputMd, 'utf8');

  // Parse markdown with tables
  const tokens = marked.lexer(markdown);

  const children = [];

/**
 * Create a beautiful table from markdown table token
 */
function createTable(token) {
  const rows = [];
  
  // Header row with styling
  const headerCells = token.header.map((cell, idx) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: cell.text,
              bold: true,
              color: "FFFFFF",
            })
          ],
          alignment: AlignmentType.CENTER,
        })
      ],
      shading: {
        type: ShadingType.SOLID,
        color: "4472C4", // Blue header
      },
      width: {
        size: idx === 0 ? 20 : idx === 3 ? 25 : idx === 5 ? 25 : 15, // Column widths
        type: WidthType.PERCENTAGE,
      },
    });
  });
  
  rows.push(
    new TableRow({
      children: headerCells,
      tableHeader: true,
    })
  );
  
  // Data rows with alternating colors
  token.rows.forEach((row, rowIdx) => {
    const cells = row.map((cell, cellIdx) => {
      // Parse cell text for emojis and links
      const { text, url, isLink } = parseMarkdownLink(cell.text);
      
      const childElements = [];
      if (isLink) {
        childElements.push(
          new ExternalHyperlink({
            link: url,
            children: [
              new TextRun({
                text: text,
                color: "0563C1",
                underline: {
                  type: "single",
                  color: "0563C1"
                }
              })
            ]
          })
        );
      } else {
        childElements.push(
          new TextRun({
            text: text,
            color: "000000",
          })
        );
      }
      
      return new TableCell({
        children: [
          new Paragraph({
            children: childElements,
            alignment: cellIdx === 1 ? AlignmentType.CENTER : AlignmentType.LEFT, // Center "Failed Steps"
          })
        ],
        shading: {
          type: ShadingType.SOLID,
          color: rowIdx % 2 === 0 ? "FFFFFF" : "F2F2F2", // Alternating row colors
        },
      });
    });
    
    rows.push(new TableRow({ children: cells }));
  });
  
  return new Table({
    rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
  });
}

/**
 * Process markdown tokens into DOCX elements
 */
function processTokens(tokens, children) {
  for (const token of tokens) {
    switch (token.type) {
      case 'heading': {
        // Support inline links inside headings, e.g. ## [JobName](url)
        const headingLevel = token.depth === 1 ? HeadingLevel.HEADING_1
          : token.depth === 2 ? HeadingLevel.HEADING_2
          : token.depth === 3 ? HeadingLevel.HEADING_3
          : HeadingLevel.HEADING_4;
        const headingChildren = parseInlineContent(token.text);
        children.push(
          new Paragraph({
            children: headingChildren,
            heading: headingLevel,
          })
        );
        break;
      }

      case 'paragraph': {
        // Parse inline links and bold markers together
        const paraChildren = parseInlineContent(token.text);
        children.push(new Paragraph({ children: paraChildren }));
        break;
      }
      
      case 'list':
        token.items.forEach(item => {
          children.push(
            new Paragraph({
              text: `• ${item.text}`,
              spacing: { before: 100, after: 100 },
            })
          );
        });
        break;
      
      case 'table':
        children.push(createTable(token));
        children.push(new Paragraph({ text: "" })); // Add spacing after table
        break;
      
      case 'code':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: token.text,
                font: "Courier New",
                size: 20,
              })
            ],
          })
        );
        break;
      
      case 'blockquote':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: token.text,
                italics: true,
                color: "666666",
              })
            ],
            spacing: { before: 200, after: 200 },
          })
        );
        break;
      
      case 'hr':
        children.push(
          new Paragraph({
            text: "",
            border: {
              bottom: {
                color: "CCCCCC",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        );
        break;
      
      case 'space':
        children.push(new Paragraph({ text: "" }));
        break;
      
      default:
        // Skip unknown tokens
        break;
    }
  }
}

  processTokens(tokens, children);

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  // Write to file
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputDocx, buffer);
  console.log(`✓ DOCX created: ${outputDocx}`);
};

if (require.main === module) {
  main().catch(error => {
    console.error('Error creating DOCX:', error);
    process.exit(1);
  });
}

module.exports = {
  parseMarkdownLink,
  parseInlineContent,
  createTable,
  processTokens,
  main
};
