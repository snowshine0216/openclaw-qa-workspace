# Mini Branch Merge Plan: Target State

**Goal:** `qa-plan-orchestrator` as single source of truth, with:
- ✅ Mini's RCA fix (workspace-daily)
- ✅ Keep SUBAGENT_QUICK_CHECKLIST, VALIDATOR_SAFE_AUTHORING_AND_DEDUP_GUIDE (docs + REQUIRED_FILES + spawnManifestBuilders)
- ❌ Drop feature-qa-planning-orchestrator
- ❌ Drop qa-plan-refactor, qa-plan-review, qa-plan-synthesize, qa-plan-write

---

## Why This Is Confusing

- **master** consolidated: removed `feature-qa-planning-orchestrator` and the four `qa-plan-*` skills, and also removed the validator docs from `REQUIRED_FILES`.
- **mini** kept the old structure and added validator docs + RCA fixes.
- Both branches edited the same `qa-plan-orchestrator` files differently → merge conflicts.

**Your desired state** = master's structure + mini's RCA + mini's validator docs. That requires a **surgical merge**, not a plain `git merge`.

---

## Recommended Approach: Fresh Branch from Master

Start from master, then add only the pieces you want.

### Step 1: Abort Any In-Progress Merge

```bash
git merge --abort   # if you have unmerged files
```

### Step 2: Create a New Branch from Master

```bash
git fetch origin
git checkout -b mini-merged origin/master
```

### Step 3: Apply Mini's RCA Fix (workspace-daily)

The RCA changes are in `workspace-daily/`. Master has none of these; mini has them. Options:

**Option A — Cherry-pick RCA-related commits from mini**

```bash
# Find commits that touch workspace-daily
git log mini --oneline -- workspace-daily/

# Cherry-pick those commits (adjust hashes)
git cherry-pick <commit-hash>   # repeat for each RCA commit
```

**Option B — Manual patch**

```bash
git diff origin/master mini -- workspace-daily/ > /tmp/rca-from-mini.patch
git apply /tmp/rca-from-mini.patch
```

Then **resolve merge conflict markers** in `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md` (the file has `<<<<<<< Updated upstream` / `=======` / `>>>>>>> Stashed changes`). Choose the version that matches your intended design.

### Step 4: Add Validator Docs to qa-plan-orchestrator

Master does **not** have these files. Copy them from mini:

```bash
# These exist on mini, not on master
git show mini:workspace-planner/skills/qa-plan-orchestrator/docs/SUBAGENT_QUICK_CHECKLIST.md \
  > workspace-planner/skills/qa-plan-orchestrator/docs/SUBAGENT_QUICK_CHECKLIST.md

git show mini:workspace-planner/skills/qa-plan-orchestrator/references/validator-safe-authoring-and-dedup-guide.md \
  > workspace-planner/skills/qa-plan-orchestrator/references/validator-safe-authoring-and-dedup-guide.md
```

### Step 5: Update docsContract.test.mjs — Add to REQUIRED_FILES

In `workspace-planner/skills/qa-plan-orchestrator/tests/docsContract.test.mjs`, add these two entries to `REQUIRED_FILES` (after `references/script-driven-phase0-phase1-design.md`):

```javascript
  'references/validator-safe-authoring-and-dedup-guide.md',
  'docs/SUBAGENT_QUICK_CHECKLIST.md',
```

Also add the content-assertion test block from mini (the one that checks checklist references VALIDATOR_SAFE_AUTHORING). See mini's `docsContract.test.mjs` lines ~165–185.

### Step 6: Update spawnManifestBuilders.mjs — Add Checklist Preflight

Master's `spawnManifestBuilders.mjs` does **not** have the SUBAGENT_QUICK_CHECKLIST preflight. From mini, add:

1. In `buildPhaseTaskText`, add:
   ```javascript
   const checklistPath = join(SKILL_ROOT, 'docs', 'SUBAGENT_QUICK_CHECKLIST.md');
   ```

2. In the task template string, add the preflight block (before "Task:"):
   ```
   Preflight before you write or return any artifact:
   - Read ${checklistPath} and apply it as a short validator-safe self-check.
   - Do not tag grouping/subcategory bullets with `<P1>` / `<P2>`.
   - Deduplicate only when trigger, risk, and observable outcome are materially the same.
   - When a user explicitly promoted a coverage area, do not leave it as a deferred-only stub.
   - Prefer user-observable wording over implementation-heavy wording in executable scenarios.
   ```

3. Update phase4b, phase5a, phase5b descriptions if mini has different wording.

### Step 7: Update spawnManifestBuilders.test.mjs — Add Checklist Tests

Master's test file may not have the SUBAGENT_QUICK_CHECKLIST assertions. From mini, add the tests that assert phase4b, phase5a, phase5b manifest tasks include the SUBAGENT_QUICK_CHECKLIST preflight block.

### Step 8: Verify feature-qa-planning-orchestrator and qa-plan-* Are Gone

On `origin/master`, these are already removed. After Step 2 you're on a branch from master, so they should not exist. Confirm:

```bash
ls workspace-planner/skills/feature-qa-planning-orchestrator 2>/dev/null && echo "STILL EXISTS" || echo "OK - removed"
ls workspace-planner/skills/qa-plan-refactor 2>/dev/null && echo "STILL EXISTS" || echo "OK - removed"
```

### Step 9: Fix RCA Design Doc Conflict Markers

Edit `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md` and remove/resolve any `<<<<<<<`, `=======`, `>>>>>>>` blocks. Prefer the version that matches your intended Phase 3/4 behavior.

### Step 10: Run Tests

```bash
node workspace-planner/skills/qa-plan-orchestrator/tests/docsContract.test.mjs
node workspace-planner/skills/qa-plan-orchestrator/scripts/test/spawnManifestBuilders.test.mjs
# Plus any workspace-daily RCA tests
```

---

## Summary: What Comes From Where

| Item | Source |
|------|--------|
| qa-plan-orchestrator structure, references, contracts | **master** |
| feature-qa-planning-orchestrator, qa-plan-refactor/review/synthesize/write | **removed** (master) |
| workspace-daily RCA (owner-manager-mapping, spawn bridge, phase4, etc.) | **mini** |
| SUBAGENT_QUICK_CHECKLIST.md, VALIDATOR_SAFE_AUTHORING_AND_DEDUP_GUIDE.md | **mini** |
| docsContract REQUIRED_FILES + content assertions | **mini** |
| spawnManifestBuilders checklist preflight | **mini** |
| spawnManifestBuilders.test.mjs checklist tests | **mini** |

---

## Alternative: Resolve Merge Conflicts Manually

If you prefer to stay on `mini` and merge `master` into it:

1. `git merge origin/master`
2. For each conflicted file, resolve as follows:
   - `context-coverage-contract.md`, `review-rubric-phase5a.md`, `review-rubric-phase5b.md` → take **master**
   - `spawnManifestBuilders.test.mjs` → take **master**, then add the SUBAGENT_QUICK_CHECKLIST tests from mini
   - `docsContract.test.mjs` → take **master**, then add the two docs to REQUIRED_FILES and the content-assertion block from mini
3. After merge, **delete** `feature-qa-planning-orchestrator`, `qa-plan-refactor`, `qa-plan-review`, `qa-plan-synthesize`, `qa-plan-write`
4. Ensure SUBAGENT_QUICK_CHECKLIST.md and VALIDATOR_SAFE_AUTHORING_AND_DEDUP_GUIDE.md exist (they should from mini)
5. Ensure spawnManifestBuilders.mjs has the checklist preflight (mini has it; if merge took master's version, re-add it)
6. Resolve RCA_DAILY_SKILL_REFACTOR_DESIGN.md conflict markers

The fresh-branch approach (Steps 1–10 above) is usually cleaner and avoids fighting merge conflict resolution.
