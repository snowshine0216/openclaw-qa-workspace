/**
 * Build compact top-level sitemap markdown.
 * @param {Array<{domain: string, componentCount: number}>} domainSheets
 * @param {string} sourceRepo
 * @returns {string}
 */
export function buildCompactSitemap(domainSheets, sourceRepo) {
  const blocks = domainSheets.map(renderDomainSummaryBlock).join('\n\n');
  const ts = new Date().toISOString();
  return [
    '# Site Knowledge -- Compact Sitemap',
    '',
    `> Generated: ${ts}  `,
    `> Source: \`${sourceRepo}\``,
    '',
    blocks,
  ].join('\n').trimEnd() + '\n';
}

/**
 * Render one domain summary block.
 * @param {{domain: string, componentCount: number}} sheet
 * @returns {string}
 */
export function renderDomainSummaryBlock(sheet) {
  return [
    `## ${sheet.domain}`,
    '',
    `- **Components:** ${sheet.componentCount}`,
    `- **Detail file:** \`${sheet.domain}.md\``,
  ].join('\n');
}
