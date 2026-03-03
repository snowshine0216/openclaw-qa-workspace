#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const packageJsonPath = path.join(projectRoot, 'package.json');
const playwrightConfigPath = path.join(projectRoot, 'playwright.config.ts');
const fixtureFilePath = path.join(projectRoot, 'tests/fixtures/index.ts');
const loginHelperPath = path.join(projectRoot, 'tests/page-objects/library/login-page.ts');
const libraryHelperPath = path.join(projectRoot, 'tests/page-objects/library/library-page.ts');
const outputPath = path.join(projectRoot, '.agents/context/framework-profile.json');

const toPosix = (inputPath) => inputPath.split(path.sep).join('/');

function fail(message) {
  process.stderr.write(`framework-profile error: ${message}\n`);
  process.exit(1);
}

function readText(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  const text = readText(filePath);
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`invalid JSON in ${toPosix(path.relative(projectRoot, filePath))}: ${String(error)}`);
  }
}

function relativePath(filePath) {
  return toPosix(path.relative(projectRoot, filePath));
}

function extractTestDir(configText) {
  if (!configText) {
    return 'tests';
  }
  const match = configText.match(/testDir:\s*['"`]([^'"`]+)['"`]/);
  const value = match?.[1] ?? './tests';
  return value.replace(/^\.\//, '').replace(/\/+$/, '');
}

function listFilesRecursive(baseDir, extension, maxFiles = 2000) {
  if (!fs.existsSync(baseDir)) {
    return [];
  }
  const files = [];
  const stack = [baseDir];
  while (stack.length > 0 && files.length < maxFiles) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  return files.sort();
}

function detectExistingFixtureImport(testSpecsDir) {
  const specFiles = listFilesRecursive(testSpecsDir, '.spec.ts');
  for (const file of specFiles) {
    const text = readText(file);
    if (!text) {
      continue;
    }
    const match = text.match(/from\s+['"]([^'"]*fixtures(?:\/index)?(?:\.ts)?)['"]/);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

function extractAsyncMethods(filePath) {
  const text = readText(filePath);
  if (!text) {
    return [];
  }
  const methods = new Set();
  const regex = /async\s+([A-Za-z0-9_]+)\s*\(/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    methods.add(match[1]);
  }
  return Array.from(methods).sort();
}

function computeFixtureImportForTemplate(testDir) {
  const sampleGeneratedSpec = path.join(
    projectRoot,
    testDir,
    'specs/feature-plan/FEATURE_KEY/SCENARIO_NAME.spec.ts'
  );
  const fixtureDir = path.join(projectRoot, testDir, 'fixtures');
  const relative = path.relative(path.dirname(sampleGeneratedSpec), fixtureDir);
  if (!relative || relative === '.') {
    return './fixtures';
  }
  const normalized = toPosix(relative);
  return normalized.startsWith('.') ? normalized : `./${normalized}`;
}

const packageJson = readJson(packageJsonPath);
if (!packageJson) {
  fail('package.json not found in current directory');
}
if (!fs.existsSync(playwrightConfigPath)) {
  fail('playwright.config.ts not found in current directory');
}

const playwrightConfigText = readText(playwrightConfigPath);
const testDir = extractTestDir(playwrightConfigText);
const testsRoot = path.join(projectRoot, testDir);
const existingFixtureImport = detectExistingFixtureImport(path.join(testsRoot, 'specs'));
const fixtureImportPath = existingFixtureImport ?? computeFixtureImportForTemplate(testDir);
const loginMethods = extractAsyncMethods(loginHelperPath);
const libraryMethods = extractAsyncMethods(libraryHelperPath);

const profile = {
  profile_version: 1,
  generated_at: new Date().toISOString(),
  project_root: toPosix(projectRoot),
  framework: {
    name: 'playwright',
    language: 'typescript',
    runner: packageJson.scripts?.test ?? 'npx playwright test',
    config_path: relativePath(playwrightConfigPath),
    test_dir: testDir,
  },
  templates: {
    planner_spec_input: 'specs/feature-plan/{feature_key}/**/*.md',
    generated_spec_output: 'tests/specs/feature-plan/{feature_key}/{scenario_name}.spec.ts',
  },
  generation: {
    fixture_file: relativePath(fixtureFilePath),
    fixture_import_path: fixtureImportPath,
    preferred_test_import: `import { test, expect } from '${fixtureImportPath}';`,
    existing_fixture_import_sample: existingFixtureImport,
  },
  reuse_contract: {
    login_helper: {
      file: relativePath(loginHelperPath),
      class_name: 'LoginPage',
      preferred_methods: loginMethods.filter((name) =>
        ['waitForLoginView', 'switchToStandardTabIfNeeded', 'login'].includes(name)
      ),
    },
    logout_helper: {
      file: relativePath(libraryHelperPath),
      class_name: 'LibraryPage',
      preferred_methods: libraryMethods.filter((name) =>
        ['logout', 'openDefaultApp'].includes(name)
      ),
    },
    fixture_auth_reference: `${relativePath(fixtureFilePath)}#authenticatedPage`,
    rules: [
      'Reuse fixture and POM login/logout helpers before creating new auth logic.',
      'Do not generate ad-hoc inline login/logout if existing helpers satisfy scenario setup.',
      'Keep generated specs under tests/specs/feature-plan/{feature_key}/.',
    ],
  },
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(profile, null, 2)}\n`, 'utf8');

process.stdout.write(`Generated ${relativePath(outputPath)}\n`);
process.stdout.write(`Runner: ${profile.framework.runner}\n`);
process.stdout.write(`Output template: ${profile.templates.generated_spec_output}\n`);
process.stdout.write(`Fixture import path: ${profile.generation.fixture_import_path}\n`);
