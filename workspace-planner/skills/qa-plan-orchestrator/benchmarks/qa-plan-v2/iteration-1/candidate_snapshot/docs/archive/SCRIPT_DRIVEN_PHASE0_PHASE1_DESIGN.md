# Feature QA Planning Orchestrator — Fully Script-Driven Design

> **Design ID:** `fqpo-script-all-phases`
> **Date:** 2026-03-10
> **Status:** Draft
> **Scope:** All phases (0–7) script-driven. Orchestrator only calls scripts, interacts with user, and spawns subagents (waiting for completion).
>
> **Constraint:** This is a design artifact. Do not implement until approved.
>
> **Phase 4-6 note:** Phase 4-6 runtime loop and rubric details are superseded by `docs/PHASE4_LAYERING_AND_COVERAGE_HARNESS_REMEDIATION_DESIGN.md` and the active `references/phase4b-contract.md`, `references/review-rubric-phase5a.md`, and `references/review-rubric-phase5b.md` files.

---

## Breaking Changes From Current SKILL.md

The following behaviors in the current `SKILL.md` are deliberately changed by this design. Implementers must update `SKILL.md` (see Section 11) before this design is considered complete.

| # | Current SKILL.md behavior | New behavior in this design |
|---|--------------------------|----------------------------|
| 0 | QA plan scenarios use Setup / Action / Expected (single-line) | QA plan scenarios: no Setup; Action as nested atomic steps; Expected as bullet points; XMindMark format (Section 5.1) |
| 1 | Phase 2: produces `context_index` and `scenario_units` via normalization agent | Phase 2 is now **Artifact Index** only — `phase2.sh` scans `context/` and writes `artifact_lookup_<id>.md`; no sub-agent spawned |
| 2 | Phase 3: produces `coverage_ledger` inline | Phase 3 spawns a coverage sub-agent via `phase3.sh`; orchestrator waits and validates with `phase3.sh --post` |
| 3 | Phase 4: single write sub-agent produces `qa_plan_v1.md` | Phase 4 split: **4a** writes subcategory-level XMindMark → **4b** groups into top-category hierarchy |
| 4 | Phase 5: review only; Phase 6: refactor only | Phase 5 = review **+** refactor combined (one sub-agent); Phase 6 = format/search/few-shots quality pass |
| 5 | Phase 0 calls `evaluateRuntimeSetup` inline | Phase 0 delegates to `check_runtime_env.sh`; writes `context/runtime_setup_<feature-id>.md` + companion `.json` |
| 6 | Orchestrator calls `sessions_spawn` from inline logic | Orchestrator reads `phaseN_spawn_manifest.json` produced by `phaseN.sh` and spawns from manifest entries |

---

## 0. Orchestrator Contract

**The orchestrator does exactly three things:**

1. **Call scripts** — one `phaseN.sh` per phase; no in-phase logic.
2. **Interact with user** — prompts, options, approvals (Phase 0 REPORT_STATE choices; Phase 7 promotion approval).
3. **Spawn subagents and wait** — when a script outputs a spawn manifest, orchestrator spawns each entry, waits for all to finish, then calls the phase script with `--post` for validation.

**The orchestrator does NOT:** produce artifacts, run validators directly, or make phase-specific decisions. Scripts own all logic.

---

## 0.1 Environment Setup

### Runtime contexts

The design must work in both:

- **OpenClaw TUI** — orchestrator has `sessions_spawn` tool; scripts produce manifests the agent reads and acts on.
- **Codex / Cursor** — orchestrator uses `mcp_task` or similar; same manifests enable structured handoff.

### Jira environment (from jira-cli)

- **Resolution order:** `JIRA_ENV_FILE` → skill folder `.env` → workspace root `.env` → repo root `.env`
- **Validation:** Run `jira me` after loading env to confirm auth.
- **Recommended:** Use `jira-run.sh` from jira-cli — it sources `lib/jira-env.sh` and loads credentials before invoking `jira`. No manual `source` needed.

### sessions_spawn usage

- **Lookup:** Use `clawddocs` skill to fetch current `sessions_spawn` contract (e.g. `tools/subagents`).
- **Params:** `task` (required), `agentId`, `label`, `mode`, `runtime`, `attachments`, `thread`, `runTimeoutSeconds`.
- **TUI:** Orchestrator calls `sessions_spawn` with payloads from spawn manifests; waits for subagent completion before proceeding.
- **streamTo:** Do **not** add `streamTo` when spawning with `runtime: "subagent"`. `streamTo` is supported only for `runtime: "acp"` (ACP harness sessions). Manifests use `runtime: "subagent"`; adding `streamTo` causes spawn failures.

---

## 1. Design Deliverables

> **Shared Principle: Run-Time Artifact Generation Only**  
> Static boilerplate copying and static placeholder files are expressly forbidden. Every output artifact (`task.json`, `run.json`, `artifact_lookup_<id>.md`, `phaseN_spawn_manifest.json`, and all QA drafts) MUST be dynamically computed, initialized, and populated entirely **at run time** based strictly on current context and inputs. No scripts may deploy static fallback files into the runtime directory.

| Deliverable | Path | Notes |
|-------------|------|-------|
| Phase 0 entry | `scripts/phase0.sh` | Env check, state classify, deploy; no spawn |
| Phase 1 entry | `scripts/phase1.sh` | Build spawn manifest; `--post` validates evidence |
| Phase 2 entry | `scripts/phase2.sh` | **Artifact Index** — scan `context/`, write `artifact_lookup_<id>.md`; no spawn |
| Phase 3 entry | `scripts/phase3.sh` | Build spawn manifest for coverage sub-agent; `--post` validates |
| Phase 4a entry | `scripts/phase4a.sh` | Spawn write sub-agent → subcategory-level XMindMark draft |
| Phase 4b entry | `scripts/phase4b.sh` | Spawn group sub-agent → top-category XMindMark hierarchy |
| Phase 5 entry | `scripts/phase5.sh` | Spawn review+refactor sub-agent; updates artifact_lookup; `--post` validates |
| Phase 6 entry | `scripts/phase6.sh` | Spawn format/search/few-shots sub-agent; `--post` validates |
| Phase 7 entry | `scripts/phase7.sh` | Promotion (archive, copy, update state, feishu); no spawn |
| Shared helpers | `scripts/check_runtime_env.sh`, `classify_reported_state.sh`, `*_build_spawn_manifest.mjs` | Used by phase scripts |
| reference.md | `reference.md` | Script entry points, manifest formats, artifact_lookup spec, orchestrator contract |
| SKILL.md | `SKILL.md` | Replace inline phase logic with `phaseN.sh` invocation (Section 3.1) |

---

## 2. AGENTS.md Sync

- `workspace-planner/AGENTS.md`: All phases are script-driven; orchestrator invokes `phaseN.sh`, handles user interaction, spawns subagents and waits for completion.

---

## 3. Skills Content Specification

### 3.1 `qa-plan-orchestrator/SKILL.md`

**Purpose:** Master orchestrator for feature QA planning. All phases are script-driven. The orchestrator only: (1) calls scripts, (2) interacts with the user, (3) spawns subagents and waits for completion.

**Orchestrator loop (every phase):**

1. Run `phaseN.sh [--post]`
2. If script outputs `SPAWN_MANIFEST: <path>`: read manifest, spawn each entry via `sessions_spawn`, wait for all to finish, then run `phaseN.sh --post`
3. If script exits non-zero: stop and report
4. Phase 0: when REPORT_STATE has options, present to user and block until choice
5. Phase 7: block until user approves promotion, then run `phase7.sh`

**Error policy:** When any script exits non-zero, stop and report. Do not proceed to next phase.

#### SKILL.md updates — use scripts for most cases

The current SKILL.md describes inline logic for each phase (e.g. `evaluateRuntimeSetup`, `evaluateSpawnPolicy`, spawn contracts, validators). This design replaces that with script invocation. **SKILL.md must be updated** so that:

| Phase | Current SKILL.md (inline) | New SKILL.md (script-driven) |
|-------|---------------------------|------------------------------|
| Phase 0 | 7-step inline: read task, classify, deploy, call `evaluateRuntimeSetup` | Run `phase0.sh <feature-id> <run-dir>`. If `ok: false` in runtime_setup JSON, stop. Present REPORT_STATE options to user. |
| Phase 1 | Inline spawn contracts, `evaluateSpawnPolicy`, `evaluateEvidenceCompleteness` | Run `phase1.sh`; spawn per manifest, wait, run `phase1.sh --post`. On exit 2, remediate per source family. |
| Phase 2 | Orchestrator produces context_index, scenario_units | Run `phase2.sh`; **no spawn** — script scans `context/` and writes `artifact_lookup_<id>.md` only. |
| Phase 3 | Orchestrator directly produces coverage_ledger | Run `phase3.sh`; spawn coverage sub-agent per manifest; run `phase3.sh --post`. |
| Phase 4a | (new) | Run `phase4a.sh`; spawn subcategory-write sub-agent; run `phase4a.sh --post`. |
| Phase 4b | (new) | Run `phase4b.sh`; spawn top-category-group sub-agent; run `phase4b.sh --post`. |
| Phase 5 | Inline review logic → Phase 6: inline refactor | Run `phase5.sh`; spawn review+refactor sub-agent (combined); run `phase5.sh --post`. |
| Phase 6 | Inline format check | Run `phase6.sh`; spawn format/search/quality sub-agent; run `phase6.sh --post`. |
| Phase 7 | Inline archive, promote, notify | Block until user approval; run `phase7.sh`. |

**Principle to add to SKILL.md:** *Use scripts for most cases. The orchestrator does not run validators, produce artifacts, or make phase-specific decisions inline. Scripts own all logic; the orchestrator calls `phaseN.sh`, handles user prompts, and spawns from manifests.*

---

## 4. reference.md Content Specification

### 4.1 `reference.md` updates

Add:

- Script entry points: `phase0.sh` through `phase7.sh`
- Orchestrator contract: call scripts only; user interaction; spawn and wait
- Spawn manifest format: `{ "requests": [{ "openclaw": { "args": {...} } }] }`
- Phase 0 artifacts: `context/runtime_setup_<feature-id>.md` (human-readable) + `context/runtime_setup_<feature-id>.json` (machine-readable companion for `evaluateRuntimeSetup`)
- Phase 1–6 manifest: `phaseN_spawn_manifest.json` (normalized spawn requests)
- Handoff: orchestrator reads manifest, calls `sessions_spawn` per `requests[].openclaw.args`, waits for completion

---

## 5. Workflow Design

### Orchestrator loop (all phases)

For each phase N:

1. Run `phaseN.sh <feature-id> <run-dir> [--post]`
2. If script outputs `SPAWN_MANIFEST: <path>`:
   - Read manifest at `<path>`
   - For each `requests[].openclaw.args`: call `sessions_spawn` (OpenClaw) or equivalent (Codex)
   - **Wait for all subagents to finish**
   - Run `phaseN.sh <feature-id> <run-dir> --post`
3. If script exits ≠ 0: stop, report, do not proceed
4. Phase-specific user interaction (see below)
5. Proceed to next phase

---

### Phase 0 — Runtime preparation

**Script:** `phase0.sh` — no spawn. Env check, state classify, deploy.

**Orchestrator:**
1. Run `phase0.sh`
2. If `ok` is false in `context/runtime_setup_<feature-id>.json` (machine-readable companion): stop, mark `task.json.overall_status = "blocked"`
3. **User interaction:** When REPORT_STATE has options (FINAL_EXISTS, DRAFT_EXISTS, CONTEXT_ONLY), present options and block until user choice
4. Proceed to Phase 1 when gate passes

---

### Phase 1 — Evidence gathering

**Script:** `phase1.sh` — outputs `phase1_spawn_manifest.json` with one spawn per source family (jira, confluence, github, figma).

**Orchestrator:**
1. Run `phase1.sh` → read manifest
2. Spawn each subagent, **wait for all to finish**
3. Run `phase1.sh --post` → validates spawn policy, evidence completeness
4. If validation fails: remediate per Phase 1 remediation rules
5. Proceed to Phase 2 when gate passes

---

### Phase 2 — Artifact Index

> **Breaking change from current SKILL.md:** Phase 2 no longer runs a normalization sub-agent or produces `context_index`/`scenario_units`. It is now a **lightweight script-only step** that scans `context/` and writes the `artifact_lookup_<feature-id>.md` tracking file (see Section 5.2). No sub-agent is spawned.

**Script:** `phase2.sh` — **no spawn**. Scans `context/`, builds artifact_lookup table, exits 0.

**Orchestrator:**
1. Run `phase2.sh <feature-id> <run-dir>`
2. Verify `context/artifact_lookup_<feature-id>.md` written
3. Proceed to Phase 3 when gate passes

---

### Phase 3 — Coverage mapping

> **Breaking change from current SKILL.md:** Phase 3 moves coverage_ledger production to a dedicated sub-agent spawned by `phase3.sh`.

**Script:** `phase3.sh` — outputs `phase3_spawn_manifest.json` with one spawn for coverage sub-agent.

**Orchestrator:**
1. Run `phase3.sh` → read manifest
2. Spawn coverage sub-agent, **wait for completion**
3. Run `phase3.sh --post` → validates coverage_ledger
4. Proceed to Phase 4a when gate passes

---

### Phase 4a — Draft Writing (Subcategory Level)

**Script:** `phase4a.sh` — outputs `phase4a_spawn_manifest.json` with one spawn for subcategory-write sub-agent.

**Sub-agent task:** Read all context artifacts. Write `drafts/qa_plan_subcategory_<feature-id>.md` using XMindMark format at subcategory level only — no top-category grouping yet. Each scenario is a leaf node under its subcategory. Update `artifact_lookup` Phase 4a column (✅ per artifact read).

**Orchestrator:**
1. Run `phase4a.sh` → read manifest
2. Spawn write sub-agent, **wait for completion**
3. Run `phase4a.sh --post` → validates XMindMark structure, executable steps
4. Proceed to Phase 4b when gate passes

---

### Phase 4b — Draft Writing (Top-Category Grouping)

**Script:** `phase4b.sh` — outputs `phase4b_spawn_manifest.json` with one spawn for grouping sub-agent.

**Sub-agent task:** Read `drafts/qa_plan_subcategory_<feature-id>.md`. Group subcategories into top-level categories. Produce `drafts/qa_plan_v1.md` as a full XMindMark hierarchy: Central Topic → Top Categories → Subcategories → Scenarios. Update `artifact_lookup` Phase 4b column.

**Orchestrator:**
1. Run `phase4b.sh` → read manifest
2. Spawn grouping sub-agent, **wait for completion**
3. Run `phase4b.sh --post` → validates top-category grouping, XMindMark central topic present
4. Proceed to Phase 5 when gate passes

---

### Phase 5 — Structured Review + Refactor (Combined)

**Script:** `phase5.sh` — outputs `phase5_spawn_manifest.json` with one spawn for review+refactor sub-agent.

**Sub-agent responsibilities (single agent, sequential):**
1. Read `artifact_lookup_<feature-id>.md` — iterate every row
2. For each artifact: read it, mark Phase 5 column ✅ in artifact_lookup (even if not directly useful, record it)
3. Write `context/review_notes_<feature-id>.md`: gap analysis, missing scenarios, format issues, uncovered-but-noted artifacts
4. Refactor `drafts/qa_plan_v1.md` → `drafts/qa_plan_v2.md` based on review notes
5. Write `context/review_delta_<feature-id>.md`: diff summary of changes made

> **Coverage gate:** No phase failure for uncovered artifacts — sub-agent records uncovered items in review_notes and addresses what it can in the refactor.

**Orchestrator:**
1. Run `phase5.sh` → read manifest
2. Spawn review+refactor sub-agent, **wait for completion**
3. Run `phase5.sh --post` → validates: `review_notes_<id>.md` exists, `qa_plan_v2.md` exists, `review_delta_<id>.md` exists, `qa_plan_v2.md` differs from `qa_plan_v1.md`
4. Proceed to Phase 6 when gate passes

---

### Phase 6 — Format Check + Search + Quality Refactor (with Few Shots)

**Script:** `phase6.sh` — outputs `phase6_spawn_manifest.json` with one spawn for quality sub-agent.

**Sub-agent responsibilities:**
1. **Format check** — validate XMindMark structure: central topic present, hierarchy correct, no Setup sections, actions are atomic nested steps, expected outcomes are bullet points
2. **Executable steps check** — each action step must be a single user-visible operation; each expected must be an observable outcome
3. **Search for additional context** (if scenarios feel incomplete or ambiguous):
   - First: `confluence` skill search (same space as the feature)
   - If insufficient (< 2 credible results): `tavily-search` skill
4. **Refactor** `drafts/qa_plan_v2.md` → `drafts/qa_plan_v3.md` guided by the few-shot examples below; update `artifact_lookup` Phase 6 column
5. Write `context/quality_delta_<feature-id>.md`: list of format fixes and search-informed additions

**Embedded few-shot examples in spawn task:**

*Example 1 — Vague action → atomic nested steps:*
```
❌ Before:
* Login and verify dashboard loads
  - Action: log in and check dashboard
  - Expected: dashboard shows

✅ After (XMindMark):
* Login and verify dashboard loads <P1>
  - Enter valid credentials on /login
    - Click "Sign In" button
      - Dashboard page renders at /dashboard
      - Welcome banner shows the logged-in username
```

*Example 2 — Missing verification → explicit expected bullets:*
```
❌ Before:
* Upload file and save
  - Action: upload a CSV file and save
  - Expected: file saved successfully

✅ After (XMindMark):
* Upload CSV file and confirm persistence <P2>
  - Click "Upload" on the data import page
    - Select a valid 10-row CSV file
      - Success toast "File uploaded" appears
      - File appears in the imports list with status "Ready"
      - Refreshing the page still shows the file in the list
```

*Example 3 — Ambiguous scenario → clear, executable, self-contained:*
```
❌ Before:
* Test report generation
  - Action: generate report
  - Expected: report is correct

✅ After (XMindMark):
* Generate PDF report from filtered date range <P1>
  - Set date filter to last 30 days on Reports page
    - Click "Generate PDF"
      - Download dialog appears within 5 seconds
      - Downloaded PDF filename includes the date range (e.g. report_2026-02-09_2026-03-10.pdf)
      - PDF page 1 header matches the selected filter label
```

**Orchestrator:**
1. Run `phase6.sh` → read manifest
2. Spawn quality sub-agent, **wait for completion**
3. Run `phase6.sh --post` → validates:
   ```bash
   node scripts/lib/validate_plan_artifact.mjs validate_review_delta \
     workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/context/quality_delta_<feature-id>.md

   node scripts/lib/validate_plan_artifact.mjs validate_executable_steps \
     workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/drafts/qa_plan_v3.md
   ```
   Also verify `qa_plan_v3.md` is valid XMindMark (central topic present, hierarchy ≥ 2 levels)
4. Proceed to Phase 7 when gate passes

---

### Phase 7 — Finalization

**Script:** `phase7.sh` — no spawn. Archive, promote, update state, feishu notify.

**Orchestrator:**
1. **User interaction:** Present pre-approval summary, block until user explicitly approves
2. On approval: run `phase7.sh`

---

### Phase gates

| Phase | Gate condition |
|-------|----------------|
| Phase 0 | `runtime_setup_<id>.md` exists, requested source families non-empty, no blockers |
| Phase 1 | Every required source family retrieved, evidence completeness passes |
| Phase 2 | `artifact_lookup_<id>.md` written with ≥ 1 artifact row |
| Phase 3 | Coverage ledger complete |
| Phase 4a | `qa_plan_subcategory_<id>.md` passes XMindMark structure + executable steps validators |
| Phase 4b | `qa_plan_v1.md` has central topic + ≥ 2 top-category nodes |
| Phase 5 | `review_notes_<id>.md`, `qa_plan_v2.md`, `review_delta_<id>.md` exist; `v2 ≠ v1` |
| Phase 6 | `qa_plan_v3.md` passes XMindMark + executable_steps validators; `quality_delta_<id>.md` exists |
| Phase 7 | User approval only |

---

### 5.1 QA Plan Scenario Format (XMindMark)

All drafts (Phase 4a, 4b, 5, 6) must use **XMindMark syntax** with these rules:

| Rule | Format |
|------|--------|
| **No Setup** | Remove `Setup:`. Preconditions documented at section level if needed. |
| **Atomic actions** | Each action step = one user-visible operation, written as a nested bullet. |
| **Observable expected** | Expected outcomes = bullet points, each a single measurable result. |
| **Verification notes** | Optional; written as XMindMark HTML comments (`<!--- … -->`). |
| **Source traceability** | Inline HTML comment after the scenario node. |

**XMindMark output structure:**
```
Feature QA Plan (BCIN-7289)

- High
    * Subcategory Name <P1>
        - Concise scenario description
            - Atomic action step 1
                - Atomic action step 2 (if needed)
                    - Observable outcome 1
                    - Observable outcome 2
            <!--- Verification note (optional) — Source: SU-01; confluence_xyz.md -->

- Medium
    * Another Subcategory <P2>
        - ...
```

**Phase 4a** writes subcategory-level only (no top-category grouping).
**Phase 4b** groups subcategories under top-category nodes to produce the full hierarchy.

**Implementation impact:** Update `templates/qa-plan-template.md`, `references/qa-plan-contract.md`, and `scripts/lib/qaPlanValidators.mjs` to enforce this format.

---

### 5.2 Artifact Lookup Table — Runtime Spec

File: `context/artifact_lookup_<feature-id>.md`
Produced by: `phase2.sh` (initial build); updated in-place by sub-agents in Phases 4a, 4b, 5, 6.

**Format:**

```markdown
# Artifact Lookup — <feature-id>

| # | Artifact Key | File Path | Source Phase | Phase 4a | Phase 4b | Phase 5 | Phase 6 |
|---|---|---|---|---|---|---|---|
| 1 | `jira_context` | `context/jira_BCIN-7289.md` | Phase 1 | ❌ | ❌ | ❌ | ❌ |
| 2 | `confluence_context` | `context/confluence_BCIN-7289.md` | Phase 1 | ❌ | ❌ | ❌ | ❌ |
| 3 | `github_context` | `context/github_BCIN-7289.md` | Phase 1 | ❌ | ❌ | ❌ | ❌ |
| 4 | `figma_context` | `context/figma_BCIN-7289.md` | Phase 1 | ❌ | ❌ | ❌ | ❌ |
| 5 | `coverage_ledger` | `context/coverage_ledger_BCIN-7289.md` | Phase 3 | ❌ | ❌ | ❌ | ❌ |
```

**Update rule:** Each sub-agent updates its phase column for every artifact it reads: `❌ → ✅`. Uncovered artifacts (still ❌ after Phase 5) are recorded in `review_notes_<id>.md` and addressed during refactor if possible. No phase gate fails solely due to uncovered artifacts — they are tracked for observability.

**`phase2.sh` build logic:**
1. List all files in `context/` matching `*.md` (exclude `artifact_lookup_*`, `runtime_setup_*`).
2. Detect artifact key from filename pattern (e.g. `jira_<id>.md` → `jira_context`).
3. Write table with all columns initialized to `❌`.
4. Exit 0.

---

## 6. State Schemas

Preserve existing `task.json` and `run.json` semantics. Add:

- `context/runtime_setup_<feature-id>.md` — Phase 0 env validation output (Markdown; aligns with existing `reference.md` artifact naming and SKILL.md phase gate)
- `phaseN_spawn_manifest.json` — Phase 1–6 spawn manifests (N = 1..6)

---

## 7. Implementation Layers

### Skill layout

```
workspace-planner/skills/qa-plan-orchestrator/
├── SKILL.md
├── reference.md
├── scripts/
│   ├── phase0.sh
│   ├── phase1.sh
│   ├── phase2.sh
│   ├── phase3.sh
│   ├── phase4.sh
│   ├── phase5.sh
│   ├── phase6.sh
│   ├── phase7.sh
│   ├── check_runtime_env.sh
│   ├── classify_reported_state.sh
│   ├── phase1_build_spawn_manifest.mjs
│   ├── phase2_build_spawn_manifest.mjs
│   ├── phase3_build_spawn_manifest.mjs
│   ├── phase4_build_spawn_manifest.mjs
│   ├── phase5_build_spawn_manifest.mjs
│   ├── phase6_build_spawn_manifest.mjs
│   ├── lib/
│   │   ├── deploy_runtime_context_tools.sh
│   │   ├── contextRules.mjs
│   │   ├── save_context.sh
│   │   └── ...
│   └── test/
│       ├── phase0.test.sh … phase7.test.sh
│       └── *_build_spawn_manifest.test.mjs
└── docs/
    └── SCRIPT_DRIVEN_PHASE0_PHASE1_DESIGN.md  # fully script-driven (all phases)
```

---

## 8. Script Inventory and Function Specifications

### 8.1 `scripts/check_runtime_env.sh`

**Purpose:** Validate Jira, Confluence, and GitHub access for requested source families. Non-interactive.

**Invocation:**

```bash
bash scripts/check_runtime_env.sh <feature-id> <requested-sources> [output-dir]
```

**Inputs:**

- `feature-id`: string
- `requested-sources`: comma-separated list (e.g. `jira,confluence,github`)
- `output-dir`: optional; defaults to `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/context/`

**Default for `requested-sources`:** When `task.json` is absent (FRESH run), default to `jira`. The caller (orchestrator or `phase0.sh`) must pass the actual requested source families when known; this default is only a safety fallback for the FRESH case.

**Outputs:**

- Writes `context/runtime_setup_<feature-id>.md` (Markdown, not JSON) with structure:
  ```
  # Runtime Setup — <feature-id>

  ## Requested source families
  jira, confluence, ...

  ## Setup entries

  | source_family | approved_skill | availability_validation | auth_validation | status | route_approved | blockers |
  |---|---|---|---|---|---|---|
  | jira | jira-cli | jira-run.sh me | jira me returned success | pass | true | — |

  ## has_supporting_artifacts
  false
  ```
  The script also writes a companion `context/runtime_setup_<feature-id>.json` for machine-readable consumption by `evaluateRuntimeSetup`:
  ```json
  {
    "ok": true,
    "feature_id": "BCIN-7289",
    "setup_entries": [
      {
        "source_family": "jira",
        "approved_skill": "jira-cli",
        "status": "pass",
        "availability_validation": "jira-run.sh me",
        "auth_validation": "jira me returned success",
        "route_approved": true
      }
    ],
    "has_supporting_artifacts": false
  }
  ```

**Jira validation:** Invoke `jira-run.sh` from jira-cli. Path resolution (first found wins): 1) `JIRA_CLI_SCRIPT` env var; 2) repo-local `$REPO_ROOT/.agents/skills/jira-cli/scripts/jira-run.sh`; 3) global `~/.agents/skills/jira-cli/scripts/jira-run.sh`; 4) OpenClaw `~/.openclaw/skills/jira-cli/scripts/jira-run.sh`. Run `jira me`; success = pass.

**Confluence validation:** Explicitly locate how the workspace manages Confluence tools rather than blindly calling `confluence-cli`. If no canonical CLI wrapper binary resolves, output `status: blocked` and exit 1.

**GitHub validation:** Run `gh auth status` if installed. Do not blindly assume `gh` exists on PATH without first checking tools/resolution. Or degrade gracefully to `status: blocked`.

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Parse args, validate each requested source, write JSON | argv | stdout (status), file | writes JSON | exit 1 |

**Recommendation (Q6):** Use `jira-run.sh` from jira-cli. It already loads `.env` via `lib/jira-env.sh` and runs `jira`. No manual `source` needed. The check script locates jira-cli via `$JIRA_CLI_SCRIPT`, repo-local `.agents/`, `~/.agents/`, or `~/.openclaw/skills/` (first found wins).

**Implementation:**
1. Parse `feature-id`, `requested-sources`, optional `output-dir`.
2. For each source in `requested-sources`: run validation command; record status in `setup_entries`.
3. Build `runtime_setup_<feature-id>.json` with `ok`, `setup_entries`, `has_supporting_artifacts`.
4. Build `runtime_setup_<feature-id>.md` table from same data.
5. Exit 1 if any `status: blocked`; exit 0 otherwise.

---

### 8.2 `scripts/classify_reported_state.sh`

**Purpose:** Classify `REPORT_STATE` from artifact presence. Non-interactive. Does not present user options.

**Invocation:**

```bash
bash scripts/classify_reported_state.sh <run-dir>
```

**Inputs:**

- `run-dir`: path to `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/`

**Outputs:**

- Writes `task.json` updates: `report_state` (FINAL_EXISTS | DRAFT_EXISTS | CONTEXT_ONLY | FRESH), `updated_at`.
- Does not write user options; orchestrator handles prompts.

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Check artifact presence, classify state, update task.json | argv | stdout | updates task.json | exit 1 if run-dir invalid |

**Implementation:**
1. Validate `run-dir` exists.
2. Check presence: `qa_plan_final.md` → FINAL_EXISTS; `drafts/qa_plan_v*.md` → DRAFT_EXISTS; `context/*` only → CONTEXT_ONLY; else → FRESH.
3. Read `task.json`; set `report_state`, `updated_at`; write back.
4. Exit 0; orchestrator presents options when REPORT_STATE has choices.

---

### 8.3 `scripts/phase1_build_spawn_manifest.mjs`

**Purpose:** Build manifest of normalized spawn requests for each requested source family. Reuses `spawn-agent-session` lib to produce `sessions_spawn`-ready payloads.

**Invocation:**

```bash
node scripts/phase1_build_spawn_manifest.mjs <feature-id> <run-dir> [output-path]
```

**Inputs:**

- `feature-id`: string
- `run-dir`: path to `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/`
- `output-path`: optional; defaults to `run-dir/phase1_spawn_manifest.json`

**Input files read:**

- `task.json` — `requested_source_families`
- `run.json` — `has_supporting_artifacts`
- Source-specific templates (Jira/Confluence/GitHub/Figma task instructions)

**Manifest format:**

```json
{
  "version": 1,
  "source_kind": "feature-qa-planning",
  "count": 2,
  "requests": [
    {
      "request": { "agent_id": "...", "mode": "run", "runtime": "subagent", "task": "...", "label": "jira-BCIN-7289" },
      "openclaw": {
        "tool": "sessions_spawn",
        "args": { "task": "...", "agentId": "...", "label": "jira-BCIN-7289", "mode": "run", "runtime": "subagent", "attachments": [] }
      },
      "handoff": { "label": "jira-BCIN-7289", "session_key_hint": "...", "result_contract": {} },
      "source": { "kind": "feature-qa-planning", "source_family": "jira", "feature_id": "BCIN-7289" }
    }
  ]
}
```

**Implementation:** For each requested source family, build a canonical request object:

- `agent_id`: planner agent (e.g. from config or default)
- `mode`: `run`
- `runtime`: `subagent` (or `acp` for Codex)
- `task`: rendered task text from SKILL.md spawn contracts (Jira/Confluence/GitHub/Figma)
- `label`: `{source_family}-{feature_id}`

**Reuse:** Use `normalizeSpawnInput` from `spawn-agent-session` lib.

Import path (the lib is CommonJS; use `createRequire` from an `.mjs` file):

```js
import { normalizeSpawnInput } from './lib/normalizeSpawnInput.mjs'; // Extracted minimal local implementation
```

Pass each canonical request as a single-object input; merge normalized requests into the final output array. Do not deeply `require()` from other skills' `lib/` folders; preserve strict encapsulation by relying on an isolated local equivalent.

**Figma source family:** The Figma entry has no canonical CLI skill. Set `approved_skill: "browser"` (or `"approved_snapshot"` when local snapshots are provided). The `agentId` is the planner agent; the `task` text instructs the sub-agent to use browser-based exploration or provided snapshot paths. Figma entries must still go through `normalizeSpawnInput` so the manifest format is uniform.

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Read task/run, build requests, normalize, write manifest | argv | file | writes JSON | exit 1 |

**Implementation:**
1. Parse `feature-id`, `run-dir`, optional `output-path`.
2. Read `task.json` → `requested_source_families`; `run.json` → `has_supporting_artifacts`.
3. For each source family: build canonical request (`agent_id`, `mode`, `runtime`, `task`, `label`); call `normalizeSpawnInput`.
4. Merge normalized requests into `{ version, source_kind, count, requests }`.
5. Write to `output-path` or `run-dir/phase1_spawn_manifest.json`.

---

### 8.4 `scripts/phase0.sh`

**Purpose:** Entry point for Phase 0. Orchestrates env check + state classify + deploy. Non-interactive.

**Invocation:**

```bash
bash scripts/phase0.sh <feature-id> <run-dir>
```

- `run-dir` — path to `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/` (artifact directory)
- `runtime-dir` — derived internally as `$(dirname "$project_dir")/scripts` (one level above run-dir, i.e. `workspace-planner/skills/qa-plan-orchestrator/scripts/`)

**Actions:**

1. Validate args (`feature-id` non-empty, `run-dir` a valid path).
2. **Concurrent-run guard:** Read `task.json.overall_status` and `task.json.run_key`. If another active run exists with a different `run_key` and status is `in_progress`, `awaiting_approval`, or `blocked`, exit 1 with message: `CONCURRENT_RUN_BLOCKED: active run <run_key> detected; resolve it before starting a new run`.
3. If absent, dynamically initialize `task.json` (with a generated run UUID, `current_phase`, and timestamp) and `run.json` (with runtime metrics timestamps). Do not copy a static boilerplate placeholder file.
4. Run `check_runtime_env.sh <feature-id> <requested-sources> <run-dir>/context/` — source families come from `task.json.requested_source_families` or default `jira` for FRESH state.
5. Run `classify_reported_state.sh <run-dir>`.
6. Exit 0 if all pass; exit 1 otherwise. (Validators execute directly from `scripts/lib/`—do not deploy static scripts into the runtime artifact directory).

**User prompts:** None. Orchestrator handles REPORT_STATE options and user choice.

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Orchestrate Phase 0 scripts | argv | stdout | creates/updates files | exit 1 |

**Implementation:**
1. Validate args; read `task.json` for concurrent-run guard; exit 1 if `CONCURRENT_RUN_BLOCKED`.
2. Dynamically initialize `task.json` and `run.json` natively if absent.
3. Get `requested_source_families` from task or default `jira`; run `check_runtime_env.sh`.
4. Run `classify_reported_state.sh`.
5. Exit 0 if all pass.

---

### 8.5 `scripts/phase1.sh`

**Purpose:** Entry point for Phase 1. Builds spawn manifest (without `--post`); validates evidence after spawns complete (with `--post`).

**Invocation:**

```bash
bash scripts/phase1.sh <feature-id> <run-dir>
bash scripts/phase1.sh <feature-id> <run-dir> --post
```

**Without `--post` — actions:**

1. Validate args.
2. **Idempotency check:** If `run-dir/phase1_spawn_manifest.json` already exists and `task.json.current_phase` is already past `phase_1_evidence_gathering`, skip manifest rebuild and exit 0. If manifest exists but phase is still `phase_1_evidence_gathering`, overwrite it (re-run allowed).
3. Run `phase1_build_spawn_manifest.mjs <feature-id> <run-dir>`.
4. Output `SPAWN_MANIFEST: <run-dir>/phase1_spawn_manifest.json` on stdout.
5. Exit 0 if manifest written; exit 1 otherwise.

**With `--post` — actions (orchestrator calls after all spawns finish):**

1. Validate spawn policy:
   ```js
   import { evaluateSpawnPolicy } from './lib/contextRules.mjs';
   const result = evaluateSpawnPolicy({ requestedSourceFamilies, spawnHistory });
   ```
2. Validate evidence completeness:
   ```js
   import { evaluateEvidenceCompleteness } from './lib/contextRules.mjs';
   const completeness = evaluateEvidenceCompleteness({ requestedSourceFamilies, spawnHistory, hasSupportingArtifacts });
   ```
3. If either check fails: output `REMEDIATION_REQUIRED: <source_family>` for each failing family; exit 2 (distinct from fatal exit 1 so orchestrator knows to remediate, not stop).
4. On full pass: update `task.json.current_phase = "phase_1_evidence_gathering"`, update `run.json.spawn_history`, exit 0.

**Remediation handling:**
- When `--post` exits 2, orchestrator re-spawns only the failing source families (surgical re-fetch; do not discard passing families).
- After re-spawn completes, orchestrator calls `phase1.sh --post` again.
- If `--post` exits 2 a second time for the same source family, orchestrator escalates to the user.

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Build manifest or run post-validation | argv | stdout | writes manifest / updates JSON | exit 1 (fatal), exit 2 (remediable) |

**Implementation:**
1. Without `--post`: validate args; idempotency check (skip if phase past gate); run `phase1_build_spawn_manifest.mjs`; echo `SPAWN_MANIFEST: <path>`; exit 0.
2. With `--post`: import `evaluateSpawnPolicy`, `evaluateEvidenceCompleteness` from `contextRules.mjs`; run both; on fail output `REMEDIATION_REQUIRED: <source_family>` per family, exit 2; on pass update `task.json`, `run.json`, exit 0.

---

### 8.6 `scripts/phase2.sh` … `phaseN.sh` (pattern)

**Purpose:** Same pattern as Phase 1. Build spawn manifest for phase-specific sub-agent; `--post` runs validation.

**Invocation:**

```bash
bash scripts/phaseN.sh <feature-id> <run-dir> [--post]
```

**Without `--post`:** Build manifest, write to `phaseN_spawn_manifest.json`, output `SPAWN_MANIFEST: <path>`.

**Idempotency (all phases):** If the manifest already exists and the phase is already past its gate in `task.json.current_phase`, skip manifest rebuild and exit 0. If the phase is still the current phase, overwrite manifest (re-run allowed for the current phase).

**With `--post`:** Run phase-specific validators, update `task.json` and `run.json`, record spawn in `spawn_history`. Exit 1 on any validator failure.

---

**Phase 2** — **No sub-agent.** Script-only. Scan `context/`, build `artifact_lookup_<feature-id>.md`.

`phase2.sh` actions (no `--post` needed):
1. List `context/*.md` (excluding `artifact_lookup_*`, `runtime_setup_*`).
2. Detect artifact key from filename; write lookup table with all columns `❌`.
3. Exit 0 if file written; exit 1 otherwise.

Update `task.json.current_phase = "phase_2_artifact_index"`.

---

**Phase 3** — One coverage sub-agent. Task: produce `coverage_ledger_<feature-id>.md`.

`--post` validators:
```bash
node scripts/lib/validate_plan_artifact.mjs validate_coverage_ledger \
  workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/context/coverage_ledger_<feature-id>.md \
  [candidate-id ...]
```
Update `task.json.current_phase = "phase_3_coverage_mapping"`.

---

**Phase 4a** — One subcategory-write sub-agent. Task: produce `drafts/qa_plan_subcategory_<feature-id>.md` in XMindMark at subcategory level. Update `artifact_lookup` Phase 4a column.

`--post` validators:
```bash
node scripts/lib/validate_plan_artifact.mjs validate_executable_steps \
  workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/drafts/qa_plan_subcategory_<feature-id>.md
```
Update `task.json.current_phase = "phase_4a_subcategory_draft"`.

---

**Phase 4b** — One grouping sub-agent. Task: produce `drafts/qa_plan_v1.md` by grouping subcategories into top-category XMindMark hierarchy. Update `artifact_lookup` Phase 4b column.

`--post` validators:
```bash
# Central topic present + hierarchy ≥ 2 levels
node scripts/lib/validate_plan_artifact.mjs validate_xmindmark_hierarchy \
  workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/drafts/qa_plan_v1.md

node scripts/lib/validate_plan_artifact.mjs validate_e2e_minimum \
  workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/drafts/qa_plan_v1.md user_facing
```
Update `task.json.current_phase = "phase_4b_top_category_draft"`.

---

**Phase 5** — One review+refactor sub-agent (combined). Task: read all artifacts in `artifact_lookup`, mark Phase 5 column, write `review_notes_<id>.md`, then refactor `qa_plan_v1.md` → `qa_plan_v2.md`, write `review_delta_<id>.md`.

`--post` validators (file presence + diff check):
```bash
# All three output files must exist
test -f context/review_notes_<feature-id>.md
test -f drafts/qa_plan_v2.md
test -f context/review_delta_<feature-id>.md
# v2 must differ from v1
diff drafts/qa_plan_v1.md drafts/qa_plan_v2.md | grep -q '.' || exit 1
```
Update `task.json.current_phase = "phase_5_review_refactor"`.

---

**Phase 6** — One quality/format sub-agent. Task: check XMindMark format, check executable steps, search Confluence (then Tavily if insufficient), apply 3 embedded few-shot examples (see Section 5), produce `qa_plan_v3.md` + `quality_delta_<id>.md`. Update `artifact_lookup` Phase 6 column.

`--post` validators:
```bash
node scripts/lib/validate_plan_artifact.mjs validate_executable_steps \
  workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/drafts/qa_plan_v3.md

node scripts/lib/validate_plan_artifact.mjs validate_xmindmark_hierarchy \
  workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/drafts/qa_plan_v3.md

node scripts/lib/validate_plan_artifact.mjs validate_review_delta \
  workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/context/quality_delta_<feature-id>.md
```
Update `task.json.current_phase = "phase_6_quality_refactor"`.

**Implementation (phase2–phase6 pattern):**
- Phase 2: no spawn; run inline script logic; write artifact_lookup; exit 0.
- Phase 3–6 (without `--post`): validate args; idempotency check; run `phaseN_build_spawn_manifest.mjs`; echo `SPAWN_MANIFEST: <path>`; exit 0.
- Phase 3–6 (with `--post`): run phase validators; on fail exit 1; on pass update `task.json.current_phase`, `run.json.spawn_history`, exit 0.

---

### 8.7 `scripts/phase7.sh`

**Purpose:** Promotion. No spawn. Orchestrator must have user approval before running.

**Invocation:**

```bash
bash scripts/phase7.sh <feature-id> <run-dir>
```

**Actions:**

1. **Archive prior `qa_plan_final.md`** if it exists: rename to `qa_plan_final_<YYYYMMDD_HHMMSS>.md` in the same directory (using `run.json.finalized_at` timestamp if available, else current date-time).
2. Promote `drafts/qa_plan_v2.md` to `qa_plan_final.md`. If `qa_plan_v2.md` does not exist (no rewrites were required), promote `drafts/qa_plan_v1.md` instead.
3. Write `context/finalization_record_<feature-id>.md`.
4. Update `task.json.overall_status = "completed"`, `run.json.finalized_at`.
5. Send Feishu notification via `feishu-notify` skill.

**Feishu failure mode:** If the Feishu notification fails, log a warning (`FEISHU_NOTIFY_FAILED: <error>`) and exit 0. Promotion is already committed; notification failure must not undo or block the promotion. The orchestrator surfaces the warning to the user after the phase completes.

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Archive, promote, notify | argv | stdout | updates files, sends notification | exit 1 (promotion failed), exit 0 with warning (notification failed) |

**Implementation:**
1. Validate args; resolve source (`qa_plan_v2.md` if exists, else `qa_plan_v1.md`).
2. Archive prior `qa_plan_final.md` if exists (rename with timestamp).
3. Copy source to `qa_plan_final.md`; write `context/finalization_record_<feature-id>.md`.
4. Update `task.json.overall_status`, `run.json.finalized_at`.
5. Call Feishu via `feishu-notify`; on failure log `FEISHU_NOTIFY_FAILED` and exit 0 (promotion already committed).

---

## 9. Script Test Stub Matrix

Tests use stub functions only (table format). Implementers add minimal assertions to make stubs executable.

| Script Path | Test Stub Path | Stub Function | Scenario | Smoke Command |
|-------------|----------------|---------------|----------|----------------|
| `scripts/check_runtime_env.sh` | `scripts/test/check_runtime_env.test.sh` | `test_success_all_sources` | All requested sources pass validation | `bash scripts/test/check_runtime_env.test.sh` |
| | | `test_missing_jira_env` | Jira env blocked; exit 1 | |
| | | `test_invalid_args` | Missing feature-id or output-dir invalid | |
| `scripts/classify_reported_state.sh` | `scripts/test/classify_reported_state.test.sh` | `test_fresh_state` | No artifacts → FRESH | `bash scripts/test/classify_reported_state.test.sh` |
| | | `test_draft_exists` | Draft present → DRAFT_EXISTS | |
| | | `test_invalid_project_dir` | Invalid run-dir → exit 1 | |
| `scripts/phase1_build_spawn_manifest.mjs` | `scripts/test/phase1_build_spawn_manifest.test.mjs` | `test_success_single_source` | One source family → valid manifest | `node --test scripts/test/phase1_build_spawn_manifest.test.mjs` |
| | | `test_success_multi_source` | jira,confluence → 2 requests | |
| | | `test_missing_task_json` | No task.json → exit 1 | |
| | | `test_empty_requested_sources` | Empty requested sources → exit 1 | |
| `scripts/phase2_build_spawn_manifest.mjs` … `phase6_build_spawn_manifest.mjs` | `scripts/test/phaseN_build_spawn_manifest.test.mjs` | `test_success_manifest` | Valid manifest written | `node --test scripts/test/phaseN_build_spawn_manifest.test.mjs` |
| | | `test_missing_context` | Missing context artifacts → exit 1 | |
| `scripts/phase0.sh` | `scripts/test/phase0.test.sh` | `test_success_full_run` | Env check + classify + deploy pass | `bash scripts/test/phase0.test.sh` |
| | | `test_concurrent_run_blocked` | Active run → exit 1 | |
| | | `test_script_failure` | check_runtime_env fails → exit 1 | |
| `scripts/phase1.sh` … `phase6.sh` | `scripts/test/phaseN.test.sh` | `test_success_manifest_output` | Outputs SPAWN_MANIFEST path | `bash scripts/test/phaseN.test.sh` |
| | | `test_post_validation_pass` | --post updates task.json | |
| | | `test_post_validation_fail` | Validator fails → exit 1 | |
| | | `test_idempotency_skip` | Phase past gate → skip rebuild | |
| `scripts/phase7.sh` | `scripts/test/phase7.test.sh` | `test_success_promotion` | Archive + promote + notify | `bash scripts/test/phase7.test.sh` |
| | | `test_feishu_failure_warning` | Feishu fails → exit 0 with warning | |

---

## 9.1 Code-Quality-Orchestrator Workflow (Per Script)

**Strict Coverage Goals:** All implementations must achieve **100% line and branch coverage**. 
- JavaScript/Node logic must be verified using tools like `c8` or `vitest`.
- Bash scripts must be unit-tested via a specific mocking strategy (using `bashcov` or BATS), guaranteeing that `jira`, `confluence-cli`, and `gh` calls are safely mocked without making live external API requests during test runs.

Apply `code-quality-orchestrator` for each script during implementation. Order is strict.

| Step | Skill | Action |
|------|-------|--------|
| 1 | `function-test-coverage` | Build behavior-to-test matrix from Section 8 spec; add stub functions from Section 9 table |
| 2 | TDD | Write failing tests first; implement minimal code to pass |
| 3 | `code-structure-quality` | Keep scripts thin; delegate to `lib/`; enforce DRY and functional boundaries |
| 4 | `requesting-code-review` | After initial green; capture findings |
| 5 | `receiving-code-review` | Validate findings; fix blocking; document rejections |
| 6 | `code-structure-quality` | Refactor for DRY; check `<= 20` lines per function |
| 7 | `function-test-coverage` | Final regression and coverage validation |

**Per-script checklist (use `references/workflow-checklist.md`):**

| Script | Scope | Lib Delegation |
|--------|-------|----------------|
| `check_runtime_env.sh` | Parse args, validate each source, write JSON | Extract `validate_jira`, `validate_confluence`, `validate_github` to `lib/` if >20 lines |
| `classify_reported_state.sh` | Check artifacts, update task.json | Pure logic in `lib/classifyState.mjs` |
| `phaseN_build_spawn_manifest.mjs` | Read task/run, build requests, normalize | Reuse `normalizeSpawnInput` from spawn-agent-session |
| `phase0.sh` … `phase7.sh` | Orchestrate sub-scripts; no business logic | Call `check_runtime_env.sh`, `classify_reported_state.sh`, `phaseN_build_spawn_manifest.mjs`; keep thin |

---

## 10. Spawn Flow (Phases 1–6)

### Idempotency policy (all phases)

| Condition | Script behavior |
|-----------|----------------|
| Manifest exists and `task.json.current_phase` is past this phase's gate | Skip rebuild; exit 0 (phase already done) |
| Manifest exists and `current_phase` is still this phase | Overwrite manifest; re-run is allowed for the current phase |
| Manifest absent | Build and write manifest normally |

This applies to `phase1.sh` through `phase6.sh`. `phase0.sh` and `phase7.sh` have no spawn manifest; they are re-entrant by nature (idempotent file writes with `updated_at` stamps).

### Spawn flow pattern

**Pattern:** Script produces normalized manifest; orchestrator reads manifest, calls `sessions_spawn` for each entry, **waits for all subagents to finish**, then runs `phaseN.sh --post`.

**Flow:**

1. `phaseN.sh` runs `phaseN_build_spawn_manifest.mjs` (or equivalent).
2. Manifest written to `run-dir/phaseN_spawn_manifest.json`.
3. Script outputs `SPAWN_MANIFEST: <path>`.
4. Orchestrator reads `requests[]`.
5. For each request: `sessions_spawn(requests[i].openclaw.args)`.
6. **Orchestrator waits for all subagents to finish.**
7. Orchestrator runs `phaseN.sh --post` for validation.
8. **OpenClaw TUI:** Native `sessions_spawn` tool.
9. **Codex:** `mcp_task` or equivalent with `agentId`, `task`, `label`, etc. mapped from `openclaw.args`.

**Parallel vs sequential:** Phase 1 spawns can run in parallel (one per source family). Phases 2–6 spawn one sub-agent each. Orchestrator waits for all before `--post`.

---

## 11. Files To Create / Update

### Scripts & Manifests

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `scripts/phase0.sh` | Env check, state classify, deploy; no spawn |
| CREATE | `scripts/phase1.sh` | Evidence gathering; spawn manifest + --post |
| CREATE | `scripts/phase2.sh` | **Artifact Index only** — no spawn; writes artifact_lookup_<id>.md |
| CREATE | `scripts/phase3.sh` | Coverage mapping spawn + --post |
| CREATE | `scripts/phase4a.sh` | Subcategory-level XMindMark draft spawn + --post |
| CREATE | `scripts/phase4b.sh` | Top-category grouping spawn + --post |
| CREATE | `scripts/phase5.sh` | Review+refactor combined spawn + --post |
| CREATE | `scripts/phase6.sh` | Format/search/quality spawn + --post |
| CREATE | `scripts/phase7.sh` | Promotion; no spawn |
| CREATE | `scripts/check_runtime_env.sh` | Env validation |
| CREATE | `scripts/classify_reported_state.sh` | State classification |
| CREATE | `scripts/phase1_build_spawn_manifest.mjs` | Evidence spawn manifest builder |
| CREATE | `scripts/phase3_build_spawn_manifest.mjs` | Coverage spawn manifest builder |
| CREATE | `scripts/phase4a_build_spawn_manifest.mjs` | Subcategory-write spawn manifest builder |
| CREATE | `scripts/phase4b_build_spawn_manifest.mjs` | Top-category-group spawn manifest builder |
| CREATE | `scripts/phase5_build_spawn_manifest.mjs` | Review+refactor spawn manifest builder |
| CREATE | `scripts/phase6_build_spawn_manifest.mjs` | Quality/search spawn manifest builder |
| DELETE | `scripts/lib/deploy_runtime_context_tools.sh` | No longer copying scripts to the runtime directory. |

### Tests

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `scripts/test/phase0.test.sh` … `phase7.test.sh` | Phase entry test stubs |
| CREATE | `scripts/test/phase4a.test.sh`, `phase4b.test.sh` | New phase split test stubs |
| CREATE | `scripts/test/phase2_artifact_index.test.sh` | Artifact index script test stubs |
| CREATE | `scripts/test/check_runtime_env.test.sh` | Env validation test stubs |
| CREATE | `scripts/test/classify_reported_state.test.sh` | State classification test stubs |
| CREATE | `scripts/test/phase1_build_spawn_manifest.test.mjs` … `phase6_build_spawn_manifest.test.mjs` | Manifest builder test stubs |
| CREATE | `scripts/test/phase4a_build_spawn_manifest.test.mjs`, `phase4b_build_spawn_manifest.test.mjs` | New manifest builder stubs |

### Skill & Agent Docs

| Action | Path | Notes |
|--------|------|-------|
| UPDATE | `SKILL.md` | Replace Phase 0–7 inline logic with `phaseN.sh` invocation; update Phase 2 description (Artifact Index, no normalization agent); add Phase 4a/4b; update Phase 5 (review+refactor combined); update Phase 6 (format+search+few-shots); add principle: orchestrator calls scripts only |
| UPDATE | `workspace-planner/AGENTS.md` | Reflect new phase structure (4a, 4b, Phase 5 combined, Phase 6 quality pass); list new script entry points; remove Phase 2 normalization agent reference |
| UPDATE | `reference.md` | Add: artifact_lookup_<id>.md spec; phase4a/4b script contracts; Phase 5 combined review+refactor contract; Phase 6 search strategy (Confluence → Tavily); few-shot examples location; updated phase gate table; validate_xmindmark_hierarchy validator entry |

### Templates & Contracts

| Action | Path | Notes |
|--------|------|-------|
| UPDATE | `templates/qa-plan-template.md` | XMindMark format: remove Setup; atomic action steps; observable expected bullets; add Phase 4a/4b structure examples |
| UPDATE | `references/qa-plan-contract.md` | Update scenario contract: XMindMark syntax, no Setup, atomic actions, observable expected; add artifact_lookup update obligation per sub-agent |
| UPDATE | `scripts/lib/qaPlanValidators.mjs` | Add `validate_xmindmark_hierarchy` validator; update `validate_executable_steps` for XMindMark nesting; enforce no-Setup rule |
| UPDATE | `evals/README.md` | Update smoke commands for all phases; add Phase 4a, 4b, Phase 5 combined, Phase 6 quality commands |

---

## 12. Backfill Coverage Table

Maps scripts to test stubs and failure-path coverage. Stub function names from Section 9.

| Script Path | Test Stub Path | Failure-Path Stub Function |
|-------------|----------------|---------------------------|
| `scripts/check_runtime_env.sh` | `scripts/test/check_runtime_env.test.sh` | `test_missing_jira_env`, `test_invalid_args` |
| `scripts/classify_reported_state.sh` | `scripts/test/classify_reported_state.test.sh` | `test_invalid_project_dir` |
| `scripts/phase1_build_spawn_manifest.mjs` | `scripts/test/phase1_build_spawn_manifest.test.mjs` | `test_missing_task_json`, `test_empty_requested_sources` |
| `scripts/phase2_build_spawn_manifest.mjs` … `phase6_build_spawn_manifest.mjs` | `scripts/test/phaseN_build_spawn_manifest.test.mjs` | `test_missing_context` |
| `scripts/phase0.sh` | `scripts/test/phase0.test.sh` | `test_concurrent_run_blocked`, `test_script_failure` |
| `scripts/phase1.sh` … `phase6.sh` | `scripts/test/phaseN.test.sh` | `test_post_validation_fail` |
| `scripts/phase7.sh` | `scripts/test/phase7.test.sh` | `test_feishu_failure_warning` |

---

## 13. README Impact

- `workspace-planner/skills/qa-plan-orchestrator/README.md`: Update with script entry points.

---

## 14. Quality Gates

- [ ] **All phases script-driven** — phase0.sh through phase7.sh (including phase4a.sh, phase4b.sh)
- [ ] **Phase 2 = Artifact Index only** — `phase2.sh` writes `artifact_lookup_<id>.md`; no sub-agent spawned
- [ ] **`artifact_lookup_<id>.md`** — initialized in Phase 2 (all ❌); columns updated by sub-agents in 4a, 4b, 5, 6
- [ ] **QA plan format (Section 5.1)** — XMindMark; no Setup; atomic actions; observable expected; verification notes as HTML comments
- [ ] **Phase 4 split** — 4a produces subcategory-level; 4b groups into top-category hierarchy
- [ ] **Phase 5 combined** — single sub-agent: reads all artifacts → review_notes → refactor → review_delta
- [ ] **Phase 6 quality pass** — format check + Confluence search (then Tavily if insufficient) + 3 few-shot examples applied
- [ ] **Few-shot examples** in Phase 6 spawn task: vague→atomic, missing verification→explicit bullets, ambiguous→self-contained
- [ ] **Orchestrator only** — calls scripts, interacts with user, spawns subagents and waits for completion
- [ ] Phase 0 non-interactive; user prompts handled by orchestrator
- [ ] Phase 1, 3, 4a, 4b, 5, 6: script outputs spawn manifest; orchestrator spawns, waits, runs `--post`
- [ ] Phase 7: no spawn; orchestrator gets user approval before running phase7.sh
- [ ] Spawn manifest reuses `spawn-agent-session` lib (no modification to shared skill)
- [ ] Jira env: use `jira-run.sh` from jira-cli
- [ ] Design works in both OpenClaw TUI and Codex/Cursor
- [ ] Test stubs for all new scripts (Section 9 table)
- [ ] `code-quality-orchestrator` applied per script (Section 9.1)
- [ ] **SKILL.md updated** — Phase 2/4/5/6 descriptions reflect new design
- [ ] **AGENTS.md updated** — new phase structure listed
- [ ] **`validate_xmindmark_hierarchy` validator** added to `qaPlanValidators.mjs`

---

## 15. References

- `.agents/skills/code-quality-orchestrator/SKILL.md` — apply per script (Section 9.1)
- `.agents/skills/code-quality-orchestrator/references/workflow-checklist.md`
- `.agents/skills/openclaw-agent-design/SKILL.md`
- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/jira-cli/SKILL.md`
- `.agents/skills/clawddocs/SKILL.md` — use to fetch `sessions_spawn` contract (e.g. `tools/subagents`)
- `.agents/skills/spawn-agent-session/SKILL.md`
- `.agents/skills/spawn-agent-session/reference.md`
- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
- `workspace-planner/skills/qa-plan-orchestrator/reference.md`
