# Notes

## Seed State

This benchmark root was seeded before any replay or knowledge-pack evals were implemented.

Known facts:

1. The current active benchmark only freezes eval ids `1`, `2`, and `3` from `evals/evals.json`.
2. The `compare-result.md` fixture exists and can be used by the current catalog.
3. The BCIN-7289 defect-analysis run exists and is reserved for replay expansion.
4. The BCED-2416 draft fixture referenced by the current eval-group catalog is missing in this workspace.

## Next Steps

1. Copy the current skill tree into `iteration-0/champion_snapshot/`.
2. Run `npm test`.
3. Run the seeded baseline in `iteration-0` using `with_skill` and `without_skill`.
4. Generate `iteration-0/benchmark.json` and `iteration-0/benchmark.md`.
