Feature QA Plan (BCED-2416)

- Dashboard creation
    * Create a new dashboard from the main create flow after the editor is enabled <P1>
        - Open the Workstation Help menu
            - Enable New Dashboard Editor
                - Start dashboard creation from the main create entry point
                    - Select a dataset
                        - Click Create
                            - The embedded dashboard editor opens for the selected dataset
    * Create a dashboard from a dataset context action <P1>
        - Right-click a dataset in Workstation
            - Select Dashboard from dataset
                - The embedded dashboard editor opens for that dataset
- Editing modes
    * Edit an existing dashboard directly in the embedded editor <P1>
        - Right-click an existing dashboard
            - Click Edit
                - The embedded dashboard editor opens for that dashboard
    * Edit a dashboard without data enters pause mode <P1>
        - Right-click an existing dashboard
            - Click Edit without Data
                - The dashboard opens in pause mode
- Save ownership
    * Save keeps the native Workstation dialog owner <P1>
        - Open the embedded dashboard editor
            - Click Save
                - The native Workstation save dialog opens
    * Save As keeps the native Workstation dialog owner <P1>
        - Open the embedded dashboard editor
            - Open the File menu
                - Click Save As
                    - The native Workstation Save As dialog opens
- Execution shutdown
    * Cancel button stops execution from the embedded editor <P1>
        - Start a dashboard execution in the embedded editor
            - Click Cancel
                - The running execution stops
    * Close button stops execution when the editor is busy <P1>
        - Start a dashboard execution in the embedded editor
            - Click the editor X button
                - The running execution stops as the editor closes
- Version behavior
    * Older server versions keep the legacy editor flow <P2>
        - Connect Workstation to an older server version
            - Start a dashboard create or edit flow
                - The legacy dashboard editor opens instead of the embedded editor
- Access control
    * Users without edit privilege cannot enter dashboard authoring <P1>
        - Sign in as a user without dashboard edit privilege
            - Try to edit an existing dashboard
                - The embedded authoring editor does not open
