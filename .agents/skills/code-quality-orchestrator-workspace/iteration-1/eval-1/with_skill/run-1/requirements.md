# Parser Requirements

Implement a new parser function for alert-rule statements.

## Rule Grammar

`<metric> <operator> <threshold> => <action>`

Examples:
- `latency_ms >= 250 => warn`
- `error_rate > 1.5 => page`

## Functional Requirements

1. Expose `parseRuleLine(line, lineNumber)` to parse one rule line.
2. Support operators: `>`, `>=`, `<`, `<=`, `==`.
3. `metric` uses letters, numbers, and underscore; must start with a letter or underscore.
4. `threshold` is a valid number.
5. `action` is one word using letters, numbers, underscore, or dash.
6. Ignore surrounding whitespace.
7. Throw a descriptive error when parsing fails; include line number when provided.
8. Expose `parseRulesText(text, sourceName)`:
   - split by lines
   - ignore blank lines and lines beginning with `#`
   - parse remaining lines with `parseRuleLine`
   - include source name and line number in thrown errors
9. Expose `parseRulesFile(filePath)` that reads a UTF-8 file and parses via `parseRulesText`.
10. Keep parser logic pure; isolate file IO in file-level adapter.
