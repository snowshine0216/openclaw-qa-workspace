import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import allureReporter from '@wdio/allure-reporter';
import { browserWindow } from '../../../../../constants/index.js';
import setWindowSize from '../../../../../config/setWindowSize.js';
import { cleanFileInFolder } from '../../../../../utils/TakeScreenshot.js';
import urlParser from '../../../../../api/urlParser.js';
import { logger } from '../../logger.js';
import { generateTestCaseInstanceName } from '../../common.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import test parameters
import { testParams } from '../../param-provider.js';

// Import modular helpers
import {
    generateTestCaseDisplayName,
    sanitizeCredential,
    resolveBaselineFolderWithMetadata,
} from '../_modules/test-config.js';
import {
    loadTestProfile,
    initializeTestCases,
    buildPrerequisiteDependencies,
    buildTestCaseGroup,
    createCredentialResolver,
    saveTestProfile,
    initializeTestCaseResults,
} from '../_modules/profile-loader.js';
import { initializeBot } from '../_modules/bot-initializer.js';
import { createExecutionContext } from '../_modules/execution-context.js';
import {
    captureFullAnswerImage,
    captureAnswerText,
    captureGridMarkdowns,
    captureChartImages,
    captureInsightText,
    captureUnstructuredDataReferences,
    captureInterpretationSql,
    retrieveAiDiagnostics,
    checkAnswerStatus,
} from '../_modules/answer-capture.js';
import { performValidation } from '../_modules/validation.js';
import {
    attachOutputFilesToAllure,
    addExecutionTimingToAllure,
    addKnownDefectsToAllure,
    filterRelevantDefects,
    addTagsToAllure,
    addValidationResultsToAllure,
    addExecutionStatusToAllure,
    categorizeTestCase,
    attachReferencesToAllure,
} from '../_modules/report.js';
import {
    recordExecutionError,
    captureErrorScreenshot,
    captureErrorMessage,
    recordGroupError,
    ERROR_CATEGORIES,
} from '../_modules/error-handler.js';

// =============================================================================
// TEST CONFIGURATION
// =============================================================================

// Set Jasmine timeout
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1800000; // 30 minutes

// Extract test parameters
const {
    testEachCaseInNewChat,
    enableFollowUp,
    enableAutoComplete,
    enableAiDiagnostics,
    executeBotByName,
    createChatBeforeTest,
    deleteChatAfterTest,
    overrideTestUserName,
    overrideTestUserPassword,
    overrideProjectName,
    exportInterpretation,
    exportAiDiagnostics,
    attachVideoRecordingInValidation,
    isDebugMode,
} = testParams;

// Load test profile
const testProfileFilePath = path.resolve(__dirname, 'profile.json');
const testProfile = loadTestProfile(testProfileFilePath);
const testCases = initializeTestCases(testProfile.cases);
const botInfo = testProfile.config.bot;
const languageInfo = testProfile.config.language;
const instanceName = testProfile.instanceName;
const testSuiteName = testProfile.testSuiteName;
const testCasesThatBeenDependOn = buildPrerequisiteDependencies(testCases);

// Initialize bot configuration
const botConfig = {
    name: botInfo.name,
    objectId: botInfo.objectId,
    projectId: null,
    projectName: overrideProjectName || botInfo.projectName,
    groupName: botInfo.groupName,
    variantName: botInfo.variantName,
};

const languageConfig = {
    id: languageInfo.id,
    name: languageInfo.name,
    code: languageInfo.code,
};

// Setup folder paths
const baselineFolder = path.resolve(__dirname, '../../baselines');
const baselineFolderForCurrentBot = path.resolve(baselineFolder, botConfig.groupName);
const outputFolder = path.resolve(__dirname, 'outputs');
const allureRawFolder = path.resolve(__dirname, '../../../../../reports/allure-raw');

// Setup credentials
const overrideCredential = sanitizeCredential({
    username: overrideTestUserName,
    password: overrideTestUserPassword,
});
const defaultCredential = sanitizeCredential(testProfile.cases[0]?.testCredential);
const resolveCredential = createCredentialResolver(overrideCredential, defaultCredential);

// Validation promises and execution tracking
const validationPromises = [];
const testCaseExecutionGlobalInfo = new Map();

// =============================================================================
// EXECUTION DESCRIBE BLOCK
// =============================================================================

describe('********** Execution Details **********', () => {
    let { loginPage, libraryPage, userAccount, aibotChatPanel } = browsers.pageObj1;
    let testSuiteBrokenMessage = null;
    let executionContext = null;
    let executedTestCases = [];
    let currentTestUserCredential = null;

    beforeAll(async () => {
        try {
            // Initialize folders
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder, { recursive: true });
                logger.debug(`Created folder: ${outputFolder}`);
            }

            // Clean output folder
            await cleanFileInFolder(outputFolder);
            await setWindowSize(browserWindow);

            // Initialize bot configuration
            const baseUrl = urlParser(browser.options.baseUrl);
            const credentialForLookup = resolveCredential(defaultCredential);

            const initializedBot = await initializeBot(
                baseUrl,
                botInfo,
                credentialForLookup,
                executeBotByName,
                overrideProjectName
            );

            // Update bot config with resolved IDs
            botConfig.objectId = initializedBot.objectId;
            botConfig.projectId = initializedBot.projectId;

            // Create execution context
            executionContext = createExecutionContext(browsers.pageObj1, botConfig, {
                executeBotByName,
                createChatBeforeTest,
                deleteChatAfterTest,
                enableAiDiagnostics,
                exportAiDiagnostics,
            });

            logger.info('✅ Test suite setup completed');
        } catch (error) {
            logger.error(`Error occurs during setup: ${error.message}`);
            testSuiteBrokenMessage = error.message;
        }
    });

    afterAll(async () => {
        try {
            logger.info('⏳ Waiting for all validation tasks to complete...');
            await Promise.all(validationPromises);
            logger.info('✅ All validation tasks completed.');
        } catch (error) {
            logger.error(`Error occurs during waiting for all validation tasks: ${error.message}`);
            throw error;
        } finally {
            saveTestProfile(testProfileFilePath, testProfile, testCases);
            if (!testEachCaseInNewChat && executionContext) {
                await executionContext.cleanup();
            }
        }
    });

    // Register test cases
    testCases.forEach((testCase, testCaseId) => {
        const { testCaseName, question } = testCase;

        // Initialize result objects
        initializeTestCaseResults(testCase, botInfo, languageInfo);

        // Skip prerequisite test cases (they'll be executed as part of dependent cases)
        if (testCasesThatBeenDependOn.has(testCaseId)) {
            logger.debug(`Skipping register test case ${testCaseName} because it is depended on by other case(s).`);
            return;
        }

        const testCaseDisplayName = generateTestCaseDisplayName(testCase, instanceName);
        it(`${testCaseDisplayName}: ${question}`, async () => {
            const { tags } = testCase;

            // Build test case group (including prerequisites)
            const currentTestCaseGroup = buildTestCaseGroup(testCase, testCases);

            // Add tags to Allure
            addTagsToAllure(tags);

            // Check if test suite is broken
            if (testSuiteBrokenMessage) {
                recordGroupError(
                    currentTestCaseGroup,
                    `Test suite setup failed: ${testSuiteBrokenMessage}`,
                    'broken',
                    ERROR_CATEGORIES.TEST_SUITE_SETUP
                );
                return;
            }

            // Handle user login/logout
            try {
                const requiredCredential = resolveCredential(testCase.testCredential);

                // Switch users if needed
                if (currentTestUserCredential?.username !== requiredCredential?.username) {
                    if (currentTestUserCredential) {
                        logger.debug(`Logging out from user: ${currentTestUserCredential.username}`);
                        await libraryPage.openDefaultApp();
                        await libraryPage.waitForLibraryLoading();
                        await userAccount.openUserAccountMenu();
                        await userAccount.logout();
                        currentTestUserCredential = null;
                    }

                    logger.info(
                        `Logging in with credential ${requiredCredential.username} for test case: ${testCaseName}`
                    );
                    await loginPage.login(requiredCredential);
                    currentTestUserCredential = requiredCredential;
                    executionContext.setCredential(requiredCredential);

                    if (!testEachCaseInNewChat) {
                        await executionContext.runBot(testCase);
                    }
                }

                // For standalone mode, always run bot
                if (testEachCaseInNewChat) {
                    await executionContext.runBot(testCase);
                }
            } catch (error) {
                logger.error(`Error occurred during login/logout for ${testCaseName}: ${error.message}`);
                recordGroupError(
                    currentTestCaseGroup,
                    `Login/logout failed: ${error.message}`,
                    'broken',
                    ERROR_CATEGORIES.AUTHENTICATION
                );
                throw error;
            }

            // Check if still on bot page
            if (!(await executionContext.isBotPageActive())) {
                recordExecutionError({
                    testCase: testCase,
                    message: `Failed to run test case ${testCaseName} because currently is not on the bot page!`,
                    status: 'broken',
                    category: ERROR_CATEGORIES.NOT_ON_BOT_PAGE,
                });
                throw new Error(`Failed to run test case ${testCaseName} because currently is not on the bot page!`);
            }

            // Execute each test case in the group
            for (let index = 0; index < currentTestCaseGroup.length; index++) {
                const currentCase = currentTestCaseGroup[index];
                const {
                    uuid: currentUuid,
                    testCaseName: currentTestCaseName,
                    question: currentQuestion,
                    prerequisiteTestCaseId: currentPrerequisiteId,
                    extraConfig,
                    execution: currentExecution,
                } = currentCase;

                // Skip if already executed (in non-standalone mode)
                if (
                    !testEachCaseInNewChat &&
                    executedTestCases.some((tc) => tc.testCaseId === currentCase.testCaseId)
                ) {
                    logger.debug(`Test case "${currentTestCaseName}" has already been executed, skipping.`);
                    continue;
                }

                const currentTestCaseBaselineFolder = path.resolve(baselineFolderForCurrentBot, currentTestCaseName);
                const currentTestCaseOutputFolder = path.resolve(outputFolder, currentTestCaseName);

                // Resolve actual baseline folder (may be redirected by metadata.json)
                const resolvedBaselineFolder = resolveBaselineFolderWithMetadata(
                    currentTestCaseBaselineFolder,
                    baselineFolder
                );

                // Log baseline redirection if applied
                if (resolvedBaselineFolder !== currentTestCaseBaselineFolder) {
                    logger.debug(
                        `📂 Baseline redirected for ${currentTestCaseName}: ${path.relative(
                            baselineFolderForCurrentBot,
                            resolvedBaselineFolder
                        )}`
                    );
                }

                try {
                    // Record start time
                    const startTime = Date.now();
                    testCaseExecutionGlobalInfo.set(currentUuid, { startTime, endTime: null, duration: null });
                    logger.info(`🚀 Executing Test Case: ${currentTestCaseName}`);

                    // Add UUID label to Allure for future matching
                    allureReporter.addLabel('testCaseUuid', currentUuid);

                    currentExecution.status = 'unfinished';
                    executedTestCases.push(currentCase);

                    // Create test case-specific output folder
                    if (!fs.existsSync(currentTestCaseOutputFolder)) {
                        fs.mkdirSync(currentTestCaseOutputFolder, { recursive: true });
                    }

                    // Handle follow-up if needed
                    let quotedAnswerText = null;
                    if (index !== 0 && enableFollowUp) {
                        logger.debug(`Following up question for test case: ${currentTestCaseName}`);
                        const prerequisiteTestCase = testCases.get(currentPrerequisiteId);
                        quotedAnswerText = prerequisiteTestCase.execution.answerText;
                        if (!quotedAnswerText) {
                            throw new Error(
                                `The prerequisite test case "${prerequisiteTestCase.testCaseName}" does not have an answer text.`
                            );
                        }
                        await executionContext.followUp(quotedAnswerText);
                        allureReporter.addStep(
                            `Follow up the answer of prerequisite test case "${prerequisiteTestCase.testCaseName}"`
                        );
                    }

                    // Prepare question text
                    const magicPrefix = enableAiDiagnostics ? 'X7Vw50KfC2KdPzGY: ' : '';
                    const pureQuestionText = currentQuestion.replace(/\*\*(.*?)\*\*/g, '$1').trim();
                    const actualQuestionText = enableAutoComplete ? currentQuestion : pureQuestionText;
                    const researchMode = extraConfig?.enableResearchMode || false;

                    // Ask question
                    const responseTime = await executionContext.askQuestion(
                        `${magicPrefix}${actualQuestionText}`,
                        researchMode
                    );
                    if (responseTime < 0) {
                        logger.error(
                            `⚠️ The answer for ${currentTestCaseName} is taking too long, so try to stop it and fail the case`
                        );
                        recordExecutionError({
                            testCase: currentCase,
                            message: `Test case ${currentTestCaseName} failed due to answer timeout.`,
                            status: 'failed',
                            category: ERROR_CATEGORIES.ANSWER_TIMEOUT,
                        });
                        if (await aibotChatPanel.getBot2CancelLoadingAnswerButton().isDisplayed()) {
                            await aibotChatPanel.clickBot2CancelLoadingAnswerButton();
                        }
                        continue;
                    }

                    const durationSec = (responseTime / 1000).toFixed(2);
                    logger.info(`⏱️ Q&A response time for ${currentTestCaseName}: ${durationSec} seconds`);
                    currentExecution.responseTime = responseTime;

                    // Verify question
                    logger.debug(
                        `Verify the asked question (index: ${executionContext.getQueryIndex()}) for ${currentTestCaseName}...`
                    );
                    const questionVerification = await executionContext.verifyQuestion(pureQuestionText, magicPrefix);
                    if (!questionVerification.success) {
                        recordExecutionError({
                            testCase: currentCase,
                            message: `The question sent for ${currentTestCaseName} is different from the expected one. Expected: "${questionVerification.expectedQuestion}", Actual: "${questionVerification.actualQuestion}"`,
                            status: 'broken',
                            category: ERROR_CATEGORIES.QUESTION_MISMATCH,
                        });
                        continue;
                    }

                    // Verify quoted answer for follow-up
                    if (index !== 0 && enableFollowUp) {
                        const quotedVerification = await executionContext.verifyQuotedAnswer(quotedAnswerText);
                        if (!quotedVerification.success) {
                            recordExecutionError({
                                testCase: currentCase,
                                message: `The quoted answer for ${currentTestCaseName} is different from the expected one. Expected: "${quotedVerification.expectedQuotedText}", Actual: "${quotedVerification.actualQuotedText}"`,
                                status: 'broken',
                                category: ERROR_CATEGORIES.QUOTED_ANSWER_MISMATCH,
                            });
                            continue;
                        }
                    }

                    // Wait for answer to complete
                    const answerCompleted = await executionContext.waitForAnswerComplete(researchMode);
                    if (!answerCompleted) {
                        logger.error(
                            `⚠️ The answer streaming for ${currentTestCaseName} is taking too long, so try to stop it and fail the case`
                        );
                        const category = researchMode
                            ? ERROR_CATEGORIES.ANSWER_STREAMING_TIMEOUT_RESEARCH
                            : ERROR_CATEGORIES.ANSWER_STREAMING_TIMEOUT;
                        recordExecutionError({
                            testCase: currentCase,
                            message: `Test case ${currentTestCaseName} failed due to answer streaming timeout.`,
                            status: 'failed',
                            category: category,
                        });
                        if (await aibotChatPanel.getBot2CancelLoadingAnswerButton().isDisplayed()) {
                            await aibotChatPanel.clickBot2CancelLoadingAnswerButton();
                        }
                        continue;
                    }
                    logger.debug(`Full answer rendered for ${currentTestCaseName}`);

                    // Get the actual answer index from the rendered answers
                    const currentAnswerIndex = await executionContext.getAnswerIndex();

                    // Check for errors first
                    const answerStatus = await checkAnswerStatus(aibotChatPanel, currentAnswerIndex);
                    if (answerStatus.hasError) {
                        logger.error(`❌ Error message displayed for ${currentTestCaseName}`);

                        // Capture error message
                        await captureErrorMessage(aibotChatPanel, currentAnswerIndex, currentTestCaseOutputFolder);
                        await captureFullAnswerImage(aibotChatPanel, currentAnswerIndex, currentTestCaseOutputFolder);

                        if (enableAiDiagnostics && exportAiDiagnostics) {
                            await retrieveAiDiagnostics(
                                aibotChatPanel,
                                botConfig.name,
                                currentAnswerIndex,
                                currentTestCaseOutputFolder
                            );
                        }

                        recordExecutionError({
                            testCase: currentCase,
                            message: `Test case "${currentTestCaseName}" failed due to an error in the answer.`,
                            status: 'failed',
                            category: ERROR_CATEGORIES.ANSWER_ERROR,
                        });
                        continue;
                    }

                    // Capture full answer screenshot
                    await captureFullAnswerImage(aibotChatPanel, currentAnswerIndex, currentTestCaseOutputFolder);

                    if (answerStatus.hasClarification) {
                        logger.error(`⚠️ Clarification needed for ${currentTestCaseName}`);
                        if (enableAiDiagnostics && exportAiDiagnostics) {
                            await retrieveAiDiagnostics(
                                aibotChatPanel,
                                botConfig.name,
                                currentAnswerIndex,
                                currentTestCaseOutputFolder,
                                true
                            );
                        }
                        recordExecutionError({
                            testCase: currentCase,
                            message: `Test case "${currentTestCaseName}" failed due to clarification needed.`,
                            status: 'failed',
                            category: ERROR_CATEGORIES.NEED_CLARIFICATION,
                        });
                        continue;
                    }

                    // Scroll to bottom if the 'back-to-bottom' button is displayed
                    if (await aibotChatPanel.isToBottomBtnDisplayed()) {
                        await aibotChatPanel.clickToBottom();
                    }

                    // Capture all answer components
                    await captureAnswerText(
                        aibotChatPanel,
                        libraryPage,
                        currentAnswerIndex,
                        currentTestCaseOutputFolder,
                        currentCase
                    );
                    await captureGridMarkdowns(
                        aibotChatPanel,
                        currentAnswerIndex,
                        currentTestCaseOutputFolder,
                        currentCase
                    );
                    await captureChartImages(
                        aibotChatPanel,
                        currentAnswerIndex,
                        currentTestCaseOutputFolder,
                        currentCase
                    );
                    await captureInsightText(
                        aibotChatPanel,
                        libraryPage,
                        currentAnswerIndex,
                        currentTestCaseOutputFolder,
                        currentCase
                    );
                    await captureUnstructuredDataReferences(
                        aibotChatPanel,
                        libraryPage,
                        currentAnswerIndex,
                        currentTestCaseOutputFolder,
                        currentCase
                    );

                    // Get interpretation SQL if enabled
                    if (exportInterpretation) {
                        await captureInterpretationSql(
                            aibotChatPanel,
                            libraryPage,
                            currentAnswerIndex,
                            currentTestCaseOutputFolder,
                            currentCase
                        );
                    }

                    // Get AI diagnostics if enabled
                    if (enableAiDiagnostics && exportAiDiagnostics) {
                        await retrieveAiDiagnostics(
                            aibotChatPanel,
                            botConfig.name,
                            currentAnswerIndex,
                            currentTestCaseOutputFolder,
                            true
                        );
                    }

                    // Create validation task
                    logger.debug(`🔍 Create validation task for ${currentTestCaseName}`);
                    const validationTask = performValidation(
                        currentCase,
                        resolvedBaselineFolder,
                        currentTestCaseOutputFolder
                    );
                    validationPromises.push(validationTask);

                    currentExecution.status = 'finished';
                } catch (error) {
                    recordExecutionError({
                        testCase: currentCase,
                        message: error.message,
                        status: 'broken',
                        category: ERROR_CATEGORIES.UNKNOWN_EXECUTION_ERROR,
                    });

                    await captureErrorScreenshot(currentTestCaseOutputFolder, 'unexpected execution error happens');
                    throw error;
                } finally {
                    // Record end time
                    const endTime = Date.now();
                    const globalInfo = testCaseExecutionGlobalInfo.get(currentUuid);
                    if (globalInfo) {
                        globalInfo.endTime = endTime;
                        globalInfo.duration = endTime - globalInfo.startTime;
                        testCaseExecutionGlobalInfo.set(currentUuid, globalInfo);
                        logger.debug(
                            `Test case ${currentTestCaseName} execution completed. Duration: ${globalInfo.duration}ms`
                        );
                    }

                    if (testEachCaseInNewChat && executionContext) {
                        await executionContext.cleanup();
                    }
                }
            }
        });
    });
});

// =============================================================================
// VALIDATION DESCRIBE BLOCK
// =============================================================================

describe(testSuiteName, () => {
    let testExecutionVideoMapping = new Map();

    beforeAll(async () => {
        try {
            // Build UUID to video file path mapping from allure-raw results
            if (fs.existsSync(allureRawFolder)) {
                const resultFiles = fs.readdirSync(allureRawFolder).filter((file) => file.endsWith('-result.json'));

                for (const resultFile of resultFiles) {
                    try {
                        const resultPath = path.resolve(allureRawFolder, resultFile);
                        const resultContent = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));

                        // Extract UUID from labels
                        const uuidLabel = resultContent.labels?.find((label) => label.name === 'testCaseUuid');
                        if (!uuidLabel) continue;

                        const uuid = uuidLabel.value;

                        // Find "Execution video" attachment
                        const videoAttachment = resultContent.attachments?.find(
                            (attachment) => attachment.name === 'Execution video'
                        );

                        if (videoAttachment && videoAttachment.source) {
                            const videoFilePath = path.resolve(allureRawFolder, videoAttachment.source);
                            testExecutionVideoMapping.set(uuid, videoFilePath);
                            logger.debug(`Mapped UUID ${uuid} to video: ${videoFilePath}`);
                        }
                    } catch (error) {
                        logger.warn(`Failed to parse allure result file ${resultFile}: ${error.message}`);
                    }
                }

                logger.info(`✅ Built video mapping for ${testExecutionVideoMapping.size} test case(s)`);
            } else {
                logger.warn(`Allure raw folder does not exist: ${allureRawFolder}`);
            }
        } catch (error) {
            logger.error(`Error building test execution video mapping: ${error.message}`);
        }
    });

    afterAll(async () => {
        try {
            saveTestProfile(testProfileFilePath, testProfile, testCases);
        } catch (error) {
            logger.error(`Error occurs during saving test profile: ${error.message}`);
            throw error;
        }
    });

    Array.from(testCases.values()).forEach((testCase, index) => {
        const { uuid, testCaseName, question, prerequisiteTestCaseId, tags, defects, execution, validation } = testCase;

        const testCaseDisplayName = generateTestCaseDisplayName(testCase, instanceName);
        const testCaseInstanceName = generateTestCaseInstanceName(testCaseName, instanceName);

        it(`${testCaseDisplayName}: ${question}`, async () => {
            // Add tags
            addTagsToAllure(tags);

            logger.info(`🔎 Validating results for Test Case: ${testCaseDisplayName}`);

            // Add execution timing
            const globalInfo = testCaseExecutionGlobalInfo.get(uuid);
            if (globalInfo) {
                logger.debug(
                    `Adding execution timing information to Allure for '${testCaseDisplayName}' (uuid: ${uuid})`
                );
                addExecutionTimingToAllure(globalInfo);
            }

            // Filter and add known defects relevant to current bot and language
            const relevantDefects = filterRelevantDefects(defects, botInfo.id, languageInfo.id);
            addKnownDefectsToAllure(relevantDefects);

            // Attach test profile on first test case (debug mode only)
            if (index === 0 && isDebugMode) {
                allureReporter.addAttachment(
                    `${testSuiteName}.json`,
                    fs.readFileSync(testProfileFilePath, 'utf-8'),
                    'application/json'
                );
            }

            // Add bot execution time
            if (execution.botExecutionTime !== null && execution.botExecutionTime !== undefined) {
                allureReporter.addStep(
                    `⏰ Bot Execution Time: ${(execution.botExecutionTime / 1000).toFixed(2)} seconds (Bot name: ${
                        botConfig.name
                    }, id: ${botConfig.objectId})`
                );
            }

            // Add Q&A response time
            if (execution.responseTime !== null) {
                allureReporter.addStep(`⏱️ Q&A Response Time: ${(execution.responseTime / 1000).toFixed(2)} seconds`);
            }

            // Add prerequisite info
            if (prerequisiteTestCaseId) {
                allureReporter.addStep(`🔗 Prerequisite Case: ${testCases.get(prerequisiteTestCaseId).question}`);
            }

            const testCaseBaselineFolder = path.resolve(baselineFolderForCurrentBot, testCaseName);
            const testCaseOutputFolder = path.resolve(outputFolder, testCaseName);

            // Resolve actual baseline folder (may be redirected by metadata.json)
            const resolvedBaselineFolder = resolveBaselineFolderWithMetadata(testCaseBaselineFolder, baselineFolder);

            // Get video file path from mapping
            const recordingVideoFilePath = testExecutionVideoMapping.get(uuid) || null;

            // Add execution status
            addExecutionStatusToAllure(
                execution,
                testCaseOutputFolder,
                recordingVideoFilePath,
                attachVideoRecordingInValidation,
                testCaseInstanceName
            );

            // Validate results
            if (execution.status === 'finished') {
                const allMethodsPassed = addValidationResultsToAllure(validation, testCaseInstanceName);
                validation.isFullPass = allMethodsPassed;
            } else {
                fail('Errors occurred during execution');
            }

            // Categorize test case
            const isFollowUp = Boolean(prerequisiteTestCaseId);
            categorizeTestCase(execution, validation, relevantDefects, isFollowUp);

            // Attach files to Allure
            logger.debug(`Attaching available files for ${testCaseInstanceName} to allure report`);

            // References section (includes Baselines and Descriptions)
            attachReferencesToAllure(resolvedBaselineFolder, testCase.translations, languageConfig.name);

            // Attach output files
            attachOutputFilesToAllure(testCaseOutputFolder);
        });
    });
});
