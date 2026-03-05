const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testMdToDocx = () => {
    const mdContent = `
# Test Report
| Job | Link |
|---|---|
| JobA | [Click Here](http://example.com) |
    `;
    const inputPath = path.join(__dirname, 'test_input.md');
    const outputPath = path.join(__dirname, 'test_output.docx');
    
    fs.writeFileSync(inputPath, mdContent);
    currentDir = path.resolve(__dirname, '..', 'scripts');
    
    execSync(`node md_to_docx.js ../tests/test_input.md ../tests/test_output.docx`, { cwd: currentDir });
    
    assert.ok(fs.existsSync(outputPath), "Output docx should be created");
    
    // Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
    console.log('✅ md_to_docx integration test passed');
};

testMdToDocx();
