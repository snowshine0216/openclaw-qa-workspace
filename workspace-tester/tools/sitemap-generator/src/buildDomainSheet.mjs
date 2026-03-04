/**
 * Build one rich domain sheet from fused knowledge model.
 * @param {{
 *   domain: string,
 *   displayName: string,
 *   componentNames: string[],
 *   components: Array<{
 *     className: string,
 *     cssRoot: string,
 *     elements: Array<{ label: string, css: string }>,
 *     actions: string[],
 *     relatedComponents: string[]
 *   }>,
 *   workflows: Array<{ name: string, frequency: number }>,
 *   commonElements: Array<{ label: string, frequency: number }>,
 *   actions: Array<{ signature: string, frequency: number }>,
 *   sourceCoverage: string[],
 *   componentCount: number,
 *   specFileCount: number,
 *   pomFileCount: number
 * }} domainModel
 * @param {{ verbose?: boolean }} [options]
 * @returns {{ domain: string, content: string, componentCount: number, workflowCount: number, commonElementCount: number }}
 */
export function buildDomainSheet(domainModel, options = {}) {
  const verbose = options.verbose === true;
  const sections = [
    `# Site Knowledge: ${domainModel.displayName} Domain`,
    '',
    '## Overview',
    '',
    `- **Domain key:** \`${domainModel.domain}\``,
    `- **Components covered:** ${formatList(domainModel.componentNames)}`,
    `- **Spec files scanned:** ${domainModel.specFileCount}`,
    `- **POM files scanned:** ${domainModel.pomFileCount}`,
    '',
    '## Components',
    '',
    renderComponents(domainModel.components, { verbose }),
    '',
    '## Common Workflows (from spec.ts)',
    '',
    renderWorkflows(domainModel.workflows),
  ];

  if (verbose) {
    sections.push(
      '',
      '## Common Elements (from POM + spec.ts)',
      '',
      renderCommonElements(domainModel.commonElements),
      '',
      '## Key Actions',
      '',
      renderActions(domainModel.actions)
    );
  }

  sections.push('', '## Source Coverage', '', renderSourceCoverage(domainModel.sourceCoverage));

  const content = [
    ...sections,
  ].join('\n').trimEnd() + '\n';

  return {
    domain: domainModel.domain,
    content,
    componentCount: domainModel.componentCount,
    workflowCount: domainModel.workflows.length,
    commonElementCount: domainModel.commonElements.length,
  };
}

function renderComponents(components, { verbose }) {
  if (components.length === 0) {
    return '_none_';
  }

  return components
    .map((component) => {
      const elementLines =
        component.elements.length === 0
          ? ['  - _none_']
          : component.elements.map((element) => `  - ${element.label} (\`${element.css}\`)`);
      const actionLines =
        component.actions.length === 0
          ? ['  - _none_']
          : component.actions.map((action) => `  - \`${action}\``);
      const related = component.relatedComponents.length === 0
        ? '_none_'
        : component.relatedComponents.join(', ');

      return [
        `### ${component.className}`,
        `- **CSS root:** \`${component.cssRoot}\``,
        '- **User-visible elements:**',
        ...elementLines,
        ...(verbose
          ? ['- **Component actions:**', ...actionLines]
          : []),
        `- **Related components:** ${related}`,
      ].join('\n');
    })
    .join('\n\n');
}

function renderWorkflows(workflows) {
  if (workflows.length === 0) {
    return '1. _none_';
  }

  return workflows
    .map((workflow, index) => `${index + 1}. ${workflow.name} (used in ${workflow.frequency} specs)`)
    .join('\n');
}

function renderCommonElements(commonElements) {
  if (commonElements.length === 0) {
    return '1. _none_';
  }

  return commonElements
    .map((element, index) => `${index + 1}. ${element.label} -- frequency: ${element.frequency}`)
    .join('\n');
}

function renderActions(actions) {
  if (actions.length === 0) {
    return '- _none_';
  }

  return actions
    .map((action) => `- \`${action.signature}\` -- used in ${action.frequency} specs`)
    .join('\n');
}

function renderSourceCoverage(sourceCoverage) {
  if (sourceCoverage.length === 0) {
    return '- _none_';
  }
  return sourceCoverage.map((item) => `- \`${item}\``).join('\n');
}

function formatList(items) {
  if (items.length === 0) {
    return '_none_';
  }
  return items.join(', ');
}
