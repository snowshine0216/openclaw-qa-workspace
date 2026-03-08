should be applied to all skills in the QA plan workflow (qa-plan-write, qa-plan-synthesize, qa-plan-review, qa-plan-refactor, feature-qa-planning-orchestrator)

### Expected test plan structural 

- `## EndToEnd`
   - can be renamed
- `## Functional`
   - can be renamed 
- `## xFunction`
- `## Error handling / Special cases`
  - Library Web
  - Workstation parity 
- `## Accessibility`
   - if not applicable, add a leaf node with concise explanation
- `## i18n`
   - if not applicable, add a leaf node with concise explanation
- `## performance`
   - if not applicable, add a leaf node with concise explanation
- `## upgrade / compatability`
   - if not applicable, add a leaf node with concise explanation
- `## Embedding`
   - if not applicable, add a leaf node with concise explanation
- `## AUTO: Automation-Only Tests`
   - if not applicable, add a leaf node with concise explanation
- `## 📎 Artifacts Used`
   - if not applicable, add a leaf node with concise explanation



---

## Problem 2: Testcases were still too vague to execute

### Observed issue

Examples of vague wording that appeared in the generated draft:

- `Recover from a supported report execution or manipulation error`
- `Perform another valid editing action`
- `Observe the recovered state`
- `Verify correct recovery`
- `Matches documented branch behavior`

These phrases are not sufficiently actionable for manual QA.

### Why this is a problem

A tester cannot run these cases without guessing:
- which exact error is meant?
- what exact action should be taken?
- what exact UI element should be clicked?
- what exact visible state proves success?

Even though such phrases are not raw code vocabulary, they still fail the manual-executability bar.

### Better form

A good manual testcase should always make these explicit:

1. **Surface / location**
   - where the user is acting
   - e.g. Library Web authoring, Report Editor, prompt dialog

2. **Concrete trigger**
   - what exact error/failure branch is being exercised
   - e.g. maximum row limit exceeded, Resume Data Retrieval failure, prompt-answer apply failure

3. **Concrete user action**
   - exact UI operation
   - e.g. click `Resume Data Retrieval`, submit prompt answers, click `OK`, remove one metric from the template

4. **Observable expected result**
   - visible text, landing state, prompt restored, Data Pause Mode shown, grid not stale, etc.

### Example rewrites

#### Bad
- `Recover from a supported report execution or manipulation error`

#### Better
- `Trigger the Resume Data Retrieval failure branch after opening the report in pause mode, then complete the recovery flow`
- `Trigger a prompt-answer apply failure by submitting the known failing prompt values, then complete the recovery flow`
- `Trigger a running-mode manipulation failure while the grid is visible, then complete the recovery flow`

#### Bad
- `Perform another valid editing action`

#### Better
- `Click Resume Data Retrieval again`
- `Reopen the prompt and submit a different answer`
- `Remove one metric from the template grid`
- `Add one attribute to the report`
- `Change one report property and apply it`

#### Bad
- `Verify correct recovery`

#### Better
- `Verify the user returns to Data Pause Mode`
- `Verify the prompt dialog reopens with previous answers preserved`
- `Verify the report remains on the same authoring canvas and is not redirected to Library home`

---

## Deep analysis of relevant skills

The skills are strong on:
- evidence collection
- domain isolation
- traceability
- review/refactor loops
- code-vs-manual separation

But they are not strict enough on:
- canonical template enforcement
- manual testcase executability
- anti-vagueness rules
- concrete trigger/action/result structure

Below is a skill-by-skill analysis.

---

## 1. `feature-qa-planning-orchestrator` — needs stronger template enforcement

### Current strength
It correctly states:
- the final test cases **must** follow `templates/test-case-template.md`

### Current weakness
It does not define what “follow” means operationally.

Missing enforcement details:
- whether top-level headings are fixed
- whether all template headings must appear even if N/A
- whether feature-specific top-level headings are forbidden
- whether optional categories like performance/platform/i18n must still exist in final output

### Recommended tightening
Add a hard rule:

> The final XMind draft must preserve the canonical top-level category structure from `templates/test-case-template.md`. Feature-specific content must be nested under those headings. If a heading is not applicable, keep the heading and add `N/A — [reason]`.

Add final validation checks for:
- exact canonical top-level headings present
- no custom top-level headings except:
  - `## AUTO: Automation-Only Tests`
  - `## 📎 Artifacts Used`

---

## 2. `qa-plan-write` — needs an executability contract and less loose category forcing

### Current strengths
- requires XMind output
- tries to keep items user-observable
- separates manual vs AUTO
- enforces some surface/performance/embedding coverage

### Current weaknesses
#### A. “User-observable” is too weak
Current rule:
- every action item must be user-observable

Problem:
- something can be “user-observable” and still be too vague to execute
- e.g. `recover from a supported error` is not code-internal, but is still underspecified

#### B. Overgeneration / overly broad section forcing
Examples of weak logic:
- embedding generated too loosely from keywords like `Library`
- performance always generated whether or not the feature really supports meaningful performance scenarios

This encourages broad generic output rather than evidence-tied sections.

### Recommended tightening

#### Add an **Executability Contract**
Every manual testcase must contain:
- named surface/location
- named trigger or failure branch
- named user action on a real UI object/control
- visible expected result

#### Add a **banned vague phrasing list**
Forbid phrases like:
- supported error
- valid editing action
- expected branch
- intended behavior
- correct state
- proper recovery
- coherent result
- usable state
- follow-up action
- documented branch behavior

These must be rewritten into concrete user actions/results or converted into TODOs.

#### Add a **trigger specificity rule**
Any step that says “trigger error/failure/recovery” must specify which one from evidence, for example:
- maximum row limit exceeded
- prompt answer apply failure
- Resume Data Retrieval rebuildDocument failure
- running-mode manipulation failure
- modeling-service manipulation failure
- unsupported report type
- resource not found
- unknown/default fallback case

If exact trigger is unknown:
- emit `<!-- TODO: exact reproducible trigger not specified in evidence -->`
- do **not** leave the generic phrase in final manual text

#### Tighten section forcing
- Do not create embedding testcases just because `Library` appears in context.
- If embedding/performance/platform/i18n/accessibility are not strongly evidenced, keep the canonical template heading but mark it:
  - `N/A — not indicated by current evidence`
  - or `Risk-based extension`

---

## 3. `qa-plan-synthesize` — biggest leverage point, but currently too permissive

### Current strengths
- merge / research / deduplicate protocol is good
- priority mapping is explicit
- requires AUTO section and Artifacts Used

### Current weaknesses
#### A. Does not enforce canonical top-level structure
It says:
- “Every required template category is present”

But it never enumerates those categories, so the model is free to invent new ones.

#### B. Non-actionable detection is incomplete
Current non-actionable definition catches:
- abstract descriptions
- code-internal terminology
- vague conditionals

But it misses a major category:

### Missing category: **underspecified manual tasks**
Examples:
- supported error
- valid editing action
- intended recovery
- correct branch
- proper message
- expected state

These are not raw code terms, but they are still non-executable.

### Recommended tightening

#### Add a **Canonical Category Mapping** step
After merging domain cases, synthesis must re-bucket content into fixed top-level template categories.

Hard rule:
- No feature-specific top-level headings allowed in final output.
- Feature-specific scenario names must appear at `###` or lower.
- Non-applicable template categories must remain present with `N/A — reason`.

#### Expand the definition of non-actionable
Add this type:

> A step is non-actionable if it lacks any of: named surface, named trigger, named user action, visible expected result.

#### Add a **manual executability gate** before save
Reject or rewrite any P1/P2 scenario containing vague placeholders such as:
- supported
- valid
- proper
- intended
- correct
- coherent
- usable state
- follow-up action

unless followed immediately by concrete trigger/action/result text.

#### Add a rewrite matrix
| Weak wording | Required rewrite |
|---|---|
| trigger a supported error | trigger one named evidence-backed failure branch |
| perform another valid editing action | perform one specific editing action named in UI/domain language |
| verify correct recovery | verify exact landing state + visible controls |
| check expected message | verify exact string or explicit user-facing paraphrase |

---

## 4. `qa-plan-review` — needs stronger UE checks

### Current strengths
The current UE checks already help with:
- no internal code vocabulary
- observable expected results
- surface coverage
- embedding/performance/compatibility presence

### Current weaknesses
The checks are still not strict enough to catch vague-but-human-sounding testcase text.

### Recommended new UE checks

#### UE-11: Concrete trigger
Every P1/P2 testcase must name a reproducible trigger or failure condition.

#### UE-12: Concrete action
Every P1/P2 testcase must name a specific user action on a named UI element/object.

#### UE-13: Concrete landing state
Every recovery testcase must state where the user lands after recovery, such as:
- Data Pause Mode
- prompt dialog
- same report authoring canvas
- previous state

#### UE-14: No placeholder adjectives
Reject phrases like:
- supported error
- valid action
- intended branch
- proper message
- coherent state
unless the testcase immediately specifies what that means.

#### UE-15: Continued-editing specificity
If a testcase says “continue editing,” it must name at least one concrete follow-up action, such as:
- remove one metric
- add one attribute
- retry Resume Data Retrieval
- reopen reprompt and submit a different answer
- change one report property

### Additional review requirement
Review findings should not only say “too vague.” They should provide a concrete rewrite recommendation.

Example:
- instead of: “make this less vague”
- require: “replace `perform another valid editing action` with `remove one metric from the template grid` or `reopen prompt and submit a different answer`”

### Also add template checks in consolidated review
Add a new pre-check before X1–X5:
- top-level headings exactly match the canonical template heading set
- all template sections exist, even if N/A
- feature-specific categories are nested, not top-level

---

## 5. `qa-plan-refactor` — should aggressively rewrite vague phrasing, not preserve it

### Current strength
It is good at applying specific review findings.

### Current weakness
It only fixes what the review explicitly points out, and it lacks a built-in vagueness rewrite policy.

So vague phrases can survive unless reviewers catch each one.

### Recommended tightening
Add a mandatory rewrite policy:

| Vague phrase | Rewrite expectation |
|---|---|
| supported error | replace with named evidence-backed failure branch |
| valid editing action | replace with concrete edit operation |
| correct state | replace with visible landing state |
| intended behavior | replace with exact visible behavior |
| continue editing | replace with one named next action + expected outcome |

Fallback rule:
- If evidence does not support a concrete rewrite, replace with:
  - `<!-- TODO: concrete user action not specified in evidence -->`
- Do **not** leave vague language in the final draft.

### Also add template refactor rule
Phase 7 refactor should explicitly preserve/restore canonical top-level template headings, not only fix wording.

---

## Recommended cross-skill changes

The most effective fix is to define shared rules used across all relevant skills.

### Shared rule 1: Executability Contract
A manual testcase is valid only if it includes:
- surface/location
- concrete trigger
- concrete user action
- observable expected result

### Shared rule 2: Banned vague phrases
Ban or rewrite terms like:
- supported
- valid
- intended
- proper
- correct
- coherent
- usable state
- follow-up action
- expected branch
- documented branch behavior

### Shared rule 3: Template Contract
The final synthesized XMind draft must:
- use canonical top-level headings from the template
- keep all template sections, even if N/A
- place feature-specific content underneath those headings
- allow only:
  - `## AUTO: Automation-Only Tests`
  - `## 📎 Artifacts Used`
  as additional top-level sections

### Shared rule 4: If evidence is insufficient, use TODO or N/A
If concrete execution details are missing:
- emit TODO or N/A explicitly
- do not fill the gap with vague prose

---

## Priority order for skill refactoring

If only the most relevant skills should be tightened, the recommended order is:

1. **`qa-plan-synthesize`**
   - biggest leverage for final output quality
2. **`qa-plan-review`**
   - add hard executability + template checks
3. **`qa-plan-write`**
   - improve first-pass quality
4. **`qa-plan-refactor`**
   - force vague-phrase rewrites
5. **`feature-qa-planning-orchestrator`**
   - enforce template contract at workflow level

---

## Recommended next implementation step

The next practical step is:

1. update the relevant `SKILL.md` files with:
   - executability contract
   - banned vague phrasing list
   - canonical template contract
   - stronger UE checks
2. then rerun BCIN-6709 generation after those skills are tightened
3. confirm the new draft:
   - uses the canonical top-level template structure
   - contains no vague/manual-non-executable testcase wording

---

## Summary

The current QA-planning skill stack is strong on evidence and coverage, but too loose on final manual-test quality.

The two key issues are:
- **template structure is not enforced as a hard contract**
- **manual testcase executability is not enforced strongly enough**

As a result, the model can produce drafts that are evidence-rich but still:
- structurally non-compliant with the template
- too vague for real manual QA execution

These issues are fixable with targeted tightening in:
- `qa-plan-write`
- `qa-plan-synthesize`
- `qa-plan-review`
- `qa-plan-refactor`
- `feature-qa-planning-orchestrator`
