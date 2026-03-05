const assert = require('assert');
const { buildFingerprint, classifySpectreResult, parseSpectreUrl } = require('../scripts/db_writer');

const testFingerprint = () => {
    const res = buildFingerprint('TC1', 'Step1', 'Name', 'screenshot');
    assert.strictEqual(typeof res, 'string');
    assert.strictEqual(res.length, 64);
    console.log('✅ buildFingerprint test passed');
};

const testParseUrl = () => {
    const url = 'http://10.23.33.4:3000/projects/wdio_ci/suites/show-toolbar/runs/2571#test_6055635';
    const parsed = parseSpectreUrl(url);
    assert.strictEqual(parsed.project, 'wdio_ci');
    assert.strictEqual(parsed.suite, 'show-toolbar');
    assert.strictEqual(parsed.runId, 2571);
    assert.strictEqual(parsed.testId, 6055635);
    console.log('✅ parseSpectreUrl test passed');
};

const testClassify = () => {
    // False alarm cases
    const t1 = classifySpectreResult({ pass: true, diff: 2.5, diff_threshold: 0.1 });
    assert.strictEqual(t1.falseAlarm, 1);
    
    // Cosmetic noise
    const t2 = classifySpectreResult({ pass: false, diff: 0.5, diff_threshold: 0.1 });
    assert.strictEqual(t2.falseAlarm, 1);

    // Real regression
    const t3 = classifySpectreResult({ pass: false, diff: 2.1, diff_threshold: 0.1 });
    assert.strictEqual(t3.falseAlarm, 0);
    assert.strictEqual(t3.verified, 1);
    
    console.log('✅ classifySpectreResult test passed');
};

testFingerprint();
testParseUrl();
testClassify();
