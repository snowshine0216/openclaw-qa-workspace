 - [P1] Define the review artifact path consumed by qa-plan-refactor — /Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-
    refactor/SKILL.md:13-14
    Phase 4 now hard-codes context/review_qa_plan_<id>.md as a required input, but qa-plan-review no longer tells the reviewer to save under that path (or any
    path at all). In the automated workflow this makes the review→refactor handoff non-deterministic: unless a human happens to pick the same filename, qa-plan-
    refactor cannot locate its required input and the workflow stops at Phase 4.
  - [P2] Keep a real scaffold at test-case-template.md for compatibility — /Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/
    feature-qa-planning-orchestrator/templates/test-case-template.md:1-5
    This file is now only a pointer, but unchanged callers such as workspace-planner/skills/qa-plan-synthesize/SKILL.md still load templates/test-case-
    template.md as the canonical template. In any remaining synthesis/legacy flow, that means the agent sees no section scaffold at all and can no longer
    generate a structured draft. If this path is meant to stay compatible, it needs to keep the scaffold content until all consumers are migrated in the same
    patch.
  - [P2] Reject generic "when an error occurs" / "after recovery" wording — /Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/
    feature-qa-planning-orchestrator/scripts/lib/validate_testcase_executability.sh:32-34
    The executability gate no longer flags phrases like when an error occurs and after recovery, so a testcase such as - When an error occurs, click OK / - After
    recovery, verify the user can continue now passes validation even though the tester still has to guess the trigger and expected state. That regresses the
    contract that manual cases must spell out concrete trigger/action/result, so these patterns still need to be blocked.