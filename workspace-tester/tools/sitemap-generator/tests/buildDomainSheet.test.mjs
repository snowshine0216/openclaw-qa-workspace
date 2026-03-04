import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDomainSheet } from '../src/buildDomainSheet.mjs';

const STUB_MODEL = {
  domain: 'filter',
  displayName: 'Filter',
  componentNames: ['CalendarFilter'],
  componentCount: 1,
  specFileCount: 2,
  pomFileCount: 1,
  components: [
    {
      className: 'CalendarFilter',
      cssRoot: '.mstrd-CalendarWidget',
      elements: [{ label: 'Apply Button', css: '.mstrd-Apply-btn' }],
      actions: ['applyFilter()'],
      relatedComponents: ['CalendarWidget'],
    },
  ],
  workflows: [{ name: 'Apply filter', frequency: 2 }],
  commonElements: [{ label: 'Apply Button', frequency: 3, examples: ['.mstrd-Apply-btn'] }],
  actions: [{ signature: 'applyFilter()', frequency: 2 }],
  sourceCoverage: ['pageObjects/filter/**/*.js', 'specs/regression/filter/**/*.{ts,js}'],
};

test('buildDomainSheet -- returns DomainSheet with correct domain name', () => {
  const out = buildDomainSheet(STUB_MODEL);
  assert.equal(out.domain, 'filter');
});

test('buildDomainSheet -- exposes counts from model', () => {
  const out = buildDomainSheet(STUB_MODEL);
  assert.equal(out.componentCount, 1);
  assert.equal(out.workflowCount, 1);
  assert.equal(out.commonElementCount, 1);
});

test('buildDomainSheet -- content includes required section headers', () => {
  const out = buildDomainSheet(STUB_MODEL);
  assert.match(out.content, /## Overview/);
  assert.match(out.content, /## Components/);
  assert.match(out.content, /## Common Workflows \(from spec\.ts\)/);
  assert.match(out.content, /## Source Coverage/);
  assert.doesNotMatch(out.content, /## Common Elements \(from POM \+ spec\.ts\)/);
  assert.doesNotMatch(out.content, /## Key Actions/);
  assert.doesNotMatch(out.content, /\*\*Component actions:\*\*/);
});

test('buildDomainSheet -- verbose mode includes common elements and action sections', () => {
  const out = buildDomainSheet(STUB_MODEL, { verbose: true });
  assert.match(out.content, /## Common Elements \(from POM \+ spec\.ts\)/);
  assert.match(out.content, /## Key Actions/);
  assert.match(out.content, /\*\*Component actions:\*\*/);
});

test('buildDomainSheet -- empty sections render deterministic placeholders', () => {
  const out = buildDomainSheet({
    ...STUB_MODEL,
    componentNames: [],
    components: [],
    workflows: [],
    commonElements: [],
    actions: [],
    sourceCoverage: [],
    componentCount: 0,
  });

  assert.match(out.content, /\*\*Components covered:\*\* _none_/);
  assert.match(out.content, /## Components\n\n_none_/);
  assert.match(out.content, /1\. _none_/);
  assert.match(out.content, /- _none_/);
});
