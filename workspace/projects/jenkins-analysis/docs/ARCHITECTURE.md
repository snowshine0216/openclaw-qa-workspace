# Jenkins Failure Analysis Architecture

This document describes the high-level architecture of the Jenkins Analysis System. It combines design features, data flows, and automated analysis categorizations into a single reference.

## 1. System Overview

The system uses a Node.js Express server to listen for Jenkins webhook events and an external bash script (`analyzer.sh`) as a dispatcher to coordinate the analysis workload.

**Key Features:**
- **Job Status Extraction**: Filters for triggered/failing downstream jobs and parses nested Jenkins console logs through its public API.
- **Deduplication**: Automatically groups identical test failures and retries under a single unique fingerprint.
- **AI Heuristics Analysis**: Extracts logs matching typical test flakiness patterns like _Infrastructure Failures_ and provides specific next steps.
- **Reporting Generator**: Exports to Markdown and `.docx`.

## 2. Core Modules

The original monolith node script was broken into distinct functional groupings in `scripts/`:

### \`server/\`
- `index.js`: Express webhook API server. Identifies the incoming Job metadata and executes `analyzer.sh`.
- `config.js`: Shared configuration variables.

### \`parsing/\`
- `parser.js`: Parses chunked logs into distinct failures. Supports standard string formats and V2 file-specific regex capturing.
- `extractors.js`: Dedicated Regex-based metadata extraction properties (e.g. TC/BUG tags, URL strings, and screenshot payloads).
- `deduplication.js`: Normalizes similar failures across retries to prevent duplicate log pollution.

### \`analysis/\`
- `ai_analyzer.js`: Classifies unhandled failures by cross-referencing log dumps against heuristics such as syntax, timeout, permissions, or dependency issues.
- `spectre.js`: Responsible for scraping diff outputs for visual regressions from headless servers.
- `fingerprint.js`: Cryptographic deterministic failure tracker handling job caching over multiple builds.
- `history.js`: Calculates the consecutive failure rate (max 5 backwards scans) for flake reporting.

### \`database/\`
- SQLite-backed operations to persist testing metadata.
- `schema.js`, `operations.js`: Tables configured to keep records using upserts, automatically cleaning data exceeding a 5-build rolling history.

### \`reporting/\`
- `generator.js`: Combines parsed logs, AI analysis, SQLite database results, and previous build data into a formatted `MD` report.
- `docx_converter.js`: Takes a raw markdown document and creates interactive structured `.docx` templates including nested table stylings and emoji-based visualizations.
- `sanitizer.js`: Truncates large string outputs and formats console output for presentation.

## 3. Data Flow

1. Jenkins Post-build Action matches failure.
2. Webhook triggers `server/index.js` -> kicks off `analyzer.sh` asynchronously.
3. Bash calls `/job/{X}/${N}/consoleText` on Jenkins.
4. Downstream multi-jobs are expanded and individual consoles are streamed into `parser.js`.
5. Failures are processed, aggregated, and assigned SHA-256 fingerprints.
6. DB history is updated to reflect this run (`pipeline/process_build.js`).
7. `generator.js` consumes JSON assets to write a `.md`.
8. `docx_converter.js` generates the final DOC template payload.
9. Feishu script broadcasts the report link to intended QA chats.
