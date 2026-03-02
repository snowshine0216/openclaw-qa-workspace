// built-in modules
import path from 'path';
import http from 'http';
import https from 'https';

// 3rd party libraries
import yargs from 'yargs';
import deepmerge from 'deepmerge';
import fs from 'fs-extra';
import chalk from 'chalk';
import ci from 'ci-info';
import { type Services } from '@wdio/types';

// project internal modules
import pageBuilder from './pageObjects/pageBuilder.js';
import ByTcService from './wdioServices/by-tc/index.js';
import SinceService from './wdioServices/since/index.js';
import SpectreService from './wdioServices/spectre/index.js';
import ResultSummaryService from './wdioServices/result-summary/index.js';
import CustomAppControlService from './wdioServices/custom-app-control/index.js';
import selectTc from './scripts/selectTC.js';
import getLogger from './scripts/logger.js';
import getAvailablePort from './utils/getAvailablePort.js';
import * as consts from './constants/index.js';
import { REPORTS_FOR_ALLUER, REPORTS_FOR_VIDEO } from './constants/wdioConfig.js';
import './ca/patch.js';
import getInstructionTestCaseAPI from './api/bot/instruction/getTestCase.js';
import attachScreenshotWhenFail from './utils/screenshot-when-fail.js';
import setWindowSize from './config/setWindowSize.js';
import { Reporter } from '@reportportal/agent-js-webdriverio'
import RPClient from '@reportportal/client-javascript'

const logger = getLogger('');
const isMasterProcess = !process.env.WDIO_WORKER_ID;

if (isMasterProcess) {
    logger.log(`CI Detection: isCI ${ci.isCI}, ci name ${ci.name}, isPR ${ci.isPR}`);
}

// In some jenkins, isCI is false but ci.name equals to Jenkins.
const spectreProjectName = ci.isCI || ci.name ? (ci.isPR ? 'WDIO_CI_PreMerge' : 'WDIO_CI') : 'WDIO_Dev';

export const DEFAULT_PARAMS = {
    credentials: {
        username: 'yaqzhu',
        password: '',
        webServerUsername: 'admin',
        webServerPassword: 'admin',
    },
    browser: {
        browserName: 'chrome',
    },
    loginType: 'default',
    isWeb: false,
    mstrWebUrl: '',
    /** collaboration db url, to do CURD operations on this db */
    dbUrl: '',
    instructionTestCases: [],
    platformBuildNo: '',
    iserver: '',
    project: 'MicroStrategy Tutorial',
    disableScreenshotAssertion: false,
    mstrWebLibraryUrl: '',
    isContainerEnv: false,
};

const isObject = (obj: unknown): obj is Record<string, unknown> => {
    if (typeof obj === 'object' && obj !== null) {
        return true;
    } else {
        return false;
    }
};

const yargsInstance = yargs();
const argv = await yargsInstance
    .parserConfiguration({ 'strip-dashed': true, 'strip-aliased': true })
    .version(false)
    .wrap(yargsInstance.terminalWidth() - 10)
    // use `npx wdio run ./wdio.conf.ts -h` to see help info
    .options({
        baseUrl: {
            describe: 'WDIO base url',
            demandOption: true,
        },
        specKind: {
            describe: 'What kind of e2e you want to run',
            choices: ['regression', 'web_regression', 'demo', 'infra-test', 'regression-hq', 'performance', 'pre-checkin', 'pre-checkin-beta'],
            default: 'regression',
        },

        // Pick test cases or spec files to run.
        featureList: {
            describe: 'Run by feature list, such as "Favorites,Bookmark"',
            type: 'string',
        },
        tcList: {
            describe: 'Run by TC list, such as "TC31543,TC73329"',
            type: 'string',
        },
        xml: {
            describe: 'Run by xml config, such as "specs/regression/config/test.config.xml"',
            type: 'string',
            normalize: true,
        },
        glob: {
            describe: 'Run by specFiles of glob pattern, such as "specs/demo/*/*.spec.js"',
            type: 'string',
            // glob pattern always uses "/", even on Windows
        },

        // For custom parameters
        params: {
            describe: 'You can specify custom params such as --params.xx.yy',
        },
        'spectre.enable': {
            type: 'boolean',
            default: true,
        },
        'spectre.url': {
            type: 'string',
            default: 'http://10.23.33.4:3000',
        },
        'spectre.projectName': {
            type: 'string',
            default: spectreProjectName,
        },
        'spectre.enableDiff': {
            describe: 'whether to enable image comparison',
            type: 'boolean',
            default: true,
        },
        'spectre.tolerance': {
            describe: 'diff tolerance',
            type: 'number',
            default: 0.1,
        },
        'byTC.inputFilePath': {
            describe: 'byTC service inputFilePath parameter',
            type: 'string',
        },
        'byTC.outputFilePath': {
            describe: 'byTC service outputFilePath parameter',
            type: 'string',
        },
        'save2DB.buildNumber': {
            describe: 'Web client buildNumber',
            type: 'string',
            default: '',
        },
        'save2DB.serverName': {
            describe: 'Machine name installing platform',
            type: 'string',
            default: '',
        },
        'save2DB.testSuite': {
            describe: 'Same to jobName, should be the xxx.config.xml file name',
            type: 'string',
            default: '',
        },
        'save2DB.product': {
            describe: 'Product under test',
            type: 'string',
            default: '',
        },
        'save2DB.owner': {
            describe: 'Feature owner, should be aligned to owner in CT.Auto',
            type: 'string',
            default: '',
        },
        'save2DB.team': {
            describe: 'Scrum team in rally project',
            type: 'string',
            default: '',
        },
        'save2DB.postExecutionResults': {
            type: 'string',
            default: '',
            describe: 'The code to post results to DB',
        },
        'save2DB.enableTeamsMessage': {
            type: 'boolean',
            default: false,
            describe: 'Post automation results by teams notification',
        },
        'save2DB.buildUrl': {
            describe: 'Build url of the automation job',
            type: 'string',
            default: 'http://tec-l-1081462.labs.microstrategy.com:8080/',
        },
        'save2DB.ciTag': {
            describe: 'APPLICATION_VERSION environment variable of premerge ci job',
            type: 'string',
            default: '',
        },
        'save2RP.rpKEY': {
            describe: 'API KEY for reporting portal',
            type: 'string',
            default: '',
        },
        'save2RP.rpEndpoint': {
            describe: 'Endpoint for reporting portal',
            type: 'string',
            default: '',
        },
        'save2RP.rpProject': {
            describe: 'Project for reporting portal',
            type: 'string',
            default: '',
        },
        'save2RP.rpLaunch': {
            describe: 'Launch name for reporting portal',
            type: 'string',
            default: '',
        },
        'save2RP.rpBuild': {
            describe: 'Build name for reporting portal',
            type: 'string',
            default: '',
        },
        'save2RP.rpMode': {
            describe: 'Mode for reporting portal',
            type: 'string',
            default: 'DEFAULT',
        },
        addsIn: {
            describe: 'Microsoft Office adds-in, e.g.MSTRPowerPoint/1.0 or MSTRExcel/1.0',
            type: 'string',
            default: '',
        },
        'customapp.theme': {
            describe: 'color theme to be used in custom app when re-using existing test scripts',
            type: 'string',
            default: '',
        },
        'enableChromeUserDataDir': {
            describe: 'Enable Chrome user data directory isolation',
            type: 'boolean',
            default: false,
        },
    })
    .group(['featureList', 'tcList', 'xml', 'glob'], 'Options to specify specFiles to run')
    .parse(process.argv.slice(2));

const specKind = argv.specKind;
const specFiles = pickSpecFilesAndTestcases(argv, specKind);

const params = deepmerge(DEFAULT_PARAMS, argv.params || {});
// make it typescript-safe
if (!isObject(argv.spectre) || !isObject(argv.save2DB) || (argv.byTC !== undefined && !isObject(argv.byTC))) {
    throw new Error('Invalid params object');
}

// Handle environment variables
const { HEADLESS, MAX_INSTANCES, RETRY, SKIP_VERSION_RETRIEVAL, ENABLE_TEST_THIRD_PARTY_COOKIE_PHASEOUT, FOR_IOS } = process.env;
const headlessOptions = HEADLESS ? ['headless', 'disable-gpu', 'window-size=1200,800'] : [];
const specFileRetries = parseInt(RETRY || '0', 10);
const browserName = params.browser.browserName || DEFAULT_PARAMS.browser.browserName;
const isSafari = browserName.toLowerCase() === 'safari';
const isChrome = browserName.toLowerCase() === 'chrome';
const maxInstances = isSafari ? 1 : parseInt(MAX_INSTANCES || '1', 10);
const skipVersionRetrieval = SKIP_VERSION_RETRIEVAL === '1' || SKIP_VERSION_RETRIEVAL === 'true';
const enable_test_third_party_cookie_phaseout = ENABLE_TEST_THIRD_PARTY_COOKIE_PHASEOUT
    ? ['test-third-party-cookie-phaseout']
    : [];
const isWeb = (params.isWeb !== null && params.isWeb !== undefined && params.isWeb === 'true') ? true : false;
const isColorTheme = argv.customapp && isObject(argv.customapp) && argv.customapp.theme ? true : false;

// Handle file system
const CURRENT_VERSION_FILE = path.resolve(process.cwd(), 'CurrentVersion.txt');
const CHROME_DRIVER_PORT = isMasterProcess ? await getAvailablePort() : null;

const rpConfig = {
    apiKey: argv.save2RP.rpKEY,
    endpoint: argv.save2RP.rpEndpoint,
    project: argv.save2RP.rpProject,
    launch: argv.save2RP.rpLaunch,
    mode: argv.save2RP.rpMode,
    attributes: [
        { key: 'build_number', value: argv.save2RP.rpBuild || 'unknown' },
        { key: 'branch', value: argv.branch || 'unknown' },
    ],
};

// In Auto_CI, Edge/Edge Driver Version: 89.0.774.63
// const edgeAppLocation = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
// const edgeDriverLocation = 'C:\\Users\\admin\\Downloads\\edgedriver_win64\\msedgedriver.exe';

// Same CLI options take priority over this config object, such --waitforTimeout --baseUrl
export const config: WebdriverIO.Config = {
    runner: 'local', // local means run tests in nodejs environment, aka e2e modes
    specs: specFiles || [],
    suites: {
        // not recommended to use suites in the current implementation
        // since it is a raw concept in wdio and thus not involves specKind concept
        infra: ['specs/infra-test/specFolder/b.spec.js'],
    },
    maxInstances: maxInstances,
    capabilities: [
        {
            browserName: browserName,
            unhandledPromptBehavior: 'ignore', //left browser popup for user to handle
            acceptInsecureCerts: true,
            'goog:chromeOptions': {
                // more on this site: https://sites.google.com/chromium.org/driver/capabilities
                args: [
                    ...headlessOptions,
                    ...(argv.addsIn ? [`--user-agent=${argv.addsIn}`] : []),
                    ...(FOR_IOS ? ['--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15 DossierMobile'] : []),
                    ...enable_test_third_party_cookie_phaseout,
                    '--unsafely-treat-insecure-origin-as-secure=http://batcave.labs.microstrategy.com:8081,http://dexters.labs.microstrategy.com:8081,http://10.23.33.78:8080/',
                    '--disable-search-engine-choice-screen',
                    ...(argv.enableChromeUserDataDir ? [`--user-data-dir=/tmp/chrome-user-data-${process.pid}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`] : [])
                ],
                prefs: {
                    'intl.accept_languages': argv.params && argv.params.locale ? argv.params.locale : '',
                    // Automatically accept notifications from collaboration service
                    'profile.managed_default_content_settings.notifications': 1,
                    // Grant clipboard permissions automatically
                    'profile.content_settings.exceptions.clipboard': {
                        '*': { setting: 1 }, // 1 means 'allow'
                    },
                    download: {
                        prompt_for_download: false,
                        directory_upgrade: true,
                        default_directory: consts.downloadDirectory,
                    },
                },
            }

        },
    ],

    // Level of logging verbosity: silent| trace | debug | info | warn | error
    logLevel: 'error',
    logLevels: {
        // webdriver: 'info',
        'service/spectre': process.env.debug ? 'debug' : 'info',
        'service/by-tc': process.env.debug ? 'debug' : 'error',
    },

    baseUrl: '', // pass in via command line
    waitforTimeout: 5 * 1000, // Default timeout for all waitFor* commands.

    connectionRetryTimeout: 2 * 60 * 1000,
    agent: {
        // US515069, some driver don't like many parallel requests
        http: new http.Agent({ keepAlive: true, maxSockets: 10 }),
        https: new https.Agent({ keepAlive: true, maxSockets: 10 }),
    },

    specFileRetries,
    bail: 0, // don't bail; run all tests

    services: [
        ...(isChrome
            ? [
                  [
                      'chromedriver',
                      {
                        port: CHROME_DRIVER_PORT,
                      },
                  ] as Services.ServiceEntry,
              ]
            : []),
        ...(isSafari
            ? [
                  [
                      'safaridriver',
                      {
                          outputDir: './logs',
                          logFileName: 'wdio-safaridriver.log',
                      },
                  ] as Services.ServiceEntry,
              ]
            : []),
        [ByTcService, argv.byTC || {}],
        [SinceService, {}],
        [SpectreService, isColorTheme ? Object.assign(argv.spectre, argv.customapp) : argv.spectre],
        [ResultSummaryService, { ...argv.save2DB, tcList: argv.tcList }],
        'coverage',
        'devtools',
        [
            'visual',
            {
                // Some options, see the docs for more
                baselineFolder: path.join(process.cwd(), './baselineImage/'),
                formatImageName: '{tag}-{logName}-{width}x{height}',
                screenshotPath: path.join(process.cwd(), './outputImage/'),
                savePerInstance: true,
                autoSaveBaseline: true,
                blockOutStatusBar: true,
                blockOutToolBar: true,
                clearRuntimeFolder: false,
                disableCSSAnimation: true,
                returnAllCompareData: true,
                logLevel: 'warn',
                isHybridApp: false,
            },
        ],
        ...(isColorTheme ? [[CustomAppControlService, argv.customapp]] : []),
    ],
    reporters: [
        [
            'video',
            {
                outputDir: REPORTS_FOR_VIDEO,
                saveAllVideos: false, // If true, also saves videos for successful test cases
                videoSlowdownMultiplier: 3, // Higher to get slower videos, lower for faster videos [Value 1-100]
            },
        ],
        [
            'allure',
            {
                outputDir: REPORTS_FOR_ALLUER,
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: true,
                disableMochaHooks: true,
            },
        ],
        // only add report portal reporter when rpProject is set
        ...(argv.save2RP.rpProject ? [[Reporter, rpConfig]] : []),
    ],

    framework: 'jasmine',
    jasmineOpts: {
        defaultTimeoutInterval: 30 * 60 * 1000,
    },

    // =====
    // Hooks for master process
    // including onPrepare, onComplete, onWorkerStart, onWorkerEnd
    // =====
    onPrepare: async function () {
        await fs.emptyDir(REPORTS_FOR_ALLUER);
        await fs.emptyDir(REPORTS_FOR_VIDEO);
        await fs.emptyDir(consts.downloadDirectory);
        if (argv.save2RP.rpProject) {
            try {
                const client = new RPClient(rpConfig);
                const response = await client.startLaunch({
                    name: rpConfig.launch,
                    attributes: rpConfig.attributes,
                    mode: rpConfig.mode,
                }).promise;
                const launchId = response.id;
                logger.info(`launch id is ${launchId}`);
                // The Launch ID can be set to the environment variable right here
                process.env.RP_LAUNCH_ID = launchId;
            } catch (err) {
                logger.error(`report portal failed ${err.message}`);
            }
        }
    },

    onComplete: async () => {
        if (argv.save2RP.rpProject) {
            const finishLaunch = async () => {
                const client = new RPClient(rpConfig);
                const launchTempId = client.startLaunch({ id: process.env.RP_LAUNCH_ID }).tempId;
                await client.finishLaunch(launchTempId, {}).promise;
            }
            try {
                await finishLaunch();
            } catch (err) {
                logger.error(`report portal failed ${err.message}`);
            }
        }
    },

    // =====
    // Hooks for worker process
    // including beforeSession, before, after, afterSession
    // =====
    beforeSession: async function () {
        global.browsers = {
            // When we run wdio like `wdio run ./wdio.conf.ts --params.credentials.username=abc`
            // We can access this variable in specFile like `browsers.params.credentials.username`
            params: params,
            pageObj1: pageBuilder(),
        };
        if (argv.isInstructionTest) {
            logger.log('Instruction test is running.Load testCase');
            browsers.params.instructionTestCases = await getInstructionTestCaseAPI();
            browsers.params.platformBuildNo = argv['save2DB']['buildNumber'];
        }
    },
    before: async function () {
        // Add assistant log for better understanding
        const jasmineEnv = jasmine.getEnv();
        jasmineEnv.addReporter({
            suiteStarted(suiteInfo) {
                logger.gray(`👉 ${suiteInfo.description}`);
            },
            specStarted(tc) {
                logger.gray(`👉👇 ${tc.description}`);
            },
            specDone(tc) {
                if (tc.status === 'excluded' || tc.status === 'pending') {
                    logger.gray(`👉🚫 ${tc.description}`);
                } else if (tc.status === 'failed') {
                    logger.gray(`👉❌ ${tc.description}`);
                } else if (tc.status === 'passed') {
                    logger.gray(`👉✅ ${tc.description}`);
                }
            },
        });

        // Get Library version info
        if (specKind !== 'performance' && !isWeb) {
            if (isSafari || skipVersionRetrieval) {
                global.buildVersion = '0'; // safari is not able to login with basic authenticaiton
            } else if (browsers.params.loginType.toLowerCase() !== 'default') {
                global.buildVersion = '1.0';
            } else if (browsers.params.loginType.toLowerCase() === 'default') {
                // Get Library version info
                global.buildVersion = await browsers.pageObj1.loginPage.getLibraryVersion(
                    browser.options.baseUrl,
                    browsers.params.loginType.toLowerCase()
                );
            }
            logger.log('Library version is: ' + chalk.blue(global.buildVersion));
            fs.writeFileSync(CURRENT_VERSION_FILE, global.buildVersion);
            // set window size with defalt value
            await setWindowSize({width: 1200, height: 800});

        }
        if (isWeb) {
            await setWindowSize({width: 1600, height: 900});
        }

    },
    after: async function () {
        if (
            browsers.params.loginType.toLowerCase() !== 'default' &&
            !browsers.params.loginType.toLowerCase().includes('saas') &&
            !skipVersionRetrieval &&
            !isWeb
        ) {
            // Get Library version info
            global.buildVersion = await browsers.pageObj1.loginPage.getLibraryVersion(
                browser.options.baseUrl,
                browsers.params.loginType.toLowerCase()
            );
            logger.log('Library version is: ' + chalk.blue(global.buildVersion));
            fs.writeFileSync(CURRENT_VERSION_FILE, global.buildVersion);
        }
    },

    // =====
    // Hooks for Jasmine framework execution inside the worker process
    // including beforeCommand, afterCommand, beforeHook, afterHook, beforeSuite, befo1est, afterTest, afterSuite
    // =====
    beforeSuite: async function (suite) {
        // Don't retry executeAsync command
        await browser.setTimeout({ script: 1000000 * 1000 });
        await browser.url(browser.options.baseUrl as string);
        if (browsers.params.loginType.toLowerCase() === 'default' && !isWeb) {
            await browsers.pageObj1.loginPage.waitForLoginView();
        }
        // disable image compare result for RWD in regression CI
        if ((suite.file.includes('selector') || suite.file.includes('document')) && argv.spectre.url === 'http://10.23.38.50:3000') {
            browsers.params.disableScreenshotAssertion = true;

        }


    },
    beforeTest: async function () {
        // if ((await browser.getUrl()) !== `${browser.options.baseUrl}app`) {
        //     await browser.url(browser.options.baseUrl);
        // }
    },
    afterSuite: async function () {
        if ((await browsers.pageObj1.userAccount.getUserAccount().isDisplayed()) && !isWeb) {
            await browsers.pageObj1.userAccount.openUserAccountMenu();
            await browsers.pageObj1.userAccount.logout();
        }
        if (isWeb && specKind !== 'performance') {
            if (browsers.params.loginType.toLowerCase() === 'custom') {
                await browser.deleteAllCookies();
            } else {
                await browsers.pageObj1.webLoginPage.forceLogout();
            }
        }
    },
    afterTest: async function (_test, _context, result) {
        if (result.error) {
            await attachScreenshotWhenFail(result.error);
        }
    },

    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true,
        },
    },
};

function pickSpecFilesAndTestcases({ featureList, tcList, xml, glob }, specKind: string): string[] | null {
    // This environment variable is setup by wdio
    // See https://webdriver.io/docs/api/environment/#wdio_worker_id
    // It only makes sense to specify specs in the master process
    if (!isMasterProcess) return null;

    const inputJSON = selectTc(
        { featureList, tcList, xml },
        {
            // glob pattern always uses "/", even on Windows
            resolveBaseDir: `specs/${specKind}`,
        }
    );

    fs.ensureFileSync('.by-tc/input.json');
    // run by test case level
    if (inputJSON) {
        fs.writeJSONSync('.by-tc/input.json', inputJSON, { spaces: 2 });
        // console.log(JSON.stringify(inputJSON, null, 2));
        return Object.keys(inputJSON);
    } else {
        // run by spec file level, including --spec, --glob, --suite
        fs.writeFileSync('.by-tc/input.json', '');
        return glob ? [glob] : null;
    }
}
