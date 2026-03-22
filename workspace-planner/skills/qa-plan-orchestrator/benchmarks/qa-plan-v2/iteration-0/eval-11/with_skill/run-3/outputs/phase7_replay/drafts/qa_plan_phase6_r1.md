Feature QA Plan (BCIN-7289)

- Core Functional Flows
    * Save and Save-As
        - Save overrides an existing report without error <P1>
            - Open an existing report in the embedded editor
                - Click Save
                    - The report is saved without a JS error or HTTP 400 error
        - New report created from a template saves as a new report <P1>
            - Create a report from a template
                - Click Save
                    - The new report is created without overwriting the source template
- Regression / Known Risks
    * Historical analog gates
        - Save As folder visibility is immediate [ANALOG-GATE]
            - Save the report to a folder
                - The saved report is visible in the target folder immediately
        - Save dialog completeness and interactivity [ANALOG-GATE]
            - Open the save dialog for a new report
                - The save dialog fields are present and interactive
