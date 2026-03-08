---
name: qa-plan-write
description: Single skill with three domain handlers (atlassian, github, figma) for QA context gathering (Phase 1) and sub test case generation (Phase 2). Replaces qa-plan-atlassian, qa-plan-github, qa-plan-figma. Invoked by feature-qa-planning-orchestrator via sessions_spawn() with domain, mode, and feature_id in attachment. Use when orchestrator spawns domain handlers for context fetching or XMind sub test case generation.
---

# QA Plan Write — Unified Domain Handler (Atlassian, GitHub, Figma)

Single skill with **three domain handlers**. Orchestrator invokes via `sessions_spawn()` with `context.json` attachment. Each handler runs in `context` mode (Phase 1: fetch + save) or `testcase` mode (Phase 2: read context + generate XMind sub test cases).

## Invocation Contract

**Input** (from orchestrator via attachment `context.json`):
```json
{
  "domain": "atlassian",
  "mode": "context",
  "feature_id": "BCIN-6709",
  "jira_key": "BCIN-6709",
  "confluence_url": "https://..."
}
```

| `mode` | Phase | Behavior |
|--------|-------|----------|
| `context` | 1 | Fetch raw source data → call `save_context.sh` for every artifact. **No test case generation.** |
| `testcase` | 2 | Read existing `context/` files → generate XMind sub test cases → call `save_context.sh` for output. **No live re-fetch.** |
| `full` | Dev only | Runs `context` then `testcase`. Never used by orchestrator. |

**Script path**: Resolve `projects/feature-plan/scripts/` relative to workspace root (e.g. `workspace-planner/projects/feature-plan/scripts/`). Set `SCRIPTS` and call:
```bash
"$SCRIPTS/save_context.sh" "$FEATURE_ID" "<artifact_name>" "<content_or_file>"
```
Call immediately after every fetch.

**`mode=testcase` guard**: If required context file is missing, exit with:
```
ERROR: Missing context file: context/qa_plan_atlassian_BCIN-6709.md
Run Phase 1 first: qa-plan-write --domain atlassian --mode context --feature-id BCIN-6709
```

---

## Handler Selection

Read `domain` and `mode` from the attachment. Branch to the appropriate handler below.

---

## Handler: Atlassian

### mode=context

1. **Fetch Jira** (use `jira-cli` skill): main issue + related issues from Jira query path.
2. **Save immediately** after each fetch:
   ```bash
   $SCRIPTS/save_context.sh $FEATURE_ID "jira_issue_${ISSUE_KEY}" "$(jira issue view $ISSUE_KEY --plain)"
   $SCRIPTS/save_context.sh $FEATURE_ID "jira_related_issues_${FEATURE_ID}" "$RELATED_LIST"
   ```
3. **Fetch Confluence** (use `confluence` skill) if design doc URL provided.
4. **Save**:
   ```bash
   $SCRIPTS/save_context.sh $FEATURE_ID "qa_plan_atlassian_${FEATURE_ID}" "$DOMAIN_SUMMARY"
   ```
5. If Figma URL found in Jira/Confluence: `save_context.sh` for `figma_link_${FEATURE_ID}`.

**Artifacts saved**:
- `jira_issue_<key>.md`, `jira_related_issues_<id>.md`, `qa_plan_atlassian_<id>.md`, `figma_link_<id>.md` (if present)

**Phase 1 outputs domain context only** — no test scenarios, no QA Domain Summary table.

### mode=testcase

1. **Validate** required files exist: `jira_issue_<main>.md`, `qa_plan_atlassian_<id>.md`, related issues.
2. Read context files. Generate sub test cases in **XMind branch format** per `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md`.
3. Every action item must be **user-observable** (not Jira field names or ACs verbatim).
4. Non-actionable ACs → apply resolution chain (context → Confluence → Tavily → `<!-- TODO -->`). Save each search via `save_context.sh`.
5. **Save output**:
   ```bash
   $SCRIPTS/save_context.sh $FEATURE_ID "sub_test_cases_atlassian_${FEATURE_ID}" "$OUTPUT"
   ```

**Output**: `context/sub_test_cases_atlassian_<id>.md`

---

## Handler: GitHub

### mode=context

1. **Fetch PR diffs** (use `github` skill) for all `github_pr_urls` in attachment.
2. **Save** after each fetch:
   ```bash
   $SCRIPTS/save_context.sh $FEATURE_ID "github_diff_<repo>" /tmp/diff.md
   ```
3. **Build traceability** (file/function → scenario mapping). Save:
   ```bash
   $SCRIPTS/save_context.sh $FEATURE_ID "qa_plan_github_traceability_${FEATURE_ID}" "$TRACEABILITY"
   $SCRIPTS/save_context.sh $FEATURE_ID "qa_plan_github_${FEATURE_ID}" "$USER_FACING_SUMMARY"
   ```

**Artifacts saved**:
- `github_diff_<repo>.md`, `qa_plan_github_<id>.md`, `qa_plan_github_traceability_<id>.md`

**Phase 1 outputs diffs + traceability only** — no user-facing scenario generation.

### mode=testcase

1. **Validate** required files: at least one `github_diff_<repo>.md`, `qa_plan_github_traceability_<id>.md`.
2. Read context. Generate sub test cases in XMind format per template.
3. Organize by **user-facing functional scenario** (not by repo). Code-only changes → `## AUTO: Automation-Only Tests`.
4. Non-actionable code refs → resolution chain → `save_context.sh`.
5. **Save**:
   ```bash
   $SCRIPTS/save_context.sh $FEATURE_ID "sub_test_cases_github_${FEATURE_ID}" "$OUTPUT"
   ```

**Output**: `context/sub_test_cases_github_<id>.md`

---

## Handler: Figma

### mode=context

1. **Resolve Figma link** from attachment or `figma_link_<id>.md` (from Jira/Confluence).
2. **Fetch Figma metadata** (Figma MCP or browser flow).
3. **Create** `context/figma/` and save:
   ```bash
   $SCRIPTS/save_context.sh $FEATURE_ID "figma/figma_metadata_${FEATURE_ID}_$(date +%Y-%m-%d)" "$METADATA"
   $SCRIPTS/save_context.sh $FEATURE_ID "qa_plan_figma_${FEATURE_ID}" "$DOMAIN_SUMMARY"
   ```

**Artifacts saved**:
- `figma/figma_metadata_<id>_<date>.md`, `qa_plan_figma_<id>.md`

**Skipped** if no Figma URL or snapshots (orchestrator does not spawn).

### mode=testcase

1. **Validate** required files: `figma/figma_metadata_<id>_*.md`, `qa_plan_figma_<id>.md`.
2. Read context. Generate sub test cases in XMind format. Hierarchy: `## UI Testing`, `### Component Name`, bullet steps → leaf expected result.
3. Non-actionable Figma annotations → resolution chain → `save_context.sh`.
4. **Save**:
   ```bash
   $SCRIPTS/save_context.sh $FEATURE_ID "sub_test_cases_figma_${FEATURE_ID}" "$OUTPUT"
   ```

**Output**: `context/sub_test_cases_figma_<id>.md`

---

## Non-Actionable Resolution Chain (All Handlers)

1. Search `context/` files first.
2. If not resolved: Confluence search via `confluence` skill → `save_context.sh` before use.
3. If still not resolved: `tavily-search` skill → `save_context.sh`.
4. If all fail: keep item with `<!-- TODO: Cannot determine concrete user action — found in [source] -->` — **NEVER remove**.

**Naming**: `research_bg_<domain>_<query-slug>_<id>.md`

---

## Prerequisites

- **jira-cli** (atlassian): `~/.openclaw/skills/jira-cli` or workspace equivalent
- **confluence** (atlassian): `~/.openclaw/skills/confluence`
- **github** (github): `~/.openclaw/skills/github`
- **Figma MCP or browser** (figma)

Auth precheck before fetch. If precheck fails, STOP and report blocker.

---

## Generation Rules (mode=testcase)

When generating sub test cases, enforce the following dimensional rules:

**1. Surface Coverage Rule**
- Identify all applicable surfaces from Jira ACs, Confluence design docs, and PR diffs (e.g., Workstation, Library Web, BI Web, Library Mobile, Embedding).
- For each test scenario, produce a sub-item per applicable surface.
- If a surface is intentionally excluded or not applicable, add a leaf node explicitly stating: `N/A — [reason]`.
- **Never** merge Workstation and Library behaviors into the same leaf node unless the PR diff confirms identical code execution paths.

**2. Embedding Rule**
- If the PR diff touches embedding adapter/SDK layers OR Jira AC mentions "embedding", "Library", "iFrame", or "Native":
  - Generate concrete sub-cases for both **iFrame Embedding** (e.g., cross-origin messaging, auth, CSP restrictions) and **Native Embedding** (e.g., SDK initialization, teardown).
- If not applicable, add a leaf node: `N/A — not an embedding feature`.

**3. Performance Rule**
- Always generate at least a "Baseline Load Time" and "Large Data" sub-case unless the PR is strictly UI-only (CSS/style changes with no data fetching).
- If Jira ACs or Design Docs specify concrete SLAs, use them. Otherwise, use defaults: Dashboard <5s, Filter <2s, Export <15s, API <500ms.
- For complex performance requirements or if a dedicated Performance AC exists, link to or delegate to a full plan via the `performance-test-designer` skill.

---

## Output Format (mode=testcase)

Follow `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md` scaffold exactly:

- `## <Category> - P1/P2/P3`
- `### <Sub-category>`
- Bullet steps with indentation; leaf nodes = expected results
- `## AUTO: Automation-Only Tests` for code-internal, non-user-observable items

---

## Integration

Outputs consumed by:
- **Phase 5** (`qa-plan-synthesize`): merges sub test cases into unified XMind
- **Phase 3** (`qa-plan-review`): domain review agents read these artifacts
