# E2E Coverage Rules

## When E2E Is Mandatory

An end-to-end journey is mandatory for `user_facing` features. In the script-driven XMindMark format, that can be expressed as a full nested scenario chain even when the top-level categories are severity or risk buckets instead of a literal `EndToEnd` heading.

## Minimum Journey Types

When applicable, include:
- primary happy path
- interruption, exit, or state-transition path
- error or recovery path

## Common E2E Anti-Patterns

1. The draft has categories and subcategories but no scenario chain that reaches a visible completion outcome
2. The journey covers only entry and not completion
3. The journey omits the relevant completion, exit, or interruption outcome
4. The journey duplicates functional cases without describing a full user workflow

## Examples

- Create report end-to-end from entry point through saved outcome
- Resume interrupted workflow and verify the final recovered state
- Trigger recoverable failure and verify visible recovery path
