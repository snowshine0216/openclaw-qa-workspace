# Playwright AI-Native Migration Plan

## 1. Executive Summary
This document outlines a structured plan to transition the existing WebdriverIO (WDIO) automation test cases in the `reportUndoRedo` suite to Playwright. The primary objective is to modernize the automation architecture by utilizing Playwright's cutting-edge AI capabilities for **Frontier UI Automation**, specifically enabling self-healing locators and dynamic test-step creation. The end state will be a robust, Page Object Model (POM) driven architecture that is "Agent-Native," meaning it fully supports CLI/MCP-based coding agent executions.

## 2. Current State Analysis
Based on a deep review of the target directory (`tests/wdio/specs/regression/reportEditor/reportUndoRedo`):
*   **Suite Size:** 5 test files (`Report_undoredo_authoringClear.spec.js`, `Report_undoredo_authoringEditReport.spec.js`, etc.)
*   **Structure:** Heavy reliance on global POM objects (`browsers.pageObj1`) containing deeply nested operations (e.g., `reportDatasetPanel.addObjectToRows('Category')`).
*   **Complexity:** Advanced UI interactions like drag-and-drop (`dndMetricsFromColumnsToRows`), custom verification utilities (`since('...').expect().toBe()`), and explicit waits (`browser.pause()`).

## 3. Target Architecture
The future state will leverage the materials provided (`lucad87/mcp-server-tests-migration`, `microsoft/playwright-cli`, and AI Automation Concepts) to construct:
1.  **Agent-Native Playwright Automation:** Using `playwright-cli` to provide localized, token-efficient browser context interactions for LLMs to generate or repair test steps synchronously.
2.  **Playwright-Native POM:** Modernized `Page` classes utilizing native `.locator()`, `getByRole()`, and `getByText()`.
3.  **Self-Healing AI Integration:** Fallbacks utilizing `mcp-server-tests-migration` and Playwright AI constructs to self-resolve brittle locators and dynamically adjust paths without failing the tests.
4.  **Automatic Auto-Waiting:** Replacing brittle `browser.pause()` logic with Playwright’s built-in web-first assertions (`await expect(locator).toBeVisible()`).

## 4. Migration Strategy & Execution Plan

### Phase 0: Setup and Tooling Initialization
1.  **Install Playwright:** Standard setup using `npm init playwright@latest`.
2.  **Install Migration Server:** Register the `lucad87/mcp-server-tests-migration` server locally via stdio or HTTP mode.
3.  **Install Playwright CLI:** Add `microsoft/playwright-cli` to enable coding agents to interact efficiently with Playwright actions natively within the terminal.
4.  **Analyze State:** Use the `detect_project_state` tool from the Migration MCP to formulate a baseline structure mapping from WDIO config to Playwright config.

### Phase 1: AST-Based Automated Conversion
Using the `lucad87/mcp-server-tests-migration` tools to rapidly transform the baseline code:
1.  **`analyze_wdio_test`:** Extract imports, custom commands (e.g., `dndFromObjectBrowserToReportFilter`), and object bindings.
2.  **`register_custom_commands`:** Translate legacy WDIO UI custom assertions (like `since(...).expect()`) into native standard Playwright `expect` calls instead of maintaining custom assertion wrappers. Also map generic login sequences.
3.  **`migrate_to_playwright`:** Run AST migration on the 5 files in the `workspace-tester/projects/wdio/specs/regression/reportEditor` directory. This translates the `.spec.js` bodies from WebDriver syntax to native Playwright syntax.
4.  **`refactor_to_pom`:** Execute the POM refactoring component, extracting inline scripts into Playwright Page-Object classes, preserving the abstraction.

### Phase 2: Agent-Native Workflow & Self-Healing Capabilities
Leveraging the principles of "Frontier UI Automation" (detailed in the `dstekanov.tech` methodology and `microsoft/playwright-cli` docs):
1.  **AI Locator Generation:** Inject LLM/Agent tools (via `microsoft/playwright-cli`) during test generation. Instead of manually mapping the complex drag-and-drop logic from the old POM, the agent CLI can inject smart semantic locators.
2.  **Self-Healing Implementation:** When strict element locators fail due to a changed application, attach an AI fallback mechanism that interprets the DOM tree (token efficiently using `playwright-cli`) and dynamically corrects the locator during test runtime.
3.  **AI Test Steps Execution:** Utilize MCP/Playwright CLI combos allowing the Agent full introspection into the DOM at any step, creating adaptive "what you see is what you play" automation scripts.

### Phase 3: Validation and Verification
1.  **`compare_frameworks`**: Use the migration tool to surface edge-cases not properly covered during AST refactoring.
2.  **UI Mode Execution:** Run `npx playwright test --ui` and trace viewer to manually certify the migration fidelity of the 5 complex `reportUndoRedo` flows.
3.  **`generate_migration_report`**: Export a markdown dashboard verifying all tags and cases successfully migrated to Playwright.

## 5. Cost & Difficulty Assessment

*   **Difficulty:** **Moderate to High**
    *   *Why:* Translating core assertions to standard Playwright `expect` functions and mapping basic locators is handled automatically. However, advanced customized WDIO drag-and-drop actions, iframes, and establishing the exact self-healing plugin or AI driver logic takes manual architectural diligence.
*   **Estimated Cost / Effort:**
    *   **Phase 0-1 (AST Migration):** ~0.5 Days. Automated bulk work for the 5 files utilizing `mcp-server-tests-migration`.
    *   **Phase 2 (AI Augmentation & Self-Healing Setup):** ~1-2 Days. Hooking Playwright CLI up with AI constructs and redefining locators to be agent-driven, and ensuring POM stability.
    *   **Phase 3 (Validation & Edge-case fixing):** ~1 Day. Addressing specific timing issues introduced by removing `browser.pause` in favor of semantic expectations.
    *   **Total Estimated Time:** 2.5 - 3.5 Developer Days to establish a bulletproof, reusable Playwright AI-native framework tailored for this suite.

## Summary 
By orchestrating **AST Migration Tools** with **Agent-Native CLI capabilities**, this plan offsets the heavy lifting of manual syntactical refactoring, allowing the team to invest directly into establishing a modern, self-healing Playwright framework. The 5 files within `reportUndoRedo` are pristine candidates for this pilot implementation.

**Full reportEditor migration:** See [PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md](./PLAYWRIGHT_MIGRATION_REPORTEDITOR_FULL_PLAN.md) for the complete plan covering all 80 remaining reportEditor specs (reportUndoRedo done; others phased by feature).
