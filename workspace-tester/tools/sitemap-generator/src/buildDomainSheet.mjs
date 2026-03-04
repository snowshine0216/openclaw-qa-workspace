/**
 * Build one domain sheet from parsed POM summaries.
 * @param {string} domain
 * @param {Array<{className: string, parentClass: string | null, locators: Array<{name:string,css:string,type:string}>, actions: Array<{name:string,params:string[]}>, subComponents: string[]}>} pomSummaries
 * @returns {{ domain: string, content: string, componentCount: number }}
 */
export function buildDomainSheet(domain, pomSummaries) {
  const sections = pomSummaries.map(renderComponentSection).join('\n\n---\n\n');
  const header = `# Site Knowledge: ${domain}\n\n> Components: ${pomSummaries.length}\n\n`;
  return {
    domain,
    content: `${header}${sections}`.trimEnd() + '\n',
    componentCount: pomSummaries.length,
  };
}

/**
 * Render one component section in markdown.
 * @param {{className: string, parentClass: string | null, locators: Array<{name:string,css:string,type:string}>, actions: Array<{name:string,params:string[]}>, subComponents: string[]}} pom
 * @returns {string}
 */
export function renderComponentSection(pom) {
  const locatorRows = pom.locators.map((locator) => `| \`${locator.name}\` | \`${locator.css}\` | ${locator.type} |`).join('\n');
  const actionRows = pom.actions.map((action) => `| \`${action.name}(${action.params.join(', ')})\` |`).join('\n');
  const subList = pom.subComponents.length ? pom.subComponents.map((name) => `- ${name}`).join('\n') : '_none_';
  return [
    `### ${pom.className}`,
    pom.parentClass ? `> Extends: \`${pom.parentClass}\`` : '',
    '',
    '**Locators**',
    '| Name | CSS | Type |',
    '|------|-----|------|',
    locatorRows || '| _none_ | | |',
    '',
    '**Actions**',
    '| Signature |',
    '|-----------|',
    actionRows || '| _none_ |',
    '',
    '**Sub-components**',
    subList,
  ].join('\n').trimEnd();
}
