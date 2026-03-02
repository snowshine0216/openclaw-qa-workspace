# Self-Healing Progress: report-editor / 2c

## Round 1
- Timestamp: 2026-03-01T11:02:28Z
- Failing specs:
  - `tests/specs/report-editor/report-creator/create-by-cube.spec.ts`
  - `tests/specs/report-editor/report-creator/create-by-cube-privilege.spec.ts`
  - `tests/specs/report-editor/report-creator/report-creator.spec.ts`
  - `tests/specs/report-editor/report-creator/report-template-security.spec.ts`
  - `tests/specs/report-editor/report-creator/template.spec.ts`
  - `tests/specs/report-editor/report-creator/template-by-execution-mode.spec.ts`
- Healer output: `migration/self-healing/report-editor/2c/round-1.md`
- Healer summary: WDIO-aligned selector/tooltip fixes in `dossier-creator.ts`
- Rerun result: `1 passed, 25 failed, 16 skipped` (`npm run test:report-creator`)
