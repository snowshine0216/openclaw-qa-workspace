import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDomainKnowledge } from '../src/buildDomainKnowledge.mjs';

const POMS = [
  {
    className: 'CalendarFilter',
    locators: [
      { name: 'ApplyButton', css: '.mstrd-Apply-btn', type: 'button' },
      { name: 'PanelContainer', css: '.mstrd-FilterPanel', type: 'element' },
    ],
    actions: [
      { name: 'applyFilter', params: [] },
      { name: 'clearFilter', params: [] },
    ],
    subComponents: ['CalendarWidget'],
  },
  {
    className: 'CheckboxFilter',
    locators: [
      { name: 'Root', css: '.mstrd-CheckboxFilter', type: 'element' },
      { name: 'SearchBox', css: '.mstrd-FilterSearch', type: 'input' },
    ],
    actions: [
      { name: 'searchElement', params: ['text'] },
    ],
    subComponents: [],
  },
];

const SPECS = [
  {
    filePath: '/tmp/specs/filter/one.spec.ts',
    workflowNames: ['Apply attribute filter', 'Clear all filters'],
    actionCalls: ['applyFilter', 'applyFilter', 'searchElement'],
    locatorTokens: ['.mstrd-Apply-btn', '.mstrd-FilterSearch'],
    componentMentions: ['CalendarFilter', 'CheckboxFilter'],
  },
  {
    filePath: '/tmp/specs/filter/two.spec.ts',
    workflowNames: ['Apply attribute filter'],
    actionCalls: ['clearFilter'],
    locatorTokens: ['.mstrd-Apply-btn'],
    componentMentions: ['CalendarFilter'],
  },
];

test('buildDomainKnowledge -- builds alias-aware, deterministic domain model', () => {
  const out = buildDomainKnowledge('autoAnswers', POMS, SPECS);

  assert.equal(out.domain, 'autoAnswers');
  assert.equal(out.displayName, 'AutoAnswers (AI Assistant)');
  assert.equal(out.componentCount, 2);
  assert.deepEqual(out.componentNames, ['CalendarFilter', 'CheckboxFilter']);

  assert.equal(out.workflows[0].name, 'Apply attribute filter');
  assert.equal(out.workflows[0].frequency, 2);
  assert.equal(out.workflows[1].name, 'Clear all filters');

  assert.equal(out.commonElements[0].label, 'mstrd Apply btn');
  assert.equal(out.commonElements[0].frequency, 2);

  assert.equal(out.actions[0].signature, 'applyFilter()');
  assert.equal(out.actions[0].frequency, 2);
  assert.equal(out.actions[1].signature, 'clearFilter()');
  assert.equal(out.actions[1].frequency, 1);
});

test('buildDomainKnowledge -- applies CSS root fallback chain deterministically', () => {
  const out = buildDomainKnowledge('filter', POMS, SPECS);

  const calendarFilter = out.components.find((component) => component.className === 'CalendarFilter');
  const checkboxFilter = out.components.find((component) => component.className === 'CheckboxFilter');

  assert.equal(calendarFilter.cssRoot, '.mstrd-FilterPanel');
  assert.equal(checkboxFilter.cssRoot, '.mstrd-CheckboxFilter');
});

test('buildDomainKnowledge -- includes source coverage templates from config', () => {
  const out = buildDomainKnowledge('filter', POMS, SPECS);

  assert.ok(out.sourceCoverage.includes('pageObjects/filter/**/*.js'));
  assert.ok(out.sourceCoverage.includes('specs/regression/filter/**/*.{ts,js}'));
});
