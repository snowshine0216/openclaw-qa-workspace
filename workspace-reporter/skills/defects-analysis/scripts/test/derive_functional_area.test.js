import test from 'node:test';
import assert from 'node:assert/strict';

import { inferFunctionalArea } from '../lib/derive_functional_area.mjs';

test('ADF attachment filename does not trigger Image Handling classification', () => {
  const defect = {
    summary: 'Discrepancy between Webstation and Workstation',
    description:
      '{"content":[{"type":"mediaSingle","content":[{"type":"media","attrs":{"id":"f829552c","type":"file","collection":"","name":"image-20260324-021922.png"}}]}]}',
  };
  const area = inferFunctionalArea(defect);
  assert.notEqual(area, 'Image Handling', `Expected area NOT to be "Image Handling", got "${area}"`);
  assert.equal(area, 'General');
});

test('image keyword in summary still classifies as Image Handling', () => {
  const defect = {
    summary: 'Image is not rendered correctly after upload',
    description: '',
  };
  assert.equal(inferFunctionalArea(defect), 'Image Handling');
});

test('explicit area field takes precedence over keyword matching', () => {
  const defect = {
    area: 'Save / Save-As Flows',
    summary: 'Image thumbnail missing in save dialog',
    description: '',
  };
  assert.equal(inferFunctionalArea(defect), 'Save / Save-As Flows');
});

const AREA_RULE_FIXTURES = [
  { keyword: 'information window', expected: 'Information Window' },
  { keyword: 'IFW panel missing', expected: 'Information Window' },
  { keyword: 'rich text box alignment', expected: 'Rich Text & Narrative Content' },
  { keyword: 'markdown rendering broken', expected: 'Rich Text & Narrative Content' },
  { keyword: 'image not visible', expected: 'Image Handling' },
  { keyword: 'HEIC format unsupported', expected: 'Image Handling' },
  { keyword: 'selector dropdown flickers', expected: 'Object Selection & Binding' },
  { keyword: 'layout shifts after resize', expected: 'Layout & Positioning' },
  { keyword: 'save-as dialog crashes', expected: 'Save / Save-As Flows' },
  { keyword: 'prompt handling loop', expected: 'Prompt Handling' },
  { keyword: 'locale zh-CN missing translation', expected: 'Localization / i18n' },
  { keyword: 'session timeout popup appears twice', expected: 'Session & Dialog Handling' },
  { keyword: 'toolbar menu item missing', expected: 'Toolbar & Menus' },
  { keyword: 'performance degradation on load', expected: 'Performance' },
  { keyword: 'action fails consistently', expected: 'Action Reliability' },
];

for (const { keyword, expected } of AREA_RULE_FIXTURES) {
  test(`AREA_RULE: "${keyword}" classifies as "${expected}"`, () => {
    const defect = { summary: keyword, description: '' };
    assert.equal(inferFunctionalArea(defect), expected);
  });
}
