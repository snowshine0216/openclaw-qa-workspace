Feature QA Plan (BCIN-7289)

- EndToEnd
    * Create a new report in Workstation with the embedded Library report editor enabled <P1>
        - Setup: user has report-authoring privileges, the new report editor preference is enabled in Workstation, the target environment supports the embedded report editor, and a project is available for saving a new report
        - Action: create a new report from Workstation, add at least one attribute and one metric in the embedded editor, add a report filter or prompt where applicable, resume data retrieval, and save the report through the native Workstation save flow
            - Expected: the embedded report editor opens inside Workstation without redirecting the user to standalone Library, the report renders after data retrieval resumes, the native Workstation save flow completes successfully, and the saved report appears in the expected Workstation location with the saved name
        - Verification note: reopen the saved report from Workstation and confirm the authored objects and saved definition persist
    * Open and edit an existing report in Workstation with the embedded editor enabled <P1>
        - Setup: user has edit permission on an existing server-based report and the new report editor preference is enabled
        - Action: open the existing report from Workstation, change the report structure or filter definition in the embedded editor, save the changes, close the editor, and reopen the report from Workstation
            - Expected: the existing report opens in the embedded editor with the current definition intact, the edit can be saved successfully, and reopening the report shows the updated definition rather than the original one
        - Verification note: include one report fixture with prompts or filters to confirm the edited definition remains executable after reopening
    * Recover cleanly when embedded report authoring is interrupted by startup failure, auth expiry, or execution cancellation <P1>
        - Setup: the new report editor preference is enabled and a reproducible failure condition is available, such as embedded-editor startup failure, forced session timeout, or cancellation while a prompted or executing report is active
        - Action: trigger one interruption path during report authoring in Workstation and attempt the supported recovery action, such as fallback editor selection, re-authentication, cancel, or close
            - Expected: the user is not stranded in a Library login page, Library home page, blank editor shell, or crash state; Workstation either recovers cleanly or falls back to the next registered editor path with an actionable result
        - Comment: the exact failure-injection mechanism for startup fallback is not yet documented; align with development for the most reliable trigger before execution
- Core Functional Flows
    * Preference-gated rollout for the new report editor <P1>
        - Setup: Workstation has a report object available and the user can change the new report editor preference
        - Action: enable the new report editor preference, open a report in Workstation, then disable the preference and open the same or another report again
            - Expected: with the preference enabled, Workstation opens the embedded Library report editor; with the preference disabled, Workstation uses the legacy editor path instead of the embedded one
    * Fallback editor sequencing when multiple editors are registered <P1>
        - Setup: Workstation is configured with multiple registered editors for the report object type and the first editor can be forced to fail during initialization
        - Action: open a report while the first registered editor is in a failing state
            - Expected: Workstation skips the failed editor and opens the next registered editor in sequence instead of leaving the user in a dead-end state
        - Comment: if the failure trigger cannot be reproduced from UI-only controls, preserve the case and execute it with a supported development or test hook
    * Prompt-heavy report authoring uses the embedded Library prompt behavior inside Workstation <P1>
        - Setup: an existing report or new report fixture requires at least one prompt interaction, preferably including a report filter or object-selection path that is known to be sensitive in the legacy Workstation editor
        - Action: open the report in the embedded editor, answer the prompt, modify the prompted or filtered content, and save the report
            - Expected: the prompt renders correctly inside Workstation, accepts the user’s answers, updates the report as expected, and does not fall back to legacy prompt behavior or show broken prompt UI
    * Save and save-as use native Workstation integration rather than a broken Library-only flow <P1>
        - Setup: the user can save a new report and also save an existing report as a different object or into a different folder
        - Action: save a newly created report, then perform save-as for an edited report from the embedded editor path
            - Expected: Workstation shows the expected native save experience, the saved object is created in the selected location, the object name shown in the Workstation shell updates correctly, and the saved report is visible without requiring an abnormal manual refresh step
    * Report authoring basics remain usable in the embedded editor <P1>
        - Setup: a report fixture exists for object placement, filtering, and data retrieval
        - Action: add or remove report objects, adjust a filter, pause and resume data retrieval, and review the resulting report in the embedded editor
            - Expected: the editor supports the expected report-authoring basics in Workstation, and the visible behavior matches the intended Library-style authoring experience instead of degrading into partial or blocked functionality
    * Report-specific advanced surfaces remain reachable when they are in-scope <P2>
        - Setup: a report fixture is available that exposes report filters, advanced properties, or SQL-related surfaces in the product build under test
        - Action: open the relevant advanced or report-detail surface from the embedded editor and make one reversible change or review the visible information
            - Expected: the user can reach the supported report-detail surfaces from Workstation and the UI is complete enough to use, without clipped dialogs, missing controls, or orphaned windows
- Error Handling / Recovery
    * Embedded editor startup failure provides a usable fallback path <P1>
        - Setup: the new editor preference is enabled and the first registered embedded editor can be made unavailable or forced to fail at startup
        - Action: attempt to open a report from Workstation while the failing editor path is active
            - Expected: Workstation either opens the next registered editor automatically or shows a clear, actionable error that does not trap the user in an unusable shell
    * Session timeout during embedded report authoring does not redirect the user into a Library dead-end <P1>
        - Setup: a report is open in the embedded editor and the session can be expired during editing or execution
        - Action: let the session expire while the report editor is open, then attempt to continue, save, cancel, or close the report from Workstation
            - Expected: Workstation does not display a standalone Library login page or Library home page inside the embedded frame, and the user can recover the session or exit the editor without losing control of the Workstation shell
    * Cancel or close while a report is executing behaves cleanly <P1>
        - Setup: a report is executing, prompting, or resuming data retrieval in the embedded editor
        - Action: click cancel, close the editor, or dismiss a prompt flow during execution
            - Expected: Workstation cancels or closes the report cleanly without crash, without leaving a broken loading state, and without preventing the report window from being closed afterward
    * Save failure surfaces a usable recovery path <P1>
        - Setup: a report is open in the embedded editor and a reproducible save failure condition is available, such as permission denial or an invalid target location
        - Action: attempt to save the report into the failing condition and then correct the issue or choose a valid alternative
            - Expected: the product shows a clear save failure message, the report remains in a recoverable editing state, and the user can retry save successfully after correcting the problem
- Regression / Known Risks
    * Workstation shell and embedded editor toolbar integration stays visually and functionally correct <P1>
        - Setup: a report is open in the embedded editor within Workstation
        - Action: inspect and use the shell-level and editor-level toolbars during common authoring actions such as save, filter, prompt interaction, and close
            - Expected: the toolbar area does not show overlapping controls, duplicate close affordances, broken spacing, or controls that become unresponsive after navigation inside the embedded report editor
    * Application-level or Library-only settings do not bleed into embedded report authoring in Workstation <P1>
        - Setup: environment settings or application settings are available that could affect embedded behavior
        - Action: open a report in the embedded editor while those settings are active and use the core authoring controls
            - Expected: Workstation applies the intended embedded-authoring behavior without inheriting unrelated Library-only restrictions or malformed toolbar states
    * Save metadata and shell state remain synchronized after create or save-as <P1>
        - Setup: a new report is created or an existing report is saved as a new object from the embedded editor
        - Action: complete the save flow and then inspect the visible report title, folder location, and reopen behavior in Workstation
            - Expected: the title shown in Workstation matches the saved object, the report appears in the selected location, and reopening the saved object does not reveal stale or mismatched shell state
    * Report authoring does not regress into partial functionality after embedded navigation events <P2>
        - Setup: a report is open in the embedded editor and the workflow includes prompt application, filter editing, and data retrieval transitions
        - Action: perform several normal authoring actions in sequence and then continue editing after each transition
            - Expected: the editor remains fully usable after each transition and does not become blank, unscrollable, or stuck in a half-loaded state
- Permissions / Security / Data Safety
    * Unauthorized users cannot edit or save reports through the embedded editor <P1>
        - Setup: a user account exists with browse or execute access but without edit/save authority for the target report
        - Action: open the report from Workstation and attempt to edit and save it through the embedded editor path
            - Expected: Workstation visibly blocks the unauthorized edit or save action and does not allow the user to persist changes through the embedded editor
    * Authorized users retain expected report-authoring capability through the embedded editor <P1>
        - Setup: a user account exists with the required authoring privileges and access to the target report/project
        - Action: open, edit, and save a report through the embedded editor path in Workstation
            - Expected: the authorized user can complete the authoring workflow successfully without privilege-related false failures
    * Prompt answers, filters, and report changes stay scoped to the intended report workflow <P2>
        - Setup: a prompted report or filter-sensitive report fixture is available and the user can modify prompt answers or filter definitions
        - Action: answer prompts, change filters, save or cancel the report workflow, and reopen the report as needed
            - Expected: the saved or canceled outcome reflects only the intended report changes, and the editor does not leak unrelated state across reports or users
- Compatibility / Platform / Environment
    * Embedded report authoring behaves correctly in a supported server environment <P1>
        - Setup: Workstation is connected to a server environment that supports the embedded report editor path and modeling service prerequisites are satisfied
        - Action: create or open a report through the embedded editor path in that environment
            - Expected: the embedded editor launches and remains usable for the supported environment without prerequisite-related blockers
    * Unsupported or older environment uses the expected legacy path instead of a broken embedded path <P1>
        - Setup: Workstation is connected to an environment where the embedded report editor is unsupported or intentionally unavailable
        - Action: open or create a report from Workstation while the new editor preference is enabled
            - Expected: Workstation uses the supported fallback behavior, such as the legacy editor path, instead of opening a broken or partially initialized embedded report editor
    * Representative report types remain usable or are explicitly excluded <P2>
        - Setup: representative report fixtures are available, such as a standard report, a prompt-heavy report, and any template-based or advanced report type that the build claims to support
        - Action: open each representative fixture through the embedded path and perform one meaningful authoring step
            - Expected: supported report types behave correctly in the embedded editor, and unsupported report types are blocked with an explicit product limitation rather than a broken editing experience
- Observability / Performance / UX Feedback
    * First-time embedded report-editor launch gives acceptable visible feedback <P1>
        - Setup: Workstation has not yet warmed the embedded editor resources for the current session and a report can be opened for the first time
        - Action: create or open a report through the embedded editor path for the first time in the session
            - Expected: the user sees clear loading feedback while the embedded editor initializes, the editor eventually opens successfully, and the first-load delay does not leave the user guessing whether the action failed
    * Repeat open and common authoring actions remain responsive enough for normal use <P2>
        - Setup: at least one report has already been opened in the embedded editor during the session
        - Action: reopen a report, adjust report content, resume data retrieval, and scroll or navigate within the editor
            - Expected: repeat opens and common editing interactions respond consistently enough for normal authoring without obvious regressions beyond the expected embedded-editor overhead
    * Error and state feedback remains clear during save, auth, and execution transitions <P2>
        - Setup: a report is open in the embedded editor and one transition state can be triggered, such as save completion, session expiry, or cancel during execution
        - Action: trigger the transition and observe the Workstation-visible feedback presented to the user
            - Expected: the product provides clear visible feedback for the transition, including success, failure, loading, or recovery states, so the user can understand what to do next without guessing
- Out of Scope / Assumptions
    * Exact minimum version matrix for embedded report editor support
        - Reason: the primary feature Jira does not explicitly define the exact release threshold for supported and unsupported server/workstation combinations
        - Evidence: `context/jira_issue_BCIN-7289.md`
    * Full parity for every advanced report subtype in the first validation round
        - Reason: BCIN-7289 states the embedding direction and the prompt-technology motivation, but does not explicitly enumerate every report subtype for initial rollout
        - Evidence: `context/jira_issue_BCIN-7289.md`, `context/research_workstation_library_report_editor_gap.md`
    * A deterministic UI-only method to force first-editor startup failure
        - Reason: BCIN-7603 requires fallback sequencing, but the exact repeatable failure trigger is not documented in the available evidence
        - Evidence: `context/jira_issue_BCIN-7289.md`, `context/coverage_gaps_BCIN-7289.md`
