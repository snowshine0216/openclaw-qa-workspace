Feature QA Plan (BCED-2416)

- EndToEnd
    * Create dashboard from Workstation primary entry point into the new editor <P1>
        - Setup: Workstation is connected to a supported server version for the new editor, the feature is enabled when required by release behavior, and a user with dashboard-create privilege has at least one usable dataset.
        - Action: open Create Dashboard from the main Workstation entry point, select a dataset, and complete the create flow until the new dashboard editor is shown.
            - Expected: the dashboard opens in the new embedded authoring experience, the selected dataset context is preserved, and the initial authoring canvas is usable without unexpected fallback or error.
        - Verification note: confirm the user-visible editor path and shell state rather than internal embedding mechanics.
    * Edit an existing dashboard directly from Workstation and preserve edit context <P1>
        - Setup: a saved dashboard exists, the user has edit privilege, and the dashboard is visible in Workstation navigation.
        - Action: open the dashboard using the Workstation edit entry point and make a visible change in the editor.
            - Expected: the dashboard opens directly in authoring mode, the correct object context is loaded, and the edit session remains stable through the first visible change.
    * Save a newly created dashboard and reopen it from Workstation navigation <P1>
        - Setup: a new unsaved dashboard is open in the new editor and a writable target folder is available.
        - Action: use Save or Save As, complete the native Workstation save dialog, then reopen the saved dashboard from its saved location.
            - Expected: save completes successfully, the dashboard name/location update is visible in Workstation, and reopening returns the same object in a consistent editable state.

- Core Functional Flows
    * Create dashboard from dataset context menu or dataset-specific entry point <P1>
        - Setup: a dataset is visible in Workstation and the user has permission to create dashboards from it.
        - Action: launch dashboard creation from the dataset context and proceed into authoring.
            - Expected: the editor opens with the intended dataset context and no mismatch between entry-point source and authoring state.
    * Use Save As, Set as Template, and related save options through the Workstation-native shell path <P1>
        - Setup: an editable dashboard is open and the save target supports the selected action.
        - Action: invoke Save As and, where applicable, template-related save options.
            - Expected: required save options are present, the native dialog completes correctly, and the resulting object metadata/state matches the selected action.
    * Switch between presentation mode and authoring mode without losing current work context <P1>
        - Setup: a dashboard is open in authoring mode with visible edits or active state.
        - Action: enter presentation mode, then return to authoring mode.
            - Expected: the mode switch succeeds, the correct dashboard remains open, and the authoring context is still coherent after returning.
    * Verify Workstation-native shell synchronization after save or navigation changes <P1>
        - Setup: a dashboard is open in the new editor and Workstation navigation, window title, or object tree are visible.
        - Action: save, rename, or navigate in a way that should update shell-visible metadata.
            - Expected: window title, object-tree placement, and visible dashboard naming refresh correctly without stale or duplicate state.
    * Validate menu and command visibility differences that are expected in the embedded path <P2>
        - Setup: the same workflow is reachable in both legacy and embedded paths or has documented UI differences.
        - Action: inspect the embedded editor menus and execute key authoring commands.
            - Expected: intentionally moved or restyled commands remain discoverable and executable, and missing commands are only those intentionally excluded by design.

- Error Handling / Recovery
    * Edit without data / pause-mode workflow remains recoverable <P1>
        - Setup: a dashboard supports edit-without-data or pause-related behavior and can enter a paused/non-running state.
        - Action: enter the edit-without-data or pause-related workflow, then continue with a visible authoring action or save-related step.
            - Expected: the editor preserves the intended dashboard context, the user is not stranded in an unusable state, and follow-up actions behave consistently.
    * Cancel execution during a slow or running workflow returns the user to a safe editor state <P1>
        - Setup: a dashboard action is in progress long enough for cancel to be meaningful.
        - Action: trigger cancel by using the cancel control or closing the editor while execution is active.
            - Expected: execution is canceled cleanly, the editor or shell lands in a safe understandable state, and no orphaned loading or broken navigation remains.
    * Unsaved changes on close produce the correct user-visible outcome <P1>
        - Setup: a dashboard has unsaved visible changes.
        - Action: close the editor window or use a navigation action that exits edit mode.
            - Expected: the user receives the correct save/discard/cancel handling and the final state matches the chosen option.
    * Error handling remains understandable when failure occurs in different layers <P2>
        - Setup: a recoverable failure can be triggered from either the embedded editor path or the host integration path.
        - Action: trigger the failure once in each relevant path.
            - Expected: the user sees a clear error outcome and a workable recovery path regardless of whether the failure originated in the editor layer or host layer.

- Regression / Known Risks
    * Editor enablement toggle routes to the correct editor and does not leak mixed state <P1>
        - Setup: a release/version combination exists where the new editor can be enabled or disabled from Workstation settings.
        - Action: switch the setting, restart or reconnect if required, and reopen the same dashboard workflow.
            - Expected: Workstation consistently opens the intended editor path, with no duplicate menus, stale commands, or partial state from the other editor.
    * Older or unsupported server versions fall back safely to the legacy editor <P1>
        - Setup: Workstation connects to a server version below the supported threshold for the new editor.
        - Action: run create or edit from the same user entry point used for the new path.
            - Expected: Workstation falls back to the legacy editor cleanly, and the user can still complete the expected workflow without embedded-path errors.
    * Save-related regressions do not recur after creating or renaming dashboards <P1>
        - Setup: a dashboard is created, renamed, or saved into a folder where refresh behavior can be observed.
        - Action: save the object and inspect folder placement, title, and visibility immediately afterward.
            - Expected: the saved object appears in the expected location without requiring misleading manual refresh workarounds.
    * Library-Web intent parity is preserved for core authoring actions <P2>
        - Setup: a comparable action can be observed in both Library Web intent and Workstation embedded authoring.
        - Action: perform a representative authoring action such as create, save, or edit in Workstation.
            - Expected: the user achieves the same intent safely, even if the surrounding desktop chrome differs.
    * Close, session-timeout, and reconnect paths do not strand the user <P1>
        - Setup: an editing session is active and session interruption or reconnect can be simulated.
        - Action: trigger session timeout, reconnect, or close/reopen flow around an in-progress editing context.
            - Expected: the user lands in a safe state with clear next steps, without trapped editor windows or corrupted session behavior.

- Permissions / Security / Data Safety
    * Read-only users cannot perform edit/save actions beyond granted privilege <P1>
        - Setup: a user with view-only or reduced dashboard privilege opens a dashboard available for viewing.
        - Action: attempt to enter edit mode and perform save-related actions.
            - Expected: edit and save restrictions are enforced visibly and consistently with Library Web authorization behavior.
    * Save target restrictions are enforced in Save As flow <P1>
        - Setup: a user can edit a dashboard but lacks permission to save into at least one target location.
        - Action: attempt Save As into the restricted location.
            - Expected: the restricted target cannot be used successfully and the failure is communicated without leaving the editor in a broken state.
    * OAuth / connector authentication succeeds or fails safely in embedded Workstation context <P1>
        - Setup: a dashboard or dataset path requiring OAuth, SDK, or connector authentication is available.
        - Action: create, open, or edit through the embedded authoring path until authentication is required.
            - Expected: authentication handoff completes correctly or fails safely with clear user guidance, and control returns to a usable Workstation/editor state.
    * Sensitive object actions do not bypass expected confirmation or access checks <P2>
        - Setup: an action such as template-related save or conversion requires access/confirmation.
        - Action: attempt the protected action in embedded authoring.
            - Expected: the same visible access-control and confirmation rules are enforced as intended.

- Compatibility / Platform / Environment
    * Version-gated editor selection behaves correctly across supported and unsupported server versions <P1>
        - Setup: one environment meets the supported version threshold and one does not.
        - Action: run the same create or edit workflow in both environments.
            - Expected: supported environments use the new path when enabled, unsupported environments use legacy fallback, and neither path shows cross-version leakage.
    * Local mode remains on the expected legacy behavior boundary <P2>
        - Setup: Workstation local mode is available and the feature documentation still expects legacy behavior there.
        - Action: create, save, and reopen a dashboard in local mode using the documented workflow.
            - Expected: local mode follows the documented legacy/new-editor boundary and does not claim unsupported parity behavior.
    * Platform-specific desktop behavior remains acceptable across available desktop hosts <P2>
        - Setup: equivalent coverage can be run on the supported desktop platforms for this release.
        - Action: run representative create/open/save/close flows on each platform.
            - Expected: no platform-specific shell issue blocks core authoring continuity.
    * Workstation-only restriction is enforced for the embedded authoring route <P2>
        - Setup: a non-Workstation or invalid host context is available for negative validation, or evidence of host restriction can be observed through supported test setup.
        - Action: attempt to invoke the embedded authoring route outside its allowed Workstation context.
            - Expected: the system blocks unsupported use safely and does not expose a partially functional authoring path.

- Observability / Performance / UX Feedback
    * Cold first create or first open remains usable and predictable <P1>
        - Setup: cold-start conditions are prepared and no warm cache is present.
        - Action: create a new dashboard or open an existing one for the first time.
            - Expected: the dashboard opens within an acceptable user-tolerable time, visible progress feedback is understandable, and no misleading stall state appears.
    * Warm reopen or cached reopen improves or stabilizes user experience <P2>
        - Setup: the same dashboard has already been opened once in the session.
        - Action: reopen the dashboard or repeat the same authoring entry path.
            - Expected: reopen behavior is at least not worse than cold start and does not show stale cached content.
    * Scroll and manipulation responsiveness stay usable during authoring <P1>
        - Setup: a dashboard with enough content to exercise scrolling and common interactions is open.
        - Action: scroll, move through authoring interactions, and perform visible manipulations.
            - Expected: interactions remain usable and responsive, without severe lag, frozen scroll, or obvious degradation versus the intended experience.
    * User-visible feedback remains clear during load, cancel, and recovery situations <P2>
        - Setup: a workflow can transition through loading, cancel, and recovery states.
        - Action: perform the workflow and observe each state change.
            - Expected: status, progress, and recovery cues are understandable to the user without relying on internal logs.

- Out of Scope / Assumptions
    * Confluence traceability mismatch is carried as an explicit planning assumption
        - Reason: the provided design page is keyed to `BCIN-7289`, while the requested feature is `BCED-2416`.
        - Evidence: `context/confluence_normalized_summary_BCED-2416.md`
    * Detailed NFR pass/fail thresholds are not treated as fixed acceptance criteria
        - Reason: the design leaves several NFR sections incomplete, including explicit performance thresholds, telemetry, accessibility, and detailed automation commitments.
        - Evidence: `context/confluence_normalized_summary_BCED-2416.md`
    * Exhaustive deployment-type deep coverage is not assumed for this draft
        - Reason: source evidence names many deployment types but does not define the required test depth for each in this run.
        - Evidence: `context/coverage_gaps_BCED-2416.md`
