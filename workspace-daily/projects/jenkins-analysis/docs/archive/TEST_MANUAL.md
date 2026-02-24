# Test Manual

This document explains how to execute standalone tests for the Jenkins QA Monitor plugins/scripts.

## Requirements
Make sure dependencies are installed inside the \`scripts/\` folder.
\`\`\`bash
cd scripts/
npm install
\`\`\`

## Running the Unit Tests

We have created individual JavaScript test files in the \`tests/\` folder that can be run incrementally. These tests ensure the correctness of individual Node.js components like DB storage and Markdown parsing.

### db_writer logic test
Tests Spectre URL parsing, false alarm classification, and fingerprint hashing logic.
\`\`\`bash
node tests/db_writer.test.js
\`\`\`
**Expected output:**
\`\`\`
✅ buildFingerprint test passed
✅ parseSpectreUrl test passed
✅ classifySpectreResult test passed
\`\`\`

### md_to_docx converter test
Tests the markdown DOCX parser and \`ExternalHyperlink\` URL injection.
\`\`\`bash
node tests/md_to_docx.test.js
\`\`\`
**Expected output:**
\`\`\`
✓ DOCX created: ../tests/test_output.docx
✅ md_to_docx integration test passed
\`\`\`
