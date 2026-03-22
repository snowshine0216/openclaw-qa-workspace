Feature QA Plan (BCED-2416)

<!-- trace: BCED-2416.issue.raw.json -->
<!-- trace: BCED-2416.customer-scope.json -->
<!-- trace: BCED-2416-embedding-dashboard-editor-workstation.md -->
<!-- benchmark_note: minimal synthetic phase4b draft for canonical top-layer grouping evaluation -->

- EndToEnd
    * Authoring entry and completion journeys
        - Create dashboard from dataset after enabling the new editor <P1>
            - Open Workstation and enable the new dashboard editor
                - Start creating a dashboard from a dataset
                    - Select a dataset and click Create
                        - The embedded dashboard editor opens inside Workstation
                        - The author stays in the new editor instead of the legacy editor
        - Edit existing dashboard without data enters pause mode <P1>
            - Open an existing dashboard in Workstation
                - Choose Edit without data
                    - Wait for the editor to load
                        - The dashboard opens in pause mode
                        - The author can continue editing without running data first
        - Save uses the native dialog and keeps the dashboard visible without refresh <P1>
            - Open a new or modified dashboard in the embedded editor
                - Choose Save
                    - Complete the native Workstation save dialog
                        - The native Workstation save dialog appears instead of a web save dialog
                        - The saved dashboard appears in the folder without a manual refresh

- Core Functional Flows
    * Save variants and authoring outputs
        - Save As preserves new-item options and target placement <P1>
            - Open a dashboard in the embedded editor
                - Choose Save As
                    - Review the save options and confirm the target folder
                        - Certify and Set as template options are available when saving a new dashboard
                        - The saved item appears in the selected folder after Save As
    * External connections and dataset handling
        - External data source authorization returns to the authoring flow <P1>
            - Open a dashboard that uses an external data source in server-based mode
                - Start the authorization flow
                    - Complete the authorization and return to Workstation
                        - The author returns to the source page or authoring flow
                        - The dashboard can continue using the authorized connection
        - Add or replace dataset dialogs stay stable and show clear errors when data is unavailable <P2>
            - Open the embedded editor and start adding or replacing a dataset
                - Select an unpublished or problematic dataset
                    - Confirm the dialog action
                        - The editor shows a clear error when the dataset cannot be used
                        - Replacing a prompted dataset does not crash the editor
    * Navigation, export, and authoring surfaces
        - Linked-dashboard navigation keeps authoring controls available <P2>
            - Open a dashboard that links to another dashboard
                - Follow the link inside the editor
                    - Return to authoring controls after the navigation
                        - The editor does not become empty after navigation
                        - Toolbar actions remain available after the linked navigation
        - Export PDF and download package outputs remain available <P2>
            - Open a dashboard in the embedded editor
                - Export the dashboard to PDF
                    - Download the dashboard package
                        - The PDF follows the selected export settings
                        - The package download completes as a .mstr file
        - Theme menu and formatting dialog remain usable in the embedded editor <P2>
            - Open a dashboard in the embedded editor
                - Use the theme menu and open a formatting properties dialog
                    - Review the dialog and surrounding layout
                        - The theme menu renders on the menu bar
                        - The formatting dialog is fully displayed and scrollable

- Error Handling / Recovery
    * Execution and session recovery
        - Cancel execution closes the editor cleanly <P1>
            - Start a dashboard action that begins execution
                - Choose Cancel
                    - Wait for the editor to stop running
                        - Execution stops
                        - The editor closes cleanly without leaving a stuck running state
        - Session timeout shows a native error dialog instead of a Library page <P1>
            - Leave a server-based authoring session open until the session expires
                - Return to the embedded editor
                    - Trigger an action that needs the expired session
                        - A native error dialog appears in Workstation
                        - The author is not redirected to a Library login or home page

- Regression / Known Risks
    * Parity and bounded risk visibility
        - Library-vs-Workstation gap remains visible without blocking authoring <P2>
            - Compare an authoring action in Workstation with the Library authoring experience
                - Inspect the visible menus and follow-on behavior
                    - Continue authoring after the comparison
                        - Remaining Library-vs-Workstation differences stay visible to the tester
                        - Workstation authoring remains available for the covered flow
        - Scroll roughness stays visible as a bounded known risk <P2>
            - Open a dashboard that requires scrolling in the embedded editor
                - Scroll through the dashboard during authoring
                    - Continue editing after the scroll interaction
                        - Scroll roughness remains visible to the tester
                        - The editor stays available for continued authoring

- Compatibility
    * Server, local mode, and environment compatibility
        - Pre-25.08 server falls back to the legacy editor <P1>
            - Connect Workstation to a pre-25.08 server
                - Open or create a dashboard
                    - Wait for the editor to load
                        - Workstation falls back to the legacy editor
                        - The authoring workflow remains available on the older server
        - Local mode stays on the legacy editor during the transition window <P2>
            - Open a local-mode dashboard in Workstation
                - Save it to the server and reopen it for editing
                    - Compare the local-mode and reopened experiences
                        - The local-mode edit stays on the legacy editor during the transition window
                        - Reopening the saved server dashboard uses the new editor style
        - Embedded environments still allow basic execution, close, and logout flows <P2>
            - Open the embedded editor in the supported environment under test
                - Execute a dashboard action, close the dashboard, and sign out
                    - Observe each environment-specific step
                        - The dashboard can execute and close in the supported environment
                        - Logout remains available in the embedded Library path

- Security
    * Permissions and ACL
        - Users without edit privilege cannot open the authoring editor <P1>
            - Sign in as a user without edit permission for the dashboard
                - Attempt to open the dashboard for authoring
                    - Wait for the action to resolve
                        - The authoring editor does not open
                        - Access control behavior matches the permitted Library authoring experience

- Performance / Resilience
    * Load behavior
        - First open is slower but later opens benefit from caching <P2>
            - Open a dashboard in the embedded editor for the first time
                - Close it and open the same dashboard again
                    - Compare the first and later load experience
                        - The first open can be slower than the legacy editor
                        - Later opens are improved by caching
