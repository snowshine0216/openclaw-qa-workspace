Feature QA Plan (BCIN-6709)

- EndToEnd
    * Editing continuity
        - Continue editing after a recoverable report error and save changes <P1>
            - Open an existing Library report
                - Make an edit in the report
                    - Trigger a recoverable error while editing
                        - Error message stays in the editor
                        - Current edits stay visible
                        - Continue editing and save
                            - Save success message appears without reopening the report
        - Leave the report after an error using the normal exit flow <P2>
            - Open an existing Library report
                - Make an unsaved edit
                    - Trigger a recoverable error while editing
                        - Close the report from the editor
                            - Unsaved-change confirmation appears before exit
                            - Reopening the report shows the last saved state
- Error Handling / Recovery
    * Inline recovery
        - Correct the failing edit inside the same editor session <P1>
            - Open an existing report and make an invalid edit
                - Receive a recoverable error message
                    - Fix the invalid value in the same editor session
                        - The editor stays interactive after the correction
                        - Saving succeeds without reopening the report
- Regression / Known Risks
    * Edit preservation
        - Keep unaffected edits after an intermediate error <P1>
            - Make several edits in one report session
                - Trigger one recoverable error on a later change
                    - Earlier valid edits remain visible after the error
                        - The report can still be saved after the failing change is corrected
