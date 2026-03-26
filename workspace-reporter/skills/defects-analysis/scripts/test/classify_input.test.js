import test from 'node:test';
import assert from 'node:assert/strict';

import { deriveRouteDecision } from '../lib/classify_input.mjs';

test('routes bug issue keys to issue_class', () => {
  const result = deriveRouteDecision({ rawInput: 'BCIN-5809', jiraIssueType: 'Bug' });
  assert.equal(result.route_kind, 'issue_class');
  assert.equal(result.run_key, 'BCIN-5809');
});

test('routes feature issue keys to reporter scope', () => {
  const result = deriveRouteDecision({ rawInput: 'BCIN-5809', jiraIssueType: 'Feature' });
  assert.equal(result.route_kind, 'reporter_scope_single_key');
  assert.equal(result.delegates_to, null);
});

test('routes release versions to release scope', () => {
  const result = deriveRouteDecision({ rawInput: '26.03' });
  assert.equal(result.route_kind, 'reporter_scope_release');
  assert.equal(result.run_key, 'release_26.03');
  assert.equal(result.release_version, '26.03');
  assert.equal(result.release_scope, null);
});

test('adds scoped release run key when qa_owner targets current user', () => {
  const result = deriveRouteDecision({
    rawInput: '26.04',
    releaseVersion: '26.04',
    qaOwner: 'current_user',
  });
  assert.equal(result.route_kind, 'reporter_scope_release');
  assert.match(result.run_key, /^release_26\.04__scope_[a-f0-9]{8}$/);
  assert.deepEqual(result.release_scope, {
    release_version: '26.04',
    qa_owner_field: 'QA Owner',
    qa_owner_mode: 'current_user',
    qa_owner_value: null,
  });
});

test('normalizes qa_owner aliases and custom qa_owner_field', () => {
  const result = deriveRouteDecision({
    rawInput: '26.04',
    releaseVersion: '26.04',
    qaOwner: 'me',
    qaOwnerField: 'QA Owner Custom',
  });
  assert.equal(result.route_kind, 'reporter_scope_release');
  assert.deepEqual(result.release_scope, {
    release_version: '26.04',
    qa_owner_field: 'QA Owner Custom',
    qa_owner_mode: 'current_user',
    qa_owner_value: null,
  });
});

test('rejects explicit invalid release versions', () => {
  assert.throws(
    () =>
      deriveRouteDecision({
        rawInput: 'run defects analysis',
        releaseVersion: 'foo',
      }),
    /Invalid release version: foo/,
  );
});

test('routes jql queries to jql scope', () => {
  const result = deriveRouteDecision({ rawInput: 'project = BCIN AND issuetype = Defect' });
  assert.equal(result.route_kind, 'reporter_scope_jql');
  assert.match(result.run_key, /^jql_[a-f0-9]{12}$/);
});
