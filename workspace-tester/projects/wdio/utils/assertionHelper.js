export function assertWithinTolerance({ actual, expected, tolerance = 1 }) {
    // if expected is string, convert to number
    if (typeof expected === 'string') {
        expected = parseFloat(expected.replace('px', ''));
    }
    if (typeof actual === 'string') {
        actual = parseFloat(actual.replace('px', ''));
    }
    const difference = Math.abs(actual - expected);
    console.log(`difference: ${difference}, tolerance: ${tolerance}, actual: ${actual}, expected: ${expected}`);
    return difference <= tolerance;
}
