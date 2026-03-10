Feature QA Plan (BCIN-7289)

- EndToEnd
    * Edit an existing report in Workstation using the embedded report editor path <P1>
        - Setup: Workstation is connected to a 26.04+ environment that supports the embedded editor, the new-editor preference is enabled, and an editable report is available.
        - Action: launch report editing from the normal Workstation edit entry point and make a visible authoring change.
            - Expected: Workstation opens the embedded report editor instead of the classic path, the correct report context loads, and the edit session remains stable through the first visible authoring action.
    * Create a new report from a primary Workstation entry point and reach a usable authoring state <P1>
        - Setup: a user with report-creation privilege is connected to a supported environment and has access to the required source object or creation path.
        - Action: create a new report from the primary Workstation entry point such as the file menu or plus icon and proceed until the authoring surface is ready.
            - Expected: the correct embedded create route opens, the intended source/context is preserved, and the user reaches a usable authoring state without unexpected fallback or error.
    * Save a created or edited report, then reopen it from Workstation in a consistent state <P1>
        - Setup: a report with visible changes is open in embedded authoring and a writable target location is available.
        - Action: use Save or Save As through the available Workstation-integrated flow, then reopen the saved report from Workstation.
            - Expected: the save completes successfully, the saved object is visible from the expected location, and reopening returns the report in a correct editable state with updated shell metadata.

- Core Functional Flows
    * Select the correct editor path based on version and new-editor preference <P1>
        - Setup: test environments exist for both supported and unsupported server versions, and the preference can be toggled.
        - Action: open the same report-authoring workflow across the version and preference combinations.
            - Expected: supported + enabled cases open the embedded editor, unsupported or disabled cases use the classic path, and no mixed menus or partial initialization appears.
    * Create subset, dataset-origin, MDX-origin, or cube-origin reports with correct route/context mapping <P1>
        - Setup: each supported creation source is available with valid user access.
        - Action: launch report creation from each source-specific entry point.
            - Expected: the embedded editor opens with the correct report type, source metadata, and create/edit state for that path.
    * Open specialized report routes such as Python or FFSQL paths without losing authoring context <P2>
        - Setup: Python-query or free-form-SQL report flows are available in the test environment.
        - Action: launch the specialized report flow from its supported Workstation entry point.
            - Expected: the route opens successfully, the editor remains usable, and the correct report context is preserved.
    * Bridge native Workstation dialogs and utilities from embedded authoring <P1>
        - Setup: a report is open in embedded authoring and actions such as object editor, properties, or save as are available.
        - Action: invoke the native-integrated actions from the embedded editor flow.
            - Expected: each action opens the intended Workstation-native dialog or utility, returns control to the same report, and leaves the editor window in a stable state.
    * Preserve user comments dialog behavior in save and template-related flows <P1>
        - Setup: a report is open in embedded authoring and a save or template-related action that should involve user comments is available.
        - Action: trigger the save or template-related action that requires user comments.
            - Expected: the expected comments dialog appears through the Workstation-integrated flow, accepts the user input correctly, and returns to the same report with the requested action completed or safely canceled.
    * Convert the report to cube or datamart from embedded authoring <P1>
        - Setup: a report is open in embedded authoring and the current user/environment supports conversion.
        - Action: invoke convert to cube or convert to datamart from the embedded authoring flow.
            - Expected: the correct confirmation or follow-up dialog appears, the conversion workflow proceeds through the intended Workstation-integrated path, and the report/editor remains in a coherent state afterward.
    * Validate intentional menu and UI differences without losing capability access <P2>
        - Setup: embedded and classic authoring paths or documented UI differences are available for comparison.
        - Action: inspect menus and invoke key commands in embedded authoring.
            - Expected: intentionally moved or restyled actions remain discoverable and executable, and only intentionally excluded classic-only UI elements are absent.
    * Follow link and drill flows that open or transform report context <P1>
        - Setup: a report contains supported drill or link paths.
        - Action: perform a drill or link action that should open or transition to another report-related context.
            - Expected: the correct target opens in the intended window behavior, the resulting report can still be edited or saved as expected, and no stale source context remains.

- Error Handling / Recovery
    * Fall back safely when the embedded editor path is unavailable or fails during launch <P1>
        - Setup: the report is opened either against an unsupported environment or in a reproducible launch-failure condition for the embedded path.
        - Action: launch report authoring through the normal Workstation entry point.
            - Expected: Workstation opens the next valid editor path such as the classic editor window, and the user does not remain in a partially initialized embedded window or dead-end state.
    * Preserve report state through prompt, reprompt, or pause-mode workflows <P1>
        - Setup: a report flow requiring prompts or pause-mode behavior is available.
        - Action: enter the prompted or paused flow, resolve prompts as needed, and continue editing.
            - Expected: the report remains in the expected state, prompt answers are applied correctly, and the user can continue authoring without context loss.
    * Cancel or close from a running or loading report without leaving the wrong surface behind <P1>
        - Setup: a report is loading, running, or otherwise in a state where cancel/close actions are meaningful.
        - Action: use cancel, close, go back, go home, or exit-edit-mode from the embedded flow.
            - Expected: the report or editor closes or recovers in a safe understandable way, unsaved-change handling appears when needed, and the user is not dumped into an unexpected Library surface or orphaned window.
    * Recover from a handled error and continue editing when recovery is expected <P1>
        - Setup: a recoverable failure can be triggered in the embedded editor or host-bridge path.
        - Action: trigger the failure and follow the offered recovery path.
            - Expected: the user receives a clear error outcome and can continue editing the same report or safely exit it without stale report state, broken document view, or hidden partial failure.
    * Show the correct user-visible outcome when the error is handled in editor logic versus Library logic <P1>
        - Setup: one failure can be reproduced in an editor-handled path and another in a Library-handled path.
        - Action: trigger each failure and dismiss the resulting error dialog.
            - Expected: each path follows its intended visible behavior, such as dismissing the error and staying in context versus closing the editor window when that is the designed outcome.
    * Maintain sensible undo/redo or post-recovery behavior after an interrupted authoring action <P2>
        - Setup: a report manipulation can be interrupted by error, prompt, or recovery handling.
        - Action: perform the manipulation, interrupt it through the supported failure path, then continue editing.
            - Expected: subsequent editing behavior is consistent and does not silently corrupt history or report state.

- Regression / Known Risks
    * Save, Save As, and template-related flows do not regress under embedded authoring <P1>
        - Setup: an editable report is open and template-capable save options are available where supported.
        - Action: use save-related flows including Save As and template-related actions.
            - Expected: the correct dialog path appears, required options are available, and the saved object state, title, and visibility refresh correctly.
    * Window title, object visibility, and shell metadata stay in sync after report changes <P1>
        - Setup: shell-visible report metadata is observable before and after a report save, rename, or route transition.
        - Action: make a report change that should update title or object visibility and then observe Workstation shell state.
            - Expected: title, visible object placement, and related shell metadata refresh correctly without stale or duplicate state.
    * Feature-flag and application-setting permutations do not expose the wrong report-editor capabilities <P1>
        - Setup: report-editor-related feature flags or application settings can be varied across supported combinations.
        - Action: open report-authoring workflows under each configuration permutation.
            - Expected: gated functionality appears or hides as intended, and hidden functionality is not indirectly exposed through embedded or fallback paths.
    * Visual parity regressions in the report-editor surface are caught alongside workflow regressions <P2>
        - Setup: report pages or sections with visible icons, labels, or section affordances are available.
        - Action: inspect the report editor after opening representative authoring pages and interactions.
            - Expected: visuals remain current and coherent, and no stale icons or obviously inconsistent report-editor affordances reappear.
    * Mixed-version environment usage does not create duplicate or misleading editor behavior <P1>
        - Setup: the same Workstation client can connect to both pre-26.04 and 26.04+ environments.
        - Action: switch between environments and launch the same authoring workflows.
            - Expected: Workstation chooses the correct editor behavior for each environment without duplicate menu confusion or stale preference leakage.

- Permissions / Security / Data Safety
    * Respect report edit and save privileges in embedded authoring <P1>
        - Setup: users with different report privileges are available, including at least one read-only or restricted user.
        - Action: attempt to open, edit, and save reports through embedded authoring.
            - Expected: only allowed actions succeed, restricted actions are blocked visibly, and behavior remains consistent with intended Library-side authorization.
    * Enforce save-destination restrictions and protected-action checks <P1>
        - Setup: a user can edit a report but lacks permission for at least one save target or protected action.
        - Action: attempt Save As or another protected report action into the restricted target.
            - Expected: the restriction is enforced clearly and the report/editor remains in a usable state afterward.
    * Handle session timeout or auth interruption safely in embedded report editing <P1>
        - Setup: a session timeout or reauthentication scenario can be reproduced while a report is open for authoring.
        - Action: let the session expire or trigger the auth interruption, then continue the workflow.
            - Expected: the user receives a safe recovery path, is not dropped onto the wrong surface unexpectedly, and does not gain access beyond current entitlement.
    * Block unsupported-origin or non-Workstation use of embedded authoring safely <P2>
        - Setup: a supported negative test setup exists for invoking the embedded authoring route outside Workstation expectations.
        - Action: attempt to use the embedded authoring path from the unsupported context.
            - Expected: the system fails safely with blocked behavior rather than exposing a partially working unsupported authoring surface.

- Compatibility / Platform / Environment
    * Validate the supported-version matrix for embedded vs classic report authoring <P1>
        - Setup: at least one pre-26.04 environment and one 26.04+ environment are available.
        - Action: run the same report create/edit workflow in both environments.
            - Expected: embedded authoring activates only for supported environments and classic behavior remains functional for unsupported ones.
    * Validate preference-driven rollout behavior across reconnect or restart boundaries <P1>
        - Setup: the new-editor preference can be changed and Workstation reconnect or restart can be performed.
        - Action: toggle the preference, reconnect or restart as required, and reopen report-authoring workflows.
            - Expected: the chosen editor path is stable and no stale previous-state routing remains.
    * Validate mixed-environment customer usage on the same Workstation client <P2>
        - Setup: the same client profile can reach both supported and unsupported environments.
        - Action: move between environments and repeat representative authoring tasks.
            - Expected: environment-specific behavior stays correct for each connection and does not contaminate the other environment’s routing or menu state.
    * Validate platform-aware desktop behavior where supported hosts differ <P2>
        - Setup: equivalent report-authoring coverage can be executed on the supported desktop hosts for the release.
        - Action: run representative create, edit, save, and close flows on each host.
            - Expected: host-specific shell differences do not break core report-authoring continuity.

- Observability / Performance / UX Feedback
    * Cold first open or first create remains usable in embedded report authoring <P1>
        - Setup: no warm cache is present and the report/editor has not been opened in the current session.
        - Action: open or create a report through the embedded path for the first time.
            - Expected: the report reaches a usable state within a reasonable user-tolerable time, progress/loading feedback is understandable, and no misleading frozen state appears.
    * Warm reopen behavior improves or at least stabilizes after first load <P2>
        - Setup: the same report has already been opened once in the session.
        - Action: reopen the report or repeat the same authoring route.
            - Expected: warm behavior is not worse than cold behavior and does not rely on stale or incorrect cached state.
    * Scroll and common report manipulations remain responsive in embedded mode <P1>
        - Setup: a report with enough content to exercise scrolling and common manipulations is open.
        - Action: scroll and perform common report-authoring interactions.
            - Expected: the report remains usable and responsive, without severe lag, stuck scroll, or obviously degraded interaction quality.
    * User-visible load, cancel, and error feedback remains understandable <P2>
        - Setup: a report flow can pass through load, cancel, and error states.
        - Action: execute the flow and observe the visible feedback.
            - Expected: users can understand what is happening and what to do next without depending on internal logs.

- Out of Scope / Assumptions
    * BCED-2416 dashboard evidence is used only as an analogous heuristic source
        - Reason: BCED-2416 describes dashboard embedding migration, not the formal scope of BCIN-7289 report editor work.
        - Evidence: `context/jira_normalized_summary_BCIN-7289_report-editor.md`
    * BCIN-6709 recovery patterns are used only as analogous risk heuristics
        - Reason: BCIN-6709 informs likely report-state failure modes but is not formal scope for BCIN-7289.
        - Evidence: `context/qa_gap_risk_summary.md`
    * Incomplete NFR sections are treated as planning gaps, not finalized acceptance criteria
        - Reason: the design does not fully define quantitative performance targets, final accessibility commitments, or detailed telemetry/security checklist outcomes.
        - Evidence: `context/confluence_normalized_summary_BCIN-7289_report-editor.md`
