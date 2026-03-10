# E2E Coverage Rules

## When E2E Is Mandatory

`EndToEnd` is mandatory for `user_facing` features.

## Minimum Journey Types

When applicable, include:
- primary happy path
- interruption, exit, or state-transition path
- error or recovery path

## Journey Structure

Each EndToEnd journey should include:
- setup
- action
- completion signal
- optional verification note

## Common E2E Anti-Patterns

1. Top-level EndToEnd section exists but contains only one-line labels
2. Journey covers only entry and not completion
3. Journey omits the relevant completion, exit, or interruption outcome
4. Journey duplicates functional cases without describing a full user workflow

## Examples

- Create report end-to-end from entry point through saved outcome
- Resume interrupted workflow and verify the final recovered state
- Trigger recoverable failure and verify visible recovery path
