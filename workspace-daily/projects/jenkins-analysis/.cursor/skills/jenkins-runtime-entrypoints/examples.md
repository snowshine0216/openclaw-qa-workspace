# Examples: Jenkins Runtime Entrypoints

## Example 1: Server entrypoint path changed

Input change:
- Service bootstrap moved during refactor.

Action:
1. Update canonical service entrypoint reference.
2. Update `scripts/package.json` `main` and `start`.
3. Update PM2 command and deployment docs.
4. Run startup smoke test.

Expected result:
- Runtime launches from one canonical path everywhere.

## Example 2: Wrapper script calling internal module

Input situation:
- A shell script runs `node scripts/analysis/spectre.js` directly.

Action:
1. Route wrapper to canonical pipeline CLI entrypoint.
2. Keep analysis module as internal domain logic.
3. Verify CLI behavior unchanged.

Expected result:
- Clear runtime boundary and reduced path drift risk.

## Example 3: New required env variable

Input change:
- Introduce required runtime config for webhook processing.

Action:
1. Validate env var in canonical service entrypoint startup.
2. Update deployment docs and process manager env config.
3. Add failure-path smoke test for missing config.

Expected result:
- Fast, actionable startup failure instead of runtime crash.
