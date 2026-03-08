# XMind-Only Refactor Plan — QA Planning Skills

**Date**: 2026-03-08  
**Status**: Confirmed — Ready for implementation  
**Scope**: All `workspace-planner/skills/qa-plan-*` + `feature-qa-planning-orchestrator`

---

## 1. Confirmed Design Decisions

| Question | Decision |
|----------|----------|
| Phase 1 vs 2 collapse | **Keep separate**: Phase 1 = context gathering, Phase 2 = sub test case generation |
| Confluence publish | **Skip**. Send Feishu notification only |
| Phase 3 review sub-agents | **4 separate domain review sub-agents** (jira, confluence, github, figma) |
| `qa-plan-write` consolidation | **Single skill** — replaces `qa-plan-figma`, `qa-plan-github`, `qa-plan-atlassian`; one skill, three domain handlers |
| `qa-plan-write --mode` flag | **`--mode context`** (Phase 1: fetch + save only) \| **`--mode testcase`** (Phase 2: read context + generate) \| **`--mode full`** (dev/debug only — both in one shot). Orchestrator always calls with explicit mode. |
| Background search in test case steps | **Allowed** in Phase 2, 3, 4 for unclear jargons / non-actionable actions |
| **Context artifact saving** | **Script-enforced** — each domain agent MUST call `save_context.sh` after every fetch |
| **Background search artifacts** | **Saved to `context/`** — every Confluence/Tavily search result is persisted with `save_context.sh` |

---

## 2. What Changes (Big Picture)

The current pipeline produces **two outputs**: a QA plan narrative (`qa_plan_vN.md`) AND an XMind test case file. The refactor strips the pipeline to produce **one output only**: the XMind-compatible test case file.

| What | Before | After |
|:----:|:------:|:-----:|
| Final output | QA plan + XMind test cases | **XMind test cases only** |
| Sub-agent output in Phase 1| Domain context summary | **Domain context summary** |
| Sub-agent output in Phase 2| Domain sub test cases | **Domain sub test cases (XMind branches)** |
| Synthesis | Merge context → dual output | **Merge sub test cases → one XMind file** |
| Review | Review both drafts | **Review XMind draft only, using cached artifacts** |
| Refactor | Update both drafts | **Update XMind draft only** |
| Confluence publish | QA plan narrative | **Skipped — Feishu notify only** |

---

## 3. End-to-End Workflow (8 Phases)

```
Phase 1  →  Context gathering  [qa-plan-write --mode context]
             Orchestrator spawns 3 handlers in parallel:
               qa-plan-write --domain atlassian --mode context --feature-id <id>
               qa-plan-write --domain github    --mode context --feature-id <id>
               qa-plan-write --domain figma     --mode context --feature-id <id>  (skipped if no Figma URL or Snapshots)
             → each handler calls save_context.sh after every fetch
             saves:
               context/jira_issue_<key>.md            (one per issue)
               context/jira_related_issues_<id>.md
               context/figma_link_<id>.md             (if Figma URL OR snapshots found)
               context/qa_plan_atlassian_<id>.md
               context/github_diff_<repo>.md          (one per repo)
               context/qa_plan_github_<id>.md
               context/qa_plan_github_traceability_<id>.md
               context/figma/figma_metadata_<id>.md
               context/qa_plan_figma_<id>.md

Phase 2  →  Sub test case generation  [qa-plan-write --mode testcase]
             Orchestrator calls validate_context.sh first (gate), then spawns:
               qa-plan-write --domain atlassian --mode testcase --feature-id <id>
               qa-plan-write --domain github    --mode testcase --feature-id <id>
               qa-plan-write --domain figma     --mode testcase --feature-id <id>  (skipped if no Figma context)
             → reads existing context/ files — NO live re-fetch
             → non-actionable items: background search → save_context.sh → keep TODO if unresolved
             saves:
               context/sub_test_cases_atlassian_<id>.md
               context/sub_test_cases_github_<id>.md
               context/sub_test_cases_figma_<id>.md
               context/research_bg_<domain>_<slug>_<id>.md  (each background search result)

Phase 3  →  Sub test case review (4 domain sub-agents — each reviews its OWN domain only)
             Orchestrator spawns 4 agents in parallel. Each review agent calls validate_context.sh before starting; if context is missing, it re-fetches and saves context:
               qa-plan-review --domain jira       → reads: sub_test_cases_atlassian + jira_issue_*.md only
               qa-plan-review --domain confluence  → reads: sub_test_cases_atlassian + qa_plan_atlassian + (confluence search if needed)
               qa-plan-review --domain github      → reads: sub_test_cases_github + qa_plan_github_traceability only
               qa-plan-review --domain figma       → reads: sub_test_cases_figma + qa_plan_figma only  (skipped if no Figma context)
             → background search allowed → save_context.sh
             saves:
               context/review_jira_<id>.md
               context/review_confluence_<id>.md
               context/review_github_<id>.md
               context/review_figma_<id>.md                                               (if Figma present)
               context/research_review_bg_<domain>_<slug>_<id>.md  (per background search)

Phase 4  →  Sub test case refactor (per-domain, based on Phase 3 reviews)
             Orchestrator calls validate_context.sh first (gate — requires all review_*.md present), then spawns:
               qa-plan-review --domain atlassian --mode refactor --feature-id <id>
               qa-plan-review --domain github    --mode refactor --feature-id <id>
               qa-plan-review --domain figma     --mode refactor --feature-id <id>  (skipped if no Figma context)
             → each handler reads ONLY its own domain's sub_test_cases_*.md + review_*.md
             → NO live re-fetch; reads cached context/ files only
             → background search allowed → save_context.sh (called by handler, NOT orchestrator)
             → _v2.md saved ONLY if changes were actually made; no-op domains produce no output
             saves:
               context/sub_test_cases_<domain>_<id>_v2.md  (if any changes made)
               context/research_bg_refactor_<slug>_<id>.md (if background search used)

Phase 5  →  Synthesize (single — main agent)
             → calls validate_context.sh before synthesis
             → validate_context.sh resolves per-domain: if sub_test_cases_<domain>_<id>_v2.md exists → use it;
               otherwise fall back to sub_test_cases_<domain>_<id>.md (base)
             → synthesize uses the resolved (latest) file for each domain — never mixes v2 and base for the same domain
             saves:
               drafts/test_key_points_xmind_v<N>.md
               (includes ## 📎 Artifacts Used header listing the RESOLVED filenames for each domain)

Phase 6  →  Synthesized XMind review (single — main agent)
             → REUSES Phase 3 review artifacts — no live re-fetch
             → loads workspace-planner/skills/feature-qa-planning-orchestrator/docs/priority-assignment-rules.md
             → calls validate_context.sh before reviewing
             saves:
               context/review_consolidated_<id>.md

Phase 7  →  Final refactor (single — main agent)
             → background search allowed → save_context.sh
             saves:
               drafts/test_key_points_xmind_v<N+1>.md

Phase 8  →  Finalize + Feishu notify
             promotes:
               test_key_points_xmind_final.md
             sends:
               Feishu notification (no Confluence publish)
```

---

## 3.1 `qa-plan-write` — Skill Identity & Invocation

**`qa-plan-write` is a skill**, not a bare shell script.

| Property | Value |
|----------|-------|
| **Skill path** | `workspace-planner/skills/qa-plan-write/` |
| **Skill entry** | `workspace-planner/skills/qa-plan-write/SKILL.md` |
| **Invocation channel** | Orchestrator reads the `spawn-agent-session` shared skill and calls `sessions_spawn()` |
| **Arguments delivery** | Via `attachments` JSON in the spawn payload — the skill reads `--domain`, `--mode`, `--feature-id` from the attachment, NOT from a shell `argv` |

**How the orchestrator spawns a `qa-plan-write` handler** (one per domain, parallel):

```json
// Example spawn payload — atlassian handler, Phase 1
{
  "agent_id": "qa-plan-write",
  "mode": "normal",
  "runtime": "codex",
  "label": "qa-plan-write-atlassian-BCIN-6709-context",
  "task": "Run qa-plan-write skill with the attached context.",
  "attachments": [
    {
      "name": "context.json",
      "content": {
        "domain": "atlassian",
        "mode": "context",
        "feature_id": "BCIN-6709",
        "jira_key": "BCIN-6709",
        "confluence_url": "https://..."
      }
    }
  ]
}
```

The orchestrator passes this payload to `sessions_spawn()` (via `spawn-agent-session` skill normalization). The spawned agent reads `context.json` and branches on `domain` + `mode`.

> **Note**: The CLI-style notation used elsewhere in this document — e.g. `qa-plan-write --domain atlassian --mode context --feature-id BCIN-6709` — is shorthand for readability only. The actual invocation is always a `sessions_spawn()` call with an attachment, never a direct shell command from the orchestrator.

---

## 3.1 Script Ownership — Who Calls What

To keep responsibilities clean, each script is owned by exactly one type of agent. **No agent ever calls the other's script.**

| Script | Called by | Never called by | Reason |
|--------|-----------|-----------------|--------|
| `save_context.sh` | **Sub-agents** (qa-plan-* skills) | Orchestrator | Sub-agents have the content — they save it immediately after fetch |
| `validate_context.sh` | **Orchestrator & Review Sub-Agents** | | Orchestrator gates phases; Review agents gate themselves and re-fetch if needed |
| `check_resume.sh` | **Orchestrator only** (Phase 0) | Sub-agents | State management belongs to the orchestrator |

### Rule: Sub-agents save, orchestrator/reviewers validate

```
Sub-agent (qa-plan-atlassian)          Orchestrator
  1. jira issue view BCIN-6709           │
  2. save_context.sh BCIN-6709 ...  ←   │  (sub-agent calls this, not orchestrator)
  3. ...fetch more, save more...         │
  4. Done → signal completion            │
                                         │  5. validate_context.sh BCIN-6709 ...  (orchestrator gates here)
                                         │  6. All OK → advance current_phase
```

### Sub-agent save contract (in each qa-plan-\* skill)

Every `qa-plan-*` SKILL.md must have a **"Save Artifacts" section** at the end of each fetch step. The sub-agent calls `save_context.sh` exactly once per artifact, immediately after it has the content:

```bash
# Immediately after fetching Jira issue:
SKILL_SCRIPTS="$(dirname "$0")/../../projects/feature-plan/scripts"
$SKILL_SCRIPTS/save_context.sh "$FEATURE_ID" "jira_issue_${ISSUE_KEY}" "$ISSUE_CONTENT"

# Immediately after a background Confluence/Tavily search:
$SKILL_SCRIPTS/save_context.sh "$FEATURE_ID" "research_bg_confluence_${SLUG}_${FEATURE_ID}" "$SEARCH_RESULT"
```

### Orchestrator validate contract (in `feature-qa-planning-orchestrator` SKILL.md)

The orchestrator calls `validate_context.sh` at **two points**:
1. After Phase 1 agents complete — gate before starting Phase 2
2. Before synthesis (Phase 5) — confirm all sub test case files exist

Review sub-agents (Phase 3) also call it directly before they begin their review tasks.

```bash
# After Phase 1 agents complete:
SCRIPTS="projects/feature-plan/scripts"
$SCRIPTS/validate_context.sh "$FEATURE_ID" \
  "jira_issue_${MAIN_KEY}" \
  "qa_plan_atlassian_${FEATURE_ID}" \
  "qa_plan_github_traceability_${FEATURE_ID}"
# → CONTEXT_OK: advance to phase_2_sub_testcase_generation
# → CONTEXT_MISSING: stop, report to user
```

### What this means for each skill refactor

| Skill | Script responsibility after refactor |
|-------|-------------------------------------|
| `qa-plan-write` (atlassian handler) | Calls `save_context.sh` after every Jira + Confluence fetch |
| `qa-plan-write` (github handler) | Calls `save_context.sh` after every gh diff fetch |
| `qa-plan-write` (figma handler) | Calls `save_context.sh` after Figma metadata fetch |
| `qa-plan-write` Phase 2 sub test case handlers | Calls `save_context.sh` for sub test case output + each background search |
| Phase 3 review sub-agents | Calls `validate_context.sh` before starting; Calls `save_context.sh` for review output, re-fetch, and background search |
| `feature-qa-planning-orchestrator` | Calls `validate_context.sh` after specific phases complete — **never** calls `save_context.sh` |

---

## 3.6 `qa-plan-review` (Phase 3) — Domain Handler Identity & Invocation

**`qa-plan-review` is a skill** with **four domain handlers** (jira, confluence, github, figma). Each handler reviews **only its own domain's artifacts** — it never reads another domain's context files. This mirrors the `qa-plan-write` isolation principle.

| Property | Value |
|----------|-------|
| **Skill path** | `workspace-planner/skills/qa-plan-review/` |
| **Skill entry** | `workspace-planner/skills/qa-plan-review/SKILL.md` |
| **Invocation channel** | Orchestrator calls `sessions_spawn()` (via `spawn-agent-session` skill) |
| **Arguments delivery** | Via `attachments` JSON — skill reads `domain` + `feature_id` from attachment |
| **Domain isolation** | Each handler reads ONLY its own domain's `context/` files — cross-domain reads are forbidden |

**How the orchestrator spawns a `qa-plan-review` handler** (one per domain, parallel):

```json
// Example spawn payload — jira review handler, Phase 3
{
  "agent_id": "qa-plan-review",
  "mode": "normal",
  "runtime": "codex",
  "label": "qa-plan-review-jira-BCIN-6709",
  "task": "Run qa-plan-review skill with the attached context.",
  "attachments": [
    {
      "name": "context.json",
      "content": {
        "domain": "jira",
        "feature_id": "BCIN-6709"
      }
    }
  ]
}
```

The same shape is used for `confluence`, `github`, and `figma` — only `domain` changes.

> **Note**: The shorthand `qa-plan-review --domain jira` used in diagrams is readability notation only. The actual invocation is always a `sessions_spawn()` call with an attachment.

---

## 3.7 `qa-plan-review` (Phase 4) — Refactor Mode Identity & Invocation

Phase 4 reuses the **same `qa-plan-review` skill** with a new `mode: "refactor"` value. No new skill is created. The orchestrator spawns one handler per domain in parallel, each applying its own domain's Phase 3 review findings to the corresponding sub test case file.

| Property | Value |
|----------|-------|
| **Skill path** | `workspace-planner/skills/qa-plan-review/` |
| **Skill entry** | `workspace-planner/skills/qa-plan-review/SKILL.md` |
| **Invocation channel** | Orchestrator calls `sessions_spawn()` (via `spawn-agent-session` skill) |
| **Arguments delivery** | Via `attachments` JSON — skill reads `domain`, `mode: refactor`, and `feature_id` from attachment |
| **Domain isolation** | Each handler reads ONLY its own domain's files — cross-domain reads are forbidden |
| **`save_context.sh` ownership** | Called by the spawned sub-agent (handler) — NEVER by the orchestrator |

**How the orchestrator spawns a Phase 4 refactor handler** (one per domain, parallel):

```json
// Example spawn payload — atlassian refactor handler, Phase 4
{
  "agent_id": "qa-plan-review",
  "mode": "normal",
  "runtime": "codex",
  "label": "qa-plan-refactor-atlassian-BCIN-6709",
  "task": "Run qa-plan-review skill in refactor mode with the attached context.",
  "attachments": [
    {
      "name": "context.json",
      "content": {
        "domain": "atlassian",
        "mode": "refactor",
        "feature_id": "BCIN-6709"
      }
    }
  ]
}
```

The same shape is used for `github` and `figma` — only `domain` changes. The `figma` handler is skipped entirely if no Figma context exists.

**No-op rule**: if a handler's domain review (`review_<domain>_<id>.md`) contains no actionable changes, the handler exits without writing any output file. The orchestrator treats a missing `_v2.md` as "no changes — domain is clean."

> **Note**: The shorthand `qa-plan-review --domain atlassian --mode refactor` used in diagrams is readability notation only. The actual invocation is always a `sessions_spawn()` call with an attachment.

---

## 4. New Scripts Required

### 4.1 `save_context.sh` — Called by Sub-Agents Only

**Owner**: `qa-plan-*` sub-agent skills (NEVER the orchestrator)

**Purpose**: After each fetch, the sub-agent calls this script to write the raw result to `context/`. This replaces ad-hoc "save to file" instructions scattered across each skill.

**Location (canonical source)**: `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/save_context.sh`  
**Deployed location**: `projects/feature-plan/scripts/save_context.sh`  
The orchestrator MUST copy `save_context.sh` from `lib/` to the project scripts directory at the start of Phase 1 (before spawning sub-agents), creating the directory if it does not exist.

**Usage**:
```bash
# Immediately after Jira fetch:
$SCRIPTS/save_context.sh BCIN-6709 "jira_issue_BCIN-6709" "$(jira issue view BCIN-6709 --plain)"

# After gh diff written to tmp file:
$SCRIPTS/save_context.sh BCIN-6709 "github_diff_biweb" /tmp/biweb_diff.md

# After background search:
$SCRIPTS/save_context.sh BCIN-6709 "research_bg_tavily_reCreateReportInstance_BCIN-6709" "$SEARCH_RESULT"
```

**Script**:
```bash
#!/bin/bash
# save_context.sh — Persist a raw artifact into context/ with archive-before-overwrite
# Called by: qa-plan-* sub-agent skills ONLY
# Usage: ./save_context.sh <feature-id> <artifact-name> <content-or-filepath>
set -euo pipefail

FEATURE_ID="${1:?Usage: save_context.sh <feature-id> <artifact-name> <content-or-file>}"
ARTIFACT_NAME="${2:?Missing artifact name}"
CONTENT_OR_FILE="${3:?Missing content or file path}"

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTEXT_DIR="$BASE_DIR/$FEATURE_ID/context"
mkdir -p "$CONTEXT_DIR"

# Support sub-paths like "figma/figma_metadata_..."
OUTFILE="$CONTEXT_DIR/${ARTIFACT_NAME%.md}.md"
mkdir -p "$(dirname "$OUTFILE")"

# Archive if already exists (idempotency)
if [ -f "$OUTFILE" ]; then
  TS=$(date -u +%Y%m%dT%H%M%SZ)
  mv "$OUTFILE" "${OUTFILE%.md}_archived_${TS}.md"
fi

# Write: file path or inline content
if [ -f "$CONTENT_OR_FILE" ]; then
  cp "$CONTENT_OR_FILE" "$OUTFILE"
else
  printf '%s\n' "$CONTENT_OR_FILE" > "$OUTFILE"
fi

echo "SAVED: context/${ARTIFACT_NAME%.md}.md"
```

---

### 4.2 `validate_context.sh` — Called by Orchestrator and Review Sub-Agents

**Owner**: `feature-qa-planning-orchestrator` and `qa-plan-review` sub-agents

**Purpose**: The orchestrator calls this to gate advancing to key phases. Review sub-agents call it before starting their tasks to confirm required inputs are present. Fails fast with a clear missing-file list.

**Location**: `workspace-planner/projects/feature-plan/scripts/validate_context.sh`

**Usage**:
```bash
./validate_context.sh BCIN-6709 \
  "jira_issue_BCIN-6709" \
  "qa_plan_atlassian_BCIN-6709" \
  "qa_plan_github_traceability_BCIN-6709"
# → CONTEXT_OK  (exit 0)
# → CONTEXT_MISSING: ✗ qa_plan_atlassian_BCIN-6709  (exit 1)
```

**What it checks per phase**:

| Phase | Agent | Required artifacts |
|-------|-------|-------------------|
| Phase 2 | atlassian_testcase | `jira_issue_<main>.md`, `qa_plan_atlassian_<id>.md`, all `jira_issue_<related>.md` |
| Phase 2 | github_testcase | at least one `github_diff_<repo>.md`, `qa_plan_github_traceability_<id>.md` |
| Phase 2 | figma_testcase | `figma/figma_metadata_<id>_*.md`, `qa_plan_figma_<id>.md` |
| Phase 3 | jira_review | `sub_test_cases_atlassian_<id>.md`, `jira_issue_<main>.md` |
| Phase 3 | confluence_review | `sub_test_cases_atlassian_<id>.md`, `qa_plan_atlassian_<id>.md` |
| Phase 3 | github_review | `sub_test_cases_github_<id>.md`, `qa_plan_github_traceability_<id>.md` |
| Phase 3 | figma_review | `sub_test_cases_figma_<id>.md`, `qa_plan_figma_<id>.md` |
| Phase 4 | atlassian_refactor | `sub_test_cases_atlassian_<id>.md`, `review_jira_<id>.md`, `review_confluence_<id>.md` |
| Phase 4 | github_refactor | `sub_test_cases_github_<id>.md`, `review_github_<id>.md` |
| Phase 4 | figma_refactor | `sub_test_cases_figma_<id>.md`, `review_figma_<id>.md` |
| Phase 5 | synthesis | latest `sub_test_cases_*.md` (v2 if present, else v1), `qa_plan_github_traceability_<id>.md` |
| Phase 6 | xmind_review | all `review_*.md`, `qa_plan_github_traceability_<id>.md` |

**Script**:
```bash
#!/bin/bash
# validate_context.sh — Verify required context artifacts exist before phase transition
# Usage: ./validate_context.sh <feature-id> <artifact-name>...
# Special: pass --resolve-sub-testcases to print the latest sub_test_cases_*.md
#          resolved per domain (v2 if present, else base). Used by Phase 5 synthesis.
set -euo pipefail

FEATURE_ID="${1:?Usage: validate_context.sh <feature-id> <artifact-name>...}"
shift
BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTEXT_DIR="$BASE_DIR/$FEATURE_ID/context"

# --resolve-sub-testcases mode: print the latest per-domain file and exit
resolve_latest_sub_testcase() {
  local domain="$1"
  local v2="$CONTEXT_DIR/sub_test_cases_${domain}_${FEATURE_ID}_v2.md"
  local base="$CONTEXT_DIR/sub_test_cases_${domain}_${FEATURE_ID}.md"
  if [ -f "$v2" ];   then echo "$v2";   return; fi
  if [ -f "$base" ]; then echo "$base"; return; fi
  echo "MISSING:sub_test_cases_${domain}_${FEATURE_ID}" >&2
  return 1
}

if [ "${1:-}" = "--resolve-sub-testcases" ]; then
  shift
  # Caller passes the list of domains to resolve, e.g. "atlassian github figma"
  HAS_ERROR=0
  for domain in "$@"; do
    resolve_latest_sub_testcase "$domain" || HAS_ERROR=1
  done
  [ "$HAS_ERROR" -eq 0 ] && echo "RESOLVED_OK" || { echo "CONTEXT_MISSING: one or more sub_test_cases not found"; exit 1; }
  exit 0
fi

# Default mode: check named artifacts exist
MISSING=()
for artifact in "$@"; do
  FILE="$CONTEXT_DIR/${artifact%.md}.md"
  [ ! -f "$FILE" ] && MISSING+=("$artifact")
done

if [ "${#MISSING[@]}" -gt 0 ]; then
  echo "CONTEXT_MISSING:"
  for m in "${MISSING[@]}"; do echo "  ✗ $m"; done
  exit 1
fi

echo "CONTEXT_OK — all $# required artifacts present"
```

**Phase 5 invocation example** (orchestrator, from `feature-qa-planning-orchestrator` SKILL.md):
```bash
# Step 1 — resolve per-domain latest sub test case file
RESOLVED=$(./validate_context.sh "$FEATURE_ID" --resolve-sub-testcases atlassian github figma)
# $RESOLVED contains one absolute path per domain, or exits non-zero if any base file is missing

# Step 2 — confirm traceability companion is present
./validate_context.sh "$FEATURE_ID" "qa_plan_github_traceability_${FEATURE_ID}"

# → Both OK: advance to qa-plan-synthesize, passing the resolved paths as context
```

**Resolution semantics**:
| Scenario | File used by synthesis |
|----------|------------------------|
| Phase 4 ran and produced `_v2.md` | `sub_test_cases_<domain>_<id>_v2.md` |
| Phase 4 was a no-op (no changes) | `sub_test_cases_<domain>_<id>.md` (Phase 2 output) |
| Phase 2 base file is also missing | Script exits non-zero — synthesis is blocked |

---

### 4.3 Cross-Cutting Rule: Background Search Must Be Saved

**Every Confluence or Tavily search triggered during the non-actionable resolution chain MUST be saved to `context/` via `save_context.sh` before its result is used.**

**Naming convention**:
```
context/research_bg_<domain>_<query-slug>_<id>.md
```

**Examples**:
```
context/research_bg_atlassian_pause-mode-behavior_BCIN-6709.md
context/research_bg_tavily_reCreateReportInstance_BCIN-6709.md
context/research_bg_confluence_error-recovery-flow_BCIN-6709.md
context/research_review_bg_jira_recreate-error-flow_BCIN-6709.md
context/research_bg_refactor_what-is-pause-mode_BCIN-6709.md
```

**Non-actionable resolution chain** (applies everywhere background search is triggered):
1. Search `context/` files first
2. If not resolved: call Confluence search via `confluence` skill
3. If still not resolved: call `tavily-search` skill
4. If all fail: keep the item with `<!-- TODO: Cannot determine concrete user action — found in [source] -->` — **NEVER remove**

**In-skill procedure**:
1. Perform search
2. `./save_context.sh <id> "research_bg_<domain>_<slug>_<id>" "$SEARCH_RESULT"`
3. If item still unresolved, reference saved file in TODO comment:
   ```
   <!-- TODO: Cannot determine concrete user action — partial context in context/research_bg_tavily_reCreateReportInstance_BCIN-6709.md -->
   ```
4. List all `research_bg_*.md` in the `## 📎 Artifacts Used` section of the final XMind

---

## 5. Full Context Artifact Registry

```
# Phase 1 — Context Gathering
context/jira_issue_<main-key>.md
context/jira_issue_<related-key>.md         ← one per related issue
context/jira_related_issues_<id>.md
context/figma_link_<id>.md                  ← if Figma URL found in Jira/Confluence
context/qa_plan_atlassian_<id>.md
context/github_diff_<repo>.md               ← one per repo diff
context/qa_plan_github_<id>.md
context/qa_plan_github_traceability_<id>.md
context/figma/figma_metadata_<id>_<date>.md
context/qa_plan_figma_<id>.md

# Phase 2 — Sub Test Case Generation
context/sub_test_cases_atlassian_<id>.md
context/sub_test_cases_github_<id>.md
context/sub_test_cases_figma_<id>.md        ← if Figma present
context/research_bg_atlassian_<slug>_<id>.md   ← each background search during Phase 2
context/research_bg_github_<slug>_<id>.md
context/research_bg_figma_<slug>_<id>.md

# Phase 3 — Sub Test Case Review
context/review_jira_<id>.md
context/review_confluence_<id>.md
context/review_github_<id>.md
context/review_figma_<id>.md                ← if Figma present
context/research_review_bg_<domain>_<slug>_<id>.md  ← background search during Phase 3

# Phase 4 — Sub Test Case Refactor
context/sub_test_cases_<domain>_<id>_v2.md  ← if changes were made
context/research_bg_refactor_<slug>_<id>.md ← if background search during Phase 4

# Phase 6 — Synthesized Review
context/review_consolidated_<id>.md
```

---

## 6. Skill-by-Skill Changes

### 6.1 `qa-plan-write` (Phase 1 + Phase 2) — replaces `qa-plan-atlassian`, `qa-plan-github`, `qa-plan-figma`

`qa-plan-write` is a single skill with **three domain handlers** (atlassian, github, figma). Each handler is invoked by the orchestrator as a named sub-agent. This consolidation eliminates the three separate top-level skills while keeping the domain logic cleanly separated inside one skill directory.

---

#### Mode Flag Contract

The orchestrator **always** invokes `qa-plan-write` with explicit `domain`, `mode`, and `feature_id` values delivered via the `sessions_spawn()` attachment. Handlers MUST NOT infer mode from context file existence — the orchestrator decides.

| `mode` value | Phase | What the handler does |
|-------------|-------|----------------------|
| `context` | Phase 1 | Fetch raw source data → call `save_context.sh` for every artifact. **No test case generation.** |
| `testcase` | Phase 2 | Read existing `context/` files → generate XMind sub test cases → call `save_context.sh` for output. **No live re-fetch.** |
| `full` | Dev/debug only | Runs `context` then `testcase` in sequence. **Never used by orchestrator in production.** |

**How the orchestrator spawns handlers** (shorthand notation → see Section 3.1 for the full `sessions_spawn()` payload):

```
# Phase 1 — orchestrator spawns all three in parallel via sessions_spawn()
domain=atlassian  mode=context   feature_id=BCIN-6709  → skill: workspace-planner/skills/qa-plan-write/
domain=github     mode=context   feature_id=BCIN-6709  → skill: workspace-planner/skills/qa-plan-write/
domain=figma      mode=context   feature_id=BCIN-6709  → skill: workspace-planner/skills/qa-plan-write/

# Phase 2 — orchestrator gates with validate_context.sh, then spawns
domain=atlassian  mode=testcase  feature_id=BCIN-6709  → skill: workspace-planner/skills/qa-plan-write/
domain=github     mode=testcase  feature_id=BCIN-6709  → skill: workspace-planner/skills/qa-plan-write/
domain=figma      mode=testcase  feature_id=BCIN-6709  → skill: workspace-planner/skills/qa-plan-write/
```

**Resumability rule**: if Phase 1 completes but Phase 2 fails mid-way, the orchestrator re-spawns only `--mode testcase`. Context is never re-fetched. The `validate_context.sh` gate before Phase 2 confirms context files are present before any handler starts.

**`--mode testcase` guard**: if any required context file is missing, the handler MUST immediately exit with:
```
ERROR: Missing context file: context/qa_plan_atlassian_BCIN-6709.md
Run Phase 1 first: qa-plan-write --domain atlassian --mode context --feature-id BCIN-6709
```

---

#### Handler: `atlassian`

**`--mode context`**: Fetch raw Jira/Confluence context → save to `context/`.  
**`--mode testcase`**: Read context files → produce domain sub test cases in XMind branch format.

**Changes**:
- Add `save_context.sh` call after every Jira/Confluence fetch
- Phase 2 output file: `context/sub_test_cases_atlassian_<id>.md`
- Output format MUST follow `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md` scaffold exactly
- Every action item must be **user-observable** (not Jira field names or ACs verbatim)
- Non-actionable ACs → apply resolution chain (see Section 4.3)
- Remove table-heavy output format; remove "QA Domain Summary" step
- Remove test scenario generation from Phase 1 (Phase 1 outputs domain context only)

**Key context artifacts saved**:
```
context/jira_issue_<key>.md               ← raw Jira main issue
context/jira_issue_<related-key>.md       ← raw related issues
context/jira_related_issues_<id>.md       ← issue-set listing
context/qa_plan_atlassian_<id>.md         ← domain context summary
context/sub_test_cases_atlassian_<id>.md  ← Phase 2: XMind branch output
```

---

#### Handler: `github`

**`--mode context`**: Fetch GitHub diffs + build traceability → save to `context/`.  
**`--mode testcase`**: Read context files → produce domain sub test cases in XMind branch format.

**Changes**:
- Add `save_context.sh` call after every `gh api` fetch
- Phase 2 output file: `context/sub_test_cases_github_<id>.md`
- Traceability companion **still saved**: `context/qa_plan_github_traceability_<id>.md`
- Output format MUST follow `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md` scaffold
- Organize by **user-facing functional scenario** (not by repo or file)
- Code-only changes that are not user-observable → move to `## AUTO: Automation-Only Tests` section
- Remove the old "narrative domain summary" — the XMind branches ARE the output
- Remove user-facing scenario generation from Phase 1 (Phase 1 outputs diffs + traceability only)

**Key context artifacts saved**:
```
context/github_diff_<repo>.md                       ← raw diff
context/qa_plan_github_traceability_<id>.md         ← traceability (required for P1 priority)
context/sub_test_cases_github_<id>.md               ← Phase 2: XMind branch output
```

---

#### Handler: `figma`

**`--mode context`**: Fetch Figma metadata → save to `context/`.  
**`--mode testcase`**: Read context files → produce domain sub test cases in XMind branch format.

**Changes**:
- Add `save_context.sh` call after Figma metadata fetch
- Phase 2 output file: `context/sub_test_cases_figma_<id>.md`
- Figma metadata file **still saved**: `context/figma/figma_metadata_<id>_<date>.md`
- Output format MUST follow `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md` scaffold
- Hierarchy: `## UI Testing`, `### Component Name`, bullet steps → leaf expected result
- Remove the old "500-1000 line narrative" requirement — quality is measured by actionability per item, not line count
- Non-actionable Figma annotations → apply resolution chain (see Section 4.3)

**Key context artifacts saved**:
```
context/figma/figma_metadata_<id>_<date>.md       ← Figma metadata
context/qa_plan_figma_<id>.md                     ← domain context summary
context/sub_test_cases_figma_<id>.md              ← Phase 2: XMind branch output
```

---

### 6.2 Phase 3 — Domain Review Sub-Agents

Phase 3 mirrors Phase 1/2: the orchestrator spawns **4 domain review sub-agents in parallel**, each of which is a handler inside the `qa-plan-review` skill. **Each handler reviews only its own domain's sub test cases against its own domain's source artifacts.** A jira handler never reads GitHub diffs; a github handler never reads Jira issues.

**Common rules (all handlers)**:
- Gate: Each handler calls `validate_context.sh` before starting. If the required context is missing, the handler re-fetches it and saves it via `save_context.sh`.
- Background search allowed → each search result saved via `save_context.sh` immediately
- Output artifact saved via `save_context.sh`
- If a domain's context is absent (e.g. no Figma URL), the orchestrator skips spawning that handler

---

#### Handler: `jira` review

**Review focus**: Do the `sub_test_cases_atlassian` entries accurately reflect the Jira acceptance criteria and issue requirements? Are scenarios user-observable and traceable to Jira fields?

**Reads (domain-scoped — no other files)**:
```
context/sub_test_cases_atlassian_<id>.md   ← the generated test cases to review
context/jira_issue_<main-key>.md           ← source of truth for ACs
context/jira_issue_<related-key>.md        ← each related issue (for cross-issue traceability)
context/jira_related_issues_<id>.md        ← issue-set listing
```

**Review checklist**:
- Every AC from Jira has at least one test case
- No test case is a verbatim copy of an AC — each must be rephrased as a user action + observable result
- Scope creep: no GitHub or UI-only items mixed into Jira test cases
- Missing ACs: flag any AC with no corresponding test case

**Output**: `context/review_jira_<id>.md` via `save_context.sh`

---

#### Handler: `confluence` review

**Review focus**: Do the `sub_test_cases_atlassian` entries cover the requirements documented in the Confluence design doc? Are business rules and non-functional requirements represented?

**Reads (domain-scoped — no other files)**:
```
context/sub_test_cases_atlassian_<id>.md   ← test cases to review
context/qa_plan_atlassian_<id>.md          ← Confluence-derived domain context summary
```
**Background search allowed** (via `confluence` skill) → save via `save_context.sh` before use.

**Review checklist**:
- Business rules from Confluence design doc have test coverage
- Non-functional requirements (performance, security, accessibility) flagged if untested
- Ambiguous design decisions noted — mark as `<!-- TODO: design doc unclear — [page/section] -->`
- No Jira-AC-only content mis-attributed as Confluence requirement

**Output**: `context/review_confluence_<id>.md` via `save_context.sh`

---

#### Handler: `github` review

**Review focus**: Do the `sub_test_cases_github` entries cover the actual code changes in the PR diffs? Is traceability accurate — are P1 items correctly linked to diffed code paths?

**Reads (domain-scoped — no other files)**:
```
context/sub_test_cases_github_<id>.md               ← test cases to review
context/qa_plan_github_traceability_<id>.md          ← code diff → test case traceability map
context/github_diff_<repo>.md                        ← raw diff(s) for spot-checking
```

**Review checklist**:
- Every diffed file/function in the traceability map has a corresponding test case
- P1 markers are only applied to items that trace directly to a code diff
- Code-internal changes with no user-observable effect are in `## AUTO: Automation-Only Tests`
- No Jira AC or Confluence business rule mixed into the github test cases
- Non-actionable code references → apply resolution chain → save result via `save_context.sh`

**Output**: `context/review_github_<id>.md` via `save_context.sh`

---

#### Handler: `figma` review

**Review focus**: Do the `sub_test_cases_figma` entries accurately reflect the UI/UX design intent from Figma? Are component names, interaction states, and layout rules testable?

**Reads (domain-scoped — no other files)**:
```
context/sub_test_cases_figma_<id>.md                 ← test cases to review
context/qa_plan_figma_<id>.md                        ← Figma-derived domain context summary
context/figma/figma_metadata_<id>_<date>.md          ← raw Figma metadata snapshot
```
**Skipped entirely if no Figma context exists** (orchestrator does not spawn this handler).

**Review checklist**:
- Every annotated Figma component has at least one review-point in the test cases
- Component names in test cases match Figma layer names — no invented UI vocabulary
- Interaction states (hover, loading, error, empty) are covered
- Non-actionable Figma annotations → apply resolution chain → save result via `save_context.sh`
- No Jira AC or GitHub diff content mixed into Figma test cases

**Output**: `context/review_figma_<id>.md` via `save_context.sh`

---

### 6.45 `qa-plan-review --mode refactor` (Phase 4) — Domain Refactor Handlers

Phase 4 reuses the `qa-plan-review` skill, adding a **`refactor` mode** alongside the existing `review` mode. The orchestrator spawns one handler per domain in parallel. Each handler applies its own domain's Phase 3 review findings to the corresponding sub test case file — nothing else.

**Common rules (all handlers)**:
- Gate: Orchestrator calls `validate_context.sh` before spawning — confirms all Phase 3 `review_*.md` files are present
- Domain isolation: each handler reads ONLY its own domain's files (same rule as Phase 3)
- No live re-fetch: reads `context/` only; if a file is unexpectedly missing the handler exits with an error
- Background search allowed → result saved via `save_context.sh` immediately before use
- Output saved via `save_context.sh` (called by handler — NEVER by orchestrator)
- No-op: if no changes are warranted, the handler exits without writing `_v2.md`

---

#### Handler: `atlassian` refactor

**Refactor focus**: Apply findings from both `review_jira_<id>.md` and `review_confluence_<id>.md` to `sub_test_cases_atlassian_<id>.md`.

**Reads (domain-scoped — no other files)**:
```
context/sub_test_cases_atlassian_<id>.md   ← base to refactor
context/review_jira_<id>.md               ← jira review findings
context/review_confluence_<id>.md         ← confluence review findings
```

**Refactor checklist**:
- Apply every "Missing AC" flag from `review_jira`: add the missing test case
- Apply every "Verbatim AC copy" flag: rephrase as user action + observable result
- Apply every "Business rule untested" flag from `review_confluence`: add coverage or mark `<!-- TODO -->`
- Apply every "Ambiguous design decision" TODO comment from `review_confluence`
- Remove any scope-creep items (GitHub/UI-only) flagged by jira review
- If a fix requires clarification → background search → `save_context.sh` → keep `<!-- TODO -->` if unresolved

**Output**: `context/sub_test_cases_atlassian_<id>_v2.md` via `save_context.sh` (only if changes made)

---

#### Handler: `github` refactor

**Refactor focus**: Apply findings from `review_github_<id>.md` to `sub_test_cases_github_<id>.md`.

**Reads (domain-scoped — no other files)**:
```
context/sub_test_cases_github_<id>.md              ← base to refactor
context/review_github_<id>.md                      ← github review findings
context/qa_plan_github_traceability_<id>.md        ← traceability map (for P1 re-validation)
```

**Refactor checklist**:
- Add missing test cases for any diffed file/function flagged by review
- Fix P1 markers that were misapplied (must trace to a code diff)
- Move code-internal items with no user-observable effect into `## AUTO: Automation-Only Tests` if not already there
- Remove any Jira AC or Confluence items mixed into github test cases
- Resolve non-actionable code references via resolution chain → `save_context.sh`

**Output**: `context/sub_test_cases_github_<id>_v2.md` via `save_context.sh` (only if changes made)

---

#### Handler: `figma` refactor

**Refactor focus**: Apply findings from `review_figma_<id>.md` to `sub_test_cases_figma_<id>.md`.
**Skipped entirely if no Figma context exists** (orchestrator does not spawn this handler).

**Reads (domain-scoped — no other files)**:
```
context/sub_test_cases_figma_<id>.md                 ← base to refactor
context/review_figma_<id>.md                         ← figma review findings
context/figma/figma_metadata_<id>_<date>.md          ← raw Figma metadata (for name verification)
```

**Refactor checklist**:
- Add test cases for any Figma component flagged as missing coverage
- Fix component names that don't match Figma layer names
- Add missing interaction state coverage (hover, loading, error, empty) as flagged
- Resolve non-actionable Figma annotations → resolution chain → `save_context.sh`
- Remove any Jira AC or GitHub diff content mixed into Figma test cases

**Output**: `context/sub_test_cases_figma_<id>_v2.md` via `save_context.sh` (only if changes made)

---

### 6.5 `qa-plan-synthesize` (Phase 5)

**Current role**: Dual output (`qa_plan_only`, `xmind_only`, `dual` modes).  
**New role**: Single responsibility — `xmind_only` only.

**Changes**:
- Remove `output_mode` parameter (lock to `xmind_only`)
- Remove all QA plan narrative generation logic
- Gate: orchestrator calls `validate_context.sh --resolve-sub-testcases <domains>` before invoking synthesis — resolves the latest file per domain (v2 if present, else base)
- Keep the 3-step synthesis protocol (Collect → Research → Deduplicate)
- Non-actionable items → apply full resolution chain (context → Confluence → Tavily → TODO)
- Output: `drafts/test_key_points_xmind_v<N+1>.md` only

**v2-vs-base resolution rule** (applies at the start of the Collect step):

| For each domain | Rule |
|-----------------|------|
| `sub_test_cases_<domain>_<id>_v2.md` exists | Use `_v2.md` — it is the Phase 4 refactored version |
| Only `sub_test_cases_<domain>_<id>.md` exists | Use the base file — Phase 4 was a no-op for this domain |
| Neither file found | Abort synthesis — report which domain is missing |

> The synthesizer MUST NOT mix `_v2.md` for one domain and base for the same domain in the same run. The resolved path for each domain is passed in as an attachment from the orchestrator (from the `--resolve-sub-testcases` output) — the synthesizer does NOT re-infer the path itself.

- Add `## 📎 Artifacts Used` header in every output, listing the **resolved** filenames:
  ```markdown
  ## 📎 Artifacts Used
  - context/sub_test_cases_atlassian_<id>_v2.md   ← or base if no v2
  - context/sub_test_cases_github_<id>.md          ← v2 suffix omitted if Phase 4 was no-op
  - context/sub_test_cases_figma_<id>_v2.md        ← if Figma present; or base
  - context/qa_plan_github_traceability_<id>.md
  - context/jira_issue_<key>.md
  - context/jira_related_issues_<id>.md
  - (any other context/*.md files used)
  ```

---

### 6.6 `qa-plan-review` (Phase 6)

**Current role**: Review both QA plan draft + XMind draft; optionally re-fetch live sources.  
**New role**: Review **XMind draft only** using **already-cached context artifacts** (no re-fetch unless explicitly told to).

**Changes**:
- Gate: `validate_context.sh` to confirm Phase 3 review artifacts exist
- Remove dual-review instruction
- **MUST read cached artifacts from `context/`** first — only do live re-fetch if a specific artifact is missing AND the user permits it
- **MUST load `workspace-planner/skills/feature-qa-planning-orchestrator/docs/priority-assignment-rules.md`** and apply it to every top-level category and every scenario
- Replace QA plan structural checklist with XMind checks (X1–X5):
  - **X1**: Every `##` category has a P1/P2/P3 marker
  - **X2**: Every `###` sub-category either has a priority marker or inherits from parent
  - **X3**: Leaf nodes contain expected results (observable, no code vocabulary)
  - **X4**: `## AUTO` section present for code-internal tests
  - **X5**: `## 📎 Artifacts Used` section present with links to all context files
- Read cached artifacts only — no live re-fetch by default
- Output: `context/review_consolidated_<id>.md`

---

### 6.7 `qa-plan-refactor` (Phase 7)

**Current role**: Update QA plan based on review findings.  
**New role**: Update **XMind draft only** based on review findings.

**Changes**:
- Remove all narrative QA plan update logic
- Remove old table-based update strategy
- Refactor applies to XMind bullet hierarchy only: fix category headers, rewrite steps, add expected results as leaf nodes
- Read from cached `context/` artifacts for verification — no live re-fetch unless missing
- UE-fix mapping unchanged (UE-1 through UE-6)
- Background search allowed → `save_context.sh`
- Dynamic draft versioning unchanged: write to `drafts/test_key_points_xmind_v<N+1>.md`

---

### 6.8 `priority-assignment-rules.md`

**Current**: 217 lines, detailed algorithm + examples + BCIN-6709 table  
**New**: Simplified to a single-page reference card (~60 lines)

**Keep**:
- P1/P2/P3 definitions (one sentence each)
- 3-step assignment algorithm (simplified to bullet rules)
- Priority placement rule (category vs sub-category vs step level)
- Distribution guidelines (40-60% P1, 30-40% P2, 10-20% P3)
- Red flags (3 bullets)

**Remove**:
- Verbose evidence table per priority
- Per-source breakdown (GitHub traceability / Jira AC / design doc)
- Full BCIN-6709 example distribution table
- "Examples by Feature Type" section
- Step-by-step algorithm with FOR loops → replace with decision tree bullet list

---

### 6.9 `feature-qa-planning-orchestrator`

- Update to 8-phase pipeline (see Section 8 for full corrected `task.json` schema)
- Update `README.md` (see Section 9 for all changes)
- Update `check_resume.sh`: change draft version detection from `qa_plan_v*.md` → `test_key_points_xmind_v*.md`
- At Phase 1 start: check if `projects/feature-plan/scripts/` exists, create if needed, copy `save_context.sh` from `scripts/lib/` into it

---

## 7. What is NOT Changing

| Unchanged | Reason |
|-----------|--------|
| Phase 0 idempotency check (`check_resume.sh`) | Still needed |
| `spawn-agent-session` for sub-agents | Still needed |
| Artifact naming convention (`context/`, `drafts/`) | Still needed |
| Error handling / blocker reporting | Still needed |
| Feishu notification | Still needed |
| `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md` | This is now THE canonical output scaffold |
| Confluence search as fallback for non-actionable items | Required by user rules |
| Tavily search as final fallback | Required by user rules |
| `<!-- TODO: -->` comment for unresolved items | Required — NEVER remove |
| P1 traceability via `qa_plan_github_traceability_<id>.md` | Required for correct priority |

---

## 8. Implementation Order

1. `save_context.sh` — implement and test first (deploy to `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/`, all other phases depend on it and add tests to workspace-planner/skills/feature-qa-planning-orchestrator/tests)
2. `validate_context.sh` — implement and test (gates all phase transitions)
3. `priority-assignment-rules.md` — simplify (referenced by all skills)
4. `qa-plan-write` (atlassian handler) — add `save_context.sh`, strip test scenarios from Phase 1, add Phase 2 sub test case output
5. `qa-plan-write` (github handler) — add `save_context.sh`, strip user-facing scenarios from Phase 1, keep traceability
6. `qa-plan-write` (figma handler) — add `save_context.sh`, strip test scenarios from Phase 1, add Phase 2 sub test case output
7. Add Phase 3 review contract (each skill addendum)
8. Add Phase 4 refactor mode to `qa-plan-review` (4 domain handlers, each applies review findings to sub test case)
9. `qa-plan-synthesize` — strip to `xmind_only`, add validate gate + Artifacts Used header
10. `qa-plan-review` — add Phase 6 consolidated XMind-only review, cached artifacts only, X1–X5 checks
11. `qa-plan-refactor` — XMind-only refactor
12. `feature-qa-planning-orchestrator` — 8-phase pipeline + task.json schema + README + Phase 1 `save_context.sh` deploy step
13. `check_resume.sh` — update draft version detection
14. Update `workspace-planner/AGENTS.md` to remove obsolete skills (`qa-plan-atlassian`, `qa-plan-github`, `qa-plan-figma`), Confluence publish references, and `qa_plan_final.md`.

---

## 9. Corrected `task.json` Schema

### 9.1 Issues Found in Previous Plan

| Problem | Old value | Corrected value |
|---------|-----------|----------------|
| `current_phase` enum used old 6-phase names | `phase_1_context_acquisition`, `phase_3_synthesis`, `phase_4_domain_review`, `phase_5_review_refactor` | See corrected enum below |
| `phases` contained `qa_plan_draft_generation`, `domain_review`, `review_refactor` | Old phase keys | Replaced with 8-phase keys |

### 9.2 Corrected `current_phase` Enum

Valid `current_phase` values — one per lifecycle state:

```
phase_0_preparation
phase_1_context_gathering
phase_2_sub_testcase_generation
phase_3_sub_testcase_review
phase_4_sub_testcase_refactor
phase_5_synthesis
phase_6_xmind_review
phase_7_final_refactor
phase_8_publication
completed
```

### 9.3 Phase Transition Map

| Phase | Entry value | On completion → advance to |
|-------|------------|---------------------------|
| Phase 0 | `phase_0_preparation` | `phase_1_context_gathering` |
| Phase 1 | `phase_1_context_gathering` | `phase_2_sub_testcase_generation` |
| Phase 2 | `phase_2_sub_testcase_generation` | `phase_3_sub_testcase_review` |
| Phase 3 | `phase_3_sub_testcase_review` | `phase_4_sub_testcase_refactor` |
| Phase 4 | `phase_4_sub_testcase_refactor` | `phase_5_synthesis` |
| Phase 5 | `phase_5_synthesis` | `phase_6_xmind_review` |
| Phase 6 | `phase_6_xmind_review` | `phase_7_final_refactor` |
| Phase 7 | `phase_7_final_refactor` | `phase_8_publication` |
| Phase 8 | `phase_8_publication` | `completed` |

### 9.4 Full Corrected `task.json` Schema

```json
{
  "run_key": "BCIN-6709",
  "overall_status": "in_progress",
  "current_phase": "phase_0_preparation",
  "latest_xmind_version": null,
  "search_required": false,
  "spawned_agents": {},
  "phases": {
    "context_gathering": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "sub_testcase_generation": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "sub_testcase_review": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "sub_testcase_refactor": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "synthesis": {
      "status": "pending",
      "artifacts": [],
      "completed_at": null
    },
    "xmind_review": {
      "status": "pending",
      "artifacts": [],
      "completed_at": null
    },
    "final_refactor": {
      "status": "pending",
      "iterations": 0,
      "artifacts": [],
      "completed_at": null
    },
    "publication": {
      "status": "pending",
      "notification_sent": false,
      "completed_at": null
    }
  },
  "errors": [],
  "updated_at": null
}
```

### 9.5 Removed `task.json` Fields

These fields existed in the old schema and must be deleted:
- `latest_draft_version` → replaced by `latest_xmind_version`
- `defect_analysis` → no longer tracked here
- `phases.qa_plan_draft_generation` → removed (no QA plan narrative)
- `phases.domain_review` → replaced by `sub_testcase_review`
- `phases.review_refactor` → replaced by `final_refactor`

### 9.6 `check_resume.sh` Fix

The existing `latest_draft_version()` function scans for `qa_plan_v*.md` — must be updated:

```bash
# OLD (remove this)
version=$(ls "$FEATURE_DIR/drafts"/qa_plan_v*.md 2>/dev/null | sed -n 's/.*qa_plan_v\([0-9]*\)\.md/\1/p' | sort -n | tail -1)

# NEW (replace with)
version=$(ls "$FEATURE_DIR/drafts"/test_key_points_xmind_v*.md 2>/dev/null | sed -n 's/.*xmind_v\([0-9]*\)\.md/\1/p' | sort -n | tail -1)
```

Also update `PLAN_FINAL` reference:
```bash
# OLD
readonly PLAN_FINAL="$FEATURE_DIR/qa_plan_final.md"

# NEW
readonly PLAN_FINAL="$FEATURE_DIR/test_key_points_xmind_final.md"
```

---

## 10. README.md Updates

**File**: `workspace-planner/skills/feature-qa-planning-orchestrator/README.md`

### 10.1 Issues Found in Current README

| Issue | Location | Fix |
|-------|----------|-----|
| Describes dual output (`qa_plan_final.md` + XMind) | "What it does" section | Remove `qa_plan_final.md` row; XMind only |
| Shows old 6-phase overview (Phase 0 → Phase 6) | Phase Overview section | Rewrite to 8-phase (Phase 0-8) |
| Phase 2 shows Group A/B (QA plan draft agent) | Phase 2 description | Remove Group B |
| Phase 3 described as "Synthesize" | Phase 3 | Phase 3 is now Sub test case review |
| Phase 4 described as "Domain review" | Phase 4 | Phase 4 is now Sub test case refactor |
| Phase 5 described as "Refactor (max 2 rounds)" | Phase 5 | Phase 5 is now Synthesize |
| Phase 6 described as "Publish + Confluence" | Phase 6 | Phases 6-8 added; no Confluence publish |
| Priority table includes P0 | Priority Definitions | Remove P0; only P1/P2/P3 |
| `output_mode` quick reference section | Separate section | Remove (no longer relevant) |
| `task.json Phase Keys` shows old phase names | task.json section | Update to new 8-phase enum + keys |
| Related Skills table shows wrong phase numbers | Related Skills | Update phase references |

### 10.2 New README Structure

```markdown
# Feature QA Planning Orchestrator

> Skill path: workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md
> Last Updated: 2026-03-08

## What it does

Give it a feature ID + Jira + Confluence + GitHub PRs → produces ONE final output:

| Output | What it is |
|--------|------------|
| `test_key_points_xmind_final.md` | XMind-importable test cases with P1/P2/P3 priority markers |

## Phase Overview  (Phase 0 → Phase 8)

### Phase 0 — Idempotency check (check_resume.sh)  [unchanged]
### Phase 1 — Context gathering (sub-agents via `qa-plan-write`: atlassian, github, figma)
### Phase 2 — Sub test case generation (sub-agents via `qa-plan-write`, one per domain)
### Phase 3 — Sub test case review (4 domain sub-agents)
### Phase 4 — Sub test case refactor (per-domain, based on Phase 3 reviews)
### Phase 5 — Synthesize (single agent → unified XMind draft)
### Phase 6 — Synthesized XMind review (single agent, reuses Phase 3 artifacts)
### Phase 7 — Final refactor (single agent)
### Phase 8 — Finalize + Feishu notify (no Confluence publish)

## Scripts

| Script | Purpose |
|--------|---------|
| `check_resume.sh` | Idempotency state check |
| `save_context.sh` | Save any fetched artifact to context/ |
| `validate_context.sh` | Gate: verify required inputs exist before phase start |

## Priority Definitions

| Priority | Meaning |
|----------|---------| 
| **P1** | Direct code change — traced to GitHub PR diff |
| **P2** | Affected area / cross-functional / Jira AC / compatibility |
| **P3** | Edge case, template-retained, nice to have — can defer |

## task.json Phase Keys

current_phase enum:
  phase_0_preparation → phase_1_context_gathering → phase_2_sub_testcase_generation
  → phase_3_sub_testcase_review → phase_4_sub_testcase_refactor → phase_5_synthesis
  → phase_6_xmind_review → phase_7_final_refactor → phase_8_publication → completed

phases keys:
  context_gathering, sub_testcase_generation, sub_testcase_review,
  sub_testcase_refactor, synthesis, xmind_review, final_refactor, publication

## Related Skills

| Skill | Skill Path | Used in |
|-------|------------|---------|
| **qa-plan-write** (atlassian, github, figma handlers) | `workspace-planner/skills/qa-plan-write/` | Phase 1, 2 — spawned via `sessions_spawn()` |
| **qa-plan-review** (review + refactor + consolidated) | `workspace-planner/skills/qa-plan-review/` | Phase 3 (`mode: review`), Phase 4 (`mode: refactor`), Phase 6 (consolidated XMind review) — Phase 3/4 spawned via `sessions_spawn()` |
| qa-plan-synthesize   | `workspace-planner/skills/qa-plan-synthesize/` | Phase 5 (xmind_only) |
| qa-plan-refactor     | `workspace-planner/skills/qa-plan-refactor/` | Phase 7 |
| jira-cli             | `~/.openclaw/skills/jira-cli/` | Phase 0–1 |
| feishu-notify        | `~/.openclaw/skills/feishu-notify/` | Phase 8 |
| spawn-agent-session  | `~/.openclaw/skills/spawn-agent-session/` | Phase 1, 2, 3, 4 — orchestrator uses this to normalize all `sessions_spawn()` calls |
```

---

**Last Updated**: 2026-03-08  
**Status**: Confirmed — ready for implementation
