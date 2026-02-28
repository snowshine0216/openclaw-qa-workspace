# Test Case Generation Design (Planner Agent)

## Overview

This document outlines the architecture, logic, and workflows for the Planner Agent's test case generation capabilities. As specified in the `TESTER_AUTOMATION_DESIGN.md`, the Planner Agent operates as the "Test Generator". Its responsibility is to systematically generate detailed, **Playwright-compatible** test cases in Markdown (`.md`) format for the Tester Agent to consume. The output must enable the Tester Agent to:

1. **Create scripts** — Translate `.md` specs into executable `tests/specs/**/*.spec.ts` via Playwright Generator.
2. **Enable auto-healing** — Use semantic step phrasing so the Healer can map failing locators to `playwright-cli snapshot` output and update POMs without manual intervention.

This design supports two primary operational scenarios based on the availability of a pre-existing QA Plan.

---

## Clawddocs Integration (Required)

The Planner Agent **MUST** leverage the `clawddocs` skill during QA planning and test case generation:

| Phase | When | What to Fetch |
|-------|------|---------------|
| **QA Plan** | Before drafting the plan | Application docs, API references, config snippets, version constraints |
| **Test Case Gen** | Before writing steps | UI flows, feature docs, accessibility/role expectations, documented selectors |
| **Context Enrichment** | When steps are ambiguous | `./scripts/search.sh <keyword>`, `./scripts/fetch-doc.sh <path>` |

**Rules:**
- Use clawddocs for Clawdbot/OpenClaw configuration when generating automation-related plans.
- For **project-under-test** context (e.g., MicroStrategy, custom app), use workspace docs under `projects/<project>/docs/` or referenced API specs.
- Apply [docs-organization-governance](.cursor/skills/docs-organization-governance/SKILL.md) when creating or placing new test-plan docs.
- Cite source URLs when deriving test scenarios from documentation.

---

## Playwright-Compatible Markdown Schema

Generated test cases MUST conform to the **Playwright Test Agents** spec format so the Generator and Healer can reuse them reliably. See [Playwright Test Agents](https://playwright.dev/docs/test-agents).

### Required Structure

```markdown
# [Application/Feature] — [Scenario Name] Test Plan

**Seed:** `tests/seed.spec.ts`

## Application Overview
[Brief description of scope and key behaviors]

## Test Scenarios

### N. [Scenario Label]

**Steps:**
1. [Semantic action — see rules below]
2. ...
3. ...

**Expected Results:**
- [Measurable outcome 1]
- [Measurable outcome 2]
```

### Semantic Step Phrasing (Critical for Auto-Healing)

Steps MUST be written in **role/label/text** terms so that:

- The Generator maps them to `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`.
- The Healer can correlate with `playwright-cli snapshot` output (e.g. `e1 [button "Undo"]`, `e2 [textbox "Email"]`).

| Do | Don't |
|----|-------|
| Click the "Submit" button | Click #submit-btn |
| Type "user@test.com" in the Email field | Enter email in input |
| Select "Q1 2024" from the Date filter dropdown | Use the date picker |
| Check the "Remember me" checkbox | Check remember |
| Verify the heading "Success" is visible | Verify success message |

**Action verbs:** Use `Click`, `Type`, `Fill`, `Select`, `Check`, `Uncheck`, `Press`, `Hover`, `Drag`, `Verify`, `Wait for`.

---

## Auto-Healing Compatibility

To support the Healer agent (`playwright-healer` / `test-healer.md`):

1. **Locator-friendly steps** — Every interactive element must be identifiable by role, label, or visible text. Avoid step numbers, IDs, or CSS classes in the spec.
2. **Explicit assertions** — Each scenario must have **Expected Results** that map to Playwright assertions (`toBeVisible`, `toHaveText`, `toHaveValue`, etc.).
3. **Seed reference** — Every spec MUST include `**Seed:** \`tests/seed.spec.ts\`` so the Healer can bootstrap the same authenticated context.
4. **One scenario per file** (optional but preferred) — Smaller specs reduce healing scope and improve traceability.

---

## Scenario 1: Generating Test Cases from an Existing QA Plan

**Trigger**: A validated QA Plan already exists for a target feature (e.g., in `projects/testcase-plan/<feature-id>/` or `specs/<feature>/`).

### Workflow Steps

1. **Clawddocs Lookup (Mandatory):**
   - Run `./scripts/search.sh <feature-keyword>` or fetch relevant project docs.
   - Resolve ambiguities in the QA plan using documented flows and config.

2. **Pre-requisite Confirmation (Interactive Step):**
   Before generating test steps, the Planner Agent MUST pause and confirm with the user:
   - **Test Objects:** Pages, components, or user flows to test.
   - **User Information:** Accounts, credentials, roles.
   - **Environment Data:** Target URL (staging/production), config flags.
   - **Mock Data:** API mocks, seeds, stubs for idempotent runs.

3. **Context Discovery (Optional):**
   If the QA plan lacks UI context, browse the target site with browser tools to verify navigation paths and element roles/labels.

4. **Markdown Generation:**
   Using the `test-case-generator` skill, synthesize step-by-step test instructions:
   - **Format:** Strictly Playwright-compatible Markdown per the schema above.
   - **Output:** `specs/<feature>/<scenario>.md` or `projects/testcase-plan/<feature-id>/<scenario>.md`.
   - Ensure semantic phrasing and explicit Expected Results for Healer compatibility.

---

## Scenario 2: End-to-End QA Plan & Test Case Generation

**Trigger**: User provides a target URL and mission (e.g., "Verify the complete user checkout flow"), but no QA Plan exists.

### Workflow Steps

1. **QA Plan Creation (`qa-plan` workflow):**
   - **Clawddocs:** Fetch contextual docs, API references, version info, and config snippets.
   - Analyze the site (via browser tools) and mission to draft the QA plan.

2. **Plan Finalization:**
   Save the QA plan to the workspace and present for readiness.

3. **Transition to Test Case Generation:**
   Proceed as in **Scenario 1**: confirm test objects/users/env/mocks, then generate Playwright-compatible Markdown specs.

---

## Output Paths & Conventions

| Context | Canonical Path | Alternative |
|---------|----------------|-------------|
| Library automation project | `projects/library-automation/specs/<feature>/<scenario>.md` | — |
| Feature-plan projects | `projects/testcase-plan/<feature-id>/<scenario>.md` | `specs/<feature-id>/<scenario>.md` |
| New Playwright project | `specs/<feature>/<scenario>.md` (at project root) | — |

- Align with [docs-organization-governance](.cursor/skills/docs-organization-governance/SKILL.md) when creating new doc locations.
- Ensure generated files are discoverable by the Tester Agent per `TESTER_AGENT_DESIGN.md`.

---

## Required Skill Updates

1. **`test-case-generator` Skill Update:**
   - Output **Markdown (`.md`) only** — deprecate JSON for test plans.
   - Enforce the Playwright-compatible schema and semantic step phrasing.
   - Include mandatory `**Seed:** \`tests/seed.spec.ts\`` in every spec.
   - Add a mandatory step to prompt for Environment, Mock, and User context before generating `.md`.

2. **`qa-plan` Workflow / Skill Integration:**
   - Add an explicit `clawddocs` lookup step in the early phases of QA planning.

---

## Example Spec (Playwright-Compatible)

```markdown
# User Login — Valid Credentials Test Plan

**Seed:** `tests/seed.spec.ts`

## Application Overview
Login flow with email, password, and optional Remember me. Validates session creation and redirect.

## Test Scenarios

### 1. Successful Login

**Steps:**
1. Navigate to the login page
2. Type "user@test.com" in the Email input field
3. Type "Password123" in the Password input field
4. Click the "Login" button

**Expected Results:**
- Dashboard page loads
- Heading "Welcome" is visible
- User email appears in the header
```

---

## References

- `docs/TESTER_AUTOMATION_DESIGN.md` — Agent roles, Playwright-CLI exclusivity, Healer routing
- `workspace-tester/docs/TESTER_AGENT_DESIGN.md` — Specs vs tests layout, Seed requirement, Playwright Generator/Healer flow
- [Playwright Test Agents](https://playwright.dev/docs/test-agents) — Planner/Generator/Healer model, spec structure
- `.cursor/skills/docs-organization-governance/SKILL.md` — Doc placement and consolidation rules
