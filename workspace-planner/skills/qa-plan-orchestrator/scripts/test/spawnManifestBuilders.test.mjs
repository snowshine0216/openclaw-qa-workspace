import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSupportingIssueSpawnRequest,
  buildDeepResearchSpawnRequest,
} from '../lib/spawnManifestBuilders.mjs';

test('buildSupportingIssueSpawnRequest emits requirement trace ids and output artifacts', () => {
  const request = buildSupportingIssueSpawnRequest({
    featureId: 'BCIN-7289',
    supportingIssueKey: 'BCED-2416',
    runDir: '/tmp/fqpo/runs/BCIN-7289',
    requestRequirementIds: ['req-read-support', 'req-save-summary'],
  });

  assert.equal(request.source.kind, 'supporting-issue-context');
  assert.equal(request.source.supporting_issue_key, 'BCED-2416');
  assert.deepEqual(request.source.request_requirement_ids, ['req-read-support', 'req-save-summary']);
  assert.deepEqual(request.source.output_artifact_paths, [
    'context/supporting_issue_relation_map_BCIN-7289.md',
    'context/supporting_issue_summary_BCED-2416_BCIN-7289.md',
    'context/supporting_issue_summary_BCIN-7289.md',
  ]);
  assert.match(request.openclaw.args.task, /context_only_no_defect_analysis/);
});

test('buildDeepResearchSpawnRequest emits tavily-first ordering and output artifacts', () => {
  const request = buildDeepResearchSpawnRequest({
    featureId: 'BCIN-7289',
    topicSlug: 'report_editor_workstation_functionality',
    runDir: '/tmp/fqpo/runs/BCIN-7289',
    deepResearchPolicy: 'tavily_first_confluence_second',
    requestRequirementIds: ['req-research-workstation', 'req-tool-order'],
  });

  assert.equal(request.source.kind, 'deep-research');
  assert.equal(request.source.topic_slug, 'report_editor_workstation_functionality');
  assert.deepEqual(request.source.request_requirement_ids, ['req-research-workstation', 'req-tool-order']);
  assert.match(request.openclaw.args.task, /Tavily/i);
  assert.match(request.openclaw.args.task, /Confluence fallback/i);
  assert.deepEqual(request.source.output_artifact_paths, [
    'context/deep_research_tavily_report_editor_workstation_BCIN-7289.md',
    'context/deep_research_confluence_report_editor_workstation_BCIN-7289.md',
  ]);
});

test('buildDeepResearchSpawnRequest rejects unsupported research ordering policy', () => {
  assert.throws(() => {
    buildDeepResearchSpawnRequest({
      featureId: 'BCIN-7289',
      topicSlug: 'report_editor_workstation_functionality',
      runDir: '/tmp/fqpo/runs/BCIN-7289',
      deepResearchPolicy: 'confluence_first',
      requestRequirementIds: ['req-research-workstation'],
    });
  }, /tavily_first_confluence_second/);
});
