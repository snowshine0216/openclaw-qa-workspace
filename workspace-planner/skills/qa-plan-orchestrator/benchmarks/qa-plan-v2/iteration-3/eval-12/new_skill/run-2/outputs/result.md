# DOC-SYNC-001 — Docs phase contract alignment check (qa-plan-orchestrator)

## Scope (per benchmark)
Target artifact family: **docs**

Focus files to stay aligned:
- `SKILL.md`
- `README.md`
- `reference.md`
- **AGENTS docs** (not present in provided evidence)

Primary phase/checkpoint under test: **docs** (documentation consistency / phase model contract alignment)

Priority: advisory

---

## Alignment findings (evidence-based)

### 1) SKILL.md ↔ reference.md (phase model and orchestrator responsibilities)
**Status: aligned on the script-driven contract.**

Both documents consistently state the orchestrator is not responsible for inline phase logic and must:
- call `scripts/phaseN.sh` per phase
- react to `SPAWN_MANIFEST: <path>` in stdout by spawning subagents using `requests[].openclaw.args` **as-is**
- wait for completion, then run `scripts/phaseN.sh ... --post`
- stop immediately on non-zero exit

Both documents also align on:
- run root convention: `<skill-root>/runs/<feature-id>/`
- artifact families under `context/`, `drafts/`, `archive/`
- `REPORT_STATE` meanings and user choice workflow (via `scripts/apply_user_choice.sh`)

Notable detail aligned in both:
- **sessions_spawn contract**: do **not** add `streamTo` for `runtime: "subagent"`.

### 2) README.md ↔ SKILL.md/reference.md (what is produced + reference mapping)
**Status: aligned (with one truncation caveat noted below).**

README.md matches the core contract described in SKILL.md and reference.md:
- Produced artifacts listed in README correspond to artifact families and phase outputs in reference.md (e.g., `artifact_lookup_<feature-id>.md`, `coverage_ledger_<feature-id>.md/.json`, draft naming by phase and round).
- Phase-to-reference mapping table in README is consistent with SKILL.md’s statement that spawn manifests embed required references and the orchestrator does not attach files.
- Guardrails in README match SKILL.md/reference.md (support-only Jira policy; Tavily-first then Confluence fallback; knowledge pack handling and qmd runtime behavior).

### 3) Docs set completeness for “AGENTS docs stay aligned”
**Status: cannot be verified from provided evidence.**

The benchmark explicitly calls out **AGENTS docs** staying aligned with `SKILL.md`, `README.md`, and `reference.md`, but no AGENTS documentation content was included in the provided snapshot/fixture evidence.

Given the “use only provided benchmark evidence” rule, this case can only confirm the three provided files are mutually consistent; it cannot demonstrate alignment with AGENTS docs.

---

## Docs-phase contract risks / inconsistencies observed

1) **reference.md is truncated in the provided evidence**
- The `Validators` list ends with a truncated entry (`validate_unresol...`).
- This prevents a full docs-consistency check for validator names/completeness across docs.

2) **AGENTS alignment is unassessable**
- No AGENTS docs content provided; cannot confirm cross-doc synchronization.

---

## Conclusion (advisory)

- **Pass (partial) for docs alignment among SKILL.md, README.md, and reference.md based on provided evidence.**
- **Blocker to fully satisfying DOC-SYNC-001 as written:** AGENTS docs were not included in evidence, so their alignment cannot be demonstrated.
- **Additional limitation:** reference.md content is truncated, so validator list and any tail-section contracts cannot be fully checked.