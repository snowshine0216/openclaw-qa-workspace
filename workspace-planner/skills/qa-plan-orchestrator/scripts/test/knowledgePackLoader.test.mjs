import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  KNOWN_DEEP_RESEARCH_TOPIC_SLUGS,
  loadKnowledgePackRuntime,
} from '../lib/knowledgePackLoader.mjs';

async function writePack(root, key, pack) {
  const dir = join(root, key);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'pack.json'), `${JSON.stringify(pack, null, 2)}\n`, 'utf8');
}

test('loadKnowledgePackRuntime resolves an explicitly requested pack and normalizes optional arrays', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pack-loader-'));

  try {
    await writePack(root, 'report-editor', {
      pack_key: 'report-editor',
      version: '2026-03-23',
      required_capabilities: ['template-based creation'],
      deep_research_topics: ['report_editor_workstation_functionality'],
    });

    const result = await loadKnowledgePackRuntime({
      featureId: 'BCIN-7289',
      requestedKnowledgePackKey: 'report-editor',
      featureFamily: null,
      packRootDir: root,
      repoRoot: '/tmp/repo',
      targetSkillPath: 'workspace-planner/skills/qa-plan-orchestrator',
      targetSkillName: 'qa-plan-orchestrator',
      benchmarkProfile: 'qa-plan-v2',
    });

    assert.equal(result.mode, 'active_pack');
    assert.equal(result.taskPatch.knowledge_pack_key, 'report-editor');
    assert.equal(result.taskPatch.requested_knowledge_pack_key, 'report-editor');
    assert.equal(result.taskPatch.resolved_knowledge_pack_key, 'report-editor');
    assert.equal(result.taskPatch.knowledge_pack_resolution_source, 'provided');
    assert.equal(result.taskPatch.knowledge_pack_version, '2026-03-23');
    assert.equal(result.taskPatch.knowledge_pack_row_count, 1);
    assert.deepEqual(result.taskPatch.knowledge_pack_deep_research_topics, ['report_editor_workstation_functionality']);
    assert.deepEqual(result.pack.retrieval_notes, []);
    assert.deepEqual(result.pack.required_outcomes, []);
    assert.match(result.warnings.join('\n'), /required_outcomes is absent/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('loadKnowledgePackRuntime falls back to general for inferred missing packs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pack-loader-'));

  try {
    await writePack(root, 'general', {
      pack_key: 'general',
      version: '2026-03-23',
      required_capabilities: ['fallback capability'],
    });

    const result = await loadKnowledgePackRuntime({
      featureId: 'BCIN-9999',
      requestedKnowledgePackKey: null,
      featureFamily: 'missing-pack',
      packRootDir: root,
      repoRoot: '/tmp/repo',
      targetSkillPath: 'workspace-planner/skills/qa-plan-orchestrator',
      targetSkillName: 'qa-plan-orchestrator',
      benchmarkProfile: 'qa-plan-v2',
    });

    assert.equal(result.mode, 'active_pack');
    assert.equal(result.taskPatch.knowledge_pack_key, 'general');
    assert.equal(result.taskPatch.knowledge_pack_resolution_source, 'default_general');
    assert.match(result.warnings.join('\n'), /falling back to general/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('loadKnowledgePackRuntime enters null-pack mode when inferred and general packs are absent', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pack-loader-'));

  try {
    const result = await loadKnowledgePackRuntime({
      featureId: 'BCIN-9998',
      requestedKnowledgePackKey: null,
      featureFamily: 'missing-pack',
      packRootDir: root,
      repoRoot: '/tmp/repo',
      targetSkillPath: 'workspace-planner/skills/qa-plan-orchestrator',
      targetSkillName: 'qa-plan-orchestrator',
      benchmarkProfile: 'qa-plan-v2',
    });

    assert.equal(result.mode, 'null_pack');
    assert.equal(result.taskPatch.knowledge_pack_key, null);
    assert.equal(result.taskPatch.knowledge_pack_resolution_source, 'null_pack');
    assert.equal(result.taskPatch.knowledge_pack_row_count, 0);
    assert.match(result.warnings.join('\n'), /null-pack mode/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('loadKnowledgePackRuntime blocks when an explicitly requested pack is missing', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pack-loader-'));

  try {
    await assert.rejects(
      () => loadKnowledgePackRuntime({
        featureId: 'BCIN-9997',
        requestedKnowledgePackKey: 'does-not-exist',
        featureFamily: null,
        packRootDir: root,
        repoRoot: '/tmp/repo',
        targetSkillPath: 'workspace-planner/skills/qa-plan-orchestrator',
        targetSkillName: 'qa-plan-orchestrator',
        benchmarkProfile: 'qa-plan-v2',
      }),
      /requested knowledge pack/i,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('loadKnowledgePackRuntime rejects unsupported deep research topic slugs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'pack-loader-'));

  try {
    await writePack(root, 'report-editor', {
      pack_key: 'report-editor',
      version: '2026-03-23',
      required_capabilities: ['template-based creation'],
      deep_research_topics: ['unsupported-topic'],
    });

    await assert.rejects(
      () => loadKnowledgePackRuntime({
        featureId: 'BCIN-9996',
        requestedKnowledgePackKey: 'report-editor',
        featureFamily: null,
        packRootDir: root,
        repoRoot: '/tmp/repo',
        targetSkillPath: 'workspace-planner/skills/qa-plan-orchestrator',
        targetSkillName: 'qa-plan-orchestrator',
        benchmarkProfile: 'qa-plan-v2',
      }),
      new RegExp(KNOWN_DEEP_RESEARCH_TOPIC_SLUGS[0]),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
