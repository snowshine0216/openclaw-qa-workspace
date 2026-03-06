# Examples: Code Structure Quality

## Example 1: Split mixed-concern module

Input situation:
- One file handles parsing, persistence, and CLI argument processing.

Action:
1. Extract pure parsing logic to a parsing module.
2. Move persistence logic to a data adapter/operations module.
3. Keep CLI file as orchestration only.

Expected result:
- Lower coupling and easier unit testing.

## Example 2: Remove duplicate classification logic

Input situation:
- Two modules classify the same status using nearly identical branches.

Action:
1. Create one canonical classifier module.
2. Replace duplicate implementations with imports.
3. Add regression tests around canonical behavior.

Expected result:
- DRY enforcement with consistent behavior.

## Example 3: Isolate side effects

Input situation:
- Utility function both transforms data and writes files.

Action:
1. Split into `transform(data)` and `writeOutput(result)`.
2. Keep transform deterministic and side-effect free.
3. Wire both in orchestration layer.

Expected result:
- Fast unit tests and predictable behavior.
