import fs from 'fs';
import { sanitizeCredential } from './test-config.js';
import { logger } from '../../logger.js';

/**
 * Load test profile from JSON file
 *
 * @param {string} profilePath - Path to profile.json file (optional, auto-detected if not provided)
 * @returns {Object} Loaded and validated test profile
 */
export function loadTestProfile(profilePath) {
    if (!fs.existsSync(profilePath)) {
        throw new Error(`Test profile not found: ${profilePath}`);
    }

    const testProfile = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));

    // Validate profile structure
    if (!testProfile.testSuiteName) {
        throw new Error(`Invalid test profile: missing testSuiteName in ${profilePath}`);
    }

    if (!testProfile.config || !testProfile.config.bot) {
        throw new Error(`Invalid test profile: missing config.bot in ${profilePath}`);
    }

    if (!Array.isArray(testProfile.cases) || testProfile.cases.length === 0) {
        throw new Error(`Test profile '${profilePath}' does not contain any test cases.`);
    }

    // instanceName can be null (when both variant and language are default)
    // testSuiteName is always present
    // Validate that if instanceName exists, it matches the expected format
    if (testProfile.instanceName !== null && testProfile.instanceName !== undefined) {
        if (typeof testProfile.instanceName !== 'string') {
            throw new Error(`Invalid test profile: instanceName must be a string or null in ${profilePath}`);
        }
    }

    return testProfile;
}

/**
 * Initialize test cases from profile
 * Sanitizes credentials and creates test case map
 *
 * @param {Array} testCasesArray - Array of test cases from profile
 * @returns {Map} Map of testCaseId -> testCase
 */
export function initializeTestCases(testCasesArray) {
    // Sanitize credentials for each test case
    testCasesArray.forEach((testCase) => {
        testCase.testCredential = sanitizeCredential(testCase.testCredential);
    });

    return new Map(testCasesArray.map((testCase) => [testCase.testCaseId, testCase]));
}

/**
 * Build prerequisite dependency set
 * Returns set of test case IDs that are prerequisites for other cases
 *
 * @param {Map} testCases - Map of test cases
 * @returns {Set} Set of prerequisite test case IDs
 */
export function buildPrerequisiteDependencies(testCases) {
    const testCasesThatBeenDependOn = new Set();

    for (const [caseId] of testCases.entries()) {
        let currentCaseId = caseId;
        while (currentCaseId) {
            const testCase = testCases.get(currentCaseId);
            if (testCase.prerequisiteTestCaseId) {
                testCasesThatBeenDependOn.add(testCase.prerequisiteTestCaseId);
                currentCaseId = testCase.prerequisiteTestCaseId;
            } else {
                break;
            }
        }
    }

    return testCasesThatBeenDependOn;
}

/**
 * Build test case execution group including prerequisites
 *
 * @param {Object} testCase - Main test case
 * @param {Map} testCases - Map of all test cases
 * @returns {Array} Array of test cases in execution order (prerequisites first)
 */
export function buildTestCaseGroup(testCase, testCases) {
    const group = [testCase];

    if (testCase.prerequisiteTestCaseId) {
        let prereqId = testCase.prerequisiteTestCaseId;
        while (prereqId) {
            const prereqTestCase = testCases.get(prereqId);
            if (!prereqTestCase) {
                throw new Error(`Prerequisite test case '${prereqId}' not found for '${testCase.testCaseId}'`);
            }
            group.unshift(prereqTestCase);
            prereqId = prereqTestCase.prerequisiteTestCaseId;
        }
    }

    return group;
}

/**
 * Create credential resolver function
 * Returns a function that resolves credentials with priority order
 *
 * @param {Object} overrideCredential - Override credential (highest priority)
 * @param {Object} defaultCredential - Default credential (lowest priority)
 * @returns {Function} Credential resolver function
 */
export function createCredentialResolver(overrideCredential, defaultCredential) {
    return (preferredCredential = null) => {
        // Priority 1: Override credential (highest priority)
        if (overrideCredential?.username) {
            return overrideCredential;
        }

        // Priority 2: Preferred credential (from test case)
        const sanitizedPreferred = sanitizeCredential(preferredCredential);
        if (sanitizedPreferred?.username) {
            return sanitizedPreferred;
        }

        // Priority 3: Default credential (fallback)
        if (defaultCredential?.username) {
            return defaultCredential;
        }

        throw new Error(
            'No valid test credential available. Set OverrideTestUserName or ensure test cases provide credentials.'
        );
    };
}

/**
 * Save/update test profile to JSON file
 *
 * @param {string} profilePath - Path to profile.json file
 * @param {Object} testProfile - Test profile object
 * @param {Map} testCases - Map of test cases (will be converted to array)
 */
export function saveTestProfile(profilePath, testProfile, testCases) {
    try {
        testProfile.cases = Array.from(testCases.values());
        fs.writeFileSync(profilePath, JSON.stringify(testProfile, null, 4), 'utf-8');
        logger.debug(`✅ Test profile updated: ${profilePath}`);
    } catch (error) {
        logger.error(`Failed to update test profile: ${error.message}`);
    }
}

/**
 * Initialize execution and validation objects for a test case
 *
 * @param {Object} testCase - Test case to initialize
 * @param {Object} botConfig - Bot configuration (optional, for setting botId)
 * @param {Object} languageConfig - Language configuration (optional, for setting languageId)
 */
export function initializeTestCaseResults(testCase, botConfig = null, languageConfig = null) {
    testCase.execution = {
        botId: botConfig?.id || null,
        languageId: languageConfig?.id || null,
        answerText: null,
        gridMarkdowns: null,
        chartImages: null,
        insightText: null,
        unstructuredDataReference: null,
        interpretationSql: null,
        responseTime: null,
        botExecutionTime: null,
        status: 'not_started',
        errors: [],
    };

    testCase.validation = {
        isFullPass: false,
        aggregateScore: 0,
        methods: (testCase.validationMethods || []).map((methodName) => ({
            name: methodName,
            dimensions: [],
            aggregateScore: null,
        })),
    };
}
