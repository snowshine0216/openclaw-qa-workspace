# Tester Agent Automation & Healing Design

## Overview
This document outlines the architecture and execution strategy for the Tester Agent, focusing on its responsibilities for running tests, generating automation scripts, and self-healing. This design spans across multiple workspaces (`workspace-tester`, `workspace-planner`, `workspace-reporter`) and draws inspiration from the "13 Agents" (crawddocs) concepts to ensure highly decoupled and testable responsibilities.

---

## 1. Agent Roles & Collaboration
To maintain strict idempotency and boundary separation, the system operates under the following roles:

1. **Orchestrator (Main Agent):** The central controller that receives triggers (e.g., CI failures, new features) from the Daily Agent and routes tasks to the appropriate sub-agents.
2. **Planner Agent (`workspace-planner`):** The "Test Generator". It understands Jira requirements and Figma designs, and it leverages the **`test-case-generator`** skill to look up existing QA plans and systematically generate detailed test steps, one by one. It outputs these test cases in **Markdown (`.md`) format** into `projects/testcase-plan/<feature-id>/` or `specs/<feature>/` for compatibility with the Playwright Generator and human readability. The Tester Agent consumes these Markdown plans directly.
3. **Tester Agent (`workspace-tester`):** The "Executor and Healer". Strictly isolated to translating plans into code, running tests, and fixing broken scripts.
4. **Reporter Agent (`workspace-reporter`):** The "Communicator". Handles filing defects in Jira and updating Confluence summaries.
5. **Daily Agent (`workspace-daily`):** The "Monitor". Scans CI pipelines for automation failures and queries Jira for features/defects ready for QA, reporting findings to the Orchestrator.

---

## 2. Tester Agent Core Requirements & Rules
The Tester Agent operates under strict technical constraints to ensure consistency and reliability:

1. **Playwright-CLI Exclusivity:** For all browser interactions, test execution, script generation, and debugging, the Tester MUST only use `playwright-cli`. It does not rely on alternative scraping or execution tools.
2. **Semantic Locators Only:** When writing or fixing `.spec.ts` files, it relies on semantic locators (`getByRole`, `getByText`, `getByLabel`) aligned directly with `playwright-cli snapshot` outputs.
3. **Github for Code Changes:** All generated automation scripts (`.spec.ts`) and healed Page Object Model (POM) files must be saved locally and committed via GitHub PRs.
4. **Feishu Notifications:** For routine completions, successful heals, or general status updates (non-bugs), the Tester will drop a DM directly to the Feishu chat.

---

## 3. Defect Routing & Bug Report Formatter
When an automation script fails, the Tester Agent uses `playwright-cli` to diagnose the root cause:

- **If Automation Failure (Flake/Locator Drift):** The Tester invokes the *Healer* workflow to update the POM, verify the fix, and commit a GitHub PR.
- **If Application Bug (True Defect):** The Tester MUST NOT log the bug itself. It must invoke the **Reporter Agent**.

### Evaluation of `bug-report-formatter` Skill
The existing `bug-report-formatter` skill (located across workspaces) is **sufficient** for this handoff. 
- It already includes templates for Environment data, Expected vs Actual results, and explicit support for `playwright-cli` screenshots and console logs.
- **Workflow:** The Tester Agent uses `playwright-cli screenshot` and `console error` to gather the evidence. It formats this payload using the `bug-report-formatter` schema, and passes it as inputs when invoking the Reporter Agent. The Reporter Agent (which holds the `jira-cli` tools) then executes the ticket creation.

---

## 4. Required Skills Formulation
To restrict the Tester Agent strictly to `playwright-cli`, we need to create/leverage the following specific skills inside `workspace-tester/skills/`:

### 1. `playwright-runner` (To Be Created)
- **Purpose:** How to translate MD test cases into `.spec.ts` and run them.
- **Rules:** 
  - Instructions on creating `.spec.ts` files in the `automation/` directory.
  - Using semantic locators.
  - Running `npx playwright test <file>`.

### 2. `playwright-healer` (To Be Created)
- **Purpose:** How to debug and fix failing tests following existing architectural rules.
- **Rules:**
  - Instructions on consuming CI stack traces to identify the failing POM file.
  - Running `playwright-cli open` and `playwright-cli snapshot` to capture the new DOM structure.
  - Rules for updating co-located locators within the Page Object Model (e.g., `tests/page-objects/`).
  - Leveraging GitHub tools to branch, commit, and PR the fix.

### 3. `bug-report-formatter` (Leverage Existing)
- **Purpose:** Standardize the artifact payload when handing off true application bugs to the Reporter Agent.

---

## 5. System Impact & Action Items

To implement this design, several global configurations and workflows must be updated:

1. **Update `agents.md` (or equivalent global routing doc):**
   - Redefine `workspace-tester` to explicitly state its strict usage of `playwright-cli` and Github PR generation.
   - Add the strict routing rule: "Tester handles execution/healing. Reporter handles all Jira bug logging."
   
2. **Create New Workflows in `workspace-tester/workflows/`:**
   - `test-execution.md`: The workflow for translating feature plans to `automation/` scripts and running them.
   - `test-healing.md`: The explicit loop for investigating a failure, using `playwright-cli snapshot`, fixing the POM, and raising a PR.

3. **Create New Skills in `workspace-tester/skills/`:**
   - Draft `playwright-runner/SKILL.md` (defining the generation rules).
   - Draft `playwright-healer/SKILL.md` (defining the self-healing locator mapping rules).

---

## 6. QA Planner Enhancement & Action Items

To seamlessly support the Tester Agent's workflow, the Planner Agent (`workspace-planner`) also requires specific configuration updates:

1. **Update `agents.md`:**
   - Refine the Planner Agent's description to include its duty of reading existing QA plans or jira defects description and systematically generating detailed JSON test steps one by one.

2. **Update Planner Workflows (`workspace-planner/workflows/`):**
   - Incorporate a dedicated `testcase-generation` workflow describing the step-by-step logic to lookup a feature's QA plan and generate corresponding JSON cases under `projects/testcase-plan/<feature-id>`.

3. **Update Skills (`workspace-planner/skills/`):**
   - Alter the `test-case-generator` skill to output **Markdown (`.md`)** consumable by the Tester Agent and Playwright Generator. Deprecate JSON output for test plans. Include `**Seed:** \`tests/seed.spec.ts\`` reference for Planner compatibility.

---

## 7. Daily Agent Enhancement & Action Items

To establish the required trigger mechanisms for the Orchestrator, the Daily Agent (`workspace-daily`) will act as the proactive monitor initiating the test/heal cycles:

1. **Update `agents.md`:**
   - Explicitly document the Daily Agent's role in monitoring CI pipelines for automation failures and querying Jira for newly "Ready for QA" features or defects.
   - Describe the handoff protocol: notifying the Orchestrator with structured context (e.g., passing failing CI job details or Ready JIRA ticket IDs).

2. **Update Daily Workflows (`workspace-daily/workflows/`):**
   - Create or update `ci-monitor.md`: A workflow to poll for Playwright test failures, extract context, and send a trigger event to the Orchestrator.
   - Create or update `jira-monitor.md`: A workflow to poll Jira (using a specific JQL for "Ready for QA") and report new testing requirements to the Orchestrator.

3. **Required Skills (`workspace-daily/skills/`):**
   - Needs CI monitoring skills (e.g., GitHub Actions API) to query pipeline execution status and extract testing errors.
   - Needs JQL polling skills (`jira-cli`) to systematically track tickets moving to testing states.
