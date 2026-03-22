Feature QA Plan (BCED-1719)

<!-- Phase: 4a (subcategory-only draft). -->
<!-- Evidence source (customer-only): inputs/fixtures/BCED-1719-blind-pre-defect-bundle/materials/BCED-1719.issue.raw.json -->
<!-- Key requirement from evidence: “support interaction with Panel Stack via Native Embedding API”, parity with regular Embedding SDK, plus new native playground/doc examples. -->

- Embed Panel Stack (Single Component)
    * Render a panel stack as a standalone embedded component <P1>
        - In a host native app, navigate to a screen with a Native Embedding container
            - Provide the panel stack identifier/config used by the app
                - Start the embedding flow
                    - The embedded component renders without a crash
                    - The panel stack UI is visible in the embedded region
                    - The initial/default panel content is visible
    * Load state shows while the panel stack is initializing <P1>
        - Start the embedding flow for a panel stack with a known slow network response
            - Observe the embedded region during initialization
                - A loading indicator (or equivalent visible loading state) appears
                - The loading state clears once the panel stack is rendered
    * Failure state is user-visible when the panel stack cannot be loaded <P1>
        - Start the embedding flow with an invalid or inaccessible panel stack identifier
            - Observe the embedded region after the request resolves
                - A user-visible error state appears
                - The host app remains responsive

- Panel Switching & Interaction
    * Switch between panels (views) within the panel stack <P1>
        - Render a panel stack with multiple panels
            - Select a non-default panel using the panel-stack UI affordance
                - The selected panel becomes visible
                - The previously visible panel is no longer visible
                - The transition does not break layout in the embedded region
    * Repeated switching does not degrade responsiveness <P1>
        - Render a panel stack with multiple panels
            - Switch panels repeatedly (at least 10 times)
                - Each switch results in the newly selected panel being visible
                - The embedded component remains responsive to touches/gestures
                - The host app does not show a freeze or crash
    * Panel selection state persists across minor UI changes on the host screen <P2>
        - Render a panel stack and switch to a non-default panel
            - Trigger a host-screen UI refresh that does not recreate the embedding container (for example, re-render the parent view)
                - The embedded region still shows the previously selected panel
                - The panel-stack UI still indicates the selected panel

- Host App + Embedding Lifecycle
    * Create and destroy the embedding component cleanly (mount/unmount) <P1>
        - Navigate to a host screen that renders the embedded panel stack
            - Navigate away so the embedding component is destroyed
                - The host app does not crash
            - Navigate back so the embedding component is created again
                - The panel stack renders again
                - User interaction remains functional after re-entry
    * Background/foreground transitions preserve a valid embedded UI state <P1>
        - Render a panel stack and switch to a non-default panel
            - Send the app to background
                - Return the app to foreground
                    - The embedded panel stack is visible
                    - The embedded panel content is still interactable
    * Reload/refresh of the embedding component returns to a valid baseline <P2>
        - Render a panel stack and switch to a non-default panel
            - Trigger an explicit refresh/reload of the embedding component (host action)
                - The embedded region returns to a valid rendered state
                - The embedded panel content is visible (default or documented behavior)

- Regression-Sensitive Integration States
    * Orientation / size class changes preserve usability and layout <P2>
        - Render a panel stack on a device that supports rotation or resizable windows
            - Change orientation / resize the host window
                - The embedded region reflows without clipping critical UI
                - The panel stack remains interactable after the change
    * Network loss during panel switch results in a recoverable user-visible outcome <P2>
        - Render a panel stack with multiple panels
            - Disable network connectivity
                - Attempt to switch to another panel
                    - A user-visible failure state appears (or the switch is prevented with feedback)
            - Re-enable network connectivity
                - Attempt to switch panels again
                    - The newly selected panel becomes visible
                    - The embedded component remains responsive
    * Host navigation race: switching panels while leaving the screen does not crash <P2>
        - Render a panel stack with multiple panels
            - Begin switching to another panel
                - Immediately navigate away from the host screen
                    - The host app does not crash
                    - The navigation completes to the destination screen
    * Multiple embedded components on the same screen remain isolated (no cross-talk) <P2>
        - Render a host screen with two embedded components (each rendering a panel stack)
            - Switch panels in the first embedded component
                - The first component updates to the selected panel
                - The second embedded component remains unchanged

- Playground & Documentation Parity
    * Native playground includes an example workflow for panel stack interaction <P2>
        - Open the Native SDK playground
            - Locate an example for embedding or interacting with panel stacks
                - An example is present and runnable
                - Running the example renders a panel stack
                - Panel switching is demonstrably functional in the example
    * Documentation describes how to interact with panel stacks in Native Embedding <P2>
        - Open the Embedding SDK documentation for panel stacks
            - Locate guidance specific to Native Embedding API usage
                - Documentation includes Native Embedding steps or API guidance
                - Documentation includes at least one concrete example workflow
    * Regular Embedding SDK parity: behavior matches the established panel stack interaction model <P2>
        - Render the same panel stack using the regular Embedding SDK in a reference app
            - Render the same panel stack using Native Embedding in a native host app
                - Panel switching results in the same visible panel outcomes in both apps
                - User-visible interaction affordances behave consistently (within platform UI norms)
