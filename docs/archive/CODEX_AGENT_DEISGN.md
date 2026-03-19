 # Enhance openclaw-agent-designer to Enforce Test-Driven, Evaluatable Designs

  ## Summary

  Upgrade the OpenClaw design flow so openclaw-agent-designer always produces test-driven, reviewer-evaluable design outputs with deterministic gates.

  This revised plan incorporates your requested changes:

  1. Default design path: workspace-<agent-name>/projects/docs/<design-id>/ if user does not provide one.
  2. Mandatory double confirmation before using default path.
  3. Mandatory Mermaid architecture chart in design output.
  4. Mandatory iterative loop: designer draft -> reviewer findings -> designer revision -> reviewer re-check until pass or pass_with_advisories.

  Current loop status from planning reviews:

  1. Iteration 1 reviewer: fail (path determinism + missing deterministic gate/state/test/doc details).
  2. Iteration 2 reviewer: pass_with_advisories (only non-blocking evidence-path specificity).
  3. This plan includes the advisory fix by defining explicit evidence artifact paths.

  ## Scope

  In scope:

  1. Contract/spec updates for designer and reviewer specialists.
  2. Deterministic path resolver behavior.
  3. Deterministic gate model and state schema.
  4. Reviewer/verifier checks for Mermaid + loop + path confirmation.
  5. Documentation contract updates in root AGENTS.md and README.md.

  Out of scope:

  1. Implementing generated business workflows designed by the designer.
  2. Adding CI provider-specific workflows (local verifier remains canonical entrypoint).

  ## File Changes (Decision-Complete)

  1. Update .codex/agents/openclaw-agent-designer.toml.
  2. Update .cursor/skills/openclaw-agent-design/SKILL.md.
  3. Update .cursor/skills/openclaw-agent-design/reference.md.
  4. Update .codex/agents/openclaw-agent-design-reviewer.toml.
  5. Update .cursor/agents/openclaw-agent-design-reviewer.md.
  6. Update .cursor/skills/openclaw-agent-design-review/SKILL.md.
  7. Update .cursor/skills/openclaw-agent-design-review/reference.md.
  8. Update .cursor/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh.
  9. Add verifier helper scripts:
     verify_required_sections.sh,
     validate_design_path_resolution.sh,
     run_design_verifier.sh.
  10. Update root orchestration/handoff docs in AGENTS.md and README.md.

  ## Public Interface/Contract Changes

  ### A) Default Path Resolver Contract

  When user does not provide output path, resolve with:

  1. workspace-<agent-name>/projects/docs/<design-id>/ by mapping table.
  2. If mapped workspace path does not exist, fallback to projects/agent-design/<design-id>/.
  3. Persist only resolved concrete path, never placeholders.

  Resolver mapping table (v1):

  1. planner-agent -> workspace-planner
  2. tester-agent -> workspace-tester
  3. reporter-agent -> workspace-reporter
  4. healer-agent -> workspace-healer
  5. main-agent -> workspace
  3. Any unclear-> confirm with user


  Abort behavior:

  1. If either confirmation is not explicit approval, stop and request user-provided path.
  2. No artifacts are written before both confirmations pass.

  ### C) Required Design Artifact Bundle

  Under resolved output directory:

  1. design_spec.md
  2. task.json
  3. run.json

  Required design_spec.md sections:

  1. ## Artifact Path Decision
  2. ## Orchestration Contract (Iterative Loop)
  3. ## Deterministic Gate Rules
  4. ## Mermaid Architecture
  5. ## Documentation Impact
  6. ## Reviewer Handoff

  ### D) Mermaid Requirement

  design_spec.md must include a fenced Mermaid block under ## Mermaid Architecture.

  Required minimum chart template:

  flowchart TD
    U[User] --> D[openclaw-agent-designer]
    D --> R[openclaw-agent-design-reviewer]
    R -->|overall_status=fail| D
    R -->|overall_status=pass/pass_with_advisories| F[Finalize Design]
    D --> P[Path Resolver + Double Confirmation]
    D --> S[Design Spec + task.json/run.json]

  ## Deterministic Gate Model

  Define and enforce DG-01..DG-06 as hard rules.

  | gate_id | check_expression | evidence_path | severity | on_fail_action | blocking |
  |---|---|---|---|---|---|
  | DG-01 | if user_path_missing => resolved path must be concrete and resolvable via mapping/fallback | design_spec.md + run.json.path_resolution | P0 | fail review | yes |
  | DG-02 | default path requires both explicit confirmations approved | run.json.path_resolution.default_confirmation_1/2 | P1 | fail review | yes |
  | DG-03 | required artifact bundle exists | filesystem check at resolved path | P1 | fail review | yes |
  | DG-04 | Mermaid section + fenced mermaid block present | design_spec.md section scan | P1 | fail review | yes |
  | DG-05 | iterative loop text explicitly present (draft->review->revise->re-check) | design_spec.md loop section | P1 | fail review | yes |
  | DG-06 | latest reviewer status fail must block finalization/notification | task.json.review_cycle.latest_status + lifecycle checks | P0 | fail review | yes |

  Pass condition:

  1. All DG checks pass.
  2. No P0/P1 findings in reviewer report.

  ## State Schema and Write Timing

  ### task.json required fields

  1. current_phase
  2. overall_status
  3. path_resolution:
     path_source, resolved_output_path, default_confirmation_1, default_confirmation_2
  4. review_cycle:
     cycle_index, current_stage, latest_status, updated_at

  ### run.json required fields

  1. path_resolution_log[] with timestamped decisions.
  2. review_cycle_log[] entries:
     cycle_index, reviewer_status, finding_ids, required_fixes, resolved_fix_ids, report_md, report_json, timestamp_utc.

  Write timing:

  1. After path decision and each confirmation response.
  2. After draft creation.
  3. After each reviewer return.
  4. After each revision cycle.
  5. Before finalization gate check.

  Ownership:

  1. Designer writes draft-state and revision-state fields.
  2. Reviewer writes/returns findings; designer records them into logs.

  ## Iterative Orchestration Contract

  Flow must be explicit and enforced in both specialist contracts and root AGENTS.md:

  1. Designer drafts/updates design artifacts.
  2. Reviewer returns structured findings + report paths.
  3. If reviewer fail, designer must revise all required_fixes.
  4. Reviewer re-checks revised artifacts.
  5. Repeat 3-4 until pass or pass_with_advisories.
  6. Finalization only after step 5.

  ## Verifier Strategy

  Canonical verifier command:
  bash .cursor/skills/openclaw-agent-design-review/scripts/run_design_verifier.sh <design-id>

  Verifier order:

  1. Resolve path decision correctness.
  2. Validate required sections.
  3. Validate iterative loop language.
  4. Validate Mermaid block presence.
  5. Validate confirmation evidence.
  6. Validate gate-state consistency in task.json/run.json.
  7. Emit reviewer report artifacts.

  Reviewer output artifacts:

  1. projects/agent-design-review/<design-id>/iter-<NN>/design_review_report.md
  2. projects/agent-design-review/<design-id>/iter-<NN>/design_review_report.json

  ## Test Cases and Scenarios

  ### A) Path Resolution + Confirmation

  1. User provides path -> no default flow.
  2. User omits path and mapped workspace exists -> default path proposed, double-confirm required.
  3. User omits path and mapped workspace missing -> fallback path proposed, double-confirm required.
  4. User declines confirmation #1 -> abort and request explicit path.
  5. User passes #1 but declines #2 -> abort with no writes.

  ### B) Loop Enforcement

  1. First review pass -> finalize allowed.
  2. First review fail, second pass_with_advisories -> finalize allowed only after re-check.
  3. Any fail status + attempted finalize -> DG-06 block.

  ### C) Mermaid and Spec Contract

  1. Missing ## Mermaid Architecture -> DG-04 fail.
  2. Mermaid heading exists but no fenced block -> DG-04 fail.
  3. Full required sections present -> section gate pass.

  ### D) Evidence Artifact Paths (advisory fully resolved)

  Per scenario evidence files:

  1. Happy path: projects/agent-design-review/<design-id>/evidence/happy_path.log
  2. Fail->pass loop: projects/agent-design-review/<design-id>/evidence/fail_then_pass.log
  3. Gate-fail block: projects/agent-design-review/<design-id>/evidence/gate_fail_block.log
  4. Path-omit resolver: projects/agent-design-review/<design-id>/evidence/path_resolver.log

  Verifier must assert each expected evidence file exists for its scenario.

  ## Documentation Updates

  1. Root AGENTS.md:
     update OpenClaw design orchestration to explicit iterative loop and require path decision metadata in handoff.
  2. Root README.md:
     document default path behavior, double-confirm gate, Mermaid requirement, and iterative review flow.
  3. Skill docs:
     align designer/reviewer skills with deterministic DG gates and schema-backed checks.

  ## Rollout

  Two-phase rollout (selected):

  1. Phase 1 Advisory: March 3, 2026 -> March 10, 2026.
  2. Phase 2 Hard Gate: starts March 11, 2026.

  Phase 1 behavior:

  1. Missing new fields reported as advisories where safe.
  2. Emit “would fail under hard gate” indicators.

  Phase 2 behavior:

  1. DG-01..DG-06 enforced as blocking.
  2. Any P0/P1 -> overall_status=fail.

  ## Assumptions and Defaults

  1. Plan mode only in this turn; no file mutations performed.
  2. Default resolver uses explicit map + fallback, as selected.
  3. Placeholder tokens like <agent-name> or <design-id> are allowed only in docs/spec templates, never in persisted runtime path values.
  4. Existing repo structure remains unchanged; no new workspace-* directories are auto-created by default.



› 1. enahnce the designer while deising openclaw agent, 1. in agnet workflow, for each pahse, it must interacts with user about what's done, what's blocked, raise quetionsm never assume it knows everything 2. in agent workflow, it should
  alwaos add in the last steps about feishu notificaiton. like
  Actions:

  1. Write execution summary.
  2. Set final state.
  3. Send Feishu notification.
  4. On send failure, set `run.json.notification_pending=<full payload>`.

  Verification:

  ```bash
  jq -r '.notification_pending // empty' memory/tester-flow/runs/<work_item_key>/run.json
  ```

  ---  and current plan seems missing something which documented in v1 like evaluation etc. can you preserve the current version only enhance the things that i ask you to add?


• Proposed Plan


  # Targeted v1-Preserving Enhancement for openclaw-agent-designer

  ## Summary

  Keep the current planned v1 contract intact (including test-driven design, evaluation/evaluability, reviewer loop, deterministic gates, path resolver, and Mermaid requirement), and add only the two new requirements you requested:

  1. In workflow design, each phase must include explicit user interaction:
      - what’s done
      - what’s blocked
      - open questions
      - explicit anti-assumption behavior (“never assume complete context”)
  2. In workflow design, final steps must always include Feishu notification + failure fallback with run.json.notification_pending.

  No existing v1 evaluation/test contracts are removed or weakened.

  ## What Stays Unchanged (Preserved v1)

  These remain exactly as-is from the current plan:

  1. Path resolver contract with mapping-table + fallback.
  2. Double-confirmation default-path gate.
  3. Mandatory Mermaid architecture chart.
  4. Designer -> reviewer -> revise -> re-review loop until pass or pass_with_advisories.
  5. Deterministic DG gates and blocking behavior.
  6. Test-driven design/evaluation requirements and evidence artifacts.
  7. task.json/run.json lifecycle tracking model.

  ## New Additions Only

  ### A) Phase Interaction Requirement (New Mandatory Contract)

  Add to designer contract and skill:

  For every workflow phase in design_spec.md, require a “User Interaction” block with this exact structure:

  1. Done: concise status of completed work.
  2. Blocked: explicit blockers/dependencies.
  3. Questions: unresolved questions requiring user input.
  4. Assumptions: must be empty by default; if non-empty, must be explicitly confirmed by user before phase continues.

  Required rule text:

  - “Never assume full context. If information is missing or ambiguous, stop and ask user questions before proceeding.”

  ### B) Final Feishu Step Requirement (New Mandatory Contract)

  Add to workflow-finalization template in designer skill:

  At the end of every designed workflow, include this exact section (or semantically equivalent with same operations):

  Actions:

  1. Write execution summary.
  2. Set final state.
  3. Send Feishu notification.
  4. On send failure, set run.json.notification_pending=<full payload>.

  Verification command (must be present verbatim in design output):

  jq -r '.notification_pending // empty' memory/tester-flow/runs/<work_item_key>/run.json

  ## Exact File Deltas (Only Incremental)

  Update only the following files with additive changes:

  1. .codex/agents/openclaw-agent-designer.toml
  2. .cursor/skills/openclaw-agent-design/SKILL.md
  3. .cursor/skills/openclaw-agent-design/reference.md
  4. .cursor/agents/openclaw-agent-design-reviewer.md
  5. .cursor/skills/openclaw-agent-design-review/SKILL.md
  6. .cursor/skills/openclaw-agent-design-review/reference.md
  7. .cursor/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh
  8. AGENTS.md (handoff wording only if needed)

  No schema removals, no gate removals, no rollback of v1 evaluation logic.

  ## Additional Reviewer Checks (Incremental)

  Add these checks to reviewer rubric:

  1. PHASE-UX-001 (P1):
      - Each phase includes Done/Blocked/Questions/Assumptions interaction block.
  2. PHASE-UX-002 (P1):
      - Phase text explicitly says missing info requires user question, not assumption.
  3. NOTIFY-001 (P1):
      - Final workflow steps include Feishu send + failure fallback to run.json.notification_pending.
  4. NOTIFY-002 (P1):
      - Verification command for notification_pending is present.

  ## Minimal Public Interface Additions

  ### design_spec.md required sections (additive)

  Keep existing required sections; add:

  1. ## Phase Interaction Contract
  2. ## Final Notification Contract

  ### Per-phase template (required)

  For each phase:

  1. Objective
  2. Actions
  3. User Interaction
  4. Verification

  ## Test and Evaluation Scenarios (Additive Only)

  Keep all existing v1 scenarios and add:

  1. Phase interaction completeness test:
      - Fail if any phase misses Done/Blocked/Questions/Assumptions.
  2. Anti-assumption behavior test:
      - Fail if phase contains unresolved ambiguity with no question.
  3. Notification fallback test:
      - Simulate Feishu send failure and verify run.json.notification_pending is populated.
  4. Notification verification command test:
      - Ensure command returns payload when pending exists.

  ## Assumptions and Defaults

  1. This is a strict enhancement-only revision of current v1 plan, not a redesign.
  2. Existing evaluation/test contracts remain authoritative.
  3. New checks are additive and blocking at P1, consistent with current reviewer policy.

