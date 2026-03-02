import fs from 'fs';
import path from 'path';
import allureReporter from '@wdio/allure-reporter';
import { FILES, getFilesByPattern } from './test-config.js';
import { getValidationDimensionInfoByName } from '../../db-manager.js';
import { logger } from '../../logger.js';

export function attachBaselineFilesToAllure(baselineFolder, stepName = '', addStep = false) {
    return attachFilesToAllure(baselineFolder, FILES.baseline, stepName, addStep);
}

export function attachOutputFilesToAllure(outputFolder, stepName = '', addStep = false) {
    return attachFilesToAllure(outputFolder, FILES.output, stepName, addStep);
}

export function attachFilesToAllure(folder, fileDefinitions, stepName = '', addStep = false) {
    for (const [, fileInfo] of Object.entries(fileDefinitions)) {
        if (fileInfo.name) {
            // Handle single file
            const filePath = path.resolve(folder, fileInfo.name);
            const encoding = fileInfo.mimeType.startsWith('image') ? undefined : 'utf-8';
            if (fs.existsSync(filePath)) {
                if (addStep) allureReporter.startStep(stepName);
                allureReporter.addAttachment(fileInfo.name, fs.readFileSync(filePath, encoding), fileInfo.mimeType);
                if (addStep) allureReporter.endStep();
            }
        } else if (fileInfo.pattern) {
            // Handle pattern-based files (e.g., grid{index}.md, chart{index}.png)
            const matchedFiles = getFilesByPattern(folder, fileInfo.pattern);
            for (const filename of matchedFiles) {
                const filePath = path.resolve(folder, filename);
                const encoding = fileInfo.mimeType.startsWith('image') ? undefined : 'utf-8';
                if (fs.existsSync(filePath)) {
                    if (addStep) allureReporter.startStep(stepName);
                    allureReporter.addAttachment(filename, fs.readFileSync(filePath, encoding), fileInfo.mimeType);
                    if (addStep) allureReporter.endStep();
                }
            }
        }
    }
}

/**
 * Add execution timing information to Allure
 *
 * @param {Object} executionTimestamp - Execution info with startTime and endTime
 */
export function addExecutionTimingToAllure(executionTimestamp) {
    if (!executionTimestamp) {
        return;
    }

    if (executionTimestamp.startTime && executionTimestamp.endTime) {
        allureReporter.addLabel('executionTimestamp', `${executionTimestamp.startTime},${executionTimestamp.endTime}`);
    }
}

/**
 * Filter defects to show only those relevant to current bot and language
 *
 * @param {Array} defects - Array of defect objects with {defectKey, botId, botName, languageId, languageName}
 * @param {number} currentBotId - Current bot ID being tested
 * @param {number} currentLanguageId - Current language ID being tested
 * @returns {Array} Filtered array of defect keys
 */
export function filterRelevantDefects(defects, currentBotId, currentLanguageId) {
    if (!Array.isArray(defects) || defects.length === 0) {
        return [];
    }

    const relevantDefects = defects.filter((defect) => {
        // Include if:
        // 1. Bot is null (non bot-specific) OR matches current bot
        // 2. Language is null (non language-specific) OR matches current language
        const botMatches = defect.botId === null || defect.botId === currentBotId;
        const languageMatches = defect.languageId === null || defect.languageId === currentLanguageId;

        return botMatches && languageMatches;
    });

    return relevantDefects.map((defect) => defect.defectKey);
}

/**
 * Add known defects to Allure report as links
 *
 * @param {string|Array} defects - Defect identifiers (comma-separated string or array)
 */
export function addKnownDefectsToAllure(defects) {
    const defectList = Array.isArray(defects)
        ? defects
        : typeof defects === 'string'
          ? defects
                .split(',')
                .map((i) => i.trim())
                .filter((i) => i.length > 0)
          : [];

    if (defectList.length === 0) {
        return;
    }

    logger.debug(`🐞 Known defects: ${defectList.join(', ')}`);
    defectList.forEach((singleDefect) => {
        allureReporter.addLink(`https://strategyagile.atlassian.net/browse/${singleDefect}`, singleDefect);
    });
}

/**
 * Add tags to Allure report as parent suites
 *
 * @param {Array} tags - Array of tag strings
 */
export function addTagsToAllure(tags) {
    if (!Array.isArray(tags) || tags.length === 0) {
        return;
    }

    tags.forEach((tag) => {
        allureReporter.addParentSuite(tag);
        allureReporter.addTag(tag);
    });
}

/**
 * Add validation results to Allure with dimension details
 *
 * @param {Object} validation - Validation object with methods and dimensions
 * @param {string} testCaseName - Test case name for logging
 */
export function addValidationResultsToAllure(validation, testCaseName) {
    if (!validation || !validation.methods || validation.methods.length === 0) {
        logger.error(`No validation methods found for ${testCaseName}`);
        allureReporter.addStep(`No validation methods found for ${testCaseName}`, {}, 'failed');
        fail(`No validation methods found for ${testCaseName}`);
        return false;
    }

    let allMethodsPassed = true;

    for (const method of validation.methods) {
        const methodName = method.name;
        const dimensions = method.dimensions;

        if (!dimensions || dimensions.length === 0) {
            logger.error(`Validation method ${methodName} has no validation dimensions for ${testCaseName}.`);
            allureReporter.addStep(
                `Validation method ${methodName} has no validation dimensions for ${testCaseName}.`,
                {},
                'failed'
            );
            fail(`Validation method ${methodName} has no validation dimensions for ${testCaseName}.`);
            allMethodsPassed = false;
            continue;
        }

        allureReporter.startStep(`Validation Method: ${methodName}`);
        let currentMethodPassed = true;

        for (const dimension of dimensions) {
            const dimensionName = dimension.name;
            const dimensionScoreBaseline = getValidationDimensionInfoByName(dimensionName).minPassScore;
            const dimensionScore = parseFloat(dimension.score);
            const dimensionReasoning = dimension.reasoning;

            dimension.isPass = dimensionScore >= dimensionScoreBaseline;
            if (!dimension.isPass) {
                currentMethodPassed = false;
                allMethodsPassed = false;
            }

            // Use Jasmine expect with custom message
            expect(dimensionScore)
                .withContext(`👉 ${dimensionName} Score: ${dimensionScore}`)
                .toBeGreaterThanOrEqual(dimensionScoreBaseline);

            const currentDimensionStatus = dimension.isPass ? 'passed' : 'failed';
            allureReporter.addStep(`🔎 ${dimensionName} Reasoning: ${dimensionReasoning}`, {}, currentDimensionStatus);
        }

        const currentMethodStatus = currentMethodPassed ? 'passed' : 'failed';
        allureReporter.endStep(currentMethodStatus);
    }

    return allMethodsPassed;
}

/**
 * Add execution status and errors to Allure
 *
 * @param {Object} execution - Execution object with status and errors
 * @param {string} testCaseOutputFolder - Output folder path
 * @param {string|null} recordingVideoFilePath - Full path to the video recording file
 * @param {boolean} attachVideo - Whether to attach video recording
 * @param {string} testCaseName - Test case name for logging
 * @returns {string} Execution step status
 */
export function addExecutionStatusToAllure(
    execution,
    testCaseOutputFolder,
    recordingVideoFilePath,
    attachVideo,
    testCaseName
) {
    let executionStepStatus = 'unknown';

    if (!execution) {
        allureReporter.startStep(`Internal script error: no execution information available for ${testCaseName}`);
        executionStepStatus = 'broken';
    } else if (execution.errors?.length > 0) {
        execution.errors.forEach((error, idx) => {
            if (idx !== execution.errors.length - 1) {
                allureReporter.addStep(`Execution Error: ${error.message}`, {}, error.status || 'unknown');
            } else {
                allureReporter.startStep(`Execution Error: ${error.message}`);
                executionStepStatus = error.status || 'unknown';
            }
        });
    } else {
        if (!execution.status) {
            allureReporter.startStep(`Internal script error: no execution status available for ${testCaseName}`);
            executionStepStatus = 'broken';
        } else if (execution.status === 'finished') {
            allureReporter.startStep(`No errors occurred during execution`);
            executionStepStatus = 'passed';
        } else if (execution.status === 'not_started') {
            allureReporter.startStep(`This case has not been executed`);
            executionStepStatus = 'broken';
        } else {
            allureReporter.startStep(
                `Internal script error: unexpected execution status '${execution.status}' for ${testCaseName}`
            );
            executionStepStatus = 'broken';
        }
    }

    // Attach execution error screenshot if available
    const errorScreenshotPath = path.resolve(testCaseOutputFolder, FILES.error.executionErrorScreenshot.name);
    if (fs.existsSync(errorScreenshotPath)) {
        allureReporter.addAttachment(
            FILES.error.executionErrorScreenshot.name,
            fs.readFileSync(errorScreenshotPath),
            FILES.error.executionErrorScreenshot.mimeType
        );
    }

    // Attach error message if available
    const errorMessagePath = path.resolve(testCaseOutputFolder, FILES.error.errorMessage.name);
    if (fs.existsSync(errorMessagePath)) {
        allureReporter.addAttachment(
            FILES.error.errorMessage.name,
            fs.readFileSync(errorMessagePath, 'utf-8'),
            FILES.error.errorMessage.mimeType
        );
    }

    // Attach execution video if available
    if (attachVideo && recordingVideoFilePath && fs.existsSync(recordingVideoFilePath)) {
        logger.debug(`Attaching recording video from: ${recordingVideoFilePath}`);
        allureReporter.addAttachment('Execution recording', fs.readFileSync(recordingVideoFilePath), 'video/webm');
    }

    allureReporter.endStep(executionStepStatus);
    return executionStepStatus;
}

/**
 * Categorize test case for Allure reporting (Feature/Story)
 *
 * @param {Object} execution - Execution object
 * @param {Object} validation - Validation object
 * @param {string|Array} defects - Known defects (filtered)
 * @param {string} isFollowUp - Whether it's a follow-up test case
 */
export function categorizeTestCase(execution, validation, defects, isFollowUp) {
    let feature = null;
    const stories = new Set();

    const defectList = Array.isArray(defects)
        ? defects
        : typeof defects === 'string'
          ? defects
                .split(',')
                .map((i) => i.trim())
                .filter((i) => i.length > 0)
          : [];

    if (!execution || execution.status === 'broken') {
        feature = '==================== Broken Analysis ====================';
        stories.add('>>>>> All execution broken <<<<<');

        const storyCount = stories.size;
        const categoryPrefix = '🏷️ [Broken Category]';
        const uncategorizedBroken = '🏷️ [Uncategorized broken]';

        if (execution.errors.length > 0) {
            execution.errors.forEach((error) => {
                if (error.status === 'broken') {
                    stories.add(`${categoryPrefix} ${error.category}` || `${categoryPrefix} Unknown broken category`);
                }
            });
        }

        if (stories.size === storyCount) {
            stories.add(uncategorizedBroken);
        }
    } else if (execution.status === 'not_started') {
        feature = '==================== Broken Analysis ====================';
        stories.add('>>>>> All not-run cases <<<<<');
    } else if (!validation.isFullPass) {
        feature = '==================== Failure Analysis ====================';

        if (execution.status === 'finished') {
            stories.add('>>>>> All validation failures <<<<<');
        } else {
            stories.add('>>>>> All execution failures <<<<<');
        }

        if (defectList.length > 0) {
            stories.add('⚪ Expected failures (known defect)');
        } else {
            stories.add('❌ Unexpected failures');
        }

        if (isFollowUp) {
            stories.add(`⚠️ Follow up failures`);
        }

        const storyCount = stories.size;
        const categoryPrefix = '🏷️ [Failure Category]';
        const aiCategoryPrefix = '🏷️ [AI Failure Category]';
        const uncategorizedFailure = '🏷️ [Uncategorized failure]';

        if (execution.errors.length > 0) {
            execution.errors.forEach((error) => {
                if (error.status !== 'broken') {
                    stories.add(`${categoryPrefix} ${error.category}` || `${categoryPrefix} Unknown failure category`);
                }
            });
        }

        validation.methods.forEach((method) => {
            method.dimensions.forEach((dimension) => {
                if (
                    dimension.failureCategory !== '' &&
                    dimension.failureCategory != null &&
                    dimension.failureCategory !== 'null'
                ) {
                    stories.add(`${aiCategoryPrefix} ${dimension.failureCategory}`);
                }
            });
        });

        if (stories.size === storyCount) {
            stories.add(uncategorizedFailure);
        }
    } else {
        feature = '==================== Success Analysis ====================';
        stories.add('>>>>> All validation passed <<<<<');

        if (defectList.length > 0) {
            stories.add('❔ Unexpected successes (known defect but passed)');
        } else {
            stories.add('✔️ Expected successes');
        }
    }

    allureReporter.addFeature(feature);
    stories.forEach((story) => {
        allureReporter.addStory(story);
    });
}

/**
 * Add question translations CSV to Allure
 *
 * @param {Array} questionTranslations - Array of translation objects
 * @param {string} excludeLanguageName - Language name to exclude from output (optional)
 */
export function addQuestionTranslationsToAllure(questionTranslations, excludeLanguageName = null) {
    if (!questionTranslations || questionTranslations.length === 0) {
        return;
    }

    // Filter out the excluded language if specified
    const filteredTranslations = excludeLanguageName
        ? questionTranslations.filter((translation) => translation.languageName !== excludeLanguageName)
        : questionTranslations;

    // Return early if no translations left after filtering
    if (filteredTranslations.length === 0) {
        return;
    }

    const csvHeader = 'LanguageName,Question\n';
    const csvRows = filteredTranslations.map((translation) => {
        const escapedLanguageName = `"${translation.languageName.replace(/"/g, '""')}"`;
        const escapedQuestion = `"${translation.question.replace(/"/g, '""')}"`;
        return `${escapedLanguageName},${escapedQuestion}`;
    });
    const csvContent = csvHeader + csvRows.join('\n');

    allureReporter.addAttachment('questionTranslations.csv', Buffer.from(csvContent, 'utf-8'), 'text/csv');
}

/**
 * Check if baseline files exist in the baseline folder
 *
 * @param {string} baselineFolder - Baseline folder path
 * @returns {boolean} True if any baseline files exist
 */
function hasBaselineFiles(baselineFolder) {
    if (!fs.existsSync(baselineFolder)) {
        return false;
    }

    // Check for any baseline files
    for (const [, fileInfo] of Object.entries(FILES.baseline)) {
        if (fileInfo.name) {
            const filePath = path.resolve(baselineFolder, fileInfo.name);
            if (fs.existsSync(filePath)) {
                return true;
            }
        } else if (fileInfo.pattern) {
            const matchedFiles = getFilesByPattern(baselineFolder, fileInfo.pattern);
            if (matchedFiles.length > 0) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Attach References section to Allure, including Baselines and Descriptions
 * Only shows the section if there are baselines or other language translations
 *
 * @param {string} baselineFolder - Baseline folder path
 * @param {Array} translations - Array of translation objects
 * @param {string} currentLanguageName - Current language name to exclude from descriptions
 */
export function attachReferencesToAllure(baselineFolder, translations, currentLanguageName) {
    const hasBaselines = hasBaselineFiles(baselineFolder);

    // Filter out the current language for descriptions
    const otherLanguages =
        translations && translations.length > 0
            ? translations.filter((t) => t.languageName !== currentLanguageName)
            : [];
    const hasDescriptions = otherLanguages.length > 0;

    // Skip the entire References section if there are no baselines and no descriptions
    if (!hasBaselines && !hasDescriptions) {
        return;
    }

    allureReporter.startStep('📚 References >>>');

    // Add Baselines subsection if available
    if (hasBaselines) {
        allureReporter.startStep('🗂️ Baselines');
        attachBaselineFilesToAllure(baselineFolder);
        allureReporter.endStep();
    }

    // Add Descriptions subsection if available
    if (hasDescriptions) {
        allureReporter.startStep('📝 Descriptions');
        addQuestionTranslationsToAllure(translations, currentLanguageName);
        allureReporter.endStep();
    }

    allureReporter.endStep('skipped');
}
