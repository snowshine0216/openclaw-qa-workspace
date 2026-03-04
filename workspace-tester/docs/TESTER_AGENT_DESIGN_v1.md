# Tester Agent Design — Feature Test Automation

> **Design ID:** `tester-agent-v1`
> **Date:** 2026-03-03
> **Status:** Draft v1
> **Scope:** Feature-plan test automation (QA plan → .spec.ts → run → heal)
> **Compatibility:** OpenClaw (primary), Cursor, Codex

---

## 1. Overview

The **Tester Agent** is the downstream consumer of the Planner Agent's output. It orchestrates the full pipeline from QA plan Markdown specs (`.md`) to executable Playwright tests (`.spec.ts`), then runs and heals them.

```
User: "Test BCIN-6709"
      ↓
Tester Agent
  1. Locate or obtain QA plan specs (.md)
  2. Refactor specs for Playwright compatibility  ← playwright-test-planner
  3. Generate .spec.ts from specs                 ← playwright-test-generator
  4. Run tests and fix failures (max 3 rounds)    ← playwright-test-healer
  5. Report results
```

### Core Objectives

- **Single-command activation**: User provides a work-item key (e.g. `BCIN-6709`) and the agent handles everything.
- **Cross-workspace awareness**: Reads from both its own workspace and the Planner's workspace.
- **Multi-runtime support**: Works in OpenClaw (session spawn + mcporter), Cursor (subagent invocation), and Codex (AGENTS.md + skill delegation).
- **POM-first test generation**: All generated `.spec.ts` files use Page Object Model patterns aligned with the existing `tests/page-objects/` structure.

---

## 2. Agent Persona & Role

| Property | Value |
|----------|-------|
| **Type** | Executor / Orchestrator |
| **Primary Workspace** | `workspace-tester/` |
| **Working Directory** | `workspace-tester/projects/library-automation/` |
| **Upstream** | Planner Agent (`workspace-planner/`) |
| **Downstream Skills** | `playwright-test-planner`, `playwright-test-generator`, `playwright-test-healer` |
| **State Dir** | `workspace-tester/memory/tester-flow/runs/<work_item_key>/` |

---

## 3. Workflow — End-to-End Feature Testing

### 3.0 Entry Point: User Request

**Trigger:** User asks to test a work item (e.g. "test BCIN-6709").

**Inputs:**
- `work_item_key` (required): Jira key like `BCIN-6709`
- `domain` (optional): e.g. `feature-plan` (default: `feature-plan`)

### 3.1 Phase 0 — QA Plan Discovery

**Goal:** Locate or create the Markdown spec files that drive test generation.

#### Step 0.1 — Search Local Workspace First

Check if specs already exist in the Tester's own workspace:

```
workspace-tester/projects/library-automation/specs/feature-plan/<work_item_key>/
```

**Pass condition:** Directory exists AND contains at least one `.md` file (excluding `FIX_METHOD.md`, `README.md`).

#### Step 0.2 — Search Planner Workspace

If Step 0.1 fails, check the Planner's workspace:

```
workspace-planner/projects/feature-plan/<work_item_key>/specs/
```

**Pass condition:** Directory exists AND contains `.md` spec files.

**If found:** Copy the entire `specs/` subtree to the Tester's workspace:

```bash
# Source
workspace-planner/projects/feature-plan/<work_item_key>/specs/

# Destination (create structure preserving domain/feature hierarchy)
workspace-tester/projects/library-automation/specs/feature-plan/<work_item_key>/
```

Also copy `qa_plan_final.md` for reference:

```bash
cp workspace-planner/projects/feature-plan/<work_item_key>/qa_plan_final.md \
   workspace-tester/projects/library-automation/specs/feature-plan/<work_item_key>/qa_plan_final.md
```

#### Step 0.3 — Invoke Planner (If Not Found Anywhere)

If specs don't exist in either workspace:

1. **Confirm with user:**
   ```
   No QA plan specs found for <work_item_key> in either workspace.
   Shall I invoke the Planner Agent to create a QA plan and generate specs first?
   (Y / Provide path manually / Cancel)
   ```
2. **If confirmed:** Invoke the Planner Agent:
   - **In OpenClaw:** Use `session spawn` to launch the Planner session with the `/test-case-generation` workflow, passing the `work_item_key`.
   - **In Cursor/Codex:** Inform user to run `/test-case-generation <work_item_key>` in the Planner workspace first, then re-trigger the Tester.
3. **Wait for Planner completion**, then re-run Step 0.2 to discover the generated specs.

#### Step 0.4 — Initialize State

Create `workspace-tester/memory/tester-flow/runs/<work_item_key>/task.json`:

```json
{
  "run_key": "<work_item_key>:test",
  "overall_status": "in_progress",
  "current_phase": "discovery",
  "updated_at": "<ISO8601>",
  "mode": "<openclaw|cursor|codex>",
  "specs_source": "<local|planner|generated>",
  "specs_path": "specs/feature-plan/<work_item_key>/",
  "spec_files": ["<domain>/<feature>/<scenario>.md", ...],
  "phases": {
    "discovery": { "status": "completed" },
    "refactor": { "status": "pending" },
    "generation": { "status": "pending", "generated_count": 0, "total_count": null },
    "execution": { "status": "pending", "pass_count": 0, "fail_count": 0, "total_count": null },
    "healing": { "status": "pending", "rounds": 0, "max_rounds": 3 },
    "done": { "status": "pending" }
  },
  "output_path": "tests/specs/feature-plan/<work_item_key>/",
  "healing_report_path": null,
  "notification_pending": null
}
```

**Progress notification:** *"⏳ Phase 0 complete. Found N spec files in <source>. Proceeding to refactor."*

---

### 3.2 Phase 1 — Spec Refactoring (playwright-test-planner)

**Goal:** Ensure Markdown specs are compatible with the Playwright Generator's expectations and aligned with the library-automation POM structure.

**What this phase does:**
1. Read each `.md` spec file from `specs/feature-plan/<work_item_key>/`.
2. Validate format compliance against the canonical spec format (see [TEST_CASE_GENERATION_DESIGN.md §Spec Format](../../workspace-planner/docs/TEST_CASE_GENERATION_DESIGN.md)).
3. Refactor steps to use semantic role/label/text phrasing (required for auto-healing).
4. Ensure each spec references `**Seed:** \`tests/seed.spec.ts\`` for fixture bootstrap.
5. Map test steps to existing page-objects where possible (document POM mapping as comments).

**Invocation:**

| Runtime | How |
|---------|-----|
| **OpenClaw** | `session spawn` with `playwright-test-planner` skill equipped. Use `mcporter call playwright.<tool>` for any DOM inspection. |
| **Cursor** | Invoke subagent `playwright-test-planner` via `.cursor/agents/playwright-test-planner.md`. |
| **Codex** | Delegate to `playwright-test-planner` specialist per `AGENTS.md`. |

**Output:** Refactored `.md` files in-place at `specs/feature-plan/<work_item_key>/`.

**Update `task.json`:** `current_phase: refactor`, `phases.refactor.status: completed`.

**Progress notification:** *"⏳ Phase 1 complete. N spec files refactored. Proceeding to test generation."*

---

### 3.3 Phase 2 — Test Generation (playwright-test-generator)

**Goal:** Convert each `.md` spec into an executable `.spec.ts` file under the library-automation test hierarchy.

**Output path:**
```
workspace-tester/projects/library-automation/tests/specs/feature-plan/<work_item_key>/
```

**Generation rules:**

1. **One `.spec.ts` per `.md` spec file** — maintain 1:1 mapping.
2. **Use POM pattern** — import from existing `tests/page-objects/`:
   ```typescript
   import { test } from '../../fixtures';
   // test fixture auto-provides: authenticatedPage, loginPage, reportToolbar, etc.
   ```
3. **Respect fixture hierarchy** — use `authenticatedPage` (not raw `page`) for authenticated tests. The fixture handles login via `getReportEnv()`.
4. **Environment config** — tests must use `getReportEnv()` for URLs, credentials. Never hardcode URLs (see [ENV_MANAGEMENT.md](../projects/library-automation/docs/ENV_MANAGEMENT.md)).
   - Exception: Feature-specific test data (e.g. BCIN-6709 report URLs on specific hosts) should use a dedicated test-data file with helper functions (see `shared-auth.ts` pattern).
5. **Test data** — create/extend `tests/test-data/feature-plan/<work_item_key>.ts` for feature-specific constants (report URLs, project IDs, expected values).
6. **Semantic locators only** — use `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`. Avoid raw CSS/ID selectors.
7. **Describe blocks** — group by domain/feature:
   ```typescript
   test.describe('BCIN-6709 — Pause Mode Error Recovery', () => {
     test('Cartesian Join Error on Resume', async ({ authenticatedPage, reportToolbar }) => {
       // ...
     });
   });
   ```

**Invocation:**

| Runtime | How |
|---------|-----|
| **OpenClaw** | `session spawn` with `playwright-test-generator` skill. Use `mcporter call playwright.generator_setup_page`, `mcporter call playwright.generator_read_log`, `mcporter call playwright.generator_write_test`. |
| **Cursor** | Invoke subagent `playwright-test-generator` via `.cursor/agents/playwright-test-generator.md`. |
| **Codex** | Delegate to `playwright-test-generator` specialist per `AGENTS.md`. |

**After generation of each file:** Update `task.json`:
- `phases.generation.generated_count += 1`
- `subtask_timestamps["gen:<scenario>"] = <ISO8601>`

**Progress notification per file:** *"📝 Generated `<scenario>.spec.ts` (M of N)."*

**Update `task.json`:** `current_phase: execution`, `phases.generation.status: completed`.

---

### 3.4 Phase 3 — Test Execution & Healing (playwright-test-healer)

**Goal:** Run all generated `.spec.ts` files and fix failures (max 3 rounds).

#### Step 3.1 — Initial Execution

Run tests from project root:

```bash
cd workspace-tester/projects/library-automation
npx playwright test tests/specs/feature-plan/<work_item_key>/ --project=chromium
```

**Update `task.json`:** Record `pass_count`, `fail_count`, `total_count`.

#### Step 3.2 — Healing Loop (If Failures)

For each failing test, invoke the Healer:

| Runtime | How |
|---------|-----|
| **OpenClaw** | `session spawn` with `playwright-test-healer` skill. Use `mcporter call playwright.test_run`, `mcporter call playwright.test_debug` for MCP-based debugging. |
| **Cursor** | Invoke subagent `playwright-test-healer` via `.cursor/agents/playwright-test-healer.md`. |
| **Codex** | Delegate to `playwright-test-healer` specialist per `AGENTS.md`. |

**Healing rounds:**
1. Max **3 rounds** per the existing healer contract.
2. Each round:
   a. Run `test_debug` on failing specs.
   b. Analyze errors (selectors, timing, data, environment).
   c. Fix code (update POM locators, add waits, fix assertions).
   d. Re-run only the previously failing specs.
3. **If all pass:** Move to Phase 4.
4. **If still failing after 3 rounds:** Write healing report.

**Healing report path:**
```
workspace-tester/projects/library-automation/migration/self-healing/feature-plan/<work_item_key>/healing_report.md
```

**Update `task.json`:** `phases.healing.rounds`, `phases.healing.status`.

---

### 3.5 Phase 4 — Results & Notification

#### 4.1 — Execution Report

Write report to:
```
workspace-tester/memory/tester-flow/runs/<work_item_key>/execution_report.md
```

Report template:
```markdown
# Test Execution Report: <work_item_key>

**Date:** <ISO8601>
**Source:** <specs_source>
**Specs Path:** specs/feature-plan/<work_item_key>/
**Tests Path:** tests/specs/feature-plan/<work_item_key>/

## Summary
- **Total:** N
- **Passed:** N ✅
- **Failed:** N ❌
- **Healed:** N (rounds: M)

## Per-Test Results
| Spec | Status | Healing Rounds | Notes |
|------|--------|----------------|-------|
| ... | ... | ... | ... |

## Healing Report
[Link if applicable]
```

#### 4.2 — Feishu Notification

Send via `feishu` skill:
```
✅ Feature test complete: <work_item_key>
  Total: N | Passed: N | Failed: N
  Tests: tests/specs/feature-plan/<work_item_key>/
  Report: memory/tester-flow/runs/<work_item_key>/execution_report.md
```

**If Feishu fails:** Store in `task.json` → `notification_pending`:
```json
{
  "channel": "feishu_dm",
  "message": "✅ Feature test complete: <WORK_ITEM_KEY> — N/N passed",
  "failed_at": "<ISO8601>"
}
```

**Verification command:**
```bash
jq -r '.notification_pending // empty' memory/tester-flow/runs/<work_item_key>/run.json
```

> **Note:** The canonical state file is `task.json`. However, notification fallback is also mirrored to `run.json` for compatibility with the shared tester-flow notification verification pattern. On task completion, copy `notification_pending` from `task.json` to `run.json`.

#### 4.3 — Final State Update

Set `task.json`:
- `overall_status: completed` (or `completed_with_failures`)
- `current_phase: done`
- `phases.done.status: completed`

---

## 4. Runtime Adaptation Layer

The Tester Agent must work across three runtimes. This section defines the adaptation patterns.

### 4.1 OpenClaw (Primary)

| Capability | Implementation |
|------------|---------------|
| **Sub-agent spawn** | `session spawn --skill <skill-name>` to launch specialized sessions |
| **MCP server calls** | Use `mcporter call playwright.<tool> key=value` (config: `workspace-tester/config/mcporter.json`) |
| **Session Start** | Read `SOUL.md`, `USER.md`, `IDENTITY.md`, `TOOLS.md`, `WORKSPACE_RULES.md`, `AGENTS.md` |
| **Skill loading** | Skills loaded from `workspace-tester/skills/` (symlinks to `.cursor/skills/`) |
| **State persistence** | `memory/tester-flow/runs/<work_item_key>/task.json` |
| **Cross-workspace** | Direct file-system access to `../workspace-planner/` |

**OpenClaw-specific workflow for spawning a sub-agent:**

```
session spawn --agent tester-refactor \
  --skill playwright-test-planner \
  --context "Refactor specs at specs/feature-plan/<work_item_key>/ for Playwright compatibility. \
             Use POM from tests/page-objects/. Output in-place. \
             Use mcporter call playwright.planner_setup_page for DOM inspection."
```

### 4.2 Cursor

| Capability | Implementation |
|------------|---------------|
| **Sub-agent invocation** | Invoke specialist agents via `.cursor/agents/<agent>.md` |
| **MCP server calls** | Native MCP integration (Playwright MCP tools: `test_run`, `test_debug`, etc.) |
| **Skill loading** | `.agents/skills/` wrapper → `.cursor/agents/*.md` |
| **Workflow trigger** | User runs `/test-feature` slash command |

### 4.3 Codex

| Capability | Implementation |
|------------|---------------|
| **Specialist delegation** | Follows `AGENTS.md` orchestration contract |
| **Skill loading** | `.agents/skills/` (same as Cursor) |
| **Workflow trigger** | User asks to test a feature; Codex reads `workspace-tester/AGENTS.md` |

---

## 5. POM Integration Strategy

### 5.1 Existing POM Structure

```
tests/page-objects/
├── library/          # LoginPage, LibraryPage
├── report/           # ReportToolbar, ReportEditorPanel, ReportGridView, ...
├── prompt/           # PromptEditor, AEPrompt, ValuePrompt
├── dossier/          # DossierCreator, DossierPage, Bookmark
└── common/           # Shared components
```

### 5.2 Fixture Integration

The test fixture at `tests/fixtures/index.ts` provides all POM instances via dependency injection:

```typescript
import { test } from '../../fixtures';

test('example', async ({
  authenticatedPage,   // Pre-logged-in page
  loginPage,           // LoginPage POM
  reportToolbar,       // ReportToolbar POM
  reportEditorPanel,   // ReportEditorPanel POM
  // ... all other POMs available
}) => {
  // Test code here
});
```

### 5.3 POM Requirements for Generated Tests

1. **Reuse existing POMs** — Never duplicate locators. If a POM class already has the locator, import and use it.
2. **Extend POMs when needed** — If a test scenario needs a new locator or action, add it to the appropriate POM class in `tests/page-objects/`, not inline in the spec.
3. **Co-located locators** — All locators must be declared as `readonly` properties at the top of POM classes (Healer-friendly pattern).
4. **Semantic locators** — Use `getByRole`, `getByText`, `getByLabel`. Avoid raw CSS/ID. This aligns with `playwright-cli snapshot` output for auto-healing.

### 5.4 New POM Classes for Feature Tests

If a feature requires new page interactions not covered by existing POMs:

1. Create new POM class under appropriate subdirectory:
   ```
   tests/page-objects/<area>/<ComponentName>.ts
   ```
2. Register in fixtures (`tests/fixtures/index.ts`):
   ```typescript
   import { NewComponent } from '../page-objects/<area>/<ComponentName>';
   // Add to extend<{...}> and fixture definition
   ```
3. Document in the test-data file which POM classes are used by the feature tests.

---

## 6. Folder Structure

### 6.1 Input (Markdown Specs)

```
workspace-tester/projects/library-automation/
├── specs/
│   └── feature-plan/
│       └── <work_item_key>/           ← MD specs land here
│           ├── qa_plan_final.md       ← copied from planner (reference)
│           ├── <domain>/
│           │   └── <feature>/
│           │       ├── <scenario1>.md
│           │       ├── <scenario2>.md
│           │       └── ...
│           └── ... (other domains if multi-domain feature)
```

### 6.2 Output (Executable Tests)

```
workspace-tester/projects/library-automation/
├── tests/
│   ├── specs/
│   │   └── feature-plan/
│   │       └── <work_item_key>/        ← Generated .spec.ts
│   │           ├── <scenario1>.spec.ts
│   │           ├── <scenario2>.spec.ts
│   │           ├── shared-auth.ts      ← Feature-specific auth helper (if needed)
│   │           └── ...
│   ├── test-data/
│   │   └── feature-plan/
│   │       └── <work_item_key>.ts      ← Feature-specific test data
│   ├── page-objects/                   ← Existing (extend as needed)
│   └── fixtures/
│       └── index.ts                    ← Existing (extend as needed)
```

### 6.3 State & Reports

```
workspace-tester/
├── memory/
│   └── tester-flow/
│       └── runs/
│           └── <work_item_key>/
│               ├── task.json            ← Workflow state
│               └── execution_report.md  ← Final report
└── projects/library-automation/
    └── migration/self-healing/feature-plan/
        └── <work_item_key>/
            └── healing_report.md        ← If healing fails
```

---

## 7. Per-Phase User Interaction Contract

> **Design Principle:** Never assume context. If any requirement, step, or path is ambiguous, the agent MUST stop and raise questions to the user before proceeding.

### User Interaction: Phase-by-Phase Details

| Phase | Done: | Blocked: | Questions: |
|-------|-------|----------|------------|
| **Phase 0 — Discovery** | "Found N specs in <source>. Proceeding to refactor." | "No specs found in either workspace. Invoke Planner?" | "Specs found in both local and planner workspace. Use local (newer) or planner (canonical)?" |
| **Phase 1 — Refactor** | "N specs refactored for Playwright compatibility." | "Spec format validation failed for <file>: <reason>." | "Spec <file> uses CSS selectors; refactor to semantic? Confirm." |
| **Phase 2 — Generation** | "Generated M of N .spec.ts files." | "Cannot map step '<step>' to POM; no matching page-object found." | "Feature requires new POM class for <component>. Create it?" |
| **Phase 3 — Execution & Healing** | "All N tests passed." or "N passed, M failed after 3 healing rounds." | "Environment unreachable at <URL>." | "Test flaky after 3 rounds — skip and document, or try alternative approach?" |
| **Phase 4 — Results** | "Report written. Feishu notification sent." | "Feishu send failed. Payload stored in task.json.notification_pending." | N/A |

---

## 8. Error Handling & Resilience

### 8.1 Discovery Failures

| Condition | Action |
|-----------|--------|
| Planner workspace not accessible | Inform user; ask for manual spec path or planner invocation |
| Specs exist but are empty/malformed | Report validation errors; ask user to fix or regenerate |
| `qa_plan_final.md` missing but specs exist | Proceed with specs only; note missing QA plan reference |

### 8.2 Generation Failures

| Condition | Action |
|-----------|--------|
| Playwright MCP unavailable | Fall back to file-based generation without live DOM; note in report |
| POM class not found for component | Create stub POM; document as P2 advisory |
| Env file missing | Fail with actionable message: "Create .env.report from .env.report.example" |

### 8.3 Healing Failures

| Condition | Action |
|-----------|--------|
| After 3 rounds still failing | Write healing report; do NOT apply `test.fixme()` without user permission |
| Environment issue (network, auth) | Mark as BLOCKED; report to user; do not count toward healing rounds |
| Application bug (not test bug) | Document as suspected application defect; route to qa-report agent |

### 8.4 Idempotency

- **Re-running the same work_item_key:** Check `task.json` for existing state.
  - `completed` → Offer: (A) Use Existing / (B) Re-generate / (C) Re-run tests only
  - `in_progress` → Resume from `current_phase`
  - `completed_with_failures` → Offer: (A) Re-heal / (B) Re-generate / (C) Full restart

---

## 9. Skills & Tools Reference

| Skill | Used In | Purpose |
|-------|---------|---------|
| `playwright-test-planner` | Phase 1 | Refactor `.md` specs for Playwright compatibility |
| `playwright-test-generator` | Phase 2 | Convert `.md` → `.spec.ts` |
| `playwright-test-healer` | Phase 3 | Debug and fix failing `.spec.ts` (max 3 rounds) |
| `mcporter` | OpenClaw only | Bridge to Playwright MCP server (`mcporter call playwright.<tool>`) |
| `feishu` | Phase 4 | Completion notification DM |
| `clawddocs` | Phase 0 (OpenClaw) | Look up OpenClaw conventions when needed |

### MCP Server Config (OpenClaw)

Config at `workspace-tester/config/mcporter.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

**Tool usage mapping:**

| Phase | mcporter Tool | Purpose |
|-------|--------------|---------|
| Phase 1 (refactor) | `mcporter call playwright.planner_setup_page` | Set up page for UI exploration |
| Phase 1 (refactor) | `mcporter call playwright.browser_snapshot` | Inspect current DOM |
| Phase 2 (generate) | `mcporter call playwright.generator_setup_page` | Set up page for generation |
| Phase 2 (generate) | `mcporter call playwright.generator_read_log` | Read generation log |
| Phase 2 (generate) | `mcporter call playwright.generator_write_test` | Write generated test file |
| Phase 3 (heal) | `mcporter call playwright.test_run` | Run test suite |
| Phase 3 (heal) | `mcporter call playwright.test_debug` | Debug failing test |

---

## 10. Implementation Artifacts

### 10.1 New Files to Create

| File | Purpose |
|------|---------|
| `workspace-tester/.agents/workflows/test-feature.md` | Workflow entrypoint (slash command `/test-feature`) |
| `workspace-tester/src/tester-flow/run_feature_test.sh` | Shell entrypoint for feature test flow |
| `workspace-tester/src/tester-flow/copy_planner_specs.sh` | Copy specs from planner workspace |

### 10.2 Files to Modify

| File | Change |
|------|--------|
| `workspace-tester/AGENTS.md` | Add "Core Workflow: Feature Test Automation" section |
| `AGENTS.md` (root) | Add `tester-agent` to specialist list |

### 10.3 Skills to Create or Verify

| Skill | Status | Action |
|-------|--------|--------|
| `playwright-test-planner` | ✅ Exists | Verify wrapper skill at `.agents/skills/playwright-test-planner/SKILL.md` |
| `playwright-test-generator` | ✅ Exists | Verify wrapper skill at `.agents/skills/playwright-test-generator/SKILL.md` |
| `playwright-test-healer` | ✅ Exists | Verify wrapper skill at `.agents/skills/playwright-test-healer/SKILL.md` |
| `mcporter` | ✅ Exists | Already at `workspace-tester/skills/mcporter/SKILL.md` |

---

## 11. Documentation Impact

### 11.1 user-facing README Updates

- **`workspace-tester/projects/library-automation/README.md`** (user-facing README): Add section "Feature Test Automation" describing the `/test-feature` workflow and folder structure for feature-plan tests. This is the primary user-facing README for the library-automation project.
- **Root `README.md`** (user-facing README): Reference the tester-agent design doc and add tester-agent to the workspace overview.

### 11.2 New Documentation

- This design document (`workspace-tester/docs/TESTER_AGENT_DESIGN.md`)
- Workflow file (`workspace-tester/.agents/workflows/test-feature.md`)

---

## 12. Smoke/Validation Evidence

### 12.1 Existing Test Artifacts

The design is validated against existing real-world artifacts:

| Artifact | Path | Validates |
|----------|------|-----------|
| BCIN-6709 QA plan | `workspace-planner/projects/feature-plan/BCIN-6709/qa_plan_final.md` | Phase 0 discovery from planner |
| BCIN-6709 planner specs | `workspace-planner/projects/feature-plan/BCIN-6709/specs/` (15 files) | Phase 0 copy logic |
| BCIN-6709 tester specs | `workspace-tester/projects/library-automation/specs/feature-plan/BCIN-6709/` (15 files) | Phase 0 local detection |
| BCIN-6709 generated tests | `workspace-tester/projects/library-automation/tests/specs/feature-plan/BCIN-6709/` (existing `.spec.ts` + `shared-auth.ts`) | Phase 2 output structure |
| POM classes | `tests/page-objects/report/`, `tests/page-objects/library/` | Phase 2 POM reuse |
| Fixture index | `tests/fixtures/index.ts` (225 lines, 30+ fixtures) | Phase 2 fixture integration |
| ENV management | `docs/ENV_MANAGEMENT.md` | Phase 2 environment config |

### 12.2 Validation Scenarios

1. **Happy path:** BCIN-6709 specs exist locally → skip to Phase 1 → refactor → generate → run → heal.
2. **Planner cross-read:** Delete local specs → Tester finds them in planner workspace → copies → proceeds.
3. **No specs anywhere:** Tester asks user → confirm planner invocation → specs generated → proceeds.
4. **Idempotent re-run:** task.json shows `completed` → user chooses re-run tests only → Phase 3 only.

---

## 13. Quick Checklist (openclaw-agent-design)

- [x] **agent-idempotency** applied: tiered existence check, archive-before-overwrite, freshness display
- [x] `task.json` schema includes `phases`, `updated_at`, per-spec subtask timestamps
- [x] User confirmation gates: Phase 0 (Planner invocation), Phase 2 (POM creation), Phase 3 (healing decisions)
- [x] Per-phase progress notifications at end of each phase
- [x] Per-phase user interaction contract: Done / Blocked / Questions
- [x] Design explicitly requires asking user questions when context is ambiguous
- [x] Feishu notification + `notification_pending` fallback on failure
- [x] Notification fallback verification command present
- [x] Output/handoff artifacts and paths are explicit (no unresolved placeholders)
- [x] No hardcoded user-home absolute paths in reusable artifacts
- [x] `.agents/*` references are explicit invocation paths (not auto-discovery)
- [x] Test evidence: existing BCIN-6709 artifacts validate the folder structure and workflow
- [x] Documentation updates listed (README impact, new docs)
- [x] Idempotency for output-writing: check `task.json` before re-generating
- [x] POM-first test generation strategy documented
- [x] Multi-runtime adaptation (OpenClaw / Cursor / Codex) documented
- [x] mcporter MCP integration for OpenClaw documented with tool mapping

---

## 14. References

- [TEST_CASE_GENERATION_DESIGN.md](../../workspace-planner/docs/TEST_CASE_GENERATION_DESIGN.md) — Upstream planner design (spec format, handoff contract)
- [FEATURE_PLANNER_AGENT_DESIGN.md](../../workspace-planner/projects/feature-plan/docs/FEATURE_PLANNER_AGENT_DESIGN.md) — Planner agent architecture
- [ENV_MANAGEMENT.md](../projects/library-automation/docs/ENV_MANAGEMENT.md) — Environment config for tests
- [library-automation README](../projects/library-automation/README.md) — Project structure, POM pattern, test commands
- [playwright-test-planner](../../.cursor/agents/playwright-test-planner.md) — Spec refactoring agent
- [playwright-test-generator](../../.cursor/agents/playwright-test-generator.md) — Test generation agent
- [playwright-test-healer](../../.cursor/agents/playwright-test-healer.md) — Test healing agent
- [mcporter SKILL.md](../skills/mcporter/SKILL.md) — MCP CLI bridge
- [mcporter.json](../config/mcporter.json) — Playwright MCP server config
- [agent-idempotency](../../.cursor/skills/agent-idempotency/SKILL.md) — Cache reuse, archive, error recovery
- [root AGENTS.md](../../AGENTS.md) — Specialist agent registry and orchestration contract
- [workspace-tester AGENTS.md](../AGENTS.md) — Tester operating instructions
