import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    uploadTestResultsInTransaction,
    getTestEnvInfoByName,
    getTestTypeInfoByName,
    getOldTestExecutionIds,
    updateTestType,
    deleteTestExecutionsByIds,
    getTagInfoByName,
} from './db-manager.js';
import { testParams, buildInfo, paramSerializer } from './param-provider.js';
import { logger } from './logger.js';
import { summarizeTestExecution } from '../../../utils/openAI_bot2validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runtimeFolder = path.resolve(__dirname, 'runtime');

// Get configuration values from buildInfo
const productRelease = buildInfo.productRelease;
const productBuildNumber = buildInfo.productBuildNumber;
const libraryVersion = buildInfo.libraryVersion;
const chatServiceVersion = buildInfo.chatServiceVersion;
const ingestionServiceVersion = buildInfo.ingestionServiceVersion;
const iserverVersion = buildInfo.iserverVersion;
const testDateTime = buildInfo.testDateTime;
const reportLink = buildInfo.reportLink;

// Get test parameters
const testType = testParams.testType;
const testEnvName = testParams.testEnvName;
const oldOfficialResultPolicy = testParams.oldOfficialResultPolicy;
const comment = testParams.comment;

// Initialize test type and environment IDs from database
let testTypeId;
try {
    testTypeId = getTestTypeInfoByName(testType).test_type_id;
} catch (error) {
    throw new Error(`Test type '${testType}' not found.`);
}

let testEnvId;
try {
    testEnvId = getTestEnvInfoByName(testEnvName).test_env_id;
} catch (error) {
    throw new Error(`Test environment '${testEnvName}' not found.`);
}

function readTestProfiles(folderPath) {
    if (!fs.existsSync(folderPath)) {
        throw new Error(`Folder does not exist: ${folderPath}`);
    }

    const testSuites = new Map();
    const testProfilesByTag = new Map();
    const allTestCasesByUUID = new Map();

    // Read all subdirectories in runtime folder (each represents a test suite with specific bot variant and language)
    const subdirs = fs.readdirSync(folderPath).filter((item) => {
        const itemPath = path.join(folderPath, item);
        return fs.statSync(itemPath).isDirectory() && !item.startsWith('_');
    });

    if (subdirs.length === 0) {
        throw new Error(`No subdirectories found in folder: ${folderPath}`);
    }

    // Read profile.json from each subdirectory
    for (const subdir of subdirs) {
        const profilePath = path.join(folderPath, subdir, 'profile.json');

        if (!fs.existsSync(profilePath)) {
            logger.warn(`No profile.json found in ${subdir}, skipping`);
            continue;
        }

        const fileContent = fs.readFileSync(profilePath, 'utf-8');
        let testProfile;

        try {
            testProfile = JSON.parse(fileContent);
        } catch (error) {
            throw new Error(`Failed to parse JSON for '${profilePath}': ${error.message}`);
        }

        // Validate profile structure
        if (
            !testProfile?.testSuiteName ||
            !testProfile?.config?.bot ||
            !testProfile?.config?.language ||
            !Array.isArray(testProfile?.cases)
        ) {
            logger.warn(
                `Test profile '${subdir}/profile.json' is malformed! Expected structure: { testSuiteName, instanceName, config: { bot, language }, cases }. Skipping.`
            );
            continue;
        }

        if (testProfile.cases.length === 0) {
            logger.warn(`Test profile '${subdir}/profile.json' contains no test cases. Skipping.`);
            continue;
        }

        const botId = testProfile.config.bot.id;
        const botVariantId = testProfile.config.bot.variantId;
        const languageId = testProfile.config.language.id;
        const languageCode = testProfile.config.language.code;
        const languageName = testProfile.config.language.name;

        // Validate required fields
        if (!botId || !botVariantId || !languageId) {
            logger.warn(
                `Test profile '${subdir}/profile.json' missing required bot/language id (botId: ${botId}, botVariantId: ${botVariantId}, languageId: ${languageId}). Skipping.`
            );
            continue;
        }

        // Create composite key for bot + bot_variant + language_id for test suite
        const compositeKey = `${botId}_${botVariantId}_${languageId}`;

        // Store the complete profile by composite key
        testSuites.set(compositeKey, {
            bot: testProfile.config.bot,
            language: testProfile.config.language,
            cases: testProfile.cases,
        });

        // Add test case instances to Map using UUID to avoid duplicates
        testProfile.cases.forEach((testCase) => {
            if (testCase.uuid) {
                if (!allTestCasesByUUID.has(testCase.uuid)) {
                    allTestCasesByUUID.set(testCase.uuid, testCase);
                }
            } else {
                const caseName = testCase.testCaseName || 'Unknown';
                logger.warn(
                    `Test case '${caseName}' in profile '${subdir}/profile.json' has no UUID. Skipping from unique set.`
                );
            }
        });

        logger.debug(
            `📖 Loaded ${testProfile.cases.length} test cases from ${testProfile.testSuiteName} (Bot: ${testProfile.config.bot.name}, Variant: ${testProfile.config.bot.variantName}), Language: ${languageName} [${languageCode}]`
        );
    }

    if (testSuites.size === 0) {
        throw new Error('No valid test profiles found. All JSON files were either malformed or empty.');
    }

    // Convert Map to array
    const allTestCases = Array.from(allTestCasesByUUID.values());

    if (allTestCases.length === 0) {
        throw new Error('No test cases with valid UUIDs found across all profiles.');
    }

    // Second pass: Organize test cases by tag (aggregated across all test suites)
    for (const [, profile] of testSuites) {
        for (const testCase of profile.cases) {
            if (!Array.isArray(testCase.tags) || testCase.tags.length === 0) {
                logger.warn(`Test case '${testCase.testCaseName}' has no tags. Skipping tag aggregation.`);
                continue;
            }

            for (const tagName of testCase.tags) {
                let tagInfo;
                try {
                    tagInfo = getTagInfoByName(tagName);
                } catch (error) {
                    logger.warn(`Tag '${tagName}' not found in cache. Skipping.`);
                    continue;
                }

                const tagId = tagInfo.tagId;

                if (!testProfilesByTag.has(tagId)) {
                    testProfilesByTag.set(tagId, {
                        cases: [],
                    });
                }

                const tagBucket = testProfilesByTag.get(tagId);
                if (!tagBucket.cases.some((existing) => existing.uuid === testCase.uuid)) {
                    tagBucket.cases.push(testCase);
                }
            }
        }
    }

    // Calculate total test cases across all test suites
    let totalTestCases = 0;
    for (const profile of testSuites.values()) {
        totalTestCases += profile.cases.length;
    }

    logger.info(
        `✅ Total: ${totalTestCases} test cases from ${testSuites.size} test suites (bot-variant-language combinations)`
    );
    logger.info(`✅ Unique test cases across all suites: ${allTestCases.length}`);
    logger.info(`✅ Organized into ${testProfilesByTag.size} tags`);

    return { allTestCases, testSuites, testProfilesByTag };
}

const { allTestCases, testSuites, testProfilesByTag } = readTestProfiles(runtimeFolder);

if (allTestCases.length === 0) {
    throw new Error('No test cases found to upload');
}

// Update old official test execution records according to policy
if (testType.toLowerCase() === 'official') {
    logger.debug(`Checking for old official test executions with build number '${productBuildNumber}'...`);
    const oldOfficialTestIds = await getOldTestExecutionIds(productBuildNumber, testTypeId);

    if (oldOfficialTestIds && oldOfficialTestIds.length > 0) {
        if (oldOfficialResultPolicy === 'Delete') {
            logger.debug(`Found ${oldOfficialTestIds.length} old official test execution(s), deleting...`);
            await deleteTestExecutionsByIds(oldOfficialTestIds);
            logger.debug(`Successfully deleted ${oldOfficialTestIds.length} old official test execution(s).`);
        } else if (oldOfficialResultPolicy === 'Convert type') {
            logger.debug(
                `Found ${oldOfficialTestIds.length} old official test execution(s), updating to Engineer type...`
            );
            const engineerTestTypeId = getTestTypeInfoByName('Engineer').test_type_id;
            await updateTestType(oldOfficialTestIds, engineerTestTypeId);
            logger.debug(
                `Successfully updated test type for ${oldOfficialTestIds.length} old official test execution(s).`
            );
        } else if (oldOfficialResultPolicy === 'Keep as is') {
            logger.debug(`Found ${oldOfficialTestIds.length} old official test execution(s), keeping as is.`);
        } else {
            throw new Error(`Unsupported OldOfficialResultPolicy '${oldOfficialResultPolicy}'!`);
        }
    } else {
        logger.debug('No old official test executions found for this build number.');
    }
}

// ==================== Upload test configuration first ====================
logger.info(`\n${'='.repeat(80)}`);
logger.info(`📤 PHASE 0: Uploading test configuration`);
logger.info(`${'='.repeat(80)}`);

// Generate AI summary for all test cases
const overallAiSummary = await summarizeTestExecution(allTestCases, null);

// Calculate overall pass ratio
const passedTests = allTestCases.filter((testCase) => testCase.validation?.isFullPass === true).length;
const failedTests = allTestCases.filter(
    (testCase) => testCase.execution?.status === 'finished' && testCase.validation?.isFullPass === false
).length;
const brokenTests = allTestCases.filter((testCase) => testCase.execution?.status === 'broken').length;
const notStartedTests = allTestCases.filter((testCase) => testCase.execution?.status === 'not_started').length;

const totalTests = allTestCases.length;
const passRatio = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) / 100 : 0;

logger.debug(`Test execution summary:`);
logger.debug(`  - Total: ${totalTests}`);
logger.debug(`  - Passed: ${passedTests}`);
logger.debug(`  - Failed: ${failedTests}`);
logger.debug(`  - Broken: ${brokenTests}`);
logger.debug(`  - Not started: ${notStartedTests}`);
logger.debug(`  - Pass ratio: ${(passRatio * 100).toFixed(2)}%`);

// Serialize test parameters for database storage
// Explicitly list the fields you want to save
const parameters = paramSerializer.toJSON([
    // Test options
    'standaloneConversation',
    'enableFollowUp',
    'enableAutoComplete',
    'enableAiDiagnostics',
    'executeBotByName',
    'createChatBeforeTest',
    'deleteChatAfterTest',
    'tags',
    'botVariants',
    'testLanguages',
    // Advanced options
    'overrideTestUserName',
    'overrideTestUserPassword',
    'overrideProjectName',
    'logLevel',
    // Test Report options
    'exportInterpretation',
    'exportAiDiagnostics',
    'attachVideoRecordingInValidation',
    // Test Result options
    'oldOfficialResultPolicy',
    'dbConfig',
]);

// Prepare test configuration once outside the loops
const testConfig = {
    testDatetime: testDateTime,
    productRelease: productRelease,
    productBuildNumber: productBuildNumber,
    libraryVersion: libraryVersion,
    chatServiceVersion: chatServiceVersion,
    ingestionServiceVersion: ingestionServiceVersion,
    iserverVersion: iserverVersion,
    reportLink: reportLink,
    testTypeId: testTypeId,
    testEnvId: testEnvId,
    overallAiSummary: overallAiSummary,
    overallScore: passRatio,
    parameters: parameters,
    comment: comment,
};

// ==================== Upload all test results within a single transaction ====================
logger.info(`\n${'='.repeat(80)}`);
logger.info(`🚀 Starting ATOMIC upload process (all operations in a single transaction)`);
logger.info(`${'='.repeat(80)}\n`);

try {
    // All database operations will execute within a single transaction
    // If any step fails, all changes will be automatically rolled back
    const testExecutionId = await uploadTestResultsInTransaction(testConfig, testSuites, testProfilesByTag);

    // ==================== Final statistics ====================
    let totalTestCases = 0;
    for (const profile of testSuites.values()) {
        totalTestCases += profile.cases.length;
    }

    logger.info(`\n${'='.repeat(80)}`);
    logger.info(`🎉 All upload operations completed successfully within a single transaction!`);
    logger.info(`   - Total Test Suites (Combinations): ${testSuites.size}`);
    logger.info(`   - Total Test Cases: ${totalTestCases}`);
    logger.info(`   - Unique Test Cases: ${allTestCases.length}`);
    logger.info(`   - Total Tags: ${testProfilesByTag.size}`);
    logger.info(`   - Test Execution ID: ${testExecutionId}`);
    logger.info(`   - Overall Pass Ratio: ${(passRatio * 100).toFixed(2)}%`);
    logger.info(`${'='.repeat(80)}\n`);
} catch (error) {
    logger.error(`\n${'='.repeat(80)}`);
    logger.error(`❌ Upload failed! All database changes have been rolled back.`);
    logger.error(`${'='.repeat(80)}\n`);
    throw error;
}
