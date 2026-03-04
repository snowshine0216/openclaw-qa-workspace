import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractActionCalls,
  extractComponentMentions,
  extractLocatorTokens,
  extractWorkflowNames,
  parseSpecFile,
} from '../src/parseSpecFile.mjs';

const FIXTURES_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/wdio-stub');
const FILTER_SPEC = path.join(FIXTURES_ROOT, 'specs/regression/filter/CalendarFilter.spec.ts');

test('extractWorkflowNames -- parses describe/it/test/test.step titles', () => {
  const source = `
    beforeAll(async () => {
      await loginPage.login(testUser);
    });
    describe('Filter workflows', () => {
      it('[BCIN-1001_01] Apply attribute filter', async () => {
        await libraryPage.editReportByUrl({});
        await CalendarFilter.applyFilter();
      });
    });
  `;

  const out = extractWorkflowNames(source);
  assert.deepEqual(out, ['login -> edit report -> change report filter']);
});

test('extractWorkflowNames -- infers workflow from title when action calls are not mappable', () => {
  const source = `
    it('[BCIN-6488_10] choose select theme from top menu when theme panel is not show', async () => {
      await page.locator('.any-button').click();
    });
  `;

  const out = extractWorkflowNames(source);
  assert.deepEqual(out, ['change report theme']);
});

test('extractActionCalls -- excludes test-framework methods and keeps behavioral calls', () => {
  const source = `
    await CalendarFilter.applyFilter();
    await page.locator('.btn').click();
    expect(value).toBe(true);
  `;

  const out = extractActionCalls(source);
  assert.ok(out.includes('applyFilter'));
  assert.equal(out.includes('click'), false);
  assert.equal(out.includes('toBe'), false);
});

test('extractLocatorTokens -- captures selector strings and page-object getter refs', () => {
  const source = `
    await page.locator('.mstrd-Apply-btn').click();
    await browser.$('#main-filter').click();
    await filterPanel.getSearchBox();
  `;

  const out = extractLocatorTokens(source);
  assert.ok(out.includes('.mstrd-Apply-btn'));
  assert.ok(out.includes('#main-filter'));
  assert.ok(out.includes('filterPanel.getSearchBox'));
});

test('extractComponentMentions -- extracts component-like identifiers', () => {
  const source = `
    import CalendarFilter from './CalendarFilter';
    await CalendarFilter.applyFilter();
    await filterPanel.open();
  `;

  const out = extractComponentMentions(source);
  assert.ok(out.includes('CalendarFilter'));
  assert.ok(out.includes('filterPanel'));
});

test('parseSpecFile -- returns complete SpecSummary from fixture file', async () => {
  const out = await parseSpecFile({
    domain: 'filter',
    filePath: FILTER_SPEC,
    fileName: 'CalendarFilter.spec.ts',
    isRemote: false,
  });

  assert.equal(out.domain, 'filter');
  assert.equal(out.filePath, FILTER_SPEC);
  assert.ok(out.workflowNames.includes('change report filter'));
  assert.ok(out.actionCalls.includes('applyFilter'));
  assert.ok(out.locatorTokens.includes('.mstrd-Apply-btn'));
  assert.ok(out.componentMentions.includes('CalendarFilter'));
  assert.equal(out.workflowNames.some((name) => name.includes('[BCIN-')), false);
});


test('parseSpecFile -- fetches remote file content when entry.isRemote is true', async () => {
  const out = await parseSpecFile(
    {
      domain: 'filter',
      filePath: 'https://api.github.com/repos/acme/wdio/contents/specs/regression/filter/Filter.spec.ts',
      fileName: 'Filter.spec.ts',
      isRemote: true,
    },
    {
      fetchRemote: async (apiPath) => {
        assert.equal(apiPath, 'repos/acme/wdio/contents/specs/regression/filter/Filter.spec.ts');
        return `describe('Filter', () => { it('Apply', async () => { await page.locator('.btn').click(); }); });`;
      },
    }
  );

  assert.equal(out.workflowNames[0], 'Apply');
  assert.ok(out.locatorTokens.includes('.btn'));
});
