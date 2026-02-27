import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { retrieveTestCases } from './db-manager.js';
import { testParams } from './param-provider.js';
import { logger } from './logger.js';
import { generateInstanceName, generateUniqueTestSuiteName } from './common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceFolder = path.resolve(__dirname);
const runtimeFolder = path.resolve(workspaceFolder, 'runtime');
const templateFolder = path.resolve(runtimeFolder, '_TEMPLATE');

// Constants for selection modes
const SELECT_ALL = '*';
const SELECT_DEFAULT = '(Default)';

function ensureCleanDirectory(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        logger.debug(`Cleaning existing directory: ${directoryPath}`);
        fs.rmSync(directoryPath, { recursive: true, force: true });
    }
    fs.mkdirSync(directoryPath, { recursive: true });
}

/**
 * Clean runtime folder by removing all files and folders that don't start with underscore
 */
function cleanRuntimeFolder(runtimePath) {
    if (!fs.existsSync(runtimePath)) {
        logger.debug(`Runtime folder does not exist: ${runtimePath}`);
        return;
    }

    const entries = fs.readdirSync(runtimePath);
    let deletedCount = 0;

    for (const entry of entries) {
        // Skip entries that start with underscore
        if (entry.startsWith('_')) {
            logger.debug(`Skipping: ${entry} (starts with underscore)`);
            continue;
        }

        const fullPath = path.resolve(runtimePath, entry);
        logger.debug(`Deleting: ${entry}`);
        fs.rmSync(fullPath, { recursive: true, force: true });
        deletedCount++;
    }

    logger.info(`✅ Cleaned runtime folder: removed ${deletedCount} item(s)`);
}

/**
 * Sort test case instances
 */
function sortInstances(instances) {
    return instances.sort((a, b) => {
        const nameComparison = (a.testCaseName || '').localeCompare(b.testCaseName || '');
        if (nameComparison !== 0) {
            return nameComparison;
        }

        const idA = typeof a.testCaseId === 'number' ? a.testCaseId : Number(a.testCaseId) || 0;
        const idB = typeof b.testCaseId === 'number' ? b.testCaseId : Number(b.testCaseId) || 0;
        return idA - idB;
    });
}

/**
 * Filter defects for a test case based on the current bot and language configuration
 */
function filterDefectsForTestSuite(defects, currentBotId, isBotDefault, currentLanguageId, isLanguageDefault) {
    if (!defects || defects.length === 0) {
        return [];
    }

    return defects.filter((defect) => {
        const defectBotId = defect.botId;
        const defectLanguageId = defect.languageId;

        // Rule 1: Both bot and language are default
        // Only include defects with botId = null AND languageId = null (universal issues)
        if (isBotDefault && isLanguageDefault) {
            return defectBotId === null && defectLanguageId === null;
        }

        // Rule 2: Default bot + Non-default language
        // Include: (botId = null AND languageId = null) OR (botId = null AND languageId = currentLanguageId)
        if (isBotDefault && !isLanguageDefault) {
            return (
                (defectBotId === null && defectLanguageId === null) ||
                (defectBotId === null && defectLanguageId === currentLanguageId)
            );
        }

        // Rule 3: Non-default bot + Default language
        // Include: (botId = null AND languageId = null) OR (botId = currentBotId AND languageId = null)
        if (!isBotDefault && isLanguageDefault) {
            return (
                (defectBotId === null && defectLanguageId === null) ||
                (defectBotId === currentBotId && defectLanguageId === null)
            );
        }

        // Rule 4: Non-default bot + Non-default language
        // Include all relevant defects:
        // - Universal: botId = null AND languageId = null
        // - Language-specific: botId = null AND languageId = currentLanguageId
        // - Bot-specific: botId = currentBotId AND languageId = null
        // - Combination-specific: botId = currentBotId AND languageId = currentLanguageId
        return (
            (defectBotId === null && defectLanguageId === null) ||
            (defectBotId === null && defectLanguageId === currentLanguageId) ||
            (defectBotId === currentBotId && defectLanguageId === null) ||
            (defectBotId === currentBotId && defectLanguageId === currentLanguageId)
        );
    });
}

async function main() {
    logger.info('🚀 Starting test case generation...');

    // Step 1: Retrieve test cases from database
    logger.info('📊 Step 1: Retrieving test cases from database');
    const tags = testParams.tags;
    const botVariants = testParams.botVariants;
    const testLanguages = testParams.testLanguages;
    const enableCaseCombination = testParams.enableCaseCombination;

    // Normalize input parameters: empty/null arrays mean "select all"
    const inputBotVariants = botVariants?.length > 0 ? botVariants : [SELECT_ALL];
    const inputTestLanguages = testLanguages?.length > 0 ? testLanguages : [SELECT_ALL];

    logger.info('Filters:');
    logger.info(`  - Tags: ${tags?.join(', ') || 'All default tags'}`);
    logger.info(`  - Bot Variants: ${inputBotVariants.includes(SELECT_ALL) ? 'All' : inputBotVariants.join(', ')}`);
    logger.info(`  - Languages: ${inputTestLanguages.includes(SELECT_ALL) ? 'All' : inputTestLanguages.join(', ')}`);
    logger.info(
        `  - Case Combination: ${
            enableCaseCombination
                ? 'Enabled (all combinations)'
                : 'Disabled (default variant + all languages OR all variants + default language)'
        }`
    );
    const testCases = await retrieveTestCases(tags);

    if (testCases.length === 0) {
        logger.warn('⚠️  No test cases retrieved from database. Nothing to generate.');
        process.exitCode = 1;
        return;
    }

    logger.info(`✅ Retrieved ${testCases.length} test cases`);

    // Step 2: Generate test suites grouped by bot ID and language ID combinations
    logger.info('🔧 Step 2: Generating test suites');

    // Map to store test suites by unique bot ID + language ID combination
    // Key: "botId_languageId", Value: test suite data
    const testSuitesByBotAndLang = new Map();

    // Map to track used test suite names for generating unique folder names
    const usedTestSuiteNames = new Map();

    for (const testCase of testCases) {
        // Determine which bot variants to generate for this test case
        const botsToGenerate = [];

        for (const variantRequest of inputBotVariants) {
            if (variantRequest === SELECT_ALL) {
                // Select all available bots for this test case
                testCase.bots.forEach((bot) => {
                    if (!botsToGenerate.some((b) => b.botId === bot.botId)) {
                        botsToGenerate.push(bot);
                    }
                });
            } else if (variantRequest === SELECT_DEFAULT) {
                // Select only default bots (all bots with default variant)
                const defaultBots = testCase.bots.filter((b) => b.isDefault);
                defaultBots.forEach((defaultBot) => {
                    if (!botsToGenerate.some((b) => b.botId === defaultBot.botId)) {
                        botsToGenerate.push(defaultBot);
                    }
                });
            } else {
                // Select bots matching the requested variant name
                const matchingBots = testCase.bots.filter((b) => b.botVariantName === variantRequest);
                matchingBots.forEach((bot) => {
                    if (!botsToGenerate.some((b) => b.botId === bot.botId)) {
                        botsToGenerate.push(bot);
                    }
                });
            }
        }

        // Determine which languages to generate
        const languagesToGenerate = [];

        for (const langRequest of inputTestLanguages) {
            if (langRequest === SELECT_ALL) {
                // Select all available languages for this test case
                testCase.translations.forEach((lang) => {
                    if (!languagesToGenerate.some((l) => l.languageId === lang.languageId)) {
                        languagesToGenerate.push(lang);
                    }
                });
            } else if (langRequest === SELECT_DEFAULT) {
                // Select only default language
                const defaultLang = testCase.translations.find((t) => t.isDefault);
                if (defaultLang && !languagesToGenerate.some((l) => l.languageId === defaultLang.languageId)) {
                    languagesToGenerate.push(defaultLang);
                }
            } else {
                // Select language matching the requested name
                const matchingLang = testCase.translations.find((t) => t.languageName === langRequest);
                if (matchingLang && !languagesToGenerate.some((l) => l.languageId === matchingLang.languageId)) {
                    languagesToGenerate.push(matchingLang);
                }
            }
        }

        // Generate test suites for each bot × language combination
        // Two modes:
        // 1. enableCaseCombination = false (default):
        //    - Generate: (default variant × all languages) + (all variants × default language)
        //    - Avoid duplicate when both are default
        // 2. enableCaseCombination = true:
        //    - Generate: all variants × all languages (full cartesian product)

        const suitePairs = [];

        if (enableCaseCombination) {
            // Full combination mode: all variants × all languages
            for (const bot of botsToGenerate) {
                for (const lang of languagesToGenerate) {
                    suitePairs.push({ bot, lang });
                }
            }
        } else {
            // Limited combination mode
            const defaultBots = botsToGenerate.filter((b) => b.isDefault);
            const defaultLang = languagesToGenerate.find((l) => l.isDefault);

            // Strategy 1: default variant × all languages
            if (defaultBots.length > 0) {
                for (const defaultBot of defaultBots) {
                    for (const lang of languagesToGenerate) {
                        suitePairs.push({ bot: defaultBot, lang });
                    }
                }
            }

            // Strategy 2: all variants × default language (skip if both are default to avoid duplicate)
            if (defaultLang) {
                for (const bot of botsToGenerate) {
                    // Skip if this is a default bot + default language pair (already added above)
                    if (!bot.isDefault) {
                        suitePairs.push({ bot, lang: defaultLang });
                    }
                }
            }
        }

        // Add test case to corresponding test suites
        for (const { bot, lang } of suitePairs) {
            // Use botId + languageId as the unique key for test suite
            const suiteKey = `${bot.botId}_${lang.languageId}`;

            // Create test suite if it doesn't exist for this bot + language combination
            if (!testSuitesByBotAndLang.has(suiteKey)) {
                // Generate unique test suite name (used for folder naming and describe block)
                const testSuiteName = generateUniqueTestSuiteName(
                    bot.botGroupName,
                    bot.botVariantName,
                    bot.botVariantImpl,
                    bot.isDefault,
                    lang.languageName,
                    lang.isDefault,
                    usedTestSuiteNames
                );

                // Generate instance name (null if both are default)
                const instanceName = generateInstanceName(
                    bot.botVariantName,
                    bot.botVariantImpl,
                    bot.isDefault,
                    lang.languageName,
                    lang.isDefault
                );

                testSuitesByBotAndLang.set(suiteKey, {
                    testSuiteName: testSuiteName,
                    instanceName: instanceName,
                    config: {
                        bot: {
                            id: bot.botId,
                            name: bot.botName,
                            description: bot.botDescription,
                            projectName: bot.projectName,
                            objectId: bot.objectId,
                            groupId: bot.botGroupId,
                            groupName: bot.botGroupName,
                            variantId: bot.botVariantId,
                            variantName: bot.botVariantName,
                            variantImpl: bot.botVariantImpl,
                            isDefault: bot.isDefault,
                        },
                        language: {
                            id: lang.languageId,
                            name: lang.languageName,
                            code: lang.languageCode,
                            isDefault: lang.isDefault,
                        },
                    },
                    cases: [],
                });
            }

            const testSuite = testSuitesByBotAndLang.get(suiteKey);

            // Add this test case to the test suite (with the appropriate question for this language)
            if (!testSuite.cases.some((c) => c.uuid === testCase.uuid)) {
                testSuite.cases.push({
                    ...testCase,
                    question: lang.question,
                });
            }
        }
    }

    logger.info(`✅ Generated ${testSuitesByBotAndLang.size} test suites`);

    // Step 3: Clean runtime folder (remove non-underscore-prefixed files/folders)
    logger.info('🧹 Step 3: Cleaning runtime folder');
    cleanRuntimeFolder(runtimeFolder);

    // Step 4: Generate spec and profile.json files
    logger.info('📝 Step 4: Generating spec and profile files');

    const templateSpecFile = path.resolve(templateFolder, 'test-template.spec.js');

    if (!fs.existsSync(templateSpecFile)) {
        throw new Error(`Template spec file not found: ${templateSpecFile}`);
    }

    let generatedCount = 0;

    for (const testSuiteData of testSuitesByBotAndLang.values()) {
        const suiteFolder = path.resolve(runtimeFolder, testSuiteData.testSuiteName);

        // Create test suite folder
        ensureCleanDirectory(suiteFolder);

        // Copy spec file
        const targetSpecFile = path.resolve(suiteFolder, 'test.spec.js');
        fs.copyFileSync(templateSpecFile, targetSpecFile);

        // Create profile.json with testSuiteName, instanceName at top level
        // Remove 'bots' field and filter defects based on current bot/language configuration
        const casesWithoutBots = sortInstances(testSuiteData.cases).map((testCase) => {
            // Create shallow copy without 'bots' field
            const caseWithoutBots = {};
            Object.keys(testCase).forEach((key) => {
                if (key !== 'bots') {
                    caseWithoutBots[key] = testCase[key];
                }
            });

            // Filter defects based on current test suite's bot and language configuration
            if (caseWithoutBots.defects && caseWithoutBots.defects.length > 0) {
                const currentBotId = testSuiteData.config.bot.id;
                const isBotDefault = testSuiteData.config.bot.isDefault;
                const currentLanguageId = testSuiteData.config.language.id;
                const isLanguageDefault = testSuiteData.config.language.isDefault;

                caseWithoutBots.defects = filterDefectsForTestSuite(
                    caseWithoutBots.defects,
                    currentBotId,
                    isBotDefault,
                    currentLanguageId,
                    isLanguageDefault
                );
            }

            return caseWithoutBots;
        });

        const profileData = {
            testSuiteName: testSuiteData.testSuiteName,
            instanceName: testSuiteData.instanceName,
            config: testSuiteData.config,
            cases: casesWithoutBots,
        };

        const targetProfileFile = path.resolve(suiteFolder, 'profile.json');
        fs.writeFileSync(targetProfileFile, JSON.stringify(profileData, null, 2), 'utf-8');

        generatedCount++;
        logger.debug(`Generated: ${testSuiteData.testSuiteName}/`);
    }

    logger.info(`✅ Generated ${generatedCount} spec and profile file pairs`);

    // Check if no test cases were generated
    if (generatedCount === 0) {
        logger.error('❌ No test cases were generated!');
        logger.error('   Possible reasons:');
        logger.error('   - No matching bot variants or languages found');
        logger.error('   - Test cases lack required bot or translation data');
        logger.error('   - Filter parameters do not match available data');
        process.exitCode = 1;
        return;
    }

    // Summary
    logger.info('\n✅ Test case generation complete!');
    logger.info(`   - Test cases: ${testCases.length}`);
    logger.info(`   - Test suites: ${testSuitesByBotAndLang.size}`);
    logger.info(`   - Generated files: ${generatedCount * 2} (${generatedCount} spec + ${generatedCount} profile)`);
}

try {
    await main();
} catch (error) {
    logger.error('❌ Test case generation failed:', error);
    process.exit(1);
}
