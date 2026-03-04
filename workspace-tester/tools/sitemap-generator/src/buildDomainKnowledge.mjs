import path from 'node:path';
import { getDomainConfigEntry, resolveDisplayName } from './domainConfig.mjs';

/**
 * Fuse POM and spec summaries into a canonical domain model.
 * @param {string} domain
 * @param {Array<{
 *   className: string,
 *   locators: Array<{name:string,css:string,type:string}>,
 *   actions: Array<{name:string,params:string[]}>,
 *   subComponents: string[]
 * }>} pomSummaries
 * @param {Array<{
 *   filePath: string,
 *   workflowNames: string[],
 *   actionCalls: string[],
 *   locatorTokens: string[],
 *   componentMentions: string[]
 * }>} specSummaries
 * @returns {{
 *   domain: string,
 *   displayName: string,
 *   navigationHint: string,
 *   keyEntryPoints: string[],
 *   componentNames: string[],
 *   componentCount: number,
 *   workflows: Array<{ name: string, frequency: number, sources: string[] }>,
 *   commonElements: Array<{ label: string, frequency: number, examples: string[] }>,
 *   actions: Array<{ signature: string, frequency: number }>,
 *   detailFile: string,
 *   components: Array<{
 *     className: string,
 *     cssRoot: string,
 *     elements: Array<{ label: string, css: string }>,
 *     actions: string[],
 *     relatedComponents: string[]
 *   }>,
 *   pomFileCount: number,
 *   specFileCount: number,
 *   sourceCoverage: string[]
 * }}
 */
export function buildDomainKnowledge(domain, pomSummaries, specSummaries) {
  const entry = getDomainConfigEntry(domain) ?? {
    pomPaths: [],
    specPaths: [],
    navigationHint: '_unknown_',
    keyEntryPoints: [],
  };

  const components = [...pomSummaries]
    .sort((a, b) => a.className.localeCompare(b.className))
    .map((pom) => buildComponentModel(pom, entry));

  return {
    domain,
    displayName: resolveDisplayName(domain, entry),
    navigationHint: entry.navigationHint,
    keyEntryPoints: [...(entry.keyEntryPoints ?? [])],
    componentNames: components.map((component) => component.className),
    componentCount: components.length,
    workflows: buildWorkflowModels(specSummaries),
    commonElements: buildCommonElements(pomSummaries, specSummaries),
    actions: buildActionModels(pomSummaries, specSummaries),
    detailFile: `${domain}.md`,
    components,
    pomFileCount: pomSummaries.length,
    specFileCount: specSummaries.length,
    sourceCoverage: buildSourceCoverage(entry),
  };
}

function buildComponentModel(pom, entry) {
  const relatedComponents = [...new Set(pom.subComponents)].sort((a, b) => a.localeCompare(b));
  const actions = pom.actions
    .map((action) => `${action.name}(${action.params.join(', ')})`)
    .sort((a, b) => a.localeCompare(b));
  const elements = [...pom.locators]
    .sort((a, b) => a.name.localeCompare(b.name) || a.css.localeCompare(b.css))
    .map((locator) => ({ label: humanizeIdentifier(locator.name), css: locator.css }));

  return {
    className: pom.className,
    cssRoot: resolveCssRoot(pom, entry),
    elements,
    actions,
    relatedComponents,
  };
}

function resolveCssRoot(pom, entry) {
  const explicitRoot = findExplicitRootLocator(pom.locators);
  if (explicitRoot) {
    return explicitRoot.css;
  }

  const overrideCss =
    entry.componentOverrides?.[pom.className]?.cssRoot ?? entry.components?.[pom.className]?.cssRoot;
  if (typeof overrideCss === 'string' && overrideCss.trim()) {
    return overrideCss.trim();
  }

  const prioritized = [...pom.locators].sort((a, b) => {
    const rankDiff = rankLocatorPriority(a) - rankLocatorPriority(b);
    if (rankDiff !== 0) {
      return rankDiff;
    }
    return a.name.localeCompare(b.name);
  });

  return prioritized[0]?.css ?? '_unknown_';
}

function findExplicitRootLocator(locators) {
  const explicitNames = new Set(['root', 'container']);
  for (const locator of locators) {
    const normalized = locator.name.toLowerCase();
    if (explicitNames.has(normalized) || normalized.endsWith('root') || normalized.endsWith('container')) {
      return locator;
    }
  }
  return null;
}

function rankLocatorPriority(locator) {
  const token = `${locator.name} ${locator.css}`.toLowerCase();
  if (token.includes('container')) return 0;
  if (token.includes('panel')) return 1;
  if (token.includes('widget')) return 2;
  return 3;
}

function buildWorkflowModels(specSummaries) {
  const workflowMap = new Map();

  for (const summary of specSummaries) {
    const source = path.basename(summary.filePath);
    for (const workflowName of summary.workflowNames) {
      const record = workflowMap.get(workflowName) ?? {
        name: workflowName,
        frequency: 0,
        sources: new Set(),
      };
      record.frequency += 1;
      record.sources.add(source);
      workflowMap.set(workflowName, record);
    }
  }

  return [...workflowMap.values()]
    .map((record) => ({
      name: record.name,
      frequency: record.frequency,
      sources: [...record.sources].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => b.frequency - a.frequency || a.name.localeCompare(b.name));
}

function buildCommonElements(pomSummaries, specSummaries) {
  const elementMap = new Map();

  for (const pom of pomSummaries) {
    for (const locator of pom.locators) {
      addElementObservation(elementMap, {
        label: humanizeIdentifier(locator.name),
        example: locator.css,
      });
    }
  }

  for (const spec of specSummaries) {
    for (const token of spec.locatorTokens) {
      addElementObservation(elementMap, {
        label: labelForLocatorToken(token),
        example: token,
      });
    }
  }

  return [...elementMap.values()]
    .map((record) => ({
      label: record.label,
      frequency: record.frequency,
      examples: [...record.examples].sort((a, b) => a.localeCompare(b)).slice(0, 3),
    }))
    .sort((a, b) => b.frequency - a.frequency || a.label.localeCompare(b.label));
}

function addElementObservation(elementMap, { label, example }) {
  const normalizedLabel = normalizeWhitespace(label);
  const record = elementMap.get(normalizedLabel) ?? {
    label: normalizedLabel,
    frequency: 0,
    examples: new Set(),
  };
  record.frequency += 1;
  record.examples.add(example);
  elementMap.set(normalizedLabel, record);
}

function buildActionModels(pomSummaries, specSummaries) {
  const signatureByName = new Map();
  const frequencyBySignature = new Map();

  for (const pom of pomSummaries) {
    for (const action of pom.actions) {
      const signature = `${action.name}(${action.params.join(', ')})`;
      signatureByName.set(action.name, signature);
      frequencyBySignature.set(signature, 0);
    }
  }

  for (const summary of specSummaries) {
    for (const call of summary.actionCalls) {
      const signature = signatureByName.get(call) ?? `${call}()`;
      const current = frequencyBySignature.get(signature) ?? 0;
      frequencyBySignature.set(signature, current + 1);
    }
  }

  return [...frequencyBySignature.entries()]
    .map(([signature, frequency]) => ({ signature, frequency }))
    .sort((a, b) => b.frequency - a.frequency || a.signature.localeCompare(b.signature));
}

function buildSourceCoverage(entry) {
  const formatted = [
    ...(entry.pomPaths ?? []).map(formatPomSource),
    ...(entry.specPaths ?? []).map(formatSpecSource),
  ];
  return [...new Set(formatted)];
}

function formatPomSource(fileOrDir) {
  return fileOrDir.endsWith('.js') ? fileOrDir : `${fileOrDir}/**/*.js`;
}

function formatSpecSource(fileOrDir) {
  return /\.(?:spec\.)?(?:ts|js)$/i.test(fileOrDir) ? fileOrDir : `${fileOrDir}/**/*.{ts,js}`;
}

function labelForLocatorToken(token) {
  if (token.startsWith('.') || token.startsWith('#')) {
    return humanizeCssToken(token);
  }
  if (token.includes('.get')) {
    return token.split('.').pop() ?? token;
  }
  return normalizeWhitespace(token);
}

function humanizeIdentifier(value) {
  return normalizeWhitespace(
    value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
  );
}

function humanizeCssToken(value) {
  const cleaned = value.replace(/^[.#]/, '').split(/[\s>:[\]]/)[0] ?? value;
  return humanizeIdentifier(cleaned);
}

function normalizeWhitespace(text) {
  return text.trim().replace(/\s+/g, ' ');
}
