# BCIN-6709 Consolidated Review Findings

## High-priority refactor actions

1. **Split GitHub-backed recovery paths more explicitly**
   - Separate truncation/max-rows behavior from non-truncation behavior.
   - Separate prompt vs reprompt recovery action validation.
   - Make Report Editor Data Pause Mode return path explicit.

2. **Remove or soften unsupported claims**
   - Do not promise same-session preservation.
   - Do not promise unsaved-edit retention unless directly evidenced.
   - Rephrase undo/redo expectations to verify coherent intended behavior, not unconditional preservation.
   - Remove unsupported claims about flicker, duplicate screens, and cross-surface parity unless directly tied to evidence.

3. **Rebalance priorities**
   - Move pause/data-retrieval recovery to **P0** based on Jira subtask coverage.
   - Lower details-toggle interaction from P0 to P1 unless tied to stronger evidence.
   - Lower broad document-view visibility claims from P0 to P1 unless narrowly tied to explicit evidence.

4. **Replace vague wording with executable observable checks**
   - Avoid phrases like `usable state`, `intended safe recovery destination`, and `recoverable failure` without surface-specific observable outcomes.
   - Prefer checks like:
     - dialog closes or remains open
     - user returns to prompt, report editor, or Data Pause Mode
     - primary action shown is OK vs Send Email
     - details section expands/collapses and keeps actions visible

5. **Add missing evidence-grounded coverage**
   - Modal accessibility / keyboard reachability from Figma evidence
   - Explicit mapping for `BCIN-7583 BIWeb xml command <os 8` from Jira trail
   - Localization hook validation for updated strings from GitHub/productstrings evidence
   - Non-recovery undo/redo reset behavior from GitHub/mojojs evidence
   - Copy mismatch risk across shared dialog patterns from Figma evidence

## Drafting guidance for v2
- Organize by functional behavior, not by repo.
- Keep only evidence-backed specifics in each scenario.
- Preserve cross-source synthesis, but each expected result must be defensible from at least one source.
- Use exact strings only where directly evidenced from GitHub/Figma-derived artifacts.
