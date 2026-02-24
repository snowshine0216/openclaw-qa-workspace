# Testing Jenkins Analysis System

This document outlines how to run tests, write new tests, and verify the Jenkins QA webhook system.

## 1. Directory Structure

The test suite is organized under `scripts/tests/`:
\`\`\`
scripts/tests/
├── unit/               # Unit tests for individual functions
│   ├── ai_analyzer.test.js
│   ├── docx_converter.test.js
│   ├── extractors.test.js
│   ├── fingerprint.test.js
│   ├── history.test.js
│   ├── parser.test.js
│   ├── parser_deduplication.test.js
│   ├── sanitizer.test.js
│   └── spectre.test.js
└── integration/        # End-to-end and API tests
    └── test_parser.js
\`\`\`

## 2. Running Tests

The project uses [Jest](https://jestjs.io/) as its testing framework. 

To run all unit tests:
\`\`\`bash
cd scripts
npm test
\`\`\`

To run integration tests or system validation checks:
\`\`\`bash
./test.sh
\`\`\`
The `test.sh` file located at the project root verifies folder structures, script permissions, syntax validation, and package dependencies.

## 3. Unit Test Coverage

Unit tests cover the core functionality of the analysis pipeline:

1. **Parsing (`parser.test.js`, `extractors.test.js`)**:
   - Extraction of full error logs using Regex.
   - Proper parsing of test case IDs and step names.
   - Fallback logic for legacy log formats without specific test case IDs.

2. **Deduplication (`parser_deduplication.test.js`)**:
   - Ensures multiple retries of the same test failure are correctly combined.
   - Gathers all snapshot links and accumulates retry metrics.

3. **Fingerprinting (`fingerprint.test.js`)**:
   - Deterministic SHA-256 hash generation using the failing file name, step string, and test IDs.

4. **History & AI Analysis (`history.test.js`, `ai_analyzer.test.js`)**:
   - Validation of consecutive failure calculation.
   - Ensure the heuristic analyzer correctly categorizes infrastructure, script, configuration, production, and dependency failures from unstructured logs.

5. **Reporting (`docx_converter.test.js`, `sanitizer.test.js`)**:
   - Truncation limiters for the DOCX payload.
   - Verifying inline formatting parsing for `.docx` export templates.

## 4. Writing New Tests

When writing new tests for the V2 refactoring, refer to existing `describe` blocks. Use mock inputs mapping to real Jenkins logs (e.g. `const rawLog = "Error: Element not interactable";`) over live network calls inside unit tests.

For external API integrations (like the Feishu Webhook or Jenkins API), mock the responses unless running a full integration shell script test.
