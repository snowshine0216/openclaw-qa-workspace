import { getEnvVariable, getBooleanEnvVariable } from './utils/env.js';
import { formatDateTime } from './utils/date-time.js';

function parseCommaSeparated(value) {
    if (!value) return null;
    const result = value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    return result.length > 0 ? result : null;
}

/**
 * Test execution parameters
 * These parameters control test behavior, filters, and policies
 * Uses lazy loading via getters to defer environment variable reading
 */
const testParams = {
    // Test environment options
    get testType() {
        return getEnvVariable('TestType');
    },
    get testEnvName() {
        return getEnvVariable('TestEnv');
    },

    // Test options
    get testEachCaseInNewChat() {
        return getBooleanEnvVariable('TestEachCaseInNewChat', false);
    },
    get enableFollowUp() {
        return getBooleanEnvVariable('EnableFollowUp', false);
    },
    get enableAutoComplete() {
        return getBooleanEnvVariable('EnableAutoComplete', false);
    },
    get enableAiDiagnostics() {
        return getBooleanEnvVariable('EnableAiDiagnostics', false);
    },
    get executeBotByName() {
        return getBooleanEnvVariable('ExecuteBotByName', false);
    },
    get createChatBeforeTest() {
        return getBooleanEnvVariable('CreateChatBeforeTest', false);
    },
    get deleteChatAfterTest() {
        return getBooleanEnvVariable('DeleteChatAfterTest', false);
    },
    get tags() {
        return parseCommaSeparated(getEnvVariable('Tags', null));
    },
    get botVariants() {
        return parseCommaSeparated(getEnvVariable('BotVariants', null));
    },
    get testLanguages() {
        return parseCommaSeparated(getEnvVariable('TestLanguages', null));
    },
    get enableCaseCombination() {
        return getBooleanEnvVariable('EnableCaseCombination', false);
    },
    get comment() {
        return getEnvVariable('Comment', null);
    },

    // Advanced options
    get overrideTestUserName() {
        return getEnvVariable('OverrideTestUserName', null);
    },
    get overrideTestUserPassword() {
        return getEnvVariable('OverrideTestUserPassword', '');
    },
    get overrideProjectName() {
        return getEnvVariable('OverrideProjectName', null);
    },
    get logLevel() {
        return getEnvVariable('LOG_LEVEL', 'INFO');
    },

    // Test Script options
    get isDebugMode() {
        return getBooleanEnvVariable('Debug', false);
    },

    // Test Report options
    get exportInterpretation() {
        return getBooleanEnvVariable('ExportInterpretation', false);
    },
    get exportAiDiagnostics() {
        return getBooleanEnvVariable('ExportAiDiagnostics', false);
    },
    get attachVideoRecordingInValidation() {
        return getBooleanEnvVariable('AttachVideoRecordingInValidation', false);
    },

    // Test Result options
    get oldOfficialResultPolicy() {
        return getEnvVariable('OldOfficialResultPolicy', 'Convert type');
    },
    get dbConfig() {
        return getEnvVariable('DBConfig', 'prod');
    },
};

/**
 * Build and environment information
 * These are metadata about the build being tested
 * Uses lazy loading via getters to defer environment variable reading
 */
const buildInfo = {
    // Product version information
    get productRelease() {
        return getEnvVariable('PRODUCT_RELEASE', null);
    },
    get productBuildNumber() {
        return getEnvVariable('PRODUCT_BUILD_NUMBER', null);
    },
    get libraryVersion() {
        return getEnvVariable('LIBRARY_VERSION', null);
    },
    get chatServiceVersion() {
        return getEnvVariable('CHAT_SERVICE_VERSION', null);
    },
    get ingestionServiceVersion() {
        return getEnvVariable('INGESTION_SERVICE_VERSION', null);
    },
    get iserverVersion() {
        return getEnvVariable('ISERVER_VERSION', null);
    },

    // Jenkins/CI information
    get testDateTime() {
        return formatDateTime(getEnvVariable('TEST_DATETIME', null));
    },
    get buildUrl() {
        return getEnvVariable('BUILD_URL', null);
    },
    get reportLink() {
        return this.buildUrl ? `${this.buildUrl.replace(/\/$/, '')}/allure` : null;
    },
};

/**
 * Serialization helper for database storage
 * Simple and straightforward - just pick the fields you want
 */
const paramSerializer = {
    toJSON(fieldNames) {
        const result = {};

        for (const fieldName of fieldNames) {
            const value = testParams[fieldName];
            // Only include non-null, non-undefined values
            if (value !== null && value !== undefined) {
                result[fieldName] = value;
            }
        }

        return JSON.stringify(result);
    },

    toJSONExcept(excludeFields = []) {
        const result = {};
        for (const [key, value] of Object.entries(testParams)) {
            if (!excludeFields.includes(key) && value !== null && value !== undefined) {
                result[key] = value;
            }
        }
        return JSON.stringify(result);
    },
};

export { testParams, buildInfo, paramSerializer };
