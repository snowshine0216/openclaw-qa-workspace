# OpenClaw Subagent NLG Task Templates

## Purpose

These templates define normalized natural-language task payloads for OpenClaw `sessions_spawn` calls in the planner to generation to healing runtime.

Use with canonical state under:

1. `memory/tester-flow/runs/<work_item_key>/task.json`
2. `memory/tester-flow/runs/<work_item_key>/run.json`
3. `memory/tester-flow/runs/<work_item_key>/context/spec_manifest.json`

## Template 1: Planner Presolve (R0 Fallback)

Use when planner artifacts are missing and pre-routing requires planning before test generation.

```text
Task: Generate planner artifacts for work item ${WORK_ITEM_KEY}.

Inputs:
- Work item key: ${WORK_ITEM_KEY}
- Planner target root: ../workspace-planner/projects/feature-plan/${WORK_ITEM_KEY}

Requirements:
1. Produce qa_plan_final.md and specs/ markdown scenarios.
2. Each scenario markdown must include a **Seed:** line.
3. Use deterministic file naming and stable section numbering.

Output contract:
1. Return artifact paths for qa_plan_final.md and specs directory.
2. Return non-zero status if required artifacts cannot be produced.
```

## Template 2: Generator Per Manifest Item (Phase 2)

Use once per `spec_manifest.json` item.

```text
Task: Generate one Playwright spec from one scenario markdown.

Inputs:
- WORK_ITEM_KEY=${WORK_ITEM_KEY}
- SOURCE_MARKDOWN=${SOURCE_MARKDOWN}
- TARGET_SPEC_PATH=${TARGET_SPEC_PATH}
- SEED_REFERENCE=${SEED_REFERENCE}
- FRAMEWORK_PROFILE_PATH=${FRAMEWORK_PROFILE_PATH}
- RUN_DIR=${RUN_DIR}

Constraints:
1. Read framework profile first.
2. Preserve scenario intent and step sequence.
3. Follow fixture/import style from profile.
4. Generate exactly one spec file at TARGET_SPEC_PATH.
5. Do not write outside expected output hierarchy.

Output contract:
1. Exit 0 only when target file exists and is syntactically valid TypeScript.
2. Exit non-zero with concise failure reason otherwise.
```

## Template 3: Healer Round Task (Phase 4)

Use once per healing round when `failed_specs` is non-empty.

```text
Task: Heal failing Playwright specs and preserve original intent.

Inputs:
- WORK_ITEM_KEY=${WORK_ITEM_KEY}
- FAILED_SPECS=${FAILED_SPECS}
- FRAMEWORK_PROFILE_PATH=${FRAMEWORK_PROFILE_PATH}
- RUN_DIR=${RUN_DIR}
- PLAYWRIGHT_TEST_PROJECT=chromium

Constraints:
1. Keep original test intent and order.
2. Do not skip/reorder steps without explicit permission.
3. Apply deterministic, maintainable fixes.
4. Keep edits within failed specs unless shared helpers must change.
5. Do not exceed orchestrator max rounds (3 total).

Output contract:
1. Exit 0 when healing attempt is complete and files are saved.
2. Exit non-zero only for unrecoverable execution errors.
3. Always return concise summary of root causes and fixes.
```

## Template 4: Final Notification Payload Fallback (Phase 5)

Use when notify command fails.

```text
If notification delivery fails:
1. Serialize full payload text into run.json.notification_pending.
2. Include work item key, final status, counts, summary path, timestamp.
3. Preserve previous notification_pending only when current payload is identical.
```

## Validation Checklist

1. Template variables map 1:1 with runner hook environment keys.
2. Each template is phase-specific and idempotent-safe.
3. Planner template enforces seed lines for downstream generation.
4. Healer template explicitly enforces Chromium project and intent preservation.
