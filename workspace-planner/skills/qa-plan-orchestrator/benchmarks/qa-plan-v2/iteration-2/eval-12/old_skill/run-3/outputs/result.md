# DOC-SYNC-001 — Docs phase contract alignment check (SKILL.md / README.md / reference.md / AGENTS*)

Scope (per benchmark focus): ensure **SKILL.md**, **README.md**, **reference.md**, and **AGENTS docs** stay aligned with the current **qa-plan-orchestrator** phase model and orchestrator contract.

> Evidence limitation: the provided snapshot/fixture evidence includes **SKILL.md**, **README.md**, and **reference.md** only. **No AGENTS documentation content was included in the evidence bundle**, so AGENTS alignment cannot be verified in this benchmark run.

---

## 1) High-level alignment (phase model + orchestrator contract)

### What SKILL.md asserts (authoritative behavior)
SKILL.md defines a **script-driven orchestrator** with exactly three responsibilities:
1) Call `phaseN.sh`
2) Interact with the user when approval / `REPORT_STATE` choice is required
3) Spawn subagents from `phaseN_spawn_manifest.json`, wait, then call `phaseN.sh --post`

It also asserts key constraints:
- Orchestrator **does not** perform phase logic inline, write artifacts, run validators directly, or make per-phase decisions outside the script contract.
- Spawn behavior must pass `requests[].openclaw.args` **as-is** to `sessions_spawn` (no `streamTo`).
- Tavily-first deep research with Confluence as recorded fallback.

### README.md and reference.md agreement
From the evidence:
- README.md “Start Here” and “Active Contract Files” sections align with SKILL.md’s role separation and “Required References” concept.
- README.md includes a **Phase-to-Reference Mapping** table consistent with the “spawn manifests embed required references” idea.
- reference.md reinforces that:
  - SKILL.md defines orchestrator behavior;
  - reference.md defines runtime/artifacts/manifests/phase gates;
  - references/*.md define writer/reviewer contracts.

**Result:** For the provided documents, the orchestrator’s contract + phase model are consistent across SKILL.md / README.md / reference.md.

---

## 2) Specific sync checks (cross-doc mismatches found)

### A. Knowledge-pack / qmd additions are present in fixture README.md + fixture reference.md, but **not** in snapshot SKILL.md/reference.md

**Fixture README.md** includes an added “qmd Runtime” section:
- Uses `@tobilu/qmd` BM25-first runtime index
- No `qmd collection add`
- `QA_PLAN_SEMANTIC_MODE` modes
- Semantic failure non-blocking; BM25 failure blocks Phase 3 when pack active

**Fixture reference.md** adds knowledge-pack fields and artifacts:
- `task.json` additive fields: `feature_family`, `knowledge_pack_key`, resolution metadata, pack version/path/row count, etc.
- `run.json` additive fields: `knowledge_pack_loaded_at`, summary/retrieval timestamps, retrieval modes, semantic warnings, etc.
- Phase 0 artifacts: `context/knowledge_pack_summary_<feature-id>.md/.json`
- Phase 3 artifacts: `context/knowledge_pack_retrieval_<feature-id>.md/.json`, `context/knowledge_pack_qmd.sqlite`, plus `coverage_ledger_<feature-id>.json`
- Spawn manifest contract: additional `source` metadata for knowledge pack identity/paths

However, in the **skill_snapshot**:
- snapshot SKILL.md does not mention knowledge-pack runtime (`qmd`) or pack artifacts/fields.
- snapshot reference.md (in evidence) lists no knowledge-pack artifacts/fields.

**Impact:** The docs set is not fully synchronized between README/reference variants. If the fixture represents the “current” intended docs, then SKILL.md and snapshot reference.md are missing pack-awareness; if the snapshot is current, then fixture docs have forward/extra contract that isn’t reflected in SKILL.md.

**Recommendation (docs phase outcome):** Decide which contract is canonical (pack-aware or not), then update the other files so that **SKILL.md, README.md, and reference.md** agree on:
- whether knowledge packs exist,
- which phase introduces pack artifacts (Phase 0/3),
- any additional required artifacts (`coverage_ledger_<id>.json`),
- spawn manifest `source` metadata expectations.

### B. “Required references” list differs between SKILL.md and README.md

**SKILL.md Required References** includes:
- `reference.md`
- `references/phase4a-contract.md`
- `references/phase4b-contract.md`
- `references/context-coverage-contract.md`
- review rubrics for 5a/5b/6
- `references/e2e-coverage-rules.md`
- `references/subagent-quick-checklist.md`

**README.md Active Contract Files** includes everything above plus:
- `references/context-index-schema.md`
- `references/docs-governance.md`
- `knowledge-packs/` when mandatory

**Impact:** Not necessarily a defect (SKILL’s “Always read” vs README’s “Active contract files” can differ), but it creates ambiguity about what is mandatory vs just active.

**Recommendation:** Normalize language:
- In SKILL.md: either expand “Required References” to include `references/context-index-schema.md` and `references/docs-governance.md` (and knowledge packs if applicable), or
- In README.md: label additional items as “additional active contracts” vs “always read”.

---

## 3) Coverage against benchmark expectations

### [phase_contract][advisory] “Case focus is explicitly covered: SKILL.md, README.md, reference.md, and AGENTS docs stay aligned”
- SKILL.md, README.md, reference.md: **checked** (mismatches found around knowledge-pack contract and required-reference list semantics).
- AGENTS docs: **not verifiable with provided evidence** (no AGENTS content included).

### [phase_contract][advisory] “Output aligns with primary phase docs”
This report is a **docs-phase** alignment review of the orchestrator contract and phase model as represented in provided documentation evidence.

---

## 4) Minimal action list to restore doc sync

1) **Choose the authoritative contract** for knowledge-pack support (pack-aware vs not).
2) Update all three of **SKILL.md / README.md / reference.md** to consistently reflect:
   - task.json/run.json fields
   - phase artifact families (esp. Phase 0 + Phase 3)
   - spawn manifest `source` metadata
   - any “blocking” semantics (e.g., BM25 failure blocks Phase 3)
3) Clarify “Required references” vs “Active contract files” so the set of must-read docs is unambiguous.
4) Provide/attach AGENTS documentation in the evidence bundle for future runs so AGENTS alignment can be audited.