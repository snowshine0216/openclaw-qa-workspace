# BCIN-6709 Execution Learnings and Troubleshooting

**Purpose:** record every problem encountered during BCIN-6709 execution and every method used to solve or mitigate it, so future runs can reuse the knowledge.

---

## Problem Log Format

Use this format for every new issue encountered during execution:

### Problem <N> — <Short title>
- **Stage:** Planning / Login / Inventory / Execution / Reporting
- **Symptom:**
- **Impact:**
- **Root cause / hypothesis:**
- **Method used to investigate:**
- **Method used to solve or mitigate:**
- **Outcome:** Solved / Partially solved / Blocked / Monitoring
- **Artifacts / evidence:**
- **Future guidance:**

---

## Recorded Learnings So Far

### Problem 1 — QA plan path was incorrect
- **Stage:** Planning
- **Symptom:** The originally referenced QA plan file could not be opened because the path did not exist.
- **Impact:** Execution planning could not begin using the provided path.
- **Root cause / hypothesis:** The run path referenced an older or incorrect output location.
- **Method used to investigate:** Checked the planner workspace directory structure and searched likely feature-plan output locations.
- **Method used to solve or mitigate:** Located the correct file under the planner feature-plan project path.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - Correct path: `/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/projects/feature-plan/BCIN-6709/qa_plan_final.md`
- **Future guidance:** If a planner output path fails, inspect `workspace-planner/projects/feature-plan/<ISSUE-KEY>/` before assuming the artifact is missing.

### Problem 2 — QA plan contains scenarios without deterministic repro details
- **Stage:** Planning
- **Symptom:** Multiple scenarios include TODO notes such as "specify trigger" and references to BCIN-7543 fixture details.
- **Impact:** Full direct execution cannot be guaranteed from the QA plan alone.
- **Root cause / hypothesis:** The QA plan captures expected coverage but not all executable fixture/repro instructions.
- **Method used to investigate:** Reviewed the plan and grouped scenarios by required behavior and missing trigger information.
- **Method used to solve or mitigate:** Switched to an exploratory-first but QA-plan-traceable execution model. Added object inventory and candidate selection before scenario execution.
- **Outcome:** Partially solved
- **Artifacts / evidence:**
  - QA plan sections containing `TODO: specify trigger`
- **Future guidance:** Treat missing trigger details as a fixture gap, not as permission to improvise unverified repro steps.

### Problem 3 — Prior PM-01 run hit wrong error type
- **Stage:** Prior execution / recovered context
- **Symptom:** The test flow produced an attribute aggregation error instead of the expected max-rows-style error.
- **Impact:** PM-01 could not validate the intended error-recovery branch with that object/setup.
- **Root cause / hypothesis:** The report used in the prior run was misconfigured for the intended scenario or the wrong candidate object was selected.
- **Method used to investigate:** Recovered prior state from `task.json` and workspace memory.
- **Method used to solve or mitigate:** Preserved this as a known configuration risk and added a rule to validate object suitability before treating the scenario as executable.
- **Outcome:** Partially solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/task.json`
  - `memory/2026-03-05-resume-button-test.md#L101-L162`
- **Future guidance:** If the observed error family does not match the expected branch, stop and classify it as object/config mismatch unless the feature spec explicitly allows alternate errors.

### Problem 4 — Need reusable execution structure before live testing
- **Stage:** Planning
- **Symptom:** Without structured templates, exploratory results would become hard to compare and future reruns would lose consistency.
- **Impact:** Risk of incomplete evidence capture and poor scenario traceability.
- **Root cause / hypothesis:** Exploratory testing across many reports needs stricter documentation than ad hoc notes.
- **Method used to investigate:** Compared user requirements against QA plan structure and reporting needs.
- **Method used to solve or mitigate:** Created three dedicated templates:
  - `report-inventory.md`
  - `object-results.md`
  - `execution-summary.md`
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/reports/`
- **Future guidance:** For any exploratory feature execution involving multiple candidate objects, create inventory + object-result + summary templates before opening the environment.

### Problem 5 — Site knowledge may be partial for exact error wording
- **Stage:** Pre-execution
- **Symptom:** Site knowledge returns useful authoring, prompt, and pause-mode hints, but exact BCIN-6709 error-copy coverage is incomplete.
- **Impact:** Site knowledge can guide navigation and controls, but not guarantee exact dialog wording for this feature.
- **Root cause / hypothesis:** Generic WDIO/page-object knowledge exists, while feature-specific error text may not be fully represented.
- **Method used to investigate:** Reviewed sitemap and ran BM25 searches for report editor, library authoring, pause mode, reprompt, and target error terms.
- **Method used to solve or mitigate:** Use site knowledge primarily for navigation and locator hints; rely on live UI evidence for exact error-copy validation.
- **Outcome:** Partially solved
- **Artifacts / evidence:**
  - `memory/site-knowledge/SITEMAP.md`
  - `projects/test-cases/BCIN-6709/site_context.md` (to be maintained)
- **Future guidance:** Use site knowledge for navigation and stable control hints, but always capture screenshots for feature-specific wording validation.

---

### Problem 6 — `networkidle` page load timed out on live environment
- **Stage:** Live execution / login
- **Symptom:** Initial Playwright navigation to the Library URL timed out while waiting for `networkidle`.
- **Impact:** The first browser probe could not complete using the strict load strategy.
- **Root cause / hypothesis:** MicroStrategy Library likely maintains long-lived background requests, so `networkidle` is too strict for stable entry detection.
- **Method used to investigate:** Ran a first headless login probe script and captured the exact Playwright timeout location.
- **Method used to solve or mitigate:** Switched the navigation strategy from `waitUntil: networkidle` to a more tolerant approach using `domcontentloaded` plus explicit waits and screenshot capture.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - `.tmp/bcin6709-browser/login_probe.js`
- **Future guidance:** For MicroStrategy web apps, prefer `domcontentloaded` or `load`, then wait for specific UI conditions instead of relying on `networkidle`.

### Problem 7 — Login button click succeeds but Playwright waits on navigation too long
- **Stage:** Live execution / login
- **Symptom:** Playwright resolved the login button and executed the click, but then timed out while waiting for scheduled navigation to finish.
- **Impact:** Automated login could not be judged correctly from the first click implementation.
- **Root cause / hypothesis:** The page schedules internal navigation / async auth transitions in a way that makes default click waiting too strict.
- **Method used to investigate:** Captured the Playwright click log showing the element was visible, stable, and clicked before timeout.
- **Method used to solve or mitigate:** Switch to click with `noWaitAfter` and explicitly inspect post-click URL, page text, and screenshots after a manual wait.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - `.tmp/bcin6709-browser/login_and_inventory_probe.js`
- **Future guidance:** For MicroStrategy login flows, use explicit state checks after click instead of relying on implicit navigation completion.

### Problem 8 — Full-page screenshot timed out after login attempt
- **Stage:** Live execution / login transition
- **Symptom:** Post-login screenshot timed out after the login action.
- **Impact:** Full-page evidence capture was too heavy to use as the first post-login validation step.
- **Root cause / hypothesis:** The post-login Library surface is larger / more active than the login page, making full-page screenshot capture an expensive first check.
- **Method used to investigate:** Ran the login probe and observed that the failure occurred during screenshot capture rather than during field entry.
- **Method used to solve or mitigate:** Switch to lighter checks first: URL, title, visible body text, and non-full-page screenshot. Only use heavier captures after confirming the page is stable.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - `.tmp/bcin6709-browser/login_and_inventory_probe.js`
- **Future guidance:** On heavy MicroStrategy pages, validate state first, then capture targeted screenshots rather than defaulting to full-page screenshots.

### Problem 9 — Post-login Library stayed on `Loading...` in headless execution
- **Stage:** Live execution / post-login
- **Symptom:** After successful login transition to `.../app?continue` with title `Library`, the visible page content remained only `Loading...` instead of rendering the Library UI.
- **Impact:** Live report inventory could not start yet because no object list was visible in headless execution.
- **Root cause / hypothesis:** Possible slow app bootstrap, headless rendering limitation, blocked asset/API, or a session-specific loading issue.
- **Method used to investigate:** Extracted post-login DOM state and confirmed repeated visible `Loading...` text with no rendered Library controls.
- **Method used to solve or mitigate:** Proceed to console/network probing, longer waits, and environment/tooling diagnosis before classifying as blocker.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - `.tmp/bcin6709-browser/post_login_probe.js`
  - `projects/test-cases/BCIN-6709/screenshots/03-post-login.json`
- **Future guidance:** If Library remains at `Loading...` after login, capture DOM/console/network evidence before assuming credentials or navigation are wrong.

### Problem 10 — Headless Library load showed API noise during post-login bootstrap
- **Stage:** Live execution / post-login diagnosis
- **Symptom:** Console/network diagnostics showed some failed or noisy requests while the Library page remained on `Loading...`.
- **Impact:** It is still unclear whether the visible loading stall is caused by headless rendering, a benign noisy API, or a real bootstrap dependency issue.
- **Root cause / hypothesis:** Potential combination of environment-specific API availability and headless rendering behavior.
- **Method used to investigate:** Added console, response, and request-failure listeners during login and captured post-login diagnostics.
- **Method used to solve or mitigate:** Continue with authenticated backend discovery by identifying report-list API traffic, so inventory can proceed even if UI rendering remains degraded.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - `.tmp/bcin6709-browser/post_login_errors.js`
  - `.tmp/bcin6709-browser/post_login_errors.json`
- **Future guidance:** When Library UI stalls, capture console and network first, then try backend/API-driven inventory as a fallback path.

### Problem 11 — Needed a non-UI fallback to keep candidate discovery moving
- **Stage:** Live inventory
- **Symptom:** Live bxu Library enumeration could not continue normally because the UI remained stuck on `Loading...`.
- **Impact:** Candidate report discovery risked stalling completely.
- **Root cause / hypothesis:** Current headless session can authenticate but not fully render the Library UI.
- **Method used to investigate:** Recovered prior BCIN-6709 execution artifacts and searched the workspace for concrete object URLs, report IDs, and evidence files.
- **Method used to solve or mitigate:** Used prior execution evidence as a bootstrap inventory source and documented the first confirmed candidate object in `report-inventory.md` while continuing diagnosis of live UI loading.
- **Outcome:** Partially solved
- **Artifacts / evidence:**
  - `projects/test-reports/BCIN-6709/execution-report-TC-01-blocker.md`
  - `projects/screenshots/BCIN-6709/TC-01-console-errors.txt`
  - `projects/test-cases/BCIN-6709/reports/report-inventory.md`
- **Future guidance:** If live Library enumeration is blocked, recover and reuse prior object evidence so execution can continue with at least a seed candidate set.

### Problem 12 — Need headed browser verification because headless may be misleading
- **Stage:** Live execution strategy
- **Symptom:** Headless automation authenticated successfully but the post-login Library remained stuck on `Loading...`.
- **Impact:** It became unclear whether the issue was a real product blocker or a headless-rendering/tooling limitation.
- **Root cause / hypothesis:** Likely headless-only rendering/bootstrap issue rather than a true post-login product failure.
- **Method used to investigate:** Compared successful auth/session establishment with missing rendered UI and reviewed user guidance that post-login should not be blocked.
- **Method used to solve or mitigate:** Switch to a headed Playwright launch so the live rendered browser can be observed directly.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - headed Playwright run to be used as source of truth for post-login rendering
- **Future guidance:** If MicroStrategy Library appears stuck only in headless mode after successful login, validate immediately in headed mode before classifying as environment/product blocker.

### Problem 13 — Headed mode proved the post-login Library was not truly blocked
- **Stage:** Live execution / environment validation
- **Symptom:** Headless mode suggested the page was stuck on `Loading...`, but headed mode later showed the Library content rendered normally after a short delay.
- **Impact:** Prevented a false blocker classification and unblocked the live inventory pass.
- **Root cause / hypothesis:** Rendering/bootstrap behavior differs materially between headless and headed browser sessions for this environment.
- **Method used to investigate:** Launched a headed Playwright browser, logged in as `bxu`, and sampled post-login text over time.
- **Method used to solve or mitigate:** Use headed mode as the primary truth source for live Library discovery in this environment.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `.tmp/bcin6709-browser/headed_login_watch.js`
  - `projects/test-cases/BCIN-6709/screenshots/10-headed-login-page.png`
  - `projects/test-cases/BCIN-6709/screenshots/11-headed-user-filled.png`
  - `projects/test-cases/BCIN-6709/screenshots/12-headed-post-login-*.png`
- **Future guidance:** If headless says `Loading...` but auth succeeds, verify immediately in headed mode before treating Library rendering as blocked.

### Problem 14 — Consumption/open view is insufficient because BCIN-6709 must be tested in authoring mode
- **Stage:** Live candidate validation
- **Symptom:** Early live probes opened report objects in normal Library viewing paths, which is not sufficient for BCIN-6709 execution.
- **Impact:** Candidate usefulness can be misclassified if not verified in authoring mode.
- **Root cause / hypothesis:** Direct clicks from Favorites default to open/view mode rather than explicit authoring mode.
- **Method used to investigate:** Reviewed user clarification that all tests must be run against authoring mode, either by appending `/edit` to the URL or using the Edit action from the info window.
- **Method used to solve or mitigate:** Revalidate candidates only through explicit authoring-entry paths.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - User instruction on 2026-03-18 16:24 GMT+8
- **Future guidance:** For BCIN-6709, never treat a candidate as valid until it has been opened in authoring mode.

### Problem 15 — One-off browser scripts caused too many fresh launches instead of reusing a live browser
- **Stage:** Live execution orchestration
- **Symptom:** Earlier probes launched multiple separate headed browser scripts for different checks.
- **Impact:** This increases churn, makes state harder to preserve, and is less suitable for iterative investigation.
- **Root cause / hypothesis:** The first automation scripts were optimized for quick probing, not persistent browser reuse.
- **Method used to investigate:** Reviewed the sequence of headed scripts and confirmed each created a new browser instance.
- **Method used to solve or mitigate:** Switch to a single reusable browser-controller session for the remaining BCIN-6709 steps; stop spawning one-off browsers for each check.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - Multiple headed probe scripts under `.tmp/bcin6709-browser/`
- **Future guidance:** For iterative UI investigation, prefer one persistent browser controller and reuse its session state across steps.

### Problem 16 — Authoring surface details only appeared after interacting within the same persistent browser session
- **Stage:** Live authoring validation
- **Symptom:** Initial authoring snapshots showed only a minimal editing shell, but deeper controls and paused-state details appeared only after continued interaction in the same persistent session.
- **Impact:** Early snapshots understated the true usefulness of the candidate report.
- **Root cause / hypothesis:** The authoring UI resolves progressively, and some editor/pause-mode content becomes visible only after the page finishes settling and menu interaction occurs.
- **Method used to investigate:** Reused a single persistent browser session, navigated once to the report's `/edit` instance URL, then interacted with top-level menus and captured new snapshots.
- **Method used to solve or mitigate:** Use the persistent browser and incremental in-page interaction before judging a report as unusable.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-edit-entry.png`
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-after-file-menu.png`
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-after-format-menu.png`
- **Future guidance:** For Library authoring pages, do not rely on the first shell snapshot alone; interact within the same session to reveal editor state such as `Data Retrieval Paused`.

### Problem 16 — Needed a true persistent browser controller after transcript glitch in first attempt
- **Stage:** Live browser orchestration
- **Symptom:** The first attempt to drive a persistent browser hit a transcript/session glitch, making it unclear whether commands were being handled reliably.
- **Impact:** Risked losing the benefit of browser reuse.
- **Root cause / hypothesis:** Tool/session transcript repair noise interfered with the first controller interaction, but the controller process itself remained usable.
- **Method used to investigate:** Polled the controller session directly and inspected returned command output.
- **Method used to solve or mitigate:** Reused the same persistent controller and confirmed command handling by requesting a snapshot from the current authoring page.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `clear-crustacean` persistent controller session
  - screenshot `projects/test-cases/BCIN-6709/screenshots/0.3.1a-before-resume-search.png`
- **Future guidance:** If a persistent session shows transcript repair noise, verify with a simple snapshot command before restarting it.

### Problem 17 — Initially searched for Resume Data Retrieval in the wrong area of the paused canvas
- **Stage:** Live authoring interaction
- **Symptom:** Early probing tried paused-grid labels and menus, but did not surface the Resume action.
- **Impact:** Delayed the correct pause/resume interaction path.
- **Root cause / hypothesis:** The Resume Data Retrieval control is located in the toolbar, not in the paused-grid labels themselves.
- **Method used to investigate:** User clarified the correct control location during live execution.
- **Method used to solve or mitigate:** Switch probing to the authoring toolbar and stop treating paused-grid labels as the action entry point.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - User clarification on 2026-03-18 17:19 GMT+8
- **Future guidance:** For BCIN-6709 pause-mode flows, check the authoring toolbar first for Resume Data Retrieval.

### Problem 18 — Resume Data Retrieval is an icon-only toolbar control
- **Stage:** Live authoring interaction
- **Symptom:** Text-based probing could not find the Resume action even though the report was clearly paused.
- **Impact:** Could not transition from paused authoring state into running mode using the existing text-driven controller.
- **Root cause / hypothesis:** The Resume control is an icon-only toolbar button, not a text button.
- **Method used to investigate:** User provided the exact DOM selector for the control.
- **Method used to solve or mitigate:** Use the toolbar selector directly: `span.single-icon-library-resume[role="button"]` / `[data-feature-id="report-authoring-toolbar-resume"]`.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - Provided selector: `<span class="mstr-ws-icons mstr-icons-single-icon single-icon-library-resume ..." role="button" tabindex="0" data-feature-id="report-authoring-toolbar-resume"></span>`
- **Future guidance:** For BCIN-6709 pause-mode flows, prefer the toolbar selector over text search when targeting Resume Data Retrieval.

### Problem 19 — Needed selector-based click to transition paused authoring state into running/prompt flow
- **Stage:** Live authoring execution
- **Symptom:** The report was clearly paused in authoring mode, but text/menu probing could not advance it.
- **Impact:** Execution would have stalled before actual runtime behavior could be observed.
- **Root cause / hypothesis:** Resume is an icon-only toolbar control and must be clicked by selector.
- **Method used to investigate:** Reused a single persistent browser, navigated to the paused authoring instance URL, and verified paused state in the authoring snapshot.
- **Method used to solve or mitigate:** Clicked the provided selector in the same browser session:
  - `[data-feature-id="report-authoring-toolbar-resume"]`
  - fallback: `span.single-icon-library-resume[role="button"]`
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-direct-edit-before-resume-click.png`
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-after-resume-selector-click.png`
- **Future guidance:** For BCIN-6709 paused authoring flows, go straight to the selector-based Resume click once paused state is confirmed.

### Problem 20 — Needed to verify whether resume leads to recovery error or a normal prompt/apply path
- **Stage:** Live authoring execution
- **Symptom:** After Resume was clicked successfully, it was still unclear whether the report would error recoverably or proceed normally.
- **Impact:** This report could have become either a BCIN-6709 failure-path candidate or only a baseline/normal-path candidate.
- **Method used to investigate:** Applied the current prompt flow in the same authoring session after Resume.
- **Method used to solve or mitigate:** Observed post-Apply state instead of assuming error behavior.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-after-apply-click.png`
- **Future guidance:** Do not assume paused authoring + prompt will trigger BCIN-6709 error handling; verify whether the prompt apply succeeds normally first.

### Problem 21 — `08 Sort by Revenue Rank - Report Filter & Report Limit` reproduces the redesigned Application Error path in authoring mode
- **Stage:** Live execution / failure-path validation
- **Symptom:** After clicking Resume from paused authoring state, the report hit a 500/backend failure and displayed the redesigned error dialog.
- **Impact:** This is a valid BCIN-6709 failure-path candidate for authoring-mode error handling checks.
- **Method used to investigate:** Reused the persistent browser, opened the explicit authoring instance URL, confirmed paused state, and clicked the Resume toolbar selector.
- **Method used to solve or mitigate:** Captured the exact visible dialog copy and preserved the page state for follow-up actions (`Show Details`, `OK`).
- **Outcome:** Solved / confirmed as usable test object
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/08-sort-by-revenue-before-resume-click.png`
  - `projects/test-cases/BCIN-6709/screenshots/08-sort-by-revenue-after-resume-click.png`
- **Future guidance:** Use this object for authoring-mode Application Error dialog validation and post-OK pause-mode checks.

### Problem 22 — Needed to verify whether Show Details and OK truly preserve paused authoring continuity
- **Stage:** Live execution / dialog handling
- **Symptom:** Reproducing the Application Error dialog alone was not enough; BCIN-6709 also requires confirming details expansion and return to paused state after `OK`.
- **Impact:** Without these checks, the most important recovery behavior would remain unverified.
- **Method used to investigate:** In the same persistent browser session, clicked `Show Details`, captured the expanded payload, then clicked `OK` and rechecked the editor state.
- **Method used to solve or mitigate:** Verified the authoring page remained open and returned to `Data Retrieval Paused` state after dismissing the dialog.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/08-sort-by-revenue-after-show-details.png`
  - `projects/test-cases/BCIN-6709/screenshots/08-sort-by-revenue-after-ok-click.png`
- **Future guidance:** For BCIN-6709 pause-mode failures, always validate the full chain: Resume → dialog copy → Show Details → OK → paused state restored.

### Problem 23 — Needed to confirm that recovery does not leave Resume hung on the prior failed request
- **Stage:** Live execution / repeated resume validation
- **Symptom:** After the first failure and return to pause mode, it was still unknown whether the next Resume attempt would be blocked by stale request state.
- **Impact:** This is a key BCIN-6709 continuity requirement.
- **Method used to investigate:** In the same persistent browser session, after `Show Details` and `OK`, clicked the Resume selector a second time on the same object.
- **Method used to solve or mitigate:** Observed that the second Resume attempt was accepted and re-triggered the same Application Error path instead of hanging.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/08-sort-by-revenue-second-resume-click.png`
- **Future guidance:** Include a second Resume attempt in BCIN-6709 pause-mode validation to verify the session is not stuck on the previous failed request.

### Problem 24 — Needed to prove the recovered session was still usable for editing, not just paused visually
- **Stage:** Live execution / post-recovery continuation
- **Symptom:** Returning to paused state after `OK` is necessary but not sufficient; the report must also remain interactive for continued work.
- **Impact:** Without a follow-up action, the session could still be superficially restored but not functionally usable.
- **Method used to investigate:** After the second recovery on the same object, opened the `File` menu and then opened `Report Properties` in the same authoring session.
- **Method used to solve or mitigate:** Verified a concrete continuation action succeeded after recovery.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/08-sort-by-revenue-file-menu-after-recovery.png`
  - `projects/test-cases/BCIN-6709/screenshots/08-sort-by-revenue-report-properties-after-recovery.png`
- **Future guidance:** For BCIN-6709, always pair pause-state restoration validation with at least one real follow-up authoring action.

### Problem 25 — Reprompt control has not surfaced yet on the current prompted authoring object
- **Stage:** Live prompt/reprompt probing
- **Symptom:** After Resume → prompt → Apply on `0.3.1a Customer report, prompt, source`, the report rendered data in authoring mode but no visible `Reprompt` control was surfaced in text snapshots.
- **Impact:** Reprompt-specific BCIN-6709 validation remains blocked on this object for now.
- **Method used to investigate:** Reused the same persistent browser session, resumed the paused report, applied the prompt, searched menus, captured post-apply authoring state, and attempted DOM searches for prompt/reprompt-related selectors.
- **Method used to solve or mitigate:** Document the current limitation and keep this object as a prompt baseline candidate while using other objects for failure-path coverage.
- **Outcome:** Partially solved / still blocked for reprompt-specific validation
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-reprompt-after-resume.png`
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-reprompt-after-apply.png`
  - `projects/test-cases/BCIN-6709/screenshots/0.3.1a-reprompt-post-apply-final-state.png`
- **Future guidance:** Do not assume prompted authoring objects automatically expose Reprompt after Apply; verify the actual UI state on each candidate.

### Problem 26 — Reprompt may be present only as an icon/control, not visible text, on dashboard authoring surfaces
- **Stage:** Live reprompt probing
- **Symptom:** No visible `Reprompt` text appeared in the authoring dashboard UI after Apply, but reprompt-related selectors still existed.
- **Impact:** Text-only inspection would have incorrectly concluded reprompt was unavailable.
- **Method used to investigate:** In the same persistent browser session, applied prompt on `Product Dashboard with Prompt`, then clicked known reprompt selectors (`.item.btn.reprompt`, `.mstr-nav-icon.icon-tb_prompt`, etc.).
- **Method used to solve or mitigate:** Selector-based click reopened the prompt UI, confirming the dashboard is reprompt-capable even though the control is not surfaced as visible text in the snapshots.
- **Outcome:** Solved for reprompt capability discovery
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/product-dashboard-with-prompt-authoring.png`
  - `projects/test-cases/BCIN-6709/screenshots/product-dashboard-with-prompt-after-apply.png`
  - `projects/test-cases/BCIN-6709/screenshots/product-dashboard-after-reprompt-selector-click.png`
- **Future guidance:** For reprompt-capability checks, use known reprompt selectors in addition to visible-text inspection.

### Problem 27 — Drifted into dashboard probing when the remaining target scope should stay report-focused
- **Stage:** Candidate selection / reprompt probing
- **Symptom:** Reprompt exploration shifted to `Product Dashboard with Prompt`, which is a dashboard object rather than a report.
- **Impact:** Risk of spending time outside the core report-focused BCIN-6709 validation path.
- **Root cause / hypothesis:** The dashboard exposed reprompt capability more readily than the report objects, but that does not make it the right primary scope target.
- **Method used to investigate:** User clarified that testing should stay on report objects and suggested filtering the Library to `Report`.
- **Method used to solve or mitigate:** Treat dashboard reprompt findings as secondary/background knowledge only; pivot back to report-only discovery and execution.
- **Outcome:** Solved / scope corrected
- **Artifacts / evidence:**
  - User clarification on 2026-03-18 18:43 GMT+8
- **Future guidance:** For BCIN-6709, use dashboard probing only as auxiliary UI knowledge; primary execution must stay on report objects.

### Problem 28 — Report-only prompt candidates may still not expose Reprompt after Apply
- **Stage:** Report-focused reprompt probing
- **Symptom:** `yearAndCostMappedValuePromptFilter` opened in authoring mode, resumed from paused state, and applied prompt successfully, but no reprompt selector surfaced afterward.
- **Impact:** Even with a prompt-capable report, report-based reprompt coverage remains unconfirmed.
- **Method used to investigate:** In the same persistent browser session, opened the report in `/edit`, used Resume, applied the prompt, and attempted known reprompt selectors.
- **Method used to solve or mitigate:** Recorded this report as another prompt baseline candidate, not a reprompt-capable candidate.
- **Outcome:** Solved for classification / still blocked for report-based reprompt capability
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/yearAndCostMappedValuePromptFilter-authoring.png`
  - `projects/test-cases/BCIN-6709/screenshots/yearAndCostMappedValuePromptFilter-after-resume.png`
  - `projects/test-cases/BCIN-6709/screenshots/yearAndCostMappedValuePromptFilter-after-apply.png`
  - `projects/test-cases/BCIN-6709/screenshots/yearAndCostMappedValuePromptFilter-post-apply-no-reprompt-found.png`
- **Future guidance:** Distinguish clearly between prompt-capable reports and reprompt-capable reports; successful prompt apply does not imply reprompt will be available.

### Problem 29 — Some report rows in the Library candidate list do not open reliably from a simple text click
- **Stage:** Report-only candidate discovery
- **Symptom:** Direct text clicks on candidates like `testPromptPropmt` and `template, with system prompt` did not open the object, even though the names are visible in the list.
- **Impact:** Candidate discovery is slower and may require more precise row interaction than simple text clicks.
- **Method used to investigate:** Reused the same persistent browser and attempted direct text clicks on prompt-like report names.
- **Method used to solve or mitigate:** Treat the resulting refreshed candidate list as a valid intermediate state and continue with simpler/narrower names like `system prompt` / `System prompt` next.
- **Outcome:** Partially solved
- **Artifacts / evidence:**
  - `projects/test-cases/BCIN-6709/screenshots/testPromptPropmt-open.png`
  - `projects/test-cases/BCIN-6709/screenshots/template-with-system-prompt-open.png`
- **Future guidance:** When a report row does not open from a text click, continue from the refreshed report-only list and try a simpler nearby candidate or a more precise row interaction.

### Problem 30 — Show Details click failed due to case-sensitive selector mismatch
- **Stage:** Live execution / prompt error handling
- **Symptom:** `Show details` click timed out after `Application Error` dialog appeared.
- **Impact:** Details expansion evidence could not be captured in that attempt.
- **Root cause / hypothesis:** Selector/text used `Show details` while rendered control was `Show Details`.
- **Method used to investigate:** Compared expected text token with rendered dialog label in the same run.
- **Method used to solve or mitigate:** Use exact-case selector/text match for `Show Details`; keep `OK` as fallback to validate recovery continuity when details click fails.
- **Outcome:** Partially solved
- **Artifacts / evidence:**
  - Candidate: `template, olap cube with prompt`
  - Inventory update: `projects/test-cases/BCIN-6709/reports/report-inventory.md`
- **Future guidance:** Treat dialog action labels as case-sensitive; align selectors with exact rendered copy before classifying control failure.

### Problem 31 — Hardcoded edit URL used stale object ID and produced misleading unknown error
- **Stage:** Live candidate validation
- **Symptom:** `template, with system prompt` hit `An unknown error` (500/iServer path) from a direct URL.
- **Impact:** Candidate appeared product-broken, but root cause was stale link/object mismatch.
- **Root cause / hypothesis:** Hardcoded `/edit` URL referenced an outdated object ID.
- **Method used to investigate:** Correlated error with direct URL path and candidate identity.
- **Method used to solve or mitigate:** Mark object as broken candidate; exclude from primary recovery validation path and continue with fresh candidates.
- **Outcome:** Solved
- **Artifacts / evidence:**
  - Candidate note in `projects/test-cases/BCIN-6709/reports/report-inventory.md`
- **Future guidance:** Avoid stale hardcoded edit links; re-open candidates from current Library context or verified fresh IDs.

### Problem 32 — Hierarchy prompt requires pre-selection before Apply is available
- **Stage:** Live prompt execution
- **Symptom:** After Resume on `template with attribute hierarchy prompt`, prompt dialog appeared but `Apply` was unavailable.
- **Impact:** Flow can be misclassified as blocked if hierarchy requirement is not recognized.
- **Root cause / hypothesis:** Hierarchy prompt enforces explicit member selection (e.g., `Year`) before enabling `Apply`.
- **Method used to investigate:** Observed prompt UI state and control availability after Resume.
- **Method used to solve or mitigate:** Add hierarchy-selection step before Apply validation.
- **Outcome:** In progress
- **Artifacts / evidence:**
  - Candidate note in `projects/test-cases/BCIN-6709/reports/report-inventory.md`
- **Future guidance:** For hierarchy prompts, verify mandatory member selection requirements before attempting Apply/error-path classification.

### Problem 33 — Remaining target template reports not discoverable from current Library scope
- **Stage:** Live continuation / candidate navigation
- **Symptom:** Search attempts from Library (`template, olap cube`, exact-name visibility checks) did not surface `template, olap cube with prompt`, `template, with system prompt`, or `template with attribute hierarchy prompt`.
- **Impact:** Could not continue those specific candidate test branches in this pass.
- **Root cause / hypothesis:** Targets are likely outside current visible/favorite scope, require folder navigation, or need fresh object IDs/URLs.
- **Method used to investigate:** Returned to Library, used search input, captured snapshot, and performed exact-name DOM presence checks.
- **Method used to solve or mitigate:** Proceeded with discoverable candidate (`template-bxu`) and classified it as non-recovery candidate; recorded blocker for remaining targets.
- **Outcome:** Partially solved / blocked for target-specific continuation
- **Artifacts / evidence:**
  - Screenshot: `projects/test-cases/BCIN-6709/screenshots/search-olap-cube-template.png`
  - Screenshot: `projects/test-cases/BCIN-6709/screenshots/template-bxu-edit-after-wait.png`
- **Future guidance:** For non-favorite targets, keep fresh object URLs/IDs in inventory before continuation to avoid time loss on rediscovery.

## Reusable Methods That Worked

### Method A — Correct missing planner artifact paths by checking feature-plan outputs
Best for:
- missing QA plan files
- stale planner run references

### Method B — Convert weakly specified scenarios into object-discovery-first execution
Best for:
- plans with missing fixture details
- scenarios dependent on unknown report behavior

### Method C — Use memory + task.json to recover prior failed attempts
Best for:
- avoiding repeated setup mistakes
- understanding known object/configuration problems before rerun

### Method D — Separate inventory, object results, and execution summary
Best for:
- exploratory testing with many reports
- future reproducibility
- auditability

---

## Required Ongoing Practice

From this point forward, every time BCIN-6709 hits a new issue, add a new problem entry here with:
- the problem,
- the method used to investigate,
- the method used to solve or mitigate,
- the final outcome,
- the reusable guidance for next time.
