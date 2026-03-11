# <Feature_Title>

---
**Source reviewed**: <Confluence + Jira + GitHub + Figma artifacts used>
**Grouping rule**: each scenario name should read like `mode | error type | detailed action`
**Date**: <YYYY-MM-DD>

---

<!-- Section structure: Choose names that fit the feature. E2E is optional. Functional may be split. Run coverage checkpoints per references/coverage-domains.md. -->
<!-- INSTRUCTION: DO NOT copy arbitrary headers. Generate your own semantic, feature-fit headers.
- E2E is optional.
- You MUST split "Functional" into specific, logical sub-areas (e.g., `## Functional - Pause Mode`, `## Functional - Configuration`).
- Create clear sections for Error Handling, Permissions, or UI Messaging ONLY IF the feature has them.
- Each section should declare the coverage domains it owns with `<!-- Coverage domains: ... -->`.
-->

## Functional - Example Area

<!-- Coverage domains: primary functional behavior; state transition / continuity -->
<!-- Coverage checkpoints considered: boundary conditions; state changes -->

### <Scenario Family Name> - P<1/2/3>
<!-- P1/P2/P3 rationale -->

- In <surface>, trigger <exact entry point>
	- Perform <exact user action>
		- Verify <visible user-facing result>

## Error Handling

<!-- Coverage domains: error handling / recovery -->
<!-- Coverage checkpoints considered: retry / continue / back / dismiss paths; stale or partial states -->

### <Recovery or error scenario> - P<1/2/3>
- In <surface>, trigger <recoverable error or failure state>
	- Perform <exact recovery action>
		- Verify <expected recovery outcome>

## Cross-Flow

<!-- Coverage domains: cross-flow / multi-step interactions -->
<!-- Coverage checkpoints considered: workflow interruptions; re-entry -->

### <Cross-flow scenario> - P<1/2/3>
- In <surface>, move from <flow A> to <flow B>
	- Perform <exact transition action>
		- Verify <continuity or multi-step result>

## UI - Messaging

<!-- Coverage domains: user-visible messaging or status -->
<!-- Coverage checkpoints considered: title/body/CTA copy; fallback/default copy -->

### <Messaging or status scenario> - P<1/2/3>
- In <surface>, trigger <dialog, banner, or status state>
	- Perform <exact acknowledgment or follow-up action>
		- Verify <visible copy or status outcome>

## Compatibility

<!-- Coverage domains: compatibility / scope guard; nonfunctional considerations when relevant -->
<!-- Coverage checkpoints considered: unaffected flows; environment differences; accessibility -->

### <Compatibility or scope-guard scenario> - P<1/2/3>
- In <surface>, use <affected or unaffected flow>
	- Perform <exact action under the relevant environment or scope condition>
		- Verify <expected non-regression or guardrail result>

<!-- Replace these example sections with feature-fit sections. Keep comments only when they help explain ownership or N/A reasoning. -->
