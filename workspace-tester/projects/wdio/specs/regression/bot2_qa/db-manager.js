/**
 * Database Manager
 * Handles all database operations for test cases and results
 */

import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { normalizedEqual } from './utils/string.js';
import { logger } from './logger.js';
import { testParams } from './param-provider.js';
import { summarizeTestExecution } from '../../../utils/openAI_bot2validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbConfigPath = path.resolve(__dirname, './resources/db-config.json');
const dbConfigFile = JSON.parse(fs.readFileSync(dbConfigPath, 'utf-8'));

// Read database configuration from env variable, default to 'prod'
const dbConfigEnv = testParams.dbConfig;
logger.info(`Using database configuration: ${dbConfigEnv}`);

// Validate that the specified db config exists in the config file
if (!dbConfigFile[dbConfigEnv]) {
    throw new Error(
        `Database configuration '${dbConfigEnv}' not found in db-config.json. Available configurations: ${Object.keys(
            dbConfigFile
        ).join(', ')}`
    );
}

const dbConfig = dbConfigFile[dbConfigEnv];
const testCaseDBConfig = dbConfig.testCase;
const testResultDBConfig = dbConfig.testResult;

export const tagsTableInfo = await getTagsTableInfo();
export const botsTableInfo = await getBotsTableInfo();
export const botGroupsTableInfo = await getBotGroupsTableInfo();
export const botVariantsTableInfo = await getBotVariantsTableInfo();
export const languagesTableInfo = await getLanguagesTableInfo();
export const testEnvsTableInfo = await getTestEnvsTableInfo();
export const testTypesTableInfo = await getTestTypesTableInfo();
export const validationMethodsTableInfo = await getValidationMethodsTableInfo();
export const validationDimensionsTableInfo = await getValidationDimensionsTableInfo();
export const botsFullInfo = await getBotsFullInfo();

export async function retrieveTestCases(tags) {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);

        // Fetch all tags and their relationships
        const tagsRes = await pool.request().query(`
            SELECT t.tag_id, t.name, t.tag_type_id, t.is_default,
                tr.parent_tag_id, tr.child_tag_id
            FROM tags t
            LEFT JOIN tag_relations tr ON t.tag_id = tr.parent_tag_id
        `);

        const tagName2Id = {},
            tagId2Type = {},
            parent2child = {};
        tagsRes.recordset.forEach((row) => {
            tagName2Id[row.name] = row.tag_id;
            tagId2Type[row.tag_id] = row.tag_type_id;
            if (row.parent_tag_id && row.child_tag_id) {
                parent2child[row.parent_tag_id] = parent2child[row.parent_tag_id] || [];
                parent2child[row.parent_tag_id].push(row.child_tag_id);
            }
        });

        // If tags is not provided, use all default tags
        let inputTagNames =
            tags && tags.length > 0
                ? tags
                : tagsRes.recordset.filter((row) => row.is_default === 1).map((row) => row.name);

        // Construct the final query tag set
        let searchTagNames = new Set();
        inputTagNames.forEach((name) => {
            let tag_id = tagName2Id[name];
            if (!tag_id) return;
            if (tagId2Type[tag_id] === 0 && parent2child[tag_id]) {
                parent2child[tag_id].forEach((child_id) => {
                    let child_name = tagsRes.recordset.find((r) => r.tag_id === child_id)?.name;
                    if (child_name) searchTagNames.add(child_name);
                });
            }
            searchTagNames.add(name);
        });

        // Query using test_case_bots table and test_case_translations for multilingual support
        const tagList = Array.from(searchTagNames);
        if (tagList.length === 0) {
            logger.warn('No tags matched the provided filters. Returning empty test case array.');
            return [];
        }

        const caseRequest = pool.request();
        const tagPlaceholders = tagList.map((_, index) => `@tag${index}`).join(',');
        tagList.forEach((name, index) => {
            caseRequest.input(`tag${index}`, sql.NVarChar, name);
        });

        logger.debug(`Querying test cases for tags: ${tagList.join(', ')}`);

        const caseRes = await caseRequest.query(`
            SELECT
                DISTINCT
                tc.test_case_id,
                tc.name AS test_case_name,
                tc.default_language_id,
                tc.is_independent,
                tcd.prerequisite_test_case_id,
                vm.name AS validation_name,
                t.name AS tag_name,
                tc.test_user_id,
                tu.name AS test_username,
                tu.password AS test_password,
                tc.extra_config,
                b.bot_id,
                b.name AS bot_name,
                b.description AS bot_description,
                b.project_name,
                b.object_id,
                b.bot_variant_impl,
                bg.bot_group_id,
                bg.name AS bot_group_name,
                bg.default_bot_variant_id,
                bv.bot_variant_id,
                bv.name AS bot_variant_name,
                tct.language_id,
                tct.question,
                l.language_id AS lang_id,
                l.language_name,
                l.language_code,
                ds.defect_key,
                ds.bot_id AS defect_bot_id,
                ds.language_id AS defect_language_id,
                db.name AS defect_bot_name,
                dl.language_name AS defect_language_name
            FROM
                test_cases tc
                LEFT JOIN test_case_tags tct_tag ON tc.test_case_id = tct_tag.test_case_id
                LEFT JOIN tags t ON tct_tag.tag_id = t.tag_id
                LEFT JOIN test_case_dependencies tcd ON tc.test_case_id = tcd.test_case_id
                JOIN test_case_validation_methods tcvm ON tc.test_case_id = tcvm.test_case_id
                LEFT JOIN validation_methods vm ON tcvm.validation_method_id = vm.validation_method_id
                LEFT JOIN test_users tu ON tc.test_user_id = tu.test_user_id
                LEFT JOIN bot_groups bg ON tc.bot_group_id = bg.bot_group_id
                LEFT JOIN bots b ON bg.bot_group_id = b.bot_group_id AND b.status = 1
                LEFT JOIN bot_variants bv ON b.bot_variant_id = bv.bot_variant_id
                LEFT JOIN test_case_translations tct ON tc.test_case_id = tct.test_case_id AND tct.status = 1
                LEFT JOIN languages l ON tct.language_id = l.language_id
                LEFT JOIN defect_scopes ds ON tc.test_case_id = ds.test_case_id
                LEFT JOIN bots db ON ds.bot_id = db.bot_id
                LEFT JOIN languages dl ON ds.language_id = dl.language_id
            WHERE tc.status = 1
                AND t.name IN (${tagPlaceholders})
            ORDER BY tc.name, b.bot_id, tct.language_id
        `);

        logger.debug(`Retrieved ${caseRes.recordset.length} raw records from database`);

        const childId2ParentName = {};
        Object.entries(parent2child).forEach(([parent_id, child_ids]) => {
            let parent_name = tagsRes.recordset.find((r) => r.tag_id === parseInt(parent_id))?.name;
            if (parent_name) {
                child_ids.forEach((child_id) => {
                    childId2ParentName[child_id] = parent_name;
                });
            }
        });

        // Group translations, bot variants, and defects by test case
        const translationsByTestCase = new Map();
        const botVariantsByTestCase = new Map();
        const defectsByTestCase = new Map();
        const testCaseBasicInfo = new Map();

        caseRes.recordset.forEach((row) => {
            // Store basic test case info
            if (!testCaseBasicInfo.has(row.test_case_id)) {
                let testCredential = null;
                if (row.test_user_id && row.test_username && row.test_password) {
                    testCredential = {
                        username: row.test_username,
                        password: row.test_password,
                    };
                }

                let extraConfig = null;
                if (row.extra_config && typeof row.extra_config === 'string' && row.extra_config.trim().length > 0) {
                    try {
                        extraConfig = JSON.parse(row.extra_config);
                    } catch (error) {
                        logger.warn(
                            `Failed to parse extraConfig JSON for test case ${row.test_case_id}: ${error.message}`
                        );
                    }
                }

                testCaseBasicInfo.set(row.test_case_id, {
                    testCaseId: row.test_case_id,
                    testCaseName: row.test_case_name,
                    defaultLanguageId: row.default_language_id,
                    defaultBotVariantId: row.default_bot_variant_id, // from bot_groups table
                    prerequisiteTestCaseId: row.is_independent ? null : row.prerequisite_test_case_id,
                    validationMethods: new Set(),
                    tags: new Set(),
                    testCredential: testCredential,
                    extraConfig: extraConfig,
                });
            }

            // Add validation method
            if (row.validation_name) {
                testCaseBasicInfo.get(row.test_case_id).validationMethods.add(row.validation_name);
            }

            // Add tags
            if (row.tag_name && inputTagNames.includes(row.tag_name)) {
                testCaseBasicInfo.get(row.test_case_id).tags.add(row.tag_name);
            }
            let rowTagId = tagName2Id[row.tag_name];
            let parentName = childId2ParentName[rowTagId];
            if (parentName && inputTagNames.includes(parentName)) {
                testCaseBasicInfo.get(row.test_case_id).tags.add(parentName);
            }

            // Handle defects
            if (!defectsByTestCase.has(row.test_case_id)) {
                defectsByTestCase.set(row.test_case_id, []);
            }

            // Add defect if exists and not already added (avoid duplicates from multiple JOINs)
            if (row.defect_key) {
                const defectsList = defectsByTestCase.get(row.test_case_id);
                const defectExists = defectsList.some(
                    (d) =>
                        d.defectKey === row.defect_key &&
                        d.botId === row.defect_bot_id &&
                        d.languageId === row.defect_language_id
                );

                if (!defectExists) {
                    defectsList.push({
                        defectKey: row.defect_key,
                        botId: row.defect_bot_id || null,
                        botName: row.defect_bot_name || null,
                        languageId: row.defect_language_id || null,
                        languageName: row.defect_language_name || null,
                    });
                }
            }

            // Handle translations
            if (!translationsByTestCase.has(row.test_case_id)) {
                translationsByTestCase.set(row.test_case_id, {
                    defaultLanguageId: row.default_language_id,
                    translations: new Map(),
                });
            }

            if (row.language_id && row.question) {
                const key = row.language_id;
                if (!translationsByTestCase.get(row.test_case_id).translations.has(key)) {
                    translationsByTestCase.get(row.test_case_id).translations.set(key, {
                        languageId: row.language_id,
                        languageName: row.language_name,
                        languageCode: row.language_code,
                        question: row.question,
                    });
                }
            }

            // Handle bot variants
            if (!botVariantsByTestCase.has(row.test_case_id)) {
                botVariantsByTestCase.set(row.test_case_id, {
                    defaultBotVariantId: row.default_bot_variant_id, // from bot_groups table
                    bots: new Map(),
                });
            }

            if (row.bot_id) {
                // Use bot_id as the unique key to ensure all bots are captured,
                // even if multiple bots share the same bot_variant_id within the same bot_group
                const botKey = row.bot_id;
                if (!botVariantsByTestCase.get(row.test_case_id).bots.has(botKey)) {
                    botVariantsByTestCase.get(row.test_case_id).bots.set(botKey, {
                        botId: row.bot_id,
                        botName: row.bot_name,
                        botDescription: row.bot_description,
                        projectName: row.project_name,
                        objectId: row.object_id,
                        botGroupId: row.bot_group_id,
                        botGroupName: row.bot_group_name,
                        botVariantId: row.bot_variant_id,
                        botVariantName: row.bot_variant_name,
                        botVariantImpl: row.bot_variant_impl || null,
                    });
                }
            }
        });

        // Build final test case array
        const testCasesArray = [];

        for (const [testCaseId, basicInfo] of testCaseBasicInfo.entries()) {
            // Skip test cases with no matched tags
            if (basicInfo.tags.size === 0) {
                continue;
            }

            const testCaseTranslations = translationsByTestCase.get(testCaseId);
            const testCaseBotVariants = botVariantsByTestCase.get(testCaseId);
            const testCaseDefects = defectsByTestCase.get(testCaseId) || [];

            if (!testCaseTranslations?.translations?.size) {
                logger.warn(`No translations found for test case ${testCaseId} (${basicInfo.testCaseName}), skipping`);
                continue;
            }

            if (!testCaseBotVariants || !testCaseBotVariants.bots || testCaseBotVariants.bots.size === 0) {
                logger.warn(`No bot variants found for test case ${testCaseId} (${basicInfo.testCaseName}), skipping`);
                continue;
            }

            // Build translations array with isDefault flag
            const translations = Array.from(testCaseTranslations.translations.values()).map((t) => ({
                languageId: t.languageId,
                languageName: t.languageName,
                languageCode: t.languageCode,
                question: t.question,
                isDefault: t.languageId === testCaseTranslations.defaultLanguageId,
            }));

            // Build bots array with isDefault flag
            // All bots with the same bot_variant_id as defaultBotVariantId should be marked as default
            const bots = Array.from(testCaseBotVariants.bots.values()).map((b) => {
                const shouldBeDefault = b.botVariantId === testCaseBotVariants.defaultBotVariantId;
                return {
                    botId: b.botId,
                    botName: b.botName,
                    botDescription: b.botDescription,
                    projectName: b.projectName,
                    objectId: b.objectId,
                    botGroupId: b.botGroupId,
                    botGroupName: b.botGroupName,
                    botVariantId: b.botVariantId,
                    botVariantName: b.botVariantName,
                    botVariantImpl: b.botVariantImpl,
                    isDefault: shouldBeDefault,
                };
            });

            testCasesArray.push({
                uuid: randomUUID(),
                testCaseId: basicInfo.testCaseId,
                testCaseName: basicInfo.testCaseName,
                prerequisiteTestCaseId: basicInfo.prerequisiteTestCaseId,
                validationMethods: Array.from(basicInfo.validationMethods),
                tags: Array.from(basicInfo.tags),
                defects: testCaseDefects,
                testCredential: basicInfo.testCredential,
                extraConfig: basicInfo.extraConfig,
                bots: bots,
                translations: translations,
            });
        }

        logger.debug(`Generated ${testCasesArray.length} test cases with bots and translations`);
        return testCasesArray;
    } catch (err) {
        logger.error('SQL error in retrieveTestCases:', {
            error: err.message,
            stack: err.stack,
            filters: {
                tags: tags,
            },
        });
        throw new Error(`Failed to retrieve test cases: ${err.message}`);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

export async function deleteOldTestResults(tagName, productBuildNumber, testTypeId) {
    let pool;
    try {
        pool = await sql.connect(testResultDBConfig);

        const findQuery = `
            SELECT test_execution_id
            FROM test_execution
            WHERE tag_id = @tagId AND product_build_number = @productBuildNumber AND test_type_id = @testTypeId
        `;
        const result = await pool
            .request()
            .input('tagId', sql.Int, getTagInfoByName(tagName).tagId)
            .input('productBuildNumber', sql.NVarChar, productBuildNumber)
            .input('testTypeId', sql.Int, testTypeId)
            .query(findQuery);

        const testExecutionIds = result.recordset.map((row) => row.test_execution_id);

        if (testExecutionIds.length === 0) {
            logger.debug(
                `No test result record found with tag '${tagName}', build number '${productBuildNumber}' and test type '${testTypeId}', so skip deleting old results.`
            );
            return;
        }

        const deleteExecutionQuery = `
            DELETE FROM test_execution
            WHERE test_execution_id IN (${testExecutionIds.map((_, i) => `@id${i}`).join(',')})
        `;

        const request = pool.request();
        testExecutionIds.forEach((id, i) => {
            request.input(`id${i}`, sql.Int, id);
        });

        await request.query(deleteExecutionQuery);

        const count = testExecutionIds.length;
        logger.debug(`Deleted ${count} old test result(s) successfully.`);
    } catch (error) {
        logger.error('Error deleting old test results:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

export async function deleteTestExecutionsByIds(testExecutionIds) {
    let pool;
    try {
        if (!Array.isArray(testExecutionIds) || testExecutionIds.length === 0) {
            logger.debug('No test execution IDs provided for deletion.');
            return;
        }

        pool = await sql.connect(testResultDBConfig);
        const placeholders = testExecutionIds.map((_, index) => `@id${index}`).join(',');
        const request = pool.request();
        testExecutionIds.forEach((id, index) => {
            request.input(`id${index}`, sql.Int, id);
        });

        await request.query(`
            DELETE FROM test_execution
            WHERE test_execution_id IN (${placeholders})
        `);

        logger.debug(`Deleted ${testExecutionIds.length} test execution(s).`);
    } catch (error) {
        logger.error('Error deleting test executions by ID:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

export async function getOldTestExecutionIds(productBuildNumber, testTypeId) {
    let pool;
    try {
        pool = await sql.connect(testResultDBConfig);

        logger.debug(
            `Searching for test executions with build number '${productBuildNumber}' and test type '${testTypeId}'`
        );
        const query = `
            SELECT test_execution_id
            FROM test_execution
            WHERE product_build_number = @productBuildNumber AND test_type_id = @testTypeId
            ORDER BY test_execution_id DESC
        `;
        const result = await pool
            .request()
            .input('productBuildNumber', sql.NVarChar, productBuildNumber)
            .input('testTypeId', sql.Int, testTypeId)
            .query(query);

        const testExecutionIds = result.recordset.map((row) => row.test_execution_id);
        if (testExecutionIds.length === 0) {
            logger.debug(
                `No test execution records found with build number '${productBuildNumber}' and test type '${testTypeId}'`
            );
        } else {
            logger.debug(
                `Found ${
                    testExecutionIds.length
                } test execution record(s) with build number '${productBuildNumber}' and test type '${testTypeId}': ${testExecutionIds.join(
                    ', '
                )}`
            );
        }
        return testExecutionIds;
    } catch (error) {
        logger.error('Error getting old test execution IDs:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

export async function updateTestType(testExecutionIds, testTypeId) {
    let pool;
    try {
        if (!testExecutionIds || testExecutionIds.length === 0) {
            logger.debug('No test execution IDs provided for update');
            return;
        }

        const ids = Array.isArray(testExecutionIds) ? testExecutionIds : [testExecutionIds];

        pool = await sql.connect(testResultDBConfig);

        logger.debug(`Updating ${ids.length} test execution(s) to test type '${testTypeId}'`);

        const placeholders = ids.map((_, index) => `@id${index}`).join(',');
        const query = `
            UPDATE test_execution
            SET test_type_id = @testTypeId
            WHERE test_execution_id IN (${placeholders})
        `;

        const request = pool.request();
        request.input('testTypeId', sql.Int, testTypeId);

        ids.forEach((id, index) => {
            request.input(`id${index}`, sql.Int, id);
        });

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            logger.warn(`No test execution records found with the provided IDs: ${ids.join(', ')}`);
        } else {
            logger.debug(
                `Successfully updated ${result.rowsAffected[0]} test execution record(s) to test type '${testTypeId}'`
            );
            logger.debug(`Updated test execution IDs: ${ids.join(', ')}`);
        }
    } catch (error) {
        logger.error(`Error updating test type for execution IDs:`, error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

/**
 * Execute all upload operations within a single database transaction
 * If any operation fails, all changes will be rolled back
 */
export async function uploadTestResultsInTransaction(testConfig, testSuites, testProfilesByTag) {
    let pool;
    let transaction;
    try {
        pool = await sql.connect(testResultDBConfig);
        transaction = new sql.Transaction(pool);

        logger.info(`🔄 Starting database transaction for test results upload...`);
        await transaction.begin();

        // Step 1: Upload test configuration
        logger.info(`📤 PHASE 0: Uploading test configuration within transaction`);
        const testExecutionId = await uploadTestConfigInTransaction(transaction, testConfig);
        logger.info(`✅ Test configuration uploaded! Execution ID: ${testExecutionId}`);

        // Step 2: Upload test details for each test suite
        logger.info(`\n📤 PHASE 1: Uploading test results by TEST SUITE within transaction`);
        logger.info(`Total test suites to process: ${testSuites.size}\n`);

        const sortedTestSuites = Array.from(testSuites.entries()).sort((a, b) => a[0].localeCompare(b[0]));

        for (const [, profile] of sortedTestSuites) {
            const botInfo = profile.bot;
            const languageInfo = profile.language;
            const testCases = profile.cases;
            const botId = botInfo.id;
            const languageId = languageInfo.id;

            logger.debug(`\n${'─'.repeat(80)}`);
            logger.debug(
                `📊 Processing Test Suite: Bot '${botInfo.name}' (Variant: ${botInfo.variantName}), Language: ${languageInfo.name} [${languageInfo.code}]`
            );
            logger.debug(`   - Test Cases: ${testCases.length}`);
            logger.debug(`${'─'.repeat(80)}`);

            await uploadTestDetailsInTransaction(transaction, testExecutionId, botId, languageId, testCases);
            logger.debug(`✅ Test details uploaded for bot ID ${botId}, language ID ${languageId}`);
        }

        logger.info(`\n✅ PHASE 1 COMPLETED: All test suite results uploaded within transaction`);

        // Step 3: Upload tag evaluations
        logger.info(`\n📤 PHASE 2: Uploading tag evaluations by TAG within transaction`);
        logger.info(`Total tags to process: ${testProfilesByTag.size}\n`);

        const sortedTags = Array.from(testProfilesByTag.entries()).sort(([tagIdA], [tagIdB]) => tagIdA - tagIdB);

        for (const [tagId, profile] of sortedTags) {
            const tagInfo = tagsTableInfo.get(tagId);
            const tagName = tagInfo?.name ?? `Unknown tag (${tagId})`;
            const testCases = profile.cases;

            logger.debug(`\n${'─'.repeat(80)}`);
            logger.debug(`🏷️  Processing Tag: ${tagName} (ID: ${tagId})`);
            logger.debug(`   - Test Cases: ${testCases.length}`);
            logger.debug(`${'─'.repeat(80)}`);

            await uploadTagEvaluationInTransaction(transaction, tagId, testExecutionId, testCases, tagName);
            logger.debug(`✅ Completed tag evaluation for: ${tagName}`);
        }

        logger.info(`\n✅ PHASE 2 COMPLETED: All tag evaluations uploaded within transaction`);

        // Commit the transaction
        await transaction.commit();
        logger.info(`\n✅ Transaction committed successfully! All data has been saved.`);

        return testExecutionId;
    } catch (error) {
        logger.error('❌ Error during test results upload, rolling back transaction:', error);

        if (transaction) {
            try {
                await transaction.rollback();
                logger.info('🔄 Transaction rolled back successfully. No data was saved.');
            } catch (rollbackError) {
                logger.error('❌ Error rolling back transaction:', rollbackError);
            }
        }

        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

/**
 * Upload test configuration
 * @param {Object} testConfig - Test configuration object
 * @param {Object} [transaction] - Optional SQL transaction object. If provided, uses transaction; otherwise creates new connection
 * @returns {Promise<number>} Test execution ID
 */
async function uploadTestConfigCore(testConfig, transaction = null) {
    const {
        testDatetime,
        productRelease,
        productBuildNumber,
        libraryVersion,
        chatServiceVersion,
        ingestionServiceVersion,
        iserverVersion,
        reportLink,
        overallAiSummary,
        overallScore,
        testTypeId,
        testEnvId,
        parameters,
        comment,
    } = testConfig;

    logger.debug(`Uploading test execution configuration:`, {
        productRelease,
        productBuildNumber,
        testTypeId,
        testEnvId,
        hasParameters: !!parameters,
        hasComment: !!comment,
    });

    const query = `
        INSERT INTO test_execution (
            test_datetime, product_release, product_build_number, library_version, 
            chat_service_version, ingestion_service_version, iserver_version, report_link, 
            overall_ai_summary, overall_score, test_type_id, test_env_id, parameters, comment
        )
        VALUES (
            @test_datetime, @product_release, @product_build_number, @library_version, 
            @chat_service_version, @ingestion_service_version, @iserver_version, @report_link, 
            @overall_ai_summary, @overall_score, @test_type_id, @test_env_id, @parameters, @comment
        );
        SELECT SCOPE_IDENTITY() AS test_execution_id;
    `;

    const resultSet = await transaction
        .request()
        .input('test_datetime', sql.DateTime, testDatetime)
        .input('product_release', sql.NVarChar, productRelease)
        .input('product_build_number', sql.NVarChar, productBuildNumber)
        .input('library_version', sql.NVarChar, libraryVersion)
        .input('chat_service_version', sql.NVarChar, chatServiceVersion)
        .input('ingestion_service_version', sql.NVarChar, ingestionServiceVersion)
        .input('iserver_version', sql.NVarChar, iserverVersion || null)
        .input('report_link', sql.NVarChar, reportLink || null)
        .input('overall_ai_summary', sql.NVarChar, overallAiSummary || null)
        .input('overall_score', sql.Float, overallScore || null)
        .input('test_type_id', sql.Int, testTypeId)
        .input('test_env_id', sql.Int, testEnvId)
        .input('parameters', sql.NVarChar, parameters || null)
        .input('comment', sql.NVarChar, comment || null)
        .query(query);

    const testExecutionId = resultSet.recordset[0].test_execution_id;
    return testExecutionId;
}

async function uploadTestConfigInTransaction(transaction, testConfig) {
    try {
        return await uploadTestConfigCore(testConfig, transaction);
    } catch (error) {
        logger.error('Error uploading test configuration in transaction:', error);
        throw error;
    }
}

export async function uploadTestConfig(testConfig) {
    let pool;
    try {
        pool = await sql.connect(testResultDBConfig);
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        const testExecutionId = await uploadTestConfigCore(testConfig, transaction);

        await transaction.commit();
        logger.info(`✅ Successfully created test execution with ID: ${testExecutionId}`);

        return testExecutionId;
    } catch (error) {
        logger.error('Error uploading test configuration:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

/**
 * Upload test details (core logic)
 * @param {number} testExecutionId - Test execution ID
 * @param {number} botId - Bot ID
 * @param {number} languageId - Language ID
 * @param {Array} testCases - Array of test cases
 * @param {Object} transaction - SQL transaction object
 */
async function uploadTestDetailsCore(testExecutionId, botId, languageId, testCases, transaction) {
    // Upload test case details and validation results
    for (const testCase of testCases) {
        logger.debug(`Uploading case results for test case: ${testCase.testCaseName}`);
        const { testCaseId, execution, validation } = testCase;

        const answerText = execution?.answerText ?? null;
        const responseTime = execution?.responseTime ? execution.responseTime / 1000 : null;
        const isFullPass = validation?.isFullPass ? 1 : 0;
        const aggregateScore = validation?.aggregateScore;
        const normalizedAggregateScore =
            aggregateScore === '' || aggregateScore == null ? null : Number(aggregateScore);
        const aggregateScoreValue = Number.isFinite(normalizedAggregateScore) ? normalizedAggregateScore : null;

        // Extract error information from execution.errors (first error if exists)
        const executionErrorMessage = execution?.errors?.length > 0 ? execution.errors[0].message : null;
        const executionFailureCategory = execution?.errors?.length > 0 ? execution.errors[0].category : null;

        // Insert into test_case_detail table with language_id, execution_error_message, and execution_failure_category
        let query = `
            INSERT INTO test_case_detail (test_execution_id, test_case_id, answer_text, response_time, is_pass, bot_id, language_id, aggregate_score, execution_error_message, execution_failure_category)
            VALUES (@test_execution_id, @test_case_id, @answer_text, @response_time, @is_pass, @bot_id, @language_id, @aggregate_score, @execution_error_message, @execution_failure_category);
            SELECT SCOPE_IDENTITY() AS test_case_detail_id;
        `;
        let resultSet = await transaction
            .request()
            .input('test_execution_id', sql.Int, testExecutionId)
            .input('test_case_id', sql.Int, testCaseId)
            .input('answer_text', sql.NVarChar, answerText)
            .input('response_time', sql.Float, responseTime)
            .input('is_pass', sql.Int, isFullPass)
            .input('bot_id', sql.Int, botId)
            .input('language_id', sql.Int, languageId)
            .input('aggregate_score', sql.Float, aggregateScoreValue)
            .input('execution_error_message', sql.NVarChar, executionErrorMessage)
            .input('execution_failure_category', sql.NVarChar, executionFailureCategory)
            .query(query);
        const testCaseDetailId = resultSet.recordset[0].test_case_detail_id;

        logger.info(`Uploaded test case detail with aggregate score: ${aggregateScoreValue ?? 'N/A'}`);

        // Validation methods and dimensions insertion
        logger.info(`Uploading validation results for test case: ${testCase.testCaseName}`);
        for (const method of validation.methods || []) {
            const methodName = method.name;
            const dimensions = method.dimensions;

            if (!dimensions || dimensions.length === 0) {
                logger.warn(
                    `No validation dimensions found for validation method '${methodName}' in test case '${testCase.testCaseName}'`
                );
                continue;
            }

            for (const dimension of dimensions) {
                const dimensionName = dimension.name;
                const validationDimensionInfo = getValidationDimensionInfoByName(dimensionName);
                const validationDimensionId = validationDimensionInfo.validationDimensionId;
                const validationMethodId = validationDimensionInfo.validationMethodId;
                const rawScore = dimension.score;
                const isPass = dimension.isPass ? 1 : 0;
                const normalizedScore = rawScore === '' || rawScore == null ? null : Number(rawScore);
                if (!Number.isFinite(normalizedScore)) {
                    logger.warn(
                        `Skipping validation dimension '${dimension.name}' for test case '${testCase.testCaseName}' because score is invalid.`
                    );
                    continue;
                }
                const reasoning = (dimension.reasoning || 'N/A').trim();
                const dimensionFailureCategory = dimension.failureCategory || null;

                query = `
                    INSERT INTO test_validation_detail (test_case_detail_id, validation_dimension_id, validation_method_id, score, reasoning, is_pass, failure_category)
                    VALUES (@test_case_detail_id, @validation_dimension_id, @validation_method_id, @score, @reasoning, @is_pass, @failure_category);
                `;
                await transaction
                    .request()
                    .input('test_case_detail_id', sql.Int, testCaseDetailId)
                    .input('validation_dimension_id', sql.Int, validationDimensionId)
                    .input('validation_method_id', sql.Int, validationMethodId)
                    .input('score', sql.Float, normalizedScore)
                    .input('reasoning', sql.NVarChar, reasoning)
                    .input('is_pass', sql.Int, isPass)
                    .input('failure_category', sql.NVarChar, dimensionFailureCategory)
                    .query(query);
            }
        }
    }

    // Upload performance results
    logger.debug(`Uploading performance results for bot ID: ${botId}`);

    // Collect all bot execution times from test cases
    const botExecutionTimes = [];
    for (const testCase of testCases) {
        const rawBotExecutionTime = testCase.execution?.botExecutionTime;
        const normalizedBotExecutionTime =
            typeof rawBotExecutionTime === 'number' ? rawBotExecutionTime : Number(rawBotExecutionTime);
        if (Number.isFinite(normalizedBotExecutionTime)) {
            botExecutionTimes.push(normalizedBotExecutionTime);
        }
    }

    // Calculate average execution time if we have any records
    if (botExecutionTimes.length > 0) {
        const averageExecutionTime = Math.round(
            botExecutionTimes.reduce((sum, time) => sum + time, 0) / botExecutionTimes.length
        );
        const averageExecutionTimeSeconds = (averageExecutionTime / 1000).toFixed(2);

        logger.debug(`Collected ${botExecutionTimes.length} execution time records`);
        logger.debug(`Average bot execution time: ${averageExecutionTime} ms (${averageExecutionTimeSeconds}s)`);

        const query = `
            INSERT INTO test_performance_detail (
                test_execution_id, bot_id, bot_execution_time
            )
            VALUES (
                @test_execution_id, @bot_id, @bot_execution_time
            );
            SELECT SCOPE_IDENTITY() AS test_performance_detail_id;
        `;
        await transaction
            .request()
            .input('test_execution_id', sql.Int, testExecutionId)
            .input('bot_id', sql.Int, botId)
            .input('bot_execution_time', sql.Float, parseFloat(averageExecutionTimeSeconds))
            .query(query);

        logger.debug(`✅ Performance data uploaded successfully`);
    } else {
        logger.warn(`⚠️ No bot execution time records found, skipping performance upload`);
    }

    logger.debug(`Successfully uploaded test results for ${testCases.length} case(s)`);
}

async function uploadTestDetailsInTransaction(transaction, testExecutionId, botId, languageId, testCases) {
    try {
        await uploadTestDetailsCore(testExecutionId, botId, languageId, testCases, transaction);
    } catch (error) {
        logger.error('Error uploading test details in transaction:', error);
        throw error;
    }
}

export async function uploadTestDetails(testExecutionId, botId, languageId, testCases) {
    let pool;
    try {
        pool = await sql.connect(testResultDBConfig);
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        await uploadTestDetailsCore(testExecutionId, botId, languageId, testCases, transaction);

        await transaction.commit();
        return testExecutionId;
    } catch (error) {
        logger.error('Error uploading test details:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

/**
 * Upload tag evaluation (core logic)
 * @param {number} tagId - Tag ID
 * @param {number} testExecutionId - Test execution ID
 * @param {string} tagAiSummary - AI generated summary for this tag
 * @param {Object} transaction - SQL transaction object
 */
async function uploadTagEvaluationCore(tagId, testExecutionId, tagAiSummary, transaction) {
    logger.debug(`Uploading tag evaluation for '${tagId}' with test execution ID: ${testExecutionId}`);

    const query = `
        INSERT INTO test_tag_evaluation (
            test_execution_id, tag_id, tag_ai_summary
        )
        VALUES (
            @test_execution_id, @tag_id, @tag_ai_summary
        );
        SELECT SCOPE_IDENTITY() AS test_tag_evaluation_id;
    `;

    await transaction
        .request()
        .input('test_execution_id', sql.Int, testExecutionId)
        .input('tag_id', sql.Int, tagId)
        .input('tag_ai_summary', sql.NVarChar, tagAiSummary || null)
        .query(query);

    logger.debug(`Tag evaluation uploaded successfully for tag_id: ${tagId}`);
}

async function uploadTagEvaluationInTransaction(transaction, tagId, testExecutionId, testCases, tagName) {
    try {
        const tagAiSummary = await summarizeTestExecution(testCases, tagName, botsFullInfo);
        await uploadTagEvaluationCore(tagId, testExecutionId, tagAiSummary, transaction);
    } catch (error) {
        logger.error(`Error uploading tag evaluation in transaction for tag_id '${tagId}':`, error);
        throw error;
    }
}

export async function uploadTagEvaluation(tagId, testExecutionId, tagAiSummary) {
    let pool;
    try {
        pool = await sql.connect(testResultDBConfig);
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        await uploadTagEvaluationCore(tagId, testExecutionId, tagAiSummary, transaction);

        await transaction.commit();
    } catch (error) {
        logger.error(`Error uploading tag evaluation for tag_id '${tagId}':`, error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

export function getTagInfoByName(tagName) {
    for (const tag of tagsTableInfo.values()) {
        if (normalizedEqual(tag.name, tagName)) {
            return tag;
        }
    }
    throw new Error(`Tag '${tagName}' not found`);
}

export function getBotInfoByName(botName) {
    for (const bot of botsTableInfo.values()) {
        if (normalizedEqual(bot.name, botName)) {
            return bot;
        }
    }
    throw new Error(`Bot '${botName}' not found`);
}

export function getBotInfoByObjectId(objectId) {
    for (const bot of botsTableInfo.values()) {
        if (bot.object_id === objectId) {
            return bot;
        }
    }
    throw new Error(`Bot with object ID '${objectId}' not found`);
}

export function getBotGroupInfoByName(botGroupName) {
    for (const botGroup of botGroupsTableInfo.values()) {
        if (normalizedEqual(botGroup.name, botGroupName)) {
            return botGroup;
        }
    }
    throw new Error(`Bot group '${botGroupName}' not found`);
}

export function getBotVariantInfoByName(botVariantName) {
    for (const botVariant of botVariantsTableInfo.values()) {
        if (normalizedEqual(botVariant.name, botVariantName)) {
            return botVariant;
        }
    }
    throw new Error(`Bot variant '${botVariantName}' not found`);
}

export function getTestEnvInfoByName(testEnvName) {
    for (const testEnv of testEnvsTableInfo.values()) {
        if (normalizedEqual(testEnv.test_env_name, testEnvName)) {
            return testEnv;
        }
    }
    throw new Error(`Test environment '${testEnvName}' not found`);
}

export function getTestTypeInfoByName(testTypeName) {
    for (const testType of testTypesTableInfo.values()) {
        if (normalizedEqual(testType.name, testTypeName)) {
            return testType;
        }
    }
    throw new Error(`Test type '${testTypeName}' not found`);
}

export function getValidationMethodInfoByName(validationMethodName) {
    for (const validationMethod of validationMethodsTableInfo.values()) {
        if (normalizedEqual(validationMethod.name, validationMethodName)) {
            return validationMethod;
        }
    }
    throw new Error(`Validation method '${validationMethodName}' not found`);
}

export function getValidationDimensionInfoByName(validationDimensionName) {
    for (const validationDimension of validationDimensionsTableInfo.values()) {
        if (normalizedEqual(validationDimension.name, validationDimensionName)) {
            return {
                validationDimensionId: validationDimension.validation_dimension_id,
                name: validationDimension.name,
                description: validationDimension.description,
                validationMethodId: validationDimension.validation_method_id,
                minPassScore: validationDimension.min_pass_score,
            };
        }
    }
    throw new Error(`Validation dimension '${validationDimensionName}' not found`);
}

export function getValidationDimensionInfoListByMethodName(validationMethodName) {
    const validationMethod = getValidationMethodInfoByName(validationMethodName);
    const dimensions = [];
    for (const validationDimension of validationDimensionsTableInfo.values()) {
        if (validationDimension.validation_method_id === validationMethod.validation_method_id) {
            dimensions.push(validationDimension);
        }
    }
    return dimensions;
}

async function getTagsTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                tag_id,
                name,
                description
            FROM
                tags
        `;
        const result = await pool.request().query(query);
        const tagsMap = new Map();
        result.recordset.forEach((row) => {
            tagsMap.set(row.tag_id, {
                tagId: row.tag_id,
                name: row.name,
                description: row.description,
            });
        });
        logger.debug(`Loaded ${tagsMap.size} tags from database`);
        return tagsMap;
    } catch (error) {
        logger.error('Error retrieving tags table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getBotsTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                bot_id,
                name,
                description,
                created_at,
                bot_group_id,
                project_name,
                object_id,
                bot_variant_id,
                bot_variant_impl
            FROM
                bots
        `;
        const result = await pool.request().query(query);
        const botsMap = new Map();
        result.recordset.forEach((row) => {
            botsMap.set(row.bot_id, row);
        });
        logger.debug(`Loaded ${botsMap.size} bots from database`);
        return botsMap;
    } catch (error) {
        logger.error('Error retrieving bots table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getBotGroupsTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                bot_group_id,
                name,
                description,
                default_bot_variant_id
            FROM
                bot_groups
        `;
        const result = await pool.request().query(query);
        const botGroupsMap = new Map();
        result.recordset.forEach((row) => {
            botGroupsMap.set(row.bot_group_id, row);
        });
        logger.debug(`Loaded ${botGroupsMap.size} bot groups from database`);
        return botGroupsMap;
    } catch (error) {
        logger.error('Error retrieving bot_groups table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getBotVariantsTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                bot_variant_id,
                name,
                description
            FROM
                bot_variants
        `;
        const result = await pool.request().query(query);
        const botVariantsMap = new Map();
        result.recordset.forEach((row) => {
            botVariantsMap.set(row.bot_variant_id, row);
        });
        logger.debug(`Loaded ${botVariantsMap.size} bot variants from database`);
        return botVariantsMap;
    } catch (error) {
        logger.error('Error retrieving bot_variants table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getTestEnvsTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                test_env_id,
                test_env_name,
                test_env_url,
                test_env_type
            FROM
                test_envs
        `;
        const result = await pool.request().query(query);
        const testEnvsMap = new Map();
        result.recordset.forEach((row) => {
            testEnvsMap.set(row.test_env_id, row);
        });
        logger.debug(`Loaded ${testEnvsMap.size} test environments from database`);
        return testEnvsMap;
    } catch (error) {
        logger.error('Error retrieving test_envs table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getTestTypesTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                test_type_id,
                name,
                description
            FROM
                test_types
        `;
        const result = await pool.request().query(query);
        const testTypesMap = new Map();
        result.recordset.forEach((row) => {
            testTypesMap.set(row.test_type_id, row);
        });
        logger.debug(`Loaded ${testTypesMap.size} test types from database`);
        return testTypesMap;
    } catch (error) {
        logger.error('Error retrieving test_types table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getValidationMethodsTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                validation_method_id,
                name,
                description,
                parameters
            FROM
                validation_methods
        `;
        const result = await pool.request().query(query);
        const validationMethodsMap = new Map();
        result.recordset.forEach((row) => {
            validationMethodsMap.set(row.validation_method_id, row);
        });
        logger.debug(`Loaded ${validationMethodsMap.size} validation methods from database`);
        return validationMethodsMap;
    } catch (error) {
        logger.error('Error retrieving validation_methods table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getValidationDimensionsTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                validation_dimension_id,
                name,
                description,
                validation_method_id,
                min_pass_score
            FROM
                validation_dimensions
        `;
        const result = await pool.request().query(query);
        const validationDimensionsMap = new Map();
        result.recordset.forEach((row) => {
            validationDimensionsMap.set(row.validation_dimension_id, row);
        });
        logger.debug(`Loaded ${validationDimensionsMap.size} validation dimensions from database`);
        return validationDimensionsMap;
    } catch (error) {
        logger.error('Error retrieving validation_dimensions table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function getBotsFullInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                b.bot_id,
                b.name AS bot_name,
                b.description AS bot_description,
                b.project_name,
                b.object_id,
                b.bot_variant_impl,
                bg.bot_group_id,
                bg.name AS bot_group_name,
                bv.bot_variant_id,
                bv.name AS bot_variant_name
            FROM
                bots b
                LEFT JOIN bot_groups bg ON b.bot_group_id = bg.bot_group_id
                LEFT JOIN bot_variants bv ON b.bot_variant_id = bv.bot_variant_id
        `;
        const result = await pool.request().query(query);
        const botsFullInfoMap = new Map();
        result.recordset.forEach((row) => {
            botsFullInfoMap.set(row.bot_id, {
                botId: row.bot_id,
                botName: row.bot_name,
                botDescription: row.bot_description,
                projectName: row.project_name,
                objectId: row.object_id,
                botVariantImpl: row.bot_variant_impl,
                botGroupId: row.bot_group_id,
                botGroupName: row.bot_group_name,
                botVariantId: row.bot_variant_id,
                botVariantName: row.bot_variant_name,
            });
        });
        logger.debug(`Loaded full info for ${botsFullInfoMap.size} bots from database`);
        return botsFullInfoMap;
    } catch (error) {
        logger.error('Error retrieving bots full information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

export async function getLanguagesTableInfo() {
    let pool;
    try {
        pool = await sql.connect(testCaseDBConfig);
        const query = `
            SELECT
                language_id,
                language_name,
                language_code
            FROM
                languages
        `;
        const result = await pool.request().query(query);
        const languagesMap = new Map();
        result.recordset.forEach((row) => {
            languagesMap.set(row.language_id, {
                id: row.language_id,
                name: row.language_name,
                code: row.language_code,
            });
        });
        logger.debug(`Loaded ${languagesMap.size} languages from database`);
        return languagesMap;
    } catch (error) {
        logger.error('Error retrieving languages table information:', error);
        throw error;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

export function getLanguageInfoById(languageId) {
    const lang = languagesTableInfo.get(languageId);
    if (!lang) {
        throw new Error(`Language with ID '${languageId}' not found`);
    }
    return lang;
}

export function getLanguageInfoByCode(languageCode) {
    for (const language of languagesTableInfo.values()) {
        if (normalizedEqual(language.code, languageCode)) {
            return language;
        }
    }
    throw new Error(`Language with code '${languageCode}' not found`);
}

export function getLanguageInfoByName(languageName) {
    for (const language of languagesTableInfo.values()) {
        if (normalizedEqual(language.name, languageName)) {
            return language;
        }
    }
    throw new Error(`Language '${languageName}' not found`);
}
