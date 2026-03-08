# BCIN-6709 QA Plan Skill Tightening Refactor Plan

## Summary

This document defines the implementation-ready refactor for the QA planning workflow skills so they consistently enforce two BCIN-6709-driven requirements:

1. the generated testcase tree must preserve the canonical structure, with only `EndToEnd` and `Functional` allowed to be renamed
2. manual testcases must be concrete enough for a tester to execute without guessing

This refactor updates the five workflow skills plus the supporting contract, template, validators, evals, and root planning rule.

## Files to change

### `AGENTS.md`

Add a `Plan Artifact Standard` section requiring all future plans to be detailed, implementation-ready, and decision-complete. The section must explicitly require plans to list files to change, files to create, expected content changes, and validation expectations.

### `workspace-planner/skills/qa-plan-write/SKILL.md`

Change the testcase-generation contract so the skill:
- follows the canonical testcase contract and template
- preserves all fixed headings
- allows renaming only for `EndToEnd` and `Functional`
- requires manual testcase wording to include surface, trigger, action, and expected result
- uses evidence-driven `N/A — <reason>` coverage for fixed headings that are out of scope
- validates each domain artifact before final save
- removes Figma-only top-level structure such as `## UI Testing`

### `workspace-planner/skills/qa-plan-synthesize/SKILL.md`

Change the synthesis workflow so it:
- normalizes every domain draft into the canonical heading set
- rewrites vague manual items into executable wording
- moves internal-only checks into `AUTO`
- validates structure and executability before saving the synthesized draft

### `workspace-planner/skills/qa-plan-review/SKILL.md`

Change review behavior so it:
- uses a stable finding taxonomy (`ST-*` and `EX-*`)
- reviews against the canonical contract
- includes validator output in review findings
- blocks approval on missing fixed headings or vague manual wording

### `workspace-planner/skills/qa-plan-refactor/SKILL.md`

Change refactor behavior so it:
- deterministically maps each finding code to a rewrite action
- preserves fixed headings
- prevents vague replacements
- validates the refactored draft before completing Phase 7

### `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`

Change orchestration so it:
- deploys the new validators with the existing helper scripts
- enforces validation gates in Phase 2, Phase 4, Phase 5, and Phase 7
- fails closed when structure or executability requirements are not met
- requires the final draft to satisfy the canonical testcase contract before publication

### `workspace-planner/skills/feature-qa-planning-orchestrator/reference.md`

Add a concise contract summary and phase-gate notes describing when each validator must run and how failures must be handled.

### `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md`

Replace the loose example template with a canonical scaffold that:
- uses the required heading order
- shows one manual testcase example in trigger/action/result form
- shows one `N/A — <reason>` pattern
- keeps `AUTO` and `📎 Artifacts Used` in the template

### `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/validate_context.sh`

Extend the helper so it can route structure and executability validation and still resolve latest sub-testcase artifacts.

## Files to create

### `workspace-planner/skills/feature-qa-planning-orchestrator/references/canonical-testcase-contract.md`

Create the single source of truth for:
- canonical heading order
- rename rules
- fixed-heading requirements
- `N/A — <reason>` behavior
- manual testcase executability rules
- manual vs `AUTO` placement
- bad vs good wording examples

### `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/validate_testcase_structure.sh`

Create a validator that checks:
- heading order
- illegal top-level headings
- missing fixed headings
- missing `N/A — <reason>` where a fixed section has no content

### `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/validate_testcase_executability.sh`

Create a validator that checks manual sections for:
- vague trigger wording
- vague action wording
- vague expected-result wording
- code/internal vocabulary in manual testcase text

### `workspace-planner/skills/feature-qa-planning-orchestrator/evals/evals.json`

Create eval prompts covering:
- renameable `EndToEnd` / `Functional` headings with all fixed headings retained
- out-of-scope fixed sections that must remain with `N/A — <reason>`
- recovery/error scenarios that must be rewritten from vague wording into executable manual testcases

## Expected content details by subsystem

### Structural enforcement

The workflow must preserve these top-level buckets in this exact order:
1. `EndToEnd`
2. `Functional`
3. `xFunction`
4. `Error handling / Special cases`
5. `Accessibility`
6. `i18n`
7. `performance`
8. `upgrade / compatability`
9. `Embedding`
10. `AUTO: Automation-Only Tests`
11. `📎 Artifacts Used`

Only the first two buckets may be renamed. All others are fixed.

### Executability enforcement

Every manual testcase must make four things explicit:
- surface / location
- concrete trigger
- concrete user action
- observable expected result

The workflow must block phrases such as:
- `Recover from a supported report execution or manipulation error`
- `Perform another valid editing action`
- `Observe the recovered state`
- `Verify correct recovery`
- `Matches documented branch behavior`

### Evidence-driven applicability

The refactor must keep fixed headings even when they are not in scope. In those cases the output must contain `N/A — <reason>` instead of deleting the heading.

## Validation and rollout

### Local validation

Run focused tests for:
- testcase structure rule parsing
- testcase executability rule parsing
- `validate_context.sh` routing to the new validators

### Skill-quality validation

Use the `skill-creator` workflow for this refactor:
- create eval prompts
- compare with-skill vs baseline behavior
- confirm the tightened skills preserve the canonical structure
- confirm vague manual cases are rewritten or moved to `AUTO`

## Acceptance criteria

The refactor is complete when:
- every updated skill points to the same canonical testcase contract
- the orchestrator deploys and uses the new validators
- missing fixed headings block progression
- vague manual wording blocks progression
- the Figma handler no longer creates a separate top-level structure
- the root `AGENTS.md` now requires implementation-ready, decision-complete plans
