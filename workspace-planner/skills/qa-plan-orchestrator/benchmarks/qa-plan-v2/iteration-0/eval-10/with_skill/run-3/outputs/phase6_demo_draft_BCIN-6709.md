Feature QA Plan (BCIN-6709)

- EndToEnd
    * Report Session Recovery
        - Continue editing and save after a recoverable report error <P1>
            - Open an existing editable report
                - Make a visible unsaved change in the report
                    - Trigger a recoverable report error while the report stays open
                        - Dismiss the error prompt
                            - Continue editing the same report
                                - Save the report
                                    - The same report remains open after the error prompt closes
                                    - The change made before the error is still visible before the save completes
                                    - The save completes without requiring the user to exit and reopen the report

- Core Functional Flows
    * Save Continuation
        - Retry save after a transient report error <P1>
            - Open an editable report
                - Make a visible change in the report
                    - Trigger a transient error during save
                        - Choose the available retry or continue action
                            - Save the report again
                                - The report editor remains available for the retry
                                - The visible change is still present on the second save attempt

- Error Handling / Recovery
    * Error Prompt Handling
        - Recoverable error prompt keeps the current editing context usable <P1>
            - Open an editable report
                - Make a visible change in the report
                    - Trigger a recoverable report error
                        - Observe the error prompt
                            - The prompt states that the current action failed
                            - The report remains open behind the prompt
                            - The user can continue editing without reopening the report

- Regression / Known Risks
    * Customer-Reported Edit Loss
        - Preserve in-progress edits when an error interrupts editing <P1>
            - Open an editable report
                - Add a distinctive change that can be recognized later
                    - Trigger a recoverable report error
                        - Continue in the same report session
                            - The distinctive change is still visible after the error
                            - The user does not need to exit and reopen the report to continue editing
