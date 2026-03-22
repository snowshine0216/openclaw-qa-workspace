Feature QA Plan (BCIN-6709)

- EndToEnd
    * Editing continuity
        - Continue editing after a recoverable report error and save changes <P1>
            - Open an existing report from Library
                - Change one report object and keep the editor open
                    - Trigger a recoverable error while the change is being applied
                        - Error message appears inside the report editor instead of forcing the report to reopen
                        - The edited value remains visible after the error message appears
                        - Adjust a second field and save the report
                            - Save confirmation appears in the same editor session
        - Leave the report after an error using the normal exit flow <P2>
            - Open an existing report from Library
                - Change a report element without saving
                    - Trigger a recoverable error while the edit is pending
                        - Close the editor from the normal exit control
                            - Unsaved-changes confirmation appears before the report closes
                            - Reopening the report shows the last saved version rather than a damaged draft
- Error Handling / Recovery
    * Inline recovery
        - Correct the failing edit inside the same editor session <P1>
            - Open an existing report and enter an invalid edit
                - Receive a recoverable error message in the editor
                    - Correct the failing value without leaving the report
                        - The editor remains interactive after the correction
                        - Saving succeeds in the same editor session
- Regression / Known Risks
    * Edit preservation
        - Keep unaffected edits after an intermediate error <P1>
            - Apply two separate edits in one report session
                - Trigger a recoverable error on the second edit
                    - Review the report state after the error message appears
                        - The earlier valid edit remains visible
                        - The report can still be saved after correcting the failing change
