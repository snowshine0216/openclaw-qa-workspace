# QA Test Key Points Interactive Page Plan

## 1. Objective

Build a local-first, XMind-like single-page application (SPA) that:

1. Reads `projects/feature-plan/<feature-id>/qa_plan_final.md`.
2. Parses and visualizes `## 🧪 Test Key Points` as an interactive graph.
3. Supports inline editing of test nodes and metadata.
4. Writes changes back to the same Markdown file while preserving non-target sections.
5. Fits OpenClaw workspace/skill conventions so it can be reused by agents.

Primary reference sample:
- `workspace-planner/projects/feature-plan/BCIN-6709/qa_plan_final.md`

---

## 2. Up-Front Setup (Explicit Required Checklist)

This section is mandatory before implementation starts.

### 2.1 Environment

1. OS: macOS or Linux development machine.
2. Node.js: v20+ (recommended v20 LTS or newer).
3. Package manager: `npm` (or `pnpm`, but keep one lockfile policy).
4. Git repo: clean enough to isolate new app files and test artifacts.

### 2.2 Workspace and Data Inputs

1. Confirm target workspace root:
   - `/Users/xuyin/Documents/Repository/openclaw-qa-workspace`
2. Confirm source QA plan path pattern:
   - `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_final.md`
3. Ensure at least one fixture exists for dev/test:
   - `workspace-planner/projects/feature-plan/BCIN-6709/qa_plan_final.md`

### 2.3 Required Output/Backup Policy

1. Before write-back, create backup:
   - `workspace-planner/projects/feature-plan/<feature-id>/archive/qa_plan_final_<YYYYMMDD_HHMMSS>.md`
2. Write-back scope:
   - Replace only the `## 🧪 Test Key Points` block.
   - Do not rewrite other sections.
3. Preserve required table columns (from existing QA governance):
   - `Priority`
   - `Related Code Change`
   - `Test Key Points`
   - `Expected Results`

### 2.4 Dependency Setup (Application)

Core libraries:
1. UI:
   - `react`
   - `react-dom`
   - `reactflow` (or `@xyflow/react`, depending on chosen package line)
2. Markdown parsing/serialization:
   - `unified`
   - `remark-parse`
   - `remark-gfm`
   - `mdast-util-to-markdown` (or unified stringify path)
3. Validation:
   - `zod` (or equivalent schema validator)
4. Optional layout:
   - `dagre` or `elkjs`

### 2.5 Test and Quality Setup

1. Unit test runner:
   - `vitest` (or Jest, but keep one)
2. Snapshot tests for Markdown round-trip:
   - Fixture-based tests for parser/writer
3. E2E smoke test:
   - open sample file -> edit node -> save -> verify Markdown diff constraints
4. Lint/format:
   - Existing repo conventions only; do not introduce a conflicting formatter profile.

### 2.6 Security and Safety Setup

1. Restrict file operations to workspace paths only.
2. Validate feature-id and file path against traversal patterns.
3. Add write guard for malformed tables:
   - fail-safe: block write and return validation errors.

---

## 3. Functional Scope

### 3.1 In Scope

1. Parse numbered subsections under `## 🧪 Test Key Points`.
2. Parse GFM tables per subsection.
3. Graph rendering:
   - Root node: feature id and title
   - Section nodes: Test Key Points subsections
   - Case nodes: one node per table row
4. Editing:
   - Edit `Priority`, `Related Code Change`, `Test Key Points`, `Expected Results`
   - Move case between sections
5. Save:
   - deterministic markdown regeneration of target section
   - backup + write-back

### 3.2 Out of Scope (Phase 1)

1. Full Markdown/WYSIWYG editor for entire QA plan.
2. Multi-user collaborative editing.
3. Automatic sync to Confluence.
4. Full bidirectional Obsidian Canvas sync.

---

## 4. Architecture Plan

### 4.1 Data Flow

1. File Loader:
   - read markdown text from `qa_plan_final.md`
2. Parser:
   - AST parse using remark + gfm
   - extract `## 🧪 Test Key Points` subtree
3. Normalizer:
   - map table rows to internal objects with stable IDs
4. Graph Adapter:
   - convert objects to nodes/edges for React Flow
5. Editor State:
   - local in-memory edits + dirty-state tracking
6. Serializer:
   - regenerate only the target section in markdown
7. Writer:
   - backup existing file
   - patch target section
   - write file

### 4.2 Core Modules

1. `parser/testKeyPointsParser.ts`
2. `model/testKeyPointTypes.ts`
3. `graph/toGraphModel.ts`
4. `graph/fromGraphEdits.ts`
5. `markdown/sectionRewriter.ts`
6. `io/fileRepository.ts`
7. `validation/testKeyPointSchema.ts`

### 4.3 Idempotency and Determinism

1. Stable row IDs:
   - hash(`section + relatedCodeChange + testKeyPoint`) with collision suffix.
2. Stable column order in output.
3. Stable subsection order unless user explicitly reorders.
4. Writer is deterministic for equal input state.

---

## 5. OpenClaw Integration Research and Plan

Based on OpenClaw docs (`docs.openclaw.ai`) for Skills and Multi-Agent concepts:

### 5.1 Relevant OpenClaw Facts

1. Skills are loaded from:
   - `<workspace>/skills` (highest precedence)
   - `~/.openclaw/skills`
   - bundled skills
2. Skill format is `SKILL.md` with YAML frontmatter (`name`, `description`).
3. Skill gating supports `metadata.openclaw.requires` (`bins`, `env`, `config`).
4. Multi-agent deployments isolate workspaces per agent; per-agent skills live in each workspace `skills/`.

### 5.2 Integration Strategy

Use two layers:

1. App Layer (primary):
   - local SPA for interactive graph + markdown write-back.
2. OpenClaw Skill Layer (orchestration):
   - optional skill to standardize command usage and guardrails.

### 5.3 Should a New Skill Be Created?

Recommendation: **Yes**, create a dedicated skill after MVP parser/writer proves stable.

Proposed skill:
- `workspace-planner/skills/qa-test-keypoints-map/SKILL.md`

Why:
1. Reusable workflow for multiple feature folders.
2. Encapsulates strict safety checks (backup-before-write, column validation, section-only rewrite).
3. Makes behavior consistent across different OpenClaw agents/workspaces.

### 5.4 Proposed Skill Responsibilities

1. Locate `qa_plan_final.md` for supplied feature id.
2. Validate section/table format.
3. Launch app in file-specific mode (or run non-UI transform commands).
4. Enforce backup-before-write.
5. Emit artifact report:
   - source path
   - backup path
   - write timestamp
   - row count diff

### 5.5 Proposed Skill Metadata (Initial)

1. `name`: `qa-test-keypoints-map`
2. `description`: manage interactive Test Key Points visualization and safe markdown round-trip write-back.
3. `metadata.openclaw.requires.bins`:
   - `node`
4. optional `metadata.openclaw.homepage`:
   - repo doc path once available

---

## 6. Obsidian Role in This Plan

### 6.1 Where Obsidian Helps

1. Readability and note navigation of QA documents.
2. Optional Canvas brainstorming for manual mapping discussions.
3. Manual review/audit of markdown changes.

### 6.2 Where Obsidian Is Not Enough

1. No built-in deterministic, table-safe round-trip from Canvas edits to this QA markdown schema.
2. No schema-level write guards for required QA columns.
3. No built-in backup-before-write logic tied to this feature workflow.

Decision:
- Obsidian is optional companion tooling, not the canonical editor for this requirement.

---

## 7. Implementation Phases

### Phase 0: Contract and Fixtures

1. Freeze schema contract for Test Key Points tables.
2. Add 2-3 fixture markdown files:
   - valid dense plan
   - missing columns
   - malformed tables
3. Define exact error behavior for malformed input.

Deliverables:
1. schema doc
2. fixture set
3. parser acceptance test list

### Phase 1: Parser/Writer Engine (No UI Yet)

1. Implement parser for target section and tables.
2. Implement section-only rewrite with backup.
3. Add unit tests and snapshots.

Exit criteria:
1. round-trip preserves non-target sections verbatim.
2. required columns enforced.
3. deterministic output for repeated runs.

### Phase 2: Interactive SPA (MVP)

1. Render section/case graph.
2. Inline form editing for all required fields.
3. Save button with validation + diff summary.

Exit criteria:
1. end-to-end edit/save works on BCIN-6709 sample.
2. backup file created.
3. markdown passes parser re-read.

### Phase 3: OpenClaw Skill Packaging

1. Add `skills/qa-test-keypoints-map/SKILL.md`.
2. Add scripts wrapper (launch/validate/report).
3. Document usage from OpenClaw workspace.

Exit criteria:
1. skill discoverable and runnable in workspace.
2. feature-id to file-path flow validated.

### Phase 4: Hardening and Adoption

1. Large-file performance tuning.
2. additional regression fixtures from real feature plans.
3. usage notes for planner team.

---

## 8. Validation Plan

### 8.1 Functional Validation

1. Parse 100% of rows from sample `BCIN-6709`.
2. Edit and save single row updates.
3. Move row across subsections.
4. Add and delete rows.

### 8.2 Regression Validation

1. Non-target sections remain unchanged byte-for-byte.
2. Output still conforms to required table columns.
3. Existing QA review skills can still parse and validate output.

### 8.3 Failure Mode Validation

1. Missing `## 🧪 Test Key Points` section.
2. Missing required columns.
3. File lock/permission issues.
4. Invalid UTF-8 or malformed markdown edge cases.

---

## 9. Risks and Mitigations

1. Risk: Markdown table edge cases break parser.
   - Mitigation: strict fixture coverage + parser fallback diagnostics.
2. Risk: Write-back accidentally changes unrelated sections.
   - Mitigation: section-bounded rewrite and snapshot diff tests.
3. Risk: Inconsistent behavior across feature plans.
   - Mitigation: schema validator and graceful unsupported-structure errors.
4. Risk: OpenClaw skill drift from app behavior.
   - Mitigation: keep skill minimal; delegate transform logic to versioned scripts.

---

## 10. Initial Task Breakdown (Execution Backlog)

1. Create parser/writer module skeleton.
2. Add BCIN-6709 fixtures and tests.
3. Implement section extraction and table normalization.
4. Implement section rewrite + backup utility.
5. Build React Flow page with read-only nodes.
6. Add edit side panel and save flow.
7. Create skill scaffold `qa-test-keypoints-map`.
8. Add usage doc and examples for `BCIN-6709`.

---

## 11. Open Questions Requiring Your Confirmation

1. Should Phase 1 support only `Test Key Points`, or also `Risk & Mitigation` visualization from day one?
2. Do you want the first release as:
   - app-only (faster), then skill packaging, or
   - app + skill in one milestone?
3. Do you want write-back to auto-save or manual save with diff preview only?
4. Should backups be mandatory every save, or only when content changed?
