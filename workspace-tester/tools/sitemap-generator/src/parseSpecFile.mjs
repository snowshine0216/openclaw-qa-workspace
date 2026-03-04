import fs from 'node:fs/promises';
import { fetchGitHubFileContent } from './github.mjs';

const IGNORED_ACTIONS = new Set([
  'describe',
  'it',
  'test',
  'step',
  'beforeAll',
  'beforeEach',
  'afterAll',
  'afterEach',
  'expect',
  'toBe',
  'toEqual',
  'toContain',
  'toMatch',
  'toHaveText',
  'toHaveValue',
  'toBeVisible',
  'click',
  'fill',
  'type',
  'setValue',
  'locator',
  'getByRole',
  'getByText',
  'getByLabel',
  'getByTestId',
  'getByPlaceholder',
  '$',
  '$$',
]);
const IGNORED_LOCATOR_REF_METHODS = new Set([
  'getByRole',
  'getByText',
  'getByLabel',
  'getByTestId',
  'getByPlaceholder',
  'getByAltText',
  'getByTitle',
]);

/**
 * Parse one spec file into usage-oriented summary.
 * @param {{domain: string, filePath: string, fileName: string, isRemote: boolean}} entry
 * @param {{fetchRemote?: (apiPath: string) => Promise<string>, readLocal?: (filePath: string) => Promise<string>}} [deps]
 * @returns {Promise<{
 *   domain: string,
 *   filePath: string,
 *   workflowNames: string[],
 *   actionCalls: string[],
 *   locatorTokens: string[],
 *   componentMentions: string[]
 * }>}
 */
export async function parseSpecFile(entry, deps = {}) {
  const fetchRemote = deps.fetchRemote ?? fetchGitHubFileContent;
  const readLocal = deps.readLocal ?? ((filePath) => fs.readFile(filePath, 'utf8'));
  const source = entry.isRemote
    ? await fetchRemote(entry.filePath.replace('https://api.github.com/', ''))
    : await readLocal(entry.filePath);

  return {
    domain: entry.domain,
    filePath: entry.filePath,
    workflowNames: extractWorkflowNames(source),
    actionCalls: extractActionCalls(source),
    locatorTokens: extractLocatorTokens(source),
    componentMentions: extractComponentMentions(source),
  };
}

/**
 * Extract workflow names from semantic action flow.
 * @param {string} source
 * @returns {string[]}
 */
export function extractWorkflowNames(source) {
  const setupSteps = extractHookWorkflowSteps(source);
  const testCases = extractAsyncTestCases(source);

  if (testCases.length === 0) {
    return extractWorkflowFallbackFromTitles(source);
  }

  const workflows = [];
  for (const testCase of testCases) {
    const bodySteps = extractSemanticWorkflowSteps(testCase.body);
    const titleSteps = inferWorkflowStepsFromTitle(testCase.title);
    const merged = compactWorkflowSteps([...setupSteps, ...bodySteps, ...titleSteps]);

    if (merged.length > 0) {
      workflows.push(merged.join(' -> '));
      continue;
    }

    const fallback = sanitizeWorkflowTitle(testCase.title);
    if (fallback) {
      workflows.push(fallback);
    }
  }

  return uniqueInOrder(workflows);
}

/**
 * Extract action/API calls used in spec files.
 * @param {string} source
 * @returns {string[]}
 */
export function extractActionCalls(source) {
  const actions = [];
  const dotCallRe = /\.\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;

  for (const match of source.matchAll(dotCallRe)) {
    const action = match[1];
    if (!IGNORED_ACTIONS.has(action)) {
      actions.push(action);
    }
  }
  return actions;
}

/**
 * Extract locator-like tokens from specs.
 * @param {string} source
 * @returns {string[]}
 */
export function extractLocatorTokens(source) {
  const tokens = [];

  const locatorStringRe =
    /(?:\$\$?|locator|getByRole|getByText|getByLabel|getByTestId|getByPlaceholder|getByAltText|getByTitle)\s*\(\s*(['"`])([^'"`\n]+)\1/g;
  for (const match of source.matchAll(locatorStringRe)) {
    tokens.push(match[2]);
  }

  const cssStringRe = /(['"`])([.#][^'"`\n]{2,})\1/g;
  for (const match of source.matchAll(cssStringRe)) {
    if (!isLikelyImportPath(match[2])) {
      tokens.push(match[2]);
    }
  }

  const pageObjectRefRe = /\b([A-Za-z_][A-Za-z0-9_]*)\.(get[A-Z][A-Za-z0-9_]*)\s*\(/g;
  for (const match of source.matchAll(pageObjectRefRe)) {
    const objectName = match[1];
    const methodName = match[2];
    if (isIgnoredLocatorRef(objectName, methodName)) {
      continue;
    }
    tokens.push(`${objectName}.${methodName}`);
  }

  return tokens;
}

/**
 * Extract component mentions from identifiers used in specs.
 * @param {string} source
 * @returns {string[]}
 */
export function extractComponentMentions(source) {
  const mentions = [];

  const titleCaseComponentRe = /\b([A-Z][A-Za-z0-9]*(?:Filter|Panel|Widget|Assistant|Bot|Bar|Container|Dialog|Grid|Card))\b/g;
  for (const match of source.matchAll(titleCaseComponentRe)) {
    mentions.push(match[1]);
  }

  const lowerComponentRe = /\b([a-z][A-Za-z0-9]*(?:Filter|Panel|Widget|Assistant|Bot|Bar|Container|Dialog|Grid|Card))\b/g;
  for (const match of source.matchAll(lowerComponentRe)) {
    mentions.push(match[1]);
  }

  return [...new Set(mentions)].sort((a, b) => a.localeCompare(b));
}

function normalizeWhitespace(text) {
  return text.trim().replace(/\s+/g, ' ');
}

function uniqueInOrder(values) {
  const out = [];
  const seen = new Set();
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      out.push(value);
    }
  }
  return out;
}

function isLikelyImportPath(token) {
  return token.startsWith('./') || token.startsWith('../');
}

function isIgnoredLocatorRef(objectName, methodName) {
  if (IGNORED_LOCATOR_REF_METHODS.has(methodName)) {
    return true;
  }
  return ['page', 'browser', 'test', 'expect'].includes(objectName);
}

function extractHookWorkflowSteps(source) {
  const hookBodies = extractAsyncHookBodies(source);
  const steps = [];
  for (const body of hookBodies) {
    steps.push(...extractSemanticWorkflowSteps(body));
  }
  return compactWorkflowSteps(steps);
}

function extractAsyncHookBodies(source) {
  const out = [];
  const hookPattern = /\b(?:beforeAll|beforeEach)\s*\(\s*async\s*\([^)]*\)\s*=>\s*\{/g;

  for (const match of source.matchAll(hookPattern)) {
    const openBraceIndex = match.index + match[0].length - 1;
    const closeBraceIndex = findMatchingBrace(source, openBraceIndex);
    if (closeBraceIndex === -1) {
      continue;
    }
    out.push(source.slice(openBraceIndex + 1, closeBraceIndex));
  }

  return out;
}

function extractAsyncTestCases(source) {
  const out = [];
  const testPattern = /\b(?:it|test)\s*\(\s*(['"`])([^'"`\n]+)\1\s*,\s*async\s*\([^)]*\)\s*=>\s*\{/g;

  for (const match of source.matchAll(testPattern)) {
    const openBraceIndex = match.index + match[0].length - 1;
    const closeBraceIndex = findMatchingBrace(source, openBraceIndex);
    if (closeBraceIndex === -1) {
      continue;
    }
    out.push({
      title: match[2],
      body: source.slice(openBraceIndex + 1, closeBraceIndex),
    });
  }

  return out;
}

function findMatchingBrace(source, openBraceIndex) {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    const prev = source[index - 1];

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }
    if (inBlockComment) {
      if (prev === '*' && char === '/') {
        inBlockComment = false;
      }
      continue;
    }
    if (!inSingle && !inDouble && !inTemplate && char === '/' && next === '/') {
      inLineComment = true;
      continue;
    }
    if (!inSingle && !inDouble && !inTemplate && char === '/' && next === '*') {
      inBlockComment = true;
      continue;
    }

    if (!inDouble && !inTemplate && char === '\'' && prev !== '\\') {
      inSingle = !inSingle;
      continue;
    }
    if (!inSingle && !inTemplate && char === '"' && prev !== '\\') {
      inDouble = !inDouble;
      continue;
    }
    if (!inSingle && !inDouble && char === '`' && prev !== '\\') {
      inTemplate = !inTemplate;
      continue;
    }
    if (inSingle || inDouble || inTemplate) {
      continue;
    }

    if (char === '{') {
      depth += 1;
      continue;
    }
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function extractSemanticWorkflowSteps(source) {
  const steps = [];
  const dotCallRe = /\.\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;

  for (const match of source.matchAll(dotCallRe)) {
    const method = match[1];
    const callSnippet = source.slice(match.index, match.index + 200);
    const step = mapMethodToWorkflowStep(method, callSnippet);
    if (step) {
      steps.push(step);
    }
  }

  return compactWorkflowSteps(steps);
}

function mapMethodToWorkflowStep(method, callSnippet) {
  const normalized = method.toLowerCase();

  if (/^(login|signin|logon|authenticate)$/.test(normalized)) {
    return 'login';
  }
  if (/(editreportbyurl|editreport|openreportbyurl|openreport)$/.test(normalized)) {
    return 'edit report';
  }
  if (/(createnewreport|switchprojectbyname|searchtemplate|selecttemplate|clickcreatebutton)$/.test(normalized)) {
    return 'create report';
  }
  if (
    /(switchtothemepanel|searchtheme|applytheme|togglecertifiedthemes|hoveronthemeinfoicon|getcurrenttheme|getcurrentthemecontainer|isthemepaneldisplayed)$/.test(
      normalized
    )
  ) {
    return 'change report theme';
  }
  if (normalized === 'clicksubmenuitem') {
    const args = extractClickSubMenuArgs(callSnippet);
    const text = `${args.menu} ${args.submenu}`.toLowerCase();
    if (text.includes('theme')) {
      return 'change report theme';
    }
    if (text.includes('filter')) {
      return 'change report filter';
    }
    if (text.includes('format')) {
      return 'edit report format';
    }
  }
  if (
    /(switchtofilterpanel|applyfilter|clearfilter|searchelement|searchbox|selectdate|setfilter|removefilter|addfilter|getsearchbox|togglefilter)$/.test(
      normalized
    )
  ) {
    return 'change report filter';
  }
  if (
    /(switchtodesignmode|switchtoformatpanel|switchtotextformattab|expandlayoutsection|selectgridsegment|selectgridcolumns)$/.test(
      normalized
    )
  ) {
    return 'edit report format';
  }
  if (normalized === 'resizeeditorpanel') {
    return 'resize editor panel';
  }
  if (/^(opendefaultapp|openlibrary)$/.test(normalized)) {
    return 'open library';
  }

  return null;
}

function extractClickSubMenuArgs(callSnippet) {
  const match = callSnippet.match(
    /clickSubMenuItem\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*['"`]([^'"`]+)['"`]/
  );
  if (!match) {
    return { menu: '', submenu: '' };
  }
  return { menu: match[1], submenu: match[2] };
}

function inferWorkflowStepsFromTitle(title) {
  const cleaned = sanitizeWorkflowTitle(title).toLowerCase();
  const inferred = [];

  if (cleaned.includes('theme')) {
    inferred.push('change report theme');
  }
  if (cleaned.includes('filter')) {
    inferred.push('change report filter');
  }
  if (cleaned.includes('report') && cleaned.includes('create')) {
    inferred.push('create report');
  }
  if (cleaned.includes('format')) {
    inferred.push('edit report format');
  }
  if (cleaned.includes('resize') && cleaned.includes('panel')) {
    inferred.push('resize editor panel');
  }

  return compactWorkflowSteps(inferred);
}

function compactWorkflowSteps(steps) {
  const out = [];
  for (const step of steps) {
    if (!step) {
      continue;
    }
    if (out[out.length - 1] === step) {
      continue;
    }
    if (!out.includes(step)) {
      out.push(step);
    }
  }
  return out;
}

function extractWorkflowFallbackFromTitles(source) {
  const titles = [];
  const titlePattern = /\b(?:describe|it|test)\s*\(\s*(['"`])([^'"`\n]+)\1/g;
  for (const match of source.matchAll(titlePattern)) {
    const cleaned = sanitizeWorkflowTitle(match[2]);
    if (cleaned) {
      titles.push(cleaned);
    }
  }
  return uniqueInOrder(titles);
}

function sanitizeWorkflowTitle(title) {
  return normalizeWhitespace(
    title
      .replace(/^\[[^\]]+\]\s*/, '')
      .replace(/^(?:TC|BCIN)-?[A-Za-z0-9_/-]+\s*/i, '')
  );
}
