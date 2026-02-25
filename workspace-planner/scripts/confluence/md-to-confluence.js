#!/usr/bin/env node

/**
 * Markdown to Confluence Storage Format Converter
 * Converts Markdown files to Confluence HTML storage format
 * 
 * Usage: node md-to-confluence.js <input.md> <output.html>
 */

const fs = require('fs');
const path = require('path');

function convertMarkdownToConfluence(markdown) {
  let html = markdown;

  // Convert headers (## → <h2>, ### → <h3>, etc.)
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Convert bold (**text** → <strong>text</strong>)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Convert italic (*text* → <em>text</em>)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Convert inline code (`code` → <code>code</code>)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert code blocks (```...``` → <ac:structured-macro>)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<ac:structured-macro ac:name="code" ac:schema-version="1">
  <ac:parameter ac:name="language">${lang || 'text'}</ac:parameter>
  <ac:plain-text-body><![CDATA[${code.trim()}]]></ac:plain-text-body>
</ac:structured-macro>`;
  });

  // Convert links ([text](url) → <a href="url">text</a>)
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

  // Convert unordered lists (- item → <ul><li>item</li></ul>)
  html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return '<ul>\n' + match + '</ul>\n';
  });

  // Convert ordered lists (1. item → <ol><li>item</li></ol>)
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // Convert horizontal rules (--- → <hr />)
  html = html.replace(/^---+$/gm, '<hr />');

  // Convert blockquotes (> text → <blockquote>text</blockquote>)
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

  // Convert Markdown tables to Confluence tables
  html = convertTablesToConfluence(html);

  // Convert emoji/icons (🔴 → <ac:emoticon>)
  html = html.replace(/✅/g, '<ac:emoticon ac:name="tick" />');
  html = html.replace(/❌/g, '<ac:emoticon ac:name="cross" />');
  html = html.replace(/⚠️/g, '<ac:emoticon ac:name="warning" />');
  html = html.replace(/🔴/g, '<ac:emoticon ac:name="red_flag" />');
  html = html.replace(/🟠/g, '<ac:emoticon ac:name="yellow_flag" />');
  html = html.replace(/🟡/g, '<ac:emoticon ac:name="yellow_flag" />');

  // Remove excessive blank lines (more than 2 consecutive newlines)
  html = html.replace(/\n{3,}/g, '\n\n');

  // Convert double line breaks to single paragraph break
  html = html.replace(/\n\n/g, '<p />');

  return html;
}

function convertTablesToConfluence(markdown) {
  const tableRegex = /^\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/gm;
  
  return markdown.replace(tableRegex, (match, headerRow, bodyRows) => {
    // Parse headers - remove leading/trailing pipes and split
    const headers = headerRow.trim().split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    // Parse body rows
    const rows = bodyRows.trim().split('\n').map(row => {
      return row.trim().split('|')
        .slice(1, -1) // Remove first and last empty elements from pipe split
        .map(cell => cell.trim());
    }).filter(row => row.length > 0);

    // Build Confluence table
    let confluenceTable = '<table><tbody>\n';
    
    // Header row
    confluenceTable += '<tr>';
    headers.forEach(header => {
      confluenceTable += `<th>${header}</th>`;
    });
    confluenceTable += '</tr>\n';

    // Body rows
    rows.forEach(row => {
      confluenceTable += '<tr>';
      row.forEach(cell => {
        confluenceTable += `<td>${cell}</td>`;
      });
      confluenceTable += '</tr>\n';
    });

    confluenceTable += '</tbody></table>\n';
    return confluenceTable;
  });
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node md-to-confluence.js <input.md> <output.html>');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  try {
    const markdown = fs.readFileSync(inputFile, 'utf8');
    const html = convertMarkdownToConfluence(markdown);
    fs.writeFileSync(outputFile, html, 'utf8');
    console.log(`✅ Converted ${inputFile} → ${outputFile}`);
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

module.exports = { convertMarkdownToConfluence };
