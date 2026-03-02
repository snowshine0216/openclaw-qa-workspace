import fs from 'fs';
import path from 'path';
import allureReporter from '@wdio/allure-reporter';
import { FILES } from './test-config.js';
import { logger } from '../../logger.js';

/**
 * Record execution error
 * Logs error, updates test case, and fails the test
 *
 * @param {Object} testCase - Test case object to update
 * @param {string} message - Error message
 * @param {string} status - Error status ('broken', 'failed', 'unknown')
 * @param {string} category - Error category for classification
 */
export function recordExecutionError({ testCase, message, status, category }) {
    logger.error(`❌ Execution error for ${testCase.testCaseName}: ${message}`);
    allureReporter.addStep(message, {}, status);
    testCase.execution.status = status;
    testCase.execution.errors.push({
        message: message,
        status: status,
        category: category,
    });
    fail(message);
}

/**
 * Capture error screenshot
 * Takes screenshot and saves to output folder, also adds to Allure
 *
 * @param {string} outputFolder - Folder to save screenshot
 * @param {string} errorDescription - Description of the error
 */
export async function captureErrorScreenshot(outputFolder, errorDescription = 'Unexpected execution error') {
    logger.debug(`Screenshot when ${errorDescription}`);
    const screenshot = await browser.takeScreenshot();
    const screenshotPath = path.resolve(outputFolder, FILES.error.executionErrorScreenshot.name);
    fs.writeFileSync(screenshotPath, screenshot, 'base64');

    allureReporter.startStep(`Screenshot when ${errorDescription} >>>`);
    allureReporter.addAttachment(`Error screenshot`, Buffer.from(screenshot, 'base64'), 'image/png');
    allureReporter.endStep('failed');
}

/**
 * Capture error message
 * Extracts error message from bot answer and saves to output folder
 *
 * @param {Object} aibotChatPanel - Page object for chat panel
 * @param {number} currentAnswerIndex - Index of the current answer
 * @param {string} outputFolder - Folder to save error message
 */
export async function captureErrorMessage(aibotChatPanel, currentAnswerIndex, outputFolder) {
    try {
        if (await aibotChatPanel.getShowErrorMessage(currentAnswerIndex).isDisplayed()) {
            await aibotChatPanel.clickShowErrorDetails(currentAnswerIndex);
            const errorMessage = await aibotChatPanel.getErrorDetailedMessage(currentAnswerIndex);
            const errorMessagePath = path.resolve(outputFolder, FILES.error.errorMessage.name);
            fs.writeFileSync(errorMessagePath, errorMessage, 'utf-8');
            logger.debug(`Saved error message to ${errorMessagePath}`);
        }
    } catch (error) {
        logger.warn(`Failed to capture error message: ${error.message}`);
    }
}

/**
 * Handle test case group errors
 * Records error for all test cases in a group
 *
 * @param {Array} testCaseGroup - Array of test cases
 * @param {string} message - Error message
 * @param {string} status - Error status
 * @param {string} category - Error category
 */
export function recordGroupError(testCaseGroup, message, status, category) {
    logger.error(`❌ Group error: ${message}`);
    for (const testCase of testCaseGroup) {
        recordExecutionError({
            testCase: testCase,
            message: message,
            status: status,
            category: category,
        });
    }
}

/**
 * Create error context for better debugging
 *
 * @param {Object} testCase - Test case object
 * @param {string} phase - Execution phase (e.g., 'login', 'bot_execution', 'question')
 * @param {Error} error - Original error object
 * @returns {Object} Error context object
 */
export function createErrorContext(testCase, phase, error) {
    return {
        testCaseId: testCase.testCaseId,
        testCaseName: testCase.testCaseName,
        question: testCase.question,
        phase: phase,
        errorMessage: error.message,
        errorStack: error.stack,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Error categories for classification
 */
export const ERROR_CATEGORIES = {
    // Setup/Configuration errors
    TEST_SUITE_SETUP: 'Test suite setup error',
    BOT_INITIALIZATION: 'Bot initialization error',
    WORKSPACE_SETUP: 'Workspace setup error',

    // Authentication errors
    AUTHENTICATION: 'Authentication error',
    LOGIN_FAILED: 'Login failed',
    LOGOUT_FAILED: 'Logout failed',

    // Execution errors
    BOT_EXECUTION: 'Bot execution error',
    NOT_ON_BOT_PAGE: 'Not on bot page error',
    QUESTION_MISMATCH: 'Question mismatch (please check if question contains special characters)',
    QUOTED_ANSWER_MISMATCH: 'Quoted answer mismatch (please check if question contains special characters)',

    // Answer errors
    ANSWER_TIMEOUT: 'Answer timeout',
    ANSWER_STREAMING_TIMEOUT: 'Answer streaming timeout',
    ANSWER_STREAMING_TIMEOUT_RESEARCH: 'Answer streaming timeout (research mode)',
    ANSWER_ERROR: 'Answer error',
    NEED_CLARIFICATION: 'Need clarification',

    // Validation errors
    VALIDATION_ERROR: 'Validation error',
    BASELINE_NOT_FOUND: 'Baseline not found',
    IMAGE_COMPARISON_ERROR: 'Image comparison error',
    AI_EVALUATION_ERROR: 'AI Evaluation Error',

    // Unknown/Generic errors
    UNKNOWN_EXECUTION_ERROR: 'Unknown execution broken error',
    PREPARATION_ERROR: 'Preparation broken error',
    INTERNAL_SCRIPT_ERROR: 'Internal script error',
};
