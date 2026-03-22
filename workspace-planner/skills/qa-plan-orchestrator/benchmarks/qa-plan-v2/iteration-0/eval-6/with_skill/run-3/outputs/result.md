# P4B-LAYERING-001 Assessment

## Scope

This review is limited to:

- the local `qa-plan-orchestrator` skill snapshot under `./skill_snapshot`
- the blind BCED-2416 fixture bundle under `./inputs/fixtures/BCED-2416-blind-pre-defect-bundle/`
- the benchmark focus for `phase4b`: canonical top-layer grouping without collapsing scenarios

Blind evidence handling:

- used the copied fixture materials only
- treated `BCED-2416.customer-scope.json` as the customer-signal boundary
- did not rely on linked non-customer issue analysis to justify grouping decisions

## Verdict

`Advisory verdict: satisfies the phase4b case on static review.`

The skill snapshot explicitly covers the case focus and aligns with the `phase4b` contract:

- `skill_snapshot/references/phase4b-contract.md` requires canonical top-layer grouping while preserving subcategory, scenario, atomic action, and observable outcome layers.
- `skill_snapshot/scripts/lib/spawnManifestBuilders.mjs` tells the phase4b subagent to read the Phase 4a draft, group into canonical top-layer labels, preserve subcategory and scenario granularity, avoid silent coverage shrinkage, keep exception comments when no canonical layer fits, and leave few-shot cleanup to Phase 6.
- `skill_snapshot/scripts/lib/runPhase.mjs` validates phase4b output with:
  - round progression
  - coverage preservation against the prior draft with `allowTopLayerChange: true`
  - canonical phase4b category layering
  - XMindMark hierarchy
  - executable-step validation
  - minimum E2E coverage
- `skill_snapshot/scripts/lib/qaPlanValidators.mjs` rejects:
  - non-canonical top-layer labels without the required exception comment
  - missing subcategory or scenario layers under a top category
  - silent coverage regression from the Phase 4a input
  - collapsed report-editor coverage where Workstation functionality and the Library-vs-Workstation gap stop being separately represented when those topics are in scope

## Why This Covers The Benchmark Focus

The benchmark asks for canonical top-layer grouping without collapsing scenarios. The snapshot addresses that in three layers:

1. Contract layer

- Phase 4b is defined as the canonical top-layer grouping pass, not a rewrite pass.
- Anti-compression is explicit: top-layer grouping must not merge away scenario granularity.
- Few-shot cleanup is explicitly deferred to Phase 6, which prevents Phase 4b from using cleanup as a pretext to compress coverage.

2. Prompting layer

- The generated phase4b task text explicitly instructs the writer to preserve subcategory and scenario granularity.
- The same task text explicitly says grouping and refactor may not silently shrink coverage.

3. Validation layer

- Post-validation compares the Phase 4b draft against the Phase 4a draft and fails silent coverage regressions even when top-layer labels change.
- Category validation enforces the canonical taxonomy and the required hierarchy shape for grouped output.

## BCED-2416 Scenario Separation That Must Survive Phase 4b

The blind fixture bundle describes several distinct scenario families. A compliant Phase 4b grouping may reorganize them under canonical top layers, but it should not collapse them into a single parity-or-migration bucket.

Minimum evidence-backed separations for BCED-2416:

- activation and launch of the new editor from Workstation entry points
- editing an existing dashboard versus editing without data in pause mode
- save and save-as behavior through the native Workstation dialog
- cancel and close behavior while execution is active
- session-timeout handling through a native error dialog rather than Library login or homepage behavior
- navigation/link behavior inside the editor
- export behavior
- dataset and data-source flows
- compatibility routing between new WebView editor, legacy fallback, and local mode behavior
- privilege and ACL enforcement
- performance degradation and scroll smoothness risks
- shell and menu-bar regressions

Those are materially different user-visible outcomes and belong as separate scenarios after grouping.

## Minimal Phase4b Grouping Sketch For BCED-2416

This is not a full runtime draft. It is a compact grouping sketch showing the expected top-layer behavior for this case.

```md
Feature QA Plan (BCED-2416)

- EndToEnd
    * Dashboard authoring journey
        - Enable the new dashboard editor and create a dashboard from a dataset <P1>
            - Turn on Help -> Enable New Dashboard Editor
                - Start a new dashboard from a Workstation entry point
                    - Select a dataset and create the dashboard
                        - The WebView-based editor opens
                        - Save opens the native Workstation dialog

- Core Functional Flows
    * Authoring entry paths
        - Edit an existing dashboard directly <P1>
            - Open the dashboard from Workstation edit entry
                - The authoring editor opens directly
        - Edit without data enters pause mode <P1>
            - Open the dashboard with Edit without data
                - The editor enters pause mode
    * Save and output operations
        - Save As shows Workstation-native save options <P1>
            - Save the dashboard as a new item
                - The native Workstation save dialog appears
                - The save flow exposes the expected save options
        - Export produces the requested output <P2>
            - Export the dashboard
                - The output follows the selected export settings
    * Dataset and data-source workflows
        - Add or replace datasets from the editor <P2>
            - Open dataset management in the editor
                - Dataset dialogs function correctly

- Error Handling / Recovery
    * Cancel and close
        - Cancel stops execution cleanly <P1>
            - Start a dashboard action that can be cancelled
                - Cancel from the editor
                    - Execution stops cleanly
        - Close from X while busy does not crash <P1>
            - Close the editor while the dashboard is busy
                - The running execution is cancelled
                - Workstation does not crash
    * Session and data errors
        - Session timeout stays in native Workstation recovery flow <P1>
            - Allow the session to expire in the editor
                - A native error dialog appears
                - The flow does not jump to Library login or homepage
        - Unpublished dataset insertion shows a clear error <P2>
            - Insert an unpublished dataset
                - A clear user-visible error is shown

- Regression / Known Risks
    * Navigation and shell regressions
        - Same-tab dashboard link does not trigger save workflow <P2>
            - Open a dashboard link in the same tab
                - The editor does not start an unexpected save flow
        - Dashboard-to-dashboard navigation does not empty the editor <P2>
            - Navigate to another dashboard from a dashboard link
                - The editor remains populated
        - Menu-bar and command regressions stay fixed <P2>
            - Exercise close, save dropdown, and edit-without-data controls
                - Only one X button is visible
                - Save dropdown appears only when appropriate
                - Duplicate Edit without data entries do not appear

- Compatibility
    * Version routing
        - Supported server version uses the WebView editor <P1>
            - Open the editor against a supported server version
                - The new editor is used
        - Older server version falls back without workflow break <P1>
            - Open the editor against an older server version
                - The legacy editor is used
                - The workflow remains usable
    * Local mode behavior
        - Local mode remains on the legacy editor path until retirement <P2>
            - Use local mode editing
                - The existing local-mode editor behavior remains intact
        - Re-edit after local Save As shows the new style when expected <P2>
            - Save to local format and reopen for editing
                - The expected editor style is shown on re-edit

- Security
    * Privilege enforcement
        - User without edit privilege cannot open authoring <P1>
            - Attempt to open the authoring editor without edit access
                - Access is blocked
                - ACL behavior matches Library Web

- Performance / Resilience
    * Load and interaction performance
        - First create/open latency remains separately visible as a risk <P2>
            - Create or open a dashboard for the first time
                - The documented degradation is observable and bounded
        - Later opens benefit from caching <P2>
            - Reopen a previously opened dashboard
                - Open performance improves through caching
        - Scroll smoothness remains a separate interaction risk <P2>
            - Scroll within the dashboard
                - Interaction smoothness is evaluated separately from open-time latency
```

## Expectation Check

- `[phase_contract][advisory] Case focus is explicitly covered: canonical top-layer grouping without collapsing scenarios` -> `met`
- `[phase_contract][advisory] Output aligns with primary phase phase4b` -> `met`

## Limits

- I could not execute the local phase4b script tests because this workspace does not have `node` installed.
- Static implementation evidence is still strong because the contract, manifest text, post-validation path, and validator logic all point at the same phase4b behavior.
