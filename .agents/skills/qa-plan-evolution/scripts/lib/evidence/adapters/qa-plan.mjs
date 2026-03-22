import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * QA-plan target: knowledge packs live under workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/<key>/
 */
export function loadQaPlanAdapter() {
  function resolveDefectsRunKey(task) {
    return task.defect_analysis_run_key || task.feature_id || null;
  }

  function getDefectsRunRoot(repoRoot, task) {
    const runKey = resolveDefectsRunKey(task);
    if (!runKey) {
      return null;
    }
    return join(
      repoRoot,
      'workspace-reporter',
      'skills',
      'defects-analysis',
      'runs',
      runKey,
    );
  }

  function readJson(path) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }

  function parseGeneratedAtMs(payload) {
    const raw = payload.generated_at || payload.updated_at || null;
    return raw ? Date.parse(raw) : 0;
  }

  function jsonArtifactMs(path) {
    if (!existsSync(path)) {
      return 0;
    }
    try {
      return parseGeneratedAtMs(readJson(path)) || statSync(path).mtimeMs;
    } catch {
      return statSync(path).mtimeMs;
    }
  }

  function readFreshnessMs(path) {
    if (!existsSync(path)) {
      return 0;
    }
    try {
      return parseGeneratedAtMs(readJson(path)) || statSync(path).mtimeMs;
    } catch {
      return statSync(path).mtimeMs;
    }
  }

  function getKnowledgePackBase(repoRoot, task) {
    return join(
      repoRoot,
      task.target_skill_path,
      'knowledge-packs',
      task.knowledge_pack_key,
    );
  }

  function knowledgePackStaleAgainst(repoRoot, task, packUpdatedMs) {
    const resolvedRunKey = resolveDefectsRunKey(task);
    const runRoot = getDefectsRunRoot(repoRoot, task);
    if (!resolvedRunKey || !runRoot || !existsSync(runRoot)) {
      return null;
    }

    const freshnessPath = join(runRoot, 'context', `analysis_freshness_${resolvedRunKey}.json`);
    const gapBundlePath = join(runRoot, 'context', `gap_bundle_${resolvedRunKey}.json`);
    const evidenceMs = Math.max(
      readFreshnessMs(freshnessPath),
      jsonArtifactMs(gapBundlePath),
    );

    return evidenceMs > 0 && packUpdatedMs > evidenceMs ? 'defects_analysis' : null;
  }

  return {
    resolveDefectsRunKey,
    getDefectsRunRoot,
    getKnowledgePackBase,
    checkKnowledgePack(repoRoot, task) {
      const key = task.knowledge_pack_key;
      if (!key) {
        return { status: 'skipped', reason: 'no_knowledge_pack_key' };
      }
      const base = getKnowledgePackBase(repoRoot, task);
      const packJson = join(base, 'pack.json');
      const packMd = join(base, 'pack.md');
      if (!existsSync(packJson) || !existsSync(packMd)) {
        return {
          status: 'missing',
          path: base,
          expected_files: ['pack.json', 'pack.md'],
        };
      }
      let version = null;
      let parsed = null;
      try {
        parsed = JSON.parse(readFileSync(packJson, 'utf8'));
        version = parsed.version ?? null;
      } catch {
        return {
          status: 'unparseable',
          pack_key: key,
          path: base,
          parse_target: packJson,
        };
      }
      const packUpdatedMs = Math.max(
        statSync(packJson).mtimeMs,
        statSync(packMd).mtimeMs,
      );
      const staleAgainst = knowledgePackStaleAgainst(repoRoot, task, packUpdatedMs);
      const bootstrapStatus = parsed.bootstrap_status ?? 'ready';
      if (bootstrapStatus !== 'ready') {
        return {
          status: 'bootstrap_incomplete',
          pack_key: key,
          version,
          path: base,
          updated_at: new Date(packUpdatedMs).toISOString(),
          bootstrap_status: bootstrapStatus,
        };
      }
      return {
        status: staleAgainst ? 'stale' : 'present',
        pack_key: key,
        version,
        path: base,
        updated_at: new Date(packUpdatedMs).toISOString(),
        stale_against: staleAgainst,
      };
    },
    checkDefectsAnalysis(repoRoot, task) {
      const resolvedRunKey = resolveDefectsRunKey(task);
      const runRoot = getDefectsRunRoot(repoRoot, task);
      if (!runRoot) {
        return {
          status: 'missing_source',
          reason: 'no_defect_analysis_run_key_or_feature_id',
        };
      }
      const freshnessPath = join(runRoot, 'context', `analysis_freshness_${resolvedRunKey}.json`);
      const crossAnalysisPath = join(
        runRoot,
        `${resolvedRunKey}_QA_PLAN_CROSS_ANALYSIS.md`,
      );
      const selfTestGapPath = join(
        runRoot,
        `${resolvedRunKey}_SELF_TEST_GAP_ANALYSIS.md`,
      );
      const gapBundlePath = join(
        runRoot,
        'context',
        `gap_bundle_${resolvedRunKey}.json`,
      );
      const finalReportPath = join(runRoot, `${resolvedRunKey}_REPORT_FINAL.md`);

      if (!existsSync(runRoot)) {
        return { status: 'missing', path: runRoot };
      }

      const missingArtifacts = [freshnessPath, crossAnalysisPath, selfTestGapPath, gapBundlePath].filter(
        (path) => !existsSync(path),
      );
      if (missingArtifacts.length > 0) {
        return {
          status: 'missing',
          path: runRoot,
          missing_artifacts: missingArtifacts,
        };
      }

      let freshness = {};
      try {
        freshness = readJson(freshnessPath);
      } catch {
        return {
          status: 'unparseable',
          path: freshnessPath,
        };
      }

      const freshnessUpdatedAt = freshness.generated_at || freshness.updated_at || null;
      const targetEvalPath = join(repoRoot, task.target_skill_path, 'evals', 'evals.json');
      const targetEvalMtime = existsSync(targetEvalPath) ? statSync(targetEvalPath).mtimeMs : 0;
      const freshnessMtime = freshnessUpdatedAt ? Date.parse(freshnessUpdatedAt) : 0;
      const reportMtime = existsSync(finalReportPath) ? statSync(finalReportPath).mtimeMs : 0;
      const bundleMtime = existsSync(gapBundlePath) ? statSync(gapBundlePath).mtimeMs : 0;
      const staleAgainstTarget = freshnessMtime && targetEvalMtime > freshnessMtime;
      const staleGapBundle = reportMtime > 0 && bundleMtime > 0 && reportMtime > bundleMtime;
      const status = staleAgainstTarget || staleGapBundle ? 'stale' : 'present';

      return {
        status,
        path: runRoot,
        run_key: resolvedRunKey,
        freshness_path: freshnessPath,
        final_report_path: finalReportPath,
        qa_plan_cross_analysis_path: crossAnalysisPath,
        self_test_gap_analysis_path: selfTestGapPath,
        gap_bundle_path: gapBundlePath,
        metadata: freshness,
      };
    },
  };
}
