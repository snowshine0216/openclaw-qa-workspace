# Examples: Documentation Governance

## Example 1: Merge overlapping deployment docs

Input situation:
- `DEPLOYMENT_GUIDE.md` and `WEBHOOK_SETUP.md` both contain startup/port/env instructions.

Action:
1. Keep `docs/DEPLOYMENT.md` as canonical.
2. Merge unique content into canonical file.
3. Move superseded file to `docs/archive/`.
4. Add archive note and update README links.

Expected result:
- One active deployment source of truth.

## Example 2: Handle version completion notes

Input situation:
- `V2_COMPLETE.md`, `V2_FINAL.md`, and `IMPLEMENTATION_SUMMARY.md` are still active.

Action:
1. Move implementation status artifacts to archive.
2. Keep user-visible change history in `CHANGELOG.md`.
3. Keep durable architecture decisions in `ARCHITECTURE.md`.

Expected result:
- Active docs remain timeless; time-bounded status docs are archived.

## Example 3: New test strategy doc request

Input request:
- "Create parser test guide for contributors."

Action:
1. Check canonical testing owner doc.
2. Add a new section under `TESTING.md` if scope fits.
3. Create a separate doc only if audience/workflow is distinct.
4. Link from README docs map.

Expected result:
- Testing guidance remains centralized and discoverable.
