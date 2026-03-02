# Tester Agent (workspace-tester) Design Overview

This document aligns with Playwright best practices and the [Playwright Test Agents](https://playwright.dev/docs/test-agents) model: Planner → specs/\*.md, Generator → tests/\*.spec.ts, Healer → fixes failing tests.

---

## Inspiration finding from the "13 Agents" Article
To design a robust, self-healing testing system, we are drawing inspiration from Rakesh Kamaraju's "13 AI Agents That Write, Run, and Heal Tests." The article outlines a decoupled ecosystem where each agent has a single, testable responsibility.

The key concepts we are adopting into our architecture:
1. **The CREATE Chain:** Separating the understanding of requirements (Interpreter/Planner) from the actual code generation (Coder) and verification (Verify).
2. **The TEST Chain:** Having a smart Runner that doesn't just execute tests blindly but groups failures by root cause (e.g., "These 3 all broke because the same button ID changed").
3. **The HEAL Chain:** An agent dedicated to diagnosing whether a failure is a flake (needs wait time), a locator drift (needs DOM inspection), or an intentional UI change, instead of silently relying on retry loops.
4. **The SUPPORTING Cast & BRAIN:** Utilizing an Orchestrator to route tasks, a Locator agent to manage confidence scores on selectors, and separating the domains into dedicated sub-agents.

This philosophy directly informs why we are shifting the generator role to the Planner, and focusing the `workspace-tester` on specialized executor and healer sub-agents powered by `playwright-cli`.

---

## 1. Architectural Philosophy: Why Separate Workspaces?
In the OpenClaw ecosystem, creating "separated workspaces" (`workspace-planner`, `workspace-reporter`, `workspace-tester`) is the most effective way to create **distinct AI Agents** with single responsibilities.

**Why keep them separate?**
- **Domain Context (Memory):** A Planner Agent needs Jira/Figma context in its `MEMORY.md`. A Tester Agent needs DOM trees, Playwright CLI logs, and environment variables in its `MEMORY.md`. Mixing them causes hallucination and uses up context window limits.
- **Skill Segregation:** The Planner needs `jira-cli` and `confluence`. The Tester needs `playwright-cli`, `test-analyzer`, and terminal access. Preventing cross-pollination ensures security and focus.
- **Independent Evolution (Idempotency):** You can safely upgrade the Tester Agent's workflows without accidentally breaking the Reporter Agent's reporting logic.

---

## 2. Tester Agent Workflows & Sub-Agents
The overarching `workspace` acts as the main **Orchestrator** over the testing and healing lifecycle. 
Inside `workspace-tester`, the agent behaves strictly as the **Executor**.

*Note: The **Test Generator** (for natural language test cases) role is integrated with the Planner (`workspace-planner`). The Tester Agent focuses on converting those cases into executable automation code.*

The `workspace-tester` Agent focuses on two core capabilities:

### A. The Execution Runner & Scripter (`test-executor.md`)
*The `workspace-tester` plays the role of executor and automation scripter, running and saving tests locally.*
1. **Input:** Receives Markdown test plans (`specs/*.md`) or execution commands for specific feature or defect scripts. Uses `tests/seed.spec.ts` for environment setup.
2. **Process:** Translates test steps into Playwright scripts, saves them to the repository, and runs them.
3. **Output:** Test passes, OR it captures the `playwright-cli snapshot` and standard error logs when a failure occurs.

### B. The Healer & Analyzer (`test-healer.md`)
*A dedicated sub-agent created to heal test scripts when they break in CI.*
1. **Input:** Receives the error logs and element snapshots from the Execution Runner.
2. **Process:**
   - Evaluates if the failure is a **flake/timing issue** -> *Heals the script by adding waits.*
   - Evaluates if the DOM changed intentionally -> *Updates the locator references in the script.*
   - Evaluates if it's a true bug -> *Routes findings to the `workspace-reporter` to log a Jira defect.*

---

## 3. Primary Workflows & Scenarios
The `workspace-tester` operates within three main scenarios managed by the Orchestrator (Main Agent):

1. **Automation Failure (Daily CI Execution):**
   - **Trigger:** The Daily Agent detects that several scripts failed during a scheduled CI run.
   - **Action:** Notifies the Main Agent (Orchestrator).
   - **Process:** The Main Agent invokes the Tester Agent to re-run the failing scripts locally to isolate the issue.
   - **Outcome:**
     - If it's a *true failure* (application bug): Routes to the Reporter Agent to generate a bug report.
     - If it's a *false alarm* (flaky test or outdated locator): Routes to the Healer Agent to fix the script and provide a Pull Request (PR) to the repository.

2. **Defect-Driven Testing:**
   - **Trigger:** The Daily Agent notices a batch of Jira tickets are ready for "Fix Confirmation" (FC) testing.
   - **Action:** Notifies the Planner Agent.
   - **Process:** The Planner Agent creates a targeted defect-driven test plan.
   - **Execution:** Invokes the Tester Agent to execute the tests mapped to those defects.
   - **Outcome:** Invokes the Reporter Agent to officially FC the tickets (close them in Jira) based on the test results.

3. **Feature Testing Stage (New Development):**
   - **Trigger:** A new feature is ready for QA testing.
   - **Action:** Invokes the Planner Agent to create a detailed QA Test Plan with explicit step-by-step cases.
   - **Execution:** Invokes the Tester Agent to execute the test steps. During execution, the Tester Agent **writes the automated scripts into the workspace**.
   - **Outcome:** Invokes the Reporter Agent to generate and publish the final feature test report.

---

## 4. Test Script Generation, Execution & Reuse
One of the key capabilities of the Tester Agent is its dual role during the **Feature Testing Stage**: it tests the application *while* generating reusable automation code.

**How does the Tester both "do the test" and "write scripts for the future"?**
When the Planner Agent dictates a test case, the Tester Agent doesn't just evaluate the UI visually. Instead, it interacts with the application by writing and driving Playwright code.

1. **Script Generation inside the Workspace:** The Tester translates the Markdown plan (`specs/*.md`) into a robust `.spec.ts` Playwright file. It saves this file into `tests/specs/<feature>/` (Playwright-flavored layout).
2. **Execution & Validation:** The Tester executes the newly written file via `npx playwright test`. This actual execution serves as the functional test validation for the feature.
3. **Re-use for the Future:** Because these generated scripts are saved locally in the repository, they can be committed and pushed to version control. They immediately become part of the baseline regression suite that the Daily CI Agent will run (Scenario 1) without requiring any manual scripting effort.
4. **WDIO to Playwright Migration / Re-use:** If you are converting existing WebdriverIO (WDIO) scripts, the Tester Agent acts as a translation engine. It reads the legacy WDIO spec file, understands the intent, rewrites it into a modern Playwright `.spec.ts` script, verifies it against the current UI, and saves it to the repo—incrementally modernizing the automation base while proving the feature works.

---

## 5. Playwright Best Practices & Directory Structure

### 5.1 Specs vs Tests (Playwright Convention)

| Location | Format | Purpose |
|----------|--------|---------|
| `specs/` | Markdown (`.md`) | Human-readable test plans. Planner output. Generator input. Steps, expected outcomes, seed reference. |
| `tests/` | TypeScript (`.spec.ts`) | Executable Playwright tests. Generator output. Run via `npx playwright test`. |
| `tests/seed.spec.ts` | TypeScript | **Required** for Playwright Planner. Bootstraps fixtures, auth, setup. |

- **`specs/*.md`** — Plans only; no code. Consumed by Playwright Generator or `test-case-generator`.
- **`tests/specs/`** — Executable `.spec.ts` organized by feature; mirrors `specs/` path for traceability.

### 5.2 Recommended Directory Structure (Playwright-Flavored)

```text
workspace-tester/
├── MEMORY.md
├── docs/
│   └── TESTER_AGENT_DESIGN.md
├── workflows/
│   ├── test-executor.md
│   └── test-healer.md
├── skills/
│   ├── test-analyzer/
│   └── locator-strategist/
└── projects/
    └── library-automation/              # Main Playwright project
        ├── specs/                       # Markdown plans (Planner output)
        │   └── reportEditor/
        │       └── reportUndoRedo/
        │           ├── authoringClear.md
        │           └── ...
        ├── tests/
        │   ├── seed.spec.ts             # REQUIRED: fixtures, auth — Planner input
        │   ├── specs/                   # Executable .spec.ts (Generator output)
        │   │   └── reportEditor/reportUndoRedo/
        │   │       └── *.spec.ts
        │   ├── page-objects/
        │   ├── fixtures/
        │   └── test-data/
        └── playwright.config.ts
```

### 5.3 test-case-generator Output Format

The **`test-case-generator`** skill (used by the Planner Agent) MUST emit **Markdown (`.md`)** — not JSON — for compatibility with the Playwright Generator and human readability.

- **Output path:** `projects/testcase-plan/<feature-id>/*.md` or `specs/<feature>/*.md`.
- **Format:** Human-readable Markdown with numbered steps, expected results, and a seed reference (`**Seed:** \`tests/seed.spec.ts\``).
- **Rationale:** Playwright Generator consumes Markdown; `.md` aligns with Playwright conventions and enables direct handoff to the Tester Agent.

### 5.4 tests/seed.spec.ts (Required for Playwright Planner)

`tests/seed.spec.ts` is a **required input** for the Playwright Planner agent:

- Imports from `./fixtures` (auth, setup).
- Runs a minimal test that reaches the authenticated/app state.
- The Planner uses it to bootstrap the browser context when exploring and generating plans.
- Ensures all generated tests share the same environment assumptions.

---

## 6. Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    OpenClaw Tester Flow with Playwright Agents                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  Planner Agent (workspace-planner)                                                   │
│  ├─ Uses test-case-generator skill                                                   │
│  └─ Output: specs/<feature>/*.md  (Markdown plans)                                   │
│     └─ Human-readable steps, expected outcomes, Seed: tests/seed.spec.ts             │
│                                                                                      │
│  Playwright Planner (optional, via npx playwright init-agents --loop=claude)         │
│  ├─ Input: tests/seed.spec.ts + request                                              │
│  └─ Output: specs/<scenario>.md  (exploration-based plan)                            │
│                                                                                      │
│  Tester Agent (workspace-tester)                                                     │
│  ├─ Input: Markdown plans (from Planner or Playwright Planner)                       │
│  ├─ Uses Playwright Generator, playwright-cli, or playwright-runner skill            │
│  └─ Output: tests/specs/<feature>/*.spec.ts  (executable)                             │
│                                                                                      │
│  Healer (on failure)                                                                 │
│  ├─ Input: failing test (from npx playwright test)                                    │
│  ├─ Uses playwright-cli snapshot + POM co-located locators                           │
│  └─ Output: patched POM or .spec.ts, GitHub PR                                       │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

**Handoff flow:**
1. Planner → `specs/*.md` (or `projects/testcase-plan/<id>/*.md`)
2. Tester reads `.md`, generates `tests/specs/**/*.spec.ts`
3. Healer fixes failures using `playwright-cli snapshot` and POM locators

---

## 7. How the Agents Interact
Although separated, they collaborate via file handoffs and API tickets, directed by the overarching `workspace` orchestrator:

1. **Planner (`workspace-planner`):** Writes the QA Plan and outputs detailed test cases in **Markdown** (`specs/*.md`) via the `test-case-generator` skill. Compatible with Playwright Generator.
2. **Tester (`workspace-tester`):** Acts as the **Executor and Script Writer**. It reads `specs/*.md` plans, writes Playwright specs to `tests/specs/`, and runs them. Uses `tests/seed.spec.ts` for environment bootstrap. If the Daily Agent finds a CI failure, the Orchestrator invokes the **Healer** to fix the script, or routes hard bugs to the Reporter.
3. **Reporter (`workspace-reporter`):** Reads the test execution findings and publishes RC/FC statuses or defect reports to Jira/Confluence.
