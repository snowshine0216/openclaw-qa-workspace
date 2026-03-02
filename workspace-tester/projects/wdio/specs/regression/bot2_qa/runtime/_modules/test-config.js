import fs from 'fs';
import path from 'path';
import { generateTestCaseInstanceName } from '../../common.js';

/**
 * File definitions for baseline, output, and error files
 * Used throughout the test execution and validation process
 */
export const FILES = {
    baseline: {
        fullAnswerImage: { name: 'full_answer.png', mimeType: 'image/png' },
        answerText: { name: 'answer.txt', mimeType: 'text/plain' },
        gridMarkdowns: { pattern: 'grid{index}.md', mimeType: 'text/plain' },
        chartImages: { pattern: 'chart{index}.png', mimeType: 'image/png' },
        insightText: { name: 'insight.txt', mimeType: 'text/plain' },
        unstructuredDataReference: { name: 'unstructured_data_reference.txt', mimeType: 'text/plain' },
        interpretationSql: { name: 'interpretation_sql.txt', mimeType: 'text/plain' },
        aiDiagnostics: { name: 'ai_diagnostics.json', mimeType: 'application/json' },
        keyScorePoints: { name: 'key_points.txt', mimeType: 'text/plain' },
    },
    output: {
        fullAnswerImage: { name: 'full_answer.png', mimeType: 'image/png' },
        answerText: { name: 'answer.txt', mimeType: 'text/plain' },
        gridMarkdowns: { pattern: 'grid{index}.md', mimeType: 'text/plain' },
        chartImages: { pattern: 'chart{index}.png', mimeType: 'image/png' },
        insightText: { name: 'insight.txt', mimeType: 'text/plain' },
        unstructuredDataReference: { name: 'unstructured_data_reference.txt', mimeType: 'text/plain' },
        interpretationSql: { name: 'interpretation_sql.txt', mimeType: 'text/plain' },
        aiDiagnostics: { name: 'ai_diagnostics.json', mimeType: 'application/json' },
    },
    error: {
        executionErrorScreenshot: { name: 'execution_error_screenshot.png', mimeType: 'image/png' },
        errorMessage: { name: 'error_message.txt', mimeType: 'text/plain' },
    },
};

/**
 * Get files matching a pattern in a directory
 *
 * @param {string} dir - Directory to search in
 * @param {string} pattern - Pattern with {index} placeholder (e.g., 'grid{index}.md')
 * @param {boolean} absolutePath - Whether to return absolute paths
 * @returns {string[]} Array of matching filenames or paths
 */
export function getFilesByPattern(dir, pattern, absolutePath = false) {
    const regexStr = '^' + pattern.replace('{index}', '([^.]*)') + '$';
    const regex = new RegExp(regexStr);

    if (!fs.existsSync(dir)) {
        return [];
    }

    return fs
        .readdirSync(dir)
        .filter((filename) => regex.test(filename))
        .map((filename) => (absolutePath ? path.resolve(dir, filename) : filename));
}

/**
 * Sanitize and validate credential object
 *
 * @param {Object} rawCredential - Raw credential object with username and password
 * @returns {Object|null} Sanitized credential or null if invalid
 */
export function sanitizeCredential(rawCredential) {
    if (!rawCredential || typeof rawCredential.username !== 'string') {
        return null;
    }

    const username = rawCredential.username.trim();
    if (username.length === 0) {
        return null;
    }

    const password = typeof rawCredential.password === 'string' ? rawCredential.password : '';

    return {
        username,
        password,
    };
}

/**
 * Generate test case mark (emoji indicators)
 *
 * @param {Object} testCase - Test case object
 * @returns {string} Mark string with emojis (e.g., '🐞↩️ ')
 */
export function getTestCaseMark(testCase) {
    let testCaseMark = '';
    if (testCase.defects && testCase.defects.length > 0) {
        testCaseMark += '🐞';
    }
    if (testCase.prerequisiteTestCaseId) {
        testCaseMark += '↩️';
    }
    if (testCaseMark !== '') {
        testCaseMark += ' ';
    }
    return testCaseMark;
}

/**
 * Generate full display name for a test case
 * Includes mark, instance name, and question
 *
 * @param {Object} testCase - Test case object
 * @param {string} instanceName - Instance name to include
 * @returns {string} Full display name for the test case
 */
export function generateTestCaseDisplayName(testCase, instanceName) {
    const testCaseInstanceName = generateTestCaseInstanceName(testCase.testCaseName, instanceName);
    return `${getTestCaseMark(testCase)}${testCaseInstanceName}`;
}

/**
 * Parse metadata.json file from baseline folder and resolve the actual baseline folder path
 * If metadata.json exists and contains reuseBaseline field, return the redirected path
 * Otherwise, return the original baseline folder path
 *
 * @param {string} baselineFolder - Original baseline folder path
 * @param {string} rootBaselineFolder - Root baseline folder
 * @returns {string} Resolved baseline folder path (either redirected or original)
 */
export function resolveBaselineFolderWithMetadata(baselineFolder, rootBaselineFolder) {
    const metadataFilePath = path.resolve(baselineFolder, 'metadata.json');

    // If metadata.json doesn't exist, use the original path
    if (!fs.existsSync(metadataFilePath)) {
        return baselineFolder;
    }

    try {
        // Read and parse metadata.json
        const metadataContent = fs.readFileSync(metadataFilePath, 'utf-8');
        const metadata = JSON.parse(metadataContent);

        // Check if reuseBaseline field exists and is valid
        if (metadata.reuseBaseline && typeof metadata.reuseBaseline === 'string') {
            const reuseBaselinePath = metadata.reuseBaseline.trim();
            if (reuseBaselinePath.length > 0) {
                // Resolve the redirected baseline folder path
                const resolvedPath = path.resolve(rootBaselineFolder, reuseBaselinePath);
                return resolvedPath;
            }
        }

        // If reuseBaseline is not valid, use the original path
        return baselineFolder;
    } catch (error) {
        // If there's any error parsing metadata.json, log warning and use original path
        console.warn(`Failed to parse metadata.json at ${metadataFilePath}: ${error.message}`);
        return baselineFolder;
    }
}
