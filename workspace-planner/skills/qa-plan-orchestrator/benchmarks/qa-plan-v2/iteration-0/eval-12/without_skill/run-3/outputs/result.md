# DOC-SYNC-001 Docs Contract Review

## Scope

- Benchmark case: `DOC-SYNC-001`
- Phase/checkpoint under test: `docs`
- Evidence mode: `blind_pre_defect`
- Evidence used: copied fixtures only
- Customer issue evidence used: none provided in the blind bundle

## Verdict

The documentation set does not satisfy this benchmark on the provided blind evidence.

The benchmark explicitly requires that `SKILL.md`, `README.md`, `reference.md`, and AGENTS docs stay aligned, but the copied bundle includes only `README.md` and `reference.md` (`benchmark_request.json:30-33`, `benchmark_request.json:61-75`). That means the required cross-document alignment cannot be demonstrated from the blind bundle. The two provided docs also contain visible contract drift.

## Findings

### 1. Required docs for the sync check are missing from the blind bundle

- The benchmark focus is explicit: `SKILL.md`, `README.md`, `reference.md`, and AGENTS docs must stay aligned (`benchmark_request.json:30-33`).
- The blind fixture materials include only `README.md` and `reference.md` (`benchmark_request.json:61-75`).
- No AGENTS document is present in the bundle, and the provided docs do not establish any AGENTS-specific alignment contract.

Impact: the case focus is not explicitly coverable from the supplied evidence, so satisfaction cannot be demonstrated.

### 2. README declares outputs that the runtime reference does not contract

- `README.md` says the skill produces `request_fulfillment_<feature-id>.md` and `.json` under `context/` (`README.md:18`).
- `README.md` also says the skill produces `developer_smoke_test_<feature-id>.md` during Phase 7 (`README.md:21`).
- `reference.md` defines artifact families for Phases 0-7, but those outputs are not listed in the phase artifact contract (`reference.md:140-208`).

Impact: operators following `reference.md` alone would not know these artifacts are expected outputs, so the docs are not aligned on artifact contract.

### 3. README does not fully reflect the current phase model described in reference.md

- `README.md` phase mapping covers Phase 1, 3, 4a, 4b, 5a, 5b, and 6 (`README.md:39-51`).
- `reference.md` defines artifact families and gates for Phases 0 through 7 (`reference.md:140-208`, `reference.md:311-322`).

Impact: the human-facing doc is not aligned with the full current phase model required by the benchmark prompt.

### 4. reference.md has an internal mode-name inconsistency

- For `REPORT_STATE = CONTEXT_ONLY`, the user interaction includes `generate from cache` (`reference.md:52`).
- The documented `selected_mode` values are only `full_regenerate`, `smart_refresh`, and `reuse` / `resume` (`reference.md:55-63`).

Impact: even within the reference doc, the runtime contract is ambiguous about whether `generate from cache` is a real mode or just a description of another mode.

## Expectation Check

- `[phase_contract][advisory] Case focus is explicitly covered: SKILL.md, README.md, reference.md, and AGENTS docs stay aligned`
  - Result: not met on provided evidence.
- `[phase_contract][advisory] Output aligns with primary phase docs`
  - Result: not met on provided evidence because the available docs already disagree on artifact inventory and phase-model coverage.

## Minimal Remediation

1. Include `SKILL.md` and the relevant AGENTS doc in the synchronized documentation set and name the canonical owner for each contract surface.
2. Reconcile the artifact inventory so `README.md` and `reference.md` agree on `request_fulfillment_*` and `developer_smoke_test_*`.
3. Update the human-facing phase summary to reflect the full Phase 0-7 model, or explicitly mark omitted phases and link to the canonical phase contract.
4. Resolve the `generate from cache` mode ambiguity in `reference.md`.
