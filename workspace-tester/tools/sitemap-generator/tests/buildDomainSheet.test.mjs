import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDomainSheet, renderComponentSection } from '../src/buildDomainSheet.mjs';

const STUB_POM = {
  domain: 'filter',
  className: 'CalendarFilter',
  parentClass: 'BaseContainer',
  locators: [{ name: 'ApplyButton', css: '.mstrd-Apply-btn', type: 'button' }],
  actions: [
    { name: 'applyFilter', params: [] },
    { name: 'selectDate', params: ['year', 'month', 'day'] },
  ],
  subComponents: ['CalendarWidget'],
};

test('renderComponentSection -- includes class name as h3 heading', () => {
  const out = renderComponentSection(STUB_POM);
  assert.match(out, /^### CalendarFilter/m);
});

test('renderComponentSection -- includes CSS selector', () => {
  const out = renderComponentSection(STUB_POM);
  assert.match(out, /\.mstrd-Apply-btn/);
});

test('renderComponentSection -- includes actions with params', () => {
  const out = renderComponentSection(STUB_POM);
  assert.match(out, /selectDate\(year, month, day\)/);
});

test('renderComponentSection -- lists sub-components', () => {
  const out = renderComponentSection(STUB_POM);
  assert.match(out, /- CalendarWidget/);
});

test('renderComponentSection -- POM with no locators does not crash', () => {
  const out = renderComponentSection({ ...STUB_POM, locators: [] });
  assert.match(out, /\| _none_ \| \| \|/);
});

test('buildDomainSheet -- returns DomainSheet with correct domain name', () => {
  const out = buildDomainSheet('filter', [STUB_POM]);
  assert.equal(out.domain, 'filter');
});

test('buildDomainSheet -- componentCount equals number of POMs passed', () => {
  const out = buildDomainSheet('filter', [STUB_POM, { ...STUB_POM, className: 'CheckboxFilter' }]);
  assert.equal(out.componentCount, 2);
});

test('buildDomainSheet -- content starts with # Site Knowledge:', () => {
  const out = buildDomainSheet('filter', [STUB_POM]);
  assert.match(out.content, /^# Site Knowledge: filter/);
});

test('buildDomainSheet -- empty POMs array -> componentCount is 0', () => {
  const out = buildDomainSheet('filter', []);
  assert.equal(out.componentCount, 0);
  assert.match(out.content, /> Components: 0/);
});
