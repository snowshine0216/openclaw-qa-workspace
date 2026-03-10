## Summary

  Keep the current 4-step workflow unchanged:

  1. spin up subagents for context gathering
  2. spin up 1 subagent to write the QA plan section by section, reading all artifacts and
     doing background research when helpful
  3. spin up 1 subagent to review the plan section by section
  4. spin up 1 subagent to refactor the plan deterministically from review findings

  The problem is not workflow order. The problem is that the writer/reviewer/refactor
  skills do not yet enforce a rich enough section-by-section coverage method. They allow
  over-compression, and they do not systematically check important planning areas like
  boundary conditions, input validation, privilege/role impact, compatibility, or other
  risk-based considerations.

  The fix is to:

  - keep section names flexible at the top level,
  - require section-by-section drafting and review,
  - add concise coverage checkpoints per section,
  - make review fail not only on missing structure, but also on missed important
    consideration areas.

  ## Revised Section Model

  ### 1. Section names should stay flexible

  The plan should not force one rigid top-level outline for every feature.

  Instead:

  - E2E is optional and replaceable.
  - Functional is required as a semantic area, but it may be split into multiple functional
    sub-areas when that improves clarity.
  - If the feature is not naturally end-to-end, E2E can be omitted and replaced by a more
    suitable top-level area.
  - If the feature is mostly error handling, recovery logic, permissions, configuration, or
    infrastructure-facing behavior, the plan should prefer those meaningful sections
    instead of inventing weak E2E.

  Examples of acceptable top-level section patterns:

  - Functional - Pause Mode, Functional - Running Mode, Functional - Prompt Flow
  - Error Handling
  - Recovery Behavior
  - Privilege / Permission
  - Configuration / Validation
  - UI - Messaging
  - Compatibility
  - Accessibility

  Rule: top-level sections must be semantically clear and feature-fit, not mechanically
  uniform.

  ### 2. Section flexibility must not reduce coverage

  Even with flexible section names:

  - the plan must still cover the important behavior areas,
  - the writer must explicitly decide which section owns each behavior family,
  - the reviewer must check that no critical area vanished because it was not given its own
    heading.

  So the contract should move from:

  - “always use these exact headings”

  to:

  - “always cover these behavior domains, but organize them in the clearest feature-fit
    section structure.”

  ## Why It Happens

  ### 1. The writer is still using a structure-first shortcut instead of a coverage-first
  method

  The current skill behavior tends to:

  - decide headings early,
  - compress evidence into a few broad scenarios,
  - then draft concise sections.

  That causes important behavior clusters to disappear, especially when they are not
  obvious “main flows,” such as:

  - boundary cases,
  - invalid / extreme inputs,
  - permission/privilege differences,
  - retry / recovery behavior,
  - compatibility / upgrade effects,
  - empty state / stale state handling,
  - fallback paths.

  ### 2. Important risk areas are not systematically checked during section drafting

  Right now, the writer is told to use artifacts and write clear scenarios, but there is no
  concise checklist forcing the writer to ask, per section:

  - are there boundary conditions?
  - are there invalid inputs?
  - are there role differences?
  - are there state transitions?
  - are there workflow interruptions?
  - are there fallback / error variations?
  - are there dependencies or non-obvious assumptions?

  That makes omissions likely even when the evidence exists.

  ### 3. The reviewer is validating quality, but not enough against omission-prone
  checkpoints

  The current review approach is good at:

  - spotting vague wording,
  - spotting bad structure,
  - spotting obviously missing branches.

  But it does not yet consistently ask, per section:

  - did we miss boundary tests?
  - did we miss validation behavior?
  - did we miss privilege/role impact?
  - did we miss state carryover?
  - did we miss interruption/cancel/retry variants?
  - did we miss surface-specific behavior?

  So structurally good drafts can still be incomplete in practice.

  ### 4. The refactor stage is not yet designed to repair “coverage holes by checkpoint”

  Refactor currently works well on explicit findings, but not enough on hidden omissions.
  It should be able to repair sections based on “checkpoint failures,” not just classic
  wording/structure defects.

  ## Fix Plan

  ### A. Keep orchestration unchanged, but strengthen the contracts inside writer/reviewer/
  refactor

  No change to:

  - context-gathering topology,
  - single writer subagent,
  - single reviewer subagent,
  - single refactor subagent.

  Enhance:

  - workspace-planner/skills/qa-plan-write/SKILL.md
  - workspace-planner/skills/qa-plan-review/SKILL.md
  - workspace-planner/skills/qa-plan-refactor/SKILL.md

  Support changes in:

  - workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md
  - workspace-planner/skills/feature-qa-planning-orchestrator/templates/qa-plan-template.md
  - workspace-planner/skills/feature-qa-planning-orchestrator/references/canonical-
    testcase-contract.md

  ### B. Redefine the canonical contract around “coverage domains” instead of fixed section
  names

  The canonical contract should define a required coverage model, not a fixed heading list.

  Required coverage domains to consider for every feature:

  - primary functional behavior
  - error handling / recovery
  - state transition / continuity
  - user-visible messaging or status
  - cross-flow / multi-step interactions
  - compatibility / scope guard
  - nonfunctional considerations when relevant

  Optional but always-considered domains:

  - boundary conditions
  - input validation
  - privilege / role / entitlement
  - empty / null / stale / partial data states
  - interruption / cancel / retry
  - configuration variations
  - platform / browser / environment differences
  - accessibility
  - i18n
  - performance
  - embedding / integration

  Important rule:

  - these are consideration checkpoints, not mandatory sections.
  - if a checkpoint is irrelevant, the writer should consciously mark it as not applicable
    in planning logic.
  - if relevant, it must appear in some section.

  ### C. Add a mandatory section-by-section writing workflow

  Revise qa-plan-write so the writer must work section by section using this internal
  method:

  Step 1 — Decide the best section structure for this feature

  - Choose section names that fit the feature.
  - Decide whether E2E is meaningful or should be omitted/replaced.
  - Decide how Functional should be split into feature-relevant functional areas.

  Step 2 — Build a coverage ledger for each section
  For each planned section, capture:

  - behaviors covered,
  - supporting artifacts,
  - scenario families,
  - risk/checkpoint areas considered,
  - gaps or TODOs.

  Step 3 — Run concise checkpoints before drafting the section
  For each section, ask:

  - Is there a happy-path or primary behavior here?
  - Are there alternate branches?
  - Are there boundary conditions?
  - Are there invalid or extreme inputs?
  - Are there permission/privilege differences?
  - Are there empty/stale/partial states?
  - Are there cancel/retry/re-entry flows?
  - Are there copy/message/status expectations?
  - Are there compatibility or environment differences?
  - Are there nonfunctional considerations worth preserving?

  Step 4 — Draft the section only after all relevant artifacts were checked
  This prevents drafting from memory or summary-first compression.

  ### D. Add concise “coverage checkpoints” for each section type

  The writer and reviewer should both use checkpoint prompts like these.

  E2E or replacement section

  - Does a real user journey exist?
  - Is the whole journey worth testing end to end?
  - Are there interruptions, retries, or resumptions?
  - If no meaningful E2E exists, is there a better top-level replacement section?

  Functional sections

  - Are the main operations split into the right functional areas?
  - Are core branches separated rather than merged?
  - Are boundary conditions considered?
  - Are invalid inputs or unsupported combinations considered?
  - Are state changes before/after the action covered?

  Error handling / recovery sections

  - Are distinct error families separated?
  - Are user-visible recovery expectations explicit?
  - Are retry / continue / back / dismiss paths covered?
  - Are stale, partial, or broken-state risks covered?
  - Are follow-up actions after recovery covered?

  Prompt / form / validation-heavy sections

  - Are valid vs invalid inputs distinguished?
  - Are field-level, submission-level, and post-submit failures considered?
  - Are previously entered values preserved when expected?
  - Are nested or repeated entry flows considered?

  Messaging / UI sections

  - Are title, body, affordance, CTA, and absence of wrong actions checked?
  - Are different surfaces or products kept distinct?
  - Are fallback/default copy behaviors considered?

  Privilege / permission-sensitive areas

  - Are different user roles or entitlements relevant?
  - Are read-only / blocked / hidden / degraded states covered?
  - Are unsupported actions denied clearly and safely?

  Compatibility / scope-guard sections

  - Is out-of-scope behavior explicitly protected?
  - Are old flows or unaffected flows checked for non-regression?
  - Are version, environment, or platform differences relevant?

  Accessibility / i18n / performance / embedding

  - Even when thin, are they consciously considered?
  - If in scope, is there at least one concrete validation angle?
  - If out of scope, is that omission intentional and reviewable?

  ### E. Make qa-plan-review explicitly section-by-section and checkpoint-based

  Revise the review skill so it must review every section against:

  - section purpose,
  - expected scenario families,
  - applicable checkpoints,
  - omissions caused by over-compression.

  The reviewer must answer for each section:

  - Is this the right section for this behavior?
  - Is the section too broad or too fragmented?
  - Which scenario families should exist based on the artifacts?
  - Which checkpoints were considered?
  - Which checkpoints were missed but relevant?
  - Did the draft merge cases that should stay separate?

  New review finding categories should include:

  - missing relevant checkpoint in a section,
  - boundary/validation/privilege omission,
  - section structured correctly but under-covered,
  - wrong section ownership for a behavior,
  - nonfunctional consideration skipped without explicit reasoning.

  ### F. Make qa-plan-refactor able to repair sections using checkpoint findings

  Refactor should not just polish wording. It should repair section completeness.

  New deterministic refactor actions:

  - add missing scenario family to an existing section,
  - split one broad section into two clearer sections,
  - move coverage to a better-owned section,
  - add boundary / validation / privilege / compatibility cases,
  - add concise placeholder coverage for low-signal but relevant domains,
  - preserve omission notes only when genuinely unsupported by evidence.

  The refactor stage should apply fixes section by section and then re-check the same
  ### G. Enhance the template to guide richer planning without forcing rigid headings
  Update the template to:

  - show a flexible heading model,
  - explain when E2E may be omitted,
  - explain how Functional may be split,
  - include per-section drafting notes,
  - include a short “coverage checkpoints considered” comment pattern for internal use,
  - show that nonfunctional areas may be brief but should still be considered.

  The template should guide the writer toward:

  - clear structure,
  - explicit coverage,
  - concise detail,
  - fewer silent omissions.

  ### H. Add BCIN-6709-style regression checks focused on omission prevention

  Use BCIN-6709 as the fixture for testing skill behavior.

  Regression checks should validate:

  - section names are allowed to vary, but semantic coverage remains complete,
  - writer can produce split functional sections,
  - reviewer catches missing boundary / validation / privilege considerations when
    relevant,
  - reviewer catches overly compressed recovery sections,
  - refactor restores missing coverage by section,
  - output remains concise while preserving feature-fit completeness.

  ## Test Plan

  - Verify a feature with no meaningful user journey can omit E2E and still pass review
    with a better replacement section.
  - Verify a feature with several major behaviors can split Functional into multiple
    functional areas and still pass.
  - Verify reviewer fails a draft that covers main flow but omits relevant boundary
    conditions.
  - Verify reviewer fails a draft that misses input validation behavior where prompts/forms
    are involved.
  - Verify reviewer fails a draft that misses role/privilege impact when permissions
    matter.
  - Verify reviewer fails a structurally clean but over-compressed error-handling section.
  - Verify refactor can restore omitted checkpoint coverage without making the plan
    bloated.
  - Verify BCIN-6709-style outputs preserve distinct recovery, messaging, compatibility,
    and placeholder coverage appropriately.

  ## Assumptions and Defaults

  - E2E is optional and may be replaced when the feature does not have a meaningful end-to-
    end journey.
  - Functional is a semantic planning area, not a single mandatory heading; it may be split
    into multiple functional sections.
  - Boundary tests, input validation, privilege, and similar areas are not mandatory
    sections, but they are mandatory consideration checkpoints during writing and review.
  - The desired output remains concise, but not at the cost of omitting important risk
    areas.
  - The goal is to make future plans harder to under-cover, while still keeping the
    workflow flexible and reusable.


 
  Implement this plan?
 
› 1. Yes, implement this plan  Switch to Default and start coding.
  2. No, stay in Plan mode     Continue planning with the model.
 
  Press enter to confirm or esc to go back                                                   