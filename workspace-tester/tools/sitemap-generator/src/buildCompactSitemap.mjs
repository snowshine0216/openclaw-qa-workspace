/**
 * Build compact top-level sitemap markdown.
 * @param {Array<{
 *   domain: string,
 *   displayName: string,
 *   navigationHint: string,
 *   componentCount: number,
 *   workflows: Array<unknown>,
 *   commonElements: Array<unknown>,
 *   detailFile: string
 * }>} domainModels
 * @param {string} sourceRepo
 * @param {{ generatedAt?: string }} [options]
 * @returns {string}
 */
export function buildCompactSitemap(domainModels, sourceRepo, options = {}) {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const blocks = domainModels.map(renderDomainSummaryBlock).join('\n\n');
  return [
    '# Site Knowledge -- Compact Sitemap',
    '',
    `> Generated: ${generatedAt}`,
    `> Source: \`${sourceRepo}\``,
    '',
    blocks,
  ].join('\n').trimEnd() + '\n';
}

/**
 * Render one domain summary block.
 * @param {{
 *   domain: string,
 *   displayName: string,
 *   navigationHint: string,
 *   componentCount: number,
 *   workflows: Array<unknown>,
 *   commonElements: Array<unknown>,
 *   detailFile: string
 * }} model
 * @returns {string}
 */
export function renderDomainSummaryBlock(model) {
  return [
    `## ${model.displayName}`,
    '',
    `- **Domain key:** \`${model.domain}\``,
    `- **Navigation:** ${model.navigationHint}`,
    `- **Components:** ${model.componentCount}`,
    `- **Common workflows:** ${model.workflows.length}`,
    `- **Common elements:** ${model.commonElements.length}`,
    `- **Detail file:** \`${model.detailFile}\``,
    `- **Query hint:** \`query sitemap:${model.domain}\``,
  ].join('\n');
}
