import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePomFile, extractLocators, extractActions, extractClassInfo } from '../src/parsePomFile.mjs';

const FIXTURES_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/pom');
const FIXTURE_POM = path.join(FIXTURES_ROOT, 'CalendarFilter.js');
const EMPTY_POM = path.join(FIXTURES_ROOT, 'Empty.js');

test('extractClassInfo -- extracts class name and parent', () => {
  const out = extractClassInfo('class CalendarFilter extends BaseContainer {}');
  assert.equal(out.className, 'CalendarFilter');
  assert.equal(out.parentClass, 'BaseContainer');
});

test('extractClassInfo -- no parent -> parentClass is null', () => {
  const out = extractClassInfo('class CalendarFilter {}');
  assert.equal(out.className, 'CalendarFilter');
  assert.equal(out.parentClass, null);
});

test('extractClassInfo -- malformed source -> throws', () => {
  assert.throws(() => extractClassInfo('const x = 1;'), /No class definition found/);
});

test('extractLocators -- extracts get* methods with CSS selector', () => {
  const source = `
    class CalendarFilter {
      getApplyButton() { return this.$('.mstrd-Apply-btn'); }
      getDateInput() { return this.$('.mstrd-Date-input'); }
    }
  `;
  const out = extractLocators(source);
  assert.equal(out.length, 2);
  assert.equal(out[0].name, 'ApplyButton');
  assert.equal(out[1].type, 'input');
});

test('extractLocators -- returns empty array when no get* methods', () => {
  const out = extractLocators('class Foo { value() { return 1; } }');
  assert.deepEqual(out, []);
});

test('extractLocators -- ignores get* methods without a $ selector', () => {
  const source = `
    class CalendarFilter {
      getText() { return 'abc'; }
      getApplyButton() { return this.$('.mstrd-Apply-btn'); }
    }
  `;
  const out = extractLocators(source);
  assert.equal(out.length, 1);
  assert.equal(out[0].name, 'ApplyButton');
});

test('extractActions -- extracts async methods with params', () => {
  const source = `
    class CalendarFilter {
      async applyFilter() {}
      async selectDate(year, month, day) {}
    }
  `;
  const out = extractActions(source);
  assert.equal(out.length, 2);
  assert.deepEqual(out[0], { name: 'applyFilter', params: [] });
  assert.deepEqual(out[1], { name: 'selectDate', params: ['year', 'month', 'day'] });
});

test('extractActions -- returns empty array when no async methods', () => {
  const out = extractActions('class Foo { value() { return 1; } }');
  assert.deepEqual(out, []);
});

test('parsePomFile -- returns complete PomSummary from fixture file', async () => {
  const out = await parsePomFile({
    domain: 'filter',
    filePath: FIXTURE_POM,
    fileName: 'CalendarFilter.js',
    isRemote: false,
  });

  assert.equal(out.domain, 'filter');
  assert.equal(out.className, 'CalendarFilter');
  assert.equal(out.parentClass, 'BaseContainer');
  assert.ok(out.locators.some((locator) => locator.name === 'ApplyButton'));
  assert.ok(out.actions.some((action) => action.name === 'selectDate'));
  assert.ok(out.subComponents.includes('CalendarWidget'));
});

test('parsePomFile -- fetches remote file content when entry.isRemote is true', async () => {
  const remoteSource = await parsePomFile(
    {
      domain: 'filter',
      filePath: 'https://api.github.com/repos/acme/wdio/contents/pageObjects/filter/CalendarFilter.js',
      fileName: 'CalendarFilter.js',
      isRemote: true,
    },
    {
      fetchRemote: async (apiPath) => {
        assert.equal(apiPath, 'repos/acme/wdio/contents/pageObjects/filter/CalendarFilter.js');
        return 'class CalendarFilter { getApplyButton() { return this.$(".btn"); } async applyFilter() {} }';
      },
    }
  );

  assert.equal(remoteSource.className, 'CalendarFilter');
  assert.equal(remoteSource.locators.length, 1);
  assert.equal(remoteSource.actions.length, 1);
});

test('parsePomFile -- non-existent file throws ENOENT-style error', async () => {
  await assert.rejects(
    () =>
      parsePomFile({
        domain: 'filter',
        filePath: path.join(FIXTURES_ROOT, 'DoesNotExist.js'),
        fileName: 'DoesNotExist.js',
        isRemote: false,
      }),
    /ENOENT|no such file/i
  );
});

test('parsePomFile -- empty file returns PomSummary with empty arrays', async () => {
  const out = await parsePomFile({
    domain: 'filter',
    filePath: EMPTY_POM,
    fileName: 'Empty.js',
    isRemote: false,
  });

  assert.equal(out.className, 'Empty');
  assert.equal(out.parentClass, null);
  assert.deepEqual(out.locators, []);
  assert.deepEqual(out.actions, []);
  assert.deepEqual(out.subComponents, []);
});
