// ============================================================================
// CONSTANTS AND THEME CONFIGURATIONS
// ============================================================================

const DEFAULT_APPLICATION_ID = 'C2B2023642F6753A2EF159A75E0CFF29';
const API_ENDPOINT = '**/api/v2/applications?outputFlag=FILTER_AUTH_MODES';

const THEME_CONFIGURATIONS = {
    yellow: {
        color: {
            selectedTheme: 'yellow',
            formatting: {
                toolbarFill: '#FFBD30',
                toolbarColor: '#0E0D0C',
                sidebarFill: '#292929',
                sidebarColor: '#FFFFFF',
                sidebarActiveFill: '#FFC700',
                sidebarActiveColor: '#0E0D0C',
                panelFill: '#232323',
                panelColor: '#FFFFFF',
                accentFill: '#F7AE13',
                notificationBadgeFill: '#EB4858',
                buttonColor: '#000000',
                canvasFill: '#000000',
            },
            enableForBots: false,
        },
    },
};

// ============================================================================
// UTILITY FUNCTIONS (Pure Functions)
// ============================================================================

/**
 * Pure function to find application by ID
 * @param {Array} applications - Array of applications
 * @param {string} applicationId - Target application ID
 * @returns {Object|undefined} Found application or undefined
 */
const findApplicationById = (applications, applicationId) =>
    Array.isArray(applications) ? applications.find((app) => app.id === applicationId) : undefined;

/**
 * Pure function to set nested property value
 * @param {Object} obj - Target object
 * @param {string} path - Dot notation path
 * @param {*} value - Value to set
 * @returns {Object} Modified object (mutates original)
 */
const setNestedProperty = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
        current[key] = current[key] || {};
        return current[key];
    }, obj);
    target[lastKey] = value;
    return obj;
};

// ============================================================================
// HIGHER-ORDER FUNCTIONS
// ============================================================================

/**
 * Higher-order function to create application property updaters
 * @param {string} propertyPath - Dot notation path to the property
 * @param {string} logContext - Context for logging
 * @returns {Function} Property updater function
 */
const createPropertyUpdater = (propertyPath, logContext) => (value) => (application) => {
    console.log(`Mock application ${logContext}, applicationId: ${application.id}, ${logContext}: ${value}`);
    setNestedProperty(application, propertyPath, value);
    return application;
};

/**
 * Higher-order function to create specialized updaters for AI settings
 * @param {string} settingName - Name of the AI setting
 * @returns {Function} AI setting updater function
 */
const createAiSettingUpdater = (settingName) => (value) => (application) => {
    console.log(`Mock application ${settingName}, applicationId: ${application.id}, ${settingName}: ${value}`);
    application.aiSettings = application.aiSettings || {};
    application.aiSettings[settingName] = value;
    return application;
};

/**
 * Higher-order function for theme configuration
 * @param {string} themeName - Name of the theme
 * @returns {Function} Theme updater function
 */
const createThemeUpdater = (themeName) => (application) => {
    console.log(`Mock application theme, applicationId: ${application.id}, theme: ${themeName}`);
    const themeConfig = THEME_CONFIGURATIONS[themeName];
    if (themeConfig) {
        application.homeScreen = application.homeScreen || {};
        application.homeScreen.theme = themeConfig;
    }
    return application;
};

/**
 * Core higher-order function to create mock application functions
 * @param {Function} updaterFn - Function that updates the application object
 * @returns {Function} Async mock function
 */
const createApplicationMocker =
    (updaterFn) =>
    async ({ applicationId = DEFAULT_APPLICATION_ID, ...config }) => {
        const mock = await browser.mock(API_ENDPOINT);

        mock.respondOnce(
            (response) => {
                const responseObj = response.body;
                const applications = response.body.applications;
                const application = findApplicationById(applications, applicationId);

                if (application) {
                    updaterFn(config)(application);
                }

                return responseObj;
            },
            { fetchResponse: true }
        );
    };

// ============================================================================
// PROPERTY UPDATER FACTORIES
// ============================================================================

const updateSidebarSnapshots = createPropertyUpdater(
    'homeScreen.homeLibrary.customizedItems.sidebar_snapshots',
    'sidebar snapshot'
);

const updateFavoriteSnapshots = createPropertyUpdater(
    'homeScreen.homeLibrary.customizedItems.favorite_snapshot',
    'favorite snapshot'
);

const updateSubscribeSnapshot = createPropertyUpdater(
    'homeScreen.homeLibrary.customizedItems.snapshot',
    'subscribe snapshot'
);
const updateAiFeedback = createAiSettingUpdater('feedback');
const updateAiLearning = createAiSettingUpdater('learning');

// ============================================================================
// EXPORTED FUNCTIONS
// ============================================================================

/**
 * Mock application sidebar snapshot configuration
 */
export const mockApplicationSidebarSnapshot = createApplicationMocker(({ snapshot = false }) =>
    updateSidebarSnapshots(snapshot)
);

/**
 * Mock application subscribe snapshot configuration
 */
export const mockApplicationSubscribeSnapshot = createApplicationMocker(({ snapshot = false }) =>
    updateSubscribeSnapshot(snapshot)
);

/**
 * Mock application favorite snapshot configuration
 */
export const mockApplicationFavoriteSnapshot = createApplicationMocker(({ snapshot = false }) =>
    updateFavoriteSnapshots(snapshot)
);

/**
 * Mock application theme configuration
 */
export const mockApplicationTheme = createApplicationMocker(({ theme = 'yellow' }) => createThemeUpdater(theme));

/**
 * Mock application AI feedback configuration
 */
export const mockApplicationFeedback = createApplicationMocker(({ feedback = false }) => updateAiFeedback(feedback));

/**
 * Mock application AI learning configuration
 */
export const mockApplicationLearning = createApplicationMocker(({ learning = false }) => updateAiLearning(learning));
